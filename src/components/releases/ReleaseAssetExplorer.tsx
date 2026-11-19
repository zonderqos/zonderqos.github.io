import React, { useMemo, useState } from 'react';
import { Check, Copy, Disc, Download, FileArchive, FileCheck2, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { AssetCategory, NormalizedRelease, NormalizedReleaseAsset } from '@/types/releases';

interface ReleaseAssetExplorerProps {
  releases: ReadonlyArray<NormalizedRelease>;
}

interface FlattenedAssetRow {
  releaseId: number;
  releaseName: string;
  tagName: string;
  publishedAt: string;
  asset: NormalizedReleaseAsset;
}

const CATEGORY_FILTERS: Array<'ALL' | AssetCategory> = [
  'ALL',
  'Bootable ISO',
  'Checksum',
  'Signature',
  'Documentation',
  'Binary / Archive',
];

export function ReleaseAssetExplorer({ releases }: ReleaseAssetExplorerProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AssetCategory>('ALL');
  const [selectedExtension, setSelectedExtension] = useState<string>('ALL');
  const [copiedAssetId, setCopiedAssetId] = useState<number | null>(null);

  const allRows = useMemo<FlattenedAssetRow[]>(() => {
    const rows: FlattenedAssetRow[] = [];
    for (const rel of releases) {
      for (const asset of rel.assets) {
        rows.push({
          releaseId: rel.id,
          releaseName: rel.name,
          tagName: rel.tagName,
          publishedAt: rel.publishedAt,
          asset,
        });
      }
    }
    return rows;
  }, [releases]);

  const availableExtensions = useMemo<string[]>(() => {
    const set = new Set<string>();
    for (const r of allRows) {
      if (r.asset.extension) {
        set.add(r.asset.extension);
      }
    }
    return ['ALL', ...Array.from(set)];
  }, [allRows]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allRows.filter((row) => {
      if (selectedCategory !== 'ALL' && row.asset.category !== selectedCategory) {
        return false;
      }
      if (selectedExtension !== 'ALL' && row.asset.extension !== selectedExtension) {
        return false;
      }
      if (query) {
        const haystack =
          `${row.asset.name} ${row.tagName} ${row.releaseName} ${row.asset.category} ${row.asset.extension}`.toLowerCase();
        return haystack.includes(query);
      }
      return true;
    });
  }, [allRows, searchQuery, selectedCategory, selectedExtension]);

  const handleCopySha = async (assetId: number, sha: string) => {
    try {
      await navigator.clipboard.writeText(sha);
      setCopiedAssetId(assetId);
      window.setTimeout(() => setCopiedAssetId(null), 1800);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-500/20 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h3 className="zq-text-primary flex items-center gap-2 text-lg font-extrabold">
              <Disc className="h-5 w-5 text-[#3B82F6]" />
              <span>Release Asset Explorer</span>
            </h3>
            <p className="zq-text-secondary mt-0.5 text-xs">
              Inspect, filter, and download verified release artifacts directly from GitHub
              Releases. GitHub source archives (.zip / .tar.gz) are never conflated with bootable
              ISO assets.
            </p>
          </div>

          {/* Filename & Extension Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by filename or tag..."
              aria-label="Filter release assets by filename or tag"
              className="zq-surface-elevated zq-text-primary w-full rounded-xl py-2 pr-3 pl-9 font-mono text-xs focus:border-[#3B82F6] focus:outline-none"
            />
          </div>
        </div>

        {/* Category & Extension Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="zq-text-muted mr-1 inline-flex items-center gap-1 font-mono text-xs">
              <Filter className="h-3.5 w-3.5 text-[#3B82F6]" />
              Type:
            </span>
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition cursor-pointer',
                    isSelected
                      ? 'border-[#3B82F6] bg-blue-500/20 text-blue-300'
                      : 'zq-surface-elevated zq-text-secondary hover:border-blue-500/40',
                  )}
                >
                  {cat === 'ALL' ? 'All Types' : cat}
                </button>
              );
            })}
          </div>

          {availableExtensions.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="zq-text-muted font-mono text-xs">Ext:</span>
              {availableExtensions.map((ext) => {
                const isSelected = selectedExtension === ext;
                return (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => setSelectedExtension(ext)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition cursor-pointer',
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'zq-surface-elevated zq-text-secondary hover:border-purple-500/40',
                    )}
                  >
                    {ext === 'ALL' ? 'All Ext' : ext}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700/70 bg-slate-900/80 font-mono text-slate-300">
              <th className="px-4 py-3.5">File Name & Release</th>
              <th className="px-4 py-3.5">File Type</th>
              <th className="px-4 py-3.5">File Size (MB / MiB)</th>
              <th className="px-4 py-3.5">Download Count</th>
              <th className="px-4 py-3.5">SHA-256 Digest</th>
              <th className="px-4 py-3.5 text-right">Download Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="zq-text-muted px-4 py-8 text-center font-mono text-xs">
                  No published release assets match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredRows.map(({ releaseName, tagName, asset }) => (
                <tr key={asset.id} className="transition hover:bg-slate-800/30">
                  <td className="px-4 py-4">
                    <div className="zq-text-primary font-mono text-sm font-bold">{asset.name}</div>
                    <div className="zq-text-muted mt-0.5 font-mono text-[11px]">
                      {releaseName} ({tagName}) • Ext: {asset.extension}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={asset.isIso ? 'implemented' : 'default'}
                      className="font-mono text-[11px]"
                    >
                      {asset.category}
                    </Badge>
                  </td>
                  <td className="zq-text-secondary px-4 py-4 font-mono">
                    <div>{asset.sizeFormatted.combined}</div>
                    <div className="zq-text-muted text-[10px]">
                      {asset.sizeBytes.toLocaleString('en-US')} bytes
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono">
                    <span className="font-bold text-emerald-400">
                      {asset.downloadCount.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono">
                    {asset.sha256 ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 text-emerald-300"
                          title={`sha256:${asset.sha256}`}
                        >
                          <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {asset.sha256.slice(0, 10)}…{asset.sha256.slice(-8)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySha(asset.id, asset.sha256!)}
                          aria-label={`Copy SHA-256 digest for ${asset.name}`}
                          className="rounded-md border border-slate-700 bg-slate-800 p-1 text-slate-300 transition hover:border-emerald-500 hover:text-white cursor-pointer"
                        >
                          {copiedAssetId === asset.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="zq-text-muted">Not published</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button href={asset.browserDownloadUrl} variant="primary" size="sm">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Source Archive Separation Note */}
      <div className="border-t border-slate-800 bg-slate-950/50 px-5 py-3 font-mono text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <FileArchive className="h-3.5 w-3.5 text-purple-400" />
          <span>
            Note: Only artifacts explicitly present in the GitHub Releases{' '}
            <code className="text-blue-300">assets[]</code> array are listed above. Auto-generated
            GitHub source archives (.zip / .tar.gz) are accessible inside each release card.
          </span>
        </span>
      </div>
    </Card>
  );
}
