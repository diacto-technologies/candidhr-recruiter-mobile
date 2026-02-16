import { colors } from "../../../theme/colors";

export const formatPercentage = (value: string | number) => {
    const num = Number(value);
    if (isNaN(num)) return "_";
  
    const percentage = (num / 10) * 100;
    return `${Math.round(percentage)}%`;
  };

export const getScoreStatus = (value: string | number) => {
  const score = Number(value);
  if (isNaN(score)) return "Below avg";

  if (score <= 2) return "Poor";
  if (score <= 4) return "Fair";
  if (score <= 6) return "Good";
  return "Excellent";
};

  
  export const formatSkillPercentage = (value: number) =>
    `${Math.round((value / 10) * 100)}%`;

  export const getSkillStatus = (score: number): string => {
    if (isNaN(score)) return "Below avg";
  
    if (score < 40) return "Poor";
    if (score < 70) return "Meduim";
    return "Good";
  };

  export const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return {
          textColor: colors.success[800],
          backgroundColor: colors.success[50],
          borderColor: colors.success[300],
        };
  
      case "good":
        return {
          textColor: colors.success[700],
          backgroundColor: colors.success[50],
          borderColor: colors.success[200],
        };
  
      case "fair":
      case "meduim":
        return {
          textColor: colors.warning[700],
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
        };
  
      case "poor":
      case "below avg.":
        return {
          textColor: colors.error[700],
          backgroundColor: colors.error[50],
          borderColor: colors.error[200],
        };
  
      default:
        return {
          textColor: colors.gray[700],
          backgroundColor: colors.gray[50],
          borderColor: colors.gray[200],
        };
    }
  };
  