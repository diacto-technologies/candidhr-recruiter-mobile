import { colors } from "../theme/colors";

 export const getStatusLabel = (status:string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "approval_pending":
        return "Approval Pending";
      case "not_approved":
        return "Not Approved";
      default:
        return "Not Approved";
    }
  };

  export  const getStatusColor = (status:string) => {
    switch (status) {
      case "approved":
        return colors.success[500];
      case "approval_pending":
        return colors.warning[500];
      case "not_approved":
        return colors.error[500];
      default:
        return colors.gray[400];
    }
  };