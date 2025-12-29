import { colors } from "../../../theme/colors";

export const getStatusColor = (status?: string) => {
  switch (status) {
    case "Applied":
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

    case "Completed":
      return colors.success[500];


    default:
      return "";
  }
};
