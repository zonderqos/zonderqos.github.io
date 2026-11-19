import type {
  BootloaderArchitectureNote,
  HostOsProfile,
  LinuxDistroGuide,
  PlatformGuide,
  TroubleshootingItem,
  VmSpecRow,
} from '@/types/installation';

export const recommendedVmSpecsData: VmSpecRow[] = [
  {
    setting: 'Architecture',
    value: 'x86_64',
    notes: '64-bit Intel/AMD (Cosmos Kernel Gen3 NativeAOT ELF target)',
  },
  {
    setting: 'OS Type',
    value: 'Other / Other 64-bit',
    notes: 'Select "Other" → "Other/Unknown (64-bit)" in VirtualBox, VMware, or UTM',
  },
  {
    setting: 'CPU',
    value: '1 virtual CPU',
    notes: 'Stock Cosmos Gen3 uses a single-CPU Stride Scheduler (custom SMP is paused)',
  },
  {
    setting: 'RAM',
    value: '2048 MB',
    notes: 'Recommended baseline for GUI window surfaces, OrionGC, and 38 desktop apps',
  },
  {
    setting: 'Firmware',
    value: 'UEFI',
    notes: 'Provides the 32-bit UEFI GOP linear framebuffer (1366×768×32 default)',
  },
  {
    setting: 'Secure Boot',
    value: 'Disabled',
    notes: 'Must be disabled so UEFI loads Limine / ZonderqOS.elf without Microsoft WHQL keys',
  },
  {
    setting: '3D Acceleration',
    value: 'Disabled',
    notes: 'ZonderqOS renders directly to the 32-bit linear GOP framebuffer in software',
  },
  {
    setting: 'Video Memory',
    value: '128 MB where configurable',
    notes: 'Ensures sufficient framebuffer memory for resolutions up to 3840×2160×32',
  },
  {
    setting: 'Virtual Disk',
    value: '8 GB (minimum 68 MB; 160+ MB for dual ESP + System)',
    notes:
      'An empty unformatted SATA/AHCI virtual disk is supported directly by the built-in ZonderqOS Graphical Installer (no manual fdisk/mkfs.vfat required)',
  },
  {
    setting: 'Data Partition',
    value: 'Automated by ZonderqOS Installer (ESP + FAT32 ZONDERQDATA)',
    notes:
      'The graphical installer automatically creates the 64 MB EFI System Partition (ZONDERQEFI) and ZonderqOS System Partition (FAT32 ZONDERQDATA), installs Limine UEFI/BIOS + BootGuard, and configures Slot A',
  },
  {
    setting: 'Boot Media',
    value: 'ZonderqOS ISO (Live & Installer)',
    notes:
      'Boots directly into the ephemeral RAM-backed Live desktop & Graphical Installer even when no ZONDERQDATA partition exists; disconnect ISO after installation',
  },
];

export const linuxDistroGuidesData: LinuxDistroGuide[] = [
  {
    id: 'ubuntu-debian',
    name: 'Ubuntu / Debian / Kali / Mint',
    shortName: 'Ubuntu / Debian (apt)',
    packageManager: 'apt',
    installPackagesCmd:
      'sudo apt update && sudo apt install -y qemu-system-x86 ovmf fdisk dosfstools util-linux',
    vboxInstallCmd: 'sudo apt install -y virtualbox',
    ovmfFirmwarePath: '/usr/share/ovmf/OVMF.fd',
    notes:
      'Tested on Debian/Ubuntu/Kali derivatives. Provides sfdisk (fdisk), mkfs.vfat (dosfstools), qemu-system-x86_64, and OVMF UEFI firmware.',
  },
  {
    id: 'arch',
    name: 'Arch Linux / Manjaro / EndeavourOS',
    shortName: 'Arch Linux (pacman)',
    packageManager: 'pacman',
    installPackagesCmd: 'sudo pacman -Syu --needed qemu-desktop edk2-ovmf util-linux dosfstools',
    vboxInstallCmd: 'sudo pacman -S --needed virtualbox virtualbox-host-modules-arch',
    ovmfFirmwarePath: '/usr/share/edk2/x64/OVMF.4m.fd',
    notes:
      'On Arch Linux, edk2-ovmf installs 64-bit UEFI firmware under /usr/share/edk2/x64/OVMF.4m.fd (or /usr/share/ovmf/x64/OVMF.fd).',
  },
  {
    id: 'fedora',
    name: 'Fedora / RHEL / Rocky / AlmaLinux',
    shortName: 'Fedora / RHEL (dnf)',
    packageManager: 'dnf',
    installPackagesCmd: 'sudo dnf install -y qemu-system-x86 edk2-ovmf util-linux dosfstools',
    vboxInstallCmd: 'sudo dnf install -y VirtualBox',
    ovmfFirmwarePath: '/usr/share/edk2/ovmf/OVMF_CODE.fd',
    notes:
      'On Fedora and Enterprise Linux, use dnf to install qemu-system-x86, edk2-ovmf, util-linux (sfdisk), and dosfstools (mkfs.vfat).',
  },
  {
    id: 'opensuse',
    name: 'openSUSE Tumbleweed / Leap',
    shortName: 'openSUSE (zypper)',
    packageManager: 'zypper',
    installPackagesCmd: 'sudo zypper install -y qemu-x86 qemu-ovmf-x86_64 util-linux dosfstools',
    vboxInstallCmd: 'sudo zypper install -y virtualbox',
    ovmfFirmwarePath: '/usr/share/qemu/ovmf-x86_64.bin',
    notes:
      'On openSUSE, qemu-ovmf-x86_64 provides the UEFI firmware image under /usr/share/qemu/ovmf-x86_64.bin.',
  },
];

export const hostOsProfilesData: HostOsProfile[] = [
  {
    id: 'linux',
    name: 'Linux (Ubuntu, Arch, Fedora, openSUSE)',
    shortName: 'Linux',
    subtitle:
      'Primary development and CI verification host OS with native KVM hardware acceleration, sfdisk, and mkfs.vfat.',
    badge: 'Recommended Native Host',
    architectureNote:
      'Supports full hardware virtualization (-accel kvm) on x86_64 Linux hosts as well as deterministic software emulation (-accel tcg). Select your Linux distribution below for tailored package manager commands.',
    sha256VerifyCmd: 'sha256sum ZonderqOS.iso',
    diskPrepTitle: 'Linux Universal ZONDERQDATA Disk Image Creation (sfdisk + mkfs.vfat)',
    diskPrepSummary:
      'Works across Ubuntu, Debian, Kali, Arch, Fedora, and openSUSE. Creates a 2 GiB image with an MBR type 0x0C (FAT32 LBA) partition starting at sector 2048 labeled ZONDERQDATA:',
    diskPrepCommands: [
      'truncate -s 2G zonderqdata.img',
      "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
      'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
    ],
    shellLabel: 'bash (Linux)',
  },
  {
    id: 'windows',
    name: 'Windows 10 / Windows 11',
    shortName: 'Windows',
    subtitle:
      'Run ZonderqOS on Windows using VirtualBox, VMware Workstation, QEMU for Windows, or flash a physical USB drive via Rufus (DD Mode) + DiskPart.',
    badge: 'PowerShell / DiskPart / WSL2',
    architectureNote:
      'On Windows, you can prepare the required MBR FAT32 ZONDERQDATA virtual disk either natively with DiskPart (creating a 2048 MB .vhd file that VirtualBox attaches directly or converts to .vdi/.vmdk) or inside WSL2 (Ubuntu on Windows).',
    sha256VerifyCmd: 'Get-FileHash .\\ZonderqOS.iso -Algorithm SHA256',
    diskPrepTitle: 'Windows Native ZONDERQDATA Virtual Disk Creation (PowerShell + DiskPart VHD)',
    diskPrepSummary:
      'Run in an Administrator PowerShell terminal to create a 2048 MB fixed VHD with an MBR partition table and a primary FAT32 partition labeled ZONDERQDATA:',
    diskPrepCommands: [
      '$VhdPath = "$PWD\\zonderqdata.vhd"',
      '@(',
      '  "create vdisk file=`"$VhdPath`" maximum=2048 type=fixed"',
      '  "select vdisk file=`"$VhdPath`""',
      '  "attach vdisk"',
      '  "convert mbr"',
      '  "create partition primary"',
      '  "format fs=fat32 label=`"ZONDERQDATA`" quick"',
      '  "detach vdisk"',
      '  "exit"',
      ') | Set-Content -Path "$PWD\\prep-zonderqdata.txt" -Encoding ASCII',
      'diskpart /s "$PWD\\prep-zonderqdata.txt"',
    ],
    shellLabel: 'PowerShell (Administrator)',
  },
  {
    id: 'macos',
    name: 'macOS / MacBook (Apple Silicon & Intel)',
    shortName: 'macOS / MacBook',
    subtitle:
      'Run ZonderqOS on Apple Silicon MacBooks (M1 / M2 / M3 / M4) via QEMU x86_64 TCG emulation or UTM, or on Intel MacBooks via HVF, VirtualBox, or VMware Fusion.',
    badge: 'Apple Silicon M1–M4 & Intel Mac',
    architectureNote:
      'IMPORTANT FOR APPLE SILICON (M1/M2/M3/M4): Because the published ZonderqOS Alpha ISO (v1.0.0-alfa) is compiled for x86_64, Apple Silicon MacBooks must use x86_64 CPU emulation (QEMU -accel tcg or UTM "Emulate → x86_64" mode). Intel MacBooks can use native hardware virtualization (-accel hvf, VirtualBox, or VMware Fusion).',
    sha256VerifyCmd: 'shasum -a 256 ZonderqOS.iso',
    diskPrepTitle: 'macOS Native ZONDERQDATA Disk Image Creation (hdiutil MBRSPUD)',
    diskPrepSummary:
      'macOS includes built-in hdiutil support for creating an MBR-partitioned ("MBRSPUD") FAT32 disk image labeled ZONDERQDATA without requiring Linux sfdisk:',
    diskPrepCommands: [
      'hdiutil create -size 2g -fs "MS-DOS FAT32" -volname "ZONDERQDATA" -layout MBRSPUD -type UDIF -o zonderqdata.dmg',
      'hdiutil convert zonderqdata.dmg -format UDTO -o zonderqdata.cdr',
      'mv zonderqdata.cdr zonderqdata.img && rm -f zonderqdata.dmg',
    ],
    shellLabel: 'zsh / bash (macOS Terminal)',
  },
];

export const limineBootEntriesData: BootloaderArchitectureNote[] = [
  {
    id: 'limine-slot-a',
    title: 'Entry 1 (Default after 5s)',
    menuEntry: '/ZonderqOS Slot A',
    kernelPath: 'fslabel(ZONDERQDATA):/boot/slot_a/ZonderqOS.elf',
    whenToUse:
      'Boots the primary installed kernel directly from the ZONDERQDATA FAT32 partition. Requires /boot/slot_a/ZonderqOS.elf to exist on ZONDERQDATA (automatically seeded on prepared USB drives or seeded VM disks).',
  },
  {
    id: 'limine-slot-b',
    title: 'Entry 2 (A/B Fallback Slot)',
    menuEntry: '/ZonderqOS Slot B',
    kernelPath: 'fslabel(ZONDERQDATA):/boot/slot_b/ZonderqOS.elf',
    whenToUse:
      'Used by the A/B update engine (BootSlotManager) to test an updated kernel or roll back automatically after 3 unconfirmed boot attempts.',
  },
  {
    id: 'limine-recovery-iso',
    title: 'Entry 3 (ISO Auto / Live & Installer)',
    menuEntry: '/ZonderqOS Recovery ISO',
    kernelPath: 'boot():/boot/ZonderqOS.elf',
    whenToUse:
      'Default ISO boot entry. Mounts an existing unique ZONDERQDATA partition if present, or automatically starts the ephemeral RAM-backed Live & Graphical Installer environment when booting on an empty disk.',
  },
  {
    id: 'limine-live-installer',
    title: 'Entry 4 (Force Live & Installer RAM Mode)',
    menuEntry: '/ZonderqOS Live & Installer',
    kernelPath: 'boot():/boot/ZonderqOS.elf (cmdline: live)',
    whenToUse:
      'Forces the ephemeral 64 MiB RAM-backed Live desktop and launches the 7-screen ZonderqOS Graphical Installer without mounting or writing to any physical disk until you explicitly confirm a target disk.',
  },
];

export const platformGuidesData: PlatformGuide[] = [
  {
    id: 'virtualbox',
    name: 'Oracle VirtualBox',
    shortName: 'VirtualBox',
    verificationLevel: 'Experimental / Community Hypervisor Target',
    officialToolUrl: 'https://www.virtualbox.org/wiki/Downloads',
    officialToolLabel: 'Download Oracle VirtualBox',
    summary:
      'Run ZonderqOS in Oracle VirtualBox using EFI firmware, 1 vCPU, 2048 MB RAM, and a pre-formatted FAT32 disk labeled ZONDERQDATA attached to the SATA (IntelAHCI) controller.',
    controllerRecommendation:
      'Attach ZonderqOS.iso to an Optical Drive and your prepared ZONDERQDATA VDI (or VHD on Windows) to the SATA (IntelAHCI) controller. Do not use an empty unformatted disk created in the VirtualBox wizard.',
    freshBootLimineNotice:
      'When booting with a blank formatted ZONDERQDATA VDI/VHD (where /boot/slot_a/ZonderqOS.elf has not been copied onto the disk yet), press Down Arrow in the Limine boot menu and select "/ZonderqOS Recovery ISO" (Entry 3).',
    stepsByHost: {
      linux: [
        {
          stepNumber: 1,
          title: 'Download ZonderqOS.iso & install VirtualBox on your Linux distribution',
          description:
            'Download ZonderqOS.iso from the Downloads section above, verify its SHA-256 checksum, and install Oracle VirtualBox plus disk tools (fdisk/sfdisk and dosfstools):',
          shellLabel: 'bash (Linux)',
          commands: [
            'sha256sum ZonderqOS.iso',
            '# Ubuntu / Debian: sudo apt install -y virtualbox fdisk dosfstools',
            '# Arch Linux:      sudo pacman -S --needed virtualbox virtualbox-host-modules-arch util-linux dosfstools',
            '# Fedora:          sudo dnf install -y VirtualBox util-linux dosfstools',
          ],
        },
        {
          stepNumber: 2,
          title: 'Prepare the MBR FAT32 ZONDERQDATA image and convert it to VDI',
          description:
            'Create a 2 GiB raw image with an MBR type 0x0C FAT32 partition labeled ZONDERQDATA, then convert it into VDI format using VBoxManage:',
          shellLabel: 'bash (Linux)',
          commands: [
            'truncate -s 2G zonderqdata.img',
            "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
            'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
            'VBoxManage convertfromraw zonderqdata.img zonderqdata.vdi --format VDI',
          ],
          warning:
            'The FAT32 volume label must be exactly ZONDERQDATA (11 uppercase characters) on an MBR type 0x0C or 0x0B primary partition.',
        },
        {
          stepNumber: 3,
          title: 'Create and configure the 64-bit VirtualBox VM (EFI, 1 vCPU, 2048 MB RAM)',
          description:
            'Register a new Other_64 VM, enable EFI firmware, disable 3D acceleration, and attach both zonderqdata.vdi and ZonderqOS.iso to an IntelAHCI SATA controller:',
          shellLabel: 'bash (Linux)',
          commands: [
            'VBoxManage createvm --name "ZonderqOS" --ostype "Other_64" --register',
            'VBoxManage modifyvm "ZonderqOS" --memory 2048 --cpus 1 --vram 128 --graphicscontroller vmsvga',
            'VBoxManage modifyvm "ZonderqOS" --firmware efi --accelerate3d off --mouse usbtablet --keyboard ps2',
            'VBoxManage storagectl "ZonderqOS" --name "SATA Controller" --add sata --controller IntelAHCI',
            'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "$PWD/zonderqdata.vdi"',
            'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium "$PWD/ZonderqOS.iso"',
          ],
        },
        {
          stepNumber: 4,
          title: 'Boot ZonderqOS and select "/ZonderqOS Recovery ISO" (Entry 3) on first boot',
          description:
            'Launch the VM (VBoxManage startvm "ZonderqOS"). In the Limine menu, choose Entry 3 ("/ZonderqOS Recovery ISO") to boot the kernel from the ISO with your ZONDERQDATA VDI mounted at /.',
        },
      ],
      windows: [
        {
          stepNumber: 1,
          title: 'Verify ZonderqOS.iso SHA-256 in Windows PowerShell',
          description:
            'Open PowerShell in the folder containing your downloaded ZonderqOS.iso and verify the SHA-256 hash:',
          shellLabel: 'PowerShell',
          commands: [
            'Get-FileHash .\\ZonderqOS.iso -Algorithm SHA256',
            '# Expected for v1.0.0-alfa: 4507333C4083CAF26DD869B8275390CE3C72D3C70CC4838AD1350EF1C36E9FC8',
          ],
        },
        {
          stepNumber: 2,
          title: 'Create an MBR FAT32 ZONDERQDATA disk on Windows (DiskPart VHD → VDI)',
          description:
            'In an Administrator PowerShell window, use DiskPart to create a 2048 MB MBR-partitioned FAT32 virtual disk labeled ZONDERQDATA, then convert it to VDI using VBoxManage.exe:',
          shellLabel: 'PowerShell (Administrator)',
          commands: [
            '$VhdPath = "$PWD\\zonderqdata.vhd"',
            '@(',
            '  "create vdisk file=`"$VhdPath`" maximum=2048 type=fixed"',
            '  "select vdisk file=`"$VhdPath`""',
            '  "attach vdisk"',
            '  "convert mbr"',
            '  "create partition primary"',
            '  "format fs=fat32 label=`"ZONDERQDATA`" quick"',
            '  "detach vdisk"',
            '  "exit"',
            ') | Set-Content -Path "$PWD\\prep-zonderqdata.txt" -Encoding ASCII',
            'diskpart /s "$PWD\\prep-zonderqdata.txt"',
            '& "C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe" clonemedium disk "$PWD\\zonderqdata.vhd" "$PWD\\zonderqdata.vdi" --format VDI',
          ],
          warning:
            'Do not create a blank unformatted VDI inside the VirtualBox GUI wizard — ZonderqOS will refuse to boot unless the disk already contains an MBR FAT32 partition labeled ZONDERQDATA.',
        },
        {
          stepNumber: 3,
          title: 'Create and configure the VirtualBox VM via PowerShell',
          description:
            'Configure the VM with 1 vCPU, 2048 MB RAM, EFI enabled, 3D acceleration disabled, and attach zonderqdata.vdi and ZonderqOS.iso to the SATA controller:',
          shellLabel: 'PowerShell',
          commands: [
            '$VBox = "C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe"',
            '& $VBox createvm --name "ZonderqOS" --ostype "Other_64" --register',
            '& $VBox modifyvm "ZonderqOS" --memory 2048 --cpus 1 --vram 128 --graphicscontroller vmsvga --firmware efi --accelerate3d off --mouse usbtablet --keyboard ps2',
            '& $VBox storagectl "ZonderqOS" --name "SATA Controller" --add sata --controller IntelAHCI',
            '& $VBox storageattach "ZonderqOS" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "$PWD\\zonderqdata.vdi"',
            '& $VBox storageattach "ZonderqOS" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium "$PWD\\ZonderqOS.iso"',
          ],
        },
        {
          stepNumber: 4,
          title: 'Start the VM and select Entry 3 ("/ZonderqOS Recovery ISO") in Limine',
          description:
            'Start the VM from VirtualBox Manager. When the Limine menu appears, press Down Arrow and select "/ZonderqOS Recovery ISO" so the kernel boots from the ISO and mounts your ZONDERQDATA VDI at /.',
        },
      ],
      macos: [
        {
          stepNumber: 1,
          title: 'Check MacBook CPU Architecture (Intel Mac vs. Apple Silicon M1–M4)',
          description:
            'On Intel MacBooks (x86_64), Oracle VirtualBox runs x86_64 guests natively. On Apple Silicon MacBooks (M1 / M2 / M3 / M4 ARM64), switch to the "QEMU / KVM / UTM" tab above to run ZonderqOS using x86_64 TCG emulation!',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'uname -m',
            '# x86_64 = Intel Mac (VirtualBox supported)',
            '# arm64  = Apple Silicon M1/M2/M3/M4 (Use the QEMU / UTM tab for x86_64 emulation!)',
            'shasum -a 256 ZonderqOS.iso',
          ],
        },
        {
          stepNumber: 2,
          title: 'Create the MBR FAT32 ZONDERQDATA disk on macOS using hdiutil & VBoxManage',
          description:
            'Use macOS built-in hdiutil with -layout MBRSPUD to create a 2 GB MBR-partitioned FAT32 image labeled ZONDERQDATA, then convert it to VDI:',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'hdiutil create -size 2g -fs "MS-DOS FAT32" -volname "ZONDERQDATA" -layout MBRSPUD -type UDIF -o zonderqdata.dmg',
            'hdiutil convert zonderqdata.dmg -format UDTO -o zonderqdata.cdr',
            'mv zonderqdata.cdr zonderqdata.img && rm -f zonderqdata.dmg',
            'VBoxManage convertfromraw zonderqdata.img zonderqdata.vdi --format VDI',
          ],
        },
        {
          stepNumber: 3,
          title: 'Configure the VirtualBox VM on Intel MacBook',
          description:
            'Create an Other_64 VM with EFI enabled, 2048 MB RAM, 1 vCPU, and attach zonderqdata.vdi + ZonderqOS.iso:',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'VBoxManage createvm --name "ZonderqOS" --ostype "Other_64" --register',
            'VBoxManage modifyvm "ZonderqOS" --memory 2048 --cpus 1 --vram 128 --graphicscontroller vmsvga --firmware efi --accelerate3d off --mouse usbtablet',
            'VBoxManage storagectl "ZonderqOS" --name "SATA Controller" --add sata --controller IntelAHCI',
            'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium "$PWD/zonderqdata.vdi"',
            'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium "$PWD/ZonderqOS.iso"',
          ],
        },
      ],
    },
  },
  {
    id: 'vmware',
    name: 'VMware Workstation / Fusion',
    shortName: 'VMware',
    verificationLevel: 'Experimental / Community Hypervisor Target',
    officialToolUrl: 'https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion',
    officialToolLabel: 'VMware Workstation / Fusion',
    summary:
      'Configure a custom Other 64-bit virtual machine in VMware Workstation (Linux/Windows) or VMware Fusion (Intel Mac) with UEFI firmware (Secure Boot disabled) and a pre-formatted ZONDERQDATA VMDK disk.',
    controllerRecommendation:
      'Use a SATA (AHCI) or IDE controller for both the CD/DVD ISO drive and the converted zonderqdata.vmdk virtual disk. Avoid paravirtualized PVSCSI or NVMe controllers.',
    freshBootLimineNotice:
      'On first boot with a newly formatted VMDK disk, choose "/ZonderqOS Recovery ISO" (Entry 3) in the Limine menu so the kernel loads from the ISO while mounting your ZONDERQDATA VMDK as /.',
    stepsByHost: {
      linux: [
        {
          stepNumber: 1,
          title: 'Prepare the ZONDERQDATA raw disk image and convert it to VMDK on Linux',
          description:
            'Create a 2 GiB MBR-partitioned FAT32 image labeled ZONDERQDATA and convert it into a VMware VMDK file using qemu-img:',
          shellLabel: 'bash (Linux)',
          commands: [
            'truncate -s 2G zonderqdata.img',
            "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
            'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
            'qemu-img convert -f raw -O vmdk zonderqdata.img zonderqdata.vmdk',
          ],
        },
        {
          stepNumber: 2,
          title: 'Create a Custom Virtual Machine (Other 64-bit, UEFI without Secure Boot)',
          description:
            'In VMware Workstation for Linux, select "Create a New Virtual Machine" → "Custom (advanced)" → Guest OS: "Other" → Version: "Other 64-bit". Under VM Settings → Options → Advanced, select Firmware type: "UEFI" and leave "Enable Secure Boot" unchecked.',
        },
        {
          stepNumber: 3,
          title: 'Configure Resources, Disable 3D Acceleration & Attach zonderqdata.vmdk',
          description:
            'Set 1 Processor core, 2048 MB RAM, uncheck "Accelerate 3D graphics" under Display, attach ZonderqOS.iso to CD/DVD (SATA/IDE), and select "Use an existing virtual disk" → zonderqdata.vmdk on a SATA (AHCI) or IDE controller.',
        },
      ],
      windows: [
        {
          stepNumber: 1,
          title: 'Create the ZONDERQDATA VHD on Windows and convert to VMDK (or prepare via WSL2)',
          description:
            'In Administrator PowerShell, create the MBR FAT32 ZONDERQDATA.vhd using DiskPart and convert it to VMDK with qemu-img.exe (or run the sfdisk + mkfs.vfat + qemu-img commands inside WSL2 Ubuntu):',
          shellLabel: 'PowerShell (Administrator)',
          commands: [
            '# Option A: Convert DiskPart VHD to VMDK using qemu-img for Windows:',
            'qemu-img.exe convert -f vpc -O vmdk .\\zonderqdata.vhd .\\zonderqdata.vmdk',
            '',
            '# Option B: Inside WSL2 (Ubuntu on Windows):',
            'wsl bash -c "truncate -s 2G zonderqdata.img && printf \'label: dos\\nunit: sectors\\nstart=2048, type=c\\n\' | sfdisk zonderqdata.img && mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img && qemu-img convert -f raw -O vmdk zonderqdata.img zonderqdata.vmdk"',
          ],
        },
        {
          stepNumber: 2,
          title: 'Configure VMware Workstation on Windows (Other 64-bit + UEFI)',
          description:
            'Create a Custom VM with Guest OS "Other 64-bit", 1 vCPU, 2048 MB RAM, Display 3D acceleration disabled, Firmware set to UEFI (Secure Boot unchecked), CD/DVD pointing to ZonderqOS.iso, and Existing Virtual Disk pointing to zonderqdata.vmdk on a SATA controller.',
        },
        {
          stepNumber: 3,
          title: 'Boot and select Entry 3 ("/ZonderqOS Recovery ISO") in Limine',
          description:
            'Power on the VM and select "/ZonderqOS Recovery ISO" at the Limine menu to load the kernel from the ISO and mount zonderqdata.vmdk as /.',
        },
      ],
      macos: [
        {
          stepNumber: 1,
          title: 'Create the ZONDERQDATA VMDK on macOS (Intel Mac VMware Fusion)',
          description:
            'Note: VMware Fusion on Apple Silicon (M1–M4) only runs ARM64 guests — on Apple Silicon MacBooks, use the "QEMU / KVM / UTM" tab instead! On Intel MacBooks, install qemu via Homebrew and convert an hdiutil MBRSPUD image to VMDK:',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'brew install qemu',
            'hdiutil create -size 2g -fs "MS-DOS FAT32" -volname "ZONDERQDATA" -layout MBRSPUD -type UDIF -o zonderqdata.dmg',
            'hdiutil convert zonderqdata.dmg -format UDTO -o zonderqdata.cdr',
            'mv zonderqdata.cdr zonderqdata.img && rm -f zonderqdata.dmg',
            'qemu-img convert -f raw -O vmdk zonderqdata.img zonderqdata.vmdk',
          ],
        },
        {
          stepNumber: 2,
          title: 'Configure VMware Fusion on Intel Mac',
          description:
            'Create a custom Other 64-bit VM, enable UEFI firmware (Secure Boot disabled), set 1 CPU core and 2048 MB RAM, disable 3D acceleration, attach ZonderqOS.iso and zonderqdata.vmdk (SATA), and boot Entry 3 ("/ZonderqOS Recovery ISO").',
        },
      ],
    },
  },
  {
    id: 'qemu',
    name: 'QEMU / KVM / UTM',
    shortName: 'QEMU / KVM / UTM',
    verificationLevel: 'Verified in Automated CI (Primary Target)',
    officialToolUrl: 'https://www.qemu.org/download/',
    officialToolLabel: 'QEMU & UTM Downloads',
    summary:
      'QEMU x86_64 (q35 + ICH9 AHCI + qemu-xhci USB mouse) is the primary reference platform verified across 85 automated Python QMP suites — and is also the recommended way to run ZonderqOS on Apple Silicon MacBooks (M1–M4 via TCG / UTM) and Linux/Windows hosts.',
    controllerRecommendation:
      'Uses -M q35 -cpu Nehalem -smp 1 -m 2048M -vga std with an ich9-ahci SATA controller for zonderqdata.img and qemu-xhci for USB pointer input.',
    freshBootLimineNotice:
      'Select "/ZonderqOS Recovery ISO" (Entry 3) in the Limine boot menu when booting with a newly formatted zonderqdata.img so Limine loads ZonderqOS.elf from the ISO CD-ROM and mounts zonderqdata.img at /.',
    stepsByHost: {
      linux: [
        {
          stepNumber: 1,
          title:
            'Install QEMU, OVMF, fdisk (sfdisk), and dosfstools (mkfs.vfat) on your Linux Distro',
          description:
            'Use the command matching your Linux distribution (or select your distro in the Linux Distribution bar above):',
          shellLabel: 'bash (Linux — Ubuntu / Arch / Fedora / openSUSE)',
          commands: [
            '# Ubuntu / Debian / Kali / Mint (apt):',
            'sudo apt update && sudo apt install -y qemu-system-x86 ovmf fdisk dosfstools util-linux',
            '',
            '# Arch Linux / Manjaro / EndeavourOS (pacman):',
            'sudo pacman -Syu --needed qemu-desktop edk2-ovmf util-linux dosfstools',
            '',
            '# Fedora / RHEL / Rocky / AlmaLinux (dnf):',
            'sudo dnf install -y qemu-system-x86 edk2-ovmf util-linux dosfstools',
            '',
            '# openSUSE Tumbleweed / Leap (zypper):',
            'sudo zypper install -y qemu-x86 qemu-ovmf-x86_64 util-linux dosfstools',
          ],
        },
        {
          stepNumber: 2,
          title: 'Create and format the persistent ZONDERQDATA disk image',
          description:
            'Reusing the exact verified procedure from tools/run-gui-qemu-3095.sh, create a 2 GiB disk image with an MBR type 0x0C partition at sector 2048 formatted as FAT32 labeled ZONDERQDATA:',
          shellLabel: 'bash (Linux)',
          commands: [
            'truncate -s 2G zonderqdata.img',
            "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
            'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
          ],
        },
        {
          stepNumber: 3,
          title: 'Launch ZonderqOS in QEMU (TCG or KVM) with ICH9 AHCI and xHCI USB Mouse',
          description:
            'Boot ZonderqOS using the repository-tested flags (you can replace -accel tcg with -accel kvm on x86_64 Linux machines with /dev/kvm enabled):',
          shellLabel: 'bash (Linux)',
          commands: [
            'qemu-system-x86_64 \\',
            '  -M q35 -accel tcg -cpu Nehalem -smp 1 -m 2048M \\',
            '  -vga std \\',
            '  -drive "file=ZonderqOS.iso,if=none,id=cosmoscd,format=raw,readonly=on" \\',
            '  -device ide-cd,drive=cosmoscd,bootindex=0 -boot d \\',
            '  -device ich9-ahci,id=ahci0 \\',
            '  -drive "file=zonderqdata.img,if=none,id=ahcidisk0,format=raw,cache=directsync" \\',
            '  -device ide-hd,drive=ahcidisk0,bus=ahci0.0 \\',
            '  -device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0 \\',
            '  -serial stdio -no-reboot',
          ],
        },
      ],
      windows: [
        {
          stepNumber: 1,
          title: 'Install QEMU for Windows and prepare zonderqdata.vhd via DiskPart',
          description:
            'Install QEMU on Windows (via winget install SoftwareFreedomConservancy.QEMU) and create the 2048 MB MBR FAT32 zonderqdata.vhd using the DiskPart commands shown in the Windows Host profile above:',
          shellLabel: 'PowerShell (Administrator)',
          commands: ['winget install SoftwareFreedomConservancy.QEMU'],
        },
        {
          stepNumber: 2,
          title: 'Boot ZonderqOS in QEMU on Windows 10 / 11',
          description:
            'Run qemu-system-x86_64.exe attaching ZonderqOS.iso and your DiskPart-created zonderqdata.vhd (format=vpc) on the ICH9 AHCI controller:',
          shellLabel: 'PowerShell',
          commands: [
            '& "C:\\Program Files\\QEMU\\qemu-system-x86_64.exe" `',
            '  -M q35 -accel tcg -cpu Nehalem -smp 1 -m 2048M `',
            '  -vga std `',
            '  -drive "file=ZonderqOS.iso,if=none,id=cosmoscd,format=raw,readonly=on" `',
            '  -device ide-cd,drive=cosmoscd,bootindex=0 -boot d `',
            '  -device ich9-ahci,id=ahci0 `',
            '  -drive "file=zonderqdata.vhd,if=none,id=ahcidisk0,format=vpc" `',
            '  -device ide-hd,drive=ahcidisk0,bus=ahci0.0 `',
            '  -device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0 `',
            '  -no-reboot',
          ],
        },
      ],
      macos: [
        {
          stepNumber: 1,
          title: 'Install QEMU on MacBook via Homebrew (Apple Silicon M1–M4 or Intel Mac)',
          description:
            'On any MacBook (Apple Silicon M1/M2/M3/M4 or Intel), install QEMU via Homebrew (or download UTM from mac.getutm.app):',
          shellLabel: 'zsh (macOS Terminal)',
          commands: ['brew install qemu'],
        },
        {
          stepNumber: 2,
          title: 'Create the MBR FAT32 ZONDERQDATA disk image natively on macOS',
          description:
            'Use macOS hdiutil (-layout MBRSPUD) to generate a 2 GB raw image containing an MBR primary FAT32 partition labeled ZONDERQDATA:',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'hdiutil create -size 2g -fs "MS-DOS FAT32" -volname "ZONDERQDATA" -layout MBRSPUD -type UDIF -o zonderqdata.dmg',
            'hdiutil convert zonderqdata.dmg -format UDTO -o zonderqdata.cdr',
            'mv zonderqdata.cdr zonderqdata.img && rm -f zonderqdata.dmg',
          ],
        },
        {
          stepNumber: 3,
          title: 'Boot ZonderqOS in QEMU on MacBook (Apple Silicon TCG or Intel HVF)',
          description:
            'Run qemu-system-x86_64 on macOS. On Apple Silicon (M1/M2/M3/M4), -accel tcg emulates x86_64 cleanly; on Intel MacBooks, you can also use -accel hvf:',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            'qemu-system-x86_64 \\',
            '  -M q35 -accel tcg -cpu Nehalem -smp 1 -m 2048M \\',
            '  -vga std \\',
            '  -drive "file=ZonderqOS.iso,if=none,id=cosmoscd,format=raw,readonly=on" \\',
            '  -device ide-cd,drive=cosmoscd,bootindex=0 -boot d \\',
            '  -device ich9-ahci,id=ahci0 \\',
            '  -drive "file=zonderqdata.img,if=none,id=ahcidisk0,format=raw,cache=directsync" \\',
            '  -device ide-hd,drive=ahcidisk0,bus=ahci0.0 \\',
            '  -device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0 \\',
            '  -serial stdio -no-reboot',
          ],
        },
        {
          stepNumber: 4,
          title: 'Alternative for MacBook GUI Users: Running in UTM.app (Apple Silicon & Intel)',
          description:
            'In UTM on macOS: click "Create a New Virtual Machine" → "Emulate" (do NOT choose Virtualize on Apple Silicon) → "Other" → select ZonderqOS.iso as Boot ISO Image → set Architecture: x86_64, System: Standard PC (Q35 + ICH9, 2009), CPU: Nehalem (1 core), Memory: 2048 MB → under Drives, import your zonderqdata.img on the SATA interface → start the VM and select Entry 3 ("/ZonderqOS Recovery ISO") in Limine.',
        },
      ],
    },
  },
  {
    id: 'physical-usb',
    name: 'Physical Hardware (Bootable USB)',
    shortName: 'Physical USB',
    verificationLevel: 'Physical UEFI Target (USB)',
    officialToolUrl: 'https://github.com/dwierzbicki11/ZOnderqOS',
    officialToolLabel: 'Inspect USB Scripts in Repository',
    summary:
      'Prepare a dedicated removable USB flash drive combining the hybrid Limine boot image (sectors 0–65535, first 32 MiB) with a persistent FAT32 ZONDERQDATA 4th MBR partition starting at sector 65536.',
    controllerRecommendation:
      'Boot via UEFI Boot Menu (Secure Boot disabled) on x86_64 hardware with USB xHCI / PS/2 keyboard and mouse.',
    freshBootLimineNotice:
      'Simply writing ZonderqOS.iso creates the 3 Limine boot partitions (first ~19 MB) but does NOT automatically create the 4th MBR partition (ZONDERQDATA at sector 65536). Follow the host-specific step below to append and format the ZONDERQDATA partition on the remaining USB space!',
    stepsByHost: {
      linux: [
        {
          stepNumber: 1,
          title: 'Verify SHA-256 and identify your removable USB drive on Linux',
          description:
            'Verify ZonderqOS.iso and list block devices. Confirm TRAN="usb" and ensure no host OS partitions (ext4, ntfs, btrfs, or host EFI) exist on the target USB device:',
          shellLabel: 'bash (Linux)',
          commands: [
            'sha256sum ZonderqOS.iso',
            'lsblk -o NAME,SIZE,MODEL,TRAN,FSTYPE,LABEL,MOUNTPOINTS',
          ],
          warning:
            'CRITICAL DATA LOSS WARNING: Flashing with dd overwrites the target drive partition table. Triple-check /dev/sdX and NEVER target your host OS disk!',
        },
        {
          stepNumber: 2,
          title:
            'First-Time USB Setup on Linux: Flash ISO + Append Partition 4 (ZONDERQDATA at LBA 65536)',
          description:
            'Write ZonderqOS.iso to /dev/sdX, append Partition 4 starting at sector 65536 (32 MiB) with MBR type 0x0C, format it as FAT32 labeled ZONDERQDATA, and seed Slot A:',
          shellLabel: 'bash (Linux)',
          commands: [
            '# Replace /dev/sdX with your verified removable USB drive (e.g. /dev/sdb):',
            'sudo dd if=ZonderqOS.iso of=/dev/sdX bs=4M status=progress conv=fsync && sync',
            'TOTAL_SECTORS=$(sudo blockdev --getsz /dev/sdX)',
            'printf "start=65536, size=$((TOTAL_SECTORS - 65536)), type=c\\n" | sudo sfdisk --append --wipe=never --wipe-partitions=never /dev/sdX',
            'sudo partprobe /dev/sdX && sudo udevadm settle',
            'sudo mkfs.vfat -F 32 -n ZONDERQDATA /dev/sdX4',
          ],
        },
        {
          stepNumber: 3,
          title: 'Upgrading an Existing ZonderqOS USB on Linux Without Erasing ZONDERQDATA',
          description:
            'To upgrade the kernel/ISO on an already-prepared USB drive while keeping all user files on /dev/sdX4 (ZONDERQDATA at sector 65536), flash the new ISO and re-append the MBR entry without running mkfs.vfat:',
          shellLabel: 'bash (Linux)',
          commands: [
            'sudo dd if=ZonderqOS.iso of=/dev/sdX bs=4M status=progress conv=fsync && sync',
            'TOTAL_SECTORS=$(sudo blockdev --getsz /dev/sdX)',
            'printf "start=65536, size=$((TOTAL_SECTORS - 65536)), type=c\\n" | sudo sfdisk --append --wipe=never --wipe-partitions=never /dev/sdX',
            'sudo partprobe /dev/sdX && sudo blkid /dev/sdX4',
          ],
        },
      ],
      windows: [
        {
          stepNumber: 1,
          title: 'Verify ZonderqOS.iso SHA-256 and write in Rufus (DD Image Mode)',
          description:
            'Verify the SHA-256 hash in PowerShell. Then open Rufus (https://rufus.ie/), select your removable USB drive, select ZonderqOS.iso, click START, and when prompted choose "Write in DD Image mode".',
          shellLabel: 'PowerShell',
          commands: ['Get-FileHash .\\ZonderqOS.iso -Algorithm SHA256'],
          warning:
            'CRITICAL WARNING: Double-check the drive letter and physical disk number in Rufus and DiskPart. Never select your Windows C: boot drive!',
        },
        {
          stepNumber: 2,
          title: 'Create the 4th MBR Partition (FAT32, label ZONDERQDATA) on Remaining USB Space',
          description:
            'After flashing in DD mode, the first ~19 MB of the USB drive contains the 3 Limine boot partitions, leaving the rest of the USB drive unallocated. Create a primary FAT32 partition labeled ZONDERQDATA on the unallocated space using DiskPart (or Windows Disk Management — diskmgmt.msc):',
          shellLabel: 'PowerShell (Administrator — DiskPart)',
          commands: [
            'diskpart',
            'list disk',
            '# Identify your removable USB disk number N (NEVER select Disk 0 / your Windows OS disk!):',
            'select disk N',
            'create partition primary offset=32768',
            'format fs=fat32 label="ZONDERQDATA" quick',
            'exit',
          ],
        },
        {
          stepNumber: 3,
          title: 'Boot your x86_64 PC from USB in UEFI Mode (Secure Boot Disabled)',
          description:
            'Reboot your target x86_64 computer, open the UEFI Boot Menu (F8 / F11 / F12 / Esc), ensure Secure Boot is disabled, select the USB drive, and choose "/ZonderqOS Recovery ISO" (Entry 3) in Limine on first boot.',
        },
      ],
      macos: [
        {
          stepNumber: 1,
          title: 'Verify SHA-256 and identify your removable USB disk on MacBook',
          description:
            'Insert your removable USB flash drive and run diskutil list to find its device identifier (e.g. /dev/disk4 — external, physical):',
          shellLabel: 'zsh (macOS Terminal)',
          commands: ['shasum -a 256 ZonderqOS.iso', 'diskutil list external physical'],
          warning:
            'CRITICAL WARNING: Verify that /dev/diskN is an "external, physical" USB drive. Never run dd against /dev/disk0 or your internal Apple SSD!',
        },
        {
          stepNumber: 2,
          title: 'Flash ZonderqOS.iso to the USB drive on macOS',
          description:
            'Unmount the target USB disk with diskutil and write the hybrid ISO using /dev/rdiskN (raw device node for fast transfer):',
          shellLabel: 'zsh (macOS Terminal)',
          commands: [
            '# Replace diskN / rdiskN with your verified external USB disk number:',
            'diskutil unmountDisk /dev/diskN',
            'sudo dd if=ZonderqOS.iso of=/dev/rdiskN bs=4m status=progress && sync',
            'diskutil eject /dev/diskN',
          ],
        },
        {
          stepNumber: 3,
          title: 'Add the ZONDERQDATA FAT32 Data Volume & Boot on Target x86_64 Hardware',
          description:
            'For full persistent storage on the target x86_64 PC, append the 4th MBR partition (FAT32 labeled ZONDERQDATA starting at sector 65536) using a Linux VM/container or attach a secondary USB drive formatted as MBR FAT32 with volume name ZONDERQDATA (`diskutil eraseDisk FAT32 ZONDERQDATA MBRFormat /dev/diskM`).',
        },
      ],
    },
  },
];

export const vmTroubleshootingData: TroubleshootingItem[] = [
  {
    id: 'trouble-missing-zonderqdata',
    symptom:
      'Kernel Panic: "No approved ZONDERQDATA volume: refusing normal boot before any filesystem/user writes."',
    cause:
      'ZonderqOS booted without a dedicated MBR (type 0x0C/0x0B) or GPT Basic Data FAT32 partition labeled exactly ZONDERQDATA, or the attached virtual disk is blank/unformatted.',
    solution:
      'Create a partitioned FAT32 disk image labeled ZONDERQDATA using your host OS instructions above (Linux sfdisk + mkfs.vfat, Windows DiskPart VHD, or macOS hdiutil -layout MBRSPUD), convert it to VDI/VMDK if using VirtualBox/VMware, and attach it to an AHCI/SATA controller.',
    commandHint: 'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
  },
  {
    id: 'trouble-limine-slot-a-missing',
    symptom:
      'Limine Bootloader Error: File "/boot/slot_a/ZonderqOS.elf" not found on fslabel(ZONDERQDATA)',
    cause:
      'Limine defaults after 5 seconds to Entry 1 (/ZonderqOS Slot A), which looks for /boot/slot_a/ZonderqOS.elf on the ZONDERQDATA partition. A freshly formatted ZONDERQDATA disk does not contain /boot/slot_a/ZonderqOS.elf yet.',
    solution:
      'At the Limine boot menu, use the arrow keys to select Entry 3 ("/ZonderqOS Recovery ISO"), which loads ZonderqOS.elf directly from the attached ISO CD-ROM while still mounting your ZONDERQDATA disk at /.',
  },
  {
    id: 'trouble-apple-silicon-arm64',
    symptom:
      'MacBook Apple Silicon (M1 / M2 / M3 / M4): VM fails to boot when using "Virtualize" mode',
    cause:
      'Apple Virtualization.framework only virtualizes ARM64 operating systems, whereas the published ZonderqOS Alpha ISO (v1.0.0-alfa) is compiled for x86_64.',
    solution:
      'On Apple Silicon MacBooks, use QEMU x86_64 software emulation (qemu-system-x86_64 -M q35 -accel tcg -cpu Nehalem) or select "Emulate → x86_64" when creating the VM in UTM.app.',
    commandHint: 'qemu-system-x86_64 -M q35 -accel tcg -cpu Nehalem -smp 1 -m 2048M',
  },
  {
    id: 'trouble-black-screen',
    symptom: 'Black screen after Limine menu or distorted window rendering',
    cause:
      '3D graphics acceleration is enabled in the hypervisor, video RAM is below 64–128 MB, or the hypervisor failed to expose a 32-bit linear framebuffer at 1366×768×32.',
    solution:
      'Disable 3D Acceleration in VirtualBox/VMware settings, increase Video Memory to 128 MB, use VMSVGA (VirtualBox) or -vga std (QEMU), and enable EFI firmware.',
    commandHint:
      'VBoxManage modifyvm "ZonderqOS" --accelerate3d off --vram 128 --graphicscontroller vmsvga',
  },
  {
    id: 'trouble-uefi-boot-failure',
    symptom: 'UEFI Boot Failure / Security Violation / Drops to UEFI Interactive Shell',
    cause:
      'UEFI Secure Boot is enabled in the VM or physical laptop BIOS, or the ISO optical drive is not first in the boot order.',
    solution:
      'Disable Secure Boot in your VM firmware settings or physical UEFI setup, verify that the ZonderqOS ISO optical drive (or USB drive) is first in the boot order, or type "FS0:\\EFI\\BOOT\\BOOTX64.EFI" in the UEFI shell.',
  },
  {
    id: 'trouble-unsupported-graphics-mode',
    symptom: 'Unsupported graphics mode or display clipped on low-resolution monitors',
    cause:
      'Limine requests 1366×768×32 (32-bit BGRA linear GOP framebuffer) by default in limine.conf.',
    solution:
      'Ensure your VM window allows at least 1366×768 resolution (or scaled view mode). Once booted into the ZonderqOS desktop, you can inspect or switch supported GOP resolutions up to 3840×2160 in SettingsApp (DisplayModeSelector).',
  },
  {
    id: 'trouble-mouse-keyboard',
    symptom: 'Mouse pointer does not move or keyboard input is unresponsive',
    cause:
      'Incompatible pointing device emulation or physical laptop using an unsupported ELAN1000 I2C touchpad.',
    solution:
      'In QEMU, attach an xHCI controller with a USB mouse (-device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0). In VirtualBox, use USB Tablet (--mouse usbtablet) and PS/2 Keyboard. On physical laptops with I2C touchpads, connect an external USB mouse.',
    commandHint: '-device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0',
  },
  {
    id: 'trouble-missing-persistent-storage',
    symptom: 'Files created on the desktop disappear or disk is rejected despite ZONDERQDATA label',
    cause:
      'The FAT32 filesystem was formatted directly on a raw unpartitioned block device (superfloppy) or on an EFI System Partition (0xEF), or two different disks labeled ZONDERQDATA are attached simultaneously.',
    solution:
      'DataVolumePolicy.cs explicitly rejects raw unpartitioned disks, 0xEF EFI partitions, and ambiguous multi-disk ZONDERQDATA setups. Format a single primary MBR partition (type 0x0C or 0x0B) using Linux sfdisk, Windows DiskPart (convert mbr + create partition primary), or macOS hdiutil (-layout MBRSPUD).',
  },
  {
    id: 'trouble-installer-disk-warning',
    symptom:
      'Disk Erasing Warning & Target Disk Confirmation in ZonderqOS Graphical Installer',
    cause:
      'Before erasing any disk, ZonderqOS Installer displays the disk model, capacity, existing partitions, and a mandatory warning ("WARNING: ALL DATA WILL BE DELETED") requiring you to type the exact device identifier (e.g. DISK-0 or DISK-1). Active installation media and active system disks are strictly locked.',
    solution:
      'Verify that you have selected a dedicated physical or virtual disk (never your primary Linux/Windows SSD unless intended), type the exact DISK-X identifier shown in the dialog, and proceed. All other connected disks remain completely untouched and protected by pre-write LBA 0/1 SHA-256 identity verification.',
  },
  {
    id: 'trouble-installer-no-target-disk',
    symptom:
      'No eligible target disk appears in Screen 3 of ZonderqOS Graphical Installer',
    cause:
      'The virtual or physical disk is attached to an unsupported legacy IDE controller, is smaller than 68 MB, or is marked as active installation media.',
    solution:
      'Attach your target disk to a SATA (AHCI), NVMe, VirtIO Block, or USB Mass Storage controller with at least 8 GB capacity (minimum 68 MB), then press F5 inside the installer to rescan disks. After installation finishes, disconnect the ISO/USB drive so UEFI/BIOS boots directly from the installed disk.',
  },
  {
    id: 'trouble-recovery-mode-boot',
    symptom:
      'System boots into Emergency Recovery / Kernel Panic ("CRITICAL: A/B or payload recovery failed") instead of normal GUI',
    cause:
      'BootSlotManager detected 3 consecutive unconfirmed boot attempts in /boot/boot_state.cfg or a corrupted kernel payload in the active A/B slot.',
    solution:
      'Boot using Limine Entry 3 ("/ZonderqOS Recovery ISO") or mount the ZONDERQDATA partition on your host and reset BOOT_ATTEMPTS=0 and SLOT_A_STATUS=Healthy in /boot/boot_state.cfg while restoring a verified ZonderqOS.elf into /boot/slot_a/ZonderqOS.elf.',
  },
];
