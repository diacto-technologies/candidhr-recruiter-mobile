import { ViewStyle } from "react-native";

export interface QuestionType{
    id: number;
    time: string;
    difficulty: "Easy" | "Medium" | "Hard";
    type: "Multiple" | "Text" | "MCQ";
    question: string;
    chips?: {
      id: number;
      label: string;
      isCorrect: boolean;
      isSelected: boolean;
    }[];
    description?: string;
  }
  
 export interface AssessmentCard{
    id: string;
    title: string;
    questions: number;
    correct: number;
    percent: number;
  }
  
export interface Props {
    style?: ViewStyle;
  }