import type {
  AssetCategory,
  DualSizeFormatted,
  GitHubReleaseAssetRaw,
  GitHubReleaseRaw,
  NormalizedRelease,
  NormalizedReleaseAsset,
  ReleaseChannelClassification,
  ReleaseDashboardStats,
  VersionDownloadBreakdown,
} from '@/types/releases';

const REPO_WEB_BASE = 'https://github.com/dwierzbicki11/ZOnderqOS';

export function formatBytesDual(bytes: number): DualSizeFormatted {
  const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
  const mb = `${(safeBytes / 1_000_000).toFixed(2)} MB`;
  const mib = `${(safeBytes / (1024 * 1024)).toFixed(2)} MiB`;
  return {
    mb,
    mib,
    combined: `${mb} / ${mib}`,
  };
}

export function extractSha256Digest(digest?: string | null): string | null {
  if (!digest || typeof digest !== 'string') {
    return null;
  }
  const trimmed = digest.trim();
  if (trimmed.toLowerCase().startsWith('sha256:')) {
    const hash = trimmed.slice(7).trim().toLowerCase();
    return /^[a-f0-9]{64}$/.test(hash) ? hash : null;
  }
  if (/^[a-f0-9]{64}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return null;
}

export function getFileExtension(filename: string): string {
  const lower = filename.trim().toLowerCase();
  if (lower.endsWith('.tar.gz')) return '.tar.gz';
  if (lower.endsWith('.iso.sha256')) return '.sha256';
  if (lower.endsWith('.iso.sig')) return '.sig';
  const lastDot = lower.lastIndexOf('.');
  if (lastDot === -1 || lastDot === lower.length - 1) {
    return '';
  }
  return lower.slice(lastDot);
}

export function classifyAssetType(name: string, contentType?: string): AssetCategory {
  const lower = name.trim().toLowerCase();
  const ext = getFileExtension(lower);
  const mime = (contentType ?? '').toLowerCase();

  if (ext === '.iso' || mime.includes('iso')) {
    return 'Bootable ISO';
  }
  if (
    ext === '.sha256' ||
    ext === '.sha512' ||
    ext === '.md5' ||
    lower.includes('checksum') ||
    lower.includes('sha256sum')
  ) {
    return 'Checksum';
  }
  if (ext === '.sig' || ext === '.asc' || ext === '.minisig' || lower.includes('signature')) {
    return 'Signature';
  }
  if (ext === '.md' || ext === '.txt' || ext === '.pdf' || ext === '.html') {
    return 'Documentation';
  }
  return 'Binary / Archive';
}

export function classifyReleaseChannel(
  tagName: string,
  releaseName: string,
  body: string,
): ReleaseChannelClassification {
  const combined = `${tagName} ${releaseName}`.toLowerCase();
  if (combined.includes('alfa') || combined.includes('alpha')) {
    return 'Alpha';
  }
  if (combined.includes('beta')) {
    return 'Beta';
  }
  if (/\brc\d*\b/.test(combined) || combined.includes('release candidate')) {
    return 'Release Candidate';
  }
  const bodyLower = body.toLowerCase();
  if (bodyLower.includes('alpha release') || bodyLower.includes('alpha 1.0')) {
    return 'Alpha';
  }
  if (bodyLower.includes('beta release')) {
    return 'Beta';
  }
  return 'Stable';
}

export function normalizeReleaseAsset(
  raw: GitHubReleaseAssetRaw,
  fallbackId: number,
): NormalizedReleaseAsset | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : null;
  const browserDownloadUrl =
    typeof raw.browser_download_url === 'string' && raw.browser_download_url.trim()
      ? raw.browser_download_url.trim()
      : null;

  if (!name || !browserDownloadUrl) {
    return null;
  }

  const extension = getFileExtension(name);
  const contentType =
    typeof raw.content_type === 'string' && raw.content_type.trim()
      ? raw.content_type.trim()
      : 'application/octet-stream';
  const category = classifyAssetType(name, contentType);
  const isIso = category === 'Bootable ISO';
  const sizeBytes = typeof raw.size === 'number' && raw.size >= 0 ? raw.size : 0;
  const downloadCount =
    typeof raw.download_count === 'number' && raw.download_count >= 0 ? raw.download_count : 0;
  const rawDigest = typeof raw.digest === 'string' && raw.digest.trim() ? raw.digest.trim() : null;
  const sha256 = extractSha256Digest(rawDigest);

  return {
    id: typeof raw.id === 'number' ? raw.id : fallbackId,
    name,
    label: typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : null,
    extension: extension || 'binary',
    category,
    isIso,
    contentType,
    state: typeof raw.state === 'string' ? raw.state : 'uploaded',
    sizeBytes,
    sizeFormatted: formatBytesDual(sizeBytes),
    downloadCount,
    sha256,
    rawDigest,
    browserDownloadUrl,
    createdAt: typeof raw.created_at === 'string' ? raw.created_at : '',
    updatedAt: typeof raw.updated_at === 'string' ? raw.updated_at : '',
    uploaderLogin:
      raw.uploader && typeof raw.uploader.login === 'string' ? raw.uploader.login : 'dwierzbicki11',
    uploaderUrl:
      raw.uploader && typeof raw.uploader.html_url === 'string'
        ? raw.uploader.html_url
        : 'https://github.com/dwierzbicki11',
  };
}

export function normalizeGitHubReleases(rawInput: unknown): NormalizedRelease[] {
  if (!Array.isArray(rawInput)) {
    return [];
  }

  const normalized: NormalizedRelease[] = [];

  for (let i = 0; i < rawInput.length; i++) {
    const raw = rawInput[i] as GitHubReleaseRaw;
    if (!raw || typeof raw !== 'object') {
      continue;
    }

    // Do not display unpublished draft releases
    if (raw.draft === true) {
      continue;
    }

    const tagName =
      typeof raw.tag_name === 'string' && raw.tag_name.trim() ? raw.tag_name.trim() : null;
    if (!tagName) {
      continue;
    }

    const name =
      typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : `ZonderqOS ${tagName}`;
    const bodyMarkdown = typeof raw.body === 'string' ? raw.body.replace(/\r\n/g, '\n').trim() : '';
    const channel = classifyReleaseChannel(tagName, name, bodyMarkdown);

    const rawAssets = Array.isArray(raw.assets) ? raw.assets : [];
    const assets: NormalizedReleaseAsset[] = [];
    for (let j = 0; j < rawAssets.length; j++) {
      const asset = normalizeReleaseAsset(rawAssets[j], j + 1);
      if (asset) {
        assets.push(asset);
      }
    }

    const isoAssets = assets.filter((a) => a.isIso);
    const primaryIsoAsset = isoAssets[0] ?? null;
    const totalAssetDownloads = assets.reduce((sum, a) => sum + a.downloadCount, 0);
    const totalIsoDownloads = isoAssets.reduce((sum, a) => sum + a.downloadCount, 0);
    const hasSignedSignatureAsset = assets.some((a) => a.category === 'Signature');

    const publishedAt =
      typeof raw.published_at === 'string' && raw.published_at
        ? raw.published_at
        : typeof raw.created_at === 'string'
          ? raw.created_at
          : '';

    normalized.push({
      id: typeof raw.id === 'number' ? raw.id : i + 1,
      name,
      version: tagName,
      tagName,
      targetCommitish:
        typeof raw.target_commitish === 'string' && raw.target_commitish
          ? raw.target_commitish
          : 'main',
      publishedAt,
      createdAt: typeof raw.created_at === 'string' ? raw.created_at : publishedAt,
      updatedAt: typeof raw.updated_at === 'string' ? raw.updated_at : publishedAt,
      authorLogin:
        raw.author && typeof raw.author.login === 'string' ? raw.author.login : 'dwierzbicki11',
      authorUrl:
        raw.author && typeof raw.author.html_url === 'string'
          ? raw.author.html_url
          : 'https://github.com/dwierzbicki11',
      authorAvatarUrl:
        raw.author && typeof raw.author.avatar_url === 'string' ? raw.author.avatar_url : '',
      channel,
      isGitHubPrerelease: Boolean(raw.prerelease),
      isDraft: Boolean(raw.draft),
      htmlUrl:
        typeof raw.html_url === 'string' && raw.html_url
          ? raw.html_url
          : `${REPO_WEB_BASE}/releases/tag/${encodeURIComponent(tagName)}`,
      apiTarballUrl: typeof raw.tarball_url === 'string' ? raw.tarball_url : null,
      apiZipballUrl: typeof raw.zipball_url === 'string' ? raw.zipball_url : null,
      githubWebZipUrl: `${REPO_WEB_BASE}/archive/refs/tags/${encodeURIComponent(tagName)}.zip`,
      githubWebTarGzUrl: `${REPO_WEB_BASE}/archive/refs/tags/${encodeURIComponent(tagName)}.tar.gz`,
      bodyMarkdown,
      assets,
      isoAssets,
      primaryIsoAsset,
      totalAssetDownloads,
      totalIsoDownloads,
      hasSignedSignatureAsset,
    });
  }

  normalized.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return normalized;
}

export function computeReleaseDashboardStats(
  releases: ReadonlyArray<NormalizedRelease>,
): ReleaseDashboardStats {
  const totalPublishedReleases = releases.length;
  const totalIsoDownloads = releases.reduce((sum, r) => sum + r.totalIsoDownloads, 0);
  const totalAllAssetDownloads = releases.reduce((sum, r) => sum + r.totalAssetDownloads, 0);
  const availableIsoImagesCount = releases.reduce((sum, r) => sum + r.isoAssets.length, 0);

  const latestPublishedRelease = releases[0] ?? null;
  const latestDownloadableRelease = releases.find((r) => r.primaryIsoAsset !== null) ?? null;
  const latestReleaseIsoDownloads = latestDownloadableRelease
    ? latestDownloadableRelease.totalIsoDownloads
    : 0;

  let mostDownloadedRelease: ReleaseDashboardStats['mostDownloadedRelease'] = null;
  for (const r of releases) {
    if (
      !mostDownloadedRelease ||
      r.totalIsoDownloads > mostDownloadedRelease.isoDownloads ||
      (r.totalIsoDownloads === mostDownloadedRelease.isoDownloads &&
        r.totalAssetDownloads > mostDownloadedRelease.totalDownloads)
    ) {
      mostDownloadedRelease = {
        release: r,
        isoDownloads: r.totalIsoDownloads,
        totalDownloads: r.totalAssetDownloads,
      };
    }
  }

  const denominator = totalIsoDownloads > 0 ? totalIsoDownloads : totalAllAssetDownloads;

  const downloadsByVersion: VersionDownloadBreakdown[] = releases.map((r) => {
    const metric = totalIsoDownloads > 0 ? r.totalIsoDownloads : r.totalAssetDownloads;
    const sharePercentage = denominator > 0 ? Number(((metric / denominator) * 100).toFixed(1)) : 0;

    return {
      releaseId: r.id,
      tagName: r.tagName,
      releaseName: r.name,
      channel: r.channel,
      isGitHubPrerelease: r.isGitHubPrerelease,
      isoDownloads: r.totalIsoDownloads,
      totalDownloads: r.totalAssetDownloads,
      sharePercentage,
      publishedAt: r.publishedAt,
      primaryIsoName: r.primaryIsoAsset?.name ?? null,
      primaryIsoSize: r.primaryIsoAsset?.sizeFormatted.combined ?? null,
    };
  });

  return {
    totalIsoDownloads,
    totalAllAssetDownloads,
    latestReleaseIsoDownloads,
    latestDownloadableRelease,
    latestPublishedRelease,
    totalPublishedReleases,
    availableIsoImagesCount,
    mostDownloadedRelease,
    downloadsByVersion,
  };
}

export interface ParsedReleaseNoteSection {
  heading: string | null;
  lines: Array<{ type: 'paragraph' | 'feature' | 'status'; title?: string; text: string }>;
}

export function parseAndSanitizeReleaseNotes(markdown: string): ParsedReleaseNoteSection[] {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  const rawLines = markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const sections: ParsedReleaseNoteSection[] = [];
  let currentSection: ParsedReleaseNoteSection = { heading: null, lines: [] };

  const knownSectionHeaders = new Set([
    'key features',
    'development status',
    'changelog',
    'whats new',
    "what's new",
    'known limitations',
    'highlights',
  ]);

  for (const rawLine of rawLines) {
    const strippedMarkdownHeading = rawLine.replace(/^#{1,6}\s+/, '').trim();
    const isExplicitMarkdownHeading = /^#{1,6}\s+/.test(rawLine);
    const isKnownStandaloneHeader = knownSectionHeaders.has(strippedMarkdownHeading.toLowerCase());

    if (isExplicitMarkdownHeading || isKnownStandaloneHeader) {
      if (currentSection.heading !== null || currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: strippedMarkdownHeading,
        lines: [],
      };
      continue;
    }

    const cleanedBullet = rawLine.replace(/^[-*•]\s+/, '').trim();

    // Detect "Feature Name — Description"
    const emDashParts = cleanedBullet.split(/\s+[—–]\s+/);
    if (emDashParts.length === 2 && emDashParts[0].length <= 48) {
      currentSection.lines.push({
        type: 'feature',
        title: emDashParts[0].replace(/\*\*/g, '').trim(),
        text: emDashParts[1].replace(/\*\*/g, '').trim(),
      });
      continue;
    }

    // Detect "Stage: Status" lines inside Development Status
    const colonParts = cleanedBullet.split(/:\s+/);
    if (
      colonParts.length === 2 &&
      colonParts[0].length <= 28 &&
      (currentSection.heading?.toLowerCase().includes('status') ||
        /^(alpha|beta|release candidate|stable)/i.test(colonParts[0]))
    ) {
      currentSection.lines.push({
        type: 'status',
        title: colonParts[0].replace(/\*\*/g, '').trim(),
        text: colonParts[1].replace(/\*\*/g, '').trim(),
      });
      continue;
    }

    currentSection.lines.push({
      type: 'paragraph',
      text: cleanedBullet.replace(/\*\*/g, ''),
    });
  }

  if (currentSection.heading !== null || currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}
