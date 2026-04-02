import { useState } from 'react'
import ProblemList from './components/ProblemList'
import ReviewSession from './components/ReviewSession'
import type { Problem, ProblemType } from './lib/api'

type View = { type: 'list' } | { type: 'review'; problem: Problem }

const tabs: { key: ProblemType; label: string; icon: string }[] = [
  { key: 'algorithm', label: 'Algorithms', icon: '{}' },
  { key: 'behavioral', label: 'Behavioral', icon: '💬' },
  { key: 'ood', label: 'OOD', icon: '🧱' },
  { key: 'system-design', label: 'System Design', icon: '🏗' },
]

export default function App() {
  const [view, setView] = useState<View>({ type: 'list' })
  const [activeTab, setActiveTab] = useState<ProblemType>('algorithm')

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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

      {/* Tabs — only show on list view */}
      {view.type === 'list' && (
        <div className="border-b border-zinc-800">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view.type === 'list' ? (
          <ProblemList
            problemType={activeTab}
            onReview={(p) => setView({ type: 'review', problem: p })}
          />
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
