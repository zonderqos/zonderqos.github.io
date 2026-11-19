import type { GenerationComparisonItem, ScreenshotItem } from '@/types/site';

export const screenshotsData: ScreenshotItem[] = [
  {
    id: 'desktop-authentic-wallpaper',
    title: 'ZonderqOS Gen3 Official Wallpaper Asset & Desktop Surface',
    caption:
      'Authentic 1920×1080 wallpaper asset (source/Wallpapers/wallpaper.png) bundled directly into the ZonderqOS Gen3 kernel image and rendered on the 32-bit Limine UEFI GOP framebuffer.',
    category: 'Desktop',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    src: '/assets/zonderqos/wallpaper.png',
    webpSrc: '/assets/zonderqos/wallpaper.webp',
    isPlaceholder: false,
    isAuthenticAsset: true,
    expectedReplacementPath: 'public/assets/zonderqos/wallpaper.webp',
    resolution: '1920×1080×32 (Scaled to GOP mode)',
    framebufferFormat: '32-bit Linear BGRA (Limine UEFI GOP)',
    highlights: [
      'source/Wallpapers/wallpaper.png',
      'GuiManager + UiPainter',
      'CursorDamageRenderer (24×28 zero-alloc)',
    ],
  },
  {
    id: 'desktop-window-manager-placeholder',
    title: 'Desktop Environment: Taskbar, StartMenu & CommandPalette',
    caption:
      'Placeholder awaiting verified QEMU QMP screendump of GuiManager rendering StartMenu, active multi-window stack, NotificationCenter, and taskbar clock on Cosmos 3.0.97.',
    category: 'Desktop',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/desktop-gen3-alpha1.webp',
    resolution: '1366×768×32 (Default Laptop GOP)',
    framebufferFormat: '32-bit Linear BGRA (Limine GOP)',
    highlights: [
      'source/GUI/GuiManager.cs',
      'source/GUI/StartMenu.cs',
      'Alt+Tab / Ctrl+Alt+L Window Shortcuts',
    ],
  },
  {
    id: 'apps-terminal-filemanager-placeholder',
    title: 'System Applications: Terminal (91 Commands) & FileManagerApp',
    caption:
      'Placeholder for side-by-side capture of the ZonderqOS Terminal executing zpkg / sysdoctor and FileManagerApp browsing the mounted ZONDERQDATA FAT32 volume.',
    category: 'System Applications',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/apps-terminal-filemanager.webp',
    resolution: '1366×768×32',
    framebufferFormat: '32-bit Linear BGRA',
    highlights: [
      '38 Registered AppIds (44 *App.cs)',
      '91 Cmd*.cs Shell Modules',
      'BasicIdeApp, HexViewerApp, PaintApp',
    ],
  },
  {
    id: 'settings-display-security-placeholder',
    title: 'SettingsApp, UserAccountsApp & SecurityCenterApp',
    caption:
      'Placeholder for SettingsApp display mode selector (up to 3840×2160), user account ACL configuration (root / alice), and LockScreenManager policy configuration.',
    category: 'Settings',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/settings-security-center.webp',
    resolution: '1366×768×32',
    framebufferFormat: '32-bit Linear BGRA',
    highlights: [
      'source/GUI/DisplayModeSelector.cs',
      '50× Lock/Unlock + 20× Wrong Password Verified',
      'ConfigManagerApp & SystemUpdaterApp',
    ],
  },
  {
    id: 'diagnostics-sysdoctor-htop-placeholder',
    title: 'DiagnosticsApp, HtopMonitor & MemoryGuardian Telemetry',
    caption:
      'Placeholder for real-time PageAllocator telemetry, OrionGC memory pressure tracking, sysdoctor self-tests, and KernelPanic recovery report viewer.',
    category: 'Diagnostics',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/diagnostics-sysdoctor-htop.webp',
    resolution: '1366×768×32',
    framebufferFormat: '32-bit Linear BGRA',
    highlights: [
      'source/Core/SystemDoctor.cs',
      'source/Core/MemoryGuardian.cs',
      '105 App Cycles (+0.19 MB RAM Drift)',
    ],
  },
  {
    id: 'boot-limine-ab-slot-placeholder',
    title: 'Limine UEFI Bootloader, BootSplash & Slot A/B BootGuard',
    caption:
      'Placeholder for the UEFI pre-boot chain: BOOTX64.EFI (GNU-EFI BootGuard) → LIMINE.EFI → ZonderqOS.elf BootSplash and ZONDERQDATA volume verification.',
    category: 'Boot & Installation',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/boot-limine-bootguard.webp',
    resolution: '1366×768×32 (UEFI GOP)',
    framebufferFormat: 'UEFI GOP Pre-Boot + BootSplash',
    highlights: [
      'Bootloader/limine.conf',
      'tools/bootguard/bootguard_efi.c (B→B→B→A)',
      'DataVolumePolicy Fail-Closed Mount',
    ],
  },
  {
    id: 'hardware-asus-x540la-placeholder',
    title: 'Bare-Metal Hardware Testing: ASUS X540LA UEFI & PCI Enumeration',
    caption:
      'Placeholder for physical photograph of ASUS X540LA running hwinfo, inputscan (Intel 8086:9CB1 xHCI), and nicdiag (Realtek 10EC:8136 / 10EC:B723 PCI scan) on Cosmos 3.0.97.',
    category: 'Hardware Testing',
    version: 'v1.0.2-alpha.1 (Build 3120)',
    generation: 'Gen3',
    isPlaceholder: true,
    expectedReplacementPath: 'public/screenshots/hardware-asus-x540la.webp',
    resolution: '1366×768 Native Panel',
    framebufferFormat: 'Physical UEFI GOP Framebuffer',
    highlights: [
      'ASUS X540LA Target Testbed',
      'PCI 8086:9CB1 xHCI / 10EC:8136 RTL810xE',
      'Awaiting Full 3.0.97 Bare-Metal Verification',
    ],
  },
];

export const generationComparisonData: GenerationComparisonItem[] = [
  {
    generation: 'Gen1',
    codename: 'Early Shell & Text-Mode Prototypes',
    period: 'Initial Concept Phase',
    compilerAndRuntime: 'Legacy Cosmos C# Prototype Stack',
    architecture: '32-bit x86 (i386)',
    bootAndDisplay: 'Legacy BIOS • VGA Text Mode (80×25) / Basic VBE Canvas',
    memoryAndGc: 'Static buffers / minimal manual allocation without proactive page telemetry',
    storageAndDrivers: 'Basic IDE/ATA emulation & simple FAT command loop',
    visualNotes:
      'No archived Gen1 screenshots exist in the current git repository. Gen1 focused on basic boot loops and text command parsing before graphical window management.',
    hasAuthenticScreenshot: false,
  },
  {
    generation: 'Gen2',
    codename: 'Cosmos Gen2 (IL2CPU & X# 32-bit Stack)',
    period: 'Pre-NativeAOT Architecture',
    compilerAndRuntime: 'Custom IL2CPU Transpiler + X# Pseudo-Assembler',
    architecture: '32-bit x86 Only',
    bootAndDisplay: 'Legacy BIOS / GRUB • VBE / VGA Framebuffer',
    memoryAndGc: 'RAT (RAM Allocation Table) • Non-thread-safe hlt loops • High fragmentation risk',
    storageAndDrivers: '8259 PIC • Legacy IDE/ATA + basic FAT (primarily emulator-bound)',
    visualNotes:
      'Documented in docs/ and presentation materials as the architectural baseline replaced by Gen3 due to 32-bit limits, IL2CPU fragility, and lack of modern UEFI/NativeAOT support.',
    hasAuthenticScreenshot: false,
  },
  {
    generation: 'Gen3',
    codename: 'ZonderqOS on Cosmos Kernel Gen3 (3.0.97)',
    period: 'Alpha Completed (v1.0.2-alpha.1)',
    compilerAndRuntime:
      'Official Microsoft NativeAOT (.NET 10.0) → Native ELF + NASM/GAS + C# Intrinsics',
    architecture: '64-bit x86_64 & ARM64 Compile Boundary',
    bootAndDisplay:
      'Limine UEFI GOP 32-bit Linear Framebuffer (1366×768×32 default, up to 3840×2160)',
    memoryAndGc:
      'OrionGC (Mark-and-Sweep) + PageAllocator + MemoryGuardian & zero-allocation cursor loop',
    storageAndDrivers:
      'LAI ACPI + APIC/GICv3 • Stride Scheduler • Fail-Closed ZONDERQDATA FAT32 • USB xHCI HID',
    visualNotes:
      'Features the custom 32-bit glass/dark desktop UI, 38 registered GUI apps, preallocated 24×28 CursorDamageRenderer, and authentic 1920×1080 wallpaper asset.',
    hasAuthenticScreenshot: true,
  },
];
