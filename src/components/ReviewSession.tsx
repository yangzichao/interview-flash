import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, type Problem, type Review } from '../lib/api'

const scoreColors = ['', 'text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 'text-emerald-400']
const scoreLabels = ['', 'No recall', 'Weak', 'Partial', 'Strong', 'Perfect']

const sectionIcons: Record<string, string> = {
  'Verdict': '!',
  'Thought Process': '?',
  'Tricky Parts': '!',
  'Suggestions': '>',
  'Follow-up Questions': '?',
}

const sectionColors: Record<string, string> = {
  'Verdict': 'border-emerald-500/30',
  'Thought Process': 'border-blue-500/30',
  'Tricky Parts': 'border-amber-500/30',
  'Suggestions': 'border-violet-500/30',
  'Follow-up Questions': 'border-cyan-500/30',
  'STAR Analysis': 'border-blue-500/30',
}

const sectionHeaderColors: Record<string, string> = {
  'Verdict': 'text-emerald-400',
  'Thought Process': 'text-blue-400',
  'Tricky Parts': 'text-amber-400',
  'Suggestions': 'text-violet-400',
  'Follow-up Questions': 'text-cyan-400',
  'STAR Analysis': 'text-blue-400',
}

function parseSections(evaluation: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = []
  const parts = evaluation.split(/^## /m).filter(Boolean)
  for (const part of parts) {
    const newlineIdx = part.indexOf('\n')
    if (newlineIdx === -1) continue
    const title = part.slice(0, newlineIdx).trim()
    const content = part.slice(newlineIdx + 1).trim()
    if (content) sections.push({ title, content })
  }
  return sections
}

function EvaluationDisplay({ result, onReset, onBack }: { result: Review; onReset: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      {/* Score banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center gap-4">
        <span className={`text-4xl font-bold ${scoreColors[result.score]}`}>
          {result.score}/5
        </span>
        <div>
          <span className={`text-lg font-semibold ${scoreColors[result.score]}`}>
            {scoreLabels[result.score]}
          </span>
          <p className="text-xs text-zinc-500 mt-0.5">Recall score</p>
        </div>
      </div>

      {/* Feedback sections */}
      <SectionCards evaluation={result.evaluation} />

      {/* Your answer */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Your Answer</h4>
        <p className="text-sm text-zinc-400 whitespace-pre-wrap">{result.user_answer}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onBack}
          className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Back to Problems
        </button>
      </div>
    </div>
  )
}

function SectionCards({ evaluation }: { evaluation: string }) {
  const sections = parseSections(evaluation)

  if (sections.length === 0) {
    return (
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{evaluation}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={i} className={`bg-zinc-900 border-l-2 ${sectionColors[s.title] || 'border-zinc-700'} border border-zinc-800 rounded-lg p-4`}>
          <h3 className={`text-sm font-semibold mb-2 ${sectionHeaderColors[s.title] || 'text-zinc-300'}`}>
            {s.title}
          </h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{s.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  )
}

function HistoryEntry({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`font-medium text-sm ${scoreColors[review.score]}`}>
            {review.score}/5
          </span>
          <span className={`text-xs ${scoreColors[review.score]}`}>
            {scoreLabels[review.score]}
          </span>
          <span className="text-xs text-zinc-600">
            {new Date(review.reviewed_at).toLocaleString()}
          </span>
        </div>
        <span className="text-zinc-600 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
          <div>
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Your Answer</h4>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">{review.user_answer}</p>
          </div>
          <SectionCards evaluation={review.evaluation} />
        </div>
      )}
    </div>
  )
}

export default function ReviewSession({ problem, onBack }: { problem: Problem; onBack: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [showDescription, setShowDescription] = useState(false)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => {
    api.getReviewHistory(problem.id).then(setHistory).catch(() => {})
  }, [problem.id, result])

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try {
      const review = await api.submitReview(problem.id, answer)
      setResult(review)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setAnswer('')
    setResult(null)
    setShowDescription(false)
  }

  const topics: string[] = (() => {
    try { return JSON.parse(problem.topics) } catch { return [] }
  })()

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {problem.type === 'algorithm' && (
            <span className="text-zinc-500 text-sm">#{problem.leetcode_id}</span>
          )}
          <h2 className="text-xl font-bold">{problem.title}</h2>
          <span className={`text-sm ${
            problem.difficulty === 'Easy' ? 'text-emerald-400' :
            problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
          }`}>
            {problem.difficulty}
          </span>
          {problem.type !== 'algorithm' && (
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
              {problem.category}
            </span>
          )}
        </div>
        {topics.length > 0 && (
          <div className="flex gap-1.5 mb-4">
            {topics.map((t) => (
              <span key={t} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Toggle problem description */}
      <button
        onClick={() => setShowDescription(!showDescription)}
        className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 transition-colors"
      >
        {showDescription ? 'Hide' : 'Show'} problem description
      </button>

      {showDescription && (
        <div
          className="problem-content bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6"
          dangerouslySetInnerHTML={{ __html: problem.content }}
        />
      )}

      {!result ? (
        /* Answer input */
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            {problem.type === 'behavioral'
              ? 'Describe your answer (use STAR method: Situation, Task, Action, Result)'
              : problem.type === 'ood'
              ? 'Describe your class design, relationships, and patterns'
              : problem.type === 'system-design'
              ? 'Describe your architecture, components, and trade-offs'
              : 'Describe your approach (natural language, pseudocode, anything)'}
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              problem.type === 'behavioral'
                ? 'e.g. In my previous role at X, we had a situation where...'
                : problem.type === 'ood'
                ? 'e.g. I would create a base class Vehicle with subclasses Car, Truck. A ParkingLot has Levels, each has Spots...'
                : problem.type === 'system-design'
                ? 'e.g. Start with requirements: 100M users, read-heavy. Use a load balancer, stateless API servers, Redis cache...'
                : 'e.g. Use a hash map to store complements. For each number, check if target - num exists in the map...'
            }
            rows={8}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-600">
              {answer.length > 0 ? `${answer.split(/\s+/).filter(Boolean).length} words` : ''}
            </span>
            <button
              onClick={submit}
              disabled={!answer.trim() || submitting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? 'Evaluating...' : 'Submit for Evaluation'}
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation result */
        <EvaluationDisplay result={result} onReset={reset} onBack={onBack} />
      )}

      {/* Review history */}
      {history.length > 0 && (
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">
            Review History <span className="text-zinc-600 font-normal">({history.length})</span>
          </h3>
          <div className="space-y-3">
            {history.map((r) => (
              <HistoryEntry key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
