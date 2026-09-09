import { TypographyProps } from "../typography/typography.d";

export interface AvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  fontVariant?: TypographyProps['variant'];
}
