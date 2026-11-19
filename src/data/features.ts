import type { FeatureItem } from '@/types/site';

export const featuresData: FeatureItem[] = [
  {
    id: 'custom-gui',
    title: 'Custom Graphical User Interface',
    description:
      '32-bit linear framebuffer desktop environment rendered via Limine UEFI GOP (1366×768×32 default, supporting up to 3840×2160) with zero-allocation cursor damage repair.',
    status: 'Implemented',
    iconName: 'Monitor',
    sourceModule: 'source/GUI/GuiManager.cs • Window.cs • DisplayModeSelector.cs',
    architecture: 'x86_64 (UEFI GOP)',
    technicalDetails: [
      'Preallocated 24×28 (672-pixel) CursorDamageRenderer avoids heap allocations in the 60 Hz pointer redraw loop.',
      'Includes StartMenu, Taskbar, CommandPalette, NotificationCenter, LockScreenManager, LoginScreenManager, and BootSplash.',
      'Verified across 105 consecutive GUI application launch/close cycles in QEMU with only +0.19 MB RAM drift.',
    ],
  },
  {
    id: 'cosmos-kernel-gen3',
    title: 'Cosmos Kernel Gen3 (NativeAOT)',
    description:
      'Built on unmodified stock Cosmos Kernel Gen3 (3.0.97) and .NET 10.0 Microsoft NativeAOT, compiling C# directly into standalone native ELF kernel binaries.',
    status: 'Implemented',
    iconName: 'Cpu',
    sourceModule: 'Kernel.cs • ZonderqOS.csproj (Cosmos.Sdk/3.0.97)',
    architecture: 'x86_64 & ARM64 compile boundary',
    technicalDetails: [
      'Targets net10.0 with Cosmos.Sdk 3.0.97, Cosmos.Kernel 3.0.97, and Cosmos.Kernel.System 3.0.97.',
      'Operates with single-CPU Stride Scheduler enabled (CosmosEnableScheduler=true) and strict platform isolation.',
      'Clean compilation enforced for both linux-x64 and linux-arm64 targets via ./verify-builds.sh.',
    ],
  },
  {
    id: 'disk-filesystems',
    title: 'Disk & File System Support',
    description:
      'Fail-closed FAT32 storage policy paired with an in-memory Unix-like virtual file system (/proc, /sys, /dev, /run, /tmp) and optional 64 MiB FAT32 RAM disk.',
    status: 'Implemented',
    iconName: 'HardDrive',
    sourceModule: 'source/Storage/Disk.cs • DataVolumePolicy.cs • VirtualFs.cs',
    architecture: 'x86_64 (FAT32 / VFS / RAM Disk)',
    technicalDetails: [
      'DataVolumePolicy mounts strictly the unique FAT32 partition labeled ZONDERQDATA at / and rejects host EFI/ESP partitions.',
      'RamRootVolume provides an ephemeral 64 MiB FAT32 RAM disk fallback when persistent media is absent.',
      'Enforces multi-user path ACL permissions verified by automated alice/root access control suites.',
    ],
  },
  {
    id: 'keyboard-mouse',
    title: 'Keyboard & Mouse Input Subsystem',
    description:
      'Unified PS/2 and USB HID keyboard and mouse pipeline using Cosmos.Kernel.System.Input with bounded per-frame event dispatch and desktop hotkeys.',
    status: 'Implemented',
    iconName: 'Keyboard',
    sourceModule: 'source/Common/CosmosKeyboardApiCompat.cs • InputBusDiagnostics.cs',
    architecture: 'x86_64 (PS/2 & USB xHCI HID)',
    technicalDetails: [
      'Caps keyboard queue processing to MaxKeyboardEventsPerFrame = 64 to prevent input flooding stalls.',
      'Supports window management hotkeys: Alt+Tab, Alt+Shift+Tab, Alt+F4, Alt+Space, Ctrl+Alt+L, and Ctrl+Alt+Del.',
      'Verified with QEMU usb-kbd and usb-tablet on xHCI; ELAN I2C laptop touchpads are currently unsupported.',
    ],
  },
  {
    id: 'app-manager-tools',
    title: 'Application Manager & System Tools',
    description:
      'Centralized ApplicationManager and AppRegistry hosting 38 registered desktop AppIds (44 *App.cs modules) alongside 91 interactive shell commands.',
    status: 'Implemented',
    iconName: 'AppWindow',
    sourceModule: 'source/GUI/Application/ApplicationManager.cs • AppRegistry.cs',
    architecture: 'x86_64 & Host Contract Suites',
    technicalDetails: [
      'System utilities include Terminal, FileManager, Notepad, Calculator, Settings, TaskManagerModern, DiskManager, HexViewer, BasicIde, and SecurityCenter.',
      'Creative & entertainment suite includes PaintApp, SpriteStudioApp, ImageViewerApp, ChiptuneApp, Demo3DApp, and 8 classic games.',
      'Includes Stage P1 local package manager command (zpkg) within the 91 Cmd*.cs terminal command modules.',
    ],
  },
  {
    id: 'memory-management',
    title: 'Memory Management & OrionGC Telemetry',
    description:
      'Combines Cosmos PageAllocator and OrionGC (Mark-and-Sweep) with proactive MemoryGuardian page monitoring, icon cache trimming, and NativeScratchBuffer allocations.',
    status: 'Implemented',
    iconName: 'MemoryStick',
    sourceModule: 'source/Core/MemoryGuardian.cs • MemoryOptimizer.cs • NativeScratchBuffer.cs',
    architecture: 'x86_64 & ARM64',
    technicalDetails: [
      'MemoryGuardian samples PageAllocator.TotalPageCount and FreePageCount every 4s; MemoryOptimizer trims cold icon buffers on the GUI thread.',
      'NativeScratchBuffer uses NativeMemory.AllocZeroed for scratch buffers >= 4096 bytes to reduce managed heap fragmentation.',
      'Manual GC.Collect calls are strictly prohibited in production code to prevent #PF/#GP faults.',
    ],
  },
  {
    id: 'ab-update-mechanism',
    title: 'A/B Update Mechanism & BootGuard EFI',
    description:
      'Dual-slot (Slot A/B) transactional update engine with Ed25519 signature verification, SHA-256 payload checks, and GNU-EFI pre-boot 3-strike rollback.',
    status: 'Experimental',
    iconName: 'RefreshCw',
    sourceModule: 'source/Core/Updates/BootSlotManager.cs • UpdateManager.cs • bootguard_efi.c',
    architecture: 'x86_64 (UEFI Chainloader)',
    technicalDetails: [
      'Implements UPDATE_FORMAT=2 with BouncyCastle Ed25519 signature verification and /boot/boot_state.cfg tracking.',
      'GNU-EFI bootguard_efi.c chainloads LIMINE.EFI and enforces B→B→B→A automatic rollback on unconfirmed boots.',
      'Marked Experimental / Fail-Closed: TrustedReleaseKey remains unset until full OVMF and physical hardware sign-off in Beta.',
    ],
  },
  {
    id: 'system-diagnostics',
    title: 'System Diagnostics & Crash Recovery',
    description:
      'Built-in diagnostic runner, hardware telemetry snapshots, structured crash reporting, kernel panic rollback triggers, and real-time process/page monitors.',
    status: 'Implemented',
    iconName: 'Activity',
    sourceModule: 'source/Core/SystemDoctor.cs • KernelPanic.cs • SystemDiagnosticRunner.cs',
    architecture: 'x86_64 & ARM64',
    technicalDetails: [
      'CLI and GUI tools include sysdoctor, sysreport, hwinfo, inputscan, nicdiag, and htop.',
      'KernelPanic renders a diagnostic panic screen, persists state via CrashReportStore, and signals boot rollback.',
      'BootTelemetry and BootSessionHealth validate runtime stability before marking a boot slot healthy.',
    ],
  },
  {
    id: 'networking-audio',
    title: 'Networking & Audio Subsystem Development',
    description:
      'Read-only PCI NIC identification and x64 PIT Channel 2 PC Speaker synthesizer active today; full TCP/IP Ethernet and HDA PCM audio drivers are in development for Beta.',
    status: 'In Development',
    iconName: 'Wifi',
    sourceModule: 'source/Core/Network.cs • source/Hardware/Speaker.cs • X64SpeakerDriver.cs',
    architecture: 'x86_64 (PIT Ch2 Active / NIC Stub)',
    technicalDetails: [
      'Networking is disabled in the completed Alpha baseline (CosmosEnableNetwork=false); nicdiag provides read-only PCI bus enumeration.',
      'Audio currently operates via x64 PC Speaker (port 0x61 + PIT Channel 2) powering MelodyPlayer and ChiptuneApp.',
      'QEMU e1000 networking, bare-metal Realtek RTL810xE, and Intel HDA PCM audio are scheduled for the Beta development phase.',
    ],
  },
  {
    id: 'experimental-arch-smp',
    title: 'Experimental Architecture (ARM64) & Multi-Processor (SMP)',
    description:
      'ARM64 compiles cleanly via NativeAOT with GICv3, PL011, and ACPI/ECAM flags; custom multi-core SMP is paused awaiting upstream Cosmos Gen3 SMP & stop-the-world GC.',
    status: 'Experimental',
    iconName: 'Layers',
    sourceModule: 'source/Platform/Arm64/* • docs/cosmos-3095-migration.md',
    architecture: 'ARM64 (Build Verified) & x86_64 SMP Track',
    technicalDetails: [
      'linux-arm64 NativeAOT build passes ./verify-builds.sh with platform-safe null guards for x86 PCI sysfs and PC Speaker.',
      'ARM64 runtime QEMU validation is currently blocked locally by missing qemu-system-aarch64 binary on the build host.',
      'Custom SMP implementation is archived in archive/smp-paused-2026-10-26; CmdSmtCheck honestly reports single-CPU scheduler state.',
    ],
  },
];
