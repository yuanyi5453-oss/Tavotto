import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { useRenderStore } from '@/store/renderStore'
import type { Manifest } from '@/lib/api'
import type { AppsBridge } from './appsBridge'
import { seedSession, type OpenFigureResult } from './session'

vi.mock('@/hooks/useEngineSync', () => ({ useEngineSync: () => {} }))
vi.mock('@/canvas/CanvasStage', () => ({ CanvasStage: () => null }))
vi.mock('@/components/inspector/ElementInspector', () => ({ ElementInspector: () => null }))

import { McpApp } from './McpApp'

let root: Root | undefined
let host: HTMLDivElement | undefined

afterEach(async () => {
  await act(async () => root?.unmount())
  host?.remove()
  useRenderStore.getState().clear()
})

async function mount(blocked = false) {
  const open = {
    ok: true, session_id: 'svg-session', project: '/figures', stem: 'FigM', script: 'figm.py',
    manifest: { stem: 'FigM', size_mm: [80, 60], elements: [] } as unknown as Manifest,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="80pt" height="60pt"/>',
    patch_hash: 'sha256:0', render_revision: 1,
    profile: { profile_id: 'lab-publication-v1', profile_version: '1.0.0' },
    preflight: { counts: {}, errors: [], warnings: [], suggestions: [],
      not_verifiable: blocked ? [{ id: 'test', code: 'test', message: 'Needs confirmation', gids: [], severity: 'not_verifiable' }] : [] },
  } as unknown as OpenFigureResult
  const { panelId } = seedSession(open)
  const bridge = {
    callTool: vi.fn(async () => ({ content: [], structuredContent: { ok: true, files: [{ path: 'FigM.svg' }] } })),
    sendMessage: vi.fn(), notifySize: vi.fn(),
  }
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await act(async () => root!.render(<TooltipProvider><McpApp bridge={bridge as unknown as AppsBridge} open={open} panelId={panelId}/></TooltipProvider>))
  const button = host.querySelector<HTMLButtonElement>('[data-mcp-export="svg"]')!
  return { button, bridge }
}

describe('MCP SVG 导出入口', () => {
  it('通过既有 MCP 工具导出当前会话的 SVG', async () => {
    const { button, bridge } = await mount()
    expect(button.disabled).toBe(false)
    await act(async () => button.click())
    expect(bridge.callTool).toHaveBeenCalledWith('tavotto_export', {
      session_id: 'svg-session', formats: ['svg'], explicit_confirm: false,
    })
  })

  it('预检未明确确认时不允许 SVG 导出', async () => {
    const { button, bridge } = await mount(true)
    expect(button.disabled).toBe(true)
    await act(async () => button.click())
    expect(bridge.callTool).not.toHaveBeenCalled()
  })
})
