import { useEffect, useState } from 'react'
import type { ItemType } from '../lib/api'
import { TARGET_SECONDS } from '../lib/ui'

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

export interface SessionTimerHandle {
  startAt: number
  running: boolean
  getElapsed: () => number
  stop: () => void
  restart: () => void
}

// Wall-clock timer. Starts on mount, stops on .stop(). No pause — mirrors
// real interview conditions. The per-second tick state lives inside
// SessionTimerDisplay so parents don't re-render every second.
export function useSessionTimer(): SessionTimerHandle {
  const [startAt, setStartAt] = useState(() => Date.now())
  const [running, setRunning] = useState(true)
  const getElapsed = () => Math.floor((Date.now() - startAt) / 1000)
  const stop = () => setRunning(false)
  const restart = () => { setStartAt(Date.now()); setRunning(true) }
  return { startAt, running, getElapsed, stop, restart }
}

export function SessionTimerDisplay({
  category,
  timer,
}: {
  category: ItemType
  timer: SessionTimerHandle
}) {
  const { startAt, running } = timer
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startAt) / 1000))

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startAt) / 1000))
    if (!running) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [running, startAt])

  const target = TARGET_SECONDS[category]
  const ratio = elapsed / target
  const { bg, fg, border } = !running
    ? { bg: 'bg-zinc-800/60', fg: 'text-zinc-400', border: 'border-zinc-700' }
    : ratio >= 1
      ? { bg: 'bg-red-500/10', fg: 'text-red-400', border: 'border-red-500/30' }
      : ratio >= 0.8
        ? { bg: 'bg-amber-500/10', fg: 'text-amber-400', border: 'border-amber-500/30' }
        : { bg: 'bg-emerald-500/10', fg: 'text-emerald-400', border: 'border-emerald-500/30' }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${bg} ${fg} ${border}`}
      title={`Target: ${formatDuration(target)}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${running ? 'bg-current animate-pulse' : 'bg-zinc-500'}`} />
      <span className="tabular-nums">{formatDuration(elapsed)}</span>
      <span className="text-zinc-500">/ {formatDuration(target)}</span>
    </div>
  )
}
