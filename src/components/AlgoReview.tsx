import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, getErrorMessage, type Algorithm, type Review } from '../lib/api'
import { DIFFICULTY_COLORS, parseJson, sanitizeHtml } from '../lib/ui'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'
import ProblemNotes from './ProblemNotes'

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'c++', 'c', 'go', 'rust', 'swift', 'kotlin', 'c#', 'ruby', 'scala',
]

export default function AlgoReview({ item, onBack }: { item: Algorithm; onBack: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [showDesc, setShowDesc] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [history, setHistory] = useState<Review[]>([])
  const [language, setLanguage] = useState('python')

  useEffect(() => { api.getReviewHistory('algorithm', item.id).then(setHistory).catch(() => {}) }, [item.id, result])
  useEffect(() => {
    api.getSettings().then(s => {
      if (s.preferred_language) setLanguage(s.preferred_language)
    }).catch(() => {})
  }, [])

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try {
      // Save language preference alongside review submission
      await Promise.all([
        api.updateSettings({ preferred_language: language }).catch(() => {}),
        api.submitReview('algorithm', item.id, answer).then(setResult),
      ])
    } catch (e) { alert(getErrorMessage(e)) }
    finally { setSubmitting(false) }
  }

  const reset = () => { setAnswer(''); setResult(null); setShowDesc(false); setShowSolution(false) }

  const topics = parseJson(item.topics)
  const diffColor = DIFFICULTY_COLORS[item.difficulty] || 'text-zinc-400'

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

      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setShowDesc(!showDesc)} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          {showDesc ? 'Hide' : 'Show'} problem description
        </button>
        {item.solution && (
          <button onClick={() => setShowSolution(!showSolution)} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            {showSolution ? 'Hide' : 'Show'} reference solution
          </button>
        )}
      </div>

      {showDesc && <div className="problem-content bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }} />}

      {showSolution && item.solution && (
        <div className="bg-zinc-900 border border-l-2 border-amber-500/30 border-zinc-800 rounded-lg p-5 mb-4">
          <h4 className="text-xs text-amber-400 uppercase tracking-wider mb-2">Reference Solution</h4>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{item.solution}</ReactMarkdown>
          </div>
        </div>
      )}

      <ProblemNotes itemType="algorithm" itemId={item.id} />

      {!result ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-zinc-400">Describe your approach (natural language, pseudocode, anything)</label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-500">Language:</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
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
        <>
          <EvaluationResult result={result} onReset={reset} onBack={onBack} />
          {item.solution && (
            <div className="mt-4">
              <button onClick={() => setShowSolution(!showSolution)} className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                {showSolution ? 'Hide' : 'Show'} reference solution
              </button>
            </div>
          )}
        </>
      )}

      <ReviewHistory reviews={history} />
    </div>
  )
}
