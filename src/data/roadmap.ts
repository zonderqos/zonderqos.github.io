import type { RoadmapStage } from '@/types/site';

export const roadmapData: RoadmapStage[] = [
  {
    id: 'stage-alpha',
    stageNumber: 1,
    name: 'Stage 1 — Alpha (v1.0.2-alpha.1)',
    phaseLabel: 'Alpha — Completed (100%)',
    subtitle:
      'Cosmos Kernel Gen3 (3.0.97) Migration, 32-bit UEFI GOP Desktop & English UI Baseline',
    description:
      'ZonderqOS Alpha development is 100% completed. Established the 64-bit .NET 10 NativeAOT kernel on Cosmos 3.0.97, full custom GUI desktop with 38 applications and 91 shell commands, fail-closed FAT32 ZONDERQDATA storage, and OrionGC memory management.',
    status: 'Completed',
    confirmedTargetDate: '2026-11-18 (Completed & Tagged v1.0.2-alpha.1)',
    tasks: [
      {
        id: 'alpha-kernel-3097',
        title: 'Migrate kernel & build pipeline to Cosmos SDK 3.0.97 (.NET 10 NativeAOT)',
        detail:
          'Dual-architecture compilation (linux-x64 and linux-arm64) verified via ./verify-builds.sh and 10× QEMU reboot loops on 1 & 8 vCPUs.',
        status: 'Completed',
        category: 'Kernel & Arch',
        verifiedSource: 'ZonderqOS.csproj • source/Core/KernelBuildInfo.cs (Build 3120)',
      },
      {
        id: 'alpha-gui-desktop',
        title: 'Custom 32-bit UEFI GOP Window Manager & Zero-Allocation Cursor Renderer',
        detail:
          'Preallocated 24×28 CursorDamageRenderer, StartMenu, Taskbar, CommandPalette, and 105 GUI app open/close cycles (+0.19 MB RAM drift).',
        status: 'Completed',
        category: 'GUI & Apps',
        verifiedSource: 'source/GUI/GuiManager.cs • docs/beta-roadmap-independent-audit.md',
      },
      {
        id: 'alpha-apps-shell',
        title: '38 Desktop Applications (44 *App.cs) & 91 Shell Commands with Full English UI',
        detail:
          'Includes Terminal, FileManager, Settings, Diagnostics, SecurityCenter, BasicIde, zpkg local package manager, and complete English UI translation (#220).',
        status: 'Completed',
        category: 'GUI & Apps',
        verifiedSource: 'source/GUI/Application/AppRegistry.cs • commit 5c17f4b1',
      },
      {
        id: 'alpha-fat32-acl',
        title: 'Fail-Closed FAT32 ZONDERQDATA Volume Policy & Multi-User Path ACLs',
        detail:
          'Mounts strictly the ZONDERQDATA partition while rejecting host EFI/ESP volumes; verified with 50× Lock/Unlock and alice/root ACL tests.',
        status: 'Completed',
        category: 'Storage & Update',
        verifiedSource: 'source/Storage/DataVolumePolicy.cs • tests/',
      },
      {
        id: 'alpha-memory-guardian',
        title: 'MemoryGuardian PageAllocator Telemetry, MemoryOptimizer & 60-Min RAM Soak Baseline',
        detail:
          'Zero-allocation hot paths, NativeScratchBuffer for blocks >= 4096 B, and automated 565-test Python QMP & contract suite verification.',
        status: 'Completed',
        category: 'Kernel & Arch',
        verifiedSource: 'source/Core/MemoryGuardian.cs • source/Core/MemoryOptimizer.cs',
      },
    ],
  },
  {
    id: 'stage-beta',
    stageNumber: 2,
    name: 'Stage 2 — Beta',
    phaseLabel: 'Beta — Next Development Phase',
    subtitle:
      'Next Development Phase: A/B Update OVMF Chainload, Ethernet & HDA Audio Drivers, Safe Disk Installer',
    description:
      'Active engineering phase following Alpha completion. Closes pre-production gates in the A/B update chainloader, enables active networking and PCM audio drivers, resolves ACPI shutdown timeouts, and introduces a safe bare-metal installer.',
    status: 'In Progress',
    tasks: [
      {
        id: 'beta-ab-update-engine',
        title:
          'A/B BootSlotManager, Ed25519 Signature Verifier & GNU-EFI BootGuard Chainloader Sign-Off',
        detail:
          'Core C# engine and bootguard_efi.c (B→B→B→A rollback) are implemented; completing end-to-end OVMF chainload test and provisioning production TrustedReleaseKey.',
        status: 'In Progress',
        category: 'Storage & Update',
        verifiedSource:
          'source/Core/Updates/BootSlotManager.cs • tests/test_bootguard_real_chainload_ovmf.sh',
      },
      {
        id: 'beta-acpi-fat32-hardening',
        title:
          'Fix ACPI Shutdown 20s Timeout in Console E2E & Physical ASUS X540LA Re-Verification on 3.0.97',
        detail:
          'Eliminate SIGTERM fallback during automated console shutdown tests, harden VFS large-file edge cases, and re-verify physical laptop subsystems on Cosmos 3.0.97.',
        status: 'In Progress',
        category: 'Kernel & Arch',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (Beta 1 Critical Path)',
      },
      {
        id: 'beta-qemu-e1000-network',
        title: 'Enable CosmosEnableNetwork=true & Verify QEMU e1000 TCP/IP Stack',
        detail:
          'Re-enable excluded CmdNetwork, CmdIp, CmdPing, and CmdDns modules against emulated Intel e1000 NIC.',
        status: 'In Progress',
        category: 'Networking & Audio',
        verifiedSource: 'source/Core/Network.cs • ZonderqOS.csproj',
      },
      {
        id: 'beta-baremetal-rtl810xe-hda',
        title: 'Bare-Metal Realtek RTL810xE Ethernet (10EC:8136) & Intel HDA PCM Audio Drivers',
        detail:
          'Extend hardware support beyond PCI bus identification (nicdiag) and PC Speaker (PIT Ch2) to physical laptop Ethernet and WAV/PCM output.',
        status: 'Planned',
        category: 'Networking & Audio',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (Beta 2 Scope)',
      },
      {
        id: 'beta-safe-installer-soak24h',
        title: 'Safe SSD/HDD Partition Installer, Shell Fuzzing & 24-Hour RAM Soak Suite',
        detail:
          'Guided disk provisioning with mandatory host ESP/EFI protection, multi-machine x86_64 validation, and 24-hour continuous memory stability test.',
        status: 'Planned',
        category: 'Storage & Update',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (Beta 3 Scope)',
      },
    ],
  },
  {
    id: 'stage-rc',
    stageNumber: 3,
    name: 'Stage 3 — Release Candidate',
    phaseLabel: 'Release Candidate — Planned',
    subtitle: 'Feature Freeze, Cryptographically Signed Release Images & Hardware Matrix Sign-Off',
    description:
      'Strict feature freeze focused on deterministic builds, full Ed25519 signed A/B update packages, zero-regression QMP test execution, and physical UEFI laptop sign-off.',
    status: 'Planned',
    tasks: [
      {
        id: 'rc-feature-freeze-audit',
        title: 'API & Subsystem Feature Freeze with 100% Contract Suite Pass Rate',
        detail:
          'Lock all kernel, VFS, and GUI contracts across all 85+ Python QMP suites and 23 C# host smoke test projects.',
        status: 'Planned',
        category: 'Kernel & Arch',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (RC Criteria)',
      },
      {
        id: 'rc-signed-ota-bundles',
        title: 'End-to-End Ed25519 Signed Update Bundle Rollout & 3-Strike Rollback Drill',
        detail:
          'Verify HasVerifiedIndependentPrebootRecovery() == true on both QEMU OVMF and physical UEFI hardware.',
        status: 'Planned',
        category: 'Storage & Update',
        verifiedSource: 'source/Core/Updates/ReleaseSignatureVerifier.cs',
      },
      {
        id: 'rc-physical-hardware-signoff',
        title: 'Full Physical Hardware Sign-Off on ASUS X540LA & Secondary x86_64 Targets',
        detail:
          'Confirm cold boot, USB xHCI HID input, persistent ZONDERQDATA storage, and clean ACPI power-off on physical UEFI hardware.',
        status: 'Planned',
        category: 'Hardware & Drivers',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md',
      },
    ],
  },
  {
    id: 'stage-v1',
    stageNumber: 4,
    name: 'Stage 4 — Version 1.0 Stable',
    phaseLabel: 'Version 1.0 Stable — Planned',
    subtitle:
      'First Official Public Bootable ISO Release on GitHub Releases with SHA-256 & Ed25519',
    description:
      'Public release of ZonderqOS 1.0 Stable for x86_64 UEFI hardware and QEMU virtual machines, complete with user/developer documentation and cryptographically signed ISO downloads.',
    status: 'Planned',
    tasks: [
      {
        id: 'v1-public-iso-release',
        title:
          'Publish Official Signed ZonderqOS 1.0 Stable ISO & SHA-256 Manifest on GitHub Releases',
        detail:
          'First public distribution artifact passing all RC hardware, security, and memory stability gates.',
        status: 'Planned',
        category: 'Storage & Update',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (1.0 Target)',
      },
      {
        id: 'v1-long-term-stability-gate',
        title:
          'Production Documentation, Hardware Compatibility Catalog & Long-Term Stability Gate',
        detail:
          'Complete end-user and developer reference manuals with verified multi-machine UEFI boot reports.',
        status: 'Planned',
        category: 'GUI & Apps',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md',
      },
    ],
  },
  {
    id: 'stage-future',
    stageNumber: 5,
    name: 'Stage 5 — Future Development (Post-1.0 Research Tracks)',
    phaseLabel: 'Future Development — Planned',
    subtitle: 'Multi-Core SMP/SMT, ARM64 Runtime Parity, Wi-Fi 802.11 & Hardware Compositing',
    description:
      'Long-term engineering tracks deliberately decoupled from the 1.0 critical path, including upstream Cosmos Gen3 multi-processor scheduling, ARM64 QEMU/hardware parity, and wireless drivers.',
    status: 'Planned',
    tasks: [
      {
        id: 'future-smp-multiprocessor',
        title: 'Multi-Processor SMP/SMT Integration with Upstream Cosmos Gen3 & Stop-The-World GC',
        detail:
          'Currently archived in archive/smp-paused-2026-10-26 awaiting upstream thread-safe OrionGC stop-the-world synchronization across AP cores.',
        status: 'Blocked',
        category: 'Kernel & Arch',
        verifiedSource: 'docs/cosmos-3095-migration.md • archive/smp-paused-2026-10-26',
      },
      {
        id: 'future-arm64-runtime-parity',
        title: 'ARM64 (aarch64) QEMU & Bare-Metal Runtime Parity (GICv3, PL011, ECAM)',
        detail:
          'ARM64 compiles cleanly today; runtime bring-up awaits local qemu-system-aarch64 harness and ARM64 GOP framebuffer integration.',
        status: 'Planned',
        category: 'Hardware & Drivers',
        verifiedSource: 'source/Platform/Arm64/* • verify-builds.sh',
      },
      {
        id: 'future-wifi-gpu-acceleration',
        title: 'Realtek RTL8723BE Wi-Fi (10EC:B723), I2C Touchpad & 2D Framebuffer Acceleration',
        detail:
          'Post-1.0 hardware expansion targeting wireless 802.11 connectivity, ELAN1000 I2C touchpad bus, and hardware-assisted compositing.',
        status: 'Planned',
        category: 'Hardware & Drivers',
        verifiedSource: 'docs/beta-roadmap-independent-audit.md (Separate Track)',
      },
    ],
  },
];
