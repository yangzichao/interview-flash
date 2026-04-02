import { useState, useEffect } from 'react'
import { api, type OODProblem, type Review } from '../lib/api'
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
    key: 'use_cases',
    label: 'Requirements & Use Cases',
    prompt: 'Clarify the scope. What are the core use cases? What features are in or out of scope? What actors/users interact with the system?',
    placeholder: 'e.g.\nActors: Customer, Admin\nCore use cases:\n- Customer can browse products, add to cart, checkout\n- Admin can add/remove products, view orders\nOut of scope: payment processing, shipping logistics',
  },
  {
    key: 'core_objects',
    label: 'Core Objects & Entities',
    prompt: 'Identify the key classes/objects in your design. What are the nouns in the problem? Which ones deserve their own class?',
    placeholder: 'e.g.\n- ParkingLot: manages levels, tracks capacity\n- Level: contains rows of spots\n- ParkingSpot: has size (Small/Compact/Large), optional vehicle ref\n- Vehicle (abstract): base class for Car, Motorcycle, Bus\n- Ticket: issued when parking, tracks entry time',
  },
  {
    key: 'relationships',
    label: 'Relationships & Class Hierarchy',
    prompt: 'Define how your classes relate to each other. Where do you use inheritance vs composition vs aggregation? What\'s the class hierarchy?',
    placeholder: 'e.g.\n- Vehicle (abstract) → Car, Motorcycle, Bus (inheritance)\n- ParkingLot HAS-many Levels (composition)\n- Level HAS-many ParkingSpots (composition)\n- ParkingSpot HAS-optional Vehicle (aggregation)\n- Vehicle knows its size (VehicleSize enum)',
  },
  {
    key: 'interfaces_apis',
    label: 'Key Methods & Interfaces',
    prompt: 'Design the public API / key methods of your main classes. What are the method signatures? What do they return?',
    placeholder: 'e.g.\nParkingLot:\n  parkVehicle(vehicle) → Ticket | null\n  unparkVehicle(ticket) → void\n  getAvailableSpots(vehicleSize) → int\n\nLevel:\n  findAvailableSpot(vehicleSize) → ParkingSpot | null\n\nParkingSpot:\n  canFitVehicle(vehicle) → boolean\n  park(vehicle) → void\n  removeVehicle() → void',
  },
  {
    key: 'design_patterns',
    label: 'Design Patterns',
    prompt: 'What design patterns would you apply? Why? (Strategy, Observer, Factory, Singleton, State, etc.)',
    placeholder: 'e.g.\n- Strategy pattern for spot allocation (NearestFirst, SpreadOut)\n- Factory for creating vehicles from type\n- Observer to notify when spots become available\n- Singleton for ParkingLot (one instance)',
    optional: true,
  },
  {
    key: 'extensibility',
    label: 'Extensibility & Trade-offs',
    prompt: 'How would you extend the design? What trade-offs did you make? What about concurrency, scaling, or future features?',
    placeholder: 'e.g.\n- Adding EV charging spots: new SpotType enum, ChargeableSpot subclass\n- Multi-floor pricing: Strategy pattern for PricingStrategy\n- Concurrency: lock per ParkingSpot, not per Level (fine-grained)\n- Trade-off: simple inheritance for vehicles vs more flexible composition',
    optional: true,
  },
]

type Mode = 'choose' | 'guided' | 'quick'

export default function OODReview({ item, onBack }: { item: OODProblem; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('choose')
  const [currentStep, setCurrentStep] = useState(0)
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({})
  const [quickAnswer, setQuickAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Review | null>(null)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('ood', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const diffColor = item.difficulty === 'Easy' ? 'text-emerald-400' : item.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'

  const updateStep = (key: string, value: string) => {
    setStepAnswers(prev => ({ ...prev, [key]: value }))
  }

  const submitGuided = async () => {
    if (submitting) return
    setSubmitting(true)
    const summary = steps
      .filter(s => stepAnswers[s.key]?.trim())
      .map(s => `### ${s.label}\n${stepAnswers[s.key]}`)
      .join('\n\n')
    try {
      setResult(await api.submitReview('ood', item.id, summary, stepAnswers))
    } catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const submitQuick = async () => {
    if (!quickAnswer.trim() || submitting) return
    setSubmitting(true)
    try { setResult(await api.submitReview('ood', item.id, quickAnswer)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const reset = () => {
    setMode('choose'); setCurrentStep(0); setStepAnswers({})
    setQuickAnswer(''); setResult(null)
  }

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
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <span className={`text-sm ${diffColor}`}>{item.difficulty}</span>
        </div>
      </div>

      {/* Requirements — always visible */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6 problem-content"
        dangerouslySetInnerHTML={{ __html: item.requirements }} />

      {/* Mode selection */}
      {mode === 'choose' && (
        <div className="flex gap-4 mb-6">
          <button onClick={() => setMode('guided')}
            className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-lg p-5 text-left transition-colors">
            <div className="text-emerald-400 font-semibold mb-1">Guided Practice</div>
            <p className="text-sm text-zinc-400">Step-by-step: use cases → core objects → relationships → methods → patterns → extensibility</p>
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
          <label className="block text-sm text-zinc-400 mb-2">Describe your class design, relationships, and patterns</label>
          <textarea value={quickAnswer} onChange={e => setQuickAnswer(e.target.value)}
            placeholder="e.g. I would create a base class Vehicle with subclasses Car, Truck. A ParkingLot has Levels, each has Spots..."
            rows={10} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
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
                  i === currentStep ? 'bg-sky-500' :
                  i < currentStep ? 'bg-sky-500/40' :
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
            rows={7}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-sky-500 transition-colors resize-y mb-4"
          />

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

          {/* Summary on last step */}
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
