import type { SystemDesignProblem, Review } from '../../lib/api'

export interface StepDef {
  key: string
  label: string
  prompt: string
  placeholder: string
  optional?: boolean
}

export const STEPS: StepDef[] = [
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

export interface ModeProps {
  item: SystemDesignProblem
  onResult: (r: Review) => void
  onChangeMode: () => void
  getElapsed: () => number
}
