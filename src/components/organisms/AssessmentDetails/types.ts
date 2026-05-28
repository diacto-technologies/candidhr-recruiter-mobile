export type StrengthWeaknessItem = {
  section: string;
  percentage: number;
  score: string;
};

export type DifficultyPerformanceItem = {
  difficulty: "easy" | "medium" | "hard" | (string & {});
  correct: number;
  total: number;
  percentage: number;
};

export type StrengthsWeaknesses = {
  strengths: StrengthWeaknessItem[];
  weaknesses: StrengthWeaknessItem[];
  difficulty_performance: DifficultyPerformanceItem[];
  overall_assessment: string;
};

