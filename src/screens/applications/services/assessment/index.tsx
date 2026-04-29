import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import StatCard from '../../../../components/molecules/statcard';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Card from '../../../../components/atoms/card';
import Typography from '../../../../components/atoms/typography';
import { goBack, navigate, resetAndNavigate } from '../../../../utils/navigationUtils';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { clearAssessmentTestDetail } from '../../../../features/assessments/slice';
import Header from '../../../../components/organisms/header';
import { assessmentsApi } from '../../../../features/assessments/api';
import type { AssessmentDashboardStats } from '../../../../features/assessments/types';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import Dashboard from '../../dashboard';

const whatsNew = [
  { title: 'Sections with per-section instructions', desc: 'Organize assessments into logical sections with custom instructions' },
  { title: 'Question navigation with master timer', desc: 'Allow candidates to navigate freely while tracking overall time' },
  { title: 'Advanced assignment configuration', desc: 'Set time limits, validity periods, and attempt requirements' },
  { title: 'Section-aware reporting', desc: 'Get detailed insights with section-level analytics and exports' },
];

const AssessmentScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useRNSafeAreaInsets();

  const quickActions = [
    { title: 'Create Assessment', desc: 'Build a reusable assessment template', onPress: () => navigate('BasicInfo')},
    { title: 'Browse Assessments', desc: 'View and manage assessment templates', onPress: () => navigate('AssessmentList')},
    {
      title: 'Create Test',
      desc: 'Send assessments to candidates',
      onPress: () => {
        dispatch(clearAssessmentTestDetail());
        navigate('CreateAssessmentTest', { freshStart: true });
      },
    },
    { title: 'Browse Tests', desc: 'Track and manage assignments', onPress: () => navigate('AssessmentTestList') },
  ];

  const [assessmentStats, setAssessmentStats] =
    useState<AssessmentDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoadingStats(true);
        const res = await assessmentsApi.getDashboardStats();
        if (isMounted) {
          setAssessmentStats(res.assessment_stats);
        }
      } catch {
        // Keep UI usable even if stats fail.
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const statsData = useMemo(() => {
    const placeholder = loadingStats ? '...' : '--';
    const valueOrPlaceholder = (value?: number) =>
      typeof value === 'number' ? String(value) : placeholder;

    return [
      {
        title: 'Total Assessments',
        value: valueOrPlaceholder(assessmentStats?.total_assessments),
      },
      { title: 'Active', value: valueOrPlaceholder(assessmentStats?.active) },
      { title: 'Drafts', value: valueOrPlaceholder(assessmentStats?.drafts) },
      {
        title: 'Library Tests',
        value: valueOrPlaceholder(assessmentStats?.library_tests),
      },
    ];
  }, [assessmentStats, loadingStats]);

  const renderStatItem = ({ item }) => (
    <View style={styles.statCard}>
      <StatCard
        title={item.title}
        value={item.value}
        percentage=""
        subText=""
        tooltipText=""
      />
    </View>
  );

  return (
    <CustomSafeAreaView>
      <Header title="Assessments" backNavigation enableJobSearch onBack={() => resetAndNavigate('UserBottomTab')} />
      <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal:16,flex:1,marginBottom:insets.insetsBottom}} bounces={false}>

        {/* 🔹 Stats (TOP) */}
        <FlatList
          data={statsData}
          renderItem={renderStatItem}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          scrollEnabled={false}   // 👈 important
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ padding: 8 }}
        />

        {/* 🔹 Quick Actions */}
        <Card style={styles.sectionCard}>
          <Typography variant="semiBoldTxtmd">
            ✨ Quick Actions
          </Typography>

          <FlatList
            data={quickActions}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(_, i) => i.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.actionCard} onPress={item?.onPress}>
                <Typography variant="semiBoldTxtsm">
                  {item.title}
                </Typography>
                <Typography variant="regularTxtxs" style={styles.desc}>
                  {item.desc}
                </Typography>
              </TouchableOpacity>
            )}
          />
        </Card>

        {/* 🔹 What's New */}
        <Card style={styles.sectionCard}>
          <Typography variant="semiBoldTxtmd">
            ✔ What's New in V2
          </Typography>

          {whatsNew.map((item, index) => (
            <View key={index} style={styles.infoCard}>
              <Typography variant="semiBoldTxtsm">
                {item.title}
              </Typography>
              <Typography variant="regularTxtxs" style={styles.desc}>
                {item.desc}
              </Typography>
            </View>
          ))}
        </Card>

        {/* 🔹 Reports */}
        <View style={styles.reportCard}>
          <Typography variant="semiBoldTxtsm" style={styles.reportTitle}>
            V1 Assigned Reports
          </Typography>

          <Typography variant="regularTxtxs" style={styles.reportDesc}>
            View assigned assessment records from the legacy system.
          </Typography>

          <TouchableOpacity style={styles.reportBtn} onPress={() => navigate('OldAssessmentList')}>
            <Typography variant="semiBoldTxtxs">
              View V1 Reports
            </Typography>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </CustomSafeAreaView>
  );
};

export default AssessmentScreen;

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    margin:6
  },

  sectionCard: {
    padding: 16,
    marginTop: 10,
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  desc: {
    marginTop: 4,
    color: '#6B7280',
  },

  reportCard: {
    marginTop: 12,
    marginHorizontal: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },

  reportTitle: {
    color: '#92400E',
  },

  reportDesc: {
    marginTop: 4,
    marginBottom: 10,
    color: '#92400E',
  },

  reportBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});