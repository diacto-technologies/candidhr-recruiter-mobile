import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Svg, { Path, SvgXml } from 'react-native-svg';
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
import { useAppDispatch } from '../../../../store/hooks';
import Divider from '../../../../components/atoms/divider';
import React from 'react';
import dayjs from 'dayjs';

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

/** Salary currency — searchable dropdown + quick picks stay in sync via `salaryCurrencyId`. */
const CURRENCY_OPTIONS = [
    { id: 'USD', name: 'USD — US Dollar' },
    { id: 'EUR', name: 'EUR — Euro' },
    { id: 'GBP', name: 'GBP — British Pound' },
    { id: 'INR', name: 'INR — Indian Rupee' },
    { id: 'CAD', name: 'CAD — Canadian Dollar' },
    { id: 'AUD', name: 'AUD — Australian Dollar' },
    { id: 'SGD', name: 'SGD — Singapore Dollar' },
    { id: 'AED', name: 'AED — UAE Dirham' },
    { id: 'JPY', name: 'JPY — Japanese Yen' },
    { id: 'CNY', name: 'CNY — Chinese Yuan' },
    { id: 'CHF', name: 'CHF — Swiss Franc' },
    { id: 'SEK', name: 'SEK — Swedish Krona' },
    { id: 'NZD', name: 'NZD — New Zealand Dollar' },
    { id: 'HKD', name: 'HKD — Hong Kong Dollar' },
    { id: 'ZAR', name: 'ZAR — South African Rand' },
];

const QUICK_CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'SGD', 'AED', 'JPY', 'CNY'];

const QUICK_CURRENCY_FLAGS: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    INR: '🇮🇳',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    SGD: '🇸🇬',
    AED: '🇦🇪',
    JPY: '🇯🇵',
    CNY: '🇨🇳',
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
    | 'description';

function richTextLooksEmpty(html: string) {
    const t = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return t.length === 0;
}

const JobCreateDetailsScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearSelectedLocation());
    }, [dispatch]);
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
    const [salaryCurrencyId, setSalaryCurrencyId] = useState('USD');
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
        return next;
    }, [jobTitle, skills.length, location, locationDetail?.id, expMinId, expMaxId, closingDateIso, description]);

    const onNextPress = useCallback(() => {
        const next = validateJobFields();
        const keys = Object.keys(next) as JobFieldKey[];
        setFieldErrors(next);
        if (keys.length === 0) {
            navigate('ApplicationForm', {
                locationDisplay: location.trim(),
                locationDetail,
            });
        }
    }, [validateJobFields, location, locationDetail]);

    const weightSum = useMemo(
        () => WEIGHT_ORDER.reduce((acc, k) => acc + weights[k], 0),
        [weights]
    );

    const gaugeSegmentPaths = useMemo(() => buildGaugeDonutPaths(weights), [weights]);

    const onWeightChange = useCallback((key: WeightKey, val: number) => {
        setWeights((w) => ({ ...w, [key]: val }));
    }, []);

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

    return (
        <CustomSafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
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
                        <TagList data={['Keep it concise and action oriented', 'Emphasize ownership, impact, and growth.', 'Highlight remote-friendly culture and async work.']} bgColor={colors.brand[50]} borderColor={colors.brand[200]} textColor={colors.brand[700]} />
                        <Button startIcon={<SvgXml xml={sparkles.replace(/fill="[^"]*"/g, `fill="${colors.base.white}"`)} color={colors.base.white} fill={colors.base.white}/>} disabled={!jobTitle} >Genarate</Button>
                    </View>
                    <Divider/>
                    <Card style={styles.compensationCard}>
                        <View>
                            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                                Compensation
                            </Typography>
                        </View>
                        <View style={{gap:6}}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]} >
                                Salary Currency
                            </Typography>
                            <View style={styles.currencyDropdownRow}>
                                <Ionicons
                                    name="search-outline"
                                    size={20}
                                    color={colors.gray[500]}
                                    style={styles.currencySearchIcon}
                                />
                                <View style={styles.currencyDropdownFlex}>
                                    <CommonDropdown
                                        placeholder="Select currency..."
                                        options={CURRENCY_OPTIONS}
                                        value={salaryCurrencyId}
                                        onChange={(v) => setSalaryCurrencyId(String(v))}
                                        labelKey="name"
                                        valueKey="id"
                                        searchable
                                        searchPlaceholder="Search currency..."
                                        searchField="label"
                                        mode="default"
                                        dropdownPosition="bottom"
                                        containerStyle={styles.currencyDropdownInner}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ gap:10}}>
                            <Typography
                                variant="semiBoldTxtxs"
                            >
                                QUICK CURRENCY PICKS
                            </Typography>
                            <TagList
                                data={QUICK_CURRENCY_CODES}
                                renderIcon={(code) => (
                                    <Typography variant="regularTxtxs" style={styles.quickFlag}>
                                        {QUICK_CURRENCY_FLAGS[code]}
                                    </Typography>
                                )}
                                onSelect={(item) => setSalaryCurrencyId(String(item))}
                                selectedItem={salaryCurrencyId}
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
                                    onChangeText={setSalaryMinAmount}
                                    keyboardType="number-pad"
                                    size="Medium"
                                />
                            </View>
                            <View style={styles.half}>
                                <TextField
                                    lable={'Maximum Salary'}
                                    placeholder="e.g., 80000"
                                    value={salaryMaxAmount}
                                    onChangeText={setSalaryMaxAmount}
                                    keyboardType="number-pad"
                                    size="Medium"
                                />
                            </View>
                        </View>
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
                                                step={5}
                                                unitLabel="%"
                                                padLength={1}
                                                editable
                                            />
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {weightSum !== 100 ? (
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
                <View style={{ paddingHorizontal: 16 }}>
                    <Button
                        size={48}
                        buttonColor={colors.brand[600]}
                        textColor={colors.base.white}
                        borderRadius={10}
                        onPress={onNextPress}
                    >
                        Next
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
        marginTop: 4,
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
        marginRight:10
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
        alignSelf:'center',
        //justifyContent: 'space-around',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        justifyContent:'space-between'
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
