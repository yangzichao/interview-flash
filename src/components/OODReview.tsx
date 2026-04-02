import { useState, useEffect } from 'react'
import { api, type OODProblem, type Review } from '../lib/api'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'

export default function OODReview({ item, onBack }: { item: OODProblem; onBack: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('ood', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try { setResult(await api.submitReview('ood', item.id, answer)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const reset = () => { setAnswer(''); setResult(null) }
  const diffColor = item.difficulty === 'Easy' ? 'text-emerald-400' : item.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <span className={`text-sm ${diffColor}`}>{item.difficulty}</span>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 problem-content" dangerouslySetInnerHTML={{ __html: item.requirements }} />

      {!result ? (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Describe your class design, relationships, and patterns</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="e.g. I would create a base class Vehicle with subclasses Car, Truck. A ParkingLot has Levels, each has Spots..."
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
