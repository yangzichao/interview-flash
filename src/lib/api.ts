const BASE = '/api';

export type ProblemType = 'algorithm' | 'behavioral' | 'ood' | 'system-design';

export interface Problem {
  id: number;
  leetcode_id: number;
  title: string;
  slug: string;
  type: ProblemType;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
  lists: string;
  added_at: string;
  last_reviewed: string | null;
  last_score: number | null;
}

export interface Review {
  id: number;
  problem_id: number;
  user_answer: string;
  evaluation: string;
  score: number;
  reviewed_at: string;
}

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  getProblems: () => request<Problem[]>('/problems'),
  getProblem: (id: number) => request<Problem>(`/problems/${id}`),
  addProblem: (input: string) => request<Problem>('/problems', {
    method: 'POST',
    body: JSON.stringify({ input }),
  }),
  deleteProblem: (id: number) => request<{ ok: boolean }>(`/problems/${id}`, {
    method: 'DELETE',
  }),
  submitReview: (problem_id: number, user_answer: string) =>
    request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ problem_id, user_answer }),
    }),
  getReviewHistory: (problemId: number) =>
    request<Review[]>(`/reviews/problem/${problemId}`),
};
