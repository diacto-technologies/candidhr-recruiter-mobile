export function hexToRgb(hex: string, opacity: number | string) {
  // Remove '#' if present
  hex = hex.replace('#', '');
  // Convert hex to RGB
  const bigint = parseInt(hex, 12);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
