export interface ChangeStatusModalProps {
  visible: boolean;
  onClose: () => void;
  applicantName?: string;
  entityId?: string | null;
  currentStatus: string | null | undefined;
  newStatusOptions: Array<{ id: string; name: string }>;
  onUpdateStatus: (newStatusId: string, options?: { addReason?: boolean; categoryId?: string; reasonId?: string; emailCandidate?: boolean; subject?: string; message?: string }) => void;
  initialNewStatusId?: string | null;
  stageId?: string | null;
  /** Required with stageId for API flow; used to refetch application and stages on success */
  applicationId?: string | null;
  /** Used by reasons API (e.g. "Resume Screening") */
  contentType?: string | null;
  /** When true, hides the "Add reason" section (e.g. for header application-status flow) */
  hideAddReason?: boolean;
  /** When set, used as the default email message when modal opens (e.g. application-status message with {{application_status}}) */
  initialEmailMessage?: string;
}
