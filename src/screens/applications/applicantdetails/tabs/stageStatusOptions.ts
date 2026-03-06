export type StageStatusOption = { id: string; name: string };

export const APPROVAL_STAGE_STATUS_ALL: StageStatusOption[] = [
  { id: 'approved', name: 'Approved' },
  { id: 'not_approved', name: 'Not Approved' },
];

export function getApprovalStageStatusOptions(
  currentStageStatus: string | null | undefined
): StageStatusOption[] {
  const isApprovalPending =
    !currentStageStatus ||
    currentStageStatus === 'approval_pending' ||
    currentStageStatus === 'pending' ||
    currentStageStatus === 'under_review';

  if (isApprovalPending) return APPROVAL_STAGE_STATUS_ALL;
  if (currentStageStatus === 'approved') return [{ id: 'not_approved', name: 'Not Approved' }];
  if (currentStageStatus === 'not_approved') return [{ id: 'approved', name: 'Approved' }];

  return APPROVAL_STAGE_STATUS_ALL;
}
