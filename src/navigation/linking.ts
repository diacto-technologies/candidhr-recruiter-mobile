const linking = {
  prefixes: ['candidhr://'],

  config: {
    screens: {
      Dashboard: 'dashboard',

      // Job Overview deep link — fired by the interstitial "Open in App" button
      // candidhr://app/user/jobs/job/<jobId>/overview
      JobDetailScreen: {
        path: 'app/user/jobs/job/:jobId/overview',
        parse: {
          jobId: (jobId: string) => jobId.replace(/\/*$/, ''),
        },
      },

      // Applicant Profile deep link — fired by the interstitial "Open in App" button
      // candidhr://app/user/applicants/<applicantId>/profile
      ApplicantDetails: {
        path: 'app/user/applicants/:applicantId/profile',
        parse: {
          applicantId: (applicantId: string) => applicantId.replace(/\/*$/, ''),
        },
      },
    },
  },
};

export default linking;
