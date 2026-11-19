import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculateStageProgress, cn } from './utils.ts';
import { collectPolishViolations, containsPolishCharacters } from './languageAudit.ts';
import { featuresData } from '../data/features.ts';
import { roadmapData } from '../data/roadmap.ts';
import { screenshotsData, generationComparisonData } from '../data/screenshots.ts';
import { releaseInfoData } from '../data/releases.ts';
import {
  hardwareCompatibilityData,
  newsChangelogData,
  verifiedRepoMetrics,
} from '../data/development.ts';
import { faqData } from '../data/faq.ts';
import { uiText } from '../data/i18n.ts';

test('cn merges class names cleanly', () => {
  const isHidden = Boolean(0);
  assert.equal(cn('px-2', isHidden && 'hidden', 'px-4', 'text-white'), 'px-4 text-white');
});

test('Hero section contains exact required Alpha Milestone Completed headings', () => {
  assert.equal(uiText.hero.alphaHeading, 'ZonderqOS — Alpha Milestone Completed');
  assert.equal(
    uiText.hero.subtitle,
    'Built with C# and Cosmos Kernel Gen3. Moving towards the next generation of ZonderqOS.',
  );
});

test('Roadmap Stage 1 (Alpha) is 100% Completed and subsequent phases match specification', () => {
  assert.equal(roadmapData.length, 5);

  const alphaStage = roadmapData[0];
  assert.equal(alphaStage.status, 'Completed');
  assert.equal(alphaStage.phaseLabel, 'Alpha — Completed (100%)');

  const alphaProgress = calculateStageProgress(alphaStage.tasks);
  assert.equal(alphaProgress.completed, alphaStage.tasks.length);
  assert.equal(alphaProgress.percentage, 100);

  const betaStage = roadmapData[1];
  assert.equal(betaStage.phaseLabel, 'Beta — Next Development Phase');
  assert.equal(betaStage.status, 'In Progress');
  assert.equal(betaStage.confirmedTargetDate, undefined);

  const rcStage = roadmapData[2];
  assert.equal(rcStage.phaseLabel, 'Release Candidate — Planned');
  assert.equal(rcStage.status, 'Planned');
  assert.equal(rcStage.confirmedTargetDate, undefined);

  const v1Stage = roadmapData[3];
  assert.equal(v1Stage.phaseLabel, 'Version 1.0 Stable — Planned');
  assert.equal(v1Stage.status, 'Planned');
  assert.equal(v1Stage.confirmedTargetDate, undefined);
});

test('featuresData contains all 10 verified ZonderqOS subsystems with honest statuses', () => {
  assert.equal(featuresData.length, 10);
  const statuses = new Set(featuresData.map((f) => f.status));
  assert.ok(statuses.has('Implemented'));
  assert.ok(statuses.has('Experimental'));
  assert.ok(statuses.has('In Development'));

  const netAudio = featuresData.find((f) => f.id === 'networking-audio');
  assert.equal(netAudio?.status, 'In Development');

  const abUpdate = featuresData.find((f) => f.id === 'ab-update-mechanism');
  assert.equal(abUpdate?.status, 'Experimental');
});

test('screenshotsData covers all 6 required categories and marks placeholders honestly', () => {
  const requiredCategories = [
    'Desktop',
    'System Applications',
    'Settings',
    'Diagnostics',
    'Boot & Installation',
    'Hardware Testing',
  ] as const;

  const actualCategories = new Set(screenshotsData.map((s) => s.category));
  for (const cat of requiredCategories) {
    assert.ok(actualCategories.has(cat), `Missing category: ${cat}`);
  }

  const authenticItems = screenshotsData.filter((s) => !s.isPlaceholder);
  assert.equal(authenticItems.length, 1);
  assert.equal(authenticItems[0].id, 'desktop-authentic-wallpaper');
  assert.equal(generationComparisonData.length, 3);
});

test('FAQ includes all 6 mandatory questions with verified answers', () => {
  const requiredQuestions = [
    'What is ZonderqOS?',
    'Is ZonderqOS open source?',
    'What is Cosmos Kernel Gen3?',
    'Is ZonderqOS Alpha completed?',
    'Where can I download ZonderqOS?',
    'What comes after Alpha?',
  ];

  const actualQuestions = faqData.map((f) => f.question);
  for (const q of requiredQuestions) {
    assert.ok(actualQuestions.includes(q), `Missing required FAQ question: ${q}`);
  }
});

test('releaseInfoData distinguishes Alpha source completion from public ISO download availability', () => {
  assert.equal(releaseInfoData.hasPublicRelease, false);
  assert.equal(releaseInfoData.status, 'Alpha (Completed)');
  assert.equal(uiText.downloads.noPublicReleaseTitle, 'No public release available yet');
});

test('100% English language audit passes across all data catalogs and HTML metadata', () => {
  const allCatalogs = {
    uiText,
    featuresData,
    screenshotsData,
    generationComparisonData,
    roadmapData,
    releaseInfoData,
    hardwareCompatibilityData,
    newsChangelogData,
    verifiedRepoMetrics,
    faqData,
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
