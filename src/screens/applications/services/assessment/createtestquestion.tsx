import { View, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Shimmer from '../../../../components/atoms/shimmer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import Header from '../../../../components/organisms/header'
import {
    Button,
    CommonDropdown,
    Typography,
    QuestionOptionsField,
    QuizChipsPager,
    type QuestionOptionItem,
    ConfirmModal,
} from '../../../../components'
import { SvgXml } from 'react-native-svg'
import { deleteIcon } from '../../../../assets/svg/deleteicon'
import { colors } from '../../../../theme/colors'
import Divider from '../../../../components/atoms/divider'
import NumberStepper from '../../../../components/atoms/numberstepper'
import RichTextField from '../../../../components/atoms/richtextscreen'
import {
    fetchAssessmentTestDetailRequest,
    postAssessmentQuestionRequest,
    deleteAssessmentQuestionRequest,
    updateAssessmentQuestionRequest,
    publishAssessmentTestRequest,
} from '../../../../features/assessments/slice'
import {
    selectAssessmentTestDetail,
    selectAssessmentTestDetailError,
    selectAssessmentTestDetailLoading,
    selectAssessmentQuestionsList,
    selectAssessmentQuestionsListError,
    selectAssessmentQuestionsListLoading,
    selectPostAssessmentQuestionLoading,
    selectPostAssessmentQuestionError,
    selectDeleteAssessmentQuestionLoading,
    selectDeleteAssessmentQuestionError,
    selectUpdateAssessmentQuestionLoading,
    selectUpdateAssessmentQuestionError,
    selectPublishAssessmentTestLoading,
    selectPublishAssessmentTestError,
} from '../../../../features/assessments/selectors'
import { capitalizeFirstLetter } from '../../../../utils/stringUtils'
import { downloadIcon } from '../../../../assets/svg/download'
import SlideAnimatedTab from '../../../../components/molecules/slideanimatedtab'
import ExcelTestUpload from './exceltestupload'
import AiTestQuestion from './aitestquestion'
import CreateAssessmentTest from './createassessmenttest'
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets'

const ASSESSMENT_TEST_QUESTIONS_DRAFT_KEY = '@assessment/testQuestionsDraft'

const QUESTION_CREATION_TABS = ['Questions', 'Upload(Excel)', 'Generate', 'Setting'] as const

const questionTypeOptions = [
    { label: 'Single choice', value: 'single' },
    { label: 'Multiple choice', value: 'multiple' },
    { label: 'Text', value: 'text' },
]
const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
]

type QuestionTypeValue = 'single' | 'multiple' | 'text'

const MIN_OPTIONS = 2

const DEFAULT_QUESTION_TYPE: QuestionTypeValue = 'single'
const DEFAULT_DIFFICULTY = 'easy'
const DEFAULT_POINTS = 5
const DEFAULT_TIME_SEC = 59

type QuizFormState = {
    /** Present when this row exists on the server (DELETE /questions/{id}/) */
    serverQuestionId: string | null
    questionType: QuestionTypeValue | null
    difficulty: string | null
    points: number
    timeSec: number
    questionHtml: string
    options: (QuestionOptionItem & { serverChoiceId?: number | null })[]
    singleCorrectId: string | null
    multipleCorrectIds: string[]
}

function questionTypeFromApi(qt: string | null | undefined): QuestionTypeValue {
    if (qt === 'multiple_choice') return 'multiple'
    if (qt === 'text') return 'text'
    return 'single'
}

function quizzesFromApiQuestions(
    idRef: React.MutableRefObject<number>,
    results: any[] | undefined | null,
): QuizFormState[] {
    const list = Array.isArray(results) ? results : []
    const mapped: QuizFormState[] = []

    for (const q of list) {
        const questionType = questionTypeFromApi(q?.question_type)
        const choices: any[] = Array.isArray(q?.choices) ? q.choices : []

        const options: QuestionOptionItem[] =
            questionType === 'text'
                ? []
                : choices.map((c: any) => {
                    idRef.current += 1
                    return {
                        id: `opt-${idRef.current}`,
                        text: String(c?.value ?? ''),
                        serverChoiceId: c?.id ?? null,
                    }
                })

        let singleCorrectId: string | null = null
        const multipleCorrectIds: string[] = []

        if (questionType === 'single') {
            const correctIndex = choices.findIndex((c: any) => Boolean(c?.correct))
            if (correctIndex >= 0 && options[correctIndex]) {
                singleCorrectId = options[correctIndex].id
            } else {
                singleCorrectId = options[0]?.id ?? null
            }
        } else if (questionType === 'multiple') {
            choices.forEach((c: any, idx: number) => {
                if (c?.correct && options[idx]) multipleCorrectIds.push(options[idx].id)
            })
        }

        mapped.push({
            serverQuestionId: q?.id != null ? String(q.id) : null,
            questionType,
            difficulty: q?.difficulty ?? DEFAULT_DIFFICULTY,
            points: Number(q?.points ?? DEFAULT_POINTS),
            timeSec: Number(q?.time_duration ?? DEFAULT_TIME_SEC),
            questionHtml: String(q?.html_content ?? q?.text ?? ''),
            options,
            singleCorrectId,
            multipleCorrectIds,
        })
    }

    return mapped
}

function cloneQuiz(q: QuizFormState): QuizFormState {
    return {
        ...q,
        options: q.options.map((o) => ({ ...o })),
        multipleCorrectIds: [...q.multipleCorrectIds],
    }
}

function hasRichTextContent(html: string): boolean {
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    return text.length > 0
}

function htmlToPlainText(html: string): string {
    return (html ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .replace(/&#[0-9]+;/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function bumpOptionIdRefFromQuizzes(idRef: React.MutableRefObject<number>, list: QuizFormState[]) {
    let max = idRef.current
    for (const q of list) {
        for (const o of q.options) {
            const m = /^opt-(\d+)$/.exec(o.id)
            if (m) max = Math.max(max, parseInt(m[1], 10))
        }
    }
    idRef.current = max
}

function parseStoredQuizzes(raw: string | null): QuizFormState[] | null {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return null
        return parsed.map((q: any) => ({
            ...q,
            serverQuestionId: q?.serverQuestionId ?? null,
        })) as QuizFormState[]
    } catch {
        return null
    }
}

function validateQuizzesForSave(list: QuizFormState[]): string | null {
    for (let i = 0; i < list.length; i++) {
        const q = list[i]
        const n = i + 1
        if (!hasRichTextContent(q.questionHtml ?? '')) {
            return `Question ${n}: Question text is required.`
        }
        if (q.questionType === 'single' || q.questionType === 'multiple') {
            const hasEmptyOption = q.options.some((o) => !String(o.text ?? '').trim())
            if (hasEmptyOption) {
                return `Question ${n}: All options must have text.`
            }
        }
    }
    return null
}

function getDraftValidationErrors(draft: QuizFormState): {
    questionHtml: string | null
    options: string | null
} {
    let questionHtml: string | null = null
    let options: string | null = null
    if (!hasRichTextContent(draft.questionHtml ?? '')) {
        questionHtml = 'Question text is required.'
    }
    if (draft.questionType === 'single' || draft.questionType === 'multiple') {
        const hasEmptyOption = draft.options.some((o) => !String(o.text ?? '').trim())
        if (hasEmptyOption) {
            options = 'All options must have text.'
        }
    }
    return { questionHtml, options }
}

/** Short label for preview row (e.g. "Multiple" / "Single" / "Text") */
function questionTypeShortLabel(t: QuestionTypeValue | null): string {
    if (t === 'multiple') return 'Multiple'
    if (t === 'single') return 'Single'
    if (t === 'text') return 'Text'
    return '—'
}

function formatTimeSecShort(sec: number): string {
    const s = Math.max(0, Math.floor(Number(sec) || 0))
    return `${s}s`
}

/** Skeleton for Questions tab while test detail or questions list is loading. */
const AptitudeQuestionsTabShimmer = () => {
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
                            <Shimmer width={88} height={36} borderRadius={8} />
                        </View>
                    </View>
                </View>
                <Divider />
                <View style={styles.previewSection}>
                    <Shimmer width="100%" height={72} borderRadius={12} />
                </View>
                <View style={styles.form}>
                    <View style={{ gap: 8 }}>
                        <Shimmer width="32%" height={14} borderRadius={6} />
                        <Shimmer width="100%" height={40} borderRadius={8} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Shimmer width="48%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={40} borderRadius={8} />
                        </View>
                        <View style={{ width: 110, gap: 8 }}>
                            <Shimmer width="65%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={40} borderRadius={8} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Shimmer width="40%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={40} borderRadius={8} />
                        </View>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Shimmer width="55%" height={14} borderRadius={6} />
                            <Shimmer width="100%" height={40} borderRadius={8} />
                        </View>
                    </View>
                    <Shimmer width="100%" height={120} borderRadius={10} />
                    <View style={{ gap: 10 }}>
                        <Shimmer width="100%" height={44} borderRadius={8} />
                        <Shimmer width="100%" height={44} borderRadius={8} />
                        <Shimmer width="78%" height={44} borderRadius={8} />
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

const CreateTestQuestion = () => {
    const route = useRoute<any>()
    const dispatch = useDispatch()
    const postQuestionLoading = useSelector(selectPostAssessmentQuestionLoading)
    const postQuestionError = useSelector(selectPostAssessmentQuestionError)
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
    const testId: string | null =
        route?.params?.assignmentId ??
        route?.params?.assignmentid ??
        route?.params?.assessmentId ??
        route?.params?.testId ??
        route?.params?.test ??
        null

    const idRef = useRef(0)
    const nextId = () => {
        idRef.current += 1
        return `opt-${idRef.current}`
    }

    const createEmptyOptions = (): QuestionOptionItem[] =>
        Array.from({ length: MIN_OPTIONS }, () => ({ id: nextId(), text: '' }))

    const createQuiz = (): QuizFormState => {
        const options = createEmptyOptions()
        const firstId = options[0]?.id ?? null
        return {
            serverQuestionId: null,
            questionType: DEFAULT_QUESTION_TYPE,
            difficulty: DEFAULT_DIFFICULTY,
            points: DEFAULT_POINTS,
            timeSec: DEFAULT_TIME_SEC,
            questionHtml: '',
            options,
            singleCorrectId:
                DEFAULT_QUESTION_TYPE === 'single' && firstId ? firstId : null,
            multipleCorrectIds: [],
        }
    }

    const [savedQuizzes, setSavedQuizzes] = useState<QuizFormState[]>([])
    const [draft, setDraft] = useState<QuizFormState>(() => createQuiz())
    const [draftSource, setDraftSource] = useState<'new' | number>('new')
    const [hasTriedSave, setHasTriedSave] = useState(false)
    const [errors, setErrors] = useState<{ questionHtml: string | null; options: string | null }>(
        { questionHtml: null, options: null },
    )
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [creationTab, setCreationTab] = useState<string>(QUESTION_CREATION_TABS[0])

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    // If this screen is being used to edit an existing test (testId present),
                    // the quizzes should come from the API questions list, not local drafts.
                    if (testId?.trim()) return
                    const raw = await AsyncStorage.getItem(ASSESSMENT_TEST_QUESTIONS_DRAFT_KEY)
                    if (cancelled) return
                    const loaded = parseStoredQuizzes(raw)
                    if (!loaded) return
                    bumpOptionIdRefFromQuizzes(idRef, loaded)
                    setSavedQuizzes(loaded)
                    setDraft(createQuiz())
                    setDraftSource('new')
                } catch {
                    /* keep defaults */
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    // When API questions load, drive the quiz pager from backend results.
    useEffect(() => {
        const results = questionsList?.results
        if (!Array.isArray(results)) return
        const mapped = quizzesFromApiQuestions(idRef, results)
        setSavedQuizzes(mapped)
        if (mapped.length > 0) {
            setDraftSource(0)
            setDraft(cloneQuiz(mapped[0]))
        } else {
            setDraftSource('new')
            setDraft(createQuiz())
        }
        // Do not persist this mapping into AsyncStorage; it’s server state.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionsList?.results])

    useEffect(() => {
        const id = testId?.trim()
        if (!id) return
        dispatch(fetchAssessmentTestDetailRequest({ id }))
    }, [dispatch, testId])

    /** Keep draftSource in range when savedQuizzes shrinks (e.g. delete elsewhere). */
    useEffect(() => {
        if (draftSource === 'new') return
        if (savedQuizzes.length === 0) {
            setDraftSource('new')
            setDraft(createQuiz())
            return
        }
        if (draftSource >= savedQuizzes.length) {
            const i = savedQuizzes.length - 1
            setDraftSource(i)
            setDraft(cloneQuiz(savedQuizzes[i]))
        }
    }, [savedQuizzes, draftSource])

    useEffect(() => {
        if (!hasTriedSave) return
        setErrors(getDraftValidationErrors(draft))
    }, [draft, hasTriedSave])

    useEffect(() => {
        if (testDetail?.is_published && (creationTab === 'Upload(Excel)' || creationTab === 'Generate')) {
            setCreationTab('Questions')
        }
    }, [testDetail?.is_published])

    const patchDraft = (patch: Partial<QuizFormState>) => {
        setDraft((prev) => ({ ...prev, ...patch }))
    }

    const handleQuestionTypeChange = (value: QuestionTypeValue | null) => {
        setDraft((prev) => {
            let next: QuizFormState = { ...prev, questionType: value }
            if (value === 'single') {
                const firstId = next.options[0]?.id ?? null
                next = {
                    ...next,
                    multipleCorrectIds: [],
                    singleCorrectId: firstId,
                }
            } else if (value === 'multiple') {
                next = { ...next, singleCorrectId: null }
            }
            return next
        })
    }

    const updateOptionText = (id: string, text: string) => {
        setDraft((prev) => ({
            ...prev,
            options: prev.options.map((o) => (o.id === id ? { ...o, text } : o)),
        }))
    }

    const addOption = () => {
        setDraft((prev) => ({
            ...prev,
            options: [...prev.options, { id: nextId(), text: '' }],
        }))
    }

    const removeOption = (id: string) => {
        setDraft((prev) => {
            if (prev.options.length <= MIN_OPTIONS) return prev
            const remaining = prev.options.filter((o) => o.id !== id)
            let singleCorrectId = prev.singleCorrectId
            if (prev.singleCorrectId === id) {
                singleCorrectId =
                    prev.questionType === 'single' && remaining[0]
                        ? remaining[0].id
                        : null
            }
            return {
                ...prev,
                options: remaining,
                singleCorrectId,
                multipleCorrectIds: prev.multipleCorrectIds.filter((x) => x !== id),
            }
        })
    }

    const toggleCorrect = (id: string) => {
        const qt = draft.questionType
        if (qt === 'single') {
            setDraft((prev) => {
                const cur = prev.singleCorrectId
                return {
                    ...prev,
                    singleCorrectId: cur === id ? null : id,
                }
            })
            return
        }
        if (qt === 'multiple') {
            setDraft((prev) => {
                const has = prev.multipleCorrectIds.includes(id)
                return {
                    ...prev,
                    multipleCorrectIds: has
                        ? prev.multipleCorrectIds.filter((x) => x !== id)
                        : [...prev.multipleCorrectIds, id],
                }
            })
        }
    }

    const isCorrectSelected = (id: string) => {
        if (draft.questionType === 'single') return draft.singleCorrectId === id
        if (draft.questionType === 'multiple') return draft.multipleCorrectIds.includes(id)
        return false
    }

    const addQuiz = () => {
        setHasTriedSave(false)
        setErrors({ questionHtml: null, options: null })
        setDraft(createQuiz())
        setDraftSource('new')
    }

    const resolveServerQuestionId = (): string | null => {
        const fromDraft = draft.serverQuestionId
        if (fromDraft) return fromDraft
        if (draftSource !== 'new' && questionsList?.results?.[draftSource]?.id != null) {
            return String(questionsList.results[draftSource].id)
        }
        return null
    }

    const removeCurrentQuizLocally = () => {
        setHasTriedSave(false)
        setErrors({ questionHtml: null, options: null })
        if (draftSource === 'new') {
            setDraft(createQuiz())
            return
        }
        const idx = draftSource
        const next = savedQuizzes.filter((_, i) => i !== idx)
        void AsyncStorage.setItem(ASSESSMENT_TEST_QUESTIONS_DRAFT_KEY, JSON.stringify(next))
        setSavedQuizzes(next)
        if (next.length === 0) {
            setDraft(createQuiz())
            setDraftSource('new')
            return
        }
        const newIndex = Math.min(idx, next.length - 1)
        setDraftSource(newIndex)
        setDraft(cloneQuiz(next[newIndex]))
    }

    const openDeleteModal = () => {
        if (deleteQuestionLoading) return
        const allowed =
            draftSource !== 'new' || savedQuizzes.length > 0 || hasRichTextContent(draft.questionHtml)
        if (!allowed) return
        setDeleteModalVisible(true)
    }

    const handleCancelDelete = () => {
        setDeleteModalVisible(false)
    }

    const handleConfirmDelete = () => {
        setDeleteModalVisible(false)
        const tid = testId?.trim()
        const serverId = resolveServerQuestionId()
        if (tid && serverId) {
            dispatch(deleteAssessmentQuestionRequest({ questionId: serverId, testId: tid }))
            return
        }
        removeCurrentQuizLocally()
    }

    const handleChipSelect = (index: number) => {
        setHasTriedSave(false)
        setErrors({ questionHtml: null, options: null })
        if (savedQuizzes.length === 0) {
            return
        }
        if (draftSource === 'new' && index === savedQuizzes.length) {
            setDraftSource('new')
            setDraft(createQuiz())
            return
        }
        const q = savedQuizzes[index]
        if (!q) return
        setDraftSource(index)
        setDraft(cloneQuiz(q))
    }

    const handleSave = async () => {
        setHasTriedSave(true)
        const nextErrors = getDraftValidationErrors(draft)
        setErrors(nextErrors)
        if (nextErrors.questionHtml || nextErrors.options) {
            return
        }

        const nextList =
            draftSource === 'new'
                ? [...savedQuizzes, cloneQuiz(draft)]
                : savedQuizzes.map((q, i) => (i === draftSource ? cloneQuiz(draft) : q))

        await AsyncStorage.setItem(ASSESSMENT_TEST_QUESTIONS_DRAFT_KEY, JSON.stringify(nextList))
        setSavedQuizzes(nextList)

        if (draftSource === 'new') {
            setDraftSource(nextList.length - 1)
        }

        if (!testId) {
            console.warn('Missing test id (assessmentId) for posting question')
            return
        }

        const questionType =
            draft.questionType === 'single'
                ? 'single_choice'
                : draft.questionType === 'multiple'
                    ? 'multiple_choice'
                    : 'text'

        const payload: any = {
            test: testId,
            question_type: questionType,
            difficulty: draft.difficulty ?? DEFAULT_DIFFICULTY,
            points: Math.max(1, draft.points),
            time_duration: draft.timeSec,
            html_content: draft.questionHtml,
            text: htmlToPlainText(draft.questionHtml),
        }

        if (draft.questionType === 'single' || draft.questionType === 'multiple') {
            payload.choices = draft.options.map((o, idx) => {
                const choiceId = idx + 1
                const correct =
                    draft.questionType === 'single'
                        ? draft.singleCorrectId === o.id
                        : draft.multipleCorrectIds.includes(o.id)
                return { id: choiceId, value: o.text, correct }
            })
        }

        const serverId = draft.serverQuestionId?.trim()
        if (serverId && draftSource !== 'new') {
            dispatch(
                updateAssessmentQuestionRequest({
                    questionId: serverId,
                    data: {
                        ...payload,
                        id: serverId,
                        test: testId,
                        choices:
                            draft.questionType === 'single' || draft.questionType === 'multiple'
                                ? draft.options.map((o: any, idx) => {
                                    const choiceId = Number(o?.serverChoiceId ?? idx + 1)
                                    const correct =
                                        draft.questionType === 'single'
                                            ? draft.singleCorrectId === o.id
                                            : draft.multipleCorrectIds.includes(o.id)
                                    return { id: choiceId, value: o.text, correct }
                                })
                                : undefined,
                    },
                }),
            )
            return
        }

        dispatch(postAssessmentQuestionRequest(payload))
    }

    const questionLabelIndex =
        draftSource === 'new' ? savedQuizzes.length + 1 : draftSource + 1

    /** Include an extra chip while editing a new (unsaved) question so every draft has a tab. */
    const pagerCount =
        savedQuizzes.length === 0
            ? 1
            : draftSource === 'new'
                ? savedQuizzes.length + 1
                : savedQuizzes.length

    const pagerSelectedIndex =
        savedQuizzes.length === 0
            ? 0
            : draftSource === 'new'
                ? savedQuizzes.length
                : draftSource

    const canDelete =
        draftSource !== 'new' || savedQuizzes.length > 0 || hasRichTextContent(draft.questionHtml)

    const handlePublish = () => {
        const id = testId?.trim()
        if (!id) return
        if (testDetail?.is_published) return
        if (publishTestLoading) return
        dispatch(publishAssessmentTestRequest({ testId: id }))
    }

    const tabsToShow = useMemo(() => {
        if (testDetail?.is_published) {
            return ['Questions', 'Setting'] // hide Upload & Generate
        }
        return QUESTION_CREATION_TABS
    }, [testDetail?.is_published])

    /** With a test id, show skeleton until detail + questions list are ready (draft-only mode skips). */
    const showQuestionsTabShimmer = useMemo(() => {
        const id = testId?.trim()
        if (!id) return false
        if (testDetailLoading && !testDetail) return true
        if (questionsLoading && !questionsList) return true
        return false
    }, [testId, testDetailLoading, testDetail, questionsLoading, questionsList])

    return (
        <CustomSafeAreaView style={styles.safe}>
            <Header title="Questions Creation" backNavigation onBack={()=>navigate('AssessmentTestList')} threedot />
            <View style={styles.tabBarWrap}>
                <SlideAnimatedTab
                    tabs={[...tabsToShow]}
                    activeTab={creationTab}
                    onChangeTab={(label) => setCreationTab(label)}
                />
                <Divider />
            </View>
            {creationTab === 'Questions' ? (
                <View style={styles.body}>
                    {showQuestionsTabShimmer ? (
                        <AptitudeQuestionsTabShimmer />
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
                                            disabled={publishTestLoading || Boolean(testDetail?.is_published)}
                                            onPress={handlePublish}
                                            startIcon={
                                                !testDetail?.is_published ? (
                                                    <SvgXml
                                                        xml={downloadIcon}
                                                        height={18}
                                                        width={18}
                                                        color={colors.base.white}
                                                    />
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
                                        <Typography
                                            variant="semiBoldTxtxs"
                                            color={colors.error[600]}
                                            style={styles.fieldErrorText}
                                        >
                                            {publishTestError}
                                        </Typography>
                                    )}
                                </View>
                                {/* <Divider /> */}
                                <View style={styles.questionHeader}>
                                    <Typography variant="semiBoldTxtmd">
                                        Total Questions :{' '}
                                        {savedQuizzes.length + (draftSource === 'new' ? 1 : 0)}
                                    </Typography>
                                    {!testDetail?.is_published &&
                                        <View style={styles.questionHeaderActions}>
                                            <Pressable
                                                onPress={openDeleteModal}
                                                disabled={!canDelete || deleteQuestionLoading}
                                                style={{ opacity: !canDelete || deleteQuestionLoading ? 0.4 : 1 }}
                                            >
                                                <SvgXml
                                                    xml={deleteIcon}
                                                    color={colors.error[500]}
                                                />
                                            </Pressable>
                                            <View style={styles.headerDivider} />
                                            <Button paddingHorizontal={12} size={36} onPress={addQuiz} disabled={testDetail?.is_published}>
                                                + Add quiz
                                            </Button>
                                        </View>
                                    }
                                </View>
                                <Divider />
                                {hasRichTextContent(draft.questionHtml ?? '') && (
                                    <View style={styles.previewSection}>
                                        {/* <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                            Question {questionLabelIndex}
                                        </Typography> */}
                                        <View style={styles.selectedQuestionCard}>
                                            <View style={styles.previewMetaRow}>
                                                <View style={styles.previewMetaLeft}>
                                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                                        {questionTypeShortLabel(draft.questionType)} · {draft.points} pts ·{' '}
                                                        {formatTimeSecShort(draft.timeSec)}
                                                    </Typography>
                                                </View>
                                                <View style={styles.difficultyPill}>
                                                    <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                                                        {capitalizeFirstLetter(String(draft.difficulty ?? '—'))}
                                                    </Typography>
                                                </View>
                                            </View>
                                            <Typography
                                                variant="semiBoldTxtmd"
                                                color={colors.gray[900]}
                                                style={styles.previewQuestionBody}
                                            >
                                                {`${htmlToPlainText(draft.questionHtml ?? '') || '—'}`}
                                            </Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.form}>
                                    <View style={styles.field}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                            Question type
                                        </Typography>
                                        <CommonDropdown
                                            placeholder="Select question type"
                                            options={questionTypeOptions}
                                            value={draft.questionType}
                                            labelKey="label"
                                            valueKey="value"
                                            onChange={(value) =>
                                                handleQuestionTypeChange(value as QuestionTypeValue | null)
                                            }
                                            disabled={testDetail?.is_published}
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
                                            onChange={(value) =>
                                                patchDraft({ difficulty: value as string | null })
                                            }
                                            disabled={testDetail?.is_published}
                                        />
                                    </View>
                                    <View style={styles.field}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                            Points (1-100)
                                        </Typography>
                                        <NumberStepper
                                            value={draft.points}
                                            onChange={(v) => patchDraft({ points: v })}
                                            min={1}
                                            max={100}
                                            unitLabel=""
                                            disabled={testDetail?.is_published}
                                        />
                                    </View>
                                    <View style={styles.field}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                            Time duration (sec)(0-1000)
                                        </Typography>
                                        <NumberStepper
                                            value={draft.timeSec}
                                            onChange={(v) => patchDraft({ timeSec: v })}
                                            min={0}
                                            max={1000}
                                            unitLabel="Seconds"
                                            padLength={2}
                                            disabled={testDetail?.is_published}
                                        />
                                    </View>

                                    <View style={styles.field}>
                                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                            Question (rich text)
                                        </Typography>
                                        <RichTextField
                                            value={draft.questionHtml}
                                            onChange={(html: string) => patchDraft({ questionHtml: html })}
                                            placeholder="Enter instructions..."
                                            disabled={testDetail?.is_published}
                                        />
                                        {hasTriedSave && !!errors.questionHtml && (
                                            <Typography
                                                variant="semiBoldTxtxs"
                                                color={colors.error[600]}
                                                style={styles.fieldErrorText}
                                            >
                                                {errors.questionHtml}
                                            </Typography>
                                        )}
                                    </View>
                                    {(draft.questionType === 'single' || draft.questionType === 'multiple') && (
                                        <View style={styles.optionsSection}>
                                            <QuestionOptionsField
                                                mode={draft.questionType}
                                                options={draft.options}
                                                isOptionCorrect={isCorrectSelected}
                                                onOptionTextChange={updateOptionText}
                                                onAddOption={addOption}
                                                onRemoveOption={removeOption}
                                                onToggleCorrect={toggleCorrect}
                                                minOptions={MIN_OPTIONS}
                                                disabled={testDetail?.is_published}
                                            />
                                            {hasTriedSave && !!errors.options && (
                                                <Typography
                                                    variant="semiBoldTxtxs"
                                                    color={colors.error[600]}
                                                    style={styles.fieldErrorText}
                                                >
                                                    {errors.options}
                                                </Typography>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </ScrollView>

                            <View>
                                <QuizChipsPager
                                    count={pagerCount}
                                    selectedIndex={pagerSelectedIndex}
                                    onSelect={handleChipSelect}
                                />
                                {!testDetail?.is_published &&
                                    <View style={styles.saveRow}>
                                        <Button
                                            disabled={postQuestionLoading || updateQuestionLoading || deleteQuestionLoading}
                                            size={40}
                                            onPress={handleSave}
                                            style={styles.saveButton}
                                        >
                                            Save
                                        </Button>
                                        {!!updateQuestionError && (
                                            <Typography
                                                variant="semiBoldTxtxs"
                                                color={colors.error[600]}
                                                style={styles.fieldErrorText}
                                            >
                                                {updateQuestionError}
                                            </Typography>
                                        )}
                                        {!!deleteQuestionError && (
                                            <Typography
                                                variant="semiBoldTxtxs"
                                                color={colors.error[600]}
                                                style={styles.fieldErrorText}
                                            >
                                                {deleteQuestionError}
                                            </Typography>
                                        )}
                                        {!!postQuestionError && (
                                            <Typography
                                                variant="semiBoldTxtxs"
                                                color={colors.error[600]}
                                                style={styles.fieldErrorText}
                                            >
                                                {postQuestionError}
                                            </Typography>
                                        )}
                                    </View>
                                }
                            </View>
                        </>
                    )}
                </View>
            ) : creationTab === 'Upload(Excel)' ? (
                <View style={styles.tabPanel}>
                    <ExcelTestUpload embedded id={testDetail?.id} />
                </View>
            ) : creationTab === 'Generate' ? (
                <View style={styles.tabPanel}>
                    <AiTestQuestion
                        embedded
                        title={testDetail?.title}
                        testId={testId ?? testDetail?.id ?? null}
                    />
                </View>
            ) : (
                <View style={[styles.tabPanel,{marginTop:10}]}>
                    <CreateAssessmentTest embedded />
                </View>
            )}
            <ConfirmModal
                visible={deleteModalVisible}
                title="Delete question"
                message="Delete this question? This can't be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={handleCancelDelete}
                onClose={handleCancelDelete}
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
    form: {
        padding: 16,
        gap: 16,
    },
    previewSection: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        gap: 10,
        backgroundColor: colors.base.white,
    },
    selectedQuestionCard: {
        //padding: 5,
    },
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
    field: {
        gap: 4,
    },
    footer: {
        backgroundColor: colors.base.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray[200],
        paddingTop: 0,
    },
    saveRow: {
        borderTopWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    shimmerFooter: {
        borderTopWidth: 1,
        borderColor: colors.gray[200],
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 12,
    },
    optionsSection: {
        gap: 6,
    },
    fieldErrorText: {
        paddingLeft: 5
    },
    saveButton: {
        alignSelf: 'stretch',
    },
})

export default CreateTestQuestion
