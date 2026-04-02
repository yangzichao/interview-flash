import { useState, useEffect, useMemo } from 'react'
import { api, type OODProblem } from '../lib/api'

const diffColor: Record<string, string> = { Easy: 'text-emerald-400', Medium: 'text-amber-400', Hard: 'text-red-400' }

function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const c = ['', 'bg-red-500/20 text-red-400', 'bg-orange-500/20 text-orange-400', 'bg-amber-500/20 text-amber-400', 'bg-lime-500/20 text-lime-400', 'bg-emerald-500/20 text-emerald-400']
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c[score]}`}>{score}/5</span>
}

export default function OODList({ onReview }: { onReview: (p: OODProblem) => void }) {
  const [items, setItems] = useState<OODProblem[]>([])
  const [filterDiff, setFilterDiff] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { api.getOOD().then(setItems).catch(() => {}) }, [])

  const filtered = useMemo(() => items.filter(p => {
    if (filterDiff && p.difficulty !== filterDiff) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [items, filterDiff, search])

  return (
    <div>
      <div className="mb-6 space-y-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search OOD problems..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 py-1 mr-1">Difficulty:</span>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => setFilterDiff(filterDiff === d ? null : d)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterDiff === d ? `${diffColor[d]} bg-zinc-800 border-zinc-600` : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
              {d}
            </button>
          ))}
          {filterDiff && <button onClick={() => setFilterDiff(null)} className="text-xs px-3 py-1 text-zinc-500 hover:text-zinc-300">Clear</button>}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Object-Oriented Design <span className="text-zinc-500 text-sm font-normal">({filtered.length})</span></h2>
      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-medium truncate">{p.title}</span>
              <span className={`text-xs shrink-0 ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
              <ScoreBadge score={p.last_score} />
            </div>
            <button onClick={() => onReview(p)} className="text-sm text-emerald-400 hover:text-emerald-300 px-3 py-1 rounded transition-colors shrink-0">Review</button>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-zinc-500 text-sm">No problems match</div>}
      </div>
    </div>
  )
}
