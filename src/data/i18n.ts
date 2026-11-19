import type {
  FeatureStatus,
  NavSectionId,
  RoadmapCategory,
  RoadmapStatus,
  ScreenshotCategory,
} from '@/types/site';

export interface UiDictionary {
  nav: {
    items: Record<NavSectionId, string>;
    github: string;
    themeToggleDark: string;
    themeToggleLight: string;
    scrollProgressAria: string;
    mobileMenuToggle: string;
  };
  hero: {
    milestonePill: string;
    kernelBadge: string;
    title: string;
    alphaHeading: string;
    subtitle: string;
    description: string;
    alphaCompletedCardTitle: string;
    alphaCompletedCardDetail: string;
    nextPhaseLabel: string;
    nextPhaseValue: string;
    ctaFeatures: string;
    ctaGithub: string;
    ctaDownload: string;
    previewTitle: string;
    previewSubtitle: string;
    previewAuthenticityBadge: string;
    previewNote: string;
    metrics: {
      appsLabel: string;
      commandsLabel: string;
      testsLabel: string;
      alphaCompletionLabel: string;
    };
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    verificationBanner: string;
    filterAll: string;
    sourceModuleLabel: string;
    architectureLabel: string;
    statusLabels: Record<FeatureStatus, string>;
  };
  screenshots: {
    eyebrow: string;
    title: string;
    subtitle: string;
    authenticityNoticeTitle: string;
    authenticityNoticeBody: string;
    filterAll: string;
    categories: Record<ScreenshotCategory, string>;
    authenticBadge: string;
    placeholderBadge: string;
    expectedFileLabel: string;
    openLightboxLabel: string;
    generationSectionTitle: string;
    generationSectionSubtitle: string;
    lightbox: {
      close: string;
      previous: string;
      next: string;
      zoomIn: string;
      zoomOut: string;
      version: string;
      generation: string;
      resolution: string;
      framebuffer: string;
      replacementPath: string;
      keyboardHint: string;
    };
  };
  roadmap: {
    eyebrow: string;
    title: string;
    subtitle: string;
    auditNotice: string;
    filterAllCategories: string;
    categories: Record<RoadmapCategory, string>;
    statuses: Record<RoadmapStatus, string>;
    verifiedProgressLabel: string;
    tasksCompletedLabel: string;
    expandStage: string;
    collapseStage: string;
    targetDateConfirmedLabel: string;
    targetDateUnconfirmed: string;
    verifiedSourceLabel: string;
  };
  downloads: {
    eyebrow: string;
    title: string;
    subtitle: string;
    noPublicReleaseTitle: string;
    noPublicReleaseBadge: string;
    alphaMilestoneNote: string;
    releaseMetadataTitle: string;
    versionLabel: string;
    buildLabel: string;
    tagDateLabel: string;
    architectureLabel: string;
    kernelLabel: string;
    isoSizeLabel: string;
    statusLabel: string;
    sha256Label: string;
    changelogTitle: string;
    viewGithubReleases: string;
    viewTagCommit: string;
    buildFromSourceHint: string;
  };
  development: {
    eyebrow: string;
    title: string;
    subtitle: string;
    architectureTitle: string;
    architectureBody: string;
    qemuTestingTitle: string;
    qemuTestingBody: string;
    quickStartTitle: string;
    quickStartSteps: Array<{ step: string; command: string; note: string }>;
    hardwareTableTitle: string;
    hardwareTableSubtitle: string;
    hardwareColumns: {
      platform: string;
      cpuArch: string;
      firmware: string;
      display: string;
      storageInput: string;
      status3097: string;
      notes: string;
    };
    evolutionTitle: string;
    evolutionSubtitle: string;
    changelogPanelTitle: string;
    repoStatsTitle: string;
    repoStatsFallbackNote: string;
    linksTitle: string;
    sourceCodeLink: string;
    reportIssueLink: string;
    docsLink: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  footer: {
    description: string;
    developmentStatusLabel: string;
    developmentStatusValue: string;
    builtWith: string;
    copyright: string;
    sectionsTitle: string;
    resourcesTitle: string;
    verificationPolicy: string;
  };
}

export const uiText: UiDictionary = {
  nav: {
    items: {
      home: 'Home',
      features: 'Features',
      screenshots: 'Screenshots',
      roadmap: 'Roadmap',
      downloads: 'Downloads',
      'virtual-machines': 'Virtual Machines',
      installation: 'Installation Guide',
      development: 'Documentation',
      faq: 'FAQ',
    },
    github: 'GitHub',
    themeToggleDark: 'Switch to Dark Mode',
    themeToggleLight: 'Switch to Light Mode',
    scrollProgressAria: 'Page scroll progress',
    mobileMenuToggle: 'Toggle navigation menu',
  },
  hero: {
    milestonePill: 'Alpha Milestone Completed (100%) • v1.0.2-alpha.1 (Build 3120)',
    kernelBadge: 'Cosmos Kernel Gen3 (3.0.97) • .NET 10 NativeAOT',
    title: 'ZonderqOS',
    alphaHeading: 'ZonderqOS — Alpha Milestone Completed',
    subtitle:
      'Built with C# and Cosmos Kernel Gen3. Moving towards the next generation of ZonderqOS.',
    description:
      'ZonderqOS has officially completed its Alpha development milestone on Cosmos Kernel Gen3 (3.0.97). Featuring a 32-bit Limine UEFI GOP graphical desktop, 38 built-in applications, 91 shell commands, fail-closed FAT32 ZONDERQDATA storage, and OrionGC memory management — now advancing into the Beta development phase.',
    alphaCompletedCardTitle: 'Alpha Development Stage — 100% Completed',
    alphaCompletedCardDetail:
      'Tagged at v1.0.2-alpha.1 (Build 3120). All Alpha architecture, GUI, VFS, and English UI milestones are finished.',
    nextPhaseLabel: 'Active Engineering Track',
    nextPhaseValue: 'Beta — Next Development Phase',
    ctaFeatures: 'Explore Features',
    ctaGithub: 'View on GitHub',
    ctaDownload: 'Download',
    previewTitle: 'ZonderqOS Gen3 Framebuffer & Subsystem Telemetry',
    previewSubtitle:
      'Limine UEFI GOP 32-bit Linear Framebuffer (1366×768×32 default / up to 3840×2160)',
    previewAuthenticityBadge: 'Authentic Repository Wallpaper Asset + Verified Kernel Spec',
    previewNote:
      'Displays the authentic embedded repository wallpaper (source/Wallpapers/wallpaper.png) paired with verified Kernel 3.0.97 subsystem specifications. No synthetic desktop mockup is passed off as a screenshot.',
    metrics: {
      appsLabel: 'Built-in GUI Apps (38 AppIds)',
      commandsLabel: 'Registered Shell Commands',
      testsLabel: 'Automated Python + C# Suites',
      alphaCompletionLabel: 'Alpha Milestone Completion',
    },
  },
  features: {
    eyebrow: 'Subsystem Architecture',
    title: 'Verified System Features & Implementation Status',
    subtitle:
      'Every capability listed below reflects the audited state of the ZonderqOS repository (commit 5c17f4b1 / tag v1.0.2-alpha.1). Experimental, in-development, and planned features are strictly distinguished from completed implementations.',
    verificationBanner:
      'Audit Policy: Status badges are bound directly to source modules and automated test suites in /source and /tests.',
    filterAll: 'All Subsystems',
    sourceModuleLabel: 'Source Module',
    architectureLabel: 'Target Scope',
    statusLabels: {
      Implemented: 'Implemented',
      Experimental: 'Experimental',
      'In Development': 'In Development',
      Planned: 'Planned',
    },
  },
  screenshots: {
    eyebrow: 'Visual Documentation & Assets',
    title: 'Screenshots & Framebuffer Capture Gallery',
    subtitle:
      'Filter by subsystem category, inspect resolution and framebuffer format in the interactive lightbox, or navigate with keyboard shortcuts (Arrow keys, Escape, +/-).',
    authenticityNoticeTitle: 'Strict Visual Authenticity Notice',
    authenticityNoticeBody:
      'The ZonderqOS git repository currently contains the authentic desktop wallpaper (source/Wallpapers/wallpaper.png) and 45 GUI icon assets, but no archived full-screen QEMU or hardware framebuffer captures yet. Below, the authentic wallpaper asset is served in WebP/PNG alongside structured diagnostic placeholders with exact drop-in replacement paths.',
    filterAll: 'All Categories',
    categories: {
      Desktop: 'Desktop',
      'System Applications': 'System Applications',
      Settings: 'Settings',
      Diagnostics: 'Diagnostics',
      'Boot & Installation': 'Boot & Installation',
      'Hardware Testing': 'Hardware Testing',
    },
    authenticBadge: 'Authentic Repo Asset (WebP + PNG)',
    placeholderBadge: 'Structured Capture Placeholder',
    expectedFileLabel: 'Drop-in file path',
    openLightboxLabel: 'Inspect in Lightbox',
    generationSectionTitle: 'Generation Visual & Architectural Comparison (Gen1 → Gen2 → Gen3)',
    generationSectionSubtitle:
      'Comparison of visual pipelines and execution architecture across project generations based on repository documentation.',
    lightbox: {
      close: 'Close lightbox (Esc)',
      previous: 'Previous item (Left Arrow)',
      next: 'Next item (Right Arrow)',
      zoomIn: 'Zoom in (+)',
      zoomOut: 'Zoom out (-)',
      version: 'System Version',
      generation: 'Generation',
      resolution: 'Resolution',
      framebuffer: 'Format',
      replacementPath: 'Asset Path',
      keyboardHint: 'Keyboard: ← / → navigate • + / - zoom • Esc close',
    },
  },
  roadmap: {
    eyebrow: 'Audited Engineering Milestones',
    title: 'Interactive ZonderqOS Roadmap',
    subtitle:
      'ZonderqOS Alpha is 100% completed. The project is now advancing into the Beta development phase towards Release Candidate and Version 1.0 Stable. No unconfirmed target dates are fabricated.',
    auditNotice:
      'Each stage calculates completion strictly as (Completed Tasks / Total Defined Tasks in Stage). Filter tasks by subsystem category or expand any milestone to inspect module-level verification notes.',
    filterAllCategories: 'All Categories',
    categories: {
      'Kernel & Arch': 'Kernel & Arch',
      'GUI & Apps': 'GUI & Apps',
      'Storage & Update': 'Storage & Update',
      'Hardware & Drivers': 'Hardware & Drivers',
      'Networking & Audio': 'Networking & Audio',
    },
    statuses: {
      Completed: 'Completed',
      'In Progress': 'In Progress',
      Testing: 'Testing',
      Planned: 'Planned',
      Blocked: 'Blocked',
    },
    verifiedProgressLabel: 'Verified Task Completion',
    tasksCompletedLabel: 'tasks completed',
    expandStage: 'Expand milestone details',
    collapseStage: 'Collapse milestone details',
    targetDateConfirmedLabel: 'Confirmed Completion Date',
    targetDateUnconfirmed: 'No confirmed release date (milestone-driven)',
    verifiedSourceLabel: 'Audit source',
  },
  downloads: {
    eyebrow: 'Official Builds & Distribution',
    title: 'Downloads & Release Verification',
    subtitle:
      'Official ZonderqOS bootable ISO images are distributed exclusively via GitHub Releases with SHA-256 checksums and Ed25519 release metadata.',
    noPublicReleaseTitle: 'No public release available yet',
    noPublicReleaseBadge: 'Local Engineering ISO Only',
    alphaMilestoneNote:
      'Note: Alpha development is 100% completed in the source repository (tagged v1.0.2-alpha.1, Build 3120), but no standalone public ISO artifact has been uploaded to GitHub Releases yet.',
    releaseMetadataTitle: 'Completed Alpha Milestone Repository Snapshot',
    versionLabel: 'Version',
    buildLabel: 'Build Number',
    tagDateLabel: 'Completed Tag Date',
    architectureLabel: 'Architecture',
    kernelLabel: 'Cosmos Kernel',
    isoSizeLabel: 'Local Build ISO Size',
    statusLabel: 'Milestone Status',
    sha256Label: 'SHA-256 Checksum',
    changelogTitle: 'Completed Alpha Milestone Changelog (v1.0.2-alpha.1)',
    viewGithubReleases: 'Check Official GitHub Releases',
    viewTagCommit: 'Inspect v1.0.2-alpha.1 Tag on GitHub',
    buildFromSourceHint:
      'Developers can build a bootable x86_64 Limine ISO from the completed Alpha source tag using ./verify-builds.sh and dotnet build -r linux-x64.',
  },
  development: {
    eyebrow: 'Kernel Engineering & Verification',
    title: 'Development, Architecture & Hardware Testing',
    subtitle:
      'Built with C# on .NET 10 NativeAOT and Cosmos Kernel Gen3 (3.0.97). Validated through automated Python QMP suites, host C# smoke tests, and bare-metal UEFI diagnostics.',
    architectureTitle: 'C# NativeAOT & Cosmos Kernel Gen3 Architecture',
    architectureBody:
      'ZonderqOS compiles directly from C# to native x86_64 and ARM64 ELF binaries (ZonderqOS.elf) using Microsoft NativeAOT and Cosmos SDK 3.0.97. Strict compile-time platform boundaries isolate source/Platform/X64 (NASM, PIT Ch2 PC Speaker, PCI sysfs) from source/Platform/Arm64 (GAS, GICv3, PL011, ACPI/ECAM).',
    qemuTestingTitle: 'Automated QEMU QMP & Host Smoke Verification',
    qemuTestingBody:
      'Every subsystem change is validated against 85 Python test suites (565 passed tests + 200 passed subtests) and 23 C# host smoke test projects. QEMU x86_64 suites verify 10x reboot stability on 1 and 8 vCPUs, 105 GUI app open/close cycles (+0.19 MB drift), 50x Lock/Unlock security cycles, and fail-closed FAT32 ZONDERQDATA mounting.',
    quickStartTitle: 'Developer Quick Start (Build from Source)',
    quickStartSteps: [
      {
        step: '1. Clone the ZonderqOS repository',
        command: 'git clone https://github.com/dwierzbicki11/ZOnderqOS.git && cd ZOnderqOS',
        note: 'Requires .NET 10.0 SDK, Cosmos.Sdk 3.0.97 packages, xorriso, and QEMU x86_64.',
      },
      {
        step: '2. Verify dual-architecture NativeAOT compilation (x64 + ARM64)',
        command: './verify-builds.sh',
        note: 'Compiles clean NativeAOT ELF targets for both linux-x64 and linux-arm64.',
      },
      {
        step: '3. Run host contract & QEMU smoke test suites',
        command: 'pytest -q && ./run.sh',
        note: 'Executes the 85 Python verification suites and launches ZonderqOS in QEMU UEFI GOP.',
      },
    ],
    hardwareTableTitle: 'Confirmed Hardware & Emulator Compatibility Matrix',
    hardwareTableSubtitle:
      'Based strictly on audited test logs in docs/beta-roadmap-independent-audit.md. No unverified hardware claims are listed.',
    hardwareColumns: {
      platform: 'Target Platform',
      cpuArch: 'CPU / Architecture',
      firmware: 'Firmware / Bootloader',
      display: 'Display / Framebuffer',
      storageInput: 'Storage & Input Bus',
      status3097: 'Cosmos 3.0.97 Status',
      notes: 'Audited Verification Notes',
    },
    evolutionTitle: 'Evolution: Gen1 → Gen2 → Gen3',
    evolutionSubtitle:
      'How ZonderqOS transitioned from legacy 32-bit IL2CPU experimentation to a 64-bit NativeAOT operating system on Cosmos Kernel Gen3.',
    changelogPanelTitle: 'Recent Engineering Updates & Changelogs',
    repoStatsTitle: 'Verified Repository Metrics',
    repoStatsFallbackNote:
      'Rendered from verified local git snapshot (non-blocking; zero client-side GitHub API rate-limit failures).',
    linksTitle: 'Developer Resources & Issue Tracking',
    sourceCodeLink: 'ZonderqOS Source Repository',
    reportIssueLink: 'Report a Bug / Issue on GitHub',
    docsLink: 'Website Repository (zonderqos.github.io)',
  },
  faq: {
    eyebrow: 'Technical Questions',
    title: 'Frequently Asked Questions',
    subtitle:
      'Direct, verified answers about ZonderqOS, its completed Alpha milestone, Cosmos Kernel Gen3, open-source licensing, downloads, and the Beta roadmap.',
  },
  footer: {
    description:
      'ZonderqOS is an experimental C# NativeAOT operating system built on Cosmos Kernel Gen3 (3.0.97). Alpha development is completed; advancing towards the Beta milestone.',
    developmentStatusLabel: 'Development Status',
    developmentStatusValue: 'Alpha Completed (100%) • Beta Next Phase',
    builtWith: 'Built with React, TypeScript (strict), Vite, Tailwind CSS 4 & Motion',
    copyright: '© 2026 ZonderqOS Project (Daniel Wierzbicki). All rights reserved.',
    sectionsTitle: 'Navigation',
    resourcesTitle: 'Project Links',
    verificationPolicy:
      'All technical metrics, subsystem statuses, and roadmap milestones on this website are synchronized with audited repository commit 5c17f4b1 (v1.0.2-alpha.1).',
  },
};
