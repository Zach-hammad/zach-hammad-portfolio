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
  const exported = readFileSync(location, "utf8");
  const html = exported.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  pages.set(route, html);
  const meta = (name) => {
    const tags = [...html.matchAll(/<meta\b[^>]*>/g)];
    const tag = tags.find(([value]) =>
      value.includes(`name="${name}"`) || value.includes(`property="${name}"`),
    );
    return tag?.[0].match(/content="([^"]*)"/)?.[1];
  };
  const pageTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(pageTitle && meta("description"), `${route}: missing search metadata`);
  assert.equal(meta("og:title"), pageTitle, `${route}: mismatched Open Graph title`);
  assert.equal(meta("twitter:title"), pageTitle, `${route}: inherited social title`);
  assert(!meta("robots")?.includes("noindex"), `${route}: indexing is disabled`);
  assert.equal(meta("twitter:card"), "summary_large_image");
  const imageUrl = new URL(meta("og:image"));
  assert.equal(imageUrl.origin, origin, `${route}: preview must use the public origin`);
  assert.equal(meta("twitter:image"), imageUrl.href, `${route}: mismatched preview`);
  assert(meta("og:image:alt"), `${route}: missing preview description`);
  const image = readFileSync(path.join(output, imageUrl.pathname));
  assert.equal(image.subarray(1, 4).toString(), "PNG", `${route}: preview must be PNG`);
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);

  const schemas = [...exported.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )].map((match) => JSON.parse(match[1]));
  assert.equal(schemas.length, 1, `${route}: expected one profile schema`);
  const profile = schemas[0];
  assert.equal(profile["@type"], "ProfilePage");
  assert.equal(profile.url, new URL(route, origin).href);
  assert.equal(profile.mainEntity["@type"], "Person");
  assert(html.includes(profile.mainEntity.name), `${route}: schema name is not visible`);
  for (const url of profile.mainEntity.sameAs) {
    assert(html.includes(`href="${url}"`), `${route}: schema profile link is not visible`);
  }
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
  `Export audit passed: ${pages.size} pages, ${localLinks} local links, PDF, search metadata, profile schema, and 1200 × 630 social preview. Browser checks cover visual layout and interactions.`,
);
