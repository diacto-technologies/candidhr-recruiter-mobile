export interface TeamMemberOption {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_pic?: string | null;
}

export interface ShareApplicationModalProps {
  visible: boolean;
  onClose: () => void;
  /** Optional: pre-filled shared member ids (e.g. from application.users_shared_with) */
  initialSharedMemberIds?: string[];
  /** Application id used by share API: /applications/v1/{id}/share/ */
  applicationId: string;
  /** Called when user closes after potentially changing shared list (optional, for future API) */
  onSharedMembersChange?: (memberIds: string[]) => void;
}
