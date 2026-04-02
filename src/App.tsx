import { useState } from 'react'
import ProblemList from './components/ProblemList'
import ReviewSession from './components/ReviewSession'
import type { Problem } from './lib/api'

type View = { type: 'list' } | { type: 'review'; problem: Problem }

export default function App() {
  const [view, setView] = useState<View>({ type: 'list' })

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-tight cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={() => setView({ type: 'list' })}
          >
            ⚡ Interview Flash
          </h1>
          {view.type === 'review' && (
            <button
              onClick={() => setView({ type: 'list' })}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back to problems
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {view.type === 'list' ? (
          <ProblemList onReview={(p) => setView({ type: 'review', problem: p })} />
        ) : (
          <ReviewSession
            problem={view.problem}
            onBack={() => setView({ type: 'list' })}
          />
        )}
      </main>
    </div>
  )
}
