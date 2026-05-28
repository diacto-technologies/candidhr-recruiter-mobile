export interface SkillItem {
  proficiencyEvidence: string;
  proficiencyLevel?: any;
  title: string;
  value?: string;
  matched: boolean;
  tier?: string;
}

export interface Props {
  title: string;
  overall: string;
  data: SkillItem[];
  isloading: boolean;
}
