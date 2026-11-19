import type { NormalizedReleaseAsset } from '@/types/releases';

export interface DetectedPlatformPackages {
  isoAsset: NormalizedReleaseAsset | null;
  virtualBoxAsset: NormalizedReleaseAsset | null;
  vmwareAsset: NormalizedReleaseAsset | null;
}

export function detectVmPackageAssets(
  assets: ReadonlyArray<NormalizedReleaseAsset>,
): DetectedPlatformPackages {
  const isoAsset = assets.find((a) => a.isIso || a.name.toLowerCase().endsWith('.iso')) ?? null;

  const virtualBoxAsset =
    assets.find((a) => {
      const lower = a.name.toLowerCase();
      return (
        lower.includes('virtualbox') ||
        lower.includes('vbox') ||
        lower.endsWith('.vdi') ||
        lower.endsWith('.ova')
      );
    }) ?? null;

  const vmwareAsset =
    assets.find((a) => {
      const lower = a.name.toLowerCase();
      return lower.includes('vmware') || lower.endsWith('.vmdk');
    }) ?? null;

  return {
    isoAsset,
    virtualBoxAsset,
    vmwareAsset,
  };
}
