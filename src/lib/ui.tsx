// Shared UI utilities — color maps, score badge, helper functions
import DOMPurify from 'dompurify'
import type { ItemType } from './api'

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
}

// Target time budgets per review category (seconds).
export const TARGET_SECONDS: Record<ItemType, number> = {
  algorithm: 25 * 60,
  behavioral: 3 * 60,
  ood: 35 * 60,
  system_design: 45 * 60,
}

export const SCORE_BADGE_COLORS = [
  '',
  'bg-red-500/20 text-red-400',
  'bg-orange-500/20 text-orange-400',
  'bg-amber-500/20 text-amber-400',
  'bg-lime-500/20 text-lime-400',
  'bg-emerald-500/20 text-emerald-400',
]

export const LIST_COLORS: Record<string, string> = {
  'Blind 75': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Grind 169': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'NeetCode 150': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Top Interview': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export function parseJson(s: string): string[] {
  try { return JSON.parse(s) } catch { return [] }
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html)
}

export function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return null
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${SCORE_BADGE_COLORS[score]}`}>
      {score}/5
    </span>
  )
}
