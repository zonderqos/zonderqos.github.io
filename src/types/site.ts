export type NavSectionId =
  | 'home'
  | 'features'
  | 'screenshots'
  | 'roadmap'
  | 'downloads'
  | 'virtual-machines'
  | 'installation'
  | 'development'
  | 'faq';

export type FeatureStatus = 'Implemented' | 'Experimental' | 'In Development' | 'Planned';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  iconName:
    | 'Monitor'
    | 'Cpu'
    | 'HardDrive'
    | 'Keyboard'
    | 'AppWindow'
    | 'MemoryStick'
    | 'RefreshCw'
    | 'Activity'
    | 'Wifi'
    | 'Layers';
  technicalDetails: string[];
  architecture: string;
  sourceModule: string;
}

export type ScreenshotCategory =
  | 'Desktop'
  | 'System Applications'
  | 'Settings'
  | 'Diagnostics'
  | 'Boot & Installation'
  | 'Hardware Testing';

export interface ScreenshotItem {
  id: string;
  title: string;
  caption: string;
  category: ScreenshotCategory;
  version: string;
  generation: 'Gen1' | 'Gen2' | 'Gen3';
  src?: string;
  webpSrc?: string;
  avifSrc?: string;
  isPlaceholder: boolean;
  isAuthenticAsset?: boolean;
  expectedReplacementPath: string;
  resolution: string;
  framebufferFormat: string;
  highlights: string[];
}

export interface GenerationComparisonItem {
  generation: 'Gen1' | 'Gen2' | 'Gen3';
  codename: string;
  period: string;
  compilerAndRuntime: string;
  architecture: string;
  bootAndDisplay: string;
  memoryAndGc: string;
  storageAndDrivers: string;
  visualNotes: string;
  hasAuthenticScreenshot: boolean;
}

export type RoadmapStatus = 'Completed' | 'In Progress' | 'Testing' | 'Planned' | 'Blocked';

export type RoadmapCategory =
  'Kernel & Arch' | 'GUI & Apps' | 'Storage & Update' | 'Hardware & Drivers' | 'Networking & Audio';

export interface RoadmapTask {
  id: string;
  title: string;
  detail: string;
  status: RoadmapStatus;
  category: RoadmapCategory;
  verifiedSource: string;
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  name: string;
  phaseLabel: string;
  subtitle: string;
  description: string;
  status: RoadmapStatus;
  confirmedTargetDate?: string;
  tasks: RoadmapTask[];
}

export interface ReleaseInfo {
  hasPublicRelease: boolean;
  version: string;
  buildNumber: number;
  tagName: string;
  tagDate: string;
  releaseDate?: string;
  architecture: string;
  cosmosKernelVersion: string;
  isoSize?: string;
  status: 'Alpha (Completed)' | 'Beta' | 'Stable';
  downloadUrl?: string;
  sha256?: string;
  githubRepoUrl: string;
  githubReleasesUrl: string;
  publicReleaseNotice: string;
  changelog: string[];
}

export interface HardwareTestEntry {
  id: string;
  platform: string;
  category: 'Emulator / VM' | 'Physical Hardware';
  cpuAndArch: string;
  firmwareAndBoot: string;
  displayMode: string;
  storageAndInput: string;
  cosmos3097Status:
    'Verified PASS' | 'Partial / Known Gap' | 'Unverified on 3.0.97' | 'Blocked Locally';
  verifiedNotes: string;
}

export interface NewsChangelogItem {
  id: string;
  date: string;
  versionTag: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Architecture' | 'Hardware & QEMU' | 'Releases' | 'Roadmap';
}
