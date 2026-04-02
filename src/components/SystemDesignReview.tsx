import { useState, useEffect } from 'react'
import { api, type SystemDesignProblem, type Review } from '../lib/api'
import { EvaluationResult, ReviewHistory } from './ReviewFeedback'

interface StepDef {
  key: string
  label: string
  prompt: string
  placeholder: string
  optional?: boolean
}

const steps: StepDef[] = [
  {
    key: 'requirements',
    label: 'Requirements Clarification',
    prompt: 'What functional and non-functional requirements would you clarify with the interviewer?',
    placeholder: 'e.g.\nFunctional: Users can create short URLs, redirect short→long, analytics...\nNon-functional: 100M URLs/month, <100ms redirect latency, 99.99% availability...',
  },
  {
    key: 'capacity',
    label: 'Capacity Estimation',
    prompt: 'Estimate the scale: QPS, storage, bandwidth. Show your math.',
    placeholder: 'e.g. 100M new URLs/month ≈ 40 writes/sec, 10:1 read ratio ≈ 400 reads/sec...',
    optional: true,
  },
  {
    key: 'api',
    label: 'API Design',
    prompt: 'Design the public API endpoints.',
    placeholder: 'e.g.\nPOST /shorten { longUrl } → { shortUrl }\nGET /{shortCode} → 301 redirect',
    optional: true,
  },
  {
    key: 'data_model',
    label: 'Data Model',
    prompt: 'Design the database schema. What storage do you need?',
    placeholder: 'e.g. Table urls: id (PK), short_code (unique index), long_url, created_at, user_id...\nUsing NoSQL for key-value lookups...',
    optional: true,
  },
  {
    key: 'architecture',
    label: 'High-Level Architecture',
    prompt: 'Describe the overall architecture. What components do you need and how do they interact?',
    placeholder: 'e.g. Load balancer → stateless API servers → Redis cache → database. Separate write and read paths...',
  },
  {
    key: 'deep_dives',
    label: 'Deep Dives',
    prompt: 'Pick 1-2 areas to dive deeper: caching, sharding, failure handling, consistency, etc.',
    placeholder: 'e.g. Caching: Use Redis with LRU eviction. Cache the top 20% of URLs (80/20 rule)...',
    optional: true,
  },
]

type Mode = 'choose' | 'guided' | 'quick'

export default function SystemDesignReview({ item, onBack }: { item: SystemDesignProblem; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('choose')
  const [currentStep, setCurrentStep] = useState(0)
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({})
  const [revealedReqs, setRevealedReqs] = useState(false)
  const [reqsData, setReqsData] = useState<{ functional_reqs: string[]; non_functional_reqs: string[] } | null>(null)
  const [quickAnswer, setQuickAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('system_design', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const diffColor = item.difficulty === 'Hard' ? 'text-red-400' : 'text-amber-400'

  const updateStep = (key: string, value: string) => {
    setStepAnswers(prev => ({ ...prev, [key]: value }))
  }

  const revealRequirements = async () => {
    try {
      const data = await api.getSystemDesignRequirements(item.id)
      setReqsData(data)
      setRevealedReqs(true)
    } catch {
      setRevealedReqs(true)
    }
  }

  const submitGuided = async () => {
    if (submitting) return
    setSubmitting(true)
    const summary = steps
      .filter(s => stepAnswers[s.key]?.trim())
      .map(s => `### ${s.label}\n${stepAnswers[s.key]}`)
      .join('\n\n')
    try {
      setResult(await api.submitReview('system_design', item.id, summary, stepAnswers))
    } catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const submitQuick = async () => {
    if (!quickAnswer.trim() || submitting) return
    setSubmitting(true)
    try { setResult(await api.submitReview('system_design', item.id, quickAnswer)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const reset = () => {
    setMode('choose'); setCurrentStep(0); setStepAnswers({}); setRevealedReqs(false)
    setReqsData(null); setQuickAnswer(''); setResult(null)
  }

  // Result view
  if (result) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">{item.title}</h2>
        <EvaluationResult result={result} onReset={reset} onBack={onBack} />
        <ReviewHistory reviews={history} />
      </div>
    )
  }

  const step = steps[currentStep]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <span className={`text-sm ${diffColor}`}>{item.difficulty}</span>
        </div>
      </div>

      {/* Problem statement — always visible */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 problem-content"
        dangerouslySetInnerHTML={{ __html: item.problem_statement }} />

      {/* Mode selection */}
      {mode === 'choose' && (
        <div className="flex gap-4 mb-6">
          <button onClick={() => setMode('guided')}
            className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-lg p-5 text-left transition-colors">
            <div className="text-emerald-400 font-semibold mb-1">Guided Practice</div>
            <p className="text-sm text-zinc-400">Step-by-step: requirements → capacity → API → data model → architecture → deep dives</p>
          </button>
          <button onClick={() => setMode('quick')}
            className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 text-left transition-colors">
            <div className="text-zinc-300 font-semibold mb-1">Quick Review</div>
            <p className="text-sm text-zinc-400">Single text area — describe your full design at once</p>
          </button>
        </div>
      )}

      {/* Quick mode */}
      {mode === 'quick' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Describe your full system design</label>
          <textarea value={quickAnswer} onChange={e => setQuickAnswer(e.target.value)}
            placeholder="Cover: requirements, architecture, database, scaling, trade-offs..."
            rows={12} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
          <div className="flex items-center justify-between mt-4">
            <button onClick={() => setMode('choose')} className="text-sm text-zinc-500 hover:text-zinc-300">← Back to mode selection</button>
            <button onClick={submitQuick} disabled={!quickAnswer.trim() || submitting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              {submitting ? 'Evaluating...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Guided mode */}
      {mode === 'guided' && (
        <div>
          {/* Step progress */}
          <div className="flex gap-1 mb-6">
            {steps.map((s, i) => (
              <button key={s.key} onClick={() => setCurrentStep(i)}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? 'bg-emerald-500' :
                  i < currentStep ? 'bg-emerald-500/40' :
                  stepAnswers[s.key]?.trim() ? 'bg-zinc-600' : 'bg-zinc-800'
                }`} />
            ))}
          </div>

          {/* Current step */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-zinc-500">Step {currentStep + 1}/{steps.length}</span>
              {step.optional && <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">Optional</span>}
            </div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">{step.label}</h3>
            <p className="text-sm text-zinc-400 mb-4">{step.prompt}</p>
          </div>

          <textarea
            value={stepAnswers[step.key] || ''}
            onChange={e => updateStep(step.key, e.target.value)}
            placeholder={step.placeholder}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y mb-4"
          />

          {/* Requirements reveal (only on step 0) */}
          {currentStep === 0 && stepAnswers.requirements?.trim() && !revealedReqs && (
            <button onClick={revealRequirements}
              className="text-sm text-blue-400 hover:text-blue-300 mb-4 transition-colors">
              Compare with reference requirements →
            </button>
          )}
          {currentStep === 0 && revealedReqs && reqsData && (
            <div className="bg-zinc-900/50 border border-blue-500/20 rounded-lg p-4 mb-4">
              <h4 className="text-xs text-blue-400 uppercase tracking-wider mb-2">Reference Requirements</h4>
              {reqsData.functional_reqs.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs text-zinc-500 font-medium">Functional:</span>
                  <ul className="mt-1 space-y-1">
                    {reqsData.functional_reqs.map((r, i) => <li key={i} className="text-sm text-zinc-400">• {r}</li>)}
                  </ul>
                </div>
              )}
              {reqsData.non_functional_reqs.length > 0 && (
                <div>
                  <span className="text-xs text-zinc-500 font-medium">Non-functional:</span>
                  <ul className="mt-1 space-y-1">
                    {reqsData.non_functional_reqs.map((r, i) => <li key={i} className="text-sm text-zinc-400">• {r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2 transition-colors">← Previous</button>
              )}
              <button onClick={() => setMode('choose')} className="text-sm text-zinc-600 hover:text-zinc-400 px-3 py-2 transition-colors">
                Change mode
              </button>
            </div>
            <div className="flex gap-2">
              {step.optional && !stepAnswers[step.key]?.trim() && currentStep < steps.length - 1 && (
                <button onClick={() => setCurrentStep(currentStep + 1)}
                  className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2 transition-colors">Skip →</button>
              )}
              {currentStep < steps.length - 1 ? (
                <button onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Next →
                </button>
              ) : (
                <button onClick={submitGuided} disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {submitting ? 'Evaluating...' : 'Submit All Steps'}
                </button>
              )}
            </div>
          </div>

          {/* Preview of all steps */}
          {currentStep === steps.length - 1 && (
            <div className="mt-6 border-t border-zinc-800 pt-4">
              <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Your Design Summary</h4>
              <div className="space-y-3">
                {steps.map(s => {
                  const val = stepAnswers[s.key]?.trim()
                  if (!val) return null
                  return (
                    <div key={s.key} className="bg-zinc-900/50 rounded-lg p-3">
                      <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
                      <p className="text-sm text-zinc-400 whitespace-pre-wrap mt-1">{val.slice(0, 200)}{val.length > 200 ? '...' : ''}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <ReviewHistory reviews={history} />
    </div>
  )
}
