# Native Resume Page Design

## Goal

Render Zacharia Hammad's resume as a native portfolio page instead of sending recruiters directly to the PDF. Keep the existing dark mono portfolio style, fixed navbar, bracket-link vocabulary, and recruiter-friendly scan path.

## User-Approved Direction

Use a dedicated `/resume` route. The page should render the resume content in structured sections: header, summary, technical skills, professional experience, projects, and education. Existing resume links should point to `/resume`, while the PDF remains available from the page as a download/open action.

## Architecture

Create structured resume data in `src/data/resume.ts` so page rendering is declarative and easy to update. Add `src/app/resume/page.tsx` for the route and reuse `TopBar`, `DragonCurveBackground`, and existing styling patterns. Update contact/proof link data so `[resume]` navigates to the rendered page and expose a separate PDF URL for download.

## UI

The resume page should feel like the site, not a PDF embed:

- Fixed `TopBar` at the top.
- Narrow resume content column for readability.
- Section labels using the existing `// LABEL` convention.
- Bordered blocks with subtle left accents matching current proof/project cards.
- Compact text and skill tokens for recruiter scanning.
- Top action links for `[portfolio]`, `[download pdf]`, `[linkedin]`, `[github]`, and `[email]`.

## Testing

Extend `scripts/audit-checks.mjs` to assert that `/resume` exists, the page uses `TopBar`, the rendered page includes key resume sections, and the PDF remains present at `/resume-zacharia-hammad.pdf`. Verify with `bun run lint`, `bun run audit`, `bun run build`, and a browser/curl check against the local or exported route.
