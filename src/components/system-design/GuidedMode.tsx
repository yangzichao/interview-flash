import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, getErrorMessage } from '../../lib/api'
import { STEPS, type ModeProps } from './types'

export default function GuidedMode({ item, onResult, onChangeMode }: ModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({})
  const [stepFeedback, setStepFeedback] = useState<Record<string, string>>({})
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [revealedReqs, setRevealedReqs] = useState(false)
  const [reqsData, setReqsData] = useState<{ functional_reqs: string[]; non_functional_reqs: string[] } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const step = STEPS[currentStep]

  const updateStep = (key: string, value: string) => {
    setStepAnswers(prev => ({ ...prev, [key]: value }))
    if (stepFeedback[key]) {
      setStepFeedback(prev => { const n = { ...prev }; delete n[key]; return n })
    }
  }

  const getStepFeedback = async () => {
    if (!stepAnswers[step.key]?.trim() || feedbackLoading) return
    setFeedbackLoading(true)
    try {
      const { feedback } = await api.getStepFeedback(
        item.id, step.key, step.label, stepAnswers[step.key], stepAnswers
      )
      setStepFeedback(prev => ({ ...prev, [step.key]: feedback }))
    } catch (e) { alert(getErrorMessage(e)) }
    finally { setFeedbackLoading(false) }
  }

  const revealRequirements = async () => {
    try {
      const data = await api.getSystemDesignRequirements(item.id)
      setReqsData(data)
      setRevealedReqs(true)
    } catch { setRevealedReqs(true) }
  }

  const submitAll = async () => {
    if (submitting) return
    setSubmitting(true)
    const summary = STEPS
      .filter(s => stepAnswers[s.key]?.trim())
      .map(s => `### ${s.label}\n${stepAnswers[s.key]}`)
      .join('\n\n')
    try { onResult(await api.submitReview('system_design', item.id, summary, stepAnswers)) }
    catch (e) { alert(getErrorMessage(e)) }
    finally { setSubmitting(false) }
  }

  const hasFeedback = !!stepFeedback[step.key]
  const hasAnswer = !!stepAnswers[step.key]?.trim()

  return (
    <div>
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <button key={s.key} onClick={() => setCurrentStep(i)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i === currentStep ? 'bg-emerald-500' :
              stepFeedback[s.key] ? 'bg-emerald-500/60' :
              i < currentStep ? 'bg-emerald-500/30' :
              stepAnswers[s.key]?.trim() ? 'bg-zinc-600' : 'bg-zinc-800'
            }`} />
        ))}
      </div>

      {/* Step header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-zinc-500">Step {currentStep + 1}/{STEPS.length}</span>
          {step.optional && <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">Optional</span>}
          {hasFeedback && <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Feedback received</span>}
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">{step.label}</h3>
        <p className="text-sm text-zinc-400 mb-4">{step.prompt}</p>
      </div>

      {/* Answer textarea */}
      <textarea
        value={stepAnswers[step.key] || ''}
        onChange={e => updateStep(step.key, e.target.value)}
        placeholder={step.placeholder}
        rows={6}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y mb-3"
      />

      {/* Get Feedback button */}
      {hasAnswer && !hasFeedback && (
        <button onClick={getStepFeedback} disabled={feedbackLoading}
          className="text-sm text-amber-400 hover:text-amber-300 mb-4 transition-colors disabled:opacity-50">
          {feedbackLoading ? 'Getting feedback...' : 'Get feedback on this step'}
        </button>
      )}

      {/* Step feedback display */}
      {hasFeedback && (
        <div className="bg-zinc-900 border-l-2 border-amber-500/30 border border-zinc-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs text-amber-400 uppercase tracking-wider">Coaching Feedback</h4>
            <button onClick={() => { updateStep(step.key, stepAnswers[step.key]) }}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
              Edit answer & retry
            </button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{stepFeedback[step.key]}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Requirements reveal (step 0) */}
      {currentStep === 0 && hasAnswer && !revealedReqs && (
        <button onClick={revealRequirements}
          className="text-sm text-blue-400 hover:text-blue-300 mb-4 block transition-colors">
          Compare with reference requirements
        </button>
      )}
      {currentStep === 0 && revealedReqs && reqsData && (
        <div className="bg-zinc-900/50 border border-blue-500/20 rounded-lg p-4 mb-4">
          <h4 className="text-xs text-blue-400 uppercase tracking-wider mb-2">Reference Requirements</h4>
          {reqsData.functional_reqs.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-zinc-500 font-medium">Functional:</span>
              <ul className="mt-1 space-y-1">
                {reqsData.functional_reqs.map((r, i) => <li key={i} className="text-sm text-zinc-400">- {r}</li>)}
              </ul>
            </div>
          )}
          {reqsData.non_functional_reqs.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 font-medium">Non-functional:</span>
              <ul className="mt-1 space-y-1">
                {reqsData.non_functional_reqs.map((r, i) => <li key={i} className="text-sm text-zinc-400">- {r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2">Previous</button>
          )}
          <button onClick={onChangeMode} className="text-sm text-zinc-600 hover:text-zinc-400 px-3 py-2">Change mode</button>
        </div>
        <div className="flex gap-2">
          {step.optional && !hasAnswer && currentStep < STEPS.length - 1 && (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2">Skip</button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Next
            </button>
          ) : (
            <button onClick={submitAll} disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
              {submitting ? 'Evaluating...' : 'Submit All Steps'}
            </button>
          )}
        </div>
      </div>

      {/* Summary on last step */}
      {currentStep === STEPS.length - 1 && (
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Your Design Summary</h4>
          <div className="space-y-3">
            {STEPS.map(s => {
              const val = stepAnswers[s.key]?.trim()
              if (!val) return null
              return (
                <div key={s.key} className="bg-zinc-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
                    {stepFeedback[s.key] && <span className="text-[10px] text-emerald-500">reviewed</span>}
                  </div>
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap mt-1">{val.slice(0, 200)}{val.length > 200 ? '...' : ''}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
