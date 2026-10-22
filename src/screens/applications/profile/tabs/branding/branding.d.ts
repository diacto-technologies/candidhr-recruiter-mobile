export interface ImageFileAsset {
  uri: string;
  name: string;
  type: string;
  size?: number;
  width?: number;
  height?: number;
}

export type LogoCardType = 'logo' | 'secondary_logo' | 'favicon';

export interface LogoUploadCardProps {
  type: LogoCardType;
  title: string;
  specs: string;
  recommendedResolution?: string;
  currentUrl: string | null;
  localFile: ImageFileAsset | null;
  onReplace: () => void;
  onDelete: () => void;
  isAutoBadge?: boolean;
  autoBadgeText?: string;
  disabled?: boolean;
  productName?: string;
  brandColor?: string;
  autoSubText?: string;
  fallbackText?: string;
  compactLogoUrl?: string | null;
  errorMessage?: string | null;
}

export interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}
