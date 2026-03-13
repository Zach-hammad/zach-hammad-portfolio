import "server-only";

import { GitHubStats } from "./types";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CACHE_PATH = join(process.cwd(), ".github-cache.json");

type CacheData = Record<string, GitHubStats>;

async function readCache(): Promise<CacheData> {
  try {
    const data = await readFile(CACHE_PATH, "utf-8");
    return JSON.parse(data) as CacheData;
  } catch {
    return {};
  }
}

async function writeCache(cache: CacheData): Promise<void> {
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export async function fetchGitHubStats(
  repoUrl: string
): Promise<GitHubStats | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 86400 }, // 24 hours
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const data = await res.json();
    const stats: GitHubStats = {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
    };

    // Update cache on success
    const cache = await readCache();
    cache[repoUrl] = stats;
    await writeCache(cache);

    return stats;
  } catch {
    // Fall back to cache
    const cache = await readCache();
    return cache[repoUrl] ?? null;
  }
}

// Note: Concurrent fetches may race on cache writes. This is acceptable —
// the cache is best-effort and any individual write captures a valid snapshot.
// Correctness is not affected; only cache completeness on first build.
export async function fetchAllGitHubStats(
  repoUrls: string[]
): Promise<Map<string, GitHubStats>> {
  const results = new Map<string, GitHubStats>();
  const fetches = repoUrls.map(async (url) => {
    const stats = await fetchGitHubStats(url);
    if (stats) results.set(url, stats);
  });
  await Promise.all(fetches);
  return results;
}
