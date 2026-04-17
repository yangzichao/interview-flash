# Code Quality Audit & Refactoring Learnings

> Audit date: 2026-04-11  
> Scope: Full codebase review of Interview Flash (React + Express + SQLite)

---

## 1. Dead Code Removal

**Problem:** 3 files (697 total lines) were never imported or used anywhere in the application.

| File | Lines | Why it existed |
|------|-------|----------------|
| `src/components/ProblemList.tsx` | 339 | Legacy unified list view before split into 4 type-specific lists |
| `src/components/ReviewSession.tsx` | 294 | Legacy unified review before split into type-specific review components |
| `server/routes/problems.ts` | 64 | Legacy unified route before split into algorithms/behavioral/ood/system-design |

**Learning:** When you refactor a component into multiple specialized ones, delete the original immediately. Leaving it around "just in case" creates confusion and false positive grep results. The git history preserves it if you ever need it back.

**How to catch:** Run `grep -r "import.*from.*ComponentName"` periodically, or configure `eslint-plugin-unused-imports`.

---

## 2. DRY Violations — The ScoreBadge Pattern

**Problem:** The exact same `ScoreBadge` component (identical code, identical color array) was copy-pasted into 4 different list components. Same for `diffColor` map (6 copies) and `parseJson` helper (2 copies).

**Fix:** Created `src/lib/ui.tsx` with shared exports:
- `ScoreBadge` component
- `DIFFICULTY_COLORS` constant
- `LIST_COLORS` constant
- `parseJson` helper
- `sanitizeHtml` wrapper

**Learning:** When you add a new problem type (e.g., a 5th interview category), you'd need to update the same color array in 4+ files. The copy-paste approach silently diverges — one file gets updated, others don't. Single source of truth prevents this.

**Rule of thumb:** If the same 3+ lines appear in 3+ files, extract. But don't abstract things that are *similar* but serve different purposes.

---

## 3. Component Size & the 500-Line Warning

**Problem:** `SystemDesignReview.tsx` was 499 lines containing 4 distinct components (main orchestrator + 3 mode components). Each mode is independently testable and has its own state.

**Fix:** Split into:
```
src/components/
  SystemDesignReview.tsx        (75 lines — thin orchestrator)
  system-design/
    types.ts                    (shared types + step definitions)
    QuickMode.tsx               (35 lines)
    GuidedMode.tsx              (175 lines)
    MockInterviewMode.tsx       (130 lines)
```

**Learning:** The signal for splitting isn't raw line count — it's independent state. If a section of your component has its own `useState` calls that don't interact with the parent's state, it's a natural split point. The `mode === 'guided' && <GuidedMode />` pattern was the obvious seam.

**When NOT to split:** `Dashboard.tsx` (352 lines) has many sub-components, but they're all pure display components with no local state. Splitting them would add import boilerplate without improving readability.

---

## 4. Error Handling — Three Anti-Patterns

### 4a. `catch (e: any)`

**Problem:** 14 catch blocks used `e: any`, defeating TypeScript's purpose.

**Fix:** Created `getErrorMessage(err: unknown): string` utility that handles `Error` instances and falls back to `String(err)`. All catch blocks now use `catch (e)` with the utility.

**Learning:** TypeScript `catch` blocks receive `unknown` by default (with `useUnknownInCatchVariables`). Using `any` is a code smell. A single extraction function handles the pattern cleanly across the entire codebase.

### 4b. Silent `.catch(() => {})`

**Problem:** 10+ data-fetching calls silently swallow errors:
```ts
api.getOverview().then(setOverview).catch(() => {})
```

**Why it exists:** For non-critical data loading on mount, showing nothing is acceptable. The alternative — error toasts on every failed fetch — is worse UX.

**Assessment:** This is an acceptable tradeoff for a local-first app. In a production SaaS, you'd want error state tracking and retry mechanisms. For a personal tool, silent degradation (show what loaded, skip what didn't) is the pragmatic choice.

### 4c. No Error Boundary

**Problem:** A single component crash would white-screen the entire app.

**Fix:** Added `ErrorBoundary` component wrapping `<main>` in App.tsx. Shows error message + "Try Again" button.

---

## 5. SQL Query Deduplication

**Problem:** 4 route files had the exact same SQL pattern for fetching items with their latest review data:

```sql
SELECT t.*,
  (SELECT MAX(r.reviewed_at) FROM reviews r WHERE r.item_type = ? AND r.item_id = t.id) as last_reviewed,
  (SELECT r.score FROM reviews r WHERE r.item_type = ? AND r.item_id = t.id ORDER BY r.reviewed_at DESC LIMIT 1) as last_score
FROM {table} t
ORDER BY last_reviewed ASC NULLS FIRST
```

**Fix:** Created `server/services/queries.ts` with:
- `getItemsWithReviewData(type)` — shared SELECT with review join
- `getItemById(type, id)` — shared single-item lookup
- `deleteItem(type, id)` — shared cascade delete (reviews + srs_state + item)

**Bonus fix:** The old delete handlers forgot to clean up `srs_state` entries. The shared `deleteItem` now handles all cascade deletes correctly.

**Learning:** When you see the same SQL in multiple route files, the risk isn't just DRY violation — it's that fixes/enhancements to the query need to be applied N times. The `srs_state` cleanup was exactly this kind of bug.

---

## 6. Missing Database Indexes

**Problem:** The slug columns on all 4 problem tables had `UNIQUE` constraints but no explicit index for direct lookup.

**Fix:** Added indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_algorithms_slug ON algorithms(slug);
CREATE INDEX IF NOT EXISTS idx_behavioral_slug ON behavioral_questions(slug);
CREATE INDEX IF NOT EXISTS idx_ood_slug ON ood_problems(slug);
CREATE INDEX IF NOT EXISTS idx_sysdesign_slug ON system_design_problems(slug);
```

**Learning:** SQLite creates an implicit index for `UNIQUE` constraints, so this is technically redundant for correctness. But being explicit about indexes documents intent and makes it clear which queries are expected to be fast. With better-sqlite3, the overhead is zero.

---

## 7. XSS Defense with DOMPurify

**Problem:** 5 instances of `dangerouslySetInnerHTML={{ __html: item.content }}` rendering HTML from the database without sanitization.

**Risk assessment:** LOW — the HTML comes from LeetCode API (trusted) or seed data (we control). No user-supplied HTML enters the database through the current UI.

**Fix anyway:** Wrapped all instances with `DOMPurify.sanitize()` via a `sanitizeHtml()` utility in `src/lib/ui.tsx`.

**Learning:** Defense in depth. Today the data is trusted; tomorrow someone adds an "import from URL" feature and forgets to sanitize. The cost of `DOMPurify.sanitize()` on trusted data is ~0.1ms; the cost of forgetting when the trust boundary changes is an XSS vulnerability. Sanitize at the render boundary, not the ingest boundary.

---

## 8. Type System Alignment

**Problem:** Frontend `Settings` interface was missing the `preferred_language` field, requiring `as any` casts. The local `SettingsData` interface in `SettingsPage.tsx` diverged from the API's `Settings` type.

**Learning:** When a component defines its own interface for API data instead of importing the shared one, the two will drift apart. Single source of truth for types is even more important than for components — a type mismatch is silent until runtime.

---

## Summary: Refactoring Checklist

Use this before shipping or opening for contribution:

- [ ] **Dead code:** `grep -r "import.*from" src/ | sort | uniq` — any file not referenced?
- [ ] **DRY:** Same constant/component in 3+ files? Extract.
- [ ] **Component size:** File > 300 lines with independent state sections? Split.
- [ ] **Error types:** Any `catch (e: any)`? Use `unknown` + extraction.
- [ ] **SQL duplication:** Same query in 2+ routes? Create a shared helper.
- [ ] **Index coverage:** Every column used in `WHERE`/`JOIN` has an index?
- [ ] **HTML sanitization:** Every `dangerouslySetInnerHTML` uses `sanitizeHtml()`?
- [ ] **Error boundary:** App wraps content in `<ErrorBoundary>`?
- [ ] **Cascade deletes:** Deleting an item also cleans up reviews, SRS state, etc.?
- [ ] **Type alignment:** API types defined once, imported everywhere?

---

## Addendum: Self-Review Findings (Round 2)

A second review pass after the initial refactoring uncovered additional issues. These are common in "refactoring introduces new bugs" scenarios.

### 9. Race Condition in SQLite Read-Modify-Write

**Problem:** The `updateSRS()` function did: read SRS state -> compute new values -> write back. If two requests arrive simultaneously for the same item, one update is silently lost.

**Fix:** Wrapped the entire operation in `db.transaction()` using better-sqlite3's transaction API. SQLite's `BEGIN EXCLUSIVE` ensures the read-modify-write is atomic.

**Learning:** Any read-modify-write cycle on shared state needs a transaction. Even in SQLite (which serializes writes), the read can see stale data if another write happens between the read and the write. `db.transaction()` in better-sqlite3 handles this idiomatically.

### 10. Defensive JSON.parse

**Problem:** `JSON.parse(row.functional_reqs || '[]')` in the system-design requirements endpoint would crash if the JSON was malformed.

**Fix:** Wrapped in try-catch, fallback to empty array.

**Learning:** Any `JSON.parse` on database content should be wrapped. Database content can be corrupted by interrupted writes, manual edits, or migration bugs. The pattern `try { return JSON.parse(x); } catch { return fallback; }` should be automatic.

### 11. Fire-and-Forget API Calls

**Problem:** `api.updateSettings({ preferred_language: language }).catch(() => {})` was called without `await`, racing against the review submission.

**Fix:** Used `Promise.all()` to run both calls in parallel, ensuring both complete before proceeding.

**Learning:** Fire-and-forget is tempting for "nice to have" side effects, but it creates subtle bugs: the setting might not be saved if the user closes the tab, or the timing might matter for the next request. Either await it or don't call it.

### 12. Dynamic SQL Table Names Need Guards

**Problem:** `queries.ts` used template interpolation for table names (`FROM ${table}`). The table name comes from a whitelist, but if the lookup fails silently, `undefined` gets interpolated.

**Fix:** Added a `resolve()` function that throws explicitly if the type is not in the whitelist.

**Learning:** When you can't use parameterized queries (SQL doesn't allow parameterized table names), add an explicit throw before the interpolation. The pattern is: validate -> throw if invalid -> then interpolate. Never trust that the caller validated.

### Updated Checklist

- [ ] **Transactions:** Any read-modify-write on shared state wrapped in `db.transaction()`?
- [ ] **JSON.parse safety:** All `JSON.parse` on DB data has try-catch fallback?
- [ ] **Promise handling:** No fire-and-forget for calls whose success matters?
- [ ] **Dynamic SQL guards:** All interpolated table names validated with explicit throw?

---

## Addendum: Self-Review Findings (Round 3)

### 13. Missing Tailwind Plugin

**Problem:** The codebase uses `prose prose-invert prose-sm` classes extensively for rendering markdown content. The `@tailwindcss/typography` plugin — which provides these classes — was never installed.

**Impact:** All markdown rendered via `react-markdown` (evaluation feedback, weakness analysis, coaching responses) had no typography styling. Headings, lists, code blocks, and paragraphs all rendered as unstyled text.

**Fix:** `npm install -D @tailwindcss/typography` and added to `tailwind.config.js` plugins.

**Learning:** When using Tailwind utility classes that come from plugins (`prose`, `aspect-*`, `forms`), verify the plugin is actually installed. The classes silently do nothing if the plugin is missing — no build error, no runtime error, just broken visuals that are easy to miss if you're not comparing against a design spec.

### 14. Type Drift Between Server and Client

**Problem:** The server's `/api/settings` returns `claude_api_key` and `claude_model` fields, but the client's `Settings` interface didn't include them. `SettingsPage.tsx` worked around this with its own duplicate `SettingsData` interface.

**Fix:** Added the missing fields to the shared `Settings` and `SettingsUpdate` types. Rewrote `SettingsPage` to use the shared type (with `Omit` to extend the provider type with richer server data).

**Learning:** When the server returns more fields than the client type declares, TypeScript won't complain (extra fields are silently ignored). This makes it easy for types to drift apart. Solution: the server's response type should be the source of truth. If you can't share types at build time, at least make sure the client type is a superset of what it actually uses.

### 15. Raw `fetch()` vs API Helper Inconsistency

**Problem:** `SettingsPage` used raw `fetch('/api/settings')` while every other component used the `api.getSettings()` helper.

**Fix:** Replaced with `api.getSettings()` and `api.updateSettings()`.

**Learning:** Once you create an API abstraction layer, use it everywhere. Raw `fetch()` bypasses error handling, type checking, and any future middleware (auth headers, retry logic) that the abstraction provides.

### Updated Checklist

- [ ] **CSS plugins:** All Tailwind plugin classes (`prose`, `aspect-*`) have the plugin installed?
- [ ] **Type coverage:** Client types include all fields the server returns?
- [ ] **API consistency:** All components use the API helper, not raw `fetch()`?

---

## Addendum: Self-Review Findings (Round 4)

### 16. LLM API Response Null Safety

**Problem:** Both the Claude API and Gemini API response handlers assumed non-empty responses:
```typescript
// Claude — crashes if content array is empty
response.content[0].type === 'text' ? response.content[0].text.trim() : ''
// Gemini — crashes if response is null
result.response.text().trim()
```

**Fix:** Added optional chaining: `response.content?.[0]` and `result.response?.text()?.trim() || ''`.

**Learning:** LLM API responses can be empty or null in edge cases: rate limiting, content filtering, network timeouts. Always use optional chaining on API response bodies, even when the docs say the field "is always present". External APIs are the #1 source of null reference errors in production.

### 17. Cascade Delete Without Transaction

**Problem:** `deleteItem()` ran 3 separate DELETE statements (srs_state, reviews, item) without a transaction. A crash between any two leaves orphaned records.

**Fix:** Wrapped in `db.transaction()`.

**Learning:** Any operation that touches multiple tables should be wrapped in a transaction. This isn't just about race conditions — it's about crash safety. SQLite's WAL mode doesn't help if your process dies mid-sequence.

### 18. Deleted Item Ghosts in Analytics

**Problem:** When an item is deleted but its reviews remain (possible before the transaction fix), the weakness analysis query returns null titles. These got interpolated as the string "null" in the LLM prompt.

**Fix:** Added `.filter(r => r.title != null)` before building the prompt.

**Learning:** Any query that JOINs across tables with potential orphaned rows should handle NULL results. When building LLM prompts from database data, always validate the data before interpolation — LLMs interpret "null" literally.

### 19. Hardcoded CLI Paths

**Problem:** `runClaudeCLI` and `runCodexCLI` used `/opt/homebrew/bin/claude` — Mac Homebrew-specific. Linux users, or anyone with a different install path, would get "No such file or directory".

**Fix:** Changed to bare command names (`claude`, `codex`) so the shell's PATH resolution handles it.

**Learning:** Never hardcode absolute paths to executables. Use bare command names and let PATH do its job. If you need to verify a tool exists, use `which` or `command -v` at startup, not hardcoded paths at call time.

### Final Checklist Addition

- [ ] **API response safety:** All external API responses use optional chaining before property access?
- [ ] **Multi-table operations:** All operations touching 2+ tables wrapped in a transaction?
- [ ] **LLM prompt data:** All data interpolated into prompts validated for null/undefined?
- [ ] **No hardcoded paths:** All executable references use bare command names (PATH lookup)?
