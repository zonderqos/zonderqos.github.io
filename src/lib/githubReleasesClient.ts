import { normalizeGitHubReleases } from '@/lib/releaseFormatters';
import type { DownloadSnapshotDataset, NormalizedRelease } from '@/types/releases';

export const GITHUB_RELEASES_API_URL =
  'https://api.github.com/repos/dwierzbicki11/ZOnderqOS/releases';
export const SNAPSHOTS_JSON_URL = '/data/download-snapshots.json';

const CACHE_STORAGE_KEY = 'zonderqos-github-releases-cache-v2';
export const DEFAULT_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes automatic cache freshness

export interface CachedReleasesPayload {
  fetchedAt: string;
  releases: NormalizedRelease[];
  pagesFetched: number;
}

export interface FetchReleasesResult {
  releases: NormalizedRelease[];
  fetchedAt: string;
  pagesFetched: number;
  fromCache: boolean;
  isStaleCache: boolean;
  rateLimitRemaining: number | null;
  rateLimitResetAt: string | null;
  errorMessage: string | null;
}

export function readReleasesCache(): CachedReleasesPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedReleasesPayload;
    if (!parsed || typeof parsed.fetchedAt !== 'string' || !Array.isArray(parsed.releases)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeReleasesCache(payload: CachedReleasesPayload): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota errors
  }
}

export function hasNextPageLink(linkHeader: string | null): boolean {
  if (!linkHeader) return false;
  return /<[^>]+>;\s*rel="next"/i.test(linkHeader);
}

export async function fetchAllGitHubReleasesPaginated(options?: {
  forceRefresh?: boolean;
  perPage?: number;
  maxPages?: number;
  fetchImpl?: typeof fetch;
}): Promise<FetchReleasesResult> {
  const forceRefresh = options?.forceRefresh ?? false;
  const perPage = options?.perPage ?? 100;
  const maxPages = options?.maxPages ?? 10;
  const fetchFn = options?.fetchImpl ?? fetch;

  const cached = readReleasesCache();
  if (!forceRefresh && cached) {
    const ageMs = Date.now() - new Date(cached.fetchedAt).getTime();
    if (ageMs >= 0 && ageMs < DEFAULT_CACHE_TTL_MS) {
      return {
        releases: cached.releases,
        fetchedAt: cached.fetchedAt,
        pagesFetched: cached.pagesFetched,
        fromCache: true,
        isStaleCache: false,
        rateLimitRemaining: null,
        rateLimitResetAt: null,
        errorMessage: null,
      };
    }
  }

  const allRawReleases: unknown[] = [];
  let pagesFetched = 0;
  let rateLimitRemaining: number | null = null;
  let rateLimitResetAt: string | null = null;
  let partialError: string | null = null;

  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = `${GITHUB_RELEASES_API_URL}?per_page=${perPage}&page=${page}`;
      const response = await fetchFn(url, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      });

      const remHeader = response.headers.get('x-ratelimit-remaining');
      if (remHeader !== null && !Number.isNaN(Number(remHeader))) {
        rateLimitRemaining = Number(remHeader);
      }

      const resetHeader = response.headers.get('x-ratelimit-reset');
      if (resetHeader !== null && !Number.isNaN(Number(resetHeader))) {
        rateLimitResetAt = new Date(Number(resetHeader) * 1000).toISOString();
      }

      if (!response.ok) {
        const isRateLimited =
          response.status === 403 || response.status === 429 || rateLimitRemaining === 0;
        const message = isRateLimited
          ? `GitHub API rate limit reached (HTTP ${response.status})${
              rateLimitResetAt ? `. Resets at ${new Date(rateLimitResetAt).toUTCString()}.` : '.'
            }`
          : `GitHub Releases API returned HTTP ${response.status}.`;

        if (pagesFetched > 0) {
          partialError = `Partial pagination warning on page ${page}: ${message}`;
          break;
        }
        throw new Error(message);
      }

      const pageData: unknown = await response.json();
      if (!Array.isArray(pageData)) {
        throw new Error('Unexpected GitHub Releases API payload structure.');
      }

      if (pageData.length === 0) {
        if (page === 1) {
          pagesFetched = 1;
        }
        break;
      }

      pagesFetched += 1;
      allRawReleases.push(...pageData);

      const linkHeader = response.headers.get('link');
      const hasMore =
        linkHeader !== null ? hasNextPageLink(linkHeader) : pageData.length === perPage;
      if (!hasMore) {
        break;
      }
    }

    const releases = normalizeGitHubReleases(allRawReleases);
    const fetchedAt = new Date().toISOString();

    writeReleasesCache({
      fetchedAt,
      releases,
      pagesFetched,
    });

    return {
      releases,
      fetchedAt,
      pagesFetched,
      fromCache: false,
      isStaleCache: false,
      rateLimitRemaining,
      rateLimitResetAt,
      errorMessage: partialError,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unable to reach GitHub Releases API.';

    if (cached) {
      return {
        releases: cached.releases,
        fetchedAt: cached.fetchedAt,
        pagesFetched: cached.pagesFetched,
        fromCache: true,
        isStaleCache: true,
        rateLimitRemaining,
        rateLimitResetAt,
        errorMessage: `${errorMessage} Showing cached release snapshot from ${new Date(
          cached.fetchedAt,
        ).toUTCString()}.`,
      };
    }

    return {
      releases: [],
      fetchedAt: new Date().toISOString(),
      pagesFetched: 0,
      fromCache: false,
      isStaleCache: false,
      rateLimitRemaining,
      rateLimitResetAt,
      errorMessage,
    };
  }
}

export async function fetchDownloadSnapshotsDataset(
  fetchImpl?: typeof fetch,
): Promise<DownloadSnapshotDataset | null> {
  const fetchFn = fetchImpl ?? fetch;
  try {
    const response = await fetchFn(SNAPSHOTS_JSON_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as DownloadSnapshotDataset;
    if (!data || !Array.isArray(data.snapshots)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
