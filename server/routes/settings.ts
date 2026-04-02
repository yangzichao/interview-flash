import { Router } from 'express';
import { PROVIDERS, getSetting, setSetting } from '../services/llm.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    providers: PROVIDERS,
    active_provider: getSetting('llm_provider') || 'claude-cli',
    // API keys (masked)
    claude_api_key: getSetting('claude_api_key') ? '••••••••' : '',
    claude_model: getSetting('claude_model') || 'claude-sonnet-4-20250514',
    openai_api_key: getSetting('openai_api_key') ? '••••••••' : '',
    openai_model: getSetting('openai_model') || 'gpt-4o',
    gemini_api_key: getSetting('gemini_api_key') ? '••••••••' : '',
    gemini_model: getSetting('gemini_model') || 'gemini-2.0-flash',
  });
});

router.put('/', (req, res) => {
  const { active_provider, claude_api_key, claude_model, openai_api_key, openai_model, gemini_api_key, gemini_model } = req.body;

  if (active_provider) {
    const valid = PROVIDERS.some(p => p.id === active_provider);
    if (!valid) return res.status(400).json({ error: `Invalid provider: ${active_provider}` });
    setSetting('llm_provider', active_provider);
  }

  if (claude_api_key && claude_api_key !== '••••••••') setSetting('claude_api_key', claude_api_key);
  if (claude_model) setSetting('claude_model', claude_model);
  if (openai_api_key && openai_api_key !== '••••••••') setSetting('openai_api_key', openai_api_key);
  if (openai_model) setSetting('openai_model', openai_model);
  if (gemini_api_key && gemini_api_key !== '••••••••') setSetting('gemini_api_key', gemini_api_key);
  if (gemini_model) setSetting('gemini_model', gemini_model);

  res.json({ ok: true });
});

export default router;
