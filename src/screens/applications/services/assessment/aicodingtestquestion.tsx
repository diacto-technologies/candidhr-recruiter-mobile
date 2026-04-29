import { View, ScrollView, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SvgXml } from 'react-native-svg'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    Button,
    TextField,
    Typography,
    CommonDropdown,
    CodeEditorInput,
    ReferenceSolutionValidationErrorPanel,
    normalizeIoForMatch,
    filterUnresolvedReferenceValidationRows,
} from '../../../../components'
import Card from '../../../../components/atoms/card'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import NumberStepper from '../../../../components/atoms/numberstepper'
import TagList from '../../../../components/molecules/taglist'
import ExpandableWrapper from '../../../../components/molecules/expandablewrapper'
import { colors } from '../../../../theme/colors'
import { sparkles } from '../../../../assets/svg/sparkles'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import { showToastMessage } from '../../../../utils/toast'
import CustomTimeline from '../../applicantdetails/tabs/assessment/timelinecard'
import { fetchAssessmentLanguagesRequest, submitProblemQuestionRequest } from '../../../../features/assessments/slice'
import {
    generateCodingProblemMetadataRequestAction,
    generateCodingTestcasesSnippetsRequestAction,
    generateCodingReferenceSolutionRequestAction,
} from '../../../../features/assessments/actions'
import { registerGenerateCodingMetadataCallbacks } from '../../../../features/assessments/generateCodingMetadataCallbacks'
import { registerGenerateCodingTestcasesCallbacks } from '../../../../features/assessments/generateCodingTestcasesCallbacks'
import { registerGenerateCodingReferenceSolutionCallbacks } from '../../../../features/assessments/generateCodingReferenceSolutionCallbacks'
import {
    selectAssessmentLanguagesItems,
    selectAssessmentLanguagesListLoading,
    selectAssessmentLanguagesListError,
    selectAssessmentLanguagesListHasMore,
    selectAssessmentLanguagesListPage,
    selectPostAssessmentQuestionLoading,
    selectPostAssessmentQuestionReferenceSolutionErrors,
} from '../../../../features/assessments/selectors'
import type { ReferenceSolutionValidationRow } from '../../../../features/assessments/types'
import {
    type CodingProblemFormState,
    type CodingExample,
    type CodingTestCase,
    DEFAULT_DIFFICULTY,
    DEFAULT_POINTS,
    DEFAULT_TIME_MIN,
    POPULAR_LABELS,
    FALLBACK_LANGUAGE_OPTIONS,
    normalizeLanguagesToOptions,
    mergeLanguagesFromPopularChipSelection,
    popularLabelForJudgeLanguage,
    pruneLangRecord,
    buildCodingProblemQuestionPayload,
    labelForLangValue,
    plainProblemDescriptionToHtml,
    formatMetadataExampleInput,
    resolveLangToken,
    hasRichTextContent,
    getDefaultStarterTemplate,
    htmlToPlainText,
} from './codingProblemShared'
import Feather from 'react-native-vector-icons/Feather'
import { useRoute } from '@react-navigation/native'
import FooterButtons from '../../../../components/molecules/footerbuttons'

const REGEN_METADATA_HINT =
    'Enter a new prompt to regenerate description & constraints:'
const REGEN_TESTCASES_HINT = 'Enter instructions to regenerate test cases & snippets:'
const REGEN_REFERENCE_HINT = 'Enter instructions to regenerate the reference solution:'

const scheduleMicrotask = (fn: () => void) => {
    setTimeout(fn, 0)
}

export type AiCodingTestQuestionProps = {
    embedded?: boolean
    testId?: string | null
    testDetailTitle?: string
    isPublished?: boolean
    /** Merges generated content into the open coding draft on the Questions tab. */
    onApplyToDraft: (patch: Partial<CodingProblemFormState>) => void
}

function createEmptyStudioDraft(): CodingProblemFormState {
    return {
        instructions: '',
        localId: `studio-${Date.now()}`,
        serverQuestionId: null,
        title: '',
        difficulty: DEFAULT_DIFFICULTY,
        points: DEFAULT_POINTS,
        timeMinutes: DEFAULT_TIME_MIN,
        problemStatementHtml: '',
        constraints: '',
        examples: [],
        testCases: [],
        languages: [],
        starterLanguage: '',
        starterCodeByLang: {},
        referenceSolutionByLang: {},
    }
}

type StepKey = 'metadata' | 'testcases' | 'reference'
type StepState = 'idle' | 'pending' | 'done' | 'error' | 'skipped'

function defaultStepRecord(): Record<StepKey, StepState> {
    return { metadata: 'idle', testcases: 'idle', reference: 'idle' }
}

function getDefaultReferenceTemplate(langValue: string, displayLabel: string): string {
    return `// Reference solution for ${displayLabel}
// (internal — not shown to candidates)
`
}

function snapshotStudio(
    d: CodingProblemFormState,
    descriptionPlain: string,
    constraintsPlain: string,
): string {
    return JSON.stringify({
        title: d.title,
        descriptionPlain,
        constraintsPlain,
        langs: [...d.languages].sort().join('|'),
        starterLanguage: d.starterLanguage,
    })
}

type GeneratorValidationErrors = {
    title?: string
    aiPrompt?: string
    languages?: string
}

function validateGeneratorFields(
    title: string,
    prompt: string,
    languages: string[],
): GeneratorValidationErrors {
    const e: GeneratorValidationErrors = {}
    if (!String(title ?? '').trim()) {
        e.title = 'Title is required.'
    }
    if (!String(prompt ?? '').trim()) {
        e.aiPrompt = 'AI prompt is required.'
    }
    if (!languages?.length) {
        e.languages = 'Select at least one language.'
    }
    return e
}

function hasGeneratorFieldErrors(e: GeneratorValidationErrors): boolean {
    return Object.keys(e).length > 0
}

function toastFirstGeneratorError(e: GeneratorValidationErrors) {
    const msg = e.title ?? e.aiPrompt ?? e.languages
    if (msg) showToastMessage(msg, 'info')
}

const AiCodingTestQuestion = ({
    embedded = false,
    testId,
    testDetailTitle: _testDetailTitle,
    isPublished = false,
    onApplyToDraft,
}: AiCodingTestQuestionProps) => {
    const dispatch = useDispatch()
    const idRef = useRef(0)
    const stableSnapshotRef = useRef<string | null>(null)
    const nextId = (prefix: string) => {
        idRef.current += 1
        return `${prefix}-${idRef.current}`
    }
    const route = useRoute<any>()
    const assessmentId = route.params?.assessmentId ?? testId

    const languagesItems = useSelector(selectAssessmentLanguagesItems)
    const languagesLoading = useSelector(selectAssessmentLanguagesListLoading)
    const languagesError = useSelector(selectAssessmentLanguagesListError)
    const languagesHasMore = useSelector(selectAssessmentLanguagesListHasMore)
    const languagesPage = useSelector(selectAssessmentLanguagesListPage)
    const postQuestionLoading = useSelector(selectPostAssessmentQuestionLoading)
    const referenceSolutionValidationErrors = useSelector(
        selectPostAssessmentQuestionReferenceSolutionErrors,
    )

    const [draft, setDraft] = useState<CodingProblemFormState>(() => createEmptyStudioDraft())
    const unresolvedReferenceValidationErrors = useMemo(
        () =>
            filterUnresolvedReferenceValidationRows(
                referenceSolutionValidationErrors,
                draft.testCases,
            ),
        [referenceSolutionValidationErrors, draft.testCases],
    )
    const [aiPrompt, setAiPrompt] = useState('')
    const [examplesToGenerate, setExamplesToGenerate] = useState(2)
    const [testCasesToGenerate, setTestCasesToGenerate] = useState(3)
    const [descriptionPlain, setDescriptionPlain] = useState('')
    const [constraintsPlain, setConstraintsPlain] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    /** After first Generate click, show the full studio output (status row, cards). */
    const [showGenerationOutput, setShowGenerationOutput] = useState(false)
    const [genSteps, setGenSteps] = useState<Record<StepKey, StepState>>(() => defaultStepRecord())
    const [staleBannerDismissed, setStaleBannerDismissed] = useState(false)
    const [partialRegen, setPartialRegen] = useState<StepKey | null>(null)
    /** After Generate / Apply / Save attempt, show inline field errors (title, prompt, languages). */
    const [showGeneratorValidation, setShowGeneratorValidation] = useState(false)
    /** Inline "Generate with AI" panel from Feather refresh (metadata / test cases / reference). */
    const [sectionRegenPanel, setSectionRegenPanel] = useState<
        null | 'metadata' | 'testcases' | 'reference'
    >(null)
    const [sectionRegenPrompt, setSectionRegenPrompt] = useState('')

    const languageOptions = useMemo(() => {
        if (languagesItems.length > 0) {
            return languagesItems.map((x) => ({ label: x.display_name, value: x.name }))
        }
        return FALLBACK_LANGUAGE_OPTIONS
    }, [languagesItems])

    const difficultyLabel = useMemo(() => {
        const d = String(draft.difficulty ?? DEFAULT_DIFFICULTY).toLowerCase()
        if (d === 'easy') return 'Easy'
        if (d === 'hard') return 'Hard'
        return 'Medium'
    }, [draft.difficulty])

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

    const generatorFieldErrors = useMemo((): GeneratorValidationErrors => {
        if (!showGeneratorValidation) return {}
        return validateGeneratorFields(draft.title, aiPrompt, draft.languages)
    }, [showGeneratorValidation, draft.title, draft.languages, aiPrompt])

    const currentSnapshot = useMemo(
        () => snapshotStudio(draft, descriptionPlain, constraintsPlain),
        [draft, descriptionPlain, constraintsPlain],
    )

    const showStaleBanner =
        Boolean(stableSnapshotRef.current) &&
        stableSnapshotRef.current !== currentSnapshot &&
        !staleBannerDismissed

    useEffect(() => {
        dispatch(fetchAssessmentLanguagesRequest({ page: 1, pageSize: 100, append: false }))
    }, [dispatch])

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

    const handlePopularTagSelect = useCallback(
        (selected: string | string[]) => {
            if (!Array.isArray(selected)) return
            if (isPublished) return
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
        [isPublished, languagesItems, languageOptions],
    )

    const handleStarterLanguageForCodeChange = useCallback((v: unknown) => {
        const next = String(v ?? '').trim()
        setDraft((prev) => ({ ...prev, starterLanguage: next }))
    }, [])

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

    const buildMergedDraft = useCallback((): CodingProblemFormState => {
        return {
            ...draft,
            problemStatementHtml: plainProblemDescriptionToHtml(descriptionPlain),
            constraints: constraintsPlain,
        }
    }, [draft, descriptionPlain, constraintsPlain])

    const runReferenceSolutionForDraft = useCallback(
        (draftForRef: CodingProblemFormState, prompt: string) => {
            const testCasesPayload = draftForRef.testCases
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
                setGenSteps((s) => ({ ...s, reference: 'skipped' }))
                setAiLoading(false)
                showToastMessage('Metadata and test cases generated. Add test cases for reference solution.', 'info')
                stableSnapshotRef.current = snapshotStudio(
                    draftForRef,
                    htmlToPlainText(draftForRef.problemStatementHtml ?? ''),
                    draftForRef.constraints ?? '',
                )
                return
            }
            const langLabels = draftForRef.languages.map((v) => labelForLangValue(v, languageOptions))
            if (langLabels.length === 0) {
                setGenSteps((s) => ({ ...s, reference: 'skipped' }))
                setAiLoading(false)
                return
            }
            setGenSteps((s) => ({ ...s, reference: 'pending' }))
            const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
            registerGenerateCodingReferenceSolutionCallbacks(requestId, {
                onSuccess: (rows) => {
                    setAiLoading(false)
                    setPartialRegen(null)
                    setGenSteps((s) => ({ ...s, reference: 'done' }))
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
                    stableSnapshotRef.current = snapshotStudio(
                        draftForRef,
                        htmlToPlainText(draftForRef.problemStatementHtml ?? ''),
                        draftForRef.constraints ?? '',
                    )
                    showToastMessage('Generated metadata, test cases, snippets, and reference solution.', 'success')
                },
                onError: () => {
                    setAiLoading(false)
                    setPartialRegen(null)
                    setGenSteps((s) => ({ ...s, reference: 'error' }))
                },
            })
            dispatch(
                generateCodingReferenceSolutionRequestAction({
                    requestId,
                    payload: {
                        title: draftForRef.title.trim() || 'Untitled',
                        ai_prompt: prompt.trim(),
                        constraints: draftForRef.constraints?.trim() ?? '',
                        description: draftForRef.problemStatementHtml ?? '',
                        languages: langLabels,
                        test_cases: testCasesPayload,
                    },
                }),
            )
        },
        [dispatch, languageOptions],
    )

    const runTestcasesForDraft = useCallback(
        (nextDraft: CodingProblemFormState, prompt: string) => {
            if (!hasRichTextContent(nextDraft.problemStatementHtml ?? '')) {
                showToastMessage('Problem description is empty.', 'info')
                setAiLoading(false)
                setGenSteps((s) => ({ ...s, testcases: 'error' }))
                return
            }
            if (!nextDraft.languages?.length) {
                showToastMessage('Select at least one supported language.', 'info')
                setAiLoading(false)
                setGenSteps((s) => ({ ...s, testcases: 'error' }))
                return
            }
            const supportedLabels = nextDraft.languages.map((v) => labelForLangValue(v, languageOptions))
            const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
            setGenSteps((s) => ({ ...s, testcases: 'pending' }))
            registerGenerateCodingTestcasesCallbacks(requestId, {
                onSuccess: (data) => {
                    const testsRaw = Array.isArray(data.test_cases) ? data.test_cases : []
                    const snippetsRaw = Array.isArray(data.code_snippets) ? data.code_snippets : []
                    setDraft((prev) => {
                        const mapped: CodingTestCase[] = testsRaw.map(
                            (t: { input?: string; expected_output?: string; expectedOutput?: string }) => ({
                                id: nextId('tc'),
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
                        let starterLanguage = prev.starterLanguage
                        if (!starterLanguage && prev.languages.length) {
                            starterLanguage = prev.languages[0] ?? ''
                        }
                        const merged: CodingProblemFormState = {
                            ...prev,
                            testCases: nextTestCases,
                            starterCodeByLang: starterPatch,
                            starterLanguage,
                        }
                        setGenSteps((s) => ({ ...s, testcases: 'done' }))
                        scheduleMicrotask(() => runReferenceSolutionForDraft(merged, prompt))
                        return merged
                    })
                },
                onError: () => {
                    setAiLoading(false)
                    setPartialRegen(null)
                    setGenSteps((s) => ({ ...s, testcases: 'error' }))
                    showToastMessage('Metadata generated; test case generation failed.', 'info')
                },
            })
            dispatch(
                generateCodingTestcasesSnippetsRequestAction({
                    requestId,
                    payload: {
                        title: nextDraft.title.trim() || 'Untitled',
                        ai_prompt: prompt.trim(),
                        constraints: nextDraft.constraints?.trim() ?? '',
                        description: nextDraft.problemStatementHtml ?? '',
                        supported_languages: supportedLabels,
                        test_cases_count: Math.min(20, Math.max(1, testCasesToGenerate || 1)),
                    },
                }),
            )
        },
        [languageOptions, testCasesToGenerate, runReferenceSolutionForDraft],
    )

    const applyMetadataResponse = useCallback(
        (data: {
            problem_description?: string
            constraints?: string
            examples?: Array<{ input?: unknown; output?: unknown; explanation?: string }>
            duration?: number
            difficulty_level?: string
            title?: string
        }) => {
            const ex = Array.isArray(data.examples) ? data.examples : []
            const mappedExamples: CodingExample[] = ex.map(
                (raw: { input?: unknown; output?: unknown; explanation?: string }) => ({
                    id: nextId('ex'),
                    input: formatMetadataExampleInput(raw?.input),
                    output: String(raw?.output ?? ''),
                    exploration: String(raw?.explanation ?? ''),
                }),
            )
            const problemText = String(data.problem_description ?? '')
            const constraintsText = data.constraints != null ? String(data.constraints) : ''
            setDraft((prev) => {
                const next: CodingProblemFormState = {
                    ...prev,
                    title:
                        typeof data.title === 'string' && data.title.trim()
                            ? data.title.trim()
                            : prev.title.trim() || 'Untitled',
                    problemStatementHtml: plainProblemDescriptionToHtml(problemText),
                    constraints: constraintsText,
                    timeMinutes:
                        typeof data.duration === 'number' && data.duration > 0
                            ? Math.round(data.duration)
                            : prev.timeMinutes,
                    difficulty:
                        typeof data.difficulty_level === 'string' && data.difficulty_level
                            ? String(data.difficulty_level).toLowerCase()
                            : prev.difficulty,
                    examples: mappedExamples.length ? mappedExamples : prev.examples,
                }
                return next
            })
            setDescriptionPlain(problemText)
            setConstraintsPlain(constraintsText)
        },
        [],
    )

    const runMetadataOnly = useCallback(
        (promptOverride?: string) => {
            setShowGeneratorValidation(true)
            const effectivePrompt = String(promptOverride ?? aiPrompt).trim()
            const fieldErrs = validateGeneratorFields(draft.title, effectivePrompt, draft.languages)
            if (hasGeneratorFieldErrors(fieldErrs)) {
                toastFirstGeneratorError(fieldErrs)
                return
            }
            if (aiLoading) return
            setSectionRegenPanel(null)
            const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
            setPartialRegen('metadata')
            setAiLoading(true)
            setGenSteps((s) => ({ ...s, metadata: 'pending' }))
            registerGenerateCodingMetadataCallbacks(requestId, {
                onSuccess: (data) => {
                    applyMetadataResponse(data)
                    setGenSteps((s) => ({ ...s, metadata: 'done' }))
                    setAiLoading(false)
                    setPartialRegen(null)
                    showToastMessage('Problem description updated.', 'success')
                },
                onError: () => {
                    setAiLoading(false)
                    setPartialRegen(null)
                    setGenSteps((s) => ({ ...s, metadata: 'error' }))
                },
            })
            dispatch(
                generateCodingProblemMetadataRequestAction({
                    requestId,
                    payload: {
                        title: draft.title.trim() || 'Untitled',
                        difficulty_level: draft.difficulty || DEFAULT_DIFFICULTY,
                        duration: Math.max(1, draft.timeMinutes),
                        ai_prompt: effectivePrompt,
                        examples_count: Math.min(10, Math.max(1, examplesToGenerate)),
                    },
                }),
            )
        },
        [
            aiPrompt,
            aiLoading,
            applyMetadataResponse,
            dispatch,
            draft.title,
            draft.timeMinutes,
            draft.difficulty,
            examplesToGenerate,
            draft.languages,
        ],
    )

    const handleGenerate = () => {
        if (isPublished) return
        const tid = assessmentId?.trim()
        if (!tid) {
            showToastMessage('Missing assessment id.', 'info')
            return
        }
        setShowGeneratorValidation(true)
        const fieldErrs = validateGeneratorFields(draft.title, aiPrompt, draft.languages)
        if (hasGeneratorFieldErrors(fieldErrs)) return
        if (aiLoading) return
        setShowGenerationOutput(true)
        setStaleBannerDismissed(false)
        setGenSteps({ metadata: 'pending', testcases: 'idle', reference: 'idle' })
        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        setAiLoading(true)
        registerGenerateCodingMetadataCallbacks(requestId, {
            onSuccess: (data) => {
                const meta = data as {
                    problem_description?: string
                    constraints?: string
                    examples?: Array<{ input?: unknown; output?: unknown; explanation?: string }>
                    duration?: number
                    difficulty_level?: string
                    title?: string
                }
                const ex = Array.isArray(meta.examples) ? meta.examples : []
                const mappedExamples: CodingExample[] = ex.map(
                    (raw: { input?: unknown; output?: unknown; explanation?: string }) => ({
                        id: nextId('ex'),
                        input: formatMetadataExampleInput(raw?.input),
                        output: String(raw?.output ?? ''),
                        exploration: String(raw?.explanation ?? ''),
                    }),
                )
                const problemText = String(meta.problem_description ?? '')
                const constraintsText = meta.constraints != null ? String(meta.constraints) : ''
                setDraft((prev) => {
                    const next: CodingProblemFormState = {
                        ...prev,
                        title:
                            typeof meta.title === 'string' && meta.title.trim()
                                ? meta.title.trim()
                                : prev.title.trim() || 'Untitled',
                        problemStatementHtml: plainProblemDescriptionToHtml(problemText),
                        constraints: constraintsText,
                        timeMinutes:
                            typeof meta.duration === 'number' && meta.duration > 0
                                ? Math.round(meta.duration)
                                : prev.timeMinutes,
                        difficulty:
                            typeof meta.difficulty_level === 'string' && meta.difficulty_level
                                ? String(meta.difficulty_level).toLowerCase()
                                : prev.difficulty,
                        examples: mappedExamples.length ? mappedExamples : prev.examples,
                    }
                    setDescriptionPlain(problemText)
                    setConstraintsPlain(constraintsText)
                    setGenSteps((s) => ({ ...s, metadata: 'done' }))
                    if (testCasesToGenerate > 0 && next.languages.length) {
                        scheduleMicrotask(() => runTestcasesForDraft(next, aiPrompt))
                    } else {
                        setGenSteps((s) => ({
                            ...s,
                            testcases: 'skipped',
                            reference: 'skipped',
                        }))
                        setAiLoading(false)
                        stableSnapshotRef.current = snapshotStudio(next, problemText, constraintsText)
                        showToastMessage('Generated.', 'success')
                    }
                    return next
                })
            },
            onError: () => {
                setAiLoading(false)
                setGenSteps((s) => ({ ...s, metadata: 'error' }))
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
                    examples_count: Math.min(10, Math.max(1, examplesToGenerate)),
                },
            }),
        )
    }

    const refreshTestcasesOnly = useCallback(
        (promptOverride?: string) => {
            setShowGeneratorValidation(true)
            const effectivePrompt = String(promptOverride ?? aiPrompt).trim()
            const fieldErrs = validateGeneratorFields(draft.title, effectivePrompt, draft.languages)
            if (hasGeneratorFieldErrors(fieldErrs)) {
                toastFirstGeneratorError(fieldErrs)
                return
            }
            const merged = buildMergedDraft()
            if (!hasRichTextContent(merged.problemStatementHtml ?? '')) {
                showToastMessage('Add a problem description first.', 'info')
                return
            }
            if (!merged.languages?.length) {
                showToastMessage('Select at least one language.', 'info')
                return
            }
            setSectionRegenPanel(null)
            setPartialRegen('testcases')
            setAiLoading(true)
            setGenSteps((s) => ({ ...s, testcases: 'pending', reference: 'idle' }))
            const supportedLabels = merged.languages.map((v) => labelForLangValue(v, languageOptions))
            const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
            registerGenerateCodingTestcasesCallbacks(requestId, {
                onSuccess: (data) => {
                    const testsRaw = Array.isArray(data.test_cases) ? data.test_cases : []
                    const snippetsRaw = Array.isArray(data.code_snippets) ? data.code_snippets : []
                    setDraft((prev) => {
                        const mapped: CodingTestCase[] = testsRaw.map(
                            (t: { input?: string; expected_output?: string; expectedOutput?: string }) => ({
                                id: nextId('tc'),
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
                        const mergedDraft: CodingProblemFormState = {
                            ...prev,
                            problemStatementHtml: merged.problemStatementHtml,
                            constraints: merged.constraints,
                            testCases: nextTestCases,
                            starterCodeByLang: starterPatch,
                        }
                        setGenSteps((s) => ({ ...s, testcases: 'done' }))
                        scheduleMicrotask(() => {
                            runReferenceSolutionForDraft(mergedDraft, effectivePrompt)
                        })
                        return mergedDraft
                    })
                },
                onError: () => {
                    setAiLoading(false)
                    setPartialRegen(null)
                    setGenSteps((s) => ({ ...s, testcases: 'error' }))
                },
            })
            dispatch(
                generateCodingTestcasesSnippetsRequestAction({
                    requestId,
                    payload: {
                        title: merged.title.trim() || 'Untitled',
                        ai_prompt: effectivePrompt,
                        constraints: merged.constraints?.trim() ?? '',
                        description: merged.problemStatementHtml ?? '',
                        supported_languages: supportedLabels,
                        test_cases_count: Math.min(20, Math.max(1, testCasesToGenerate || 1)),
                    },
                }),
            )
        },
        [
            aiPrompt,
            buildMergedDraft,
            dispatch,
            languageOptions,
            runReferenceSolutionForDraft,
            testCasesToGenerate,
            draft.title,
            draft.languages,
        ],
    )

    const refreshReferenceOnly = useCallback(
        (promptOverride?: string) => {
            setShowGeneratorValidation(true)
            const effectivePrompt = String(promptOverride ?? aiPrompt).trim()
            const fieldErrs = validateGeneratorFields(draft.title, effectivePrompt, draft.languages)
            if (hasGeneratorFieldErrors(fieldErrs)) {
                toastFirstGeneratorError(fieldErrs)
                return
            }
            const merged = buildMergedDraft()
            setSectionRegenPanel(null)
            setPartialRegen('reference')
            setAiLoading(true)
            runReferenceSolutionForDraft(merged, effectivePrompt)
        },
        [aiPrompt, buildMergedDraft, draft.languages, draft.title, runReferenceSolutionForDraft],
    )

    const openOrToggleSectionRegen = useCallback(
        (kind: 'metadata' | 'testcases' | 'reference') => {
            if (isPublished || aiLoading) return
            if (sectionRegenPanel === kind) {
                setSectionRegenPanel(null)
            } else {
                setSectionRegenPrompt(aiPrompt)
                setSectionRegenPanel(kind)
            }
        },
        [isPublished, aiLoading, sectionRegenPanel, aiPrompt],
    )

    const handleApply = () => {
        if (isPublished) return
        setShowGeneratorValidation(true)
        if (hasGeneratorFieldErrors(validateGeneratorFields(draft.title, aiPrompt, draft.languages))) {
            return
        }
        const merged = buildMergedDraft()
        if (!hasRichTextContent(merged.problemStatementHtml ?? '')) {
            showToastMessage('Add a problem description before applying.', 'info')
            return
        }
        onApplyToDraft(merged)
        showToastMessage('Applied to open draft.', 'success')
    }

    const handleSaveAsNew = () => {
        const tid = assessmentId?.trim()
        if (!tid) {
            showToastMessage('Missing assessment id.', 'info')
            return
        }
        if (isPublished) return
        setShowGeneratorValidation(true)
        if (hasGeneratorFieldErrors(validateGeneratorFields(draft.title, aiPrompt, draft.languages))) {
            return
        }
        const merged = buildMergedDraft()
        if (!hasRichTextContent(merged.problemStatementHtml ?? '')) {
            showToastMessage('Problem description is required.', 'info')
            return
        }
        const body = buildCodingProblemQuestionPayload(merged, tid, languageOptions)
        dispatch(
            submitProblemQuestionRequest({
                questionId: null,
                body,
            }),
        )
    }

    /** Same shape as assessment tab: first incomplete step is `current`, rest `upcoming`; `done`/`skipped` → `completed`. */
    const { generationTimelineData, generationTimelineProgress } = useMemo(() => {
        const steps: { step: StepKey; title: string; state: StepState }[] = [
            { step: 'metadata', title: 'Metadata', state: genSteps.metadata },
            { step: 'testcases', title: 'Test cases & snippets', state: genSteps.testcases },
            { step: 'reference', title: 'Reference solution', state: genSteps.reference },
        ]
        const isDone = (st: StepState) => st === 'done' || st === 'skipped'
        const completedCount = steps.filter((s) => isDone(s.state)).length
        const progress = Math.round((completedCount / steps.length) * 100)

        let foundCurrent = false
        const data = steps.map((item) => {
            if (isDone(item.state)) {
                return {
                    title: item.title,
                    date: item.state === 'skipped' ? 'Skipped' : '',
                    status: 'completed' as const,
                }
            }
            if (!foundCurrent) {
                foundCurrent = true
                const date =
                    item.state === 'error'
                        ? 'Error'
                        : item.state === 'pending'
                            ? 'In progress…'
                            : ''
                return {
                    title: item.title,
                    date,
                    status: 'current' as const,
                }
            }
            return {
                title: item.title,
                date: '',
                status: 'upcoming' as const,
            }
        })

        return { generationTimelineData: data, generationTimelineProgress: progress }
    }, [genSteps])

    const body = (
        <>
            {!embedded && (
                <Header title="AI Coding Studio" backNavigation centerTitle onBack={goBack} />
            )}
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={embedded ? styles.embeddedScroll : undefined}
            >
                <View style={{ margin: 16, gap: 16 }}>
                    <Card style={{ gap: 16, padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <View style={{ flex: 1, gap: 6 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <SvgXml xml={sparkles} />
                                    <Typography variant="semiBoldTxtlg" color={colors.gray[700]}>
                                        Coding Question Generator (AI)
                                    </Typography>
                                    <View
                                        style={{
                                            borderColor: colors.brand[200],
                                            borderWidth: 1,
                                            borderRadius: 999,
                                            paddingHorizontal: 8,
                                            backgroundColor: colors.brand[50],
                                            paddingVertical: 2,
                                        }}
                                    >
                                        <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                                            Premium
                                        </Typography>
                                    </View>
                                </View>
                                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                    Generate metadata, test cases, snippets, and reference-ready content from your prompt.
                                </Typography>
                            </View>
                        </View>

                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Title
                            </Typography>
                            <TextField
                                value={draft.title}
                                onChangeText={(t) => setDraft((p) => ({ ...p, title: t }))}
                                placeholder="e.g. Palindrome"
                                size="Medium"
                                disable={isPublished}
                                isError={showGeneratorValidation && Boolean(generatorFieldErrors.title)}
                                error={generatorFieldErrors.title}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                            <View style={{ flex: 1, minWidth: 160, gap: 6 }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                    Difficulty
                                </Typography>
                                <TagList
                                    data={['Easy', 'Medium', 'Hard']}
                                    bgColor={colors.gray[25]}
                                    borderColor={colors.gray[200]}
                                    textColor={colors.gray[700]}
                                    selectedItem={difficultyLabel}
                                    selectedColor={{
                                        bg: colors.brand[50],
                                        border: colors.brand[200],
                                        text: colors.brand[700],
                                    }}
                                    onSelect={(item) => {
                                        const v = Array.isArray(item) ? item[0] : item
                                        const next = String(v || 'Easy').toLowerCase()
                                        if (next === 'easy' || next === 'medium' || next === 'hard') {
                                            setDraft((p) => ({ ...p, difficulty: next }))
                                        }
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Duration (min)
                            </Typography>
                            <NumberStepper
                                value={draft.timeMinutes}
                                onChange={(n) => setDraft((p) => ({ ...p, timeMinutes: n }))}
                                min={1}
                                max={240}
                                unitLabel=""
                                padLength={0}
                                disabled={isPublished}
                            />
                        </View>

                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                AI prompt
                            </Typography>
                            <TextField
                                value={aiPrompt}
                                onChangeText={setAiPrompt}
                                placeholder="Describe the algorithm, topic, and edge cases you want covered…"
                                size="Large"
                                multiline
                                numberOfLines={5}
                                style={styles.multiline}
                                disable={isPublished}
                                isError={showGeneratorValidation && Boolean(generatorFieldErrors.aiPrompt)}
                                error={generatorFieldErrors.aiPrompt}
                            />
                        </View>

                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Supported languages ({draft.languages.length} selected)
                            </Typography>
                            {showGeneratorValidation && !!generatorFieldErrors.languages && (
                                <Typography variant="regularTxtsm" color={colors.error[600]}>
                                    {generatorFieldErrors.languages}
                                </Typography>
                            )}
                            <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginBottom: 4 }}>
                                Popular
                            </Typography>
                            <TagList
                                data={[...POPULAR_LABELS]}
                                multi
                                selectedItems={popularSelectedLabels}
                                onSelect={isPublished ? undefined : handlePopularTagSelect}
                                textColor={colors.gray[800]}
                                bgColor={colors.gray[25]}
                                borderColor={colors.gray[200]}
                                selectedColor={{
                                    text: colors.brand[800],
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                }}
                            />
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={{ marginTop: 8 }}>
                                All languages
                            </Typography>
                            {languagesLoading && (
                                <Typography variant="regularTxtxs" color={colors.gray[500]}>
                                    Loading languages…
                                </Typography>
                            )}
                            {!!languagesError && (
                                <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                    {languagesError}
                                </Typography>
                            )}
                            <CommonDropdown
                                placeholder="Browse all languages…"
                                options={languageOptions}
                                value={draft.languages}
                                labelKey="label"
                                valueKey="value"
                                multiSelect
                                containerStyle={
                                    showGeneratorValidation && generatorFieldErrors.languages
                                        ? {
                                            borderWidth: 1,
                                            borderColor: colors.error[400],
                                            borderRadius: 8,
                                        }
                                        : undefined
                                }
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
                                            referenceSolutionByLang: pruneLangRecord(
                                                prev.referenceSolutionByLang,
                                                allowed,
                                            ),
                                        }
                                    })
                                }}
                                disabled={isPublished}
                            />
                            {languagesHasMore && !isPublished && (
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
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                            <View style={{ flex: 1, minWidth: 140, gap: 6 }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                    Examples to generate
                                </Typography>
                                <NumberStepper
                                    value={examplesToGenerate}
                                    onChange={setExamplesToGenerate}
                                    min={1}
                                    max={10}
                                    unitLabel=""
                                    padLength={0}
                                    disabled={isPublished}
                                />
                            </View>
                            <View style={{ flex: 1, minWidth: 140, gap: 6 }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                    Test cases to generate
                                </Typography>
                                <NumberStepper
                                    value={testCasesToGenerate}
                                    onChange={setTestCasesToGenerate}
                                    min={0}
                                    max={20}
                                    unitLabel=""
                                    padLength={0}
                                    disabled={isPublished}
                                />
                            </View>
                        </View>

                        <View style={{ gap: 10 }}>
                            <Button
                                disabled={aiLoading || isPublished || !assessmentId?.trim()}
                                onPress={handleGenerate}
                                isLoading={aiLoading && !partialRegen}
                            >
                                {aiLoading && !partialRegen ? 'Generating…' : 'Generate'}
                            </Button>
                            <Button
                                buttonColor={colors.success[600]}
                                textColor={colors.base.white}
                                borderColor={colors.success[600]}
                                disabled={isPublished}
                                onPress={handleApply}
                            >
                                Apply to problem
                            </Button>
                            <Button
                                buttonColor={colors.gray[900]}
                                textColor={colors.base.white}
                                borderColor={colors.gray[900]}
                                disabled={isPublished || postQuestionLoading}
                                onPress={handleSaveAsNew}
                                isLoading={postQuestionLoading}
                            >
                                Save as new problem
                            </Button>
                            <Typography variant="regularTxtxs" color={colors.gray[500]} style={{ textAlign: 'center' }}>
                                Save creates a new coding problem in this test. Apply updates the currently open draft only.
                            </Typography>
                        </View>
                    </Card>

                    <ExpandableWrapper
                        title="Problem description & constraints"
                        subTitle="Type or paste your own, or use Generate with AI from the icon"
                        defaultExpanded
                        rightComponent={
                            <Pressable
                                onPress={() => openOrToggleSectionRegen('metadata')}
                                disabled={isPublished || aiLoading}
                                hitSlop={8}
                                accessibilityLabel="Open generate with AI for description and constraints"
                            >
                                <Feather
                                    name="refresh-ccw"
                                    size={15}
                                    color={isPublished || aiLoading ? colors.gray[300] : colors.gray[800]}
                                />
                            </Pressable>
                        }
                    >
                        {sectionRegenPanel === 'metadata' && (
                            <View style={styles.aiGeneratePanel}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                                    Generate with AI
                                </Typography>
                                <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginBottom: 8 }}>
                                    {REGEN_METADATA_HINT}
                                </Typography>
                                <TextField
                                    value={sectionRegenPrompt}
                                    onChangeText={setSectionRegenPrompt}
                                    placeholder="e.g. Make it about graph traversal…"
                                    placeholderTextColor={colors.gray[400]}
                                    multiline
                                    style={styles.aiPromptInput}
                                    editable={!isPublished && !aiLoading}
                                />
                                <View style={styles.aiGenerateActions}>
                                    <Button
                                        size={36}
                                        paddingHorizontal={20}
                                        onPress={() => runMetadataOnly(sectionRegenPrompt)}
                                        disabled={aiLoading}
                                    >
                                        {aiLoading && partialRegen === 'metadata' ? 'Generating…' : 'Generate'}
                                    </Button>
                                    <Button
                                        size={36}
                                        paddingHorizontal={16}
                                        buttonColor={colors.base.white}
                                        textColor={colors.gray[700]}
                                        borderWidth={1}
                                        borderColor={colors.gray[300]}
                                        onPress={() => setSectionRegenPanel(null)}
                                        disabled={aiLoading && partialRegen === 'metadata'}
                                    >
                                        Cancel
                                    </Button>
                                </View>
                            </View>
                        )}
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Description
                            </Typography>
                            <TextField
                                value={descriptionPlain}
                                onChangeText={setDescriptionPlain}
                                placeholder="Describe the problem (or generate above, then edit here)…"
                                multiline
                                numberOfLines={8}
                                style={styles.multilineTall}
                                disable={isPublished}
                            />
                        </View>
                        <View style={{ gap: 6, marginTop: 12 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Constraints
                            </Typography>
                            <TextField
                                value={constraintsPlain}
                                onChangeText={setConstraintsPlain}
                                placeholder="e.g. 1 ≤ n ≤ 10⁵"
                                multiline
                                numberOfLines={5}
                                style={styles.multiline}
                                disable={isPublished}
                            />
                        </View>
                    </ExpandableWrapper>

                    {showGenerationOutput && (
                        <>
                            <CustomTimeline
                                progress={generationTimelineProgress}
                                data={generationTimelineData}
                            />

                            {showStaleBanner && (
                                <View style={styles.warningBanner}>
                                    <Typography variant="regularTxtsm" color={colors.gray[800]} style={{ flex: 1 }}>
                                        Languages or problem details have changed. Regenerate to keep test cases, code
                                        snippets, and reference solutions accurate.
                                    </Typography>
                                    <Pressable
                                        onPress={() => setStaleBannerDismissed(true)}
                                        hitSlop={8}
                                        accessibilityLabel="Dismiss warning"
                                    >
                                        <Ionicons name="close" size={22} color={colors.gray[600]} />
                                    </Pressable>
                                </View>
                            )}

                            <ExpandableWrapper
                                title="Generated test cases"
                                subTitle={`${draft.testCases.length} cases — used for evaluation`}
                                defaultExpanded
                                rightComponent={
                                    <Pressable
                                        onPress={() => openOrToggleSectionRegen('testcases')}
                                        disabled={isPublished || aiLoading}
                                        hitSlop={8}
                                        accessibilityLabel="Open generate with AI for test cases"
                                    >
                                        <Feather
                                            name="refresh-ccw"
                                            size={18}
                                            color={isPublished || aiLoading ? colors.gray[300] : colors.gray[800]}
                                        />
                                    </Pressable>
                                }
                            >
                                {sectionRegenPanel === 'testcases' && (
                                    <View style={styles.aiGeneratePanel}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                                            Generate with AI
                                        </Typography>
                                        <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginBottom: 8 }}>
                                            {REGEN_TESTCASES_HINT}
                                        </Typography>
                                        <TextField
                                            value={sectionRegenPrompt}
                                            onChangeText={setSectionRegenPrompt}
                                            placeholder="e.g. Add edge cases for empty input and large n…"
                                            placeholderTextColor={colors.gray[400]}
                                            multiline
                                            style={styles.aiPromptInput}
                                            editable={!isPublished && !aiLoading}
                                        />
                                        <View style={styles.aiGenerateActions}>
                                            <Button
                                                size={36}
                                                paddingHorizontal={20}
                                                onPress={() => refreshTestcasesOnly(sectionRegenPrompt)}
                                                disabled={aiLoading}
                                            >
                                                {aiLoading && partialRegen === 'testcases' ? 'Generating…' : 'Generate'}
                                            </Button>
                                            <Button
                                                size={36}
                                                paddingHorizontal={16}
                                                buttonColor={colors.base.white}
                                                textColor={colors.gray[700]}
                                                borderWidth={1}
                                                borderColor={colors.gray[300]}
                                                onPress={() => setSectionRegenPanel(null)}
                                                disabled={aiLoading && partialRegen === 'testcases'}
                                            >
                                                Cancel
                                            </Button>
                                        </View>
                                    </View>
                                )}
                                <Typography variant="regularTxtxs" color={colors.gray[600]} style={{ marginBottom: 8 }}>
                                    Hidden test cases for automated grading (not shown to candidates).
                                </Typography>
                                {draft.testCases.map((tc, i) => (
                                    <View key={tc.id} style={styles.cardBlock}>
                                        <View style={styles.cardBlockHeader}>
                                            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                                                Test #{i + 1}
                                            </Typography>
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
                                                    editable={!isPublished}
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
                                                    editable={!isPublished}
                                                    style={styles.ioInput}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ExpandableWrapper>

                            <ExpandableWrapper
                                title="Code snippets"
                                subTitle="Starter code per language"
                                defaultExpanded
                            >
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
                                    disabled={isPublished || draft.languages.length === 0}
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
                                        !isPublished &&
                                        draft.languages.length > 0 &&
                                        Boolean(draft.starterLanguage?.trim())
                                    }
                                    placeholder=""
                                />
                            </ExpandableWrapper>

                            <ExpandableWrapper
                                title="Reference solutions"
                                subTitle="Internal — not shown to candidates"
                                defaultExpanded
                                rightComponent={
                                    <Pressable
                                        onPress={() => openOrToggleSectionRegen('reference')}
                                        disabled={isPublished || aiLoading}
                                        hitSlop={8}
                                        accessibilityLabel="Open generate with AI for reference solution"
                                    >
                                        <Feather
                                            name="refresh-ccw"
                                            size={18}
                                            color={isPublished || aiLoading ? colors.gray[300] : colors.gray[800]}
                                        />
                                    </Pressable>
                                }
                            >
                                {sectionRegenPanel === 'reference' && (
                                    <View style={styles.aiGeneratePanel}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={{ marginBottom: 8 }}>
                                            Generate with AI
                                        </Typography>
                                        <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginBottom: 8 }}>
                                            {REGEN_REFERENCE_HINT}
                                        </Typography>
                                        <TextField
                                            value={sectionRegenPrompt}
                                            onChangeText={setSectionRegenPrompt}
                                            placeholder="e.g. Use a hash map for O(n) time…"
                                            placeholderTextColor={colors.gray[400]}
                                            multiline
                                            style={styles.aiPromptInput}
                                            editable={!isPublished && !aiLoading}
                                        />
                                        <View style={styles.aiGenerateActions}>
                                            <Button
                                                size={36}
                                                paddingHorizontal={20}
                                                onPress={() => refreshReferenceOnly(sectionRegenPrompt)}
                                                disabled={aiLoading}
                                            >
                                                {aiLoading && partialRegen === 'reference' ? 'Generating…' : 'Generate'}
                                            </Button>
                                            <Button
                                                size={36}
                                                paddingHorizontal={16}
                                                buttonColor={colors.base.white}
                                                textColor={colors.gray[700]}
                                                borderWidth={1}
                                                borderColor={colors.gray[300]}
                                                onPress={() => setSectionRegenPanel(null)}
                                                disabled={aiLoading && partialRegen === 'reference'}
                                            >
                                                Cancel
                                            </Button>
                                        </View>
                                    </View>
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
                                    disabled={isPublished || draft.languages.length === 0}
                                />
                                {unresolvedReferenceValidationErrors.length > 0 && (
                                    <ReferenceSolutionValidationErrorPanel
                                        rows={unresolvedReferenceValidationErrors}
                                        onUseActualAsExpected={
                                            handleUseActualAsExpectedFromReferenceValidation
                                        }
                                    />
                                )}
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
                                                referenceSolutionByLang: {
                                                    ...prev.referenceSolutionByLang,
                                                    [sl]: t,
                                                },
                                            }
                                        })
                                    }
                                    editable={
                                        !isPublished &&
                                        draft.languages.length > 0 &&
                                        Boolean(draft.starterLanguage?.trim())
                                    }
                                    placeholder=""
                                    containerStyle={{ marginTop: 10 }}
                                />
                            </ExpandableWrapper>
                        </>
                    )}
                </View>
            </ScrollView>
            {!embedded && (
                                <FooterButtons
                                    leftButtonProps={{
                                        children: 'Back',
                                        size: 44,
                                        buttonColor: colors.base.white,
                                        textColor: colors.gray[700],
                                        borderColor: colors.gray[300],
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        borderGradientOpacity: 0.25,
                                        shadowColor: colors.gray[700],
                                        onPress: () => {
                                            goBack()
                                        },
                                    }}
                                    rightButtonProps={{
                                        children: 'Next',
                                        size: 44,
                                        borderWidth: 1,
                                        buttonColor: colors.brand[600],
                                        textColor: colors.base.white,
                                        borderColor: colors.base.white,
                                        borderRadius: 8,
                                        onPress: () => {
                                            navigate('CodingTestQuestion', { assessmentId })
                                        },
                                    }}
                                />
                            )}
        </>
    )

    if (embedded) {
        return <View style={styles.embeddedRoot}>{body}</View>
    }

    return <CustomSafeAreaView style={styles.safe}>{body}</CustomSafeAreaView>
}

export default AiCodingTestQuestion

const styles = StyleSheet.create({
    safe: { flex: 1 },
    embeddedRoot: { flex: 1 },
    embeddedScroll: { flex: 1 },
    multiline: {
        minHeight: 120,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    multilineTall: {
        minHeight: 180,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: colors.warning[50],
        borderWidth: 1,
        borderColor: colors.warning[200],
        borderRadius: 10,
        padding: 12,
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
        gap: 8,
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
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
        paddingTop: 10,
    },
})
