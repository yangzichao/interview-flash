import { useState, useEffect } from 'react'
import { api, type Problem } from '../lib/api'

const difficultyColor: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
}

function scoreLabel(score: number | null) {
  if (!score) return null
  const colors = ['', 'bg-red-500/20 text-red-400', 'bg-orange-500/20 text-orange-400', 'bg-amber-500/20 text-amber-400', 'bg-lime-500/20 text-lime-400', 'bg-emerald-500/20 text-emerald-400']
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[score]}`}>
      {score}/5
    </span>
  )
}

export default function ProblemList({ onReview }: { onReview: (p: Problem) => void }) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = () => api.getProblems().then(setProblems).catch(() => {})

  useEffect(() => { load() }, [])

  const addProblem = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      await api.addProblem(input)
      setInput('')
      load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteProblem = async (id: number) => {
    await api.deleteProblem(id)
    load()
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Add Problem</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addProblem()}
            placeholder="LeetCode slug, URL, or title (e.g. two-sum)"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={addProblem}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-2">No problems yet</p>
          <p className="text-sm">Add a LeetCode problem to start reviewing</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-3">
            Problems <span className="text-zinc-500 text-sm font-normal">({problems.length})</span>
          </h2>
          {problems.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-zinc-500 text-sm w-8 text-right shrink-0">
                  {p.leetcode_id}
                </span>
                <span className="font-medium truncate">{p.title}</span>
                <span className={`text-xs ${difficultyColor[p.difficulty] || ''}`}>
                  {p.difficulty}
                </span>
                {scoreLabel(p.last_score)}
                {p.last_reviewed && (
                  <span className="text-xs text-zinc-600">
                    {new Date(p.last_reviewed).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onReview(p)}
                  className="text-sm text-emerald-400 hover:text-emerald-300 px-3 py-1 rounded transition-colors"
                >
                  Review
                </button>
                <button
                  onClick={() => deleteProblem(p.id)}
                  className="text-sm text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 px-2 py-1 rounded transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
