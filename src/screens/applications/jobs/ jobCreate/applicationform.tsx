import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import { Button, Header, Typography, ListEmptyState } from '../../../../components';
import Card from '../../../../components/atoms/card';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import { navigate, goBack } from '../../../../utils/navigationUtils';
import { colors } from '../../../../theme/colors';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import NumberStepper from '../../../../components/atoms/numberstepper';
import Divider from '../../../../components/atoms/divider';
import { SvgXml } from 'react-native-svg';
import { editIcon } from '../../../../assets/svg/edit';
import { trashIcon } from '../../../../assets/svg/trash';
import AddCriteriaModal, {
    AddCriteriaSavePayload,
} from './addCriteriaModal';
import ScreeningQuestionLibraryModal from './screeningQuestionLibraryModal';

const MAX_APPLICANT_OPTIONS = ['50', '100', '200', '500'].map((n) => ({ id: n, name: n }));
const MANDATORY_OPTIONS = [
    { id: 'Off', name: 'Off' },
    { id: 'optional', name: 'Optional' },
    { id: 'mandatory', name: 'Mandatory' }
    ,
];

type CriteriaRow = { id: string; title: string; typeLabel: string };

const JOB_CREATE_TOTAL_STEPS = 3;
const STEP_INDEX = 2;

const FILTER_CRITERIA_EMPTY = {
    title: 'No filter criteria yet',
    description: 'Add screening questions to automatically filter applicants',
};

const SCREENING_QUESTIONS_EMPTY = {
    title: 'No screening questions yet',
    description: 'Add screening questions from your question library',
};

function RequiredLabel({ children, subTitel }: { children: string, subTitel: string }) {
    return (
        <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            {children}
            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                {' '}
                *
            </Typography>
            <Typography color={colors.gray[600]} variant="regularTxtsm">
                {''} {subTitel}
            </Typography>
        </Typography>
    );
}

const ApplicationFormScreen = () => {
    const [maxRetries, setMaxRetries] = useState(2);
    const [maxApplicants, setMaxApplicants] = useState(100);
    const [relevantExperience, setRelevantExperience] = useState('Off');
    const [noticePeriod, setNoticePeriod] = useState('Off');
    const [expectedSalary, setExpectedSalary] = useState('Off');
    const [currentSalary, setCurrentSalary] = useState('Off');
    const [profilePicture, setProfilePicture] = useState('Off');
    const [introVideo, setIntroVideo] = useState('Off');
    const [includeGithub, setIncludeGithub] = useState('Off');
    const [includeLinkedIn, setIncludeLinkedIn] = useState('Off');
    const [includeWebsite, setIncludeWebsite] = useState('Off');

    const [filterCriteria, setFilterCriteria] = useState<CriteriaRow[]>([]);
    const [screeningQuestions, setScreeningQuestions] = useState<CriteriaRow[]>([]);
    const [criteriaModalTarget, setCriteriaModalTarget] = useState<'filter' | 'screening' | null>(null);

    const appendFilterCriteria = useCallback((payload: AddCriteriaSavePayload) => {
        setFilterCriteria((prev) => {
            const n = prev.length + 1;
            const q = payload.questionText || 'Untitled question';
            const label = `${n}. ${q.length > 56 ? `${q.slice(0, 53)}…` : q}`;
            return [
                ...prev,
                {
                    id: `f-${Date.now()}`,
                    title: label,
                    typeLabel: payload.formatLabel,
                },
            ];
        });
    }, []);

    const removeFilter = useCallback((id: string) => {
        setFilterCriteria((rows) => rows.filter((r) => r.id !== id));
    }, []);
    const removeScreening = useCallback((id: string) => {
        setScreeningQuestions((rows) => rows.filter((r) => r.id !== id));
    }, []);

    const renderCriteriaCard = (
        title: string,
        rows: CriteriaRow[],
        onRemove: (id: string) => void,
        onAdd: () => void,
        emptyState: { title: string; description: string },
    ) => (
        <Card style={styles.criteriaOuterCard}>
            <View style={styles.cardHeader}>
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                    {title}
                </Typography>
                <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={`About ${title}`}>
                    <Ionicons name="help-circle-outline" size={22} color={colors.gray[400]} />
                </Pressable>
            </View>
            <View style={styles.criteriaList}>
                {rows.length === 0 ? (
                    <ListEmptyState
                        title={emptyState.title}
                        description={emptyState.description}
                        illustrationWidth={140}
                        illustrationHeight={108}
                    />
                ) : (
                    rows.map((row) => (
                        <View key={row.id} style={styles.criteriaItemBox}>
                            <View style={styles.criteriaRow}>
                                <View style={styles.criteriaText}>
                                    <Typography
                                        variant="semiBoldTxtsm"
                                        color={colors.gray[900]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {row.title}
                                    </Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                        {row.typeLabel}
                                    </Typography>
                                </View>
                                <View style={styles.criteriaActions}>
                                    <Pressable hitSlop={8} accessibilityLabel="Edit">
                                        <SvgXml xml={editIcon} color={colors.gray[500]} />
                                    </Pressable>
                                    <Pressable
                                        hitSlop={8}
                                        accessibilityLabel="Delete"
                                        onPress={() => onRemove(row.id)}
                                        style={styles.deleteBtn}
                                    >
                                        <SvgXml xml={trashIcon} color={colors.gray[500]} />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </View>
            <View style={styles.addCriteriaWrap}>
                <Button
                    size={48}
                    variant="contain"
                    buttonColor={colors.brand[600]}
                    textColor={colors.base.white}
                    borderRadius={10}
                    onPress={onAdd}
                    startIcon={<Ionicons name="add" size={20} color={colors.base.white} />}
                >
                    Add criteria
                </Button>
            </View>
        </Card>
    );

    return (
        <CustomSafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Header
                    title="Application form"
                    backNavigation
                    centerTitle
                    onBack={goBack}
                    rightComponent={
                        <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                            {`${STEP_INDEX}/${JOB_CREATE_TOTAL_STEPS}`}
                        </Typography>
                    }
                />
                <ProgressBar
                    progress={STEP_INDEX / JOB_CREATE_TOTAL_STEPS}
                    color={colors.brand[500]}
                    style={styles.progress}
                />

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.block}>
                        <RequiredLabel children={'Max retries'} subTitel={'(Number of retry attempts allowed per applicant)'} />
                        <NumberStepper value={maxRetries} onChange={(v) => setMaxRetries(v)} unitLabel={''} />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Max Applicants'} subTitel={'(Maximum number of applications to accept)'} />
                        <NumberStepper value={maxApplicants} onChange={(v) => setMaxApplicants(v)} unitLabel={''} />
                    </View>
                    <Divider />

                    <View style={styles.block}>
                        <RequiredLabel children={'Relevant Experience'} subTitel={'(Ask for relevant experience in months)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={relevantExperience}
                            onChange={(v) => setRelevantExperience(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Notice Period'} subTitel={'(Ask for current notice period)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={noticePeriod}
                            onChange={(v) => setNoticePeriod(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Expected Annual Salary'} subTitel={'(Ask for expected annual compensation)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={expectedSalary}
                            onChange={(v) => setExpectedSalary(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Current Salary'} subTitel={'(Ask for expected annual compensation)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={currentSalary}
                            onChange={(v) => setCurrentSalary(String(v))}
                        />
                    </View>

                    <Divider />

                    <View style={styles.block}>
                        <RequiredLabel children={'Profile Picture'} subTitel={'(Request profile photo from applicants)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={profilePicture}
                            onChange={(v) => setProfilePicture(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Introduction Video'} subTitel={'(Request a 1-minute introduction video)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={introVideo}
                            onChange={(v) => setIntroVideo(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'GitHub Profile'} subTitel={'(Ask for GitHub profile URL)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={includeGithub}
                            onChange={(v) => setIncludeGithub(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'LinkedIn Profile'} subTitel={'(Ask for LinkedIn profile URL)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={includeLinkedIn}
                            onChange={(v) => setIncludeLinkedIn(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <RequiredLabel children={'Personal Website'} subTitel={'(Ask for portfolio or personal website)'} />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={includeWebsite}
                            onChange={(v) => setIncludeWebsite(String(v))}
                        />
                    </View>
                    <Divider />

                    {renderCriteriaCard(
                        'Filter Criteria',
                        filterCriteria,
                        removeFilter,
                        () => setCriteriaModalTarget('filter'),
                        FILTER_CRITERIA_EMPTY,
                    )}

                    {renderCriteriaCard(
                        'Screening Questions',
                        screeningQuestions,
                        removeScreening,
                        () => setCriteriaModalTarget('screening'),
                        SCREENING_QUESTIONS_EMPTY,
                    )}
                </ScrollView>

                <AddCriteriaModal
                    visible={criteriaModalTarget === 'filter'}
                    onClose={() => setCriteriaModalTarget(null)}
                    onSave={appendFilterCriteria}
                />
                <ScreeningQuestionLibraryModal
                    visible={criteriaModalTarget === 'screening'}
                    onClose={() => setCriteriaModalTarget(null)}
                    onConfirm={(rows) =>
                        setScreeningQuestions((prev) => {
                            const base = prev.length;
                            return [
                                ...prev,
                                ...rows.map((r, j) => ({
                                    ...r,
                                    title: `${base + j + 1}. ${r.title}`,
                                })),
                            ];
                        })
                    }
                />
                <FooterButtons
                    leftButtonProps={{
                        children: 'Back',
                        size: 48,
                        variant: 'outline',
                        borderColor: colors.gray[200],
                        buttonColor: colors.base.white,
                        textColor: colors.gray[900],
                        borderWidth: 1,
                        onPress: goBack,
                    }}
                    rightButtonProps={{
                        children: 'Next',
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        onPress: () => navigate('TeamMembers'),
                    }}
                />
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
};

export default ApplicationFormScreen;

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    progress: {
        height: 4,
        backgroundColor: colors.gray[100],
    },
    scroll: { flex: 1 },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    block: { gap: 6 },
    criteriaOuterCard: {
        padding: 16,
        backgroundColor: colors.base.white,
        gap: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    criteriaList: {
        gap: 12,
    },
    criteriaItemBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: colors.base.white,
    },
    criteriaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    criteriaText: { flex: 1, marginRight: 12, gap: 4 },
    criteriaActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
    },
    deleteBtn: { paddingLeft: 2 },
    addCriteriaWrap: {
        width: '100%',
        alignSelf: 'stretch',
        marginTop: 4,
    },
});
