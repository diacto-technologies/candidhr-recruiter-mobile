import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import { Button, Header, Typography, ListEmptyState } from '../../../../components';
import Card from '../../../../components/atoms/card';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import { navigate, goBack } from '../../../../utils/navigationUtils';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    fetchApplicationFormDraftRequestAction,
    submitApplicationFormStepRequestAction,
} from '../../../../features/jobs/actions';
import { apiMandatoryToUi } from '../../../../features/jobs/api';
import {
    clearApplicationFormDraft,
    clearApplicationFormDraftError,
    clearApplicationFormSubmitError,
} from '../../../../features/jobs/slice';
import type {
    ApplicationFormDraftData,
    JobCriteriaApiRow,
    JobFilterCriteriaPayload,
    SubmitJobApplicationFormStepPayload,
} from '../../../../features/jobs/types';
import type { QuestionOptionItem } from '../../../../components/molecules/questionoptionsfield/types';
import { showToastMessage } from '../../../../utils/toast';
import { colors } from '../../../../theme/colors';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import NumberStepper from '../../../../components/atoms/numberstepper';
import Divider from '../../../../components/atoms/divider';
import { SvgUri, SvgXml } from 'react-native-svg';
import { shadowStyles } from '../../../../theme/shadowcolor';
import { editIcon } from '../../../../assets/svg/edit';
import { trashIcon } from '../../../../assets/svg/trash';
import AddCriteriaModal, {
    AddCriteriaSavePayload,
    FORMAT_OPTIONS,
} from './addCriteriaModal';
import ScreeningQuestionLibraryModal from './screeningQuestionLibraryModal';

const MAX_APPLICANT_OPTIONS = ['50', '100', '200', '500'].map((n) => ({ id: n, name: n }));
const MANDATORY_OPTIONS = [
    { id: 'Off', name: 'Off' },
    { id: 'optional', name: 'Optional' },
    { id: 'mandatory', name: 'Mandatory' }
    ,
];

const CURRENCY_COUNTRIES: Record<string, string> = {
    USD: 'US', EUR: 'EU', GBP: 'GB', JPY: 'JP', CNY: 'CN', INR: 'IN',
    AUD: 'AU', CAD: 'CA', CHF: 'CH', SGD: 'SG', HKD: 'HK', NZD: 'NZ',
    KRW: 'KR', MXN: 'MX', BRL: 'BR', ZAR: 'ZA', RUB: 'RU', AED: 'AE',
    SAR: 'SA', SEK: 'SE', NOK: 'NO', DKK: 'DK', PLN: 'PL', THB: 'TH',
    IDR: 'ID', MYR: 'MY', PHP: 'PH', VND: 'VN', TWD: 'TW', TRY: 'TR',
    ILS: 'IL', EGP: 'EG', NGN: 'NG', PKR: 'PK', BDT: 'BD', CLP: 'CL',
    COP: 'CO', PEN: 'PE', ARS: 'AR', CZK: 'CZ', HUF: 'HU', RON: 'RO',
    BGN: 'BG', HRK: 'HR', UAH: 'UA', KES: 'KE', GHS: 'GH', TZS: 'TZ',
    UGX: 'UG', QAR: 'QA', KWD: 'KW', BHD: 'BH', OMR: 'OM', JOD: 'JO',
    LKR: 'LK', NPR: 'NP', MMK: 'MM',
};

const POPULAR_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'JPY', 'CNY',
];

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹',
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', SGD: 'S$', HKD: 'HK$', KRW: '₩',
    BRL: 'R$', ZAR: 'R', RUB: '₽', AED: 'د.إ', SAR: '﷼', SEK: 'kr',
    NOK: 'kr', DKK: 'kr', PLN: 'zł', THB: '฿', MYR: 'RM', PHP: '₱',
    TRY: '₺', ILS: '₪', PKR: '₨', BDT: '৳', NGN: '₦',
};

function currentSalaryShowsCurrency(currentSalary: string) {
    return currentSalary === 'optional' || currentSalary === 'mandatory';
}

type CriteriaRow = {
    id: string;
    title: string;
    typeLabel: string;
    /** Full draft for AddCriteriaModal (edit). */
    payload?: AddCriteriaSavePayload;
};

function screeningQuestionTypeLabel(type: string | undefined): string {
    const t = (type || 'text').toLowerCase();
    if (t === 'audio') return 'Audio';
    return 'Text';
}

function criteriaApiRowToCriteriaRow(row: JobCriteriaApiRow, index1: number): CriteriaRow {
    const qRaw = (row.question ?? '').trim() || 'Untitled question';
    const short = qRaw.length > 56 ? `${qRaw.slice(0, 53)}…` : qRaw;
    const title = `${index1}. ${short}`;

    const rt = (row.response_type || '').toLowerCase();
    let formatId = 'single_choice';
    if (rt === 'yes/no' || rt === 'radio') {
        formatId = 'yes_no';
    } else if (rt === 'checkbox' || rt.includes('multiple')) {
        formatId = 'multiple_choice';
    }
    const formatMeta = FORMAT_OPTIONS.find((f) => f.id === formatId);
    const formatLabel = formatMeta?.name ?? 'Single choice';

    let options: QuestionOptionItem[];
    if (formatId === 'yes_no') {
        options = [
            { id: 'criteria-yn-yes', text: 'Yes' },
            { id: 'criteria-yn-no', text: 'No' },
        ];
    } else {
        const texts = (row.options || []).map((t) => String(t).trim()).filter(Boolean);
        options =
            texts.length > 0
                ? texts.map((text, j) => ({ id: `criteria-opt-${row.id}-${j}`, text }))
                : Array.from({ length: 4 }, (_, j) => ({
                      id: `criteria-opt-${row.id}-${j}`,
                      text: '',
                  }));
    }

    const exp = (row.expected_response || '').trim().toLowerCase();
    let correctOptionIds: string[] = [];
    if (formatId === 'yes_no') {
        correctOptionIds = exp.startsWith('y') ? ['criteria-yn-yes'] : ['criteria-yn-no'];
    } else {
        const parts = exp.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
        correctOptionIds = options
            .filter((o) => parts.some((p) => o.text.trim().toLowerCase() === p))
            .map((o) => o.id);
        if (correctOptionIds.length === 0 && options[0]?.id) {
            correctOptionIds = [options[0].id];
        }
    }

    const payload: AddCriteriaSavePayload = {
        questionText: (row.question ?? '').trim(),
        formatId,
        formatLabel,
        options,
        correctOptionIds,
    };

    return {
        id: row.id,
        title,
        typeLabel: formatLabel,
        payload,
    };
}

function hydrateApplicationFormFromDraft(
    draft: ApplicationFormDraftData,
    setters: {
        setMaxApplicants: (n: number) => void;
        setRelevantExperience: (v: string) => void;
        setNoticePeriod: (v: string) => void;
        setExpectedSalary: (v: string) => void;
        setCurrentSalary: (v: string) => void;
        setSalaryCurrencyId: (v: string) => void;
        setRecentCurrencies: React.Dispatch<React.SetStateAction<string[]>>;
        setProfilePicture: (v: string) => void;
        setIntroVideo: (v: string) => void;
        setIncludeGithub: (v: string) => void;
        setIncludeLinkedIn: (v: string) => void;
        setIncludeWebsite: (v: string) => void;
        setFilterCriteria: React.Dispatch<React.SetStateAction<CriteriaRow[]>>;
        setScreeningQuestions: React.Dispatch<React.SetStateAction<CriteriaRow[]>>;
    }
) {
    const p = draft.preferences;
    if (p) {
        if (typeof p.max_applicants === 'number' && Number.isFinite(p.max_applicants)) {
            setters.setMaxApplicants(p.max_applicants);
        }
        setters.setRelevantExperience(apiMandatoryToUi(p.include_relevant_experience));
        setters.setNoticePeriod(apiMandatoryToUi(p.include_notice_period));
        setters.setExpectedSalary(apiMandatoryToUi(p.include_expected_ctc));
        setters.setCurrentSalary(apiMandatoryToUi(p.include_current_ctc));
        setters.setProfilePicture(apiMandatoryToUi(p.include_profile_pic));
        setters.setIntroVideo(apiMandatoryToUi(p.include_intro_video));
        setters.setIncludeGithub(apiMandatoryToUi(p.include_github));
        setters.setIncludeLinkedIn(apiMandatoryToUi(p.include_linkedin));
        setters.setIncludeWebsite(apiMandatoryToUi(p.include_personal_website));
        const cur = p.currency?.trim();
        if (cur && CURRENCY_COUNTRIES[cur]) {
            setters.setSalaryCurrencyId(cur);
            setters.setRecentCurrencies((prev) => {
                const next = prev.filter((c) => c && c !== cur);
                return [cur, ...next].slice(0, 5);
            });
        } else {
            setters.setSalaryCurrencyId('');
        }
        const qs = p.questions ?? [];
        setters.setScreeningQuestions(
            qs.map((q, i) => {
                const t = (q.text ?? '').trim();
                const short = t.length > 56 ? `${t.slice(0, 53)}…` : t;
                return {
                    id: q.id,
                    title: `${i + 1}. ${short}`,
                    typeLabel: screeningQuestionTypeLabel(q.type),
                };
            })
        );
    } else {
        setters.setScreeningQuestions([]);
    }
    const rows = (draft.criteria ?? []).map((row, i) => criteriaApiRowToCriteriaRow(row, i + 1));
    setters.setFilterCriteria(rows);
}

const JOB_CREATE_TOTAL_STEPS = 3;
const STEP_INDEX = 2;

function screeningPreferencesIdFromDraft(
    draft: ApplicationFormDraftData | null,
    activeJobId: string
): number | undefined {
    if (!draft || draft.jobId !== activeJobId) return undefined;
    const raw = draft.preferences?.id;
    if (typeof raw === 'number' && raw > 0 && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() !== '') {
        const n = Number.parseInt(raw, 10);
        if (Number.isFinite(n) && n > 0) return n;
    }
    return undefined;
}

const FILTER_CRITERIA_EMPTY = {
    title: 'No filter criteria yet',
    description: 'Add screening questions to automatically filter applicants',
};

const SCREENING_QUESTIONS_EMPTY = {
    title: 'No screening questions yet',
    description: 'Add screening questions from your question library',
};

/** Max retries UI is hidden for now; API still receives this default. */
const DEFAULT_MAX_RETRIES = 2;

function FieldLabel({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            {title}
            <Typography color={colors.gray[600]} variant="regularTxtsm">
                {' '}
                {subtitle}
            </Typography>
        </Typography>
    );
}

const ApplicationFormScreen = () => {
    const route = useRoute<{ params?: { jobId?: string } }>();
    const jobId = route.params?.jobId?.trim() ?? '';
    const dispatch = useAppDispatch();
    const applicationFormSubmitLoading = useAppSelector((s) => s.jobs.applicationFormSubmitLoading);
    const applicationFormSubmitError = useAppSelector((s) => s.jobs.applicationFormSubmitError);
    const applicationFormDraft = useAppSelector((s) => s.jobs.applicationFormDraft);
    const applicationFormDraftLoading = useAppSelector((s) => s.jobs.applicationFormDraftLoading);
    const applicationFormDraftError = useAppSelector((s) => s.jobs.applicationFormDraftError);
    const prevSubmitLoading = useRef(false);
    const draftHydratedJobIdRef = useRef<string | null>(null);

    const [maxApplicants, setMaxApplicants] = useState(100);
    const [relevantExperience, setRelevantExperience] = useState('Off');
    const [noticePeriod, setNoticePeriod] = useState('Off');
    const [expectedSalary, setExpectedSalary] = useState('Off');
    const [currentSalary, setCurrentSalary] = useState('Off');
    const [salaryCurrencyId, setSalaryCurrencyId] = useState('');
    const [recentCurrencies, setRecentCurrencies] = useState<string[]>([]);
    const [profilePicture, setProfilePicture] = useState('Off');
    const [introVideo, setIntroVideo] = useState('Off');
    const [includeGithub, setIncludeGithub] = useState('Off');
    const [includeLinkedIn, setIncludeLinkedIn] = useState('Off');
    const [includeWebsite, setIncludeWebsite] = useState('Off');

    const [filterCriteria, setFilterCriteria] = useState<CriteriaRow[]>([]);
    const [screeningQuestions, setScreeningQuestions] = useState<CriteriaRow[]>([]);
    const screeningQuestionIdsForLibrary = useMemo(
        () => screeningQuestions.map((r) => r.id),
        [screeningQuestions]
    );
    const [criteriaModalTarget, setCriteriaModalTarget] = useState<'filter' | 'screening' | null>(null);
    const [editingFilterId, setEditingFilterId] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            dispatch(clearApplicationFormDraft());
        };
    }, [dispatch]);

    useEffect(() => {
        if (!jobId) return;
        dispatch(fetchApplicationFormDraftRequestAction({ jobId }));
    }, [jobId, dispatch]);

    useEffect(() => {
        draftHydratedJobIdRef.current = null;
    }, [jobId]);

    useEffect(() => {
        if (!applicationFormDraftError) return;
        showToastMessage(applicationFormDraftError, 'error');
        dispatch(clearApplicationFormDraftError());
    }, [applicationFormDraftError, dispatch]);

    useEffect(() => {
        if (!jobId || !applicationFormDraft || applicationFormDraft.jobId !== jobId) return;
        if (draftHydratedJobIdRef.current === jobId) return;
        draftHydratedJobIdRef.current = jobId;
        hydrateApplicationFormFromDraft(applicationFormDraft, {
            setMaxApplicants,
            setRelevantExperience,
            setNoticePeriod,
            setExpectedSalary,
            setCurrentSalary,
            setSalaryCurrencyId,
            setRecentCurrencies,
            setProfilePicture,
            setIntroVideo,
            setIncludeGithub,
            setIncludeLinkedIn,
            setIncludeWebsite,
            setFilterCriteria,
            setScreeningQuestions,
        });
    }, [jobId, applicationFormDraft]);

    const screeningPreferencesId = useMemo(
        () => screeningPreferencesIdFromDraft(applicationFormDraft, jobId),
        [applicationFormDraft, jobId]
    );

    const showSalaryCurrency = useMemo(
        () => currentSalaryShowsCurrency(currentSalary),
        [currentSalary]
    );

    useEffect(() => {
        if (!currentSalaryShowsCurrency(currentSalary)) {
            setSalaryCurrencyId('');
            setRecentCurrencies([]);
        }
    }, [currentSalary]);

    const currencyDropdownOptions = useMemo(() => {
        const options: { id: string; name: string; isHeader?: boolean; countryCode?: string; searchLabel?: string }[] = [];
        const addedCodes = new Set<string>();

        const buildOption = (code: string, prefix: string) => ({
            id: `${prefix}_${code}`,
            name: `${code} ${CURRENCY_SYMBOLS[code] ? `(${CURRENCY_SYMBOLS[code]})` : ''}`,
            countryCode: CURRENCY_COUNTRIES[code],
            searchLabel: code,
        });

        const validRecent = recentCurrencies.filter((c) => c && CURRENCY_COUNTRIES[c]);
        if (validRecent.length > 0) {
            options.push({
                id: 'header-recent',
                name: 'RECENT CURRENCY',
                isHeader: true,
                searchLabel: `RECENT CURRENCY ${validRecent.join(' ')}`,
            });
            validRecent.forEach((code) => {
                options.push(buildOption(code, 'recent'));
                addedCodes.add(code);
            });
        }

        const popularToAdd = POPULAR_CURRENCIES.filter((code) => !addedCodes.has(code));
        if (popularToAdd.length > 0) {
            options.push({
                id: 'header-popular',
                name: 'POPULAR CURRENCY',
                isHeader: true,
                searchLabel: `POPULAR CURRENCY ${popularToAdd.join(' ')}`,
            });
            popularToAdd.forEach((code) => {
                options.push(buildOption(code, 'popular'));
                addedCodes.add(code);
            });
        }

        const allToAdd = Object.keys(CURRENCY_COUNTRIES).filter((code) => !addedCodes.has(code));
        if (allToAdd.length > 0) {
            options.push({
                id: 'header-all',
                name: 'ALL CURRENCY',
                isHeader: true,
                searchLabel: `ALL CURRENCY ${allToAdd.join(' ')}`,
            });
            allToAdd.forEach((code) => {
                options.push(buildOption(code, 'all'));
                addedCodes.add(code);
            });
        }

        return options;
    }, [recentCurrencies]);

    const handleCurrencySelect = useCallback((codeRaw: string) => {
        const code = codeRaw.replace(/^(recent_|popular_|all_)/, '');
        if (!code || !CURRENCY_COUNTRIES[code]) return;
        setSalaryCurrencyId(code);
        setRecentCurrencies((prev) => {
            const next = prev.filter((c) => c && c !== code);
            return [code, ...next].slice(0, 5);
        });
    }, []);

    const activeCurrencyValueId = useMemo(() => {
        if (!salaryCurrencyId || !CURRENCY_COUNTRIES[salaryCurrencyId]) {
            return undefined;
        }
        if (recentCurrencies.includes(salaryCurrencyId)) return `recent_${salaryCurrencyId}`;
        if (POPULAR_CURRENCIES.includes(salaryCurrencyId)) return `popular_${salaryCurrencyId}`;
        return `all_${salaryCurrencyId}`;
    }, [salaryCurrencyId, recentCurrencies]);

    const closeFilterModal = useCallback(() => {
        setCriteriaModalTarget(null);
        setEditingFilterId(null);
    }, []);

    const openAddFilterCriteria = useCallback(() => {
        setEditingFilterId(null);
        setCriteriaModalTarget('filter');
    }, []);

    const upsertFilterCriteria = useCallback(
        (payload: AddCriteriaSavePayload) => {
            setFilterCriteria((prev) => {
                const q = payload.questionText?.trim() || 'Untitled question';
                const labelAt = (index1: number) =>
                    `${index1}. ${q.length > 56 ? `${q.slice(0, 53)}…` : q}`;

                if (editingFilterId) {
                    const idx = prev.findIndex((r) => r.id === editingFilterId);
                    if (idx === -1) return prev;
                    return prev.map((r) =>
                        r.id === editingFilterId
                            ? {
                                  ...r,
                                  title: labelAt(idx + 1),
                                  typeLabel: payload.formatLabel,
                                  payload: { ...payload },
                              }
                            : r
                    );
                }

                const n = prev.length + 1;
                return [
                    ...prev,
                    {
                        id: `f-${Date.now()}`,
                        title: labelAt(n),
                        typeLabel: payload.formatLabel,
                        payload: { ...payload },
                    },
                ];
            });
        },
        [editingFilterId]
    );

    const filterModalInitial = useMemo(() => {
        if (!editingFilterId) return null;
        return filterCriteria.find((r) => r.id === editingFilterId)?.payload ?? null;
    }, [editingFilterId, filterCriteria]);

    const removeFilter = useCallback((id: string) => {
        setFilterCriteria((rows) => rows.filter((r) => r.id !== id));
    }, []);
    const removeScreening = useCallback((id: string) => {
        setScreeningQuestions((rows) => rows.filter((r) => r.id !== id));
    }, []);

    const buildSubmitPayload = useCallback((): SubmitJobApplicationFormStepPayload | null => {
        if (!jobId) return null;
        const filterPayloads: JobFilterCriteriaPayload[] = filterCriteria
            .map((r) => r.payload)
            .filter((p): p is AddCriteriaSavePayload => Boolean(p));
        const salaryCurrency =
            currentSalaryShowsCurrency(currentSalary) &&
            salaryCurrencyId &&
            CURRENCY_COUNTRIES[salaryCurrencyId]
                ? salaryCurrencyId
                : null;

        return {
            jobId,
            screeningPreferencesId,
            maxRetries: DEFAULT_MAX_RETRIES,
            maxApplicants,
            relevantExperience,
            noticePeriod,
            expectedSalary,
            currentSalary,
            salaryCurrency,
            profilePicture,
            introVideo,
            includeGithub,
            includeLinkedIn,
            includeWebsite,
            screeningQuestionIds: screeningQuestions.map((r) => r.id),
            filterCriteria: filterPayloads,
        };
    }, [
        jobId,
        screeningPreferencesId,
        filterCriteria,
        maxApplicants,
        relevantExperience,
        noticePeriod,
        expectedSalary,
        currentSalary,
        salaryCurrencyId,
        profilePicture,
        introVideo,
        includeGithub,
        includeLinkedIn,
        includeWebsite,
        screeningQuestions,
    ]);

    useEffect(() => {
        if (!applicationFormSubmitError) return;
        showToastMessage(applicationFormSubmitError, 'error');
        dispatch(clearApplicationFormSubmitError());
    }, [applicationFormSubmitError, dispatch]);

    useEffect(() => {
        const wasLoading = prevSubmitLoading.current;
        prevSubmitLoading.current = applicationFormSubmitLoading;
        if (
            wasLoading &&
            !applicationFormSubmitLoading &&
            !applicationFormSubmitError
        ) {
            navigate('TeamMembers', { jobId });
        }
    }, [applicationFormSubmitLoading, applicationFormSubmitError, jobId]);

    const onNextPress = useCallback(() => {
        const payload = buildSubmitPayload();
        if (!payload) return;
        dispatch(submitApplicationFormStepRequestAction(payload));
    }, [buildSubmitPayload, dispatch]);

    const renderCriteriaCard = (
        title: string,
        rows: CriteriaRow[],
        onRemove: (id: string) => void,
        onAdd: () => void,
        emptyState: { title: string; description: string },
        onEditRow?: (row: CriteriaRow) => void,
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
                                    <Pressable
                                        hitSlop={8}
                                        accessibilityRole="button"
                                        accessibilityLabel="Edit"
                                        onPress={() => onEditRow?.(row)}
                                        disabled={!onEditRow || !row.payload}
                                    >
                                        <SvgXml
                                            xml={editIcon}
                                            color={
                                                onEditRow && row.payload
                                                    ? colors.gray[500]
                                                    : colors.gray[300]
                                            }
                                        />
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
                style={[styles.flex, styles.kbRelative]}
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
                    {/* Max retries — not used in UI for now; submit still sends DEFAULT_MAX_RETRIES */}
                    {/* <View style={styles.block}>
                        <FieldLabel title="Max retries" subtitle="(Number of retry attempts allowed per applicant)" />
                        <NumberStepper value={maxRetries} onChange={(v) => setMaxRetries(v)} unitLabel={''} />
                    </View> */}

                    <View style={styles.block}>
                        <FieldLabel title="Max Applicants" subtitle="(Maximum number of applications to accept)" />
                        <NumberStepper value={maxApplicants} onChange={(v) => setMaxApplicants(v)} unitLabel={''} max={100000} />
                    </View>
                    <Divider />

                    <View style={styles.block}>
                        <FieldLabel title="Relevant Experience" subtitle="(Ask for relevant experience in months)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={relevantExperience}
                            onChange={(v) => setRelevantExperience(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="Notice Period" subtitle="(Ask for current notice period)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={noticePeriod}
                            onChange={(v) => setNoticePeriod(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="Expected Annual Salary" subtitle="(Ask for expected annual compensation)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={expectedSalary}
                            onChange={(v) => setExpectedSalary(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="Current Salary" subtitle="(Ask for current annual compensation)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={currentSalary}
                            onChange={(v) => setCurrentSalary(String(v))}
                        />
                    </View>

                    {showSalaryCurrency ? (
                        <View style={styles.block}>
                            <FieldLabel
                                title="Salary Currency"
                                subtitle="(Used for current salary on the application form)"
                            />
                            <View style={styles.currencyDropdownRow}>
                                <View style={styles.currencyDropdownFlex}>
                                    <CommonDropdown
                                        placeholder="Select currency..."
                                        options={currencyDropdownOptions}
                                        value={activeCurrencyValueId}
                                        onChange={(v) => handleCurrencySelect(String(v))}
                                        labelKey="name"
                                        valueKey="id"
                                        searchable
                                        searchPlaceholder="Search currency..."
                                        searchField="label"
                                        mode="default"
                                        dropdownPosition="bottom"
                                        containerStyle={styles.currencyDropdownInner}
                                        renderLeftIcon={(item: { isHeader?: boolean; countryCode?: string }) => {
                                            if (item.isHeader || !item.countryCode) return null;
                                            return (
                                                <View
                                                    style={{
                                                        width: 24,
                                                        height: 18,
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        backgroundColor: '#f0f0f0',
                                                    }}
                                                >
                                                    <SvgUri
                                                        width="100%"
                                                        height="100%"
                                                        uri={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.countryCode}.svg`}
                                                    />
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : null}

                    <Divider />

                    <View style={styles.block}>
                        <FieldLabel title="Profile Picture" subtitle="(Request profile photo from applicants)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={profilePicture}
                            onChange={(v) => setProfilePicture(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="Introduction Video" subtitle="(Request a 1-minute introduction video)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={introVideo}
                            onChange={(v) => setIntroVideo(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="GitHub Profile" subtitle="(Ask for GitHub profile URL)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={includeGithub}
                            onChange={(v) => setIncludeGithub(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="LinkedIn Profile" subtitle="(Ask for LinkedIn profile URL)" />
                        <CommonDropdown
                            placeholder="Select"
                            options={MANDATORY_OPTIONS}
                            value={includeLinkedIn}
                            onChange={(v) => setIncludeLinkedIn(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <FieldLabel title="Personal Website" subtitle="(Ask for portfolio or personal website)" />
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
                        openAddFilterCriteria,
                        FILTER_CRITERIA_EMPTY,
                        (row) => {
                            if (!row.payload) return;
                            setEditingFilterId(row.id);
                            setCriteriaModalTarget('filter');
                        },
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
                    onClose={closeFilterModal}
                    onSave={upsertFilterCriteria}
                    initialValues={filterModalInitial}
                />
                <ScreeningQuestionLibraryModal
                    visible={criteriaModalTarget === 'screening'}
                    onClose={() => setCriteriaModalTarget(null)}
                    alreadySelectedQuestionIds={screeningQuestionIdsForLibrary}
                    onConfirm={(rows) =>
                        setScreeningQuestions((prev) => {
                            const existingIds = new Set(prev.map((r) => r.id));
                            const dedupedIncoming = rows.filter((r) => {
                                if (existingIds.has(r.id)) return false;
                                existingIds.add(r.id);
                                return true;
                            });
                            if (dedupedIncoming.length === 0) return prev;
                            const base = prev.length;
                            return [
                                ...prev,
                                ...dedupedIncoming.map((r, j) => ({
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
                        children: screeningPreferencesId != null ? 'Save & Continue' : 'Next',
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        isLoading: applicationFormSubmitLoading,
                        disabled: applicationFormSubmitLoading || applicationFormDraftLoading,
                        onPress: onNextPress,
                    }}
                />

                {applicationFormDraftLoading && jobId ? (
                    <View style={[StyleSheet.absoluteFillObject, styles.draftLoadingOverlay]}>
                        <ActivityIndicator size="large" color={colors.brand[600]} />
                    </View>
                ) : null}
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
};

export default ApplicationFormScreen;

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    kbRelative: { position: 'relative' },
    draftLoadingOverlay: {
        backgroundColor: 'rgba(255,255,255,0.78)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
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
    currencyDropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        marginTop: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray[300],
        backgroundColor: colors.base.white,
        paddingRight: 4,
        ...shadowStyles.shadow_xs,
    },
    currencyDropdownFlex: {
        flex: 1,
        minWidth: 0,
    },
    currencyDropdownInner: {
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
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
