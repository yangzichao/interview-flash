import { spawn } from 'child_process';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import db from '../db.js';

export type ProviderId =
  | 'claude-cli'
  | 'claude-api'
  | 'codex-cli'
  | 'openai-api'
  | 'gemini-cli'
  | 'gemini-api';

export interface LLMProvider {
  id: ProviderId;
  group: string;
  name: string;
  description: string;
  needsApiKey: boolean;
  keyPlaceholder?: string;
}

export const PROVIDERS: LLMProvider[] = [
  // Claude
  {
    id: 'claude-cli',
    group: 'Anthropic',
    name: 'Claude CLI (Subscription)',
    description: 'Uses the claude CLI with your Max/Pro subscription. No API key needed.',
    needsApiKey: false,
  },
  {
    id: 'claude-api',
    group: 'Anthropic',
    name: 'Claude API (Pay-per-use)',
    description: 'Uses the Anthropic API directly. Key from console.anthropic.com.',
    needsApiKey: true,
    keyPlaceholder: 'sk-ant-...',
  },
  // OpenAI
  {
    id: 'codex-cli',
    group: 'OpenAI',
    name: 'Codex CLI (Subscription)',
    description: 'Uses the codex CLI with your ChatGPT Plus/Pro subscription. No API key needed.',
    needsApiKey: false,
  },
  {
    id: 'openai-api',
    group: 'OpenAI',
    name: 'OpenAI API (Pay-per-use)',
    description: 'Uses the OpenAI API directly. Key from platform.openai.com.',
    needsApiKey: true,
    keyPlaceholder: 'sk-...',
  },
  // Gemini
  {
    id: 'gemini-cli',
    group: 'Google',
    name: 'Gemini CLI (Subscription)',
    description: 'Uses the gemini CLI with your Google AI Pro/Ultra subscription. No API key needed.',
    needsApiKey: false,
  },
  {
    id: 'gemini-api',
    group: 'Google',
    name: 'Gemini API (Pay-per-use)',
    description: 'Uses the Gemini API directly. Free key from aistudio.google.com.',
    needsApiKey: true,
    keyPlaceholder: 'AI...',
  },
];

// ============================================================
// Settings helpers
// ============================================================

export function getSetting(key: string): string | null {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getActiveProvider(): ProviderId {
  return (getSetting('llm_provider') || 'claude-cli') as ProviderId;
}

function getApiKey(settingsKey: string, envVar: string): string {
  const fromSettings = getSetting(settingsKey);
  if (fromSettings) return fromSettings;
  if (process.env[envVar]) return process.env[envVar]!;
  return '';
}

// ============================================================
// CLI runner (shared by claude, codex, gemini)
// ============================================================

function runCLI(command: string, args: string[], prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PATH: process.env.PATH },
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(stderr || stdout || `${command} exited with code ${code}`));
      else resolve(stdout.trim());
    });
    proc.on('error', (err) => reject(new Error(`Failed to spawn ${command}: ${err.message}`)));

    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

// ============================================================
// Provider implementations
// ============================================================

function runClaudeCLI(prompt: string): Promise<string> {
  return runCLI('/opt/homebrew/bin/claude', ['-p', '--output-format', 'text'], prompt);
}

function runCodexCLI(prompt: string): Promise<string> {
  return runCLI('/opt/homebrew/bin/codex', ['-q', '--full-auto'], prompt);
}

function runGeminiCLI(prompt: string): Promise<string> {
  return runCLI('gemini', ['-p'], prompt);
}

async function runClaudeAPI(prompt: string): Promise<string> {
  const apiKey = getApiKey('claude_api_key', 'ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('Anthropic API key not configured. Go to Settings to add it.');

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });
  const model = getSetting('claude_model') || 'claude-sonnet-4-20250514';
  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0].type === 'text' ? response.content[0].text.trim() : '';
}

async function runOpenAI(prompt: string): Promise<string> {
  const apiKey = getApiKey('openai_api_key', 'OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured. Go to Settings to add it.');

  const client = new OpenAI({ apiKey });
  const model = getSetting('openai_model') || 'gpt-4o';
  const response = await client.chat.completions.create({
    model,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0]?.message?.content?.trim() || '';
}

async function runGemini(prompt: string): Promise<string> {
  const apiKey = getApiKey('gemini_api_key', 'GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured. Go to Settings to add it.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: getSetting('gemini_model') || 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ============================================================
// Unified interface
// ============================================================

export async function runLLM(prompt: string): Promise<string> {
  const provider = getActiveProvider();

  switch (provider) {
    case 'claude-cli': return runClaudeCLI(prompt);
    case 'claude-api': return runClaudeAPI(prompt);
    case 'codex-cli': return runCodexCLI(prompt);
    case 'openai-api': return runOpenAI(prompt);
    case 'gemini-cli': return runGeminiCLI(prompt);
    case 'gemini-api': return runGemini(prompt);
    default: throw new Error(`Unknown provider: ${provider}`);
  }
}
