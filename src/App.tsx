import { useState } from 'react'
import AlgorithmList from './components/AlgorithmList'
import BehavioralList from './components/BehavioralList'
import OODList from './components/OODList'
import SystemDesignList from './components/SystemDesignList'
import AlgoReview from './components/AlgoReview'
import BehavioralReview from './components/BehavioralReview'
import OODReview from './components/OODReview'
import SystemDesignReview from './components/SystemDesignReview'
import SettingsPage from './components/SettingsPage'
import type { Algorithm, BehavioralQuestion, OODProblem, SystemDesignProblem } from './lib/api'

type Tab = 'algorithm' | 'behavioral' | 'ood' | 'system-design' | 'settings'

type View =
  | { type: 'list' }
  | { type: 'algo-review'; item: Algorithm }
  | { type: 'behavioral-review'; item: BehavioralQuestion }
  | { type: 'ood-review'; item: OODProblem }
  | { type: 'sd-review'; item: SystemDesignProblem }

const tabs: { key: Tab; label: string }[] = [
  { key: 'algorithm', label: 'Algorithms' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'ood', label: 'OOD' },
  { key: 'system-design', label: 'System Design' },
  { key: 'settings', label: 'Settings' },
]

export default function App() {
  const [view, setView] = useState<View>({ type: 'list' })
  const [activeTab, setActiveTab] = useState<Tab>('algorithm')

  const goBack = () => setView({ type: 'list' })

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-tight cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={goBack}
          >
            ⚡ Interview Flash
          </h1>
          {view.type !== 'list' && (
            <button onClick={goBack} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              ← Back
            </button>
          )}
        </div>
      </header>

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
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8">
        {view.type === 'list' && activeTab === 'algorithm' && (
          <AlgorithmList onReview={(item) => setView({ type: 'algo-review', item })} />
        )}
        {view.type === 'list' && activeTab === 'behavioral' && (
          <BehavioralList onReview={(item) => setView({ type: 'behavioral-review', item })} />
        )}
        {view.type === 'list' && activeTab === 'ood' && (
          <OODList onReview={(item) => setView({ type: 'ood-review', item })} />
        )}
        {view.type === 'list' && activeTab === 'system-design' && (
          <SystemDesignList onReview={(item) => setView({ type: 'sd-review', item })} />
        )}
        {view.type === 'list' && activeTab === 'settings' && <SettingsPage />}
        {view.type === 'algo-review' && <AlgoReview item={view.item} onBack={goBack} />}
        {view.type === 'behavioral-review' && <BehavioralReview item={view.item} onBack={goBack} />}
        {view.type === 'ood-review' && <OODReview item={view.item} onBack={goBack} />}
        {view.type === 'sd-review' && <SystemDesignReview item={view.item} onBack={goBack} />}
      </main>
    </div>
  )
}
