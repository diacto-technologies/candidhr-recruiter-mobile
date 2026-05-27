import { useNetworkConnectivity } from "../../../../../hooks/useNetworkConnectivity";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { selectStageGraphOverview } from "../../../../../features/dashbaord/selectors";
import { TableRow } from "../application";

export const useApplicationOverviewDetails = () => {
  useNetworkConnectivity();
  const overviewData = useAppSelector(selectStageGraphOverview);
  const data: TableRow[] = overviewData?.results ?? [];

  return { data };
};
