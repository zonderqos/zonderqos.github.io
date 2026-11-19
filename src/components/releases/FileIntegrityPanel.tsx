import React, { useState } from 'react';
import { Check, Copy, FileCheck2, Info, ShieldCheck, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { NormalizedRelease } from '@/types/releases';

interface FileIntegrityPanelProps {
  releases: ReadonlyArray<NormalizedRelease>;
}

export function FileIntegrityPanel({ releases }: FileIntegrityPanelProps): React.ReactElement {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isoEntries = releases.flatMap((rel) =>
    rel.isoAssets.map((asset) => ({
      releaseName: rel.name,
      tagName: rel.tagName,
      hasSignedSignatureAsset: rel.hasSignedSignatureAsset,
      asset,
    })),
  );

  const hasAnySignedRelease = isoEntries.some((e) => e.hasSignedSignatureAsset);
  const sampleFilename = isoEntries[0]?.asset.name ?? 'ZonderqOS.iso';

  const linuxCommand = `sha256sum ${sampleFilename}`;
  const windowsCommand = `Get-FileHash .\\${sampleFilename} -Algorithm SHA256`;

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <Card className="border-emerald-500/35 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="zq-text-primary text-lg font-extrabold">
              File Integrity Verification (SHA-256 Checksum Guide)
            </h3>
            <p className="zq-text-secondary text-xs">
              Verify that your downloaded ISO image matches the official digest published in GitHub
              Releases metadata
            </p>
          </div>
        </div>
        <Badge variant="implemented" className="font-mono text-xs">
          GitHub Asset Digest Metadata
        </Badge>
      </div>

      {/* Published ISO SHA-256 Digest List */}
      <div className="mt-6 space-y-3">
        {isoEntries.length === 0 ? (
          <p className="zq-text-muted font-mono text-xs">
            No downloadable ISO assets are currently available to verify.
          </p>
        ) : (
          isoEntries.map(({ releaseName, tagName, asset }) => (
            <div
              key={asset.id}
              className="zq-surface-elevated flex flex-col justify-between gap-3 rounded-xl p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="zq-text-primary font-mono text-sm font-bold">{asset.name}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {releaseName} ({tagName})
                  </Badge>
                  <span className="zq-text-muted font-mono text-xs">
                    {asset.sizeFormatted.combined}
                  </span>
                </div>
                {asset.sha256 ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <FileCheck2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <code className="break-all font-mono text-xs text-emerald-300">
                      {asset.sha256}
                    </code>
                  </div>
                ) : (
                  <p className="zq-text-muted mt-1 font-mono text-xs">
                    No SHA-256 digest published in GitHub asset metadata for this file.
                  </p>
                )}
              </div>

              {asset.sha256 && (
                <button
                  type="button"
                  onClick={() => copyText(`sha-${asset.id}`, asset.sha256!)}
                  aria-label={`Copy SHA-256 digest for ${asset.name}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-slate-900/90 px-3 py-2 font-mono text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 cursor-pointer"
                >
                  {copiedKey === `sha-${asset.id}` ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied SHA-256</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy SHA-256</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Linux & Windows Verification Commands */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="zq-surface-elevated rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-blue-300">
              <Terminal className="h-3.5 w-3.5" />
              <span>Linux / macOS Terminal Verification</span>
            </span>
            <button
              type="button"
              onClick={() => copyText('cmd-linux', linuxCommand)}
              aria-label="Copy Linux sha256sum command"
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 font-mono text-[11px] text-slate-300 transition hover:border-blue-500 hover:text-white cursor-pointer"
            >
              {copiedKey === 'cmd-linux' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="mt-2.5 overflow-x-auto rounded-lg border border-slate-800 bg-[#060911] p-3 font-mono text-xs text-slate-200">
            <code>{linuxCommand}</code>
          </pre>
          <p className="zq-text-muted mt-2 text-xs leading-relaxed">
            Run this command in the directory containing your downloaded ISO and compare the 64-char
            hexadecimal output with the official SHA-256 digest shown above.
          </p>
        </div>

        <div className="zq-surface-elevated rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-purple-300">
              <Terminal className="h-3.5 w-3.5" />
              <span>Windows PowerShell Verification</span>
            </span>
            <button
              type="button"
              onClick={() => copyText('cmd-win', windowsCommand)}
              aria-label="Copy Windows PowerShell Get-FileHash command"
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 font-mono text-[11px] text-slate-300 transition hover:border-purple-500 hover:text-white cursor-pointer"
            >
              {copiedKey === 'cmd-win' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="mt-2.5 overflow-x-auto rounded-lg border border-slate-800 bg-[#060911] p-3 font-mono text-xs text-slate-200">
            <code>{windowsCommand}</code>
          </pre>
          <p className="zq-text-muted mt-2 text-xs leading-relaxed">
            PowerShell displays the <code className="font-mono text-purple-300">Hash</code> column
            in uppercase hexadecimal. Case differences do not affect hash equality.
          </p>
        </div>
      </div>

      {/* Honest Security Scope Distinction (SHA-256 vs Cryptographic Signature) */}
      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3.5 text-xs leading-relaxed">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div className="zq-text-secondary">
          <strong className="zq-text-primary">Security Verification Scope:</strong> A SHA-256 digest
          verifies file integrity against transfer corruption or incomplete downloads from GitHub
          Releases. It does not by itself represent a detached cryptographic private-key signature.{' '}
          {hasAnySignedRelease
            ? 'Detached signature artifacts (.sig / .asc) are available in the Release Asset Explorer above.'
            : 'No detached Ed25519/GPG signature artifact (.sig / .asc) is attached to the current Alpha release in the GitHub API.'}
        </div>
      </div>
    </Card>
  );
}
