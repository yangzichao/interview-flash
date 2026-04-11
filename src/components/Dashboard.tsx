import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { api, type OverviewStats, type ScoreHistoryPoint, type TopicStatsResponse, type ActivityPoint, type DueItem } from '../lib/api'

const typeLabels: Record<string, string> = {
  algorithm: 'Algorithm',
  behavioral: 'Behavioral',
  ood: 'OOD',
  system_design: 'System Design',
}

const typeColors: Record<string, string> = {
  algorithm: 'text-emerald-400',
  behavioral: 'text-blue-400',
  ood: 'text-purple-400',
  system_design: 'text-amber-400',
}

const diffColors: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
}

interface DashboardProps {
  onReviewItem: (itemType: string, itemId: number) => void
}

export default function Dashboard({ onReviewItem }: DashboardProps) {
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [history, setHistory] = useState<ScoreHistoryPoint[]>([])
  const [topicData, setTopicData] = useState<TopicStatsResponse | null>(null)
  const [activity, setActivity] = useState<ActivityPoint[]>([])
  const [dueItems, setDueItems] = useState<DueItem[]>([])
  const [weakness, setWeakness] = useState<string | null>(null)
  const [loadingWeakness, setLoadingWeakness] = useState(false)

  useEffect(() => {
    api.getOverview().then(setOverview).catch(() => {})
    api.getScoreHistory(60).then(setHistory).catch(() => {})
    api.getTopicStats().then(setTopicData).catch(() => {})
    api.getActivity().then(setActivity).catch(() => {})
    api.getDueItems().then(setDueItems).catch(() => {})
  }, [])

  const runWeaknessAnalysis = async () => {
    setLoadingWeakness(true)
    try {
      const res = await api.getWeaknessAnalysis()
      setWeakness(res.analysis)
    } catch { setWeakness('Failed to generate analysis. Check your LLM provider settings.') }
    finally { setLoadingWeakness(false) }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-sm text-zinc-500">Track your progress and stay on schedule</p>
      </div>

      {/* Stats cards */}
      {overview && <StatsCards overview={overview} />}

      {/* Due for review */}
      <DueSection items={dueItems} onReview={onReviewItem} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreTrendChart data={history} />
        {topicData && topicData.category_stats.length > 0 && (
          <CategoryRadar data={topicData.category_stats} />
        )}
      </div>

      {/* Topic breakdown */}
      {topicData && topicData.topic_stats.length > 0 && (
        <TopicBreakdown data={topicData.topic_stats} />
      )}

      {/* Activity heatmap */}
      <ActivityCalendar data={activity} />

      {/* Weakness analysis */}
      <WeaknessSection
        analysis={weakness}
        loading={loadingWeakness}
        onRun={runWeaknessAnalysis}
      />
    </div>
  )
}

// ============================================================
// Stats Cards
// ============================================================

function StatsCards({ overview }: { overview: OverviewStats }) {
  const cards = [
    { label: 'Total Problems', value: overview.total_problems, color: 'text-zinc-100' },
    { label: 'Reviews Done', value: overview.total_reviews, color: 'text-emerald-400' },
    { label: 'Avg Score', value: overview.avg_score ? `${overview.avg_score}/5` : '—', color: 'text-amber-400' },
    { label: 'Day Streak', value: overview.streak, color: 'text-orange-400' },
    { label: 'Due for Review', value: overview.due_count, color: overview.due_count > 0 ? 'text-red-400' : 'text-zinc-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Due Items Section
// ============================================================

function DueSection({ items, onReview }: { items: DueItem[]; onReview: (type: string, id: number) => void }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? items : items.slice(0, 8)

  if (items.length === 0) return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
      <p className="text-zinc-400">All caught up! No items due for review.</p>
    </div>
  )

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">
          Due for Review <span className="text-zinc-600 font-normal">({items.length})</span>
        </h3>
        {items.length > 8 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-zinc-500 hover:text-zinc-300">
            {showAll ? 'Show less' : `Show all ${items.length}`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayed.map((item, i) => (
          <button
            key={`${item.item_type}-${item.item_id}-${i}`}
            onClick={() => onReview(item.item_type, item.item_id)}
            className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-left transition-colors group"
          >
            <span className={`text-xs font-medium ${typeColors[item.item_type] || 'text-zinc-400'}`}>
              {typeLabels[item.item_type] || item.item_type}
            </span>
            <span className="text-sm text-zinc-300 truncate flex-1 group-hover:text-zinc-100">{item.title}</span>
            {item.difficulty && (
              <span className={`text-xs ${diffColors[item.difficulty] || 'text-zinc-500'}`}>{item.difficulty}</span>
            )}
            {item.last_score && (
              <span className="text-xs text-zinc-600">{item.last_score}/5</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Score Trend Chart
// ============================================================

function ScoreTrendChart({ data }: { data: ScoreHistoryPoint[] }) {
  if (data.length < 2) return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Score Trend</h3>
      <p className="text-sm text-zinc-500">Need at least 2 days of reviews to show trend.</p>
    </div>
  )

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Score Trend (60 days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#71717a' }} tickFormatter={d => d.slice(5)} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#71717a' }} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#a1a1aa' }}
            formatter={(v) => [`${v}/5`, 'Avg Score']}
          />
          <Line type="monotone" dataKey="avg_score" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================
// Category Radar
// ============================================================

function CategoryRadar({ data }: { data: { topic: string; avg_score: number; count: number }[] }) {
  const radarData = data.map(d => ({ ...d, fullMark: 5 }))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Category Performance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10, fill: '#52525b' }} />
          <Radar dataKey="avg_score" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ============================================================
// Topic Breakdown (bar-style)
// ============================================================

function TopicBreakdown({ data }: { data: { topic: string; avg_score: number; count: number }[] }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Topic Performance (Algorithms)</h3>
      <div className="space-y-2">
        {data.map(t => {
          const pct = (t.avg_score / 5) * 100
          const color = t.avg_score >= 4 ? 'bg-emerald-500' : t.avg_score >= 3 ? 'bg-amber-500' : 'bg-red-500'
          return (
            <div key={t.topic} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-36 truncate">{t.topic}</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-zinc-500 w-16 text-right">{t.avg_score}/5 ({t.count})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// Activity Calendar (GitHub-style)
// ============================================================

function ActivityCalendar({ data }: { data: ActivityPoint[] }) {
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const d of data) map[d.day] = d.count
    return map
  }, [data])

  // Generate last 20 weeks of dates
  const weeks = useMemo(() => {
    const result: string[][] = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(start.getDate() - dayOfWeek - 20 * 7)

    for (let w = 0; w < 21; w++) {
      const week: string[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start)
        date.setDate(start.getDate() + w * 7 + d)
        if (date <= today) {
          week.push(date.toISOString().slice(0, 10))
        }
      }
      result.push(week)
    }
    return result
  }, [])

  const getColor = (count: number) => {
    if (!count) return 'bg-zinc-800'
    if (count === 1) return 'bg-emerald-900'
    if (count <= 3) return 'bg-emerald-700'
    if (count <= 6) return 'bg-emerald-500'
    return 'bg-emerald-400'
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Activity</h3>
      <div className="flex gap-[3px] overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map(day => (
              <div
                key={day}
                className={`w-3 h-3 rounded-sm ${getColor(activityMap[day] || 0)}`}
                title={`${day}: ${activityMap[day] || 0} reviews`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-zinc-800" />
        <div className="w-3 h-3 rounded-sm bg-emerald-900" />
        <div className="w-3 h-3 rounded-sm bg-emerald-700" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  )
}

// ============================================================
// Weakness Analysis
// ============================================================

function WeaknessSection({ analysis, loading, onRun }: {
  analysis: string | null; loading: boolean; onRun: () => void
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">AI Weakness Analysis</h3>
        <button
          onClick={onRun}
          disabled={loading}
          className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          {loading ? 'Analyzing...' : analysis ? 'Refresh' : 'Generate Analysis'}
        </button>
      </div>
      {analysis ? (
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          Click "Generate Analysis" to get an AI-powered breakdown of your strengths, weaknesses, and a personalized study plan.
        </p>
      )}
    </div>
  )
}
