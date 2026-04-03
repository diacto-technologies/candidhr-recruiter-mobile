const linking = {
  prefixes: ["candidhr://", "https://app.candidhr.ai", "https://googleqa.candidhr.ai"],
  config: {
    screens: {
      Dashboard: "dashboard",
      ApplicantScreen: "applicant/:id",
      JobDetailScreen: {
        path: 'app/candidate/:jobId',
        parse: {
          jobId: (jobId: string) => jobId.replace(/\/$/, ''),
        },
      },
    },
  },
};

export default linking;
