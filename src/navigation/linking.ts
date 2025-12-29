const linking = {
    prefixes: ["candidhr://", "https://app.candidhr.ai"],
    config: {
      screens: {
        Dashboard: "dashboard",
        ApplicantScreen: "applicant/:id",
        JobDetail: "job/:id",
      },
    },
  };
  
  export default linking;
  