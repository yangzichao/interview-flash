import { execFile } from 'child_process';

interface EvaluationResult {
  score: number;
  evaluation: string;
}

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('claude', ['-p', prompt], { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout.trim());
    });
  });
}

export async function evaluateAnswer(
  problemTitle: string,
  problemContent: string,
  referenceSolution: string,
  userAnswer: string
): Promise<EvaluationResult> {
  const prompt = `You are a LeetCode coach evaluating a student's recall of algorithm problems.
The student is trying to recall how to solve a problem from memory. They will describe their approach in natural language, pseudocode, or a mix.
You are given a reference solution to compare against.

Your job:
1. Assess whether their approach would lead to a correct and efficient solution.
2. Rate their recall from 1-5:
   - 5: Perfect recall — correct algorithm, correct complexity, covers edge cases
   - 4: Strong recall — right approach with minor gaps
   - 3: Partial recall — right direction but missing key insights
   - 2: Weak recall — vaguely remembers but significant gaps
   - 1: No recall — wrong approach or completely off
3. Give concise, specific feedback: what they got right, what they missed, and the key insight they should remember.

Respond in this exact format:
SCORE: <number>
---
<your feedback in markdown>

## Problem: ${problemTitle}

${problemContent}

---

## Reference Solution:
${referenceSolution}

---

## Student's Answer:
${userAnswer}`;

  const text = await runClaude(prompt);

  const scoreMatch = text.match(/SCORE:\s*(\d)/);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 3;
  const evaluation = text.replace(/SCORE:\s*\d\s*---\s*/, '').trim();

  return { score: Math.min(5, Math.max(1, score)), evaluation };
}
