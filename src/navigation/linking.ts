const linking = {
  prefixes: ['candidhr://'],

  config: {
    screens: {
      Dashboard: 'dashboard',
      ApplicantDetails: 'applicant/:id',

      JobDetailScreen: {
        path: 'apply/:jobId/:org',
        parse: {
          jobId: (jobId: string) => jobId.replace(/\/$/, ''),
          org: (org: string) => org,
        },
      },
    },
  },
};

export default linking;
