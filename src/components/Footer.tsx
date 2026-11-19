import React from 'react';
import { CheckCircle2, Disc, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { ZonderqLogo } from '@/assets/ZonderqLogo';
import { uiText } from '@/data/i18n';
import { useReleases } from '@/hooks/useReleases';
import type { NavSectionId } from '@/types/site';

const FOOTER_SECTIONS: NavSectionId[] = [
  'home',
  'features',
  'screenshots',
  'roadmap',
  'downloads',
  'development',
  'faq',
];

export function Footer(): React.ReactElement {
  const { stats } = useReleases();
  const latestPub = stats.latestPublishedRelease;

  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <ZonderqLogo />
              <div>
                <span className="text-lg font-extrabold text-white">
                  Zonderq<span className="text-[#3B82F6]">OS</span>
                </span>
                <p className="font-mono text-xs text-slate-400">
                  {latestPub
                    ? `Latest Release: ${latestPub.name} (${latestPub.tagName}) • Cosmos Kernel Gen3 (3.0.97)`
                    : 'v1.0.2-alpha.1 • Build 3120 • Cosmos Kernel Gen3 (3.0.97)'}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {uiText.footer.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  {uiText.footer.developmentStatusLabel}: {uiText.footer.developmentStatusValue}
                </span>
              </div>

              {latestPub && (
                <a
                  href="#downloads"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-blue-300 transition hover:bg-blue-500/25"
                >
                  <Disc className="h-3.5 w-3.5" />
                  <span>
                    Public ISO: {latestPub.tagName} ({stats.totalIsoDownloads} downloads)
                  </span>
                </a>
              )}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uiText.footer.verificationPolicy}</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
              {uiText.footer.sectionsTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_SECTIONS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-slate-400 transition hover:text-[#3B82F6] focus-visible:outline-none focus-visible:underline"
                  >
                    {uiText.nav.items[id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links Column */}
          <div className="md:col-span-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
              {uiText.footer.resourcesTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/dwierzbicki11/ZOnderqOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-[#3B82F6]"
                >
                  <span>ZonderqOS Kernel Repository (GitHub)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dwierzbicki11/ZOnderqOS/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-[#3B82F6]"
                >
                  <span>Official GitHub Releases & ISO Assets</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/dwierzbicki11/ZOnderqOS/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-[#3B82F6]"
                >
                  <span>Issue Tracker & Bug Reports</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/zonderqos/zonderqos.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-[#3B82F6]"
                >
                  <span>Website Repository (zonderqos.github.io)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>./verify-builds.sh</span>
              </div>
              <p className="mt-1">linux-x64 & linux-arm64 NativeAOT ELF verified</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>{uiText.footer.copyright}</p>
          <p className="font-mono">{uiText.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
