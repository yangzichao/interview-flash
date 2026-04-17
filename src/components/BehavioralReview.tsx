import { useState, useEffect } from 'react'
import { api, getErrorMessage, type BehavioralQuestion, type Review } from '../lib/api'
import { sanitizeHtml } from '../lib/ui'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'
import ProblemNotes from './ProblemNotes'

export default function BehavioralReview({ item, onBack }: { item: BehavioralQuestion; onBack: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [showGuidance, setShowGuidance] = useState(false)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('behavioral', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try { setResult(await api.submitReview('behavioral', item.id, answer)) }
    catch (e) { alert(getErrorMessage(e)) }
    finally { setSubmitting(false) }
  }

  const reset = () => { setAnswer(''); setResult(null); setShowGuidance(false) }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          {item.framework && <span className="text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded">{item.framework}</span>}
        </div>
        {item.category && <span className="text-xs text-zinc-500">{item.category}</span>}
      </div>

      {/* Show the question prompt */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 problem-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.prompt) }} />

      {/* Guidance toggle */}
      {item.guidance && (
        <>
          <button onClick={() => setShowGuidance(!showGuidance)} className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
            {showGuidance ? 'Hide' : 'Show'} interviewer guidance
          </button>
          {showGuidance && <div className="problem-content bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 mb-6" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.guidance) }} />}
        </>
      )}

      <ProblemNotes itemType="behavioral" itemId={item.id} />

      {!result ? (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Your answer (use {item.framework || 'STAR'} method: Situation, Task, Action, Result)</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="e.g. In my previous role at X, we faced a situation where..."
            rows={10} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-600">{answer.length > 0 ? `${answer.split(/\s+/).filter(Boolean).length} words` : ''}</span>
            <button onClick={submit} disabled={!answer.trim() || submitting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              {submitting ? 'Evaluating...' : 'Submit'}
            </button>
          </div>
        </div>
      ) : (
        <EvaluationResult result={result} onReset={reset} onBack={onBack} />
      )}

      <ReviewHistory reviews={history} />
    </div>
  )
}
