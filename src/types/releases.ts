export type ReleaseChannelClassification = 'Alpha' | 'Beta' | 'Release Candidate' | 'Stable';

export type AssetCategory =
  'Bootable ISO' | 'Checksum' | 'Signature' | 'Documentation' | 'Binary / Archive';

export interface GitHubAuthorRaw {
  login?: string;
  id?: number;
  avatar_url?: string;
  html_url?: string;
  type?: string;
}

export interface GitHubReleaseAssetRaw {
  id?: number;
  url?: string;
  name?: string;
  label?: string | null;
  uploader?: GitHubAuthorRaw | null;
  content_type?: string;
  state?: string;
  size?: number;
  digest?: string | null;
  download_count?: number;
  created_at?: string;
  updated_at?: string;
  browser_download_url?: string;
}

export interface GitHubReleaseRaw {
  id?: number;
  url?: string;
  assets_url?: string;
  html_url?: string;
  tag_name?: string;
  target_commitish?: string;
  name?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  author?: GitHubAuthorRaw | null;
  assets?: GitHubReleaseAssetRaw[];
  tarball_url?: string | null;
  zipball_url?: string | null;
  body?: string | null;
}

export interface DualSizeFormatted {
  mb: string;
  mib: string;
  combined: string;
}

export interface NormalizedReleaseAsset {
  id: number;
  name: string;
  label: string | null;
  extension: string;
  category: AssetCategory;
  isIso: boolean;
  contentType: string;
  state: string;
  sizeBytes: number;
  sizeFormatted: DualSizeFormatted;
  downloadCount: number;
  sha256: string | null;
  rawDigest: string | null;
  browserDownloadUrl: string;
  createdAt: string;
  updatedAt: string;
  uploaderLogin: string;
  uploaderUrl: string;
}

export interface NormalizedRelease {
  id: number;
  name: string;
  version: string;
  tagName: string;
  targetCommitish: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  authorLogin: string;
  authorUrl: string;
  authorAvatarUrl: string;
  channel: ReleaseChannelClassification;
  isGitHubPrerelease: boolean;
  isDraft: boolean;
  htmlUrl: string;
  apiTarballUrl: string | null;
  apiZipballUrl: string | null;
  githubWebZipUrl: string;
  githubWebTarGzUrl: string;
  bodyMarkdown: string;
  assets: NormalizedReleaseAsset[];
  isoAssets: NormalizedReleaseAsset[];
  primaryIsoAsset: NormalizedReleaseAsset | null;
  totalAssetDownloads: number;
  totalIsoDownloads: number;
  hasSignedSignatureAsset: boolean;
}

export interface VersionDownloadBreakdown {
  releaseId: number;
  tagName: string;
  releaseName: string;
  channel: ReleaseChannelClassification;
  isGitHubPrerelease: boolean;
  isoDownloads: number;
  totalDownloads: number;
  sharePercentage: number;
  publishedAt: string;
  primaryIsoName: string | null;
  primaryIsoSize: string | null;
}

export interface ReleaseDashboardStats {
  totalIsoDownloads: number;
  totalAllAssetDownloads: number;
  latestReleaseIsoDownloads: number;
  latestDownloadableRelease: NormalizedRelease | null;
  latestPublishedRelease: NormalizedRelease | null;
  totalPublishedReleases: number;
  availableIsoImagesCount: number;
  mostDownloadedRelease: {
    release: NormalizedRelease;
    isoDownloads: number;
    totalDownloads: number;
  } | null;
  downloadsByVersion: VersionDownloadBreakdown[];
}

export interface DownloadSnapshotEntry {
  timestamp: string;
  totalIsoDownloads: number;
  totalAssetDownloads: number;
  perRelease: Record<string, number>;
}

export interface DownloadSnapshotDataset {
  repository: string;
  schemaVersion: number;
  lastUpdated: string;
  note: string;
  snapshots: DownloadSnapshotEntry[];
}
