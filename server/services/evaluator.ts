import { spawn } from 'child_process';

interface EvaluationResult {
  score: number;
  evaluation: string;
}

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('/opt/homebrew/bin/claude', ['-p', '--output-format', 'text'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PATH: process.env.PATH },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(stderr || stdout || `claude exited with code ${code}`));
      else resolve(stdout.trim());
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn claude: ${err.message}`));
    });

    proc.stdin.write(prompt);
    proc.stdin.end();
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

Respond using EXACTLY this structure (keep the headers and SCORE line exactly as shown):

SCORE: <1-5>

## Verdict
<1-2 sentences: what they got right and what they missed>

## Thought Process
<Walk through how an expert would think about this problem step by step. Start from reading the problem, identifying patterns, choosing the approach, and arriving at the solution. This should teach the student HOW to think, not just WHAT the answer is.>

## Tricky Parts
<Bullet points highlighting the non-obvious parts, common pitfalls, and edge cases that make this problem hard. These are the things that are easy to forget or get wrong.>

## Suggestions
<Concrete suggestions for what the student should focus on to improve their recall. Reference specific parts of their answer.>

## Follow-up Questions
<3 short questions that test deeper understanding of the underlying concepts. These should make the student think beyond just memorizing the solution.>

---

Scoring guide:
- 5: Perfect — correct algorithm, complexity, edge cases
- 4: Strong — right approach, minor gaps
- 3: Partial — right direction, missing key insights
- 2: Weak — vague, significant gaps
- 1: No recall — wrong approach

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
  const evaluation = text.replace(/SCORE:\s*\d\s*/, '').trim();

  return { score: Math.min(5, Math.max(1, score)), evaluation };
}
