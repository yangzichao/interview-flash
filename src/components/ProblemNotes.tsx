import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { api, getErrorMessage, type ItemType } from '../lib/api'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ProblemNotes({ itemType, itemId }: { itemType: ItemType; itemId: number }) {
  const [notes, setNotes] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const savedRef = useRef('')
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Bumped on every itemType/itemId change so in-flight requests for stale items can be ignored.
  const epochRef = useRef(0)

  useEffect(() => {
    epochRef.current += 1
    const epoch = epochRef.current
    setLoaded(false)
    setEditing(false)
    setSaveState('idle')
    setErrorMsg('')
    setNotes('')
    savedRef.current = ''
    setUpdatedAt(null)
    api.getNotes(itemType, itemId).then(res => {
      if (epoch !== epochRef.current) return
      setNotes(res.notes)
      savedRef.current = res.notes
      setUpdatedAt(res.updated_at)
      setLoaded(true)
    }).catch(() => { if (epoch === epochRef.current) setLoaded(true) })
  }, [itemType, itemId])

  useEffect(() => () => {
    epochRef.current += 1
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
  }, [])

  const save = async () => {
    setEditing(false)
    if (notes === savedRef.current) return
    const epoch = epochRef.current
    const pending = notes
    setSaveState('saving')
    setErrorMsg('')
    try {
      const res = await api.saveNotes(itemType, itemId, pending)
      if (epoch !== epochRef.current) return
      savedRef.current = pending
      setUpdatedAt(res.updated_at)
      setSaveState('saved')
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => {
        if (epoch === epochRef.current) setSaveState(s => s === 'saved' ? 'idle' : s)
      }, 2000)
    } catch (e) {
      if (epoch !== epochRef.current) return
      setSaveState('error')
      setErrorMsg(getErrorMessage(e))
      setEditing(true)
    }
  }

  if (!loaded) return null

  const hasNotes = notes.trim().length > 0

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-300">Your Notes</span>
          {updatedAt && saveState === 'idle' && (
            <span className="text-xs text-zinc-600">updated {formatRelative(updatedAt)}</span>
          )}
          {saveState === 'saving' && <span className="text-xs text-zinc-500">Saving…</span>}
          {saveState === 'saved' && <span className="text-xs text-emerald-400">Saved</span>}
          {saveState === 'error' && <span className="text-xs text-red-400" title={errorMsg}>Save failed — keep editing to retry</span>}
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1"
          >
            {hasNotes ? 'Edit' : 'Add note'}
          </button>
        )}
      </div>

      {editing ? (
        <textarea
          autoFocus
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key === 'Escape') e.currentTarget.blur() }}
          placeholder="What did you learn? Common pitfalls, key insights, edge cases to remember… (Markdown supported, click outside or press Esc to save)"
          rows={6}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y font-mono"
        />
      ) : hasNotes ? (
        <div
          className="prose prose-invert prose-sm max-w-none cursor-text"
          onClick={() => setEditing(true)}
        >
          <ReactMarkdown>{notes}</ReactMarkdown>
        </div>
      ) : (
        <p
          className="text-xs text-zinc-600 italic cursor-text"
          onClick={() => setEditing(true)}
        >
          No notes yet. Click "Add note" to capture lessons learned.
        </p>
      )}
    </div>
  )
}

function formatRelative(isoTime: string): string {
  // SQLite datetime('now') returns "YYYY-MM-DD HH:MM:SS" in UTC.
  const d = new Date(isoTime.replace(' ', 'T') + 'Z')
  const diffMs = Date.now() - d.getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  return d.toLocaleDateString()
}
