export interface SendEmailModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle?: string;
  status?: string;
  initialSubject?: string;
  initialMessage?: string;
}
