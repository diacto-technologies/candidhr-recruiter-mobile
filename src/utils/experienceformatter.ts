export const formatExperience = (value: string | number | null | undefined): string => {
    const exp = Number(value ?? 0);
  
    if (isNaN(exp)) return "0 Years";
  
    const years = Math.floor(exp);
    const months = Math.round((exp - years) * 12);
  
    const yearLabel = years === 1 ? "Year" : "Years";
    const monthLabel = months === 1 ? "Month" : "Months";
  
    if (years > 0 && months > 0) {
      return `${years} ${yearLabel} ${months} ${monthLabel}`;
    }
  
    if (years > 0) {
      return `${years} ${yearLabel}`;
    }
  
    return `${months} ${monthLabel}`;
  };

  export const formatNoticePeriod = (
    value: string | number | null | undefined
  ): string => {
    const months = Number(value ?? 0);
  
    if (isNaN(months)) return "0 Months";
  
    const label = months === 1 ? "Month" : "Months";
  
    return `${months} ${label}`;
  };