import { colors } from "../../../theme/colors";

export const getStatusColor = (status?: string) => {
  switch (status) {
    case "Applied":
      return colors.gray[500];

    case "In Progress":
      return colors.blue[500];

    case "Rejected":
      return colors.error[500];

    case "On Hold":
      return colors.orange[500];

    case "Shortlisted":
      return colors.success[500];

    case "Hired":
      return colors.brand[500];

    case "Scheduled Final Interview":
      return colors.blue[500];

    case "Started":
      return colors.gray[500];

    case "Assigned":
      return colors.gray[500];

    case "Under Review":
      return colors.blue[500];

    case "Completed":
      return colors.success[500];

    case "Published":
      return colors.success[500];

    case "Not Published":
      return colors.error[500]

    case "Archived":
      return colors.gray[500]

    case "Not Selected":
      return colors.error[500]

    case "Offer Rejected":
      return colors.error[500]

    case "Offer Accepted":
      return colors.success[500]

    case "Offer Final Interview":
      return colors.blue[700]

    default:
      return "";
  }
};
