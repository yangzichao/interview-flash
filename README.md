# Interview Flash

AI-powered interview prep — practice algorithms, behavioral, OOD, and system design with instant LLM feedback.

## Features

- **4 interview categories** — Algorithms, Behavioral (STAR), Object-Oriented Design, System Design
- **Multiple practice modes** — Guided step-by-step, Quick review, Mock interview (conversational)
- **LLM evaluation** — Instant scoring (1-5) with detailed feedback, thought process, and follow-up questions
- **Follow-up practice** — Click any follow-up question to keep practicing
- **Spaced repetition** — SM-2 algorithm schedules reviews based on your performance
- **Dashboard** — Score trends, topic radar, activity heatmap, weakness analysis
- **Language selection** — Choose your preferred programming language for algorithm feedback
- **Multi-provider** — Claude, OpenAI, Gemini (CLI subscription or API key)
- **350+ problems** — Pre-seeded with Blind 75, Grind 169, NeetCode 150, and more
- **Local-first** — SQLite database, runs entirely on your machine

## Quick Start

```bash
git clone https://github.com/your-username/interview-flash.git
cd interview-flash
npm install
npm run seed    # populate database with 350+ problems
npm run dev     # start client + server
```

Open http://localhost:5173

## LLM Setup

Interview Flash supports 6 LLM providers. Pick one:

| Provider | Setup | Cost |
|----------|-------|------|
| **Claude CLI** | Install [claude](https://docs.anthropic.com/en/docs/claude-code) CLI | Subscription (Max/Pro) |
| **Claude API** | Add API key in Settings | Pay-per-use |
| **Codex CLI** | Install [codex](https://github.com/openai/codex) CLI | Subscription (Plus/Pro) |
| **OpenAI API** | Add API key in Settings | Pay-per-use |
| **Gemini CLI** | Install [gemini](https://github.com/google-gemini/gemini-cli) CLI | Free |
| **Gemini API** | Add API key in Settings | Free tier available |

Default: Claude CLI. Change in **Settings** tab.

## Tech Stack

- **Frontend** — React 19, TypeScript, Tailwind CSS, Recharts
- **Backend** — Express 5, TypeScript, better-sqlite3
- **LLM** — Anthropic SDK, OpenAI SDK, Google Generative AI SDK
- **Algorithm** — SM-2 spaced repetition

## Project Structure

```
src/
  components/          # React components
    system-design/     # System design mode sub-components
  lib/
    api.ts             # API client + TypeScript types
    ui.tsx             # Shared UI utilities (ScoreBadge, colors)
server/
  routes/              # Express API routes
  services/
    evaluator.ts       # LLM evaluation with category-specific prompts
    llm.ts             # Multi-provider LLM abstraction
    srs.ts             # SM-2 spaced repetition engine
    queries.ts         # Shared database query helpers
  db.ts                # SQLite schema
  seed*.ts             # Problem seed data
docs/
  code-quality-learnings.md  # Codebase audit notes
```

## How It Works

1. **Pick a problem** from any category
2. **Choose a mode** — guided (step-by-step with coaching), quick (single submit), or mock interview
3. **Write your answer** — describe your approach, design, or behavioral story
4. **Get AI feedback** — score, verdict, thought process, suggestions, follow-up questions
5. **Practice follow-ups** — click any follow-up to keep going
6. **Track progress** — Dashboard shows trends, strengths/weaknesses, and what to review next
7. **Spaced repetition** — the app schedules your next review based on how well you did

## License

MIT
