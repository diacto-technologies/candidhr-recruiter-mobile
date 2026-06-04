export interface ResumeModalProps {
  visible: boolean;
  resumeUrl: string | null;
  onClose: () => void;
  candidateName?: string;
}
