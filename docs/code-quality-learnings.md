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
