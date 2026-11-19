export type VmPlatformId = 'virtualbox' | 'vmware' | 'qemu' | 'physical-usb';

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
  steps: InstallStep[];
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
