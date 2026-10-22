import React, { useMemo } from 'react';
import CustomTimeline from '../../../../../../components/molecules/TimelineCard';
import { TimelineItem } from '../../../../../../components/molecules/TimelineCard/timelinecard.d';
import { AssignmentActivity } from '../../../../../../features/applications/types';
import { formatMonDDYYYY } from '../../../../../../utils/dateformatter';

interface Props {
  activities?: AssignmentActivity[];
}

interface MilestoneDef {
  key: string;
  title: string;
}

const STANDARD_MILESTONES: MilestoneDef[] = [
  { key: 'assigned', title: 'Sent' },
  { key: 'link_opened', title: 'Opened' },
  { key: 'started', title: 'Started' },
  { key: 'submitted', title: 'Submitted' },
  { key: 'reviewed', title: 'Review closed' },
];

export const AssignmentTimelineCard: React.FC<Props> = React.memo(({ activities = [] }) => {
  const { timelineData, progress } = useMemo(() => {
    const activityMap = new Map<string, string>();
    activities.forEach((act) => {
      activityMap.set(act.milestone.toLowerCase(), act.timestamp);
    });

    let completedCount = 0;
    let foundCurrent = false;

    const items: TimelineItem[] = STANDARD_MILESTONES.map((milestone) => {
      const timestamp = activityMap.get(milestone.key);

      if (timestamp) {
        completedCount += 1;
        return {
          title: milestone.title,
          date: formatMonDDYYYY(timestamp, 'DD MMM YYYY HH:mm', 'IST'),
          status: 'completed' as const,
        };
      }

      if (!foundCurrent) {
        foundCurrent = true;
        return {
          title: milestone.title,
          status: 'current' as const,
        };
      }

      return {
        title: milestone.title,
        status: 'upcoming' as const,
      };
    });

    const calculatedProgress = Math.round((completedCount / STANDARD_MILESTONES.length) * 100);

    return {
      timelineData: items,
      progress: calculatedProgress,
    };
  }, [activities]);

  return (
    <CustomTimeline
      title="Assignment Timeline"
      progress={progress}
      data={timelineData}
    />
  );
});
