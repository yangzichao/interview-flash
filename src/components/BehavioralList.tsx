import { useState, useEffect, useMemo } from 'react'
import { api, type BehavioralQuestion } from '../lib/api'

function parseJson(s: string): string[] { try { return JSON.parse(s) } catch { return [] } }

function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const c = ['', 'bg-red-500/20 text-red-400', 'bg-orange-500/20 text-orange-400', 'bg-amber-500/20 text-amber-400', 'bg-lime-500/20 text-lime-400', 'bg-emerald-500/20 text-emerald-400']
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c[score]}`}>{score}/5</span>
}

export default function BehavioralList({ onReview }: { onReview: (q: BehavioralQuestion) => void }) {
  const [items, setItems] = useState<BehavioralQuestion[]>([])
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { api.getBehavioral().then(setItems).catch(() => {}) }, [])

  const allCats = useMemo(() => [...new Set(items.map(q => q.category).filter(Boolean))].sort(), [items])

  const filtered = useMemo(() => items.filter(q => {
    if (filterCat && q.category !== filterCat) return false
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [items, filterCat, search])

  return (
    <div>
      <div className="mb-6 space-y-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search behavioral questions..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
        {allCats.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-zinc-500 py-1 mr-1">Category:</span>
            {allCats.map(c => (
              <button key={c} onClick={() => setFilterCat(filterCat === c ? null : c)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterCat === c ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
                {c}
              </button>
            ))}
            {filterCat && <button onClick={() => setFilterCat(null)} className="text-xs px-3 py-1 text-zinc-500 hover:text-zinc-300">Clear</button>}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">Behavioral <span className="text-zinc-500 text-sm font-normal">({filtered.length})</span></h2>
      <div className="space-y-2">
        {filtered.map(q => (
          <div key={q.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-medium truncate">{q.title}</span>
              {q.category && <span className="text-xs text-zinc-600 shrink-0">{q.category}</span>}
              {q.framework && <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded shrink-0">{q.framework}</span>}
              <ScoreBadge score={q.last_score} />
            </div>
            <button onClick={() => onReview(q)} className="text-sm text-emerald-400 hover:text-emerald-300 px-3 py-1 rounded transition-colors shrink-0">Review</button>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-zinc-500 text-sm">No questions match</div>}
      </div>
    </div>
  )
}
