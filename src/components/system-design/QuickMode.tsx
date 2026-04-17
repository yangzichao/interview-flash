import { useState } from 'react'
import { api, getErrorMessage } from '../../lib/api'
import type { ModeProps } from './types'

export default function QuickMode({ item, onResult, onChangeMode, getElapsed }: ModeProps) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try { onResult(await api.submitReview('system_design', item.id, answer, undefined, getElapsed())) }
    catch (e) { alert(getErrorMessage(e)) }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-2">Describe your full system design</label>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Cover: requirements, architecture, database, scaling, trade-offs..."
        rows={12} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
      <div className="flex items-center justify-between mt-4">
        <button onClick={onChangeMode} className="text-sm text-zinc-500 hover:text-zinc-300">← Change mode</button>
        <button onClick={submit} disabled={!answer.trim() || submitting}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {submitting ? 'Evaluating...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
