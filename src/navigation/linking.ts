export interface DeepLinkTarget {
  name: 'JobDetailScreen' | 'ApplicantDetails';
  params: Record<string, any>;
}

/**
 * Parses deep link URLs (both custom scheme candidhr:// and https:// web URLs)
 * and extracts the target screen and parameters.
 */
export const parseDeepLinkUrl = (
  url: string | null | undefined
): DeepLinkTarget | null => {
  if (!url) return null;

  try {
    const cleanUrl = url.trim();
    // Normalize custom scheme and http/https domains to obtain the path part
    const pathPart = cleanUrl
      .replace(/^(candidhr:\/\/|https?:\/\/[^/]+)/i, '')
      .replace(/^\/+/, '');

    // Applicant Profile patterns (more specific)
    // Matches:
    // app/user/applicants/<id>/profile, app/user/applicants/<id>,
    // app/user/applicant/<id>/profile, app/user/applicant/<id>,
    // applicants/<id>, applicant/<id>
    const applicantRegex =
      /(?:app\/user\/applicants|app\/user\/applicant|applicants|applicant)\/([^/?#]+)/i;
    const applicantMatch = pathPart.match(applicantRegex);

    if (applicantMatch && applicantMatch[1]) {
      const applicantId = decodeURIComponent(applicantMatch[1]).replace(/\/*$/, '');
      if (applicantId && applicantId !== 'overview' && applicantId !== 'profile') {
        return {
          name: 'ApplicantDetails',
          params: {
            applicantId,
            application_id: applicantId,
            job_id: '',
          },
        };
      }
    }

    // Job Overview patterns
    // Matches:
    // app/user/jobs/job/<id>/overview, app/user/jobs/job/<id>,
    // app/user/jobs/<id>/overview, app/user/jobs/<id>,
    // jobs/job/<id>/overview, jobs/<id>, apply/<id>, apply/<id>/<org>
    const jobRegex =
      /(?:app\/user\/jobs\/job|app\/user\/jobs|jobs\/job|jobs|apply)\/([^/?#]+)/i;
    const jobMatch = pathPart.match(jobRegex);

    if (jobMatch && jobMatch[1]) {
      const rawJobId = decodeURIComponent(jobMatch[1]).replace(/\/*$/, '');
      if (
        rawJobId &&
        rawJobId !== 'overview' &&
        rawJobId !== 'profile' &&
        rawJobId !== 'job'
      ) {
        const orgMatch = pathPart.match(/apply\/[^/?#]+\/([^/?#]+)/i);
        const org = orgMatch
          ? decodeURIComponent(orgMatch[1]).replace(/\/*$/, '')
          : undefined;
        return {
          name: 'JobDetailScreen',
          params: {
            jobId: rawJobId,
            ...(org ? { org } : {}),
          },
        };
      }
    }

    return null;
  } catch {
    return null;
  }
};

const linking = {
  prefixes: [
    'candidhr://',
    'https://*.candidhr.ai',
    'https://app.candidhr.ai',
    'https://*.candidhr.com',
    'https://app.candidhr.com',
  ],

  config: {
    screens: {
      UserBottomTab: {
        screens: {
          Dashboard: 'dashboard',
          JobsScreen: 'jobs',
          ApplicantScreen: 'applicants',
        },
      },

      JobDetailScreen: {
        path: 'app/user/jobs/job/:jobId/overview',
        alias: [
          'app/user/jobs/job/:jobId',
          'app/user/jobs/:jobId/overview',
          'app/user/jobs/:jobId',
          'apply/:jobId',
          'apply/:jobId/:org',
          'jobs/job/:jobId/overview',
          'jobs/:jobId',
        ],
        parse: {
          jobId: (jobId: string) => jobId.replace(/\/*$/, ''),
        },
      },

      ApplicantDetails: {
        path: 'app/user/applicants/:applicantId/profile',
        alias: [
          'app/user/applicants/:applicantId',
          'app/user/applicant/:applicantId/profile',
          'app/user/applicant/:applicantId',
          'applicant/:applicantId/profile',
          'applicant/:applicantId',
          'applicants/:applicantId',
        ],
        parse: {
          applicantId: (applicantId: string) => applicantId.replace(/\/*$/, ''),
        },
      },
    },
  },
};

export default linking;

