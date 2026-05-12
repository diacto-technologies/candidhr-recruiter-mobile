import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import Svg, { Path, SvgXml, SvgUri } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import RichTextField from '../../../../components/atoms/richtextscreen';
import { Header, Typography, TextField, Button } from '../../../../components';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import Card from '../../../../components/atoms/card';
import CustomSwitch from '../../../../components/atoms/switchbutton';
import NumberStepper from '../../../../components/atoms/numberstepper';
import TagList from '../../../../components/molecules/taglist';
import SkillTagComposer from '../../../../components/molecules/skilltagcomposer';
import LocationAutocompleteField from '../../../../components/molecules/locationautocompletefield';
import type { LocationAutocompleteItem } from '../../../../features/locations';
import { clearSelectedLocation } from '../../../../features/locations';
import { goBack, navigate } from '../../../../utils/navigationUtils';
import { colors } from '../../../../theme/colors';
import { shadowStyles } from '../../../../theme/shadowcolor';
import { calenderIcon } from '../../../../assets/svg/calender';
import DateRangePicker from '../../../../components/organisms/filtersheetcontent/rangepicker';
import { sparkles } from '../../../../assets/svg/sparkles';
import Icon from '../../../../components/atoms/vectoricon';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { store } from '../../../../store';
import Divider from '../../../../components/atoms/divider';
import React from 'react';
import dayjs from 'dayjs';
import {
    createJobRequestAction,
    generateJobDescriptionRequestAction,
    getJobDetailRequestAction,
    patchJobDetailsRequestAction,
} from '../../../../features/jobs/actions';
import type { CreateJobRequest, JobDetail, PatchJobDetailsRequest } from '../../../../features/jobs/types';
import {
    clearCreatedJobForWizard,
    clearError,
    clearGeneratedJobDescription,
    setSelectedJob,
} from '../../../../features/jobs/slice';

type WeightKey = 'experience' | 'skills' | 'projects' | 'education' | 'certification';

const WEIGHT_ORDER: WeightKey[] = [
    'experience',
    'skills',
    'projects',
    'education',
    'certification',
];

const WEIGHT_LABELS: Record<WeightKey, string> = {
    experience: 'Experience',
    skills: 'Skills',
    projects: 'Projects',
    education: 'Education',
    certification: 'Certification',
};

/** Legend / stepper colors — match design SVG */
const WEIGHT_COLORS: Record<WeightKey, string> = {
    experience: '#9E9BF4',
    skills: '#F97066',
    projects: '#FDB022',
    education: '#32D583',
    certification: '#36BFFA',
};

const GAUGE_DISPLAY_WIDTH = 220;

const GAUGE_CX = 180;
const GAUGE_CY = 180;
const GAUGE_R_OUTER = 160;
const GAUGE_R_INNER = 105;
const GAUGE_GAP_RAD = 0.04;
const GAUGE_TRACK_FILL = colors.base.white;
const HALF_CIRCLE = Math.PI;

/** Tight viewport on drawn semi-donut (not full 360×360 sheet) cuts empty pixels below chord → less gap above legend */
const GAUGE_VIEWBOX_MIN_X = 10;
const GAUGE_VIEWBOX_MIN_Y = 14;
const GAUGE_VIEWBOX_REC_W = 340;
const GAUGE_VIEWBOX_REC_H = 170;
/** Uniform scale across width keeps arc sharp; height follows aspect ratio of crop rect (~1∶2 width∶height equivalent) */
const GAUGE_DISPLAY_HEIGHT = Math.round(
    (GAUGE_DISPLAY_WIDTH * GAUGE_VIEWBOX_REC_H) / GAUGE_VIEWBOX_REC_W
);

function polar(cx: number, cy: number, r: number, angleRad: number) {
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy - r * Math.sin(angleRad),
    };
}

/** Closed ring sector: outer arc → inner radial → inner arc → close (same structure as design handoff) */
function buildSegment(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    start: number,
    end: number
): string {
    const p1 = polar(cx, cy, rOuter, start);
    const p2 = polar(cx, cy, rOuter, end);
    const p3 = polar(cx, cy, rInner, end);
    const p4 = polar(cx, cy, rInner, start);
    const sweep = Math.abs(start - end);
    const largeArc = sweep > Math.PI ? 1 : 0;
    return [
        `M ${p1.x} ${p1.y}`,
        `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
        'Z',
    ].join(' ');
}

function buildGaugeDonutPaths(map: Record<WeightKey, number>): { key: WeightKey; d: string }[] {
    const clamped = WEIGHT_ORDER.map((k) => Math.max(0, Math.min(100, map[k])));
    const rawRadians = clamped.map((w) => (w / 100) * HALF_CIRCLE);
    const sumRaw = rawRadians.reduce((a, b) => a + b, 0);

    const mk = (a0: number, a1: number) =>
        buildSegment(GAUGE_CX, GAUGE_CY, GAUGE_R_OUTER, GAUGE_R_INNER, a0, a1);

    const equalFive = (): { key: WeightKey; d: string }[] => {
        const n = WEIGHT_ORDER.length;
        const usable = HALF_CIRCLE - GAUGE_GAP_RAD * (n - 1);
        const each = usable / n;
        let theta = Math.PI;
        return WEIGHT_ORDER.map((key) => {
            const end = theta - each;
            const seg = { key, d: mk(theta, end) };
            theta = end - GAUGE_GAP_RAD;
            return seg;
        });
    };

    if (sumRaw <= 1e-7) {
        return equalFive();
    }

    let activeSlices = 0;
    for (let i = 0; i < rawRadians.length; i += 1) {
        if (rawRadians[i] > 1e-6) activeSlices += 1;
    }
    const gapCount = Math.max(0, activeSlices - 1);
    const usable = HALF_CIRCLE - GAUGE_GAP_RAD * gapCount;
    const scale = usable / sumRaw;

    const out: { key: WeightKey; d: string }[] = [];
    let theta = Math.PI;
    let placed = false;
    for (let i = 0; i < WEIGHT_ORDER.length; i += 1) {
        const key = WEIGHT_ORDER[i];
        const span = rawRadians[i] * scale;
        if (span <= 1e-7) continue;
        if (placed) {
            theta -= GAUGE_GAP_RAD;
        }
        placed = true;
        const end = theta - span;
        out.push({
            key,
            d: mk(theta, end),
        });
        theta = end;
    }

    return out.length > 0 ? out : equalFive();
}

const GAUGE_BACKGROUND_D = buildSegment(
    GAUGE_CX,
    GAUGE_CY,
    GAUGE_R_OUTER,
    GAUGE_R_INNER,
    HALF_CIRCLE,
    0
);

/** Legend rows: Experience / Skills / Projects • Education / Certification */
const LEGEND_ROWS: WeightKey[][] = [
    ['experience', 'skills', 'projects'],
    ['education', 'certification'],
];

/** Stepper grid: 2×2 then full-width row for Projects (matches reference layout) */
const STEPPER_GRID: WeightKey[][] = [
    ['experience', 'skills'],
    ['education', 'certification'],
    ['projects'],
];

const EMPLOYMENT_OPTIONS = [
    { id: 'full_time', name: 'Full time' },
    { id: 'part_time', name: 'Part time' },
    { id: 'contract', name: 'Contract' },
    { id: 'intern', name: 'Internship' },
];

/** Values expected by POST /job/v1/jobs/ */
const EMPLOYMENT_API_BY_ID: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    intern: 'Internship',
};

function employmentApiValueToDropdownId(apiValue: string): string {
    const norm = (apiValue || '').trim().toLowerCase();
    const found = Object.entries(EMPLOYMENT_API_BY_ID).find(([, v]) => v.toLowerCase() === norm);
    return found?.[0] ?? 'full_time';
}

function scoreWeightToUiWeights(sw: JobDetail['score_weight']): Record<WeightKey, number> {
    const def: Record<WeightKey, number> = {
        experience: 30,
        skills: 30,
        projects: 20,
        education: 10,
        certification: 10,
    };
    if (!sw) return def;
    const pct = (v: unknown) => {
        const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
        if (!Number.isFinite(n)) return 0;
        return Math.round(n * 100);
    };
    return {
        experience: pct(sw.work_experience) || def.experience,
        skills: pct(sw.skills) || def.skills,
        projects: pct(sw.projects) || def.projects,
        education: pct(sw.education) || def.education,
        certification: pct(sw.certifications) || def.certification,
    };
}

function locationDetailToAutocomplete(
    ld: NonNullable<JobDetail['location_detail']>
): LocationAutocompleteItem {
    return {
        id: ld.id,
        place_id: ld.place_id ?? null,
        display_name: ld.display_name ?? ld.name ?? '',
        city: ld.city ?? null,
        state: ld.state ?? null,
        country: ld.country ?? null,
        lat: ld.latitude ?? null,
        lon: ld.longitude ?? null,
        type: ld.location_type ?? 'place',
    };
}

const YEAR_OPTIONS = Array.from({ length: 61 }, (_, i) => ({
    id: String(i),
    name: `${i} ${i === 1 ? 'year' : 'years'}`,
}));

const STATIC_SKILL_OPTIONS: { id: string; name: string }[] = [
    { id: 'sk-python', name: 'Python' },
    { id: 'sk-javascript', name: 'JavaScript' },
    { id: 'sk-java', name: 'Java' },
    { id: 'sk-react', name: 'React' },
    { id: 'sk-nodejs', name: 'Node.js' },
    { id: 'sk-sql', name: 'SQL' },
    { id: 'sk-mongodb', name: 'MongoDB' },
    { id: 'sk-aws', name: 'AWS' },
    { id: 'sk-docker', name: 'Docker' },
    { id: 'sk-machine-learning', name: 'Machine Learning' },
    { id: 'sk-data-analysis', name: 'Data Analysis' },
    { id: 'sk-excel', name: 'Excel' },
];

const CURRENCY_COUNTRIES: Record<string, string> = {
    USD: "US", EUR: "EU", GBP: "GB", JPY: "JP", CNY: "CN", INR: "IN",
    AUD: "AU", CAD: "CA", CHF: "CH", SGD: "SG", HKD: "HK", NZD: "NZ",
    KRW: "KR", MXN: "MX", BRL: "BR", ZAR: "ZA", RUB: "RU", AED: "AE",
    SAR: "SA", SEK: "SE", NOK: "NO", DKK: "DK", PLN: "PL", THB: "TH",
    IDR: "ID", MYR: "MY", PHP: "PH", VND: "VN", TWD: "TW", TRY: "TR",
    ILS: "IL", EGP: "EG", NGN: "NG", PKR: "PK", BDT: "BD", CLP: "CL",
    COP: "CO", PEN: "PE", ARS: "AR", CZK: "CZ", HUF: "HU", RON: "RO",
    BGN: "BG", HRK: "HR", UAH: "UA", KES: "KE", GHS: "GH", TZS: "TZ",
    UGX: "UG", QAR: "QA", KWD: "KW", BHD: "BH", OMR: "OM", JOD: "JO",
    LKR: "LK", NPR: "NP", MMK: "MM",
};

const POPULAR_CURRENCIES = [
    "USD", "EUR", "GBP", "INR", "CAD", "AUD", "SGD", "AED", "JPY", "CNY",
];

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥", INR: "₹",
    AUD: "A$", CAD: "C$", CHF: "Fr", SGD: "S$", HKD: "HK$", KRW: "₩",
    BRL: "R$", ZAR: "R", RUB: "₽", AED: "د.إ", SAR: "﷼", SEK: "kr",
    NOK: "kr", DKK: "kr", PLN: "zł", THB: "฿", MYR: "RM", PHP: "₱",
    TRY: "₺", ILS: "₪", PKR: "₨", BDT: "৳", NGN: "₦",
};

function formatClosingDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

type JobFieldKey =
    | 'jobTitle'
    | 'skills'
    | 'location'
    | 'experience'
    | 'closingDate'
    | 'description'
    | 'weights'
    | 'salary'
    | 'currency';

function htmlToPlainDescription(html: string) {
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function richTextLooksEmpty(html: string) {
    const t = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return t.length === 0;
}

const SALARY_PAIR_INCOMPLETE =
    'Enter both minimum and maximum salary, or leave both empty.';

const SALARY_PAIR_INVALID =
    'Enter valid positive amounts; maximum must be greater than minimum.';

const CURRENCY_REQUIRED_ERROR = 'Please select a currency when salary is provided.';

type JobDetailsRouteParams = { jobId?: string };

const JobCreateDetailsScreen = () => {
    const route = useRoute();
    const jobIdParam = (route.params as JobDetailsRouteParams | undefined)?.jobId;
    const dispatch = useAppDispatch();
    const hydratedFromJobIdRef = useRef<string | null>(null);
    const prevJobDetailsSaveLoading = useRef(false);

    const {
        generateDescriptionLoading,
        generatedJobDescription,
        loading: createJobLoading,
        error: createJobError,
        selectedJob,
        jobDetailLoading,
        jobDetailsSaveLoading,
    } = useAppSelector((state) => ({
        generateDescriptionLoading: state.jobs.generateDescriptionLoading,
        generatedJobDescription: state.jobs.generatedJobDescription,
        loading: state.jobs.loading,
        error: state.jobs.error,
        selectedJob: state.jobs.selectedJob,
        jobDetailLoading: state.jobs.jobDetailLoading,
        jobDetailsSaveLoading: state.jobs.jobDetailsSaveLoading,
    }));

    /** Only used to re-run navigation effect; read latest job via `store.getState()` inside the effect (avoids stale closure vs mount clear). */
    const createdJobWizardId = useAppSelector((state) => state.jobs.createdJobForWizard?.id);

    const [jobTitle, setJobTitle] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [extraSkillOptions, setExtraSkillOptions] = useState<{ id: string; name: string }[]>([]);
    const [location, setLocation] = useState('');
    const [locationDetail, setLocationDetail] =
        useState<LocationAutocompleteItem | null>(null);
    const [employmentId, setEmploymentId] = useState('full_time');
    const [expMinId, setExpMinId] = useState('0');
    const [expMaxId, setExpMaxId] = useState('1');
    const [closingDateIso, setClosingDateIso] = useState<string | null>(null);
    const [dateModalOpen, setDateModalOpen] = useState(false);
    /** Valid ISO currency codes only — never include '' or invalid codes (would create id `recent_` and break CommonDropdown labels). */
    const [recentCurrencies, setRecentCurrencies] = useState<string[]>([]);
    const [salaryCurrencyId, setSalaryCurrencyId] = useState('');
    const [salaryMinAmount, setSalaryMinAmount] = useState('');
    const [salaryMaxAmount, setSalaryMaxAmount] = useState('');
    const [description, setDescription] = useState('');
    const [resumeScreening, setResumeScreening] = useState(true);
    const [weights, setWeights] = useState<Record<WeightKey, number>>({
        experience: 30,
        skills: 30,
        projects: 20,
        education: 10,
        certification: 10,
    });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<JobFieldKey, string>>>({});

    useEffect(() => {
        hydratedFromJobIdRef.current = null;
    }, [jobIdParam]);

    useEffect(() => {
        dispatch(clearSelectedLocation());
        dispatch(clearCreatedJobForWizard());
        if (jobIdParam) {
            dispatch(getJobDetailRequestAction(jobIdParam));
        } else {
            dispatch(setSelectedJob(null));
        }
    }, [dispatch, jobIdParam]);

    useEffect(() => {
        if (!jobIdParam || !selectedJob || selectedJob.id !== jobIdParam) return;
        if (hydratedFromJobIdRef.current === selectedJob.id) return;
        hydratedFromJobIdRef.current = selectedJob.id;

        setJobTitle(selectedJob.title ?? '');
        const labels =
            selectedJob.must_have_skills?.map((s) => (s.label || s.value || '').trim()).filter(Boolean) ??
            [];
        setSkills(labels);
        const extras = labels
            .filter(
                (name) =>
                    !STATIC_SKILL_OPTIONS.some((o) => o.name.toLowerCase() === name.toLowerCase())
            )
            .map((name) => ({ id: `sk-loaded-${name}`, name }));
        setExtraSkillOptions(extras);

        setLocation(selectedJob.location ?? '');
        if (selectedJob.location_detail) {
            setLocationDetail(locationDetailToAutocomplete(selectedJob.location_detail));
        } else {
            setLocationDetail(null);
        }

        setEmploymentId(employmentApiValueToDropdownId(selectedJob.employment_type ?? ''));
        setExpMinId(String(selectedJob.min_experience ?? 0));
        setExpMaxId(String(selectedJob.max_experience ?? selectedJob.experience ?? 0));

        const close = selectedJob.close_date;
        if (close && typeof close === 'string') {
            setClosingDateIso(close.slice(0, 10));
        } else {
            setClosingDateIso(null);
        }

        setDescription(selectedJob.jd_html?.trim() ? selectedJob.jd_html : selectedJob.description ?? '');
        setResumeScreening(selectedJob.resume_screening_enabled !== false);

        setWeights(scoreWeightToUiWeights(selectedJob.score_weight));

        const cur = selectedJob.salary_currency?.trim();
        if (cur && CURRENCY_COUNTRIES[cur]) {
            setSalaryCurrencyId(cur);
            setRecentCurrencies((prev) => {
                const next = prev.filter((c) => c && c !== cur);
                return [cur, ...next].slice(0, 5);
            });
        } else {
            setSalaryCurrencyId('');
        }

        const minS = selectedJob.min_salary;
        const maxS = selectedJob.max_salary;
        const minNum =
            minS == null || minS === '' ? NaN : Math.round(Number.parseFloat(String(minS)));
        const maxNum =
            maxS == null || maxS === '' ? NaN : Math.round(Number.parseFloat(String(maxS)));
        setSalaryMinAmount(Number.isFinite(minNum) && minNum > 0 ? String(minNum) : '');
        setSalaryMaxAmount(Number.isFinite(maxNum) && maxNum > 0 ? String(maxNum) : '');
    }, [jobIdParam, selectedJob]);

    const weightSum = useMemo(
        () => WEIGHT_ORDER.reduce((acc, k) => acc + weights[k], 0),
        [weights]
    );

    const clearFieldError = useCallback((key: JobFieldKey) => {
        setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const validateJobFields = useCallback((): Partial<Record<JobFieldKey, string>> => {
        const next: Partial<Record<JobFieldKey, string>> = {};
        if (!jobTitle.trim()) {
            next.jobTitle = 'Job title is required';
        }
        if (skills.length === 0) {
            next.skills = 'At least one skill is required';
        }
        if (!location.trim()) {
            next.location = 'Location is required';
        } else if (!locationDetail?.id) {
            next.location = 'Select or confirm a verified location';
        }
        const minY = Number.parseInt(expMinId, 10);
        const maxY = Number.parseInt(expMaxId, 10);
        if (
            Number.isFinite(minY) &&
            Number.isFinite(maxY) &&
            maxY <= minY
        ) {
            next.experience = 'Maximum experience must be greater than minimum experience';
        }
        if (!closingDateIso) {
            next.closingDate = 'Close date is required';
        } else if (closingDateIso < dayjs().format('YYYY-MM-DD')) {
            next.closingDate = 'Close date cannot be in the past';
        }
        if (richTextLooksEmpty(description)) {
            next.description = 'Job description is required';
        }
        if (weightSum !== 100) {
            next.weights = 'Weights should add up to 100%';
        }

        const minSalStr = salaryMinAmount.replace(/\D/g, '').trim();
        const maxSalStr = salaryMaxAmount.replace(/\D/g, '').trim();
        const hasMin = minSalStr.length > 0;
        const hasMax = maxSalStr.length > 0;

        let salaryMessage: string | undefined;
        let hasCompleteValidSalaryPair = false;

        if (!hasMin && !hasMax) {
            // Salary is optional — no validation.
        } else if (hasMin !== hasMax) {
            salaryMessage = SALARY_PAIR_INCOMPLETE;
        } else {
            const minSal = Number.parseInt(minSalStr, 10);
            const maxSal = Number.parseInt(maxSalStr, 10);
            if (
                !Number.isFinite(minSal) ||
                !Number.isFinite(maxSal) ||
                minSal <= 0 ||
                maxSal <= 0 ||
                maxSal <= minSal
            ) {
                salaryMessage = SALARY_PAIR_INVALID;
            } else {
                hasCompleteValidSalaryPair = true;
            }
        }
        if (salaryMessage) {
            next.salary = salaryMessage;
        }

        if (
            hasCompleteValidSalaryPair &&
            (!salaryCurrencyId || !CURRENCY_COUNTRIES[salaryCurrencyId])
        ) {
            next.currency = CURRENCY_REQUIRED_ERROR;
        }

        return next;
    }, [
        jobTitle,
        skills.length,
        location,
        locationDetail?.id,
        expMinId,
        expMaxId,
        closingDateIso,
        description,
        weightSum,
        salaryMinAmount,
        salaryMaxAmount,
        salaryCurrencyId,
    ]);

    const buildCreateJobPayload = useCallback((): CreateJobRequest => {
        const plainDesc = htmlToPlainDescription(description);

        const minY = parseInt(expMinId, 10);
        const maxY = parseInt(expMaxId, 10);
        const minSal = parseInt(salaryMinAmount || '0', 10);
        const maxSal = parseInt(salaryMaxAmount || '0', 10);

        const payload: CreateJobRequest = {
            title: jobTitle.trim(),
            description: plainDesc,
            jd_html: description,
            location: location.trim(),
            location_id: locationDetail?.id ?? undefined,
            employment_type:
                EMPLOYMENT_API_BY_ID[employmentId] ??
                EMPLOYMENT_OPTIONS.find((e) => e.id === employmentId)?.name ??
                'Full Time',
            min_experience: minY,
            max_experience: maxY,
            experience: maxY,
            must_have_skills: skills.map((s) => ({ label: s, value: s })),
            close_date: closingDateIso ?? undefined,
            published: false,
            resume_screening_enabled: resumeScreening,
            score_weight: {
                skills: weights.skills / 100,
                work_experience: weights.experience / 100,
                projects: weights.projects / 100,
                education: weights.education / 100,
                certifications: weights.certification / 100,
            },
        };
        if (minSal > 0) {
            payload.min_salary = minSal;
        }

        if (maxSal > 0) {
            payload.max_salary = maxSal;
        }
        if (salaryCurrencyId && CURRENCY_COUNTRIES[salaryCurrencyId]) {
            payload.salary_currency = salaryCurrencyId;
        }

        return payload;
    }, [
        description,
        jobTitle,
        location,
        locationDetail?.id,
        employmentId,
        expMinId,
        expMaxId,
        skills,
        closingDateIso,
        resumeScreening,
        salaryCurrencyId,
        salaryMinAmount,
        salaryMaxAmount,
        weights,
    ]);

    const buildPatchJobRequest = useCallback((): PatchJobDetailsRequest | null => {
        if (!jobIdParam) return null;
        const body = buildCreateJobPayload();
        return {
            ...body,
            jobId: jobIdParam,
            published:
                selectedJob?.id === jobIdParam ? Boolean(selectedJob.published) : Boolean(body.published),
        };
    }, [jobIdParam, buildCreateJobPayload, selectedJob?.id, selectedJob?.published]);

    const onNextPress = useCallback(() => {
        const next = validateJobFields();
        const keys = Object.keys(next) as JobFieldKey[];
        setFieldErrors(next);
        if (keys.length === 0) {
            dispatch(clearError());
            if (jobIdParam) {
                const patchPayload = buildPatchJobRequest();
                if (patchPayload) {
                    dispatch(patchJobDetailsRequestAction(patchPayload));
                }
                return;
            }
            dispatch(createJobRequestAction(buildCreateJobPayload()));
        }
    }, [validateJobFields, dispatch, buildCreateJobPayload, buildPatchJobRequest, jobIdParam]);

    useEffect(() => {
        if (
            prevJobDetailsSaveLoading.current &&
            !jobDetailsSaveLoading &&
            jobIdParam
        ) {
            if (!store.getState().jobs.error) {
                navigate('ApplicationForm', {
                    jobId: jobIdParam,
                    locationDisplay: location.trim(),
                    locationDetail,
                });
            }
        }
        prevJobDetailsSaveLoading.current = jobDetailsSaveLoading;
    }, [jobDetailsSaveLoading, jobIdParam, location, locationDetail]);

    useEffect(() => {
        const wizardJob = store.getState().jobs.createdJobForWizard;
        if (!wizardJob?.id) return;
        navigate('ApplicationForm', {
            jobId: wizardJob.id,
            locationDisplay: location.trim(),
            locationDetail,
        });
        dispatch(clearCreatedJobForWizard());
    }, [createdJobWizardId, dispatch, location, locationDetail]);

    const gaugeSegmentPaths = useMemo(() => buildGaugeDonutPaths(weights), [weights]);
    const onWeightChange = useCallback((key: WeightKey, val: number) => {
        setWeights((w) => ({ ...w, [key]: val }));
        clearFieldError('weights');
    }, [clearFieldError]);

    const allSkillOptions = useMemo(
        () => [...STATIC_SKILL_OPTIONS, ...extraSkillOptions],
        [extraSkillOptions]
    );

    const appendSkill = useCallback(
        (raw: string) => {
            const trimmed = raw.trim();
            if (!trimmed) return;

            const fromPool =
                STATIC_SKILL_OPTIONS.find((o) => o.name.toLowerCase() === trimmed.toLowerCase()) ??
                extraSkillOptions.find((o) => o.name.toLowerCase() === trimmed.toLowerCase());
            const nameToAdd = fromPool?.name ?? trimmed;

            setSkills((prev) => {
                if (prev.some((s) => s.toLowerCase() === nameToAdd.toLowerCase())) {
                    return prev;
                }
                return [...prev, nameToAdd];
            });

            if (
                !fromPool &&
                !STATIC_SKILL_OPTIONS.some((o) => o.name.toLowerCase() === nameToAdd.toLowerCase())
            ) {
                setExtraSkillOptions((extras) =>
                    extras.some((e) => e.name.toLowerCase() === nameToAdd.toLowerCase())
                        ? extras
                        : [...extras, { id: `sk-custom-${Date.now()}`, name: nameToAdd }]
                );
            }
        },
        [extraSkillOptions]
    );

    const removeSkillAt = useCallback((index: number) => {
        setSkills((prev) => {
            const removed = prev[index];
            const next = prev.filter((_, i) => i !== index);
            if (removed) {
                setExtraSkillOptions((extras) =>
                    extras.filter((e) => e.name.toLowerCase() !== removed.toLowerCase())
                );
            }
            return next;
        });
    }, []);

    const calendarStart = useMemo(
        () => <SvgXml xml={calenderIcon} width={20} height={20} />,
        []
    );

    /** Closing date: only today and future (calendar + apply guard). */
    const closingDateMinIso = useMemo(
        () => dayjs().format('YYYY-MM-DD'),
        [dateModalOpen]
    );

    const onGenerate = useCallback(() => {
        if (!jobTitle) return;
        const promptText = description.replace(/<[^>]+>/g, ' ').trim();
        dispatch(
            generateJobDescriptionRequestAction({
                job_title: jobTitle,
                employment_type:
                    EMPLOYMENT_OPTIONS.find((e) => e.id === employmentId)?.name || 'Full Time',
                min_experience: parseInt(expMinId, 10) || 0,
                max_experience: parseInt(expMaxId, 10) || 1,
                must_have_skills: skills,
                user_prompt: promptText,
            })
        );
    }, [jobTitle, description, employmentId, expMinId, expMaxId, skills, dispatch]);

    useEffect(() => {
        if (!generatedJobDescription) return;
        const res = generatedJobDescription;
        if (res.job_desc_html) {
            setDescription(res.job_desc_html);
            clearFieldError('description');
        }
        if (res.must_have_skills?.length) {
            res.must_have_skills.forEach((skill) => {
                const label = skill.label || skill.value;
                if (label) appendSkill(label);
            });
            clearFieldError('skills');
        }
        dispatch(clearGeneratedJobDescription());
    }, [generatedJobDescription, dispatch, appendSkill, clearFieldError]);

    const currencyDropdownOptions = useMemo(() => {
        const options: any[] = [];
        const addedCodes = new Set<string>();

        const buildOption = (code: string, prefix: string) => ({
            id: `${prefix}_${code}`,
            realId: code,
            name: `${code} ${CURRENCY_SYMBOLS[code] ? `(${CURRENCY_SYMBOLS[code]})` : ''}`,
            countryCode: CURRENCY_COUNTRIES[code],
            searchLabel: code // ensure it matches the search by code
        });

        const validRecent = recentCurrencies.filter(
            (c) => c && CURRENCY_COUNTRIES[c]
        );
        if (validRecent.length > 0) {
            options.push({
                id: 'header-recent',
                name: 'RECENT CURRENCY',
                isHeader: true,
                searchLabel: `RECENT CURRENCY ${validRecent.join(' ')}`
            });
            validRecent.forEach((code) => {
                options.push(buildOption(code, 'recent'));
                addedCodes.add(code);
            });
        }

        const popularToAdd = POPULAR_CURRENCIES.filter(code => !addedCodes.has(code));
        if (popularToAdd.length > 0) {
            options.push({
                id: 'header-popular',
                name: 'POPULAR CURRENCY',
                isHeader: true,
                searchLabel: `POPULAR CURRENCY ${popularToAdd.join(' ')}`
            });
            popularToAdd.forEach(code => {
                options.push(buildOption(code, 'popular'));
                addedCodes.add(code);
            });
        }

        const allToAdd = Object.keys(CURRENCY_COUNTRIES).filter(code => !addedCodes.has(code));
        if (allToAdd.length > 0) {
            options.push({
                id: 'header-all',
                name: 'ALL CURRENCY',
                isHeader: true,
                searchLabel: `ALL CURRENCY ${allToAdd.join(' ')}`
            });
            allToAdd.forEach(code => {
                options.push(buildOption(code, 'all'));
                addedCodes.add(code);
            });
        }

        return options;
    }, [recentCurrencies]);

    const handleCurrencySelect = useCallback(
        (codeRaw: string) => {
            const code = codeRaw.replace(/^(recent_|popular_|all_)/, '');
            if (!code || !CURRENCY_COUNTRIES[code]) return;
            setSalaryCurrencyId(code);
            setRecentCurrencies((prev) => {
                const next = prev.filter((c) => c && c !== code);
                return [code, ...next].slice(0, 5);
            });
            clearFieldError('currency');
        },
        [clearFieldError]
    );

    /** No value when nothing selected so the field shows the placeholder (avoids matching a bogus `recent_` option). */
    const activeCurrencyValueId = useMemo(() => {
        if (!salaryCurrencyId || !CURRENCY_COUNTRIES[salaryCurrencyId]) {
            return undefined;
        }
        if (recentCurrencies.includes(salaryCurrencyId)) return `recent_${salaryCurrencyId}`;
        if (POPULAR_CURRENCIES.includes(salaryCurrencyId)) return `popular_${salaryCurrencyId}`;
        return `all_${salaryCurrencyId}`;
    }, [salaryCurrencyId, recentCurrencies]);

    const formatSalaryNumber = (numStr: string) => {
        const parsed = parseInt(numStr.replace(/\D/g, ''), 10);
        if (isNaN(parsed)) return '';
        return new Intl.NumberFormat('en-US').format(parsed);
    };
    const minFormatted = formatSalaryNumber(salaryMinAmount);
    const maxFormatted = formatSalaryNumber(salaryMaxAmount);
    let salaryPreview = '';
    if (minFormatted && maxFormatted) {
        salaryPreview = `${salaryCurrencyId} ${minFormatted} - ${maxFormatted}`;
    } else if (minFormatted) {
        salaryPreview = `${salaryCurrencyId} ${minFormatted}`;
    } else if (maxFormatted) {
        salaryPreview = `${salaryCurrencyId} 0 - ${maxFormatted}`;
    }

    return (
        <CustomSafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={[styles.flex, styles.kbRelative]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Header
                    title="Job Details"
                    backNavigation
                    centerTitle
                    onBack={goBack}
                    rightComponent={
                        <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                            1/3
                        </Typography>
                    }
                />
                <ProgressBar
                    progress={1 / 3}
                    color={colors.brand[500]}
                    style={styles.progress}
                />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <TextField
                        lable="Job title"
                        isRequired
                        placeholder="Write your job title"
                        value={jobTitle}
                        onChangeText={(t) => {
                            setJobTitle(t);
                            clearFieldError('jobTitle');
                        }}
                        size="Medium"
                        isError={!!fieldErrors.jobTitle}
                        error={fieldErrors.jobTitle}
                    />

                    <View style={styles.block}>
                        <Typography
                            variant="semiBoldTxtsm"
                            color={colors.gray[800]}
                            style={styles.labelSpacing}
                        >
                            Required skills
                            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>
                        <SkillTagComposer
                            skills={skills}
                            options={allSkillOptions}
                            onAppendSkill={(raw) => {
                                appendSkill(raw);
                                clearFieldError('skills');
                            }}
                            onRemoveSkillAt={removeSkillAt}
                            placeholder="Add tags…"
                            error={fieldErrors.skills}
                        />
                    </View>

                    <View style={styles.locationFieldBlock}>
                        <LocationAutocompleteField
                            lable="Location"
                            isRequired
                            placeholder="Search location"
                            value={location}
                            onChangeText={(t) => {
                                setLocation(t);
                                setLocationDetail(null);
                                clearFieldError('location');
                            }}
                            onSelectLocation={(item: LocationAutocompleteItem | null) => {
                                setLocationDetail(item);
                                clearFieldError('location');
                            }}
                            startIcon={
                                <Icon
                                    size={20}
                                    name="location"
                                    iconFamily="Octicons"
                                    color={colors.gray[400]}
                                />
                            }
                            size="Medium"
                            isError={!!fieldErrors.location}
                            error={fieldErrors.location}
                        />
                    </View>

                    <View style={styles.block}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.labelSpacing}>
                            Employment Type
                            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>
                        <CommonDropdown
                            placeholder="Select type"
                            options={EMPLOYMENT_OPTIONS}
                            value={employmentId}
                            onChange={(v) => setEmploymentId(String(v))}
                        />
                    </View>

                    <View style={styles.block}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.labelSpacing}>
                            Experience
                            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>
                        <View style={styles.row2}>
                            <View style={styles.half}>
                                <CommonDropdown
                                    placeholder="Years"
                                    options={YEAR_OPTIONS}
                                    value={expMinId}
                                    onChange={(v) => {
                                        setExpMinId(String(v));
                                        clearFieldError('experience');
                                    }}
                                    highlightError={!!fieldErrors.experience}
                                />
                            </View>
                            <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.dash}>
                                —
                            </Typography>
                            <View style={styles.half}>
                                <CommonDropdown
                                    placeholder="Years"
                                    options={YEAR_OPTIONS}
                                    value={expMaxId}
                                    onChange={(v) => {
                                        setExpMaxId(String(v));
                                        clearFieldError('experience');
                                    }}
                                    highlightError={!!fieldErrors.experience}
                                />
                            </View>
                        </View>
                        {fieldErrors.experience ? (
                            <Typography variant="regularTxtsm" color={colors.error[500]} style={styles.fieldErrorText}>
                                {fieldErrors.experience}
                            </Typography>
                        ) : null}
                    </View>

                    <View style={styles.block}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.labelSpacing}>
                            Closing date
                            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>
                        <Pressable
                            onPress={() => setDateModalOpen(true)}
                            style={({ pressed }) => [
                                styles.dateField,
                                fieldErrors.closingDate ? styles.dateFieldError : null,
                                pressed && { opacity: 0.85 },
                            ]}
                        >
                            {calendarStart}
                            <Typography
                                variant="regularTxtsm"
                                color={closingDateIso ? colors.gray[900] : colors.gray[500]}
                                style={styles.dateFieldText}
                            >
                                {closingDateIso ? formatClosingDate(closingDateIso) : 'Select date'}
                            </Typography>
                        </Pressable>
                        {fieldErrors.closingDate ? (
                            <Typography variant="regularTxtsm" color={colors.error[500]} style={styles.fieldErrorText}>
                                {fieldErrors.closingDate}
                            </Typography>
                        ) : null}
                    </View>
                    <View style={styles.block}>
                        <View style={{ flexDirection: 'row' }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                                Description
                                <Typography variant="semiBoldTxtsm" color={colors.gray[500]}>
                                    (Or write a prompt to generate)
                                </Typography>
                                <Typography variant="semiBoldTxtsm" color={colors.error[500]}>
                                    {''}  * {''}
                                </Typography>
                            </Typography>
                        </View>
                        <RichTextField
                            value={description}
                            onChange={(html) => {
                                setDescription(html);
                                clearFieldError('description');
                            }}
                            height={220}
                            toolbarAtBottom
                            placeholder="Enter job description..."
                            error={fieldErrors.description}
                        />
                        <TagList
                            data={['Keep it concise and action oriented', 'Emphasize ownership, impact, and growth.', 'Highlight remote-friendly culture and async work.']}
                            bgColor={colors.brand[50]}
                            borderColor={colors.brand[200]}
                            textColor={colors.brand[700]}
                            onSelect={(item) => {
                                const currentText = description.replace(/<[^>]+>/g, '').trim();
                                if (currentText) {
                                    setDescription(description + `<p>${item}</p>`);
                                } else {
                                    setDescription(`<p>${item}</p>`);
                                }
                                clearFieldError('description');
                            }}
                        />
                        <Button
                            startIcon={<SvgXml xml={sparkles.replace(/fill="[^"]*"/g, `fill="${colors.base.white}"`)} color={colors.base.white} fill={colors.base.white} />}
                            disabled={!jobTitle || generateDescriptionLoading}
                            isLoading={generateDescriptionLoading}
                            onPress={onGenerate}
                        >
                            Generate
                        </Button>
                    </View>
                    <Divider />
                    <Card style={styles.compensationCard}>
                        <View>
                            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                                Compensation
                            </Typography>
                        </View>
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]} >
                                Salary Currency
                            </Typography>
                            <View style={styles.currencyDropdownRow}>
                                {/* <Ionicons
                                    name="search-outline"
                                    size={20}
                                    color={colors.gray[500]}
                                    style={styles.currencySearchIcon}
                                /> */}
                                <View style={styles.currencyDropdownFlex}>
                                    <CommonDropdown
                                        placeholder="Select currency..."
                                        options={currencyDropdownOptions}
                                        value={activeCurrencyValueId as string | undefined}
                                        onChange={(v) => handleCurrencySelect(String(v))}
                                        labelKey="name"
                                        valueKey="id"
                                        searchable
                                        searchPlaceholder="Search currency..."
                                        searchField="label"
                                        mode="default"
                                        dropdownPosition="bottom"
                                        highlightError={!!fieldErrors.currency}
                                        containerStyle={styles.currencyDropdownInner}
                                        renderLeftIcon={(item) => {
                                            if (item.isHeader || !item.countryCode) return null;
                                            return (
                                                <View style={{ width: 24, height: 18, borderRadius: 2, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
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
                             <Typography variant="regularTxtsm" color={colors.error[500]}>{fieldErrors.currency}</Typography>
                        </View>
                        <View style={{ gap: 10 }}>
                            <Typography
                                variant="semiBoldTxtxs"
                            >
                                QUICK CURRENCY PICKS
                            </Typography>
                            <TagList
                                data={POPULAR_CURRENCIES}
                                renderIcon={(code) => (
                                    <View style={{ width: 20, height: 15, borderRadius: 2, overflow: 'hidden', backgroundColor: '#f0f0f0', marginRight: 4 }}>
                                        <SvgUri
                                            width="100%"
                                            height="100%"
                                            uri={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${CURRENCY_COUNTRIES[code]}.svg`}
                                        />
                                    </View>
                                )}
                                onSelect={(item) => handleCurrencySelect(String(item))}
                                selectedItem={salaryCurrencyId || undefined}
                                textColor={colors.gray[700]}
                                bgColor={colors.gray[25]}
                                borderColor={colors.gray[200]}
                                selectedColor={{
                                    text: colors.brand[700],
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                }}
                            />
                        </View>

                        <View style={styles.compensationAmountRow}>
                            <View style={styles.half}>
                                <TextField
                                    lable={'Minimum Salary'}
                                    placeholder="e.g., 50000"
                                    value={salaryMinAmount}
                                    onChangeText={(text) => {
                                        const onlyNumbers = text.replace(/[^0-9]/g, '');
                                        setSalaryMinAmount(onlyNumbers);
                                        clearFieldError('salary');
                                        clearFieldError('currency');
                                    }}
                                    keyboardType="number-pad"
                                    size="Medium"
                                    isError={!!fieldErrors.salary}
                                />
                            </View>
                            <View style={styles.half}>
                                <TextField
                                    lable={'Maximum Salary'}
                                    placeholder="e.g., 80000"
                                    value={salaryMaxAmount}
                                    onChangeText={(text) => {
                                        const onlyNumbers = text.replace(/[^0-9]/g, '');
                                        setSalaryMaxAmount(onlyNumbers);
                                        clearFieldError('salary');
                                        clearFieldError('currency');
                                    }}
                                    keyboardType="number-pad"
                                    size="Medium"
                                    isError={!!fieldErrors.salary}
                                />
                            </View>
                        </View>
                        {fieldErrors.salary ? (
                            <Typography variant="regularTxtsm" color={colors.error[500]} style={styles.fieldErrorText}>
                                {fieldErrors.salary}
                            </Typography>
                        ) : null}
                        {(minFormatted || maxFormatted) ? (
                            <View style={{ marginTop: 4, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.brand[50], borderRadius: 8, borderWidth: 1, borderColor: colors.brand[200] }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                    Salary preview: <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>{salaryPreview}</Typography>
                                </Typography>
                            </View>
                        ) : null}
                    </Card>
                    <Card style={styles.scoreCard}>
                        <View style={styles.scoreHeader}>
                            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                                Score widget
                            </Typography>
                            <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="About score widget">
                                <Ionicons name="help-circle-outline" size={22} color={colors.gray[400]} />
                            </Pressable>
                        </View>

                        <View style={styles.gaugeWrap}>
                            <View style={styles.gaugeSvgClip}>
                                <Svg
                                    width={GAUGE_DISPLAY_WIDTH}
                                    height={GAUGE_DISPLAY_HEIGHT}
                                    viewBox={`${GAUGE_VIEWBOX_MIN_X} ${GAUGE_VIEWBOX_MIN_Y} ${GAUGE_VIEWBOX_REC_W} ${GAUGE_VIEWBOX_REC_H}`}
                                >
                                    <Path d={GAUGE_BACKGROUND_D} fill={GAUGE_TRACK_FILL} />
                                    {gaugeSegmentPaths.map(({ key, d }) => (
                                        <Path key={key} d={d} fill={WEIGHT_COLORS[key]} />
                                    ))}
                                </Svg>
                            </View>
                            <View style={styles.gaugeCenter} pointerEvents="none">
                                <Typography variant="semiBoldDxs" color={colors.gray[900]}>
                                    {Math.round(weightSum)}%
                                </Typography>
                                <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.gaugeTotal}>
                                    Total
                                </Typography>
                            </View>
                        </View>

                        <View style={styles.legendBox}>
                            {LEGEND_ROWS.map((row, ri) => (
                                <View key={`lr-${ri}`} style={styles.legendRowInner}>
                                    {row.map((key) => (
                                        <View key={key} style={styles.legendItem}>
                                            <View style={[styles.legendSwatch, { backgroundColor: WEIGHT_COLORS[key] }]} />
                                            <Typography variant="regularTxtsm" color={colors.gray[600]} numberOfLines={1}>
                                                {WEIGHT_LABELS[key]}
                                            </Typography>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>

                        <View style={styles.stepperSection}>
                            {STEPPER_GRID.map((row, ri) => (
                                <View
                                    key={`sg-${ri}`}
                                    style={row.length === 1 ? styles.stepperRowSingle : styles.stepperRowPair}
                                >
                                    {row.map((key) => (
                                        <View key={key} style={row.length === 1 ? styles.stepperCellFull : styles.stepperCellHalf}>
                                            <Typography variant="mediumTxtsm" color={colors.gray[800]} style={styles.stepperFieldLabel}>
                                                {WEIGHT_LABELS[key]}
                                            </Typography>
                                            <NumberStepper
                                                value={weights[key]}
                                                onChange={(v) => onWeightChange(key, v)}
                                                min={0}
                                                max={100}
                                                step={10}
                                                unitLabel="%"
                                                padLength={1}
                                                editable
                                            />
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {fieldErrors.weights ? (
                            <Typography variant="regularTxtxs" color={colors.error[500]} style={styles.hintErr}>
                                {fieldErrors.weights}
                            </Typography>
                        ) : weightSum !== 100 ? (
                            <Typography variant="regularTxtxs" color={colors.error[500]} style={styles.hintErr}>
                                Weights should add up to 100% (currently {weightSum}%)
                            </Typography>
                        ) : null}
                    </Card>

                    <Card style={styles.resumeCard}>
                        <View style={styles.resumeRow}>
                            <CustomSwitch
                                value={resumeScreening}
                                onValueChange={setResumeScreening}
                                backgroundActive={colors.brand[600]}
                            />
                            <View style={styles.resumeCopy}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                    Resume screening
                                </Typography>
                                <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.resumeSub}>
                                    When enabled, resumes will be automatically parsed and screened for this job.
                                </Typography>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
                <View style={{ paddingHorizontal: 16, gap: 8 }}>
                    {createJobError ? (
                        <Typography variant="regularTxtsm" color={colors.error[500]}>
                            {createJobError}
                        </Typography>
                    ) : null}
                    <Button
                        size={48}
                        buttonColor={colors.brand[600]}
                        textColor={colors.base.white}
                        borderRadius={10}
                        onPress={onNextPress}
                        disabled={
                            createJobLoading ||
                            jobDetailsSaveLoading ||
                            (jobDetailLoading && !!jobIdParam)
                        }
                        isLoading={jobIdParam ? jobDetailsSaveLoading : createJobLoading}
                    >
                        {jobIdParam ? 'Save & Continue' : 'Next'}
                    </Button>
                </View>

                <Modal visible={dateModalOpen} transparent animationType="fade">
                    <Pressable style={styles.modalBackdrop} onPress={() => setDateModalOpen(false)}>
                        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]} style={styles.modalTitle}>
                                Closing date
                            </Typography>
                            <DateRangePicker
                                mode="single"
                                hidePresets
                                minDate={closingDateMinIso}
                                initialValue={closingDateIso ? { start: closingDateIso } : undefined}
                                onClose={() => setDateModalOpen(false)}
                                onApply={(range) => {
                                    const picked = range.start ?? range.end;
                                    if (picked && String(picked).trim() !== '') {
                                        const iso = String(picked).slice(0, 10);
                                        if (iso >= closingDateMinIso) {
                                            setClosingDateIso(iso);
                                            clearFieldError('closingDate');
                                        }
                                    }
                                    setDateModalOpen(false);
                                }}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>

                {jobDetailLoading && jobIdParam ? (
                    <View style={[StyleSheet.absoluteFillObject, styles.jobDetailLoadingOverlay]}>
                        <ActivityIndicator size="large" color={colors.brand[600]} />
                    </View>
                ) : null}
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
};

export default JobCreateDetailsScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    kbRelative: {
        position: 'relative',
    },
    jobDetailLoadingOverlay: {
        backgroundColor: 'rgba(255,255,255,0.78)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
    progress: {
        height: 4,
        backgroundColor: colors.gray[100],
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    block: {
        gap: 6,
    },
    locationFieldBlock: {
        zIndex: 10,
        elevation: 4,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    labelSpacing: {
        marginBottom: 4,
    },
    tagWrap: {
        marginTop: 4,
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    half: {
        flex: 1,
        minWidth: 0,
    },
    dash: {
        marginBottom: 4,
    },
    dateField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[300],
        backgroundColor: colors.base.white,
        ...shadowStyles.shadow_xs
    },
    dateFieldText: {
        flex: 1,
    },
    dateFieldError: {
        borderColor: colors.error[500],
    },
    fieldErrorText: {
        //marginTop: 4,
    },
    compensationCard: {
        padding: 16,
        gap: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    compensationHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    compensationIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: colors.brand[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    compensationIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.brand[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
    compensationTitleBlock: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    compensationSubtitle: {
        lineHeight: 20,
    },
    compensationLabel: {
        marginTop: 4,
    },
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
    currencySearchIcon: {
        marginLeft: 12,
        marginRight: 4,
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
    compensationHint: {
        marginTop: 2,
    },
    quickPicksHeading: {
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    quickFlag: {
        fontSize: 14,
        //lineHeight: 18,
    },
    compensationAmountRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    salaryAmountLabel: {
        marginBottom: 8,
    },
    jobDescCard: {
        padding: 16,
        gap: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    jobDescHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    jobDescIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: colors.brand[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    jobDescTitleBlock: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    jobDescSubtitle: {
        lineHeight: 20,
    },
    jobDescLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    scoreCard: {
        padding: 16,
        gap: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gaugeWrap: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: GAUGE_DISPLAY_WIDTH,
        height: GAUGE_DISPLAY_HEIGHT,
        alignSelf: 'center',
        marginTop: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    gaugeSvgClip: {
        width: GAUGE_DISPLAY_WIDTH,
        height: GAUGE_DISPLAY_HEIGHT,
    },
    gaugeCenter: {
        position: 'absolute',
        left: 5,
        right: 0,
        top: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    gaugeTotal: {
        marginTop: -2,
        marginRight: 10
    },
    legendBox: {
        backgroundColor: colors.gray[50],
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray[50],
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
        //alignSelf:'center'
    },
    legendRowInner: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        //justifyContent: 'space-around',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        justifyContent: 'space-between'
        //maxWidth: '32%',
        //minWidth: '28%',
    },
    legendSwatch: {
        width: 12,
        height: 12,
        borderRadius: 4,
    },
    stepperSection: {
        gap: 14,
        marginTop: 4,
    },
    stepperRowPair: {
        flexDirection: 'row',
        gap: 12,
    },
    stepperRowSingle: {
        flexDirection: 'row',
    },
    stepperCellHalf: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    stepperCellFull: {
        flex: 1,
        gap: 6,
    },
    stepperFieldLabel: {
        // marginBottom: 2,
    },
    hintErr: {
        marginTop: 4,
    },
    resumeCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    resumeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    resumeCopy: {
        flex: 1,
    },
    resumeSub: {
        marginTop: 4,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: colors.base.white,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    modalTitle: {
        marginBottom: 4,
    },
});

