import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../../../../components/atoms/card';
import { Shimmer } from '../../../../components/atoms';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Divider from '../../../../components/atoms/divider';
import Typography from '../../../../components/atoms/typography';
import Header from '../../../../components/organisms/header';
import { colors } from '../../../../theme/colors';
import { goBack, navigate } from '../../../../utils/navigationUtils';
import { getStatusColor } from '../../../../components/organisms/applicantlist/helper';
import { useRoute } from '@react-navigation/native';
import TagList from '../../../../components/molecules/taglist';
import StatCard from '../../../../components/molecules/statcard';
import CandidateAssignmentsTable from '../../../../components/organisms/candidateassignmentstable ';
import { Button } from '../../../../components';
import { fetchAssessmentOverviewRequestAction } from '../../../../features/assessments/actions';
import type { AssessmentBlueprintDetail, ProctoringConfiguration } from '../../../../features/assessments/types';
import {
    selectAssessmentOverviewAssignments,
    selectAssessmentOverviewBlueprint,
    selectAssessmentOverviewBlueprintAssignmentStats,
    selectAssessmentOverviewDashboardStats,
    selectAssessmentOverviewError,
    selectAssessmentOverviewLoading,
} from '../../../../features/assessments/selectors';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { mapBlueprintAssignmentsToTableRows } from './blueprintAssignmentsMapper';

type AssessmentOverviewParams = {
    blueprintId?: string;
};

const formatDate = (value?: string): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

function buildProctoringTags(cfg: ProctoringConfiguration | null | undefined): string[] {
    if (!cfg) return [];
    const tags: string[] = [];
    if (cfg.full_screen_mode) tags.push('Fullscreen required');
    if (cfg.track_tab_switches) tags.push('Tab switching');
    if (cfg.disable_copy_paste) tags.push('Disable copy/paste');
    if (cfg.disable_right_click) tags.push('Disable right click');
    if (cfg.webcam_monitoring) tags.push('Webcam monitoring');
    if (cfg.eye_gaze_monitoring) tags.push('Eyegaze monitoring');
    if (cfg.enforce_single_screen) tags.push('Single screen only');
    if (cfg.auto_submit_on_violation) tags.push('Auto-submit on violation');
    if (typeof cfg.max_tab_switches === 'number') tags.push(`Max tab switches: ${cfg.max_tab_switches}`);
    if (typeof cfg.max_fullscreen_exits === 'number')
        tags.push(`Max fullscreen exits: ${cfg.max_fullscreen_exits}`);
    return tags;
}

function normalizeSkillTags(skills: AssessmentBlueprintDetail['skills']): string[] {
    if (!Array.isArray(skills)) return [];
    return skills
        .map(s => (typeof s === 'string' ? s : (s as { name?: string })?.name))
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
}

const AssessmentOverviewShimmer = () => (
    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
    >
        <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10, gap: 8 }}>
                <Shimmer width="85%" height={22} borderRadius={6} />
                <Shimmer width="60%" height={16} borderRadius={6} />
            </View>
            <Shimmer width={132} height={40} borderRadius={10} />
        </View>

        <View style={{ marginTop: 14, gap: 10 }}>
            {[1, 2, 3, 4].map(i => (
                <View key={i} style={styles.metaRow}>
                    <Shimmer width={72} height={14} borderRadius={4} />
                    <Shimmer width={48} height={14} borderRadius={4} style={styles.metaValue} />
                </View>
            ))}
            <View style={{ alignItems: 'flex-end' }}>
                <Shimmer width={100} height={28} borderRadius={8} />
            </View>
        </View>

        <Divider />

        <Card style={styles.sectionCard}>
            <View style={{ gap: 8 }}>
                <Shimmer width="55%" height={20} borderRadius={6} />
                <Shimmer width="90%" height={14} borderRadius={6} />
            </View>
            <View style={styles.subTitle}>
                <Shimmer width={120} height={16} borderRadius={6} />
                <View style={styles.snapshotRow}>
                    <Shimmer height={72} borderRadius={8} style={{ flex: 1 }} />
                    <Shimmer height={72} borderRadius={8} style={{ flex: 1 }} />
                </View>
            </View>
            <Divider />
            <View style={styles.subTitle}>
                <Shimmer width={88} height={16} borderRadius={6} />
                <View style={styles.questionCard}>
                    <Shimmer width="70%" height={16} borderRadius={6} />
                    <Shimmer width="95%" height={14} borderRadius={6} style={{ marginTop: 10 }} />
                </View>
            </View>
            <Divider />
            <View style={styles.subTitle}>
                <Shimmer width={100} height={16} borderRadius={6} />
                <Shimmer width={140} height={32} borderRadius={8} />
            </View>
            <Divider />
            <View style={styles.subTitle}>
                <Shimmer width={90} height={16} borderRadius={6} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <Shimmer width={100} height={28} borderRadius={8} />
                    <Shimmer width={88} height={28} borderRadius={8} />
                    <Shimmer width={120} height={28} borderRadius={8} />
                </View>
            </View>
            <Divider />
        </Card>

        <View style={styles.shimmerStatsWrap}>
            <View style={styles.shimmerStatsRow}>
                <View style={styles.shimmerStatCell}>
                    <Shimmer width={48} height={24} borderRadius={6} />
                    <Shimmer width="80%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
                </View>
                <View style={styles.shimmerStatCell}>
                    <Shimmer width={48} height={24} borderRadius={6} />
                    <Shimmer width="80%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
                </View>
            </View>
            <View style={styles.shimmerStatsRow}>
                <View style={styles.shimmerStatCell}>
                    <Shimmer width={48} height={24} borderRadius={6} />
                    <Shimmer width="80%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
                </View>
                <View style={styles.shimmerStatCell}>
                    <Shimmer width={48} height={24} borderRadius={6} />
                    <Shimmer width="80%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
                </View>
            </View>
        </View>

        <CandidateAssignmentsTable overview={{ results: [] }} loading />
    </ScrollView>
);

const AssessmentOverView = () => {
    const dispatch = useAppDispatch();
    const route = useRoute();
    const params = (route?.params || {}) as AssessmentOverviewParams;
    const blueprintId = params.blueprintId;

    const blueprint = useSelector(selectAssessmentOverviewBlueprint);
    const dashboardStats = useSelector(selectAssessmentOverviewDashboardStats);
    const assignmentResults = useSelector(selectAssessmentOverviewAssignments);
    const blueprintAssignmentStats = useSelector(selectAssessmentOverviewBlueprintAssignmentStats);
    const loading = useSelector(selectAssessmentOverviewLoading);
    const error = useSelector(selectAssessmentOverviewError);

    const assignmentsOverview = useMemo(
        () => ({ results: mapBlueprintAssignmentsToTableRows(assignmentResults) }),
        [assignmentResults]
    );

    const load = useCallback(() => {
        dispatch(fetchAssessmentOverviewRequestAction(blueprintId ?? null));
    }, [dispatch, blueprintId]);

    useEffect(() => {
        load();
    }, [load]);

    const publishedLabel = blueprint?.is_published ? 'Published' : 'Draft';

    const instructionTags = useMemo(() => {
        const skills = normalizeSkillTags(blueprint?.skills);
        if (skills.length > 0) return skills;
        const text = blueprint?.instructions?.trim();
        if (text) return [text];
        return [];
    }, [blueprint?.instructions, blueprint?.skills]);

    const proctoringTags = useMemo(
        () => buildProctoringTags(blueprint?.proctoring_configuration),
        [blueprint?.proctoring_configuration]
    );

    const statsData = useMemo(() => {
        if (blueprintId) {
            if (!blueprintAssignmentStats) {
                return [
                    { title: 'Candidates invited', value: '—' },
                    { title: 'In progress', value: '—' },
                    { title: 'Completed', value: '—' },
                    { title: 'Completion rate', value: '—' },
                ];
            }
            const a = blueprintAssignmentStats;
            const rate =
                typeof a.completion_rate === 'number' && Number.isFinite(a.completion_rate)
                    ? `${Number.isInteger(a.completion_rate) ? a.completion_rate : a.completion_rate.toFixed(1)}%`
                    : '—';
            return [
                { title: 'Candidates invited', value: String(a.invited) },
                { title: 'In progress', value: String(a.in_progress) },
                { title: 'Completed', value: String(a.completed) },
                { title: 'Completion rate', value: rate },
            ];
        }
        const s = dashboardStats;
        return [
            { title: 'Candidates invited', value: String(s?.candidates_assessed ?? '—') },
            { title: 'In progress', value: String(s?.active ?? '—') },
            { title: 'Completed', value: String(s?.sent_this_month ?? '—') },
            {
                title: 'Completion rate',
                value: s?.completion_rate != null ? `${s.completion_rate}%` : '—',
            },
        ];
    }, [blueprintId, blueprintAssignmentStats, dashboardStats]);

    const renderStatItem = ({ item }: { item: { title: string; value: string } }) => (
        <StatCard
            title={item.title}
            value={item.value}
            percentage=""
            subText=""
            tooltipText=""
        />
    );

    const sections = blueprint?.sections ?? [];

    return (
        <CustomSafeAreaView style={{ flex: 1 }}>
            <Header title="Assessment overview" backNavigation threedot onBack={goBack} />
            {loading ? (
                <AssessmentOverviewShimmer />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                >
                    {error && blueprintId ? (
                        <View style={styles.errorBanner}>
                            <Typography variant="regularTxtsm" color={colors.error[600]}>
                                {error}
                            </Typography>
                            <TouchableOpacity onPress={load} hitSlop={12}>
                                <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
                                    Retry
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Typography variant="semiBoldTxtxl" numberOfLines={2}>
                                {blueprint?.title ?? '_'}
                            </Typography>
                            <Typography variant="regularTxtsm" numberOfLines={2} color={colors.gray[600]}>
                                {blueprint?.description ?? '_'}
                            </Typography>
                        </View>
                        <Button size={40} paddingHorizontal={10}>
                            Assign candidates
                        </Button>
                    </View>

                    <View style={{ marginTop: 14, gap: 8 }}>
                        <View style={styles.metaRow}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Section :
                            </Typography>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.metaValue}>
                                {sections.length}
                            </Typography>
                        </View>

                        <View style={styles.metaRow}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Duration :
                            </Typography>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.metaValue}>
                                {blueprint?.total_duration_in_minutes != null
                                    ? `${blueprint.total_duration_in_minutes} min`
                                    : '—'}
                            </Typography>
                        </View>

                        <View style={styles.metaRow}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Questions :
                            </Typography>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.metaValue}>
                                {blueprint?.total_questions ?? '—'}
                            </Typography>
                        </View>

                        <View style={styles.metaRow}>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Updated :
                            </Typography>
                            <Typography
                                variant="regularTxtsm"
                                color={colors.gray[700]}
                                style={styles.metaValueFlex}
                                numberOfLines={2}
                            >
                                {formatDate(blueprint?.updated_at) || '—'}
                            </Typography>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <View style={styles.statusBadge}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor:
                                                getStatusColor(publishedLabel) || colors.gray[500],
                                        },
                                    ]}
                                />
                                <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                                    {publishedLabel}
                                </Typography>
                            </View>
                        </View>
                    </View>

                    <Divider />

                    <Card style={styles.sectionCard}>
                        <View>
                            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                                Blueprint Details
                            </Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Detailed view of assessment configuration
                            </Typography>
                        </View>
                        <View style={styles.subTitle}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[800]}>
                                Basic settings
                            </Typography>
                            <View style={styles.snapshotRow}>
                                <View style={[styles.snapshotBox, { backgroundColor: colors.success[50] }]}>
                                    <Typography variant="semiBoldTxtmd" color={colors.success[500]}>
                                        {blueprint?.default_passing_score ?? '—'}%
                                    </Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                        Passing score
                                    </Typography>
                                </View>

                                <View style={[styles.snapshotBox, { backgroundColor: colors.gray[50] }]}>
                                    <Typography variant="semiBoldTxtmd" color={colors.gray[500]}>
                                        {blueprint?.min_sections_required ?? '—'}
                                    </Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                        Min sections required
                                    </Typography>
                                </View>
                            </View>
                        </View>
                        <Divider />
                        <View style={styles.subTitle}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[800]}>
                                Sections
                            </Typography>
                            {sections.length === 0 ? (
                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                    No sections
                                </Typography>
                            ) : (
                                sections.map((sec, index) => {
                                    const testTitle = sec.test?.title ?? `Section ${index + 1}`;
                                    const showQ =
                                        sec.select_random ??
                                        sec.total_questions ??
                                        sec.questions?.length ??
                                        0;
                                    const req = sec.required_questions ?? '—';
                                    const shuf = sec.shuffle ? 'Yes' : 'No';
                                    return (
                                        <Card key={sec.id} style={styles.questionCard}>
                                            <Typography
                                                variant="semiBoldTxtsm"
                                                color={colors.gray[900]}
                                                numberOfLines={3}
                                            >
                                                {index + 1}.{testTitle}
                                            </Typography>
                                            <Typography
                                                variant="regularTxtsm"
                                                color={colors.gray[500]}
                                                style={{ marginTop: 10 }}
                                            >
                                                Show {showQ} questions · Required: {req} · Shuffle: {shuf}
                                            </Typography>
                                        </Card>
                                    );
                                })
                            )}
                        </View>
                        <Divider />
                        <View style={styles.subTitle}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[800]}>
                                Instructions
                            </Typography>
                            {instructionTags.length > 0 ? (
                                <TagList
                                    data={instructionTags}
                                    textColor={colors.gray[700]}
                                    bgColor={colors.gray[50]}
                                    borderColor={colors.gray[200]}
                                />
                            ) : (
                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                    —
                                </Typography>
                            )}
                        </View>
                        <Divider />
                        <View style={styles.subTitle}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[800]}>
                                Proctoring
                            </Typography>
                            {proctoringTags.length > 0 ? (
                                <TagList
                                    data={proctoringTags}
                                    textColor={colors.gray[700]}
                                    bgColor={colors.gray[50]}
                                    borderColor={colors.gray[200]}
                                />
                            ) : (
                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                    {blueprint?.is_proctoring_enabled === false
                                        ? 'Proctoring disabled'
                                        : '—'}
                                </Typography>
                            )}
                        </View>
                        <Divider />
                    </Card>
                    <FlatList
                        data={statsData}
                        renderItem={renderStatItem}
                        keyExtractor={(_, i) => i.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{ gap: 12, margin: 6 }}
                    />
                    <CandidateAssignmentsTable
                        overview={assignmentsOverview}
                        loading={false}
                        onViewMore={() =>
                            navigate('CandidateAssignmentsDeatilsTable', {
                                blueprintId: blueprintId ?? undefined,
                                overview: assignmentsOverview,
                            })
                        }
                    />
                </ScrollView>
            )}
        </CustomSafeAreaView>
    );
};

export default AssessmentOverView;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 28,
        gap: 16,
    },
    errorBanner: {
        gap: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.error[50],
        borderWidth: 1,
        borderColor: colors.error[200],
    },
    sectionCard: {
        flex:1,
        padding: 16,
        gap: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    metaValue: {
        marginLeft: 6,
    },
    metaValueFlex: {
        marginLeft: 6,
        flex: 1,
    },
    statusBadge: {
        backgroundColor: colors.base.white,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.gray[300],
        shadowColor: 'rgba(10, 13, 18, 0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
        gap: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    questionCard: {
        padding: 12,
        borderWidth: 1,
        gap: 6,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
        borderRadius: 10,
    },
    snapshotRow: {
        flexDirection: 'row',
        gap: 8,
    },
    snapshotBox: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        gap: 8,
    },
    subTitle: {
        gap: 12,
    },
    shimmerStatsWrap: {
        gap: 12,
        marginHorizontal: 6,
    },
    shimmerStatsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    shimmerStatCell: {
        flex: 1,
        minHeight: 88,
        padding: 14,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
});
