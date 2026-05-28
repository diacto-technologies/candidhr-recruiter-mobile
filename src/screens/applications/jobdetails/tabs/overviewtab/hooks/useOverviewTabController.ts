import { useMemo } from 'react';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';
import { selectJobsLoading, selectSelectedJob } from '../../../../../../features/jobs/selectors';
import { extractSections } from '../../../../../../utils/extractSections';

export const useOverviewTabController = () => {
  const selectedJob = useAppSelector(selectSelectedJob);
  const loading = useAppSelector(selectJobsLoading);

  const extracted = useMemo(() => {
    return extractSections(selectedJob?.jd_html ?? "");
  }, [selectedJob?.jd_html]);

  return {
    selectedJob,
    loading,
    extracted,
  };
};
