import type { HardwareTestEntry, NewsChangelogItem } from '@/types/site';

export const hardwareCompatibilityData: HardwareTestEntry[] = [
  {
    id: 'hw-qemu-x64-standard',
    platform: 'QEMU x86_64 (q35 / Standard PC)',
    category: 'Emulator / VM',
    cpuAndArch: 'x86_64 (1 vCPU & 8 vCPU configurations; Stride Scheduler on BSP)',
    firmwareAndBoot: 'UEFI / Limine Bootloader (ZonderqOS.elf)',
    displayMode: 'Limine UEFI GOP 1366×768×32 (up to 3840×2160 supported)',
    storageAndInput:
      'FAT32 ZONDERQDATA disk + 64 MiB RAM disk • PS/2 + qemu-xhci (usb-kbd, usb-tablet)',
    cosmos3097Status: 'Verified PASS',
    verifiedNotes:
      '10× reboot stability PASS, 105 GUI app cycles PASS (+0.19 MB drift), 50× Lock/Unlock + alice ACL PASS. Known gap targeted for Beta: console E2E ACPI shutdown exceeds 20s timeout (requires SIGTERM).',
  },
  {
    id: 'hw-qemu-ovmf-bootguard',
    platform: 'QEMU x86_64 OVMF (UEFI BootGuard Chainload)',
    category: 'Emulator / VM',
    cpuAndArch: 'x86_64 (UEFI Application + Kernel Chainload)',
    firmwareAndBoot: 'OVMF UEFI → BOOTX64.EFI (bootguard_efi.c) → LIMINE.EFI → Slot A/B',
    displayMode: 'UEFI GOP Framebuffer',
    storageAndInput: 'Dual-slot /boot/boot_state.cfg on FAT32 volume',
    cosmos3097Status: 'Partial / Known Gap',
    verifiedNotes:
      'UpdateEngineSmoke & ConfirmSlotHealth host tests PASS; GNU-EFI binaries compiled in tools/bootguard/build/; full OVMF B→B→B→A chainload sign-off is active in the Beta phase.',
  },
  {
    id: 'hw-asus-x540la',
    platform: 'ASUS X540LA Physical Laptop',
    category: 'Physical Hardware',
    cpuAndArch: 'Intel Core i3 (x86_64 Bare-Metal)',
    firmwareAndBoot: 'Native UEFI 2.x via USB Flash Media (zonderq-wgraj-iso.sh)',
    displayMode: '1366×768×32 Native Laptop Panel (UEFI GOP)',
    storageAndInput:
      'Intel Wildcat Point-LP xHCI (8086:9CB1) • Realtek RTL810xE (10EC:8136) • RTL8723BE (10EC:B723)',
    cosmos3097Status: 'Unverified on 3.0.97',
    verifiedNotes:
      'Previously booted from USB on Cosmos 3.0.94/3.0.95. Explicitly marked UNVERIFIED on Cosmos 3.0.97 in the Nov 18 audit pending physical USB re-test during Beta. ELAN1000 I2C touchpad and RTL NICs have no active driver yet.',
  },
  {
    id: 'hw-qemu-arm64',
    platform: 'QEMU ARM64 (aarch64 virt target)',
    category: 'Emulator / VM',
    cpuAndArch: 'ARM64 / aarch64 (GICv3, PL011 UART, ACPI/ECAM flags)',
    firmwareAndBoot: 'NativeAOT linux-arm64 ELF compilation (verify-builds.sh)',
    displayMode: 'Compile-time boundary verified',
    storageAndInput: 'Platform-safe null guards for x86 PCI sysfs & PC Speaker',
    cosmos3097Status: 'Blocked Locally',
    verifiedNotes:
      'Compiles cleanly without warnings via ./verify-builds.sh on Cosmos 3.0.97, but local runtime execution is currently blocked because qemu-system-aarch64 is not installed on the build host.',
  },
];

export const newsChangelogData: NewsChangelogItem[] = [
  {
    id: 'news-alpha1-3097',
    date: '2026-11-18',
    versionTag: 'v1.0.2-alpha.1 (Build 3120)',
    title: 'Alpha Milestone Completed: Cosmos Kernel Gen3 3.0.97 & Full English UI (#220)',
    summary:
      'Completed ZonderqOS Alpha development, upgraded ZonderqOS.csproj to Cosmos.Sdk 3.0.97 on .NET 10.0, finalized full English system UI localization, and executed 565 automated Python tests + 200 subtests.',
    highlights: [
      'Clean dual-architecture NativeAOT build for linux-x64 and linux-arm64.',
      '105 GUI app open/close cycles completed in QEMU with +0.19 MB RAM delta.',
    ],
  },
  {
    id: 'news-independent-audit',
    date: '2026-11-18',
    versionTag: 'Beta Transition',
    title: 'Transition to Beta Phase & Hardware Verification Matrix Published',
    summary:
      'Following Alpha completion, established the Beta engineering track focusing on OVMF A/B BootGuard chainloading, QEMU e1000 networking, Realtek RTL810xE & Intel HDA audio drivers, and physical ASUS X540LA validation.',
    highlights: [
      'Prioritized ACPI shutdown 20s console timeout fix and OVMF BootGuard sign-off for Beta 1.',
      'Scheduled bare-metal Ethernet, HDA audio, and safe disk installer for Beta 2–3.',
    ],
  },
  {
    id: 'news-bootguard-ed25519',
    date: '2026-11-15',
    versionTag: 'Build 3095 → 3120',
    title: 'Ed25519 ReleaseSignatureVerifier & GNU-EFI BootGuard Chainloader',
    summary:
      'Integrated BouncyCastle.Cryptography 2.7.0 for UPDATE_FORMAT=2 Ed25519 verification and compiled bootguard_efi.c for automatic B→B→B→A slot rollback.',
    highlights: [
      'Fail-closed security: unverified or unsigned update bundles are rejected before slot activation.',
      '60-minute continuous QEMU RAM soak test passed on Cosmos 3.0.95 with +0.19 MiB drift.',
    ],
  },
];

export const verifiedRepoMetrics = [
  {
    id: 'commits',
    value: '1,428',
    label: 'Verified Git Commits (main)',
    detail: 'HEAD 5c17f4b1 • Tag v1.0.2-alpha.1',
  },
  {
    id: 'gui-apps',
    value: '38 / 44',
    label: 'Registered AppIds / *App.cs Files',
    detail: 'source/GUI/Application/AppRegistry.cs',
  },
  {
    id: 'shell-cmds',
    value: '91',
    label: 'Shell Command Modules (Cmd*.cs)',
    detail: 'Includes zpkg, sysdoctor, hwinfo, nicdiag',
  },
  {
    id: 'test-suites',
    value: '565 PASS',
    label: '85 Python Suites + 23 C# Smoke Projects',
    detail: '+200 passed subtests (2026-11-18 run)',
  },
];
