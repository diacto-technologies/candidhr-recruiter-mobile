export interface TeamMemberOption {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_pic?: string | null;
}

export interface ShareJobModalProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  initialSharedMemberIds?: string[];
}
