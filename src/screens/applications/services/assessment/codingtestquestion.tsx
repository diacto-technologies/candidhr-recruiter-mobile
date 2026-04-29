import { View, ScrollView, StyleSheet, Pressable, Platform } from 'react-native'
import Shimmer from '../../../../components/atoms/shimmer'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import { goBack } from '../../../../utils/navigationUtils'
import Header from '../../../../components/organisms/header'
import {
    Button,
    CommonDropdown,
    Typography,
    ConfirmModal,
    TextField,
    QuizChipsPager,
    ReferenceSolutionValidationErrorPanel,
    normalizeIoForMatch,
    filterUnresolvedReferenceValidationRows,
    CodeEditorInput,
} from '../../../../components'
import { SvgXml } from 'react-native-svg'
import { deleteIcon } from '../../../../assets/svg/deleteicon'
import { colors } from '../../../../theme/colors'
import Divider from '../../../../components/atoms/divider'
import NumberStepper from '../../../../components/atoms/numberstepper'
import RichTextField from '../../../../components/atoms/richtextscreen'
import {
    fetchAssessmentTestDetailRequest,
    fetchAssessmentLanguagesRequest,
    submitProblemQuestionRequest,
    deleteAssessmentQuestionRequest,
    publishAssessmentTestRequest,
} from '../../../../features/assessments/slice'
import {
    generateCodingProblemMetadataRequestAction,
    generateCodingTestcasesSnippetsRequestAction,
    generateCodingReferenceSolutionRequestAction,
} from '../../../../features/assessments/actions'
import { registerGenerateCodingMetadataCallbacks } from '../../../../features/assessments/generateCodingMetadataCallbacks'
import { registerGenerateCodingTestcasesCallbacks } from '../../../../features/assessments/generateCodingTestcasesCallbacks'
import { registerGenerateCodingReferenceSolutionCallbacks } from '../../../../features/assessments/generateCodingReferenceSolutionCallbacks'
import {
    selectAssessmentTestDetail,
    selectAssessmentTestDetailError,
    selectAssessmentTestDetailLoading,
    selectAssessmentQuestionsList,
    selectAssessmentQuestionsListError,
    selectAssessmentQuestionsListLoading,
    selectPostAssessmentQuestionLoading,
    selectPostAssessmentQuestionError,
    selectPostAssessmentQuestionReferenceSolutionErrors,
    selectDeleteAssessmentQuestionLoading,
    selectDeleteAssessmentQuestionError,
    selectUpdateAssessmentQuestionLoading,
    selectUpdateAssessmentQuestionError,
    selectPublishAssessmentTestLoading,
    selectPublishAssessmentTestError,
    selectAssessmentLanguagesItems,
    selectAssessmentLanguagesListLoading,
    selectAssessmentLanguagesListError,
    selectAssessmentLanguagesListHasMore,
    selectAssessmentLanguagesListPage,
} from '../../../../features/assessments/selectors'
import { capitalizeFirstLetter } from '../../../../utils/stringUtils'
import { downloadIcon } from '../../../../assets/svg/download'
import SlideAnimatedTab from '../../../../components/molecules/slideanimatedtab'
import TagList from '../../../../components/molecules/taglist'
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets'
import AiCodingTestQuestion from './aicodingtestquestion'
import CreateAssessmentTest from './createassessmenttest'
import ExcelTestUpload from './exceltestupload'
import ExpandableWrapper from '../../../../components/molecules/expandablewrapper'
import { showToastMessage } from '../../../../utils/toast'
import type {
    AssessmentJudgeLanguage,
    ReferenceSolutionValidationRow,
} from '../../../../features/assessments/types'
import {
    type CodingExample,
    type CodingTestCase,
    type CodingProblemFormState,
    DEFAULT_DIFFICULTY,
    DEFAULT_POINTS,
    DEFAULT_TIME_MIN,
    getDefaultStarterTemplate,
    FALLBACK_LANGUAGE_OPTIONS,
    POPULAR_LABELS,
    normalizeLanguagesToOptions,
    resolveLangToken,
    mergeLanguagesFromPopularChipSelection,
    popularLabelForJudgeLanguage,
    pruneLangRecord,
    labelForLangValue,
    plainProblemDescriptionToHtml,
    formatMetadataExampleInput,
    htmlToPlainText,
    hasRichTextContent,
    buildCodingProblemQuestionPayload,
} from './codingProblemShared'

export type { CodingExample, CodingTestCase, CodingProblemFormState } from './codingProblemShared'
export {
    labelForLangValue,
    plainProblemDescriptionToHtml,
    formatMetadataExampleInput,
    hasRichTextContent,
    htmlToPlainText,
    buildCodingProblemQuestionPayload,
    normalizeLanguagesToOptions,
    resolveLangToken,
    popularNameForLabel,
    mergeLanguagesFromPopularChipSelection,
    popularLabelForJudgeLanguage,
    pruneLangRecord,
    POPULAR_LABELS,
    FALLBACK_LANGUAGE_OPTIONS,
} from './codingProblemShared'

/** Skeleton for Questions tab while test detail or questions list is loading. */
const CodingQuestionsTabShimmer = () => {
    const insets = useRNSafeAreaInsets()
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={{ padding: 16, gap: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <Shimmer width="58%" height={22} borderRadius={8} />
                        <Shimmer width={88} height={36} borderRadius={10} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Shimmer width="42%" height={18} borderRadius={6} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <Shimmer width={22} height={22} borderRadius={4} />
                            <Shimmer width={72} height={36} borderRadius={8} />
                        </View>
                    </View>
                </View>
                <Divider />
                <View style={styles.previewSection}>
                    <Shimmer width="100%" height={72} borderRadius={12} />
                </View>
                <View style={styles.form}>
                    <View style={styles.formFieldsInner}>
                        <View style={{ gap: 8 }}>
                            <Shimmer width="36%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={40} borderRadius={8} />
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1, gap: 8 }}>
                                <Shimmer width="50%" height={14} borderRadius={6} />
                                <Shimmer width="100%" height={40} borderRadius={8} />
                            </View>
                            <View style={{ width: 100, gap: 8 }}>
                                <Shimmer width="70%" height={14} borderRadius={6} />
                                <Shimmer width="100%" height={40} borderRadius={8} />
                            </View>
                        </View>
                        <Shimmer width="100%" height={120} borderRadius={10} />
                        <Shimmer width="100%" height={100} borderRadius={10} />
                        <View style={{ gap: 10 }}>
                            <Shimmer width="28%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={14} borderRadius={6} />
                            <Shimmer width="92%" height={14} borderRadius={6} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={[
                    styles.shimmerFooter,
                    { paddingBottom: Math.max(16, insets.insetsBottom) },
                ]}
            >
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <Shimmer width={64} height={32} borderRadius={8} />
                    <Shimmer width={64} height={32} borderRadius={8} />
                    <Shimmer width={64} height={32} borderRadius={8} />
                </View>
                <Shimmer width="100%" height={44} borderRadius={8} />
            </View>
        </View>
    )
}

const ASSESSMENT_CODING_TEST_DRAFT_KEY = '@assessment/codingTestQuestionsDraft'

/** Same tab strip as aptitude `CreateTestQuestion` (mobile pattern). */

const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
]

/** Optional placeholder when a language has no reference yet. */
function getDefaultReferenceTemplate(langValue: string, displayLabel: string): string {
    const v = String(langValue ?? '').toLowerCase()
    const label = displayLabel || langValue
    if (/javascript|node/.test(v) || /javascript|node/i.test(label)) {
        return `// Reference solution for ${label}
// (internal — not shown to candidates)
`
    }
    return `// Reference solution for ${label}
// (internal — not shown to candidates)
`
}

function langValuesFromProblemMeta(
    meta: Record<string, any>,
    options: { label: string; value: string }[],
): string[] {
    const def = options[0]?.value ?? FALLBACK_LANGUAGE_OPTIONS[0].value
    const fromSnippets = Array.isArray(meta?.code_snippets)
        ? meta.code_snippets
            .map((s: any) => resolveLangToken(String(s?.language ?? ''), options))
            .filter((v): v is string => Boolean(v))
        : []
    const ref = meta?.reference_solutions
    const fromRefs =
        ref && typeof ref === 'object'
            ? Object.keys(ref)
                .map((k) => resolveLangToken(k, options))
                .filter((v): v is string => Boolean(v))
            : []
    const merged = [...new Set([...fromSnippets, ...fromRefs])]
    return merged.length ? merged : [def]
}

/** Union of allowed_languages plus any language keys from snippets, refs, starter_code — so code maps are not dropped when allowed_languages is incomplete. */
function collectLangsForCodingProblem(
    meta: Record<string, any>,
    options: { label: string; value: string }[],
): string[] {
    const seen = new Set<string>()
    const add = (token: string | null | undefined) => {
        const t = String(token ?? '').trim()
        if (!t) return
        const canon = resolveLangToken(t, options) ?? t
        if (canon && !seen.has(canon)) seen.add(canon)
    }
    if (Array.isArray(meta.allowed_languages)) {
        for (const x of meta.allowed_languages) add(String(x))
    }
    const sc = meta.starter_code
    if (sc && typeof sc === 'object') {
        for (const k of Object.keys(sc)) add(k)
    }
    if (meta.starter_language != null) add(String(meta.starter_language))
    if (Array.isArray(meta.code_snippets)) {
        for (const s of meta.code_snippets) add(s?.language)
    }
    if (meta.reference_solutions && typeof meta.reference_solutions === 'object') {
        for (const k of Object.keys(meta.reference_solutions)) add(k)
    }
    const out = [...seen]
    if (out.length) return out
    return langValuesFromProblemMeta(meta, options)
}

function difficultyFromApi(meta: Record<string, any>, q: any): string {
    const md = meta?.difficulty
    if (md && typeof md === 'object' && md.difficulty) return String(md.difficulty).toLowerCase()
    if (typeof md === 'string' && /^(easy|medium|hard)$/i.test(md)) return md.toLowerCase()
    const qd = q?.difficulty
    if (typeof qd === 'string' && /^(easy|medium|hard)$/i.test(qd)) return qd.toLowerCase()
    return DEFAULT_DIFFICULTY
}

function timeMinutesFromApi(q: any, meta: Record<string, any>): number {
    const tl = meta?.time_limit
    const td = q?.time_duration
    if (tl != null && Number(tl) > 0) {
        return Math.max(1, Math.round(Number(tl)))
    }
    if (td != null) {
        const n = Number(td)
        if (n > 200) return Math.max(1, Math.round(n / 60))
        return Math.max(1, Math.round(n))
    }
    return DEFAULT_TIME_MIN
}

function buildStarterCodeMapFromMeta(
    meta: Record<string, any>,
    langs: string[],
    options: { label: string; value: string }[],
): Record<string, string> {
    const out: Record<string, string> = {}
    const sc = meta.starter_code
    if (typeof sc === 'string' && sc.trim() && langs.length) {
        const starter =
            meta.starter_language != null
                ? resolveLangToken(String(meta.starter_language), options) ?? langs[0]
                : langs[0]
        if (starter && langs.includes(starter)) out[starter] = sc
    } else if (sc && typeof sc === 'object') {
        for (const k of Object.keys(sc)) {
            const resolved = resolveLangToken(k, options) ?? k
            if (langs.includes(resolved)) out[resolved] = String((sc as any)[k])
        }
    }
    const snippets = Array.isArray(meta.code_snippets) ? meta.code_snippets : []
    for (const s of snippets) {
        const L = String(s?.language ?? '')
        const resolved = resolveLangToken(L, options)
        if (resolved && langs.includes(resolved) && s?.code != null) {
            out[resolved] = String(s.code)
        }
    }
    return out
}

function buildReferenceMapFromMeta(
    meta: Record<string, any>,
    langs: string[],
    options: { label: string; value: string }[],
): Record<string, string> {
    const out: Record<string, string> = {}
    const refMap = meta.reference_solutions
    if (refMap && typeof refMap === 'object') {
        for (const k of Object.keys(refMap)) {
            const resolved = resolveLangToken(k, options) ?? k
            if (langs.includes(resolved)) out[resolved] = String((refMap as any)[k])
        }
    }
    if (typeof meta.reference_solution === 'string' && meta.reference_solution.trim()) {
        const starter =
            meta.starter_language != null
                ? resolveLangToken(String(meta.starter_language), options) ?? langs[0]
                : langs[0]
        if (starter && langs.includes(starter)) out[starter] = meta.reference_solution
    }
    return out
}

function nextId(prefix: string, ref: React.MutableRefObject<number>) {
    ref.current += 1
    return `${prefix}-${ref.current}`
}

function firstLineTitleFromDescription(desc: string): string {
    const line = String(desc ?? '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0)
    if (!line) return ''
    return line.replace(/^[\s#*→\-]+/u, '').slice(0, 220)
}

function cloneProblem(p: CodingProblemFormState): CodingProblemFormState {
    return {
        ...p,
        examples: p.examples.map((e) => ({ ...e })),
        testCases: p.testCases.map((t) => ({ ...t })),
        languages: [...p.languages],
        starterCodeByLang: { ...p.starterCodeByLang },
        referenceSolutionByLang: { ...p.referenceSolutionByLang },
    }
}

function isCodingApiQuestion(q: any): boolean {
    return q?.question_type === 'coding'
}

function parseMeta(q: any): Record<string, any> {
    const legacy = q?.coding_problem ?? q?.coding_metadata
    const legacyObj = legacy && typeof legacy === 'object' ? legacy : {}
    const prob = q?.problem && typeof q.problem === 'object' ? q.problem : null
    if (!prob) return legacyObj
    return { ...prob, ...legacyObj }
}

function codingProblemsFromApi(
    idRef: React.MutableRefObject<number>,
    results: any[] | undefined | null,
    languageOptions: { label: string; value: string }[],
): CodingProblemFormState[] {
    const options = languageOptions.length ? languageOptions : FALLBACK_LANGUAGE_OPTIONS
    const list = Array.isArray(results) ? results.filter(isCodingApiQuestion) : []
    return list.map((q) => {
        const meta = parseMeta(q)
        const examplesRaw = Array.isArray(meta.examples) ? meta.examples : []
        const testsRaw = Array.isArray(meta.hidden_test_cases)
            ? meta.hidden_test_cases
            : Array.isArray(meta.test_cases)
                ? meta.test_cases
                : []

        const examples: CodingExample[] =
            examplesRaw.length > 0
                ? examplesRaw.map((ex: any, i: number) => ({
                    id: nextId('ex', idRef),
                    input: String(ex?.input ?? ''),
                    output: String(ex?.output ?? ''),
                    exploration: String(ex?.explanation ?? ex?.exploration ?? ''),
                }))
                : [
                    { id: nextId('ex', idRef), input: '', output: '', exploration: '' },
                    { id: nextId('ex', idRef), input: '', output: '', exploration: '' },
                ]

        const testCases: CodingTestCase[] =
            testsRaw.length > 0
                ? testsRaw.map((t: any) => ({
                    id: nextId('tc', idRef),
                    input: String(t?.input ?? ''),
                    expectedOutput: String(
                        t?.expected_output ?? t?.expectedOutput ?? t?.output ?? '',
                    ),
                }))
                : [
                    { id: nextId('tc', idRef), input: '', expectedOutput: '' },
                    { id: nextId('tc', idRef), input: '', expectedOutput: '' },
                    { id: nextId('tc', idRef), input: '', expectedOutput: '' },
                ]

        const langs = collectLangsForCodingProblem(meta, options)
            .map((r) => resolveLangToken(r, options) ?? r)
            .filter((v, i, a) => a.indexOf(v) === i)

        const def = options[0]?.value ?? FALLBACK_LANGUAGE_OPTIONS[0].value
        if (!langs.length) {
            return {
                localId: `srv-${q.id}`,
                serverQuestionId: q?.id != null ? String(q.id) : null,
                title: String(meta.title ?? q?.text ?? '').replace(/\s+/g, ' ').trim() || 'Untitled',
                difficulty: difficultyFromApi(meta, q),
                points: Number(q?.points ?? DEFAULT_POINTS),
                timeMinutes: timeMinutesFromApi(q, meta),
                problemStatementHtml: String(
                    q?.html_content ?? meta.statement_html ?? (typeof meta.description === 'string' ? meta.description : ''),
                ),
                constraints: String(meta.constraints ?? ''),
                examples,
                testCases,
                languages: [],
                starterLanguage: '',
                starterCodeByLang: {},
                referenceSolutionByLang: {},
            }
        }

        let starterLang = langs[0] ?? def
        if (meta.starter_language) {
            const raw = String(meta.starter_language)
            const resolved = resolveLangToken(raw, options) ?? raw
            if (langs.includes(resolved)) starterLang = resolved
            else if (langs.includes(raw)) starterLang = raw
        }

        const starterCodeByLang = buildStarterCodeMapFromMeta(meta, langs, options)
        const referenceSolutionByLang = buildReferenceMapFromMeta(meta, langs, options)

        return {
            localId: `srv-${q.id}`,
            serverQuestionId: q?.id != null ? String(q.id) : null,
            title: String(meta.title ?? q?.text ?? '').replace(/\s+/g, ' ').trim() || 'Untitled',
            difficulty: difficultyFromApi(meta, q),
            points: Number(q?.points ?? DEFAULT_POINTS),
            timeMinutes: timeMinutesFromApi(q, meta),
            problemStatementHtml: String(
                q?.html_content ?? meta.statement_html ?? (typeof meta.description === 'string' ? meta.description : ''),
            ),
            constraints: String(meta.constraints ?? ''),
            examples,
            testCases,
            languages: langs,
            starterLanguage: starterLang,
            starterCodeByLang,
            referenceSolutionByLang,
        }
    })
}

function parseStoredProblems(raw: string | null): CodingProblemFormState[] | null {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return null
        return parsed.map((p: any) => {
            const starterCodeByLang: Record<string, string> =
                p?.starterCodeByLang && typeof p.starterCodeByLang === 'object'
                    ? { ...p.starterCodeByLang }
                    : p?.starterLanguage && typeof p.starterCode === 'string'
                        ? { [String(p.starterLanguage)]: p.starterCode }
                        : {}
            const referenceSolutionByLang: Record<string, string> =
                p?.referenceSolutionByLang && typeof p.referenceSolutionByLang === 'object'
                    ? { ...p.referenceSolutionByLang }
                    : p?.starterLanguage && typeof p.referenceSolution === 'string'
                        ? { [String(p.starterLanguage)]: p.referenceSolution }
                        : {}
            const { starterCode: _sc, referenceSolution: _rs, ...rest } = p
            return {
                ...rest,
                starterCodeByLang,
                referenceSolutionByLang,
                constraints: p?.constraints ?? '',
            }
        }) as CodingProblemFormState[]
    } catch {
        return null
    }
}

/** Field-level messages shown after Save when validation fails. */
export type CodingProblemSaveValidationErrors = {
    title?: string
    problemStatement?: string
    examples?: string
    languages?: string
    testCases?: string
}

function validateProblemForSave(p: CodingProblemFormState): CodingProblemSaveValidationErrors {
    const errors: CodingProblemSaveValidationErrors = {}
    if (!String(p.title ?? '').trim()) {
        errors.title = 'Problem title is required.'
    }
    if (!hasRichTextContent(p.problemStatementHtml ?? '')) {
        errors.problemStatement = 'Problem statement is required.'
    }
    const invalidExample = p.examples.some(
        (ex) => !String(ex.input ?? '').trim() && !String(ex.output ?? '').trim(),
    )
    if (invalidExample) {
        errors.examples = 'All examples must have input or output.'
    }
    if (!p.languages?.length) {
        errors.languages = 'Select at least one language.'
    }
    const invalidTestCase = p.testCases.some(
        (tc) => !String(tc.input ?? '').trim() && !String(tc.expectedOutput ?? '').trim(),
    )
    if (invalidTestCase) {
        errors.testCases = 'All test cases must have input or expected output.'
    }
    return errors
}

function hasSaveValidationErrors(e: CodingProblemSaveValidationErrors): boolean {
    return Object.keys(e).length > 0
}

const CodingTestQuestion = () => {
    const insets = useRNSafeAreaInsets()
    const route = useRoute<any>()
    const dispatch = useDispatch()
    const postQuestionLoading = useSelector(selectPostAssessmentQuestionLoading)
    const postQuestionError = useSelector(selectPostAssessmentQuestionError)
    const referenceSolutionValidationErrors = useSelector(
        selectPostAssessmentQuestionReferenceSolutionErrors,
    )
    const updateQuestionLoading = useSelector(selectUpdateAssessmentQuestionLoading)
    const updateQuestionError = useSelector(selectUpdateAssessmentQuestionError)
    const deleteQuestionLoading = useSelector(selectDeleteAssessmentQuestionLoading)
    const deleteQuestionError = useSelector(selectDeleteAssessmentQuestionError)
    const publishTestLoading = useSelector(selectPublishAssessmentTestLoading)
    const publishTestError = useSelector(selectPublishAssessmentTestError)
    const testDetailLoading = useSelector(selectAssessmentTestDetailLoading)
    const testDetailError = useSelector(selectAssessmentTestDetailError)
    const testDetail = useSelector(selectAssessmentTestDetail)
    const questionsLoading = useSelector(selectAssessmentQuestionsListLoading)
    const questionsError = useSelector(selectAssessmentQuestionsListError)
    const questionsList = useSelector(selectAssessmentQuestionsList)
    const languagesItems = useSelector(selectAssessmentLanguagesItems)
    const languagesLoading = useSelector(selectAssessmentLanguagesListLoading)
    const languagesError = useSelector(selectAssessmentLanguagesListError)
    const languagesHasMore = useSelector(selectAssessmentLanguagesListHasMore)
    const languagesPage = useSelector(selectAssessmentLanguagesListPage)
    const testId: string | null =
        route?.params?.assignmentId ??
        route?.params?.assignmentid ??
        route?.params?.assessmentId ??
        route?.params?.testId ??
        route?.params?.test ??
        null

    const idRef = useRef(0)

    const createEmptyExample = (): CodingExample => ({
        id: nextId('ex', idRef),
        input: '',
        output: '',
        exploration: '',
    })

    const createEmptyTestCase = (): CodingTestCase => ({
        id: nextId('tc', idRef),
        input: '',
        expectedOutput: '',
    })
    const QUESTION_CREATION_TABS = testDetail?.is_published
  ? ['Questions', 'Setting']   // ❌ remove Generate
  : ['Questions', 'Generate', 'Setting'];


    const createEmptyProblem = (): CodingProblemFormState => ({
        localId: `new-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        serverQuestionId: null,
        title: '',
        difficulty: DEFAULT_DIFFICULTY,
        points: DEFAULT_POINTS,
        timeMinutes: DEFAULT_TIME_MIN,
        problemStatementHtml: '',
        constraints: '',
        examples: [createEmptyExample(), createEmptyExample()],
        testCases: [createEmptyTestCase(), createEmptyTestCase(), createEmptyTestCase()],
        languages: [],
        starterLanguage: '',
        starterCodeByLang: {},
        referenceSolutionByLang: {},
    })

    const [savedProblems, setSavedProblems] = useState<CodingProblemFormState[]>([])
    const [draft, setDraft] = useState<CodingProblemFormState>(() => createEmptyProblem())
    const unresolvedReferenceValidationErrors = useMemo(
        () =>
            filterUnresolvedReferenceValidationRows(
                referenceSolutionValidationErrors,
                draft.testCases,
            ),
        [referenceSolutionValidationErrors, draft.testCases],
    )
    const [draftSource, setDraftSource] = useState<'new' | number>('new')
    const [hasTriedSave, setHasTriedSave] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [creationTab, setCreationTab] = useState<string>(QUESTION_CREATION_TABS[0])
    /** Generate-with-AI panels (metadata API). */
    const [codingAiLoading, setCodingAiLoading] = useState(false)
    const [showProblemStatementAi, setShowProblemStatementAi] = useState(false)
    const [problemStatementAiPrompt, setProblemStatementAiPrompt] = useState('')
    const [showExamplesAi, setShowExamplesAi] = useState(false)
    const [examplesAiPrompt, setExamplesAiPrompt] = useState('')
    const [showTestCasesAi, setShowTestCasesAi] = useState(false)
    const [testCasesAiPrompt, setTestCasesAiPrompt] = useState('')
    const [showStarterCodeAi, setShowStarterCodeAi] = useState(false)
    const [starterCodeAiPrompt, setStarterCodeAiPrompt] = useState('')
    const [showReferenceSolutionsAi, setShowReferenceSolutionsAi] = useState(false)
    const [referenceSolutionsAiPrompt, setReferenceSolutionsAiPrompt] = useState('')
    const [referenceSolutionsExpanded, setReferenceSolutionsExpanded] = useState(false)

    const languageOptions = useMemo(() => {
        if (languagesItems.length > 0) {
            return languagesItems.map((x) => ({ label: x.display_name, value: x.name }))
        }
        return FALLBACK_LANGUAGE_OPTIONS
    }, [languagesItems])

    /** With a test id, show skeleton until detail + questions list are ready (draft-only mode skips). */
    const showQuestionsTabShimmer = useMemo(() => {
        const id = testId?.trim()
        if (!id) return false
        if (testDetailLoading && !testDetail) return true
        if (questionsLoading && !questionsList) return true
        return false
    }, [testId, testDetailLoading, testDetail, questionsLoading, questionsList])

    useEffect(() => {
        dispatch(fetchAssessmentLanguagesRequest({ page: 1, pageSize: 100, append: false }))
    }, [dispatch])

    useEffect(() => {
        if (unresolvedReferenceValidationErrors.length) {
            setReferenceSolutionsExpanded(true)
        }
    }, [unresolvedReferenceValidationErrors])

    /** Keep `draft.languages` aligned with catalog `value` keys so All languages dropdown shows selections. */
    useEffect(() => {
        if (!languageOptions.length) return
        setDraft((prev) => {
            const next = normalizeLanguagesToOptions(prev.languages, languageOptions)
            const sameLen = next.length === prev.languages.length
            const sameOrder = sameLen && next.every((v, i) => v === prev.languages[i])
            if (sameOrder) return prev
            if (!next.length) {
                return {
                    ...prev,
                    languages: [],
                    starterLanguage: '',
                    starterCodeByLang: {},
                    referenceSolutionByLang: {},
                }
            }
            let starterLanguage = prev.starterLanguage
            if (!next.includes(starterLanguage)) {
                starterLanguage = next[0] ?? ''
            }
            const allowed = new Set(next)
            return {
                ...prev,
                languages: next,
                starterLanguage,
                starterCodeByLang: pruneLangRecord(prev.starterCodeByLang, allowed),
                referenceSolutionByLang: pruneLangRecord(prev.referenceSolutionByLang, allowed),
            }
        })
    }, [languageOptions])

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    if (testId?.trim()) return
                    const raw = await AsyncStorage.getItem(ASSESSMENT_CODING_TEST_DRAFT_KEY)
                    if (cancelled) return
                    const loaded = parseStoredProblems(raw)
                    if (!loaded?.length) return
                    setSavedProblems(loaded)
                    setDraft(createEmptyProblem())
                    setDraftSource('new')
                } catch {
                    /* defaults */
                }
            })()
        return () => {
            cancelled = true
        }
    }, [testId])

    useEffect(() => {
        const results = questionsList?.results
        if (!Array.isArray(results)) return
        const mapped = codingProblemsFromApi(idRef, results, languageOptions)
        setSavedProblems(mapped)
        if (mapped.length > 0) {
            setDraftSource(0)
            setDraft(cloneProblem(mapped[0]))
        } else {
            setDraftSource('new')
            setDraft(createEmptyProblem())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionsList?.results, languageOptions])

    useEffect(() => {
        const id = testId?.trim()
        if (!id) return
        dispatch(fetchAssessmentTestDetailRequest({ id }))
    }, [dispatch, testId])

    useEffect(() => {
        if (draftSource === 'new') return
        if (savedProblems.length === 0) {
            setDraftSource('new')
            setDraft(createEmptyProblem())
            return
        }
        if (draftSource >= savedProblems.length) {
            const i = savedProblems.length - 1
            setDraftSource(i)
            setDraft(cloneProblem(savedProblems[i]))
        }
    }, [savedProblems, draftSource])

    const saveFieldErrors = useMemo((): CodingProblemSaveValidationErrors => {
        if (!hasTriedSave) return {}
        return validateProblemForSave(draft)
    }, [draft, hasTriedSave])

    const patchDraft = useCallback((patch: Partial<CodingProblemFormState>) => {
        setDraft((prev) => ({ ...prev, ...patch }))
    }, [])

    const addQuiz = () => {
        setHasTriedSave(false)
        setDraft(createEmptyProblem())
        setDraftSource('new')
    }

    const resolveServerQuestionId = (): string | null => {
        if (draft.serverQuestionId) return draft.serverQuestionId
        if (draftSource !== 'new' && questionsList?.results) {
            const codingOnly = (questionsList.results as any[]).filter(isCodingApiQuestion)
            const row = codingOnly[draftSource]
            if (row?.id != null) return String(row.id)
        }
        return null
    }

    const removeCurrentLocally = () => {
        setHasTriedSave(false)
        if (draftSource === 'new') {
            setDraft(createEmptyProblem())
            return
        }
        const idx = draftSource
        const next = savedProblems.filter((_, i) => i !== idx)
        void AsyncStorage.setItem(ASSESSMENT_CODING_TEST_DRAFT_KEY, JSON.stringify(next))
        setSavedProblems(next)
        if (next.length === 0) {
            setDraft(createEmptyProblem())
            setDraftSource('new')
            return
        }
        const newIndex = Math.min(idx, next.length - 1)
        setDraftSource(newIndex)
        setDraft(cloneProblem(next[newIndex]))
    }

    const openDeleteModal = () => {
        if (deleteQuestionLoading) return
        const allowed =
            draftSource !== 'new' ||
            savedProblems.length > 0 ||
            String(draft.title ?? '').trim().length > 0 ||
            hasRichTextContent(draft.problemStatementHtml)
        if (!allowed) return
        setDeleteModalVisible(true)
    }

    const handleConfirmDelete = () => {
        setDeleteModalVisible(false)
        const tid = testId?.trim()
        const serverId = resolveServerQuestionId()
        if (tid && serverId) {
            dispatch(
                deleteAssessmentQuestionRequest({
                    questionId: serverId,
                    testId: tid,
                    isProblemQuestion: true,
                }),
            )
            return
        }
        removeCurrentLocally()
    }

    const handleChipSelect = (index: number) => {
        setHasTriedSave(false)
        const q = savedProblems[index]
        if (!q) return
        setDraftSource(index)
        setDraft(cloneProblem(q))
    }

    const handleSave = async () => {
        setHasTriedSave(true)
        const fieldErrors = validateProblemForSave(draft)
        if (hasSaveValidationErrors(fieldErrors)) return

        const nextList =
            draftSource === 'new'
                ? [...savedProblems, cloneProblem(draft)]
                : savedProblems.map((p, i) => (i === draftSource ? cloneProblem(draft) : p))

        await AsyncStorage.setItem(ASSESSMENT_CODING_TEST_DRAFT_KEY, JSON.stringify(nextList))
        setSavedProblems(nextList)

        if (draftSource === 'new') {
            setDraftSource(nextList.length - 1)
        }

        if (!testId) {
            console.warn('Missing test id for coding question')
            return
        }

        const body = buildCodingProblemQuestionPayload(draft, testId, languageOptions)
        const serverQid = resolveServerQuestionId()?.trim() ?? null

        dispatch(
            submitProblemQuestionRequest({
                questionId: serverQid,
                body,
            }),
        )
    }

    const handlePublish = () => {
        const id = testId?.trim()
        if (!id) return
        if (testDetail?.is_published) return
        if (publishTestLoading) return
        dispatch(publishAssessmentTestRequest({ testId: id }))
    }

    const runCodingMetadataAi = (
        aiPrompt: string,
        applyMode: 'problemStatement' | 'examples',
        examplesCount: number,
    ) => {
        if (testDetail?.is_published) return
        if (!aiPrompt.trim()) {
            showToastMessage('Enter a prompt for AI.', 'info')
            return
        }
        if (codingAiLoading) return

        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        setCodingAiLoading(true)
        registerGenerateCodingMetadataCallbacks(requestId, {
            onSuccess: (data) => {
                setCodingAiLoading(false)
                if (applyMode === 'problemStatement') {
                    setDraft((prev) => ({
                        ...prev,
                        title: prev.title,
                        problemStatementHtml: plainProblemDescriptionToHtml(data.problem_description),
                        constraints: data.constraints != null ? String(data.constraints) : prev.constraints,
                        timeMinutes:
                            typeof data.duration === 'number' && data.duration > 0
                                ? Math.round(data.duration)
                                : prev.timeMinutes,
                        difficulty:
                            typeof data.difficulty_level === 'string' && data.difficulty_level
                                ? String(data.difficulty_level).toLowerCase()
                                : prev.difficulty,
                    }))
                    showToastMessage('Problem statement generated.', 'success')
                    setProblemStatementAiPrompt('')
                    setShowProblemStatementAi(false)
                } else {
                    const ex = Array.isArray(data.examples) ? data.examples : []
                    setDraft((prev) => {
                        const mapped: CodingExample[] = ex.map((raw: { input?: unknown; output?: unknown; explanation?: string }) => ({
                            id: nextId('ex', idRef),
                            input: formatMetadataExampleInput(raw?.input),
                            output: String(raw?.output ?? ''),
                            exploration: String(raw?.explanation ?? ''),
                        }))
                        return {
                            ...prev,
                            examples: mapped.length ? mapped : prev.examples,
                        }
                    })
                    showToastMessage('Examples generated.', 'success')
                    setExamplesAiPrompt('')
                    setShowExamplesAi(false)
                }
            },
            onError: () => {
                setCodingAiLoading(false)
            },
        })

        dispatch(
            generateCodingProblemMetadataRequestAction({
                requestId,
                payload: {
                    title: draft.title.trim() || 'Untitled',
                    difficulty_level: draft.difficulty || DEFAULT_DIFFICULTY,
                    duration: Math.max(1, draft.timeMinutes),
                    ai_prompt: aiPrompt.trim(),
                    examples_count: Math.min(10, Math.max(1, examplesCount)),
                },
            }),
        )
    }

    const handleProblemStatementAiGenerate = () => {
        runCodingMetadataAi(problemStatementAiPrompt, 'problemStatement', 3)
    }

    const handleExamplesAiGenerate = () => {
        const n = draft.examples.length || 3
        runCodingMetadataAi(examplesAiPrompt, 'examples', n)
    }

    const handleTestCasesAiGenerate = () => {
        if (testDetail?.is_published) return
        if (!testCasesAiPrompt.trim()) {
            showToastMessage('Enter a prompt for AI.', 'info')
            return
        }
        if (!hasRichTextContent(draft.problemStatementHtml ?? '')) {
            showToastMessage('Add a problem description before generating test cases.', 'info')
            return
        }
        if (!draft.languages?.length) {
            showToastMessage('Select at least one supported language.', 'info')
            return
        }
        if (codingAiLoading) return

        const supportedLabels = draft.languages.map((v) => labelForLangValue(v, languageOptions))
        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        setCodingAiLoading(true)
        registerGenerateCodingTestcasesCallbacks(requestId, {
            onSuccess: (data) => {
                setCodingAiLoading(false)
                const testsRaw = Array.isArray(data.test_cases) ? data.test_cases : []
                const snippetsRaw = Array.isArray(data.code_snippets) ? data.code_snippets : []
                setDraft((prev) => {
                    const mapped: CodingTestCase[] = testsRaw.map(
                        (t: { input?: string; expected_output?: string; expectedOutput?: string }) => ({
                            id: nextId('tc', idRef),
                            input: String(t?.input ?? ''),
                            expectedOutput: String(
                                t?.expected_output ?? (t as { expectedOutput?: string })?.expectedOutput ?? '',
                            ),
                        }),
                    )
                    const nextTestCases = mapped.length ? mapped : prev.testCases

                    const starterPatch = { ...prev.starterCodeByLang }
                    const allowed = new Set(prev.languages)
                    for (const s of snippetsRaw) {
                        const langKey = String(s?.language ?? '')
                        const canon =
                            resolveLangToken(langKey, languageOptions) ||
                            (allowed.has(langKey) ? langKey : null)
                        if (canon && allowed.has(canon) && s?.code != null) {
                            starterPatch[canon] = String(s.code)
                        }
                    }

                    return {
                        ...prev,
                        testCases: nextTestCases,
                        starterCodeByLang: starterPatch,
                    }
                })
                showToastMessage('Test cases and starter code snippets updated.', 'success')
                setTestCasesAiPrompt('')
                setShowTestCasesAi(false)
            },
            onError: () => {
                setCodingAiLoading(false)
            },
        })

        dispatch(
            generateCodingTestcasesSnippetsRequestAction({
                requestId,
                payload: {
                    title: draft.title.trim() || 'Untitled',
                    ai_prompt: testCasesAiPrompt.trim(),
                    constraints: draft.constraints?.trim() ?? '',
                    description: draft.problemStatementHtml ?? '',
                    supported_languages: supportedLabels,
                    test_cases_count: Math.min(20, Math.max(1, draft.testCases.length || 5)),
                },
            }),
        )
    }

    const handleStarterCodeAiGenerate = () => {
        if (!starterCodeAiPrompt.trim()) {
            showToastMessage('Enter a prompt for AI.', 'info')
            return
        }
        showToastMessage(
            'Use Test cases → Generate with AI to create starter snippets, or edit starter code manually.',
            'info',
        )
    }

    const handleReferenceSolutionsAiGenerate = () => {
        if (testDetail?.is_published) return
        if (!referenceSolutionsAiPrompt.trim()) {
            showToastMessage('Enter a prompt for AI.', 'info')
            return
        }
        if (!hasRichTextContent(draft.problemStatementHtml ?? '')) {
            showToastMessage('Add a problem description before generating a reference solution.', 'info')
            return
        }
        const sl = draft.starterLanguage?.trim()
        if (!sl || !draft.languages.includes(sl)) {
            showToastMessage('Select a language for the reference solution.', 'info')
            return
        }
        const testCasesPayload = draft.testCases
            .filter(
                (tc) =>
                    String(tc.input ?? '').trim().length > 0 &&
                    String(tc.expectedOutput ?? '').trim().length > 0,
            )
            .map((tc) => ({
                input: String(tc.input ?? ''),
                expected_output: String(tc.expectedOutput ?? ''),
            }))
        if (testCasesPayload.length === 0) {
            showToastMessage(
                'Add at least one hidden test case with both input and expected output.',
                'info',
            )
            return
        }
        if (codingAiLoading) return

        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        setCodingAiLoading(true)
        registerGenerateCodingReferenceSolutionCallbacks(requestId, {
            onSuccess: (rows) => {
                setCodingAiLoading(false)
                const list = Array.isArray(rows) ? rows : []
                setDraft((prev) => {
                    const refPatch = { ...prev.referenceSolutionByLang }
                    const allowed = new Set(prev.languages)
                    for (const row of list) {
                        const langLabel = String(row?.language ?? '')
                        const canon =
                            resolveLangToken(langLabel, languageOptions) ||
                            (allowed.has(langLabel) ? langLabel : null)
                        if (canon && allowed.has(canon) && row?.code != null) {
                            refPatch[canon] = String(row.code)
                        }
                    }
                    return { ...prev, referenceSolutionByLang: refPatch }
                })
                showToastMessage('Reference solution generated.', 'success')
                setReferenceSolutionsAiPrompt('')
                setShowReferenceSolutionsAi(false)
            },
            onError: () => {
                setCodingAiLoading(false)
            },
        })

        dispatch(
            generateCodingReferenceSolutionRequestAction({
                requestId,
                payload: {
                    title: draft.title.trim() || 'Untitled',
                    ai_prompt: referenceSolutionsAiPrompt.trim(),
                    constraints: draft.constraints?.trim() ?? '',
                    description: draft.problemStatementHtml ?? '',
                    languages: [labelForLangValue(sl, languageOptions)],
                    test_cases: testCasesPayload,
                },
            }),
        )
    }

    const handlePopularTagSelect = useCallback(
        (selected: string | string[]) => {
            if (!Array.isArray(selected)) return
            setDraft((prev) => {
                const finalLangs = mergeLanguagesFromPopularChipSelection(
                    prev.languages,
                    selected,
                    languagesItems,
                    languageOptions,
                )
                if (!finalLangs.length) {
                    return {
                        ...prev,
                        languages: [],
                        starterLanguage: '',
                        starterCodeByLang: {},
                        referenceSolutionByLang: {},
                    }
                }
                let starterLanguage = prev.starterLanguage
                if (!finalLangs.includes(starterLanguage)) {
                    starterLanguage = finalLangs[0] ?? ''
                }
                const allowed = new Set(finalLangs)
                return {
                    ...prev,
                    languages: finalLangs,
                    starterLanguage,
                    starterCodeByLang: pruneLangRecord(prev.starterCodeByLang, allowed),
                    referenceSolutionByLang: pruneLangRecord(prev.referenceSolutionByLang, allowed),
                }
            })
        },
        [languagesItems, languageOptions],
    )

    const removeLanguage = (value: string) => {
        setDraft((prev) => {
            const languages = prev.languages.filter((x) => x !== value)
            if (!languages.length) {
                return {
                    ...prev,
                    languages: [],
                    starterLanguage: '',
                    starterCodeByLang: {},
                    referenceSolutionByLang: {},
                }
            }
            let starterLanguage = prev.starterLanguage
            if (!languages.includes(starterLanguage)) {
                starterLanguage = languages[0] ?? ''
            }
            const allowed = new Set(languages)
            return {
                ...prev,
                languages,
                starterLanguage,
                starterCodeByLang: pruneLangRecord(prev.starterCodeByLang, allowed),
                referenceSolutionByLang: pruneLangRecord(prev.referenceSolutionByLang, allowed),
            }
        })
    }

    const addExample = () => {
        setDraft((prev) => ({
            ...prev,
            examples: [...prev.examples, createEmptyExample()],
        }))
    }

    const removeExample = (id: string) => {
        setDraft((prev) => {
            if (prev.examples.length <= 1) return prev
            return { ...prev, examples: prev.examples.filter((e) => e.id !== id) }
        })
    }

    const patchExample = (id: string, patch: Partial<CodingExample>) => {
        setDraft((prev) => ({
            ...prev,
            examples: prev.examples.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }))
    }

    const addTestCase = () => {
        setDraft((prev) => ({
            ...prev,
            testCases: [...prev.testCases, createEmptyTestCase()],
        }))
    }

    const removeTestCase = (id: string) => {
        setDraft((prev) => {
            if (prev.testCases.length <= 1) return prev
            return { ...prev, testCases: prev.testCases.filter((t) => t.id !== id) }
        })
    }

    const patchTestCase = (id: string, patch: Partial<CodingTestCase>) => {
        setDraft((prev) => ({
            ...prev,
            testCases: prev.testCases.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }))
    }

    const handleUseActualAsExpectedFromReferenceValidation = useCallback(
        (row: ReferenceSolutionValidationRow) => {
            const key = normalizeIoForMatch(row.input)
            const actual = String(row.actual_output ?? '').trim()
            if (!key || !actual) return
            setDraft((prev) => {
                let hit = false
                const testCases = prev.testCases.map((tc) => {
                    if (normalizeIoForMatch(tc.input) === key) {
                        hit = true
                        return { ...tc, expectedOutput: actual }
                    }
                    return tc
                })
                if (!hit) {
                    showToastMessage('No matching test case found for this input.', 'info')
                    return prev
                }
                return { ...prev, testCases }
            })
        },
        [],
    )

    const starterLanguageOptions = useMemo(() => {
        const allowed = new Set(draft.languages)
        return languageOptions.filter((o) => allowed.has(o.value))
    }, [draft.languages, languageOptions])

    const displayStarterCode = useMemo(() => {
        if (!draft.starterLanguage?.trim() || !draft.languages.length) return ''
        const sl = draft.starterLanguage
        if (Object.prototype.hasOwnProperty.call(draft.starterCodeByLang, sl)) {
            return draft.starterCodeByLang[sl]
        }
        return getDefaultStarterTemplate(sl, labelForLangValue(sl, languageOptions))
    }, [draft.starterLanguage, draft.languages, draft.starterCodeByLang, languageOptions])

    const displayReferenceSolution = useMemo(() => {
        if (!draft.starterLanguage?.trim() || !draft.languages.length) return ''
        const sl = draft.starterLanguage
        if (Object.prototype.hasOwnProperty.call(draft.referenceSolutionByLang, sl)) {
            return draft.referenceSolutionByLang[sl]
        }
        return getDefaultReferenceTemplate(sl, labelForLangValue(sl, languageOptions))
    }, [draft.starterLanguage, draft.languages, draft.referenceSolutionByLang, languageOptions])

    const handleStarterLanguageForCodeChange = useCallback((v: unknown) => {
        const next = String(v ?? '').trim()
        setDraft((prev) => ({ ...prev, starterLanguage: next }))
    }, [])

    const popularSelectedLabels = useMemo(
        () =>
            POPULAR_LABELS.filter((label) =>
                draft.languages.some((v) => {
                    const row = languagesItems.find((i) => i.name === v)
                    return row ? popularLabelForJudgeLanguage(row) === label : false
                }),
            ),
        [draft.languages, languagesItems],
    )

    const handleLoadMoreLanguages = () => {
        if (!languagesHasMore || languagesLoading) return
        dispatch(
            fetchAssessmentLanguagesRequest({
                page: languagesPage + 1,
                pageSize: 100,
                append: true,
            }),
        )
    }

    const pagerSelectedIndex =
        savedProblems.length === 0 ? 0 : draftSource === 'new' ? 0 : draftSource

    const canDelete =
        draftSource !== 'new' ||
        savedProblems.length > 0 ||
        String(draft.title ?? '').trim().length > 0 ||
        hasRichTextContent(draft.problemStatementHtml)

    const codingFormFields = (
        <View style={styles.formFieldsInner}>
            <View style={styles.field}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    Problem title
                    <Typography color={colors.error[400]}> * </Typography>
                </Typography>
                <TextField
                    value={draft.title}
                    onChangeText={(t) => patchDraft({ title: t })}
                    placeholder="e.g. Palindrome"
                    size="Small"
                    disable={testDetail?.is_published}
                    isError={hasTriedSave && Boolean(saveFieldErrors.title)}
                    error={saveFieldErrors.title}
                />
            </View>
            <View style={styles.field}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    Difficulty level
                </Typography>
                <CommonDropdown
                    placeholder="Select difficulty"
                    options={difficultyOptions}
                    value={draft.difficulty}
                    labelKey="label"
                    valueKey="value"
                    onChange={(v) => patchDraft({ difficulty: v as string | null })}
                    disabled={testDetail?.is_published}
                />
            </View>
            <View style={styles.field}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    Points
                </Typography>
                <NumberStepper
                    value={draft.points}
                    onChange={(v) => patchDraft({ points: v })}
                    min={1}
                    unitLabel=""
                    disabled={testDetail?.is_published}
                />
            </View>
            <View style={styles.field}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    Time limit (minutes)
                </Typography>
                <NumberStepper
                    value={draft.timeMinutes}
                    onChange={(v) => patchDraft({ timeMinutes: v })}
                    min={1}
                    unitLabel="min"
                    disabled={testDetail?.is_published}
                />
            </View>
            <ExpandableWrapper
                title="Problem statement"
                subTitle="Describe the problem clearly"
                defaultExpanded
                rightComponent={
                    !testDetail?.is_published ? (
                        <Button
                            size={28}
                            paddingHorizontal={10}
                            buttonColor={colors.brand[50]}
                            borderWidth={1}
                            borderColor={colors.brand[200]}
                            textColor={colors.brand[700]}
                            onPress={() => setShowProblemStatementAi((v) => !v)}
                        >
                            AI
                        </Button>
                    ) : undefined
                }
            >
                <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginBottom: 12 }}>
                    Describe the problem clearly
                </Typography>
                {showProblemStatementAi && !testDetail?.is_published && (
                    <View style={styles.aiGeneratePanel}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                            Generate with AI
                        </Typography>
                        <TextField
                            value={problemStatementAiPrompt}
                            onChangeText={setProblemStatementAiPrompt}
                            placeholder="e.g. Make it about graph traversal…"
                            placeholderTextColor={colors.gray[400]}
                            multiline
                            style={styles.aiPromptInput}
                            editable={!testDetail?.is_published && !codingAiLoading}
                        />
                        <View style={styles.aiGenerateActions}>
                            <Button
                                size={36}
                                paddingHorizontal={20}
                                onPress={handleProblemStatementAiGenerate}
                                disabled={codingAiLoading}
                            >
                                {codingAiLoading ? 'Generating…' : 'Generate'}
                            </Button>
                            <Button
                                size={36}
                                paddingHorizontal={16}
                                buttonColor={colors.base.white}
                                textColor={colors.gray[700]}
                                borderWidth={1}
                                borderColor={colors.gray[300]}
                                onPress={() => {
                                    setProblemStatementAiPrompt('')
                                    setShowProblemStatementAi(false)
                                }}
                                disabled={codingAiLoading}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                )}
                <View style={styles.field}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                            Description (rich text)
                        </Typography>
                        <Typography variant="semiBoldTxtsm" color={colors.error[500]}>
                            *
                        </Typography>
                    </View>
                    <View
                        style={
                            hasTriedSave && saveFieldErrors.problemStatement
                                ? {
                                    borderWidth: 1,
                                    borderColor: colors.error[400],
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                }
                                : undefined
                        }
                    >
                        {testDetail?.is_published ? <TextField
                            value={htmlToPlainText(draft.problemStatementHtml ?? '')}
                            multiline
                            disable={testDetail?.is_published}
                            textAlignVertical="top"
                            style={styles.constraintsInput}
                            height={150}
                        /> :
                            <RichTextField
                                value={draft.problemStatementHtml}
                                onChange={(html: string) => patchDraft({ problemStatementHtml: html })}
                                placeholder="Enter the problem description…"
                            // disabled={testDetail?.is_published}
                            />
                        }
                    </View>
                    {hasTriedSave && !!saveFieldErrors.problemStatement && (
                        <Typography variant="regularTxtsm" color={colors.error[600]} style={{ marginTop: 6 }}>
                            {saveFieldErrors.problemStatement}
                        </Typography>
                    )}
                </View>
                <View style={styles.field}>
                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                        Constraints
                    </Typography>
                    <TextField
                        value={draft.constraints}
                        onChangeText={(t) => patchDraft({ constraints: t })}
                        placeholder={'e.g. 1 <= length of s1, s2 <= 1000'}
                        placeholderTextColor={colors.gray[400]}
                        multiline
                        editable={!testDetail?.is_published}
                        textAlignVertical="top"
                        style={styles.constraintsInput}
                    />
                </View>
            </ExpandableWrapper>

            <ExpandableWrapper
                title="Examples"
                subTitle={`${draft.examples.length} example${draft.examples.length === 1 ? '' : 's'} — visible to candidates`}
                defaultExpanded
                rightComponent={
                    !testDetail?.is_published ? (
                        <Button
                            size={28}
                            paddingHorizontal={10}
                            buttonColor={colors.brand[50]}
                            borderWidth={1}
                            borderColor={colors.brand[200]}
                            textColor={colors.brand[700]}
                            onPress={() => setShowExamplesAi((v) => !v)}
                        >
                            AI
                        </Button>
                    ) : undefined
                }
            >
                {showExamplesAi && !testDetail?.is_published && (
                    <View style={styles.aiGeneratePanel}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                            Generate with AI
                        </Typography>
                        <TextField
                            value={examplesAiPrompt}
                            onChangeText={setExamplesAiPrompt}
                            placeholder="e.g. Include an edge case with an empty array and one with negative numbers…"
                            placeholderTextColor={colors.gray[400]}
                            multiline
                            style={styles.aiPromptInput}
                            editable={!testDetail?.is_published && !codingAiLoading}
                        />
                        <View style={styles.aiGenerateActions}>
                            <Button
                                size={36}
                                paddingHorizontal={20}
                                onPress={handleExamplesAiGenerate}
                                disabled={codingAiLoading}
                            >
                                {codingAiLoading ? 'Generating…' : 'Generate'}
                            </Button>
                            <Button
                                size={36}
                                paddingHorizontal={16}
                                buttonColor={colors.base.white}
                                textColor={colors.gray[700]}
                                borderWidth={1}
                                borderColor={colors.gray[300]}
                                onPress={() => {
                                    setExamplesAiPrompt('')
                                    setShowExamplesAi(false)
                                }}
                                disabled={codingAiLoading}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                )}
                {hasTriedSave && !!saveFieldErrors.examples && (
                    <Typography variant="regularTxtsm" color={colors.error[600]} style={{ marginBottom: 10 }}>
                        {saveFieldErrors.examples}
                    </Typography>
                )}
                <View style={styles.examplesToolbar}>
                    {!testDetail?.is_published && (
                        <>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                Examples are shown to candidates in the problem description.
                            </Typography>
                            <Button size={28} paddingHorizontal={10} onPress={addExample}>
                                + Add example
                            </Button>
                        </>
                    )}
                </View>
                {draft.examples.map((ex, i) => (
                    <View key={ex.id} style={styles.cardBlock}>
                        <View style={styles.cardBlockHeader}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                                Example #{i + 1}
                            </Typography>
                            {!testDetail?.is_published && (
                                <Pressable onPress={() => removeExample(ex.id)} hitSlop={8}>
                                    <SvgXml xml={deleteIcon} color={colors.gray[500]} width={18} height={18} />
                                </Pressable>
                            )}
                        </View>
                        <View style={styles.ioRow}>
                            <View style={styles.ioHalf}>
                                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                                    Input
                                </Typography>
                                <TextField
                                    value={ex.input}
                                    onChangeText={(t) => patchExample(ex.id, { input: t })}
                                    placeholder="Input"
                                    placeholderTextColor={colors.gray[400]}
                                    multiline
                                    editable={!testDetail?.is_published}
                                    style={styles.ioInput}
                                />
                            </View>
                            <View style={styles.ioHalf}>
                                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                                    Output
                                </Typography>
                                <TextField
                                    value={ex.output}
                                    onChangeText={(t) => patchExample(ex.id, { output: t })}
                                    placeholder="Output"
                                    placeholderTextColor={colors.gray[400]}
                                    multiline
                                    editable={!testDetail?.is_published}
                                    style={styles.ioInput}
                                />
                            </View>
                        </View>
                        <Typography variant="semiBoldTxtxs" color={colors.gray[600]} style={{ marginTop: 8 }}>
                            Explanation (optional)
                        </Typography>
                        <TextField
                            value={ex.exploration}
                            onChangeText={(t) => patchExample(ex.id, { exploration: t })}
                            placeholder="Explain why this input produces this output…"
                            placeholderTextColor={colors.gray[400]}
                            multiline
                            editable={!testDetail?.is_published}
                            style={[styles.ioInput, { minHeight: 72 }]}
                        />
                    </View>
                ))}
            </ExpandableWrapper>

            <ExpandableWrapper
                title="Supported languages"
                subTitle={`${draft.languages.length} language${draft.languages.length === 1 ? '' : 's'} selected`}
                defaultExpanded
            >
                {!testDetail?.is_published &&
                    <>
                        {hasTriedSave && !!saveFieldErrors.languages && (
                            <Typography variant="regularTxtsm" color={colors.error[600]} style={{ marginBottom: 10 }}>
                                {saveFieldErrors.languages}
                            </Typography>
                        )}


                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ marginBottom: 8 }}>
                            Popular
                        </Typography>
                        <View style={[styles.popularRow, testDetail?.is_published && { opacity: 0.6 }]}>
                            <TagList
                                data={POPULAR_LABELS}
                                multi
                                selectedItems={popularSelectedLabels}
                                onSelect={testDetail?.is_published ? undefined : handlePopularTagSelect}
                                textColor={colors.gray[800]}
                                bgColor={colors.gray[50]}
                                borderColor={colors.gray[200]}
                                selectedColor={{
                                    text: colors.brand[800],
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                }}
                            />
                        </View>
                    </>
                }
                <View style={{ marginTop: 12 }}>
                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                        All languages
                    </Typography>
                    {!!languagesError && (
                        <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={{ marginBottom: 8 }}>
                            {languagesError}
                        </Typography>
                    )}
                    <CommonDropdown
                        placeholder="Add languages"
                        options={languageOptions}
                        value={draft.languages}
                        labelKey="label"
                        valueKey="value"
                        multiSelect
                        //searchable
                        //searchPlaceholder="Search languages…"
                        onChange={(vals) => {
                            const next = Array.isArray(vals) ? vals : vals ? [vals] : []
                            const norm = normalizeLanguagesToOptions(next as string[], languageOptions)
                            setDraft((prev) => {
                                if (!norm.length) {
                                    return {
                                        ...prev,
                                        languages: [],
                                        starterLanguage: '',
                                        starterCodeByLang: {},
                                        referenceSolutionByLang: {},
                                    }
                                }
                                const starterLanguage = norm.includes(prev.starterLanguage)
                                    ? prev.starterLanguage
                                    : norm[0] ?? ''
                                const allowed = new Set(norm)
                                return {
                                    ...prev,
                                    languages: norm,
                                    starterLanguage,
                                    starterCodeByLang: pruneLangRecord(prev.starterCodeByLang, allowed),
                                    referenceSolutionByLang: pruneLangRecord(prev.referenceSolutionByLang, allowed),
                                }
                            })
                        }}
                        disabled={testDetail?.is_published}
                    />
                    {languagesHasMore && !testDetail?.is_published && (
                        <View style={{ marginTop: 10 }}>
                            <Button
                                size={28}
                                paddingHorizontal={12}
                                buttonColor={colors.gray[100]}
                                textColor={colors.gray[800]}
                                onPress={handleLoadMoreLanguages}
                                disabled={languagesLoading}
                            >
                                {languagesLoading ? 'Loading…' : 'Load more languages'}
                            </Button>
                        </View>
                    )}
                </View>
                {/* <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ marginTop: 12 }}>
                    Selected
                </Typography>
                <View style={styles.chipRow}>
                    {draft.languages.map((lang) => (
                        <View key={lang} style={styles.langChip}>
                            <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                                {labelForLangValue(lang, languageOptions)}
                            </Typography>
                            {!testDetail?.is_published && (
                                <Pressable onPress={() => removeLanguage(lang)} hitSlop={6}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[600]}>
                                        ×
                                    </Typography>
                                </Pressable>
                            )}
                        </View>
                    ))}
                </View> */}
            </ExpandableWrapper>

            <ExpandableWrapper
                title="Test cases"
                subTitle={`${draft.testCases.length} test cases — used for automated evaluation`}
                defaultExpanded
                rightComponent={
                    !testDetail?.is_published ? (
                        <Button
                            size={28}
                            paddingHorizontal={10}
                            buttonColor={colors.brand[50]}
                            borderWidth={1}
                            borderColor={colors.brand[200]}
                            textColor={colors.brand[700]}
                            onPress={() => setShowTestCasesAi((v) => !v)}
                        >
                            AI
                        </Button>
                    ) : undefined
                }
            >
                {showTestCasesAi && !testDetail?.is_published && (
                    <View style={[styles.aiGeneratePanel, { marginBottom: 12 }]}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                            Generate with AI
                        </Typography>
                        <TextField
                            value={testCasesAiPrompt}
                            onChangeText={setTestCasesAiPrompt}
                            placeholder="e.g. Include edge cases with empty input, single element, and large arrays…"
                            placeholderTextColor={colors.gray[400]}
                            multiline
                            style={styles.aiPromptInput}
                            editable={!testDetail?.is_published && !codingAiLoading}
                        />
                        <View style={styles.aiGenerateActions}>
                            <Button
                                size={36}
                                paddingHorizontal={20}
                                onPress={handleTestCasesAiGenerate}
                                disabled={codingAiLoading}
                            >
                                {codingAiLoading ? 'Generating…' : 'Generate'}
                            </Button>
                            <Button
                                size={36}
                                paddingHorizontal={16}
                                buttonColor={colors.base.white}
                                textColor={colors.gray[700]}
                                borderWidth={1}
                                borderColor={colors.gray[300]}
                                onPress={() => {
                                    setTestCasesAiPrompt('')
                                    setShowTestCasesAi(false)
                                }}
                                disabled={codingAiLoading}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                )}
                <Typography variant="regularTxtxs" color={colors.gray[600]} style={{ marginBottom: 8 }}>
                    Test cases are used for automated grading. They are not visible to candidates.
                </Typography>
                {hasTriedSave && !!saveFieldErrors.testCases && (
                    <Typography variant="regularTxtsm" color={colors.error[600]} style={{ marginBottom: 10 }}>
                        {saveFieldErrors.testCases}
                    </Typography>
                )}
                <View style={styles.examplesToolbar}>
                    {!testDetail?.is_published && (
                        <>
                            <Button size={28} paddingHorizontal={10} onPress={addTestCase}>
                                + Add test case
                            </Button>
                        </>
                    )}
                </View>
                {draft.testCases.map((tc, i) => (
                    <View key={tc.id} style={styles.cardBlock}>
                        <View style={styles.cardBlockHeader}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                                Test #{i + 1}
                            </Typography>
                            {!testDetail?.is_published && (
                                <Pressable onPress={() => removeTestCase(tc.id)} hitSlop={8}>
                                    <SvgXml xml={deleteIcon} color={colors.gray[500]} width={18} height={18} />
                                </Pressable>
                            )}
                        </View>
                        <View style={styles.ioRow}>
                            <View style={styles.ioHalf}>
                                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                                    Input
                                </Typography>
                                <TextField
                                    value={tc.input}
                                    onChangeText={(t) => patchTestCase(tc.id, { input: t })}
                                    placeholder="Input"
                                    placeholderTextColor={colors.gray[400]}
                                    multiline
                                    editable={!testDetail?.is_published}
                                    style={styles.ioInput}
                                />
                            </View>
                            <View style={styles.ioHalf}>
                                <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                                    Expected output
                                </Typography>
                                <TextField
                                    value={tc.expectedOutput}
                                    onChangeText={(t) => patchTestCase(tc.id, { expectedOutput: t })}
                                    placeholder="Expected output"
                                    placeholderTextColor={colors.gray[400]}
                                    multiline
                                    editable={!testDetail?.is_published}
                                    style={styles.ioInput}
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </ExpandableWrapper>

            <ExpandableWrapper
                title="Starter code"
                subTitle='Optional boilerplate shown to candidates'
                defaultExpanded
            >
                {showStarterCodeAi && !testDetail?.is_published && (
                    <View style={[styles.aiGeneratePanel, { marginBottom: 12 }]}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                            Generate with AI
                        </Typography>
                        <TextField
                            value={starterCodeAiPrompt}
                            onChangeText={setStarterCodeAiPrompt}
                            placeholder="e.g. Add stdin/stdout scaffolding and a comment for candidates to fill in…"
                            placeholderTextColor={colors.gray[400]}
                            multiline
                            style={styles.aiPromptInput}
                            editable={!testDetail?.is_published && !codingAiLoading}
                        />
                        <View style={styles.aiGenerateActions}>
                            <Button
                                size={36}
                                paddingHorizontal={20}
                                onPress={handleStarterCodeAiGenerate}
                                disabled={codingAiLoading}
                            >
                                Generate
                            </Button>
                            <Button
                                size={36}
                                paddingHorizontal={16}
                                buttonColor={colors.base.white}
                                textColor={colors.gray[700]}
                                borderWidth={1}
                                borderColor={colors.gray[300]}
                                onPress={() => {
                                    setStarterCodeAiPrompt('')
                                    setShowStarterCodeAi(false)
                                }}
                                disabled={codingAiLoading}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                )}
                {!draft.languages.length && !testDetail?.is_published && (
                    <Typography variant="regularTxtxs" color={colors.gray[500]} style={{ marginBottom: 10 }}>
                        Select at least one supported language above to add starter code.
                    </Typography>
                )}
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    Language
                </Typography>
                <CommonDropdown
                    placeholder={
                        draft.languages.length ? 'Select language' : 'Add supported languages first'
                    }
                    options={starterLanguageOptions}
                    value={draft.starterLanguage || undefined}
                    labelKey="label"
                    valueKey="value"
                    onChange={handleStarterLanguageForCodeChange}
                />
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ marginTop: 12 }}>
                    Code
                </Typography>
                <CodeEditorInput
                    value={
                        draft.languages.length > 0 && draft.starterLanguage
                            ? displayStarterCode
                            : ''
                    }
                    onChangeText={(t) =>
                        setDraft((prev) => {
                            const sl = prev.starterLanguage
                            if (!sl) return prev
                            return {
                                ...prev,
                                starterCodeByLang: { ...prev.starterCodeByLang, [sl]: t },
                            }
                        })
                    }
                    editable={
                        !testDetail?.is_published &&
                        draft.languages.length > 0 &&
                        Boolean(draft.starterLanguage?.trim())
                    }
                    placeholder=""
                />
            </ExpandableWrapper>

            <ExpandableWrapper
                title="Reference solutions"
                subTitle='Internal — not shown to candidates'
                defaultExpanded={false}
                expanded={referenceSolutionsExpanded}
                onExpandedChange={setReferenceSolutionsExpanded}
                rightComponent={
                    !testDetail?.is_published ? (
                        <Button
                            size={28}
                            paddingHorizontal={10}
                            buttonColor={colors.brand[50]}
                            borderWidth={1}
                            borderColor={colors.brand[200]}
                            textColor={colors.brand[700]}
                            onPress={() => setShowReferenceSolutionsAi((v) => !v)}
                        >
                            AI
                        </Button>
                    ) : undefined
                }
            >
                <View style={{ gap: 20 }}>
                    {showReferenceSolutionsAi && !testDetail?.is_published && (
                        <View style={styles.aiGeneratePanel}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                                Generate with AI
                            </Typography>
                            <TextField
                                value={referenceSolutionsAiPrompt}
                                onChangeText={setReferenceSolutionsAiPrompt}
                                placeholder="e.g. Use a hash map for O(n) time complexity, add comments…"
                                placeholderTextColor={colors.gray[400]}
                                multiline
                                style={styles.aiPromptInput}
                                editable={!testDetail?.is_published && !codingAiLoading}
                            />
                            <View style={styles.aiGenerateActions}>
                                <Button
                                    size={36}
                                    paddingHorizontal={20}
                                    onPress={handleReferenceSolutionsAiGenerate}
                                    disabled={codingAiLoading}
                                >
                                    {codingAiLoading ? 'Generating…' : 'Generate'}
                                </Button>
                                <Button
                                    size={36}
                                    paddingHorizontal={16}
                                    buttonColor={colors.base.white}
                                    textColor={colors.gray[700]}
                                    borderWidth={1}
                                    borderColor={colors.gray[300]}
                                    onPress={() => {
                                        setReferenceSolutionsAiPrompt('')
                                        setShowReferenceSolutionsAi(false)
                                    }}
                                    disabled={codingAiLoading}
                                >
                                    Cancel
                                </Button>
                            </View>
                        </View>
                    )}
                    <View>
                        {!draft.languages.length && !testDetail?.is_published && (
                            <Typography variant="regularTxtxs" color={colors.gray[500]} style={{ marginBottom: 10 }}>
                                Select at least one supported language above to add a reference solution.
                            </Typography>
                        )}
                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                            Language
                        </Typography>
                        <CommonDropdown
                            placeholder={
                                draft.languages.length ? 'Select language' : 'Add supported languages first'
                            }
                            options={starterLanguageOptions}
                            value={draft.starterLanguage || undefined}
                            labelKey="label"
                            valueKey="value"
                            onChange={handleStarterLanguageForCodeChange}
                        />
                    </View>
                    {unresolvedReferenceValidationErrors.length > 0 && (
                        <ReferenceSolutionValidationErrorPanel
                            rows={unresolvedReferenceValidationErrors}
                            onUseActualAsExpected={handleUseActualAsExpectedFromReferenceValidation}
                        />
                    )}
                    <View>
                        <CodeEditorInput
                            value={
                                draft.languages.length > 0 && draft.starterLanguage
                                    ? displayReferenceSolution
                                    : ''
                            }
                            onChangeText={(t) =>
                                setDraft((prev) => {
                                    const sl = prev.starterLanguage
                                    if (!sl) return prev
                                    return {
                                        ...prev,
                                        referenceSolutionByLang: { ...prev.referenceSolutionByLang, [sl]: t },
                                    }
                                })
                            }
                            editable={
                                !testDetail?.is_published &&
                                draft.languages.length > 0 &&
                                Boolean(draft.starterLanguage?.trim())
                            }
                            placeholder=""
                            containerStyle={{ marginTop: 10 }}
                        />
                    </View>
                </View>
            </ExpandableWrapper>

            {!!postQuestionError && (
                <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={styles.fieldErrorText}>
                    {postQuestionError}
                </Typography>
            )}
            {!!updateQuestionError && (
                <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={styles.fieldErrorText}>
                    {updateQuestionError}
                </Typography>
            )}
            {!!deleteQuestionError && (
                <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={styles.fieldErrorText}>
                    {deleteQuestionError}
                </Typography>
            )}
        </View>
    )

    const showPreview =
        String(draft.title ?? '').trim().length > 0 || hasRichTextContent(draft.problemStatementHtml ?? '')

    return (
        <CustomSafeAreaView style={styles.safe}>
            <Header title="Questions Creation" backNavigation onBack={goBack} threedot />
            <View style={styles.tabBarWrap}>
                <SlideAnimatedTab
                    tabs={[...QUESTION_CREATION_TABS]}
                    activeTab={creationTab}
                    onChangeTab={(label) => setCreationTab(label)}
                />
                <Divider />
            </View>

            {creationTab === 'Questions' ? (
                <View style={styles.body}>
                    {showQuestionsTabShimmer ? (
                        <CodingQuestionsTabShimmer />
                    ) : (
                        <>
                            <ScrollView
                                style={styles.scroll}
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                <View style={{ padding: 16, gap: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="semiBoldTxtmd" style={{ flex: 1 }}>
                                            {testDetail?.title}
                                        </Typography>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ paddingHorizontal: 10 }}>
                                            {capitalizeFirstLetter(testDetail?.test_type)}
                                        </Typography>
                                        <Button
                                            paddingHorizontal={10}
                                            buttonColor={testDetail?.is_published ? colors.success[25] : colors.brand[600]}
                                            textColor={testDetail?.is_published ? colors.success[500] : colors.base.white}
                                            borderWidth={testDetail?.is_published ? 1 : 0}
                                            borderColor={testDetail?.is_published ? colors.success[200] : ''}
                                            borderRadius={10}
                                            disabled={!testId || publishTestLoading || Boolean(testDetail?.is_published)}
                                            onPress={handlePublish}
                                            startIcon={
                                                !testDetail?.is_published ? (
                                                    <SvgXml xml={downloadIcon} height={18} width={18} color={colors.base.white} />
                                                ) : (
                                                    ''
                                                )
                                            }
                                        >
                                            {testDetail?.is_published
                                                ? 'Published'
                                                : publishTestLoading
                                                    ? 'Publishing…'
                                                    : 'Publish'}
                                        </Button>
                                    </View>
                                    {!!publishTestError && (
                                        <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={styles.fieldErrorText}>
                                            {publishTestError}
                                        </Typography>
                                    )}
                                    {!!testDetailError && (
                                        <Typography variant="semiBoldTxtxs" color={colors.error[600]} style={styles.fieldErrorText}>
                                            {testDetailError}
                                        </Typography>
                                    )}
                                    {!!questionsError && (
                                        <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                            {questionsError}
                                        </Typography>
                                    )}
                                </View>
                                <View style={styles.questionHeader}>
                                    <Typography variant="semiBoldTxtmd">Total Questions : {savedProblems.length}</Typography>
                                    {!testDetail?.is_published && (
                                        <View style={styles.questionHeaderActions}>
                                            <Pressable
                                                onPress={openDeleteModal}
                                                disabled={!canDelete || deleteQuestionLoading}
                                                style={{ opacity: !canDelete || deleteQuestionLoading ? 0.4 : 1 }}
                                            >
                                                <SvgXml xml={deleteIcon} color={colors.error[500]} />
                                            </Pressable>
                                            <View style={styles.headerDivider} />
                                            <Button paddingHorizontal={12} size={36} onPress={addQuiz} disabled={testDetail?.is_published}>
                                                + Add
                                            </Button>
                                        </View>
                                    )}
                                </View>
                                <Divider />
                                {showPreview && (
                                    <View style={styles.previewSection}>
                                        <View style={styles.selectedQuestionCard}>
                                            <View style={styles.previewMetaRow}>
                                                <View style={styles.previewMetaLeft}>
                                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                                        Coding · {draft.points} pts · {draft.timeMinutes}m · {draft.languages.length}{' '}
                                                        lang · {draft.testCases.length} tests
                                                    </Typography>
                                                </View>
                                                <View style={styles.difficultyPill}>
                                                    <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                                                        {capitalizeFirstLetter(String(draft.difficulty ?? '—'))}
                                                    </Typography>
                                                </View>
                                            </View>
                                            <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.previewQuestionBody}>
                                                {String(draft.title ?? '').trim()  ||'—'}
                                            </Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.form}>{codingFormFields}</View>
                            </ScrollView>
                            <View>
                                <QuizChipsPager
                                    count={savedProblems.length}
                                    selectedIndex={pagerSelectedIndex}
                                    onSelect={handleChipSelect}
                                    labelPrefix={"code"}
                                />
                                {!testDetail?.is_published && (
                                    <View style={[styles.saveRow, { marginBottom: insets.insetsBottom }]}>
                                        <Button
                                            disabled={postQuestionLoading || updateQuestionLoading || deleteQuestionLoading}
                                            size={40}
                                            onPress={handleSave}
                                            style={styles.saveButton}
                                        >
                                            Save
                                        </Button>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>
            ) : creationTab === 'Generate' ? (
                <View style={styles.tabPanel}>
                    <AiCodingTestQuestion
                        embedded
                        testId={testId ?? testDetail?.id ?? null}
                        testDetailTitle={testDetail?.title}
                        isPublished={Boolean(testDetail?.is_published)}
                        onApplyToDraft={(patch) => {
                            setDraft((prev) => {
                                const next = { ...prev, ...patch }
                                const langs = patch.languages ?? prev.languages
                                if (langs?.length && (!next.starterLanguage || !langs.includes(next.starterLanguage))) {
                                    next.starterLanguage = langs[0] ?? ''
                                }
                                return next
                            })
                        }}
                    />
                </View>
            ) : (
                <View style={[styles.tabPanel, { marginTop: 10 }]}>
                    <CreateAssessmentTest embedded />
                </View>
            )}

            <ConfirmModal
                visible={deleteModalVisible}
                title="Delete question"
                message="Delete this question? This can't be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setDeleteModalVisible(false)}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                confirmButtonProps={{ disabled: deleteQuestionLoading }}
            />
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    tabBarWrap: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    tabPanel: {
        flex: 1,
        backgroundColor: colors.base.white,
    },
    body: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 8,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    questionHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerDivider: {
        borderWidth: 1,
        height: 24,
        borderColor: colors.gray[200],
    },
    previewSection: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        gap: 10,
        backgroundColor: colors.base.white,
    },
    selectedQuestionCard: {},
    previewMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    previewMetaLeft: {
        flex: 1,
        paddingRight: 10,
    },
    difficultyPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: colors.gray[50],
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    previewQuestionBody: {
        lineHeight: 22,
    },
    form: {
        padding: 16,
    },
    formFieldsInner: {
        gap: 16,
    },
    field: {
        gap: 4,
    },
    examplesToolbar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    cardBlock: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: colors.gray[25],
    },
    cardBlockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ioRow: {
        flex: 1,
        gap: 8
    },
    ioHalf: {
        flex: 1,
        minWidth: 120,
        gap: 4,
    },
    ioInput: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 8,
        padding: 10,
        minHeight: 72,
        fontSize: 14,
        color: colors.gray[900],
        backgroundColor: colors.base.white,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    langChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.brand[50],
        borderWidth: 1,
        borderColor: colors.brand[200],
    },
    fieldErrorText: {
        paddingLeft: 4,
        marginTop: 8,
    },
    aiGeneratePanel: {
        backgroundColor: colors.brand[50],
        borderWidth: 1,
        borderColor: colors.brand[200],
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    aiPromptInput: {
        minHeight: 72,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: colors.gray[900],
        backgroundColor: colors.base.white,
        marginBottom: 12,
    },
    aiGenerateActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        paddingTop: 10
    },
    constraintsInput: {
        minHeight: 88,
        marginTop: 4,
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 8,
        padding: 10,
        fontSize: 13,
        color: colors.gray[900],
        backgroundColor: colors.gray[50],
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    popularRow: {
        alignSelf: 'flex-start',
    },
    saveRow: {
        borderTopWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    shimmerFooter: {
        borderTopWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 12,
    },
    saveButton: {
        alignSelf: 'stretch',
    },
})

export default CodingTestQuestion

