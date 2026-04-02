import { useState, useEffect, useMemo } from 'react'
import { api, type Algorithm } from '../lib/api'

const diffColor: Record<string, string> = { Easy: 'text-emerald-400', Medium: 'text-amber-400', Hard: 'text-red-400' }
const listColors: Record<string, string> = {
  'Blind 75': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Grind 169': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'NeetCode 150': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Top Interview': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

function parseJson(s: string): string[] { try { return JSON.parse(s) } catch { return [] } }

function ScoreBadge({ score }: { score: number | null }) {
  if (!score) return null
  const c = ['', 'bg-red-500/20 text-red-400', 'bg-orange-500/20 text-orange-400', 'bg-amber-500/20 text-amber-400', 'bg-lime-500/20 text-lime-400', 'bg-emerald-500/20 text-emerald-400']
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c[score]}`}>{score}/5</span>
}

export default function AlgorithmList({ onReview }: { onReview: (a: Algorithm) => void }) {
  const [items, setItems] = useState<Algorithm[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterList, setFilterList] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [filterDiff, setFilterDiff] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => api.getAlgorithms().then(setItems).catch(() => {})
  useEffect(() => { load() }, [])

  const { allLists, allCats } = useMemo(() => {
    const ls = new Set<string>(), cs = new Set<string>()
    for (const p of items) { parseJson(p.lists).forEach(l => ls.add(l)); if (p.category) cs.add(p.category) }
    return { allLists: [...ls].sort(), allCats: [...cs].sort() }
  }, [items])

  const filtered = useMemo(() => items.filter(p => {
    if (filterList && !parseJson(p.lists).includes(filterList)) return false
    if (filterCat && p.category !== filterCat) return false
    if (filterDiff && p.difficulty !== filterDiff) return false
    if (search) { const q = search.toLowerCase(); if (!p.title.toLowerCase().includes(q) && !p.slug.includes(q)) return false }
    return true
  }), [items, filterList, filterCat, filterDiff, search])

  const addProblem = async () => {
    if (!input.trim()) return
    setLoading(true); setError('')
    try { await api.addAlgorithm(input); setInput(''); load() }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const hasFilters = filterList || filterCat || filterDiff || search

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Add Problem</h2>
        <div className="flex gap-3">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addProblem()}
            placeholder="Problem slug, URL, or title (e.g. two-sum)"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors" />
          <button onClick={addProblem} disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="mb-6 space-y-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search algorithms..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 py-1 mr-1">List:</span>
          {allLists.map(l => (
            <button key={l} onClick={() => setFilterList(filterList === l ? null : l)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterList === l ? listColors[l] || 'bg-zinc-700 text-zinc-200 border-zinc-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 py-1 mr-1">Category:</span>
          {allCats.map(c => (
            <button key={c} onClick={() => setFilterCat(filterCat === c ? null : c)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterCat === c ? 'bg-zinc-700 text-zinc-200 border-zinc-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 py-1 mr-1">Difficulty:</span>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => setFilterDiff(filterDiff === d ? null : d)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterDiff === d ? `${diffColor[d]} bg-zinc-800 border-zinc-600` : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}>
              {d}
            </button>
          ))}
          {hasFilters && <button onClick={() => { setFilterList(null); setFilterCat(null); setFilterDiff(null); setSearch('') }} className="text-xs px-3 py-1 text-zinc-500 hover:text-zinc-300">Clear all</button>}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Algorithms <span className="text-zinc-500 text-sm font-normal">({filtered.length}{hasFilters ? ` / ${items.length}` : ''})</span></h2>
      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-zinc-500 text-sm w-8 text-right shrink-0">{p.leetcode_id}</span>
              <span className="font-medium truncate">{p.title}</span>
              <span className={`text-xs shrink-0 ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
              {p.category && <span className="text-xs text-zinc-600 shrink-0 hidden sm:inline">{p.category}</span>}
              <ScoreBadge score={p.last_score} />
              {parseJson(p.lists).map(l => (
                <span key={l} className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 hidden md:inline ${listColors[l] || 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>{l}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onReview(p)} className="text-sm text-emerald-400 hover:text-emerald-300 px-3 py-1 rounded transition-colors">Review</button>
              <button onClick={() => { api.deleteAlgorithm(p.id).then(load) }} className="text-sm text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 px-2 py-1 rounded transition-all">✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-8 text-zinc-500 text-sm">No problems match</div>}
      </div>
    </div>
  )
}
