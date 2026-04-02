import { useState, useEffect } from 'react'
import { api } from '../lib/api'

interface ProviderDef {
  id: string
  group: string
  name: string
  description: string
  needsApiKey: boolean
  keyPlaceholder?: string
}

interface SettingsData {
  providers: ProviderDef[]
  active_provider: string
  claude_api_key: string
  claude_model: string
  openai_api_key: string
  openai_model: string
  gemini_api_key: string
  gemini_model: string
}

const groupColors: Record<string, string> = {
  Anthropic: 'border-orange-500/30',
  OpenAI: 'border-green-500/30',
  Google: 'border-blue-500/30',
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [provider, setProvider] = useState('')
  const [claudeKey, setClaudeKey] = useState('')
  const [claudeModel, setClaudeModel] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [openaiModel, setOpenaiModel] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [geminiModel, setGeminiModel] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then((s: SettingsData) => {
      setData(s)
      setProvider(s.active_provider)
      setClaudeKey(s.claude_api_key)
      setClaudeModel(s.claude_model)
      setOpenaiKey(s.openai_api_key)
      setOpenaiModel(s.openai_model)
      setGeminiKey(s.gemini_api_key)
      setGeminiModel(s.gemini_model)
    }).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true); setMessage('')
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active_provider: provider,
          claude_api_key: claudeKey,
          claude_model: claudeModel,
          openai_api_key: openaiKey,
          openai_model: openaiModel,
          gemini_api_key: geminiKey,
          gemini_model: geminiModel,
        }),
      })
      setMessage('Settings saved!')
      // Reload masked keys
      const s: SettingsData = await fetch('/api/settings').then(r => r.json())
      setClaudeKey(s.claude_api_key)
      setOpenaiKey(s.openai_api_key)
      setGeminiKey(s.gemini_api_key)
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!data) return <div className="text-zinc-500">Loading settings...</div>

  // Group providers by vendor
  const groups = data.providers.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = []
    acc[p.group].push(p)
    return acc
  }, {} as Record<string, ProviderDef[]>)

  // Which API config to show
  const showClaudeConfig = provider === 'claude-api'
  const showOpenaiConfig = provider === 'openai-api'
  const showGeminiConfig = provider === 'gemini-api'

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>

      <h3 className="text-sm font-medium text-zinc-300 mb-4">LLM Provider</h3>

      <div className="space-y-6 mb-8">
        {Object.entries(groups).map(([group, providers]) => (
          <div key={group}>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{group}</span>
            <div className="mt-2 space-y-2">
              {providers.map(p => (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 bg-zinc-900 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    provider === p.id
                      ? `${groupColors[group] || 'border-emerald-500/30'} bg-zinc-900`
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p.id}
                    checked={provider === p.id}
                    onChange={() => setProvider(p.id)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{p.name}</span>
                      {!p.needsApiKey && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          No key needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Claude API config */}
      {showClaudeConfig && (
        <ConfigSection title="Claude API Configuration">
          <KeyInput value={claudeKey} onChange={setClaudeKey} placeholder="sk-ant-..." />
          <ModelSelect value={claudeModel} onChange={setClaudeModel} options={[
            ['claude-sonnet-4-20250514', 'Claude Sonnet 4'],
            ['claude-opus-4-20250514', 'Claude Opus 4'],
            ['claude-haiku-4-20250506', 'Claude Haiku 4'],
          ]} />
        </ConfigSection>
      )}

      {/* OpenAI API config */}
      {showOpenaiConfig && (
        <ConfigSection title="OpenAI API Configuration">
          <KeyInput value={openaiKey} onChange={setOpenaiKey} placeholder="sk-..." />
          <ModelSelect value={openaiModel} onChange={setOpenaiModel} options={[
            ['gpt-4o', 'GPT-4o'],
            ['gpt-4o-mini', 'GPT-4o Mini'],
            ['gpt-4.1', 'GPT-4.1'],
            ['gpt-4.1-mini', 'GPT-4.1 Mini'],
            ['o3-mini', 'o3-mini'],
          ]} />
        </ConfigSection>
      )}

      {/* Gemini API config */}
      {showGeminiConfig && (
        <ConfigSection title="Gemini API Configuration">
          <KeyInput value={geminiKey} onChange={setGeminiKey} placeholder="AI..." />
          <ModelSelect value={geminiModel} onChange={setGeminiModel} options={[
            ['gemini-2.0-flash', 'Gemini 2.0 Flash'],
            ['gemini-2.5-pro-preview-06-05', 'Gemini 2.5 Pro'],
            ['gemini-2.5-flash-preview-05-20', 'Gemini 2.5 Flash'],
          ]} />
        </ConfigSection>
      )}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message && (
          <span className={`text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  )
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 space-y-4">
      <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
      {children}
    </div>
  )
}

function KeyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">API Key</label>
      <input type="password" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
    </div>
  )
}

function ModelSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[][] }) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1">Model</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors">
        {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
      </select>
    </div>
  )
}
