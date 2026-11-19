export type VmPlatformId = 'virtualbox' | 'vmware' | 'qemu' | 'physical-usb';

export type HostOsId = 'linux' | 'windows' | 'macos';

export type LinuxDistroId = 'ubuntu-debian' | 'arch' | 'fedora' | 'opensuse';

export type HypervisorVerificationLevel =
  | 'Verified in Automated CI (Primary Target)'
  | 'Experimental / Community Hypervisor Target'
  | 'Physical UEFI Target (USB)';

export interface VmSpecRow {
  setting: string;
  value: string;
  notes: string;
}

export interface InstallStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  shellLabel?: string;
  warning?: string;
}

export interface PlatformGuide {
  id: VmPlatformId;
  name: string;
  shortName: string;
  verificationLevel: HypervisorVerificationLevel;
  officialToolUrl: string;
  officialToolLabel: string;
  summary: string;
  controllerRecommendation: string;
  freshBootLimineNotice: string;
  stepsByHost: Record<HostOsId, InstallStep[]>;
}

export interface LinuxDistroGuide {
  id: LinuxDistroId;
  name: string;
  shortName: string;
  packageManager: string;
  installPackagesCmd: string;
  vboxInstallCmd: string;
  ovmfFirmwarePath: string;
  notes: string;
}

export interface HostOsProfile {
  id: HostOsId;
  name: string;
  shortName: string;
  subtitle: string;
  badge: string;
  architectureNote: string;
  sha256VerifyCmd: string;
  diskPrepTitle: string;
  diskPrepSummary: string;
  diskPrepCommands: string[];
  shellLabel: string;
}

export interface TroubleshootingItem {
  id: string;
  symptom: string;
  cause: string;
  solution: string;
  commandHint?: string;
}

export interface BootloaderArchitectureNote {
  id: string;
  title: string;
  menuEntry: string;
  kernelPath: string;
  whenToUse: string;
}
