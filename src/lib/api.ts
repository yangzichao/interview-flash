export type ItemType = 'algorithm' | 'behavioral' | 'ood' | 'system_design';

// ============================================================
// Type-specific data models
// ============================================================

export interface Algorithm {
  id: number;
  leetcode_id: number;
  title: string;
  slug: string;
  difficulty: string;
  content: string;
  solution: string;
  category: string;
  topics: string;
  lists: string;
  added_at: string;
  last_reviewed: string | null;
  last_score: number | null;
}

export interface BehavioralQuestion {
  id: number;
  title: string;
  slug: string;
  category: string;
  tags: string;
  prompt: string;
  guidance: string;
  sample_answer: string;
  framework: string;
  added_at: string;
  last_reviewed: string | null;
  last_score: number | null;
}

export interface OODProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  tags: string;
  requirements: string;
  reference_design: string;
  key_patterns: string;
  added_at: string;
  last_reviewed: string | null;
  last_score: number | null;
}

export interface SystemDesignProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  tags: string;
  problem_statement: string;
  functional_reqs: string;
  non_functional_reqs: string;
  capacity_estimation: string;
  api_design: string;
  data_model: string;
  high_level_architecture: string;
  deep_dives: string;
  reference_solution: string;
  added_at: string;
  last_reviewed: string | null;
  last_score: number | null;
}

export interface Review {
  id: number;
  item_type: ItemType;
  item_id: number;
  user_answer: string;
  evaluation: string;
  score: number;
  step_data: string | null;
  reviewed_at: string;
}

// ============================================================
// API client
// ============================================================

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Algorithms
  getAlgorithms: () => request<Algorithm[]>('/api/algorithms'),
  getAlgorithm: (id: number) => request<Algorithm>(`/api/algorithms/${id}`),
  addAlgorithm: (input: string) => request<Algorithm>('/api/algorithms', {
    method: 'POST', body: JSON.stringify({ input }),
  }),
  deleteAlgorithm: (id: number) => request<{ ok: boolean }>(`/api/algorithms/${id}`, { method: 'DELETE' }),

  // Behavioral
  getBehavioral: () => request<BehavioralQuestion[]>('/api/behavioral'),
  getBehavioralById: (id: number) => request<BehavioralQuestion>(`/api/behavioral/${id}`),
  deleteBehavioral: (id: number) => request<{ ok: boolean }>(`/api/behavioral/${id}`, { method: 'DELETE' }),

  // OOD
  getOOD: () => request<OODProblem[]>('/api/ood'),
  getOODById: (id: number) => request<OODProblem>(`/api/ood/${id}`),
  deleteOOD: (id: number) => request<{ ok: boolean }>(`/api/ood/${id}`, { method: 'DELETE' }),

  // System Design
  getSystemDesign: () => request<SystemDesignProblem[]>('/api/system-design'),
  getSystemDesignById: (id: number) => request<SystemDesignProblem>(`/api/system-design/${id}`),
  getSystemDesignRequirements: (id: number) => request<{ functional_reqs: string[]; non_functional_reqs: string[] }>(`/api/system-design/${id}/requirements`),
  getStepFeedback: (id: number, step_key: string, step_label: string, user_answer: string, previous_steps?: Record<string, string>) =>
    request<{ feedback: string }>(`/api/system-design/${id}/step-feedback`, {
      method: 'POST', body: JSON.stringify({ step_key, step_label, user_answer, previous_steps }),
    }),
  sendInterviewChat: (id: number, messages: { role: string; content: string }[]) =>
    request<{ reply: string }>(`/api/system-design/${id}/chat`, {
      method: 'POST', body: JSON.stringify({ messages }),
    }),
  deleteSystemDesign: (id: number) => request<{ ok: boolean }>(`/api/system-design/${id}`, { method: 'DELETE' }),

  // Reviews (unified)
  submitReview: (item_type: ItemType, item_id: number, user_answer: string, step_data?: Record<string, string>) =>
    request<Review>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ item_type, item_id, user_answer, step_data }),
    }),
  getReviewHistory: (itemType: ItemType, itemId: number) =>
    request<Review[]>(`/api/reviews/${itemType}/${itemId}`),

  // Settings
  getSettings: () => request<Settings>('/api/settings'),
  updateSettings: (s: Partial<SettingsUpdate>) => request<{ ok: boolean }>('/api/settings', {
    method: 'PUT', body: JSON.stringify(s),
  }),
};

export interface Settings {
  providers: { id: string; name: string; needsApiKey: boolean }[];
  active_provider: string;
  openai_api_key: string;
  openai_model: string;
  gemini_api_key: string;
  gemini_model: string;
}

export interface SettingsUpdate {
  active_provider: string;
  openai_api_key: string;
  openai_model: string;
  gemini_api_key: string;
  gemini_model: string;
}
