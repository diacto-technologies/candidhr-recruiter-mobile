import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import CustomTimeline from './timelinecard';
import AssessmentsDetails from './assessmentsdetails';
import Typography from '../../../atoms/typography';
import Dropdown from '../../dropdown';

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

const options = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Mango' },
];


const Assessment = () => {
  const [session, setSelectedSession] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const applicant = useAppSelector(selectSelectedApplication);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const assessmentReport = useAppSelector(selectAssessmentReport);

  useEffect(() => {
    if (applicant?.id) {
      dispatch(getAssessmentLogsRequestAction(applicant?.id as string));
    }
  }, []);

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

  const timelineSteps = [
    {
      title: 'Invited On',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.assigned_at,
        'DD MMM YYYY HH:mm'
      ),
      completed: true,
    },
    {
      title: 'Link Opened',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.link_opened_at,
        'DD MMM YYYY HH:mm'
      ),
      completed: !!assessmentReport?.timeline?.link_opened,
    },
    {
      title: 'Started',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.started_at,
        'DD MMM YYYY HH:mm'
      ),
      completed: !!assessmentReport?.timeline?.started,
    },
    {
      title: 'Completed',
      date: formatMonDDYYYY(
        assessmentReport?.timeline?.completed_at,
        'DD MMM YYYY HH:mm'
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
      <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(assessmentLogs?.find(item => item.id === session)?.status_text ?? "_") }]} />
            <Typography
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
              {assessmentLogs?.find(item => item.id === session)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View>

      {/* ================= Session Card ================= */}
      {/* <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <Typography variant="mediumTxtmd" color={colors.gray[900]}>
            Session: Assessment {assessmentLogs?.[1]?.assessments_count ?? '0'}
          </Typography>
        </View>
      </View> */}
      <View style={{ zIndex: 1000 }}>
        <Dropdown
          label="Session"
          dropdownLabel="Session"
          options={assessmentLogs?.map((item) => ({
            id: item.id,
            name: `${item.status_text} (Assessment ${item.assessments_count})`,
            assessments_count: item.assessments_count,
          })) ?? []}
          setValue={session ?? assessmentLogs[0]?.id}
          labelKey="name"
          valueKey="id"
          onSelect={item => setSelectedSession(item?.id)}
          onChangeText={() => { }}
        />
      </View>

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
