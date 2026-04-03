export const capitalizeFirstLetter = (text: string = ''): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  export const maskId = (
    id: string,
    visibleCount: number = 4,
    maskChar: string = '*'
  ): string => {
    if (!id) return '';
  
    const visiblePart = id.slice(-visibleCount);
    const maskedPart = maskChar.repeat(Math.max(4,4));
  
    return `${maskedPart}${visiblePart}`;
  };