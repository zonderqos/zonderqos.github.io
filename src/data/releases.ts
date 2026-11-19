import type { ReleaseInfo } from '@/types/site';

export const releaseInfoData: ReleaseInfo = {
  hasPublicRelease: false,
  version: 'v1.0.2-alpha.1',
  buildNumber: 3120,
  tagName: 'v1.0.2-alpha.1',
  tagDate: '2026-11-18',
  architecture: 'x86_64 (Primary UEFI GOP) & ARM64 (Compile-Verified)',
  cosmosKernelVersion: 'Cosmos Kernel Gen3 (3.0.97) • .NET 10.0 NativeAOT',
  isoSize: '19 MB (Local Engineering ISO: output-x64/ZonderqOS.iso)',
  status: 'Alpha (Completed)',
  githubRepoUrl: 'https://github.com/dwierzbicki11/ZOnderqOS',
  githubReleasesUrl: 'https://github.com/dwierzbicki11/ZOnderqOS/releases',
  publicReleaseNotice:
    'No public release available yet — ZonderqOS Alpha development is 100% completed in the repository (tagged v1.0.2-alpha.1, Build 3120), and the project has transitioned to the Beta phase. However, no standalone downloadable ISO artifact has been uploaded to public GitHub Releases yet. Official public ISO downloads with SHA-256 checksums will appear here once published.',
  changelog: [
    'Completed the Alpha milestone and migrated the kernel toolchain from Cosmos SDK 3.0.95 to Cosmos.Sdk 3.0.97 on .NET 10.0 Microsoft NativeAOT (x86_64 and ARM64 build verification).',
    'Completed full English (en-US) localization across system UI dialogs, shell messages, and 38 registered desktop applications (#220).',
    'Verified 105 consecutive GUI application launch/close cycles (+0.19 MB RAM drift), 50× Lock/Unlock security cycles, and 10× QEMU reboot loops (1 & 8 vCPUs).',
    'Enforced fail-closed DataVolumePolicy mounting exclusively the ZONDERQDATA FAT32 volume and protecting host EFI/ESP partitions.',
    'Implemented BootSlotManager A/B update engine with BouncyCastle Ed25519 signature verification and GNU-EFI BootGuard pre-boot rollback (advancing to OVMF sign-off in Beta).',
  ],
};
