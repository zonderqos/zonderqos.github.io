import type { FaqItem } from '@/types/site';

export const faqData: FaqItem[] = [
  {
    id: 'faq-what-is-zonderqos',
    category: 'Architecture',
    question: 'What is ZonderqOS?',
    answer:
      'ZonderqOS is an experimental 64-bit operating system written in C# (.NET 10.0 Microsoft NativeAOT) and built on Cosmos Kernel Gen3 (3.0.97). It features a custom 32-bit Limine UEFI GOP desktop environment, 38 registered GUI applications, 91 interactive shell commands, fail-closed FAT32 ZONDERQDATA volume mounting, OrionGC memory telemetry, and an Ed25519 A/B update engine.',
  },
  {
    id: 'faq-is-zonderqos-open-source',
    category: 'Architecture',
    question: 'Is ZonderqOS open source?',
    answer:
      'Yes. The ZonderqOS source code, build scripts, automated Python QMP verification suites, and C# smoke test projects are publicly available in the official GitHub repository at https://github.com/dwierzbicki11/ZOnderqOS.',
  },
  {
    id: 'faq-what-is-cosmos-gen3',
    category: 'Architecture',
    question: 'What is Cosmos Kernel Gen3?',
    answer:
      'Cosmos Kernel Gen3 is the third-generation C# operating system kernel framework that replaces the legacy 32-bit IL2CPU transpiler (Gen2) with official Microsoft NativeAOT compilation (.NET 10.0) directly to 64-bit native ELF executables. In ZonderqOS (Cosmos.Sdk 3.0.97), it provides Limine UEFI GOP integration, OrionGC (Mark-and-Sweep), PageAllocator, a single-CPU Stride Scheduler, and dual x86_64/ARM64 compilation boundaries.',
  },
  {
    id: 'faq-is-alpha-completed',
    category: 'Roadmap',
    question: 'Is ZonderqOS Alpha completed?',
    answer:
      'Yes. ZonderqOS Alpha development is 100% completed and tagged in the repository as v1.0.2-alpha.1 (Build 3120). All Alpha milestones — including migration to Cosmos Kernel Gen3 3.0.97, the 32-bit UEFI GOP window manager, 38 desktop applications, 91 shell commands, fail-closed FAT32 storage, and full English system UI localization — have been finished.',
  },
  {
    id: 'faq-where-can-i-download',
    category: 'Releases',
    question: 'Where can I download ZonderqOS?',
    answer:
      'Official public ISO releases will be distributed exclusively via GitHub Releases (https://github.com/dwierzbicki11/ZOnderqOS/releases). While Alpha development is completed in source code (v1.0.2-alpha.1), no pre-built public ISO binary has been uploaded to GitHub Releases yet. Developers can clone the repository and build a bootable x86_64 Limine ISO locally using ./verify-builds.sh and dotnet build -r linux-x64.',
  },
  {
    id: 'faq-what-comes-after-alpha',
    category: 'Roadmap',
    question: 'What comes after Alpha?',
    answer:
      'With Alpha completed, ZonderqOS has entered the Beta development phase. Beta focuses on end-to-end OVMF sign-off for the GNU-EFI A/B BootGuard chainloader, enabling active networking (QEMU e1000 and bare-metal Realtek RTL810xE), adding Intel HDA PCM audio drivers, fixing the 20s ACPI console shutdown timeout, re-verifying physical ASUS X540LA hardware on Cosmos 3.0.97, and building a safe SSD/HDD installer prior to Release Candidate and Version 1.0 Stable.',
  },
  {
    id: 'faq-host-disk-safety',
    category: 'Hardware & QEMU',
    question: 'Is ZonderqOS safe to boot on a machine with an existing operating system?',
    answer:
      'ZonderqOS enforces a strict fail-closed storage policy in DataVolumePolicy.cs: it will ONLY mount a unique FAT32 partition explicitly labeled ZONDERQDATA as its root volume (/), and it explicitly rejects mounting host EFI/ESP or unmarked system partitions. If no ZONDERQDATA volume is present, it can operate in an ephemeral 64 MiB FAT32 RAM disk (RamRootVolume).',
  },
  {
    id: 'faq-memory-gc-collect',
    category: 'Architecture',
    question: 'How does ZonderqOS manage memory without calling manual GC.Collect()?',
    answer:
      'Manual GC.Collect() calls are strictly prohibited in ZonderqOS because they can trigger #PF/#GP faults under bare-metal interrupt contexts. Instead, ZonderqOS relies on stock OrionGC combined with zero-allocation hot paths (such as the preallocated 24×28 CursorDamageRenderer), NativeMemory.AllocZeroed scratch buffers for blocks >= 4096 bytes, and MemoryOptimizer trimming cold icon caches on the GUI thread.',
  },
];
