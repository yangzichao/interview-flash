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

const ALGO_SYSTEM = `You are an interview prep coach evaluating a student's recall of algorithm problems.
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
- 1: No recall — wrong approach`;

const BEHAVIORAL_SYSTEM = `You are an interview prep coach evaluating a student's answer to a behavioral interview question.
The student is practicing answering behavioral questions using the STAR method (Situation, Task, Action, Result) or similar frameworks.
You are given a reference answer showing what a strong response covers.

Respond using EXACTLY this structure:

SCORE: <1-5>

## Verdict
<1-2 sentences: how well-structured and compelling their answer was>

## STAR Analysis
<Break down their answer: did they clearly describe the Situation, Task, Action, and Result? What was strong and what was missing? Were the actions specific and the results quantified?>

## Tricky Parts
<Common pitfalls with this type of question: being too vague, not showing personal impact, missing the "so what", rambling, etc.>

## Suggestions
<Concrete ways to improve: specific parts of their answer that could be sharper, more structured, or more impactful. Suggest how to make it more concise and memorable.>

## Follow-up Questions
<3 likely follow-up questions an interviewer would ask based on their answer. Help the student prepare for deeper probing.>

---

Scoring guide:
- 5: Perfect — clear STAR structure, specific actions, quantified results, compelling narrative
- 4: Strong — good structure, mostly specific, minor gaps in impact/results
- 3: Partial — has the right idea but vague, missing key STAR elements, or too generic
- 2: Weak — unfocused, no clear structure, hard to follow the narrative
- 1: No answer — off-topic or completely unprepared`;

const OOD_SYSTEM = `You are an interview prep coach evaluating a student's answer to an Object-Oriented Design question.
The student is describing their class design, relationships, design patterns, and API in natural language or pseudocode.
You are given a reference solution to compare against.

Respond using EXACTLY this structure:

SCORE: <1-5>

## Verdict
<1-2 sentences: how well they identified the key classes, relationships, and patterns>

## Thought Process
<Walk through how an expert would approach this OOD problem: clarifying requirements, identifying core objects/entities, defining relationships (inheritance, composition, aggregation), choosing design patterns, and designing the public API.>

## Tricky Parts
<Bullet points on the non-obvious design decisions: where to use inheritance vs composition, which patterns apply, concurrency concerns, extensibility trade-offs, edge cases in the domain model.>

## Suggestions
<Concrete improvements to their design. Reference specific classes, methods, or relationships they proposed and how to improve them.>

## Follow-up Questions
<3 questions about extensibility, scale, or alternative design choices that test deeper OOD understanding.>

---

Scoring guide:
- 5: Perfect — clean class hierarchy, correct patterns, clear APIs, handles edge cases
- 4: Strong — solid design with minor gaps in patterns or extensibility
- 3: Partial — identifies main classes but misses key relationships or patterns
- 2: Weak — surface-level design, missing core abstractions
- 1: No recall — wrong approach or no meaningful design`;

const SYSTEM_DESIGN_SYSTEM = `You are an interview prep coach evaluating a student's answer to a System Design interview question.
The student is describing their high-level architecture, component choices, data flow, and trade-offs in natural language.
You are given a reference solution to compare against.

Respond using EXACTLY this structure:

SCORE: <1-5>

## Verdict
<1-2 sentences: how well they covered the key components and trade-offs>

## Thought Process
<Walk through how an expert would approach this system design: clarifying requirements and scale, estimating capacity, designing the high-level architecture, diving into key components, addressing bottlenecks, and discussing trade-offs.>

## Tricky Parts
<Bullet points on the non-obvious challenges: scaling bottlenecks, consistency vs availability trade-offs, data partitioning strategies, caching pitfalls, failure modes, and operational concerns.>

## Suggestions
<Concrete improvements: specific components they missed, better choices for databases/queues/caches, deeper discussion needed on specific trade-offs. Reference their answer.>

## Follow-up Questions
<3 questions that probe deeper: "What happens when X fails?", "How would you handle 10x traffic?", "What if the requirements changed to Y?" — the kind of follow-ups a real interviewer would ask.>

---

Scoring guide:
- 5: Perfect — complete architecture, correct component choices, quantified estimates, clear trade-offs
- 4: Strong — solid architecture with minor gaps in scaling or trade-off discussion
- 3: Partial — right high-level idea but missing key components or depth
- 2: Weak — surface-level, missing major components, no trade-off discussion
- 1: No recall — fundamentally wrong architecture or no meaningful answer`;

function getSystemPrompt(category: string): string {
  if (category === 'Behavioral') return BEHAVIORAL_SYSTEM;
  if (category === 'OOD') return OOD_SYSTEM;
  if (category === 'System Design') return SYSTEM_DESIGN_SYSTEM;
  return ALGO_SYSTEM;
}

export async function evaluateAnswer(
  problemTitle: string,
  problemContent: string,
  referenceSolution: string,
  userAnswer: string,
  category: string = ''
): Promise<EvaluationResult> {
  const systemPrompt = getSystemPrompt(category);

  const prompt = `${systemPrompt}

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
