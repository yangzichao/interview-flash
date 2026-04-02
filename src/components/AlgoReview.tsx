import { useState, useEffect } from 'react'
import { api, type Algorithm, type Review } from '../lib/api'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'

export default function AlgoReview({ item, onBack }: { item: Algorithm; onBack: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [showDesc, setShowDesc] = useState(false)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('algorithm', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try { setResult(await api.submitReview('algorithm', item.id, answer)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const reset = () => { setAnswer(''); setResult(null); setShowDesc(false) }

  const topics: string[] = (() => { try { return JSON.parse(item.topics) } catch { return [] } })()
  const diffColor = item.difficulty === 'Easy' ? 'text-emerald-400' : item.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-zinc-500 text-sm">#{item.leetcode_id}</span>
          <h2 className="text-xl font-bold">{item.title}</h2>
          <span className={`text-sm ${diffColor}`}>{item.difficulty}</span>
        </div>
        {topics.length > 0 && (
          <div className="flex gap-1.5 mb-4">
            {topics.map(t => <span key={t} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{t}</span>)}
          </div>
        )}
      </div>

      <button onClick={() => setShowDesc(!showDesc)} className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 transition-colors">
        {showDesc ? 'Hide' : 'Show'} problem description
      </button>
      {showDesc && <div className="problem-content bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6" dangerouslySetInnerHTML={{ __html: item.content }} />}

      {!result ? (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Describe your approach (natural language, pseudocode, anything)</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="e.g. Use a hash map to store complements. For each number, check if target - num exists in the map..."
            rows={8} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
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
