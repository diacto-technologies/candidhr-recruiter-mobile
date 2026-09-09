import { colors } from "../../../theme/colors";

export const getStatusColor = (status?: string) => {
  if (!status) return "";
  const normalized = status.trim().toLowerCase().replace(/_/g, " ");

  switch (normalized) {
    case "applied":
      return colors.gray[400];

    case "in progress":
      return "#EAAA08";

    case "approved":
    case "shortlisted":
    case "hired":
    case "completed":
    case "published":
    case "offer accepted":
    case "offer extended":
      return colors.success[500];

    case "not approved":
    case "rejected":
    case "not selected":
    case "offer rejected":
    case "draft":
      return colors.error[500];

    case "under review":
    case "scheduled final interview":
      return colors.blue[500];

    case "offer final interview":
    case "interview scheduled":
    case "final interview":
      return colors.blue[700];

    case "on hold":
      return colors.orange[500];

    case "approval pending":
      return colors.warning[500];

    case "withdrawn":
      return colors.gray[600];

    case "not started":
    case "started":
    case "assigned":
    case "archived":
      return colors.gray[500];

    default:
      return colors.gray[500];
  }
};
