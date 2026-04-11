import { useState, useEffect } from 'react'
import { api, type SystemDesignProblem, type Review } from '../lib/api'
import { DIFFICULTY_COLORS, sanitizeHtml } from '../lib/ui'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'
import QuickMode from './system-design/QuickMode'
import GuidedMode from './system-design/GuidedMode'
import MockInterviewMode from './system-design/MockInterviewMode'

type Mode = 'choose' | 'guided' | 'quick' | 'mock'

export default function SystemDesignReview({ item, onBack }: { item: SystemDesignProblem; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('choose')
  const [result, setResult] = useState<Review | null>(null)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('system_design', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const diffColor = DIFFICULTY_COLORS[item.difficulty] || 'text-zinc-400'
  const reset = () => { setMode('choose'); setResult(null) }

  if (result) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">{item.title}</h2>
        <EvaluationResult result={result} onReset={reset} onBack={onBack} />
        <ReviewHistory reviews={history} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <span className={`text-sm ${diffColor}`}>{item.difficulty}</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 problem-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.problem_statement) }} />

      {mode === 'choose' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button onClick={() => setMode('guided')}
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-lg p-5 text-left transition-colors">
            <div className="text-emerald-400 font-semibold mb-1">Guided Practice</div>
            <p className="text-xs text-zinc-400">Step-by-step with per-step feedback. Get coaching after each step before moving on.</p>
          </button>
          <button onClick={() => setMode('mock')}
            className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-lg p-5 text-left transition-colors">
            <div className="text-blue-400 font-semibold mb-1">Mock Interview</div>
            <p className="text-xs text-zinc-400">Conversational back-and-forth with an AI interviewer. Like a real interview.</p>
          </button>
          <button onClick={() => setMode('quick')}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 text-left transition-colors">
            <div className="text-zinc-300 font-semibold mb-1">Quick Review</div>
            <p className="text-xs text-zinc-400">Single text area — describe your full design and get scored.</p>
          </button>
        </div>
      )}

      {mode === 'quick' && <QuickMode item={item} onResult={setResult} onChangeMode={() => setMode('choose')} />}
      {mode === 'guided' && <GuidedMode item={item} onResult={setResult} onChangeMode={() => setMode('choose')} />}
      {mode === 'mock' && <MockInterviewMode item={item} onResult={setResult} onChangeMode={() => setMode('choose')} />}

      <ReviewHistory reviews={history} />
    </div>
  )
}
