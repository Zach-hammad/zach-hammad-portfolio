# Native Resume Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native `/resume` page that renders the resume inside the portfolio design system and keeps the PDF available as a download.

**Architecture:** Store resume content in a focused data module, render it through a dedicated App Router page, and update existing link data so `[resume]` opens `/resume`. Keep PDF delivery as a static asset at `/resume-zacharia-hammad.pdf`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, existing portfolio components.

---

### Task 1: Add Resume Page Audit Coverage

**Files:**
- Modify: `scripts/audit-checks.mjs`

- [ ] **Step 1: Add assertions before implementation**

```js
assert(
  existsSync(path.join(root, "src/app/resume/page.tsx")),
  "Native resume route should exist at /resume"
);

const resumePage = read("src/app/resume/page.tsx");
for (const requiredResumeText of [
  "TopBar",
  "Professional Experience",
  "Technical Skills",
  "Visionary Solutions",
  "Repotoire",
  "Drexel University",
  "/resume-zacharia-hammad.pdf",
]) {
  assert(
    resumePage.includes(requiredResumeText),
    `Resume page missing required text: ${requiredResumeText}`
  );
}
```

- [ ] **Step 2: Run audit to verify it fails**

Run: `bun run audit`

Expected: FAIL with `Native resume route should exist at /resume`.

### Task 2: Add Structured Resume Data

**Files:**
- Create: `src/data/resume.ts`
- Modify: `src/data/contact.ts`

- [ ] **Step 1: Create resume data**

Add `src/data/resume.ts` exporting the resume profile, summary, skill groups, experience entries, projects, education, and action links. Content should match `/Users/zachariahammad/Documents/Resume_Zacharia_Hammad.pdf`.

- [ ] **Step 2: Update contact paths**

Set `contact.resume` to `/resume` and add `contact.resumePdf` as `/resume-zacharia-hammad.pdf`.

### Task 3: Render Native Resume Route

**Files:**
- Create: `src/app/resume/page.tsx`

- [ ] **Step 1: Build the page**

Render `TopBar`, `DragonCurveBackground`, resume header, action links, summary, skills, experience, projects, and education. Use existing mono typography, neutral borders, and purple accent details.

- [ ] **Step 2: Keep PDF download visible**

The page must include a link to `contact.resumePdf` labeled `[download pdf]`.

### Task 4: Verify And Deploy

**Files:**
- Test: `scripts/audit-checks.mjs`

- [ ] **Step 1: Run checks**

Run: `bun run lint`, `bun run audit`, `bun run build`, and `git diff --check`.

- [ ] **Step 2: Verify exported route**

Confirm `out/resume/index.html` contains `/resume-zacharia-hammad.pdf`, `Visionary Solutions`, `Technical Skills`, and `Professional Experience`.

- [ ] **Step 3: Commit and push**

Commit the native resume page and push `main` so Netlify deploys it.
