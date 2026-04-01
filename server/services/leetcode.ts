interface LeetCodeProblem {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  content: string;
  topicTags: { name: string }[];
}

export async function fetchProblem(slug: string): Promise<LeetCodeProblem> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            titleSlug
            difficulty
            content
            topicTags { name }
          }
        }
      `,
      variables: { titleSlug: slug },
    }),
  });

  if (!res.ok) {
    throw new Error(`LeetCode API error: ${res.status}`);
  }

  const data = await res.json();
  if (!data.data?.question) {
    throw new Error(`Problem not found: ${slug}`);
  }

  return data.data.question;
}

export function slugFromInput(input: string): string {
  input = input.trim();

  // Handle full URLs like https://leetcode.com/problems/two-sum/
  const urlMatch = input.match(/leetcode\.com\/problems\/([a-z0-9-]+)/);
  if (urlMatch) return urlMatch[1];

  // Handle slug directly
  if (/^[a-z0-9-]+$/.test(input)) return input;

  // Handle title-like input: "Two Sum" -> "two-sum"
  return input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
