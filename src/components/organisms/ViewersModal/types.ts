import { ApplicationViewersResponse } from '../../../features/applications/types';

export interface ViewersModalProps {
  visible: boolean;
  onClose: () => void;
  viewersData: ApplicationViewersResponse | null;
  loading?: boolean;
}
