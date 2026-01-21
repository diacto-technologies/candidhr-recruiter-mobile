import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import CustomTimeline from './timelinecard';
import AssessmentsDetails from './assessmentsdetails';
import Typography from '../../../atoms/typography';
import Dropdown from '../../dropdown';
import StatusDropdown from '../../dropdown/statusDropdown';

import { colors } from '../../../../theme/colors';
import { arrowDown } from '../../../../assets/svg/arrowdown';

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';

import {
  getAssessmentLogsRequestAction,
  getAssessmentReportRequestAction,
} from '../../../../features/applications/actions';

import {
  selectAssessmentDetailedReport,
  selectAssessmentLogs,
  selectAssessmentReport,
  selectSelectedApplication,
} from '../../../../features/applications/selectors';

import { formatMonDDYYYY } from '../../../../utils/dateformatter';
import { getStatusColor } from '../../applicantlist/helper';

interface TimelineItem {
  title: string;
  date?: string;
  status: 'completed' | 'current';
}

const STATUS_OPTIONS = [
  { id: "started", name: "Started" },
  { id: "assigned", name: "Assigned" },
  { id: "under_review", name: "Under Review" },
  { id: "completed", name: "Completed" },
  { id: "on_hold", name: "On Hold" },
  { id: "rejected", name: "Rejected" },
  { id: "shortlisted", name: "Shortlisted" },
  { id: "final_interview", name: "Scheduled Final Interview" },
  { id: "hired", name: "Hired" },
];

const Assessment = () => {
  const [session, setSelectedSession] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const applicant = useAppSelector(selectSelectedApplication);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const assessmentReport = useAppSelector(selectAssessmentReport);

  // useEffect(() => {
  //   if (applicant?.id) {
  //     dispatch(getAssessmentLogsRequestAction(applicant?.id as string));
  //   }
  // }, []);

  useEffect(() => {
    if (session) {
      dispatch(getAssessmentReportRequestAction(session));
    }
  }, [session]);

  //Ensure dropdown shows the currently active session.
  // useEffect(() => {
  //   if (!session && assessmentLogs?.length) {
  //     setSelectedSession(assessmentLogs[assessmentLogs.length - 1]?.id);
  //   }
  // }, [assessmentLogs, session]);

  useEffect(() => {
    if (!session && assessmentLogs?.length) {
      setSelectedSession(assessmentLogs[assessmentLogs.length - 1].id);   // or last item if needed
    }
  }, [assessmentLogs]);

  // Map status_text to STATUS_OPTIONS id format
  const mapStatusTextToId = (statusText: string): string => {
    const statusMap: { [key: string]: string } = {
      'Started': 'started',
      'Assigned': 'assigned',
      'Under Review': 'under_review',
      'Completed': 'completed',
      'On Hold': 'on_hold',
      'Rejected': 'rejected',
      'Shortlisted': 'shortlisted',
      'Scheduled Final Interview': 'final_interview',
      'Hired': 'hired',
    };
    return statusMap[statusText] || '';
  };

  // Get current status id from selected session
  const currentStatusId = useMemo(() => {
    if (session && assessmentLogs?.length) {
      const currentSession = assessmentLogs.find(item => item.id === session);
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [session, assessmentLogs]);

  const timelineSteps = [
    {
      title: 'Invited On',
      date: formatMonDDYYYY(assessmentReport?.timeline?.assigned_at,'DD MMM YYYY HH:mm','IST'),
      completed: !!assessmentReport?.timeline?.assigned_at,
    },
    {
      title: 'Link Opened',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.link_opened_at,
        'DD MMM YYYY HH:mm','IST'
      ),
      completed: !!assessmentReport?.timeline?.link_opened,
    },
    {
      title: 'Started',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.started_at,
        'DD MMM YYYY HH:mm','IST'
      ),
      completed: !!assessmentReport?.timeline?.started,
    },
    {
      title: 'Completed',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.completed_at,
        'DD MMM YYYY HH:mm','IST'
      ),
      completed: !!assessmentReport?.timeline?.completed,
    },
  ];

  const completedSteps = timelineSteps.filter(step => step.completed).length;
  const progress = Math.round(
    (completedSteps / timelineSteps.length) * 100
  );

  const timelineData: TimelineItem[] = timelineSteps.map(step => ({
    title: step.title,
    date: step.date,
    status: step.completed ? 'completed' : 'current',
  }));

  return (
    <View style={styles.container}>
      {/* <StatusDropdown
          label="Status"
          options={STATUS_OPTIONS}
          labelKey="name"
          valueKey="id"
          setValue={currentStatusId}
          onSelect={(item) => {
            // TODO: Add API call to update status here
            // The status will be updated for the current selectedSession
          }}
        /> */}
      {/* <View style={{ zIndex: 1000 }}> */}
      <Dropdown
        label="Session"
        dropdownLabel="Session"
        options={assessmentLogs?.map((item, index) => ({
          id: item.id,
          name: `Assessment`,
          status_text: item?.status_text ?? "—",
          raw: item,
        })) ?? []}
        setValue={session ?? assessmentLogs[0]?.id}
        statusKey="status_text"
        labelKey="name"
        valueKey="id"
        onSelect={item => setSelectedSession(item?.id)}
        onChangeText={() => { }}
      />
      <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(assessmentLogs?.find(item => item.id === session)?.status_text ?? "_") }]} />
            <Typography
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
             Status {assessmentLogs?.find(item => item.id === session)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View>
      {/* </View> */}

      <CustomTimeline progress={progress} data={timelineData} />

      <AssessmentsDetails />
    </View>
  );
};

export default Assessment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },

  shortListedCard: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusDot: {
    height: 8,
    width: 8,
    borderRadius: 30,
    backgroundColor: colors.success[500],
  },
});
