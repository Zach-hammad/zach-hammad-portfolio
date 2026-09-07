# Zacharia Hammad — portfolio

A static portfolio for AI product engineering, runtime systems, and computer architecture. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Local development

```sh
bun install
bun run dev
```

Open http://localhost:3000. The homepage and résumé are rendered to HTML; project notes use native disclosure controls. Personal photo galleries are interactive.

## Content owners

- `src/data/proof.ts`: positioning, RepoToire, and contact shortcuts.
- `src/data/professional.ts`: Generalized employer case studies: Computer Vision, AI Memory, and Voice Agents.
- `src/data/projects.ts`: public architecture projects and source links.
- `src/data/resume.ts` and `public/resume-zacharia-hammad.pdf`: web résumé and PDF download. Update both together.
- `src/data/personal.ts`: personal stories and photos; ASIC coursework lives in `src/components/sections/FoundationsSection.tsx`.

Page composition lives in `src/app/page.tsx`; the visual system lives in `src/app/globals.css`. Diagrams describe conceptual flows and should not be presented as product screenshots or measured hardware results. Keep prototype and coursework boundaries explicit when updating project descriptions.

## Verification and hosting

```sh
bun run lint
bun run build
bun run audit
```

The build exports the site to `out/`. The audit checks exported routes, headings, canonical URLs, local links and anchors, the résumé PDF, and personal image assets. It requires a fresh build. Browser verification covers responsive layout, keyboard navigation, project disclosures, photo controls, and the résumé link.

`netlify.toml` configures Netlify to publish `out/`. Use a static file server with clean HTML routes to preview the export; `next start` does not serve this static-export configuration. A successful local build does not publish the website.
