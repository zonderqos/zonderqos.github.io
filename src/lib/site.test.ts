import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateStageProgress, cn } from './utils.ts';
import { collectPolishViolations, containsPolishCharacters } from './languageAudit.ts';
import {
  classifyAssetType,
  classifyReleaseChannel,
  computeReleaseDashboardStats,
  extractSha256Digest,
  formatBytesDual,
  normalizeGitHubReleases,
  parseAndSanitizeReleaseNotes,
} from './releaseFormatters.ts';
import {
  computeDailyGrowthFromSnapshots,
  computeReleaseToReleaseComparisons,
  computeWeeklyGrowthFromSnapshots,
  mergeLiveObservationIntoSnapshots,
} from './snapshotAnalytics.ts';
import { fetchAllGitHubReleasesPaginated, hasNextPageLink } from './githubReleasesClient.ts';
import { featuresData } from '../data/features.ts';
import { roadmapData } from '../data/roadmap.ts';
import { screenshotsData, generationComparisonData } from '../data/screenshots.ts';
import {
  hardwareCompatibilityData,
  newsChangelogData,
  verifiedRepoMetrics,
} from '../data/development.ts';
import { faqData } from '../data/faq.ts';
import { uiText } from '../data/i18n.ts';
import {
  hostOsProfilesData,
  limineBootEntriesData,
  linuxDistroGuidesData,
  platformGuidesData,
  recommendedVmSpecsData,
  vmTroubleshootingData,
} from '../data/installationGuide.ts';
import { detectVmPackageAssets } from './vmAssetDetector.ts';

const REAL_ALPHA_RELEASE_PAYLOAD = {
  id: 451529377,
  html_url: 'https://github.com/dwierzbicki11/ZOnderqOS/releases/tag/v1.0.0-alfa',
  tag_name: 'v1.0.0-alfa',
  target_commitish: 'main',
  name: 'ZonderqOS-Alfa',
  draft: false,
  prerelease: false,
  created_at: '2026-11-18T19:55:03Z',
  updated_at: '2026-11-19T15:26:37Z',
  published_at: '2026-11-19T15:23:15Z',
  author: {
    login: 'dwierzbicki11',
    html_url: 'https://github.com/dwierzbicki11',
    avatar_url: 'https://avatars.githubusercontent.com/u/117636569?v=4',
  },
  assets: [
    {
      id: 768189140,
      name: 'ZonderqOS.iso',
      content_type: 'application/vnd.efi.iso',
      state: 'uploaded',
      size: 19013632,
      digest: 'sha256:4507333c4083caf26dd869b8275390ce3c72d3c70cc4838ad1350ef1c36e9fc8',
      download_count: 1,
      created_at: '2026-11-19T15:22:24Z',
      updated_at: '2026-11-19T15:22:29Z',
      browser_download_url:
        'https://github.com/dwierzbicki11/ZOnderqOS/releases/download/v1.0.0-alfa/ZonderqOS.iso',
      uploader: {
        login: 'dwierzbicki11',
        html_url: 'https://github.com/dwierzbicki11',
      },
    },
  ],
  tarball_url: 'https://api.github.com/repos/dwierzbicki11/ZOnderqOS/tarball/v1.0.0-alfa',
  zipball_url: 'https://api.github.com/repos/dwierzbicki11/ZOnderqOS/zipball/v1.0.0-alfa',
  body: 'ZonderqOS Alpha 1.0\r\n\r\nKey Features\r\n\r\nGraphical User Interface — Custom desktop environment.\r\n\r\nDevelopment Status\r\n\r\nAlpha: Completed\r\nBeta: Next Development Phase',
};

test('cn merges class names cleanly', () => {
  const isHidden = Boolean(0);
  assert.equal(cn('px-2', isHidden && 'hidden', 'px-4', 'text-white'), 'px-4 text-white');
});

test('Hero and Roadmap sections accurately reflect Alpha Completed (100%)', () => {
  assert.equal(uiText.hero.alphaHeading, 'ZonderqOS — Alpha Milestone Completed');
  assert.equal(
    uiText.hero.subtitle,
    'Built with C# and Cosmos Kernel Gen3. Moving towards the next generation of ZonderqOS.',
  );

  const alphaStage = roadmapData[0];
  assert.equal(alphaStage.status, 'Completed');
  assert.equal(alphaStage.phaseLabel, 'Alpha — Completed (100%)');
  assert.equal(calculateStageProgress(alphaStage.tasks).percentage, 100);
});

test('Existing Alpha ISO release normalizes correctly with MB/MiB size, SHA-256, and browser_download_url', () => {
  const releases = normalizeGitHubReleases([REAL_ALPHA_RELEASE_PAYLOAD]);
  assert.equal(releases.length, 1);

  const alpha = releases[0];
  assert.equal(alpha.name, 'ZonderqOS-Alfa');
  assert.equal(alpha.tagName, 'v1.0.0-alfa');
  assert.equal(alpha.channel, 'Alpha');
  assert.equal(alpha.isGitHubPrerelease, false);
  assert.equal(alpha.authorLogin, 'dwierzbicki11');
  assert.equal(alpha.totalIsoDownloads, 1);
  assert.ok(alpha.primaryIsoAsset);
  assert.equal(alpha.primaryIsoAsset.name, 'ZonderqOS.iso');
  assert.equal(alpha.primaryIsoAsset.sizeFormatted.mb, '19.01 MB');
  assert.equal(alpha.primaryIsoAsset.sizeFormatted.mib, '18.13 MiB');
  assert.equal(
    alpha.primaryIsoAsset.sha256,
    '4507333c4083caf26dd869b8275390ce3c72d3c70cc4838ad1350ef1c36e9fc8',
  );
  assert.equal(
    alpha.primaryIsoAsset.browserDownloadUrl,
    'https://github.com/dwierzbicki11/ZOnderqOS/releases/download/v1.0.0-alfa/ZonderqOS.iso',
  );
  assert.equal(
    alpha.githubWebZipUrl,
    'https://github.com/dwierzbicki11/ZOnderqOS/archive/refs/tags/v1.0.0-alfa.zip',
  );
});

test('Multiple versions, empty releases, releases without ISO files, and missing asset digests are handled properly', () => {
  // 1. Empty release list
  const emptyStats = computeReleaseDashboardStats(normalizeGitHubReleases([]));
  assert.equal(emptyStats.totalPublishedReleases, 0);
  assert.equal(emptyStats.totalIsoDownloads, 0);
  assert.equal(emptyStats.availableIsoImagesCount, 0);
  assert.equal(emptyStats.latestDownloadableRelease, null);
  assert.equal(emptyStats.mostDownloadedRelease, null);

  // 2. Multiple versions including a release without ISO and a release with missing digest
  const multiReleases = normalizeGitHubReleases([
    REAL_ALPHA_RELEASE_PAYLOAD,
    {
      id: 451529999,
      tag_name: 'v1.1.0-beta.1',
      name: 'ZonderqOS Beta 1',
      draft: false,
      prerelease: true,
      published_at: '2026-12-01T12:00:00Z',
      assets: [
        {
          id: 901,
          name: 'ZonderqOS-Beta1.iso',
          size: 20971520,
          digest: null, // missing digest
          download_count: 19,
          browser_download_url:
            'https://github.com/dwierzbicki11/ZOnderqOS/releases/download/v1.1.0-beta.1/ZonderqOS-Beta1.iso',
        },
        {
          id: 902,
          name: 'RELEASE-NOTES.md',
          size: 4096,
          digest: null,
          download_count: 5,
          browser_download_url:
            'https://github.com/dwierzbicki11/ZOnderqOS/releases/download/v1.1.0-beta.1/RELEASE-NOTES.md',
        },
      ],
    },
    {
      id: 451530000,
      tag_name: 'v1.1.0-docs',
      name: 'ZonderqOS Documentation Bundle',
      draft: false,
      prerelease: false,
      published_at: '2026-12-02T12:00:00Z',
      assets: [
        {
          id: 903,
          name: 'manual.pdf',
          size: 1048576,
          digest: null,
          download_count: 10,
          browser_download_url:
            'https://github.com/dwierzbicki11/ZOnderqOS/releases/download/v1.1.0-docs/manual.pdf',
        },
      ],
    },
  ]);

  assert.equal(multiReleases.length, 3);
  const stats = computeReleaseDashboardStats(multiReleases);
  assert.equal(stats.totalPublishedReleases, 3);
  assert.equal(stats.availableIsoImagesCount, 2);
  assert.equal(stats.totalIsoDownloads, 20); // 1 + 19 + 0
  assert.equal(stats.totalAllAssetDownloads, 35); // 1 + (19 + 5) + 10
  // Latest published is v1.1.0-docs (has no ISO), while latest downloadable ISO is v1.1.0-beta.1!
  assert.equal(stats.latestPublishedRelease?.tagName, 'v1.1.0-docs');
  assert.equal(stats.latestDownloadableRelease?.tagName, 'v1.1.0-beta.1');
  assert.equal(stats.latestReleaseIsoDownloads, 19);
  assert.equal(stats.mostDownloadedRelease?.release.tagName, 'v1.1.0-beta.1');

  const betaVersionShare = stats.downloadsByVersion.find((v) => v.tagName === 'v1.1.0-beta.1');
  assert.equal(betaVersionShare?.sharePercentage, 95); // 19 / 20 = 95%
});

test('Asset classification, SHA-256 extraction, channel classification, and markdown note sanitization work accurately', () => {
  assert.equal(classifyAssetType('ZonderqOS.iso', 'application/vnd.efi.iso'), 'Bootable ISO');
  assert.equal(classifyAssetType('ZonderqOS.iso.sha256'), 'Checksum');
  assert.equal(classifyAssetType('ZonderqOS.iso.sig'), 'Signature');
  assert.equal(classifyAssetType('manual.pdf'), 'Documentation');
  assert.equal(classifyAssetType('source.zip'), 'Binary / Archive');

  assert.equal(extractSha256Digest(null), null);
  assert.equal(extractSha256Digest('invalid'), null);
  assert.equal(
    extractSha256Digest('sha256:4507333c4083caf26dd869b8275390ce3c72d3c70cc4838ad1350ef1c36e9fc8'),
    '4507333c4083caf26dd869b8275390ce3c72d3c70cc4838ad1350ef1c36e9fc8',
  );

  assert.equal(classifyReleaseChannel('v1.0.0-alfa', 'ZonderqOS-Alfa', ''), 'Alpha');
  assert.equal(classifyReleaseChannel('v1.1.0-beta.1', 'Beta 1', ''), 'Beta');
  assert.equal(classifyReleaseChannel('v1.0.0-rc1', 'RC 1', ''), 'Release Candidate');
  assert.equal(classifyReleaseChannel('v1.0.0', 'ZonderqOS 1.0', ''), 'Stable');

  const dual = formatBytesDual(19013632);
  assert.equal(dual.mb, '19.01 MB');
  assert.equal(dual.mib, '18.13 MiB');

  const sections = parseAndSanitizeReleaseNotes(REAL_ALPHA_RELEASE_PAYLOAD.body);
  assert.equal(sections.length, 3);
  assert.equal(sections[1].heading, 'Key Features');
  assert.equal(sections[1].lines[0].type, 'feature');
  assert.equal(sections[2].heading, 'Development Status');
  assert.equal(sections[2].lines[0].type, 'status');
});

test('GitHub API pagination, partial page failure, and rate limiting are handled gracefully', async () => {
  assert.equal(
    hasNextPageLink(
      '<https://api.github.com/repositories/1/releases?per_page=1&page=2>; rel="next"',
    ),
    true,
  );
  assert.equal(hasNextPageLink(null), false);

  // 1. Multi-page pagination success
  let callCount = 0;
  const paginatedFetch: typeof fetch = async () => {
    callCount += 1;
    if (callCount === 1) {
      return new Response(JSON.stringify([REAL_ALPHA_RELEASE_PAYLOAD]), {
        status: 200,
        headers: {
          link: '<https://api.github.com/repos/dwierzbicki11/ZOnderqOS/releases?page=2>; rel="next"',
          'x-ratelimit-remaining': '58',
        },
      });
    }
    if (callCount === 2) {
      return new Response(
        JSON.stringify([
          {
            ...REAL_ALPHA_RELEASE_PAYLOAD,
            id: 451529378,
            tag_name: 'v0.9.0-alfa',
            name: 'ZonderqOS Early Alpha',
          },
        ]),
        {
          status: 200,
          headers: {
            link: '<https://api.github.com/repos/dwierzbicki11/ZOnderqOS/releases?page=1>; rel="prev"',
            'x-ratelimit-remaining': '57',
          },
        },
      );
    }
    return new Response(JSON.stringify([]), { status: 200 });
  };

  const paginatedResult = await fetchAllGitHubReleasesPaginated({
    forceRefresh: true,
    perPage: 1,
    fetchImpl: paginatedFetch,
  });
  assert.equal(paginatedResult.pagesFetched, 2);
  assert.equal(paginatedResult.releases.length, 2);
  assert.equal(paginatedResult.rateLimitRemaining, 57);
  assert.equal(paginatedResult.errorMessage, null);

  // 2. Partial pagination failure (page 1 succeeds, page 2 hits 403 rate limit)
  let partialCall = 0;
  const partialFailFetch: typeof fetch = async () => {
    partialCall += 1;
    if (partialCall === 1) {
      return new Response(JSON.stringify([REAL_ALPHA_RELEASE_PAYLOAD]), {
        status: 200,
        headers: {
          link: '<https://api.github.com/repos/dwierzbicki11/ZOnderqOS/releases?page=2>; rel="next"',
        },
      });
    }
    return new Response(JSON.stringify({ message: 'API rate limit exceeded' }), {
      status: 403,
      headers: { 'x-ratelimit-remaining': '0' },
    });
  };

  const partialResult = await fetchAllGitHubReleasesPaginated({
    forceRefresh: true,
    perPage: 1,
    fetchImpl: partialFailFetch,
  });
  assert.equal(partialResult.pagesFetched, 1);
  assert.equal(partialResult.releases.length, 1);
  assert.ok(partialResult.errorMessage?.includes('Partial pagination warning'));

  // 3. Complete rate limit failure on page 1
  const rateLimitFetch: typeof fetch = async () =>
    new Response(JSON.stringify({ message: 'API rate limit exceeded' }), {
      status: 429,
      headers: { 'x-ratelimit-remaining': '0' },
    });

  const rateLimitResult = await fetchAllGitHubReleasesPaginated({
    forceRefresh: true,
    fetchImpl: rateLimitFetch,
  });
  assert.equal(rateLimitResult.releases.length, 0);
  assert.ok(rateLimitResult.errorMessage?.includes('rate limit'));
});

test('Historical snapshot analytics never fabricate history and compute daily/weekly growth accurately', () => {
  const singleSnapshot = [
    {
      timestamp: '2026-11-19T15:47:35Z',
      totalIsoDownloads: 1,
      totalAssetDownloads: 1,
      perRelease: { 'v1.0.0-alfa': 1 },
    },
  ];
  assert.deepEqual(computeDailyGrowthFromSnapshots(singleSnapshot), []);
  assert.deepEqual(computeWeeklyGrowthFromSnapshots(singleSnapshot), []);

  const multiDaySnapshots = [
    ...singleSnapshot,
    {
      timestamp: '2026-11-20T15:47:35Z',
      totalIsoDownloads: 14,
      totalAssetDownloads: 14,
      perRelease: { 'v1.0.0-alfa': 14 },
    },
    {
      timestamp: '2026-11-27T15:47:35Z',
      totalIsoDownloads: 42,
      totalAssetDownloads: 42,
      perRelease: { 'v1.0.0-alfa': 42 },
    },
  ];

  const daily = computeDailyGrowthFromSnapshots(multiDaySnapshots);
  assert.equal(daily.length, 2);
  assert.equal(daily[0].deltaIsoDownloads, 13);
  assert.equal(daily[1].deltaIsoDownloads, 28);

  const weekly = computeWeeklyGrowthFromSnapshots(multiDaySnapshots);
  assert.equal(weekly.length, 1);
  assert.equal(weekly[0].deltaIsoDownloads, 28);

  const merged = mergeLiveObservationIntoSnapshots(
    singleSnapshot,
    normalizeGitHubReleases([REAL_ALPHA_RELEASE_PAYLOAD]),
    '2026-11-19T16:50:00Z',
  );
  assert.equal(merged.length, 1);

  const comparisons = computeReleaseToReleaseComparisons(
    normalizeGitHubReleases([REAL_ALPHA_RELEASE_PAYLOAD]),
  );
  assert.equal(comparisons.length, 1);
  assert.equal(comparisons[0].deltaFromPreviousRelease, null);
});

test('Virtual Machines & Installation Guide data covers all 4 platforms, 3 host OS profiles (Windows, Linux distros, macOS), 11 VM specs, and non-fake VM asset detection', () => {
  assert.equal(recommendedVmSpecsData.length, 11);
  assert.equal(limineBootEntriesData.length, 3);
  assert.equal(platformGuidesData.length, 4);
  assert.equal(hostOsProfilesData.length, 3);
  assert.equal(linuxDistroGuidesData.length, 4);
  assert.equal(vmTroubleshootingData.length, 9);

  const hostIds = hostOsProfilesData.map((h) => h.id);
  assert.deepEqual(hostIds, ['linux', 'windows', 'macos']);

  const distroIds = linuxDistroGuidesData.map((d) => d.id);
  assert.deepEqual(distroIds, ['ubuntu-debian', 'arch', 'fedora', 'opensuse']);

  for (const platform of platformGuidesData) {
    assert.ok(platform.stepsByHost.linux.length >= 2);
    assert.ok(platform.stepsByHost.windows.length >= 2);
    assert.ok(platform.stepsByHost.macos.length >= 2);
  }

  const vbox = platformGuidesData.find((p) => p.id === 'virtualbox');
  const vmware = platformGuidesData.find((p) => p.id === 'vmware');
  const qemu = platformGuidesData.find((p) => p.id === 'qemu');
  const usb = platformGuidesData.find((p) => p.id === 'physical-usb');

  assert.equal(vbox?.verificationLevel, 'Experimental / Community Hypervisor Target');
  assert.equal(vmware?.verificationLevel, 'Experimental / Community Hypervisor Target');
  assert.equal(qemu?.verificationLevel, 'Verified in Automated CI (Primary Target)');
  assert.equal(usb?.verificationLevel, 'Physical UEFI Target (USB)');

  const alphaReleases = normalizeGitHubReleases([REAL_ALPHA_RELEASE_PAYLOAD]);
  const detected = detectVmPackageAssets(alphaReleases[0].assets);
  assert.equal(detected.isoAsset?.name, 'ZonderqOS.iso');
  assert.equal(detected.virtualBoxAsset, null);
  assert.equal(detected.vmwareAsset, null);
});

test('100% English language audit passes across all data catalogs, snapshots, and HTML metadata', () => {
  const allCatalogs = {
    uiText,
    featuresData,
    screenshotsData,
    generationComparisonData,
    roadmapData,
    hardwareCompatibilityData,
    newsChangelogData,
    verifiedRepoMetrics,
    faqData,
    recommendedVmSpecsData,
    hostOsProfilesData,
    linuxDistroGuidesData,
    limineBootEntriesData,
    platformGuidesData,
    vmTroubleshootingData,
  };

  const violations = collectPolishViolations(allCatalogs);
  assert.deepEqual(violations, [], `Found non-English strings: ${violations.join('; ')}`);

  const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('<html lang="en"'), 'index.html must declare lang="en"');
  assert.equal(
    containsPolishCharacters(indexHtml),
    false,
    'index.html must not contain Polish text',
  );
});
