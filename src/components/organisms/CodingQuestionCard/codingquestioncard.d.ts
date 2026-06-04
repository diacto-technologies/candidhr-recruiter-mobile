export interface TestCase {
  input: string;
  output: string;
  expectedOutput?: string;
  passed: boolean;
}

export interface CodingQuestionCardProps {
  index: number;
  title: string;
  language: string;
  code: string;
  testCases: TestCase[];
  pointsObtained?: number;
  totalPoints?: number;
  timeSpentSeconds?: number;
  canEditCode?: boolean;
}
