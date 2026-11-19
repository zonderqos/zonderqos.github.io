import type {
  BootloaderArchitectureNote,
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
    notes: 'Select "Other" → "Other/Unknown (64-bit)" in VirtualBox or VMware',
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
    value: '2–4 GB (minimum 256 MB)',
    notes:
      'Must contain an MBR (type 0x0C/0x0B) or GPT Basic Data partition (never raw/unpartitioned)',
  },
  {
    setting: 'Data Partition',
    value: 'FAT32, label ZONDERQDATA',
    notes: 'Fail-closed DataVolumePolicy mounts ONLY a unique FAT32 volume labeled ZONDERQDATA',
  },
  {
    setting: 'Boot Media',
    value: 'ZonderqOS ISO',
    notes: 'Attached as an IDE/SATA Optical CD/DVD drive set first in boot order',
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
    title: 'Entry 3 (Fresh VM / Direct ISO Kernel)',
    menuEntry: '/ZonderqOS Recovery ISO',
    kernelPath: 'boot():/boot/ZonderqOS.elf',
    whenToUse:
      'Loads ZonderqOS.elf directly from the attached ISO CD-ROM while still mounting your attached ZONDERQDATA FAT32 disk at / for the full graphical desktop. Select this entry on a fresh VM if you attached a blank ZONDERQDATA disk without seeding /boot/slot_a/ZonderqOS.elf!',
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
      'Run ZonderqOS in Oracle VirtualBox using EFI firmware, 1 vCPU, 2048 MB RAM, and a pre-formatted FAT32 VDI disk labeled ZONDERQDATA attached to the SATA (AHCI) controller.',
    controllerRecommendation:
      'Attach the ZonderqOS ISO to an Optical Drive and the converted zonderqdata.vdi disk to the SATA (IntelAHCI) controller. Do not use an empty unformatted VDI created inside the VirtualBox wizard — ZonderqOS does not auto-format blank disks.',
    freshBootLimineNotice:
      'When booting with a blank formatted ZONDERQDATA VDI (where /boot/slot_a/ZonderqOS.elf has not been copied onto the VDI yet), press Down Arrow in the Limine boot menu and select "/ZonderqOS Recovery ISO" (Entry 3) so Limine loads the kernel from the ISO and mounts your ZONDERQDATA VDI as /.',
    steps: [
      {
        stepNumber: 1,
        title: 'Download the official ZonderqOS ISO & install Oracle VirtualBox',
        description:
          'Download ZonderqOS.iso from the Downloads section above and verify its SHA-256 checksum. Ensure Oracle VirtualBox (7.0+) and host tools (sfdisk, dosfstools / mkfs.vfat) are installed.',
      },
      {
        stepNumber: 2,
        title: 'Prepare a partitioned FAT32 ZONDERQDATA image and convert it to VDI',
        description:
          'Creating an empty VDI in VirtualBox is NOT sufficient because ZonderqOS enforces a fail-closed storage policy and never auto-formats unknown disks. Create a 2 GiB raw image with an MBR type 0x0C FAT32 partition labeled ZONDERQDATA, then convert it to VDI using VBoxManage:',
        commands: [
          'truncate -s 2G zonderqdata.img',
          "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
          'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
          'VBoxManage convertfromraw zonderqdata.img zonderqdata.vdi --format VDI',
        ],
        warning:
          'The volume label must be exactly ZONDERQDATA (11 uppercase characters) and the MBR partition type must be 0x0C (FAT32 LBA) or 0x0B.',
      },
      {
        stepNumber: 3,
        title: 'Create a 64-bit Virtual Machine with 1 vCPU and 2048 MB RAM',
        description:
          'Create a new VM named "ZonderqOS" with Type: Other and Version: Other/Unknown (64-bit). Allocate 2048 MB RAM and 1 virtual CPU:',
        commands: [
          'VBoxManage createvm --name "ZonderqOS" --ostype "Other_64" --register',
          'VBoxManage modifyvm "ZonderqOS" --memory 2048 --cpus 1 --vram 128 --graphicscontroller vmsvga',
        ],
      },
      {
        stepNumber: 4,
        title: 'Enable EFI Firmware and disable 3D Acceleration',
        description:
          'Enable UEFI (without Secure Boot) so Limine initializes the 32-bit UEFI GOP framebuffer, and keep 3D acceleration disabled:',
        commands: [
          'VBoxManage modifyvm "ZonderqOS" --firmware efi --accelerate3d off --mouse usbtablet --keyboard ps2',
        ],
      },
      {
        stepNumber: 5,
        title: 'Attach the ZonderqOS ISO and the ZONDERQDATA VDI to a SATA Controller',
        description:
          'Add an Intel AHCI SATA controller, attach zonderqdata.vdi on port 0, and attach ZonderqOS.iso as an optical drive on port 1:',
        commands: [
          'VBoxManage storagectl "ZonderqOS" --name "SATA Controller" --add sata --controller IntelAHCI',
          'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium zonderqdata.vdi',
          'VBoxManage storageattach "ZonderqOS" --storagectl "SATA Controller" --port 1 --device 0 --type dvddrive --medium ZonderqOS.iso',
        ],
      },
      {
        stepNumber: 6,
        title: 'Boot ZonderqOS and verify GUI startup & persistent storage',
        description:
          'Start the VM. In the Limine boot screen, select "/ZonderqOS Recovery ISO" (Entry 3) if /boot/slot_a/ZonderqOS.elf is not seeded on the VDI yet. Once the desktop loads, open Terminal or FileManagerApp to confirm that / is mounted read-write on ZONDERQDATA.',
      },
    ],
  },
  {
    id: 'vmware',
    name: 'VMware Workstation',
    shortName: 'VMware',
    verificationLevel: 'Experimental / Community Hypervisor Target',
    officialToolUrl: 'https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion',
    officialToolLabel: 'VMware Workstation / Fusion',
    summary:
      'Configure a custom Other 64-bit virtual machine in VMware Workstation with UEFI firmware (Secure Boot disabled), 3D acceleration disabled, and a pre-formatted ZONDERQDATA VMDK disk.',
    controllerRecommendation:
      'Use a SATA (AHCI) or IDE controller for both the CD/DVD ISO drive and the converted zonderqdata.vmdk virtual disk. Avoid paravirtualized PVSCSI or NVMe controllers if the guest kernel reports no approved ZONDERQDATA volume.',
    freshBootLimineNotice:
      'On first boot with a newly formatted VMDK disk, choose "/ZonderqOS Recovery ISO" (Entry 3) in the Limine menu so the kernel loads from the ISO while mounting your ZONDERQDATA VMDK as /.',
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare the ZONDERQDATA raw disk image and convert it to VMDK',
        description:
          'Using Linux tools (truncate, sfdisk, mkfs.vfat, and qemu-img), create a 2 GiB MBR-partitioned FAT32 image labeled ZONDERQDATA and convert it into a VMware VMDK file:',
        commands: [
          'truncate -s 2G zonderqdata.img',
          "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
          'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
          'qemu-img convert -f raw -O vmdk zonderqdata.img zonderqdata.vmdk',
        ],
      },
      {
        stepNumber: 2,
        title: 'Create a Custom Virtual Machine (Other 64-bit)',
        description:
          'In VMware Workstation, choose "Create a New Virtual Machine" → "Custom (advanced)". Select Guest Operating System: "Other" and Version: "Other 64-bit".',
      },
      {
        stepNumber: 3,
        title: 'Configure UEFI Firmware without Secure Boot',
        description:
          'Open VM Settings → Options → Advanced → Firmware type, select "UEFI", and ensure the "Enable Secure Boot" checkbox is UNCHECKED.',
      },
      {
        stepNumber: 4,
        title: 'Allocate Hardware Resources & disable 3D Graphics Acceleration',
        description:
          'Set Processors to 1 core, Memory to 2048 MB, and under Display uncheck "Accelerate 3D graphics" (allocate 128 MB graphics memory if prompted).',
      },
      {
        stepNumber: 5,
        title: 'Attach ZonderqOS.iso and the Existing zonderqdata.vmdk Disk',
        description:
          'Set the CD/DVD (SATA/IDE) drive to use your downloaded ZonderqOS.iso file ("Connect at power on" enabled). When adding the Hard Disk, choose "Use an existing virtual disk" and select your converted zonderqdata.vmdk attached to a SATA (AHCI) or IDE controller.',
      },
      {
        stepNumber: 6,
        title: 'Power on the VM and select the appropriate Limine boot entry',
        description:
          'Start the virtual machine. At the Limine boot menu, select "/ZonderqOS Recovery ISO" (Entry 3) to boot the kernel from the ISO with persistent ZONDERQDATA storage mounted at /.',
      },
    ],
  },
  {
    id: 'qemu',
    name: 'QEMU / KVM on Linux',
    shortName: 'QEMU / KVM',
    verificationLevel: 'Verified in Automated CI (Primary Target)',
    officialToolUrl: 'https://www.qemu.org/download/',
    officialToolLabel: 'QEMU Official Documentation',
    summary:
      'QEMU x86_64 (q35 + ICH9 AHCI + qemu-xhci USB mouse) is the primary reference environment verified across 85 automated Python QMP suites and 105 consecutive GUI application cycles.',
    controllerRecommendation:
      'Matches tools/run-gui-qemu-3095.sh in the ZonderqOS repository: -M q35 -cpu Nehalem -smp 1 -m 2048M -vga std with an ich9-ahci SATA controller for zonderqdata.img and qemu-xhci for USB pointer input.',
    freshBootLimineNotice:
      'If zonderqdata.img was just created with mkfs.vfat and does not yet have /boot/slot_a/ZonderqOS.elf copied inside it, select "/ZonderqOS Recovery ISO" (Entry 3) at the Limine prompt — or run the optional Python pyfatfs / loop-mount seeding snippet below so Entry 1 boots automatically.',
    steps: [
      {
        stepNumber: 1,
        title: 'Install QEMU x86_64 and disk formatting utilities on Linux',
        description:
          'Ensure qemu-system-x86_64, sfdisk (fdisk), and mkfs.vfat (dosfstools) are installed on your Linux distribution:',
        commands: ['sudo apt update && sudo apt install -y qemu-system-x86 fdisk dosfstools'],
      },
      {
        stepNumber: 2,
        title: 'Create and format the persistent ZONDERQDATA disk image',
        description:
          'Reusing the exact verified procedure from tools/run-gui-qemu-3095.sh, create a regular-file disk image (256 MiB or 2 GiB) with an MBR type 0x0C partition starting at sector 2048 and format it as FAT32 labeled ZONDERQDATA:',
        commands: [
          'truncate -s 2G zonderqdata.img',
          "printf 'label: dos\\nunit: sectors\\nstart=2048, type=c\\n' | sfdisk zonderqdata.img",
          'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
        ],
      },
      {
        stepNumber: 3,
        title: 'Boot ZonderqOS ISO with ICH9 AHCI Data Disk and xHCI USB Mouse',
        description:
          'Launch QEMU using the repository-tested q35 + ICH9 AHCI + qemu-xhci configuration (replace -accel tcg with -accel kvm if you want hardware virtualization on an x86_64 Linux host):',
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
        title: 'Optional: Boot with OVMF UEFI Firmware',
        description:
          'The hybrid ZonderqOS ISO boots in both QEMU default BIOS/Limine mode and OVMF UEFI GOP mode. To explicitly test pure 64-bit UEFI GOP boot in QEMU, install ovmf and add -bios /usr/share/ovmf/OVMF.fd:',
        commands: [
          'sudo apt install -y ovmf',
          'qemu-system-x86_64 -M q35 -cpu Nehalem -smp 1 -m 2048M -bios /usr/share/ovmf/OVMF.fd \\',
          '  -vga std -cdrom ZonderqOS.iso -boot d \\',
          '  -device ich9-ahci,id=ahci0 \\',
          '  -drive "file=zonderqdata.img,if=none,id=ahcidisk0,format=raw,cache=directsync" \\',
          '  -device ide-hd,drive=ahcidisk0,bus=ahci0.0 \\',
          '  -device qemu-xhci,id=xhci -device usb-mouse,bus=xhci.0 -serial stdio',
        ],
      },
    ],
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
      'Boot via UEFI Boot Menu (Secure Boot disabled) on x86_64 hardware with USB xHCI / PS/2 keyboard and mouse. Note: physical ASUS X540LA bare-metal testing is undergoing re-verification on Cosmos 3.0.97 during Beta.',
    freshBootLimineNotice:
      'Simply writing ZonderqOS.iso with dd/Rufus/Etcher creates the 3 Limine boot partitions (first ~19 MB) but does NOT automatically create the 4th MBR partition (ZONDERQDATA at sector 65536). Follow Step 3 below to append and format the ZONDERQDATA partition on the remaining USB space!',
    steps: [
      {
        stepNumber: 1,
        title: 'Download ZonderqOS.iso and verify its SHA-256 checksum',
        description:
          'Download the official ZonderqOS.iso from the Downloads section above and verify its integrity before writing to physical media:',
        commands: [
          'sha256sum ZonderqOS.iso',
          '# Expected for v1.0.0-alfa: 4507333c4083caf26dd869b8275390ce3c72d3c70cc4838ad1350ef1c36e9fc8',
        ],
      },
      {
        stepNumber: 2,
        title: 'Identify your removable USB drive carefully (NEVER target your host OS disk!)',
        description:
          'Insert a dedicated removable USB flash drive (at least 4 GB) and list block devices. Confirm that TRAN is "usb" and that no host OS partitions (ext4, ntfs, btrfs, or host EFI System Partition) reside on the target device:',
        commands: ['lsblk -o NAME,SIZE,MODEL,TRAN,FSTYPE,LABEL,MOUNTPOINTS'],
        warning:
          'CRITICAL DATA LOSS WARNING: Flashing an ISO with dd overwrites the partition table and boot sectors of the target drive. Triple-check your /dev/sdX device name and never format or overwrite your host operating system disk!',
      },
      {
        stepNumber: 3,
        title:
          'First-Time USB Installation: Flash ISO + Append Partition 4 (ZONDERQDATA at LBA 65536)',
        description:
          'The ZonderqOS hybrid ISO uses an MBR with 3 boot partitions ending before sector 65536 (32 MiB). After writing the ISO to /dev/sdX, append Partition 4 starting at sector 65536 (type 0x0C) and format it as FAT32 with label ZONDERQDATA (aligned with tools/prepare-zonderq-usb.sh):',
        commands: [
          '# Replace /dev/sdX with your verified removable USB disk (e.g. /dev/sdb — NOT /dev/sda!)',
          'sudo dd if=ZonderqOS.iso of=/dev/sdX bs=4M status=progress conv=fsync && sync',
          'TOTAL_SECTORS=$(sudo blockdev --getsz /dev/sdX)',
          'printf "start=65536, size=$((TOTAL_SECTORS - 65536)), type=c\\n" | sudo sfdisk --append --wipe=never --wipe-partitions=never /dev/sdX',
          'sudo partprobe /dev/sdX && sudo udevadm settle',
          'sudo mkfs.vfat -F 32 -n ZONDERQDATA /dev/sdX4',
        ],
      },
      {
        stepNumber: 4,
        title: 'Seed Slot A on ZONDERQDATA for Limine Dual-Slot A/B Boot',
        description:
          'To allow Limine Entry 1 (/ZonderqOS Slot A) to boot directly from ZONDERQDATA (and enable A/B rollback via Slot B), copy /boot/ZonderqOS.elf from the ISO partition into /boot/slot_a/ZonderqOS.elf on /dev/sdX4 (or select Entry 3 "/ZonderqOS Recovery ISO" in the Limine boot menu):',
        commands: [
          'sudo mkdir -p /mnt/zonderq_iso /mnt/zonderq_data',
          'sudo mount -o ro ZonderqOS.iso /mnt/zonderq_iso',
          'sudo mount -t vfat /dev/sdX4 /mnt/zonderq_data',
          'sudo mkdir -p /mnt/zonderq_data/boot/slot_a /mnt/zonderq_data/boot/slot_b /mnt/zonderq_data/var/log',
          'sudo cp -f /mnt/zonderq_iso/boot/ZonderqOS.elf /mnt/zonderq_data/boot/slot_a/ZonderqOS.elf',
          'sudo cp -f /mnt/zonderq_iso/boot/ZonderqOS.elf /mnt/zonderq_data/boot/ZonderqOS.elf',
          'sync && sudo umount /mnt/zonderq_iso /mnt/zonderq_data',
        ],
      },
      {
        stepNumber: 5,
        title: 'Upgrading an Existing ZonderqOS USB Without Erasing ZONDERQDATA',
        description:
          'When upgrading an already-prepared ZonderqOS USB drive (where /dev/sdX4 is FAT32 ZONDERQDATA starting at sector 65536), flashing a new ISO (< 32 MiB) overwrites sectors 0–65535 and the MBR table without touching your data at sector 65536+. Re-append the MBR entry with --wipe=never (or use ./zonderq-wgraj-iso.sh from the repository) without running mkfs.vfat:',
        commands: [
          '# Upgrade boot area while preserving existing /dev/sdX4 ZONDERQDATA files:',
          'sudo dd if=ZonderqOS.iso of=/dev/sdX bs=4M status=progress conv=fsync && sync',
          'TOTAL_SECTORS=$(sudo blockdev --getsz /dev/sdX)',
          'printf "start=65536, size=$((TOTAL_SECTORS - 65536)), type=c\\n" | sudo sfdisk --append --wipe=never --wipe-partitions=never /dev/sdX',
          'sudo partprobe /dev/sdX && sudo blkid /dev/sdX4',
        ],
      },
    ],
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
      'Create a partitioned FAT32 disk image labeled ZONDERQDATA using sfdisk (start=2048, type=c) and mkfs.vfat -F 32 -n ZONDERQDATA, convert it to VDI/VMDK if using VirtualBox/VMware, and attach it to an AHCI/SATA controller.',
    commandHint: 'mkfs.vfat -I -F 32 -n ZONDERQDATA -h 2048 --offset 2048 zonderqdata.img',
  },
  {
    id: 'trouble-limine-slot-a-missing',
    symptom:
      'Limine Bootloader Error: File "/boot/slot_a/ZonderqOS.elf" not found on fslabel(ZONDERQDATA)',
    cause:
      'Limine defaults after 5 seconds to Entry 1 (/ZonderqOS Slot A), which looks for /boot/slot_a/ZonderqOS.elf on the ZONDERQDATA partition. A freshly formatted ZONDERQDATA disk does not contain /boot/slot_a/ZonderqOS.elf yet.',
    solution:
      'At the Limine boot menu, use the arrow keys to select Entry 3 ("/ZonderqOS Recovery ISO"), which loads ZonderqOS.elf directly from the attached ISO CD-ROM while still mounting your ZONDERQDATA disk at /. Alternatively, copy /boot/ZonderqOS.elf from the ISO to /boot/slot_a/ZonderqOS.elf on ZONDERQDATA.',
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
      'DataVolumePolicy.cs explicitly rejects raw unpartitioned disks, 0xEF EFI partitions, and ambiguous multi-disk ZONDERQDATA setups. Format a single primary MBR partition (type 0x0C or 0x0B) starting at sector 2048 (or 65536 on hybrid USB).',
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
