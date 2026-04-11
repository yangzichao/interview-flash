import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, getErrorMessage } from '../../lib/api'
import type { ModeProps } from './types'

export default function MockInterviewMode({ item, onResult, onChangeMode }: ModeProps) {
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
    } catch (e) { alert(getErrorMessage(e)) }
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
    } catch (e) { alert(getErrorMessage(e)) }
    finally { setLoading(false) }
  }

  const finishAndScore = async () => {
    if (submitting) return
    setSubmitting(true)
    const fullAnswer = messages
      .filter(m => m.role === 'candidate')
      .map(m => m.content)
      .join('\n\n---\n\n')
    try {
      onResult(await api.submitReview('system_design', item.id, fullAnswer, {
        mock_interview_transcript: messages.map(m => `[${m.role}]: ${m.content}`).join('\n\n'),
      }))
    } catch (e) { alert(getErrorMessage(e)) }
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
