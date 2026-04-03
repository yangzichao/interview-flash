import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, type SystemDesignProblem, type Review } from '../lib/api'
import { EvaluationResult, ReviewHistory, SectionCards } from './ReviewFeedback'

// ============================================================
// Step definitions for guided mode
// ============================================================

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

type Mode = 'choose' | 'guided' | 'quick' | 'mock'

// ============================================================
// Main component
// ============================================================

export default function SystemDesignReview({ item, onBack }: { item: SystemDesignProblem; onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('choose')
  const [result, setResult] = useState<Review | null>(null)
  const [history, setHistory] = useState<Review[]>([])

  useEffect(() => { api.getReviewHistory('system_design', item.id).then(setHistory).catch(() => {}) }, [item.id, result])

  const diffColor = item.difficulty === 'Hard' ? 'text-red-400' : 'text-amber-400'

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
        dangerouslySetInnerHTML={{ __html: item.problem_statement }} />

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

// ============================================================
// Quick Mode (unchanged)
// ============================================================

function QuickMode({ item, onResult, onChangeMode }: { item: SystemDesignProblem; onResult: (r: Review) => void; onChangeMode: () => void }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    try { onResult(await api.submitReview('system_design', item.id, answer)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-2">Describe your full system design</label>
      <textarea value={answer} onChange={e => setAnswer(e.target.value)}
        placeholder="Cover: requirements, architecture, database, scaling, trade-offs..."
        rows={12} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y" />
      <div className="flex items-center justify-between mt-4">
        <button onClick={onChangeMode} className="text-sm text-zinc-500 hover:text-zinc-300">← Change mode</button>
        <button onClick={submit} disabled={!answer.trim() || submitting}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {submitting ? 'Evaluating...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// Guided Mode — per-step feedback + retry
// ============================================================

function GuidedMode({ item, onResult, onChangeMode }: { item: SystemDesignProblem; onResult: (r: Review) => void; onChangeMode: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({})
  const [stepFeedback, setStepFeedback] = useState<Record<string, string>>({})
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [revealedReqs, setRevealedReqs] = useState(false)
  const [reqsData, setReqsData] = useState<{ functional_reqs: string[]; non_functional_reqs: string[] } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const step = steps[currentStep]

  const updateStep = (key: string, value: string) => {
    setStepAnswers(prev => ({ ...prev, [key]: value }))
    // Clear feedback when answer changes
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
    } catch (e: any) { alert(e.message) }
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
    const summary = steps
      .filter(s => stepAnswers[s.key]?.trim())
      .map(s => `### ${s.label}\n${stepAnswers[s.key]}`)
      .join('\n\n')
    try { onResult(await api.submitReview('system_design', item.id, summary, stepAnswers)) }
    catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  const hasFeedback = !!stepFeedback[step.key]
  const hasAnswer = !!stepAnswers[step.key]?.trim()

  return (
    <div>
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
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
          <span className="text-xs text-zinc-500">Step {currentStep + 1}/{steps.length}</span>
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
          {feedbackLoading ? 'Getting feedback...' : '💡 Get feedback on this step'}
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
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2">← Previous</button>
          )}
          <button onClick={onChangeMode} className="text-sm text-zinc-600 hover:text-zinc-400 px-3 py-2">Change mode</button>
        </div>
        <div className="flex gap-2">
          {step.optional && !hasAnswer && currentStep < steps.length - 1 && (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2">Skip →</button>
          )}
          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Next →
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
      {currentStep === steps.length - 1 && (
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Your Design Summary</h4>
          <div className="space-y-3">
            {steps.map(s => {
              const val = stepAnswers[s.key]?.trim()
              if (!val) return null
              return (
                <div key={s.key} className="bg-zinc-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
                    {stepFeedback[s.key] && <span className="text-[10px] text-emerald-500">✓ reviewed</span>}
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

// ============================================================
// Mock Interview Mode — conversational back-and-forth
// ============================================================

function MockInterviewMode({ item, onResult, onChangeMode }: { item: SystemDesignProblem; onResult: (r: Review) => void; onChangeMode: () => void }) {
  const [messages, setMessages] = useState<{ role: 'interviewer' | 'candidate'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    setStarted(true)
    setLoading(true)
    try {
      const { reply } = await api.sendInterviewChat(item.id, [])
      setMessages([{ role: 'interviewer', content: reply }])
    } catch (e: any) { alert(e.message) }
    finally { setLoading(false) }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'candidate' as const, content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const { reply } = await api.sendInterviewChat(item.id, newMessages)
      setMessages([...newMessages, { role: 'interviewer' as const, content: reply }])
    } catch (e: any) { alert(e.message) }
    finally { setLoading(false) }
  }

  const finishAndScore = async () => {
    if (submitting) return
    setSubmitting(true)
    // Compile the full conversation as the answer
    const fullAnswer = messages
      .filter(m => m.role === 'candidate')
      .map(m => m.content)
      .join('\n\n---\n\n')
    try {
      onResult(await api.submitReview('system_design', item.id, fullAnswer, {
        mock_interview_transcript: messages.map(m => `[${m.role}]: ${m.content}`).join('\n\n'),
      }))
    } catch (e: any) { alert(e.message) }
    finally { setSubmitting(false) }
  }

  if (!started) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 mb-4 text-sm">You'll have a back-and-forth conversation with an AI interviewer. They'll ask probing questions, push you to go deeper, and challenge your assumptions — just like a real interview.</p>
        <div className="flex justify-center gap-3">
          <button onClick={startInterview}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Start Interview
          </button>
          <button onClick={onChangeMode} className="text-sm text-zinc-500 hover:text-zinc-300 px-3 py-2">Change mode</button>
        </div>
      </div>
    )
  }

  const candidateCount = messages.filter(m => m.role === 'candidate').length

  return (
    <div>
      {/* Chat messages */}
      <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
              m.role === 'interviewer'
                ? 'bg-zinc-900 border border-zinc-800'
                : 'bg-emerald-900/30 border border-emerald-800/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-medium uppercase tracking-wider ${
                  m.role === 'interviewer' ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {m.role === 'interviewer' ? 'Interviewer' : 'You'}
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
              <span className="text-xs text-zinc-500 animate-pulse">Interviewer is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 pt-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Type your response... (Enter to send, Shift+Enter for newline)"
          rows={3}
          disabled={loading}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-y disabled:opacity-50"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2 items-center">
            <button onClick={onChangeMode} className="text-sm text-zinc-600 hover:text-zinc-400 px-3 py-2">Change mode</button>
            <span className="text-xs text-zinc-600">{candidateCount} responses</span>
          </div>
          <div className="flex gap-2">
            {candidateCount >= 3 && (
              <button onClick={finishAndScore} disabled={submitting}
                className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {submitting ? 'Scoring...' : 'End & Score'}
              </button>
            )}
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
