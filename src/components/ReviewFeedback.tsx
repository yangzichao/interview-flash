import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Review } from '../lib/api'

const scoreColors = ['', 'text-red-400', 'text-orange-400', 'text-amber-400', 'text-lime-400', 'text-emerald-400']
const scoreLabels = ['', 'No recall', 'Weak', 'Partial', 'Strong', 'Perfect']

const sectionColors: Record<string, string> = {
  'Verdict': 'border-emerald-500/30',
  'Thought Process': 'border-blue-500/30',
  'Tricky Parts': 'border-amber-500/30',
  'Suggestions': 'border-violet-500/30',
  'Follow-up Questions': 'border-cyan-500/30',
  'STAR Analysis': 'border-blue-500/30',
  'Requirements': 'border-emerald-500/30',
  'Capacity Estimation': 'border-sky-500/30',
  'API Design': 'border-indigo-500/30',
  'Data Model': 'border-purple-500/30',
  'Architecture': 'border-blue-500/30',
  'Trade-offs & Deep Dives': 'border-amber-500/30',
  'Overall Suggestions': 'border-violet-500/30',
}

const sectionHeaderColors: Record<string, string> = {
  'Verdict': 'text-emerald-400',
  'Thought Process': 'text-blue-400',
  'Tricky Parts': 'text-amber-400',
  'Suggestions': 'text-violet-400',
  'Follow-up Questions': 'text-cyan-400',
  'STAR Analysis': 'text-blue-400',
  'Requirements': 'text-emerald-400',
  'Capacity Estimation': 'text-sky-400',
  'API Design': 'text-indigo-400',
  'Data Model': 'text-purple-400',
  'Architecture': 'text-blue-400',
  'Trade-offs & Deep Dives': 'text-amber-400',
  'Overall Suggestions': 'text-violet-400',
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

export function SectionCards({ evaluation }: { evaluation: string }) {
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

export function ScoreBanner({ score }: { score: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center gap-4">
      <span className={`text-4xl font-bold ${scoreColors[score]}`}>{score}/5</span>
      <div>
        <span className={`text-lg font-semibold ${scoreColors[score]}`}>{scoreLabels[score]}</span>
        <p className="text-xs text-zinc-500 mt-0.5">Recall score</p>
      </div>
    </div>
  )
}

export function EvaluationResult({ result, onReset, onBack }: { result: Review; onReset: () => void; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <ScoreBanner score={result.score} />
      <SectionCards evaluation={result.evaluation} />
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Your Answer</h4>
        <p className="text-sm text-zinc-400 whitespace-pre-wrap">{result.user_answer}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onReset} className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Try Again
        </button>
        <button onClick={onBack} className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Back
        </button>
      </div>
    </div>
  )
}

export function HistoryEntry({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`font-medium text-sm ${scoreColors[review.score]}`}>{review.score}/5</span>
          <span className={`text-xs ${scoreColors[review.score]}`}>{scoreLabels[review.score]}</span>
          <span className="text-xs text-zinc-600">{new Date(review.reviewed_at).toLocaleString()}</span>
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

export function ReviewHistory({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null
  return (
    <div className="mt-10 border-t border-zinc-800 pt-6">
      <h3 className="text-sm font-semibold text-zinc-400 mb-3">
        Review History <span className="text-zinc-600 font-normal">({reviews.length})</span>
      </h3>
      <div className="space-y-3">
        {reviews.map((r) => <HistoryEntry key={r.id} review={r} />)}
      </div>
    </div>
  )
}
