import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Audit the exported pages that will actually be hosted. Run after the build.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "out");
const origin = "https://zachariahammad.com";
const routes = new Map([
  ["/", "index.html"],
  ["/resume", "resume.html"],
]);
const pages = new Map();

for (const [route, file] of routes) {
  const location = path.join(output, file);
  assert(existsSync(location), "Run bun run build before bun run audit.");
  const html = readFileSync(location, "utf8").replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  pages.set(route, html);
  assert.equal(
    [...html.matchAll(/<h1\b/g)].length,
    1,
    `${route}: expected one h1`,
  );
  assert(html.includes('lang="en"'), `${route}: missing document language`);
  assert(
    html.includes('name="viewport"'),
    `${route}: missing responsive viewport`,
  );
  assert(
    html.includes('id="main-content"'),
    `${route}: skip-link target missing`,
  );
  assert(
    html.includes(
      `rel="canonical" href="${origin}${route === "/" ? "" : route}"`,
    ) || html.includes(`rel="canonical" href="${origin}${route}"`),
    `${route}: incorrect canonical`,
  );

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${route}: duplicate element ids`,
  );
  for (const title of html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/g)) {
    assert(title[1].trim(), `${route}: exported page or SVG title is empty`);
  }
  for (const image of html.matchAll(/<img\b([^>]+)>/g)) {
    assert(/\balt="/.test(image[1]), `${route}: image missing alt attribute`);
  }
}

let localLinks = 0;
for (const [route, html] of pages) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    assert(href && href !== "#", `${route}: empty or placeholder link`);
    const target = new URL(href, origin + route);
    if (target.origin !== origin) continue;
    localLinks++;
    const pathname = decodeURIComponent(target.pathname);
    const page = pages.get(pathname);
    if (page !== undefined) {
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1));
        assert(page.includes(`id="${id}"`), `${route}: broken anchor ${href}`);
      }
    } else {
      const asset = path.join(output, pathname);
      assert(
        asset.startsWith(output + path.sep),
        "Asset escapes export directory",
      );
      assert(existsSync(asset), `${route}: missing exported asset ${href}`);
    }
  }
}

const pdf = readFileSync(path.join(output, "resume-zacharia-hammad.pdf"));
assert.equal(
  pdf.subarray(0, 5).toString(),
  "%PDF-",
  "Résumé download must be a PDF",
);
console.log(
  `Export audit passed: ${pages.size} pages, ${localLinks} local links, and PDF. Browser checks cover visual layout and interactions.`,
);
