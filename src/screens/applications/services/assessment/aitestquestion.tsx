import { View, ScrollView, StyleSheet, Animated } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import { Button, Header, StatCard, TextField, Typography } from '../../../../components'
import { colors } from '../../../../theme/colors'
import NumberStepper from '../../../../components/atoms/numberstepper'
import TagList from '../../../../components/molecules/taglist'
import { SvgXml } from 'react-native-svg'
import { checkIcon } from '../../../../assets/svg/check'
import ExpandableWrapper from '../../../../components/molecules/expandablewrapper'
import Card from '../../../../components/atoms/card'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import FooterButtons from '../../../../components/molecules/footerbuttons'
import { Illustrations } from '../../../../assets/svg/illustrations'
import { useStyles as useAssessmentDetailsStyles } from '../../applicantdetails/tabs/assessment/assessmentdetails/styles'
import CheckBox from '../../../../components/atoms/checkbox'
import CustomSwitch from '../../../../components/atoms/switchbutton'
import { useDispatch } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import {
    bulkCreateAssessmentQuestionsRequestAction,
    generateAssessmentQuestionsRequestAction,
} from '../../../../features/assessments/actions'
import type { AssessmentQuestionResponse, GenerateQuestionsResponse } from '../../../../features/assessments/types'
import { registerGenerateQuestionsCallbacks } from '../../../../features/assessments/generateQuestionsCallbacks'
import { sparkles } from '../../../../assets/svg/sparkles'

type GeneratedQuestionOption = {
    id: number
    label: string
    isCorrect: boolean
    isSelected: boolean
}

type GeneratedQuestion = {
    id: string
    difficulty: string
    type: string
    points: number
    seconds: number
    question: string
    options?: GeneratedQuestionOption[]
    source?: AssessmentQuestionResponse
}

const ShimmerQuestionList = ({ count = 3 }: { count?: number }) => {
    const assessmentStyles = useAssessmentDetailsStyles()
    const shimmer = React.useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0.4, duration: 700, useNativeDriver: true }),
            ]),
        )
        loop.start()
        return () => loop.stop()
    }, [shimmer])

    const items = Array.from({ length: count })
    return (
        <View style={{ gap: 12 }}>
            {items.map((_, idx) => (
                <View key={`shimmer-${idx}`} style={assessmentStyles.qCard}>
                    <View style={assessmentStyles.qCardTop}>
                        <Animated.View
                            style={[
                                styles.shimmerBar,
                                { width: 80, opacity: shimmer, backgroundColor: colors.gray[200] },
                            ]}
                        />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Animated.View style={[styles.shimmerChip, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                            <Animated.View style={[styles.shimmerChip, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                            <Animated.View style={[styles.shimmerChip, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                        </View>
                    </View>
                    <View style={{ padding: 12, gap: 12 }}>
                        <Animated.View
                            style={[
                                styles.shimmerLine,
                                { width: '92%', opacity: shimmer, backgroundColor: colors.gray[200] },
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.shimmerLine,
                                { width: '72%', opacity: shimmer, backgroundColor: colors.gray[200] },
                            ]}
                        />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            <Animated.View style={[styles.shimmerOption, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                            <Animated.View style={[styles.shimmerOption, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                            <Animated.View style={[styles.shimmerOption, { opacity: shimmer, backgroundColor: colors.gray[200] }]} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

const GeneratedQuestionsList = ({
    questions,
    selectedIds,
    onToggleQuestion,
    onToggleAll,
}: {
    questions: GeneratedQuestion[]
    selectedIds: string[]
    onToggleQuestion: (id: string) => void
    onToggleAll: () => void
}) => {
    const assessmentStyles = useAssessmentDetailsStyles()
    const allSelected = questions.length > 0 && selectedIds.length === questions.length

    return (
        <View style={{ gap: 12 }}>
            {questions.length === 0 ? <View style={{ alignItems: 'center' }}>
                <View style={{ flex: 1, alignSelf: 'center', alignContent: 'center', justifyContent: "center", }}>
                    <View
                        style={{
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            zIndex: 10,
                            marginBottom: 10,
                        }}
                    >
                        <SvgXml xml={Illustrations} style={{ zIndex: -1, }} />
                        <Typography variant="semiBoldTxtmd">
                            No questions yet
                        </Typography>

                        <Typography
                            variant="regularTxtsm"
                            color={colors.gray[500]}
                            style={{ textAlign: 'center' }}
                        >
                            Configure your prompt on the left and click Generate questions.
                        </Typography>
                    </View>
                    {/* <Button
                                    buttonColor={colors.mainColors.slateBlue}
                                    textColor={colors.common.white}
                                    borderColor={colors.mainColors.borderColor}
                                    borderRadius={8}
                                    borderWidth={1}
                                    size={'Medium'}
                                    onPress={() => { }}
                                >
                                    Add new job
                                </Button> */}
                </View>
            </View> :
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 10 }}>
                        <CheckBox
                            type="square"
                            checked={allSelected}
                            onChange={onToggleAll}
                            color={colors.brand[500]}
                        />
                        <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                            Select all
                        </Typography>
                    </View>

                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        {selectedIds.length}/{questions.length} selected
                    </Typography>
                </View>}
            {questions.map((q, idx) => (
                <>
                    <View key={q.id ? String(q.id) : `generated-q-${idx}`} style={assessmentStyles.qCard}>
                        <View style={assessmentStyles.qCardTop}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <CheckBox
                                    type="square"
                                    checked={selectedIds.includes(q.id)}
                                    onChange={() => onToggleQuestion(q.id)}
                                    color={colors.brand[500]}
                                />
                                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                    {q.seconds}s
                                </Typography>
                            </View>

                            <View style={assessmentStyles.topChips}>
                                <View
                                    style={[
                                        assessmentStyles.smallChip,
                                        { backgroundColor: colors.brand[50], borderColor: colors.brand[200] },
                                    ]}
                                >
                                    <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                                        {q.difficulty.toLowerCase()}
                                    </Typography>
                                </View>

                                <View
                                    style={[
                                        assessmentStyles.smallChip,
                                        { backgroundColor: colors.warning[50], borderColor: colors.warning[200] },
                                    ]}
                                >
                                    <Typography variant="mediumTxtxs" color={colors.warning[700]}>
                                        {q.type.toLowerCase()}
                                    </Typography>
                                </View>

                                <View
                                    style={[
                                        assessmentStyles.smallChip,
                                        { backgroundColor: colors.gray[50], borderColor: colors.gray[200] },
                                    ]}
                                >
                                    <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                                        {q.points} pts
                                    </Typography>
                                </View>
                            </View>
                        </View>

                        <View style={{ padding: 12, gap: 12 }}>
                            <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                                {q.question}
                            </Typography>

                            {String(q.type).toLowerCase().includes('text') ? (
                                <View
                                    style={{
                                        padding: 12,
                                        borderRadius: 10,
                                        backgroundColor: colors.gray[50],
                                        borderWidth: 1,
                                        borderColor: colors.gray[200],
                                        gap: 6,
                                    }}
                                >
                                    <Typography variant="mediumTxtsm" color={colors.gray[600]}>
                                        Answer
                                    </Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[700]}>
                                        Type your answer…
                                    </Typography>
                                </View>
                            ) : (
                                <View style={assessmentStyles.optionRow}>
                                    {(q.options ?? []).map((opt, optIdx) => {
                                        const isSelected = opt.isSelected
                                        const isCorrect = opt.isCorrect

                                        let backgroundColor = colors.common.white
                                        let borderColor = colors.gray[200]
                                        let textColor = colors.gray[700]

                                        if (isSelected && isCorrect) {
                                            backgroundColor = colors.success[50]
                                            borderColor = colors.success[200]
                                            textColor = colors.success[700]
                                        } else if (isSelected && !isCorrect) {
                                            backgroundColor = colors.error[50]
                                            borderColor = colors.error[200]
                                            textColor = colors.error[700]
                                        }

                                        return (
                                            <View
                                                key={`${String(q.id || idx)}-${String(opt.id)}-${optIdx}`}
                                                style={[assessmentStyles.optionChip, { backgroundColor, borderColor }]}
                                            >
                                                <Typography variant="mediumTxtsm" color={textColor}>
                                                    {opt.label}
                                                </Typography>
                                            </View>
                                        )
                                    })}
                                </View>
                            )}
                        </View>
                    </View>
                </>
            ))}
        </View>
    )
}

export type AiTestQuestionProps = {
    embedded?: boolean
    title?: string
    /** When embedded in CreateTestQuestion, route params may not include the test id — parent passes the same id used for Excel upload. */
    testId?: string | null
}

const AiTestQuestion = ({ embedded = false, title, testId: assessmentId }: AiTestQuestionProps) => {
    const route = useRoute<any>()
    const dispatch = useDispatch()
    const [generatedLoading, setGeneratedLoading] = useState(false)
    const [generatedError, setGeneratedError] = useState<string | null>(null)
    const [generated, setGenerated] = useState<GenerateQuestionsResponse | null>(null)
    const [generatedExpanded, setGeneratedExpanded] = useState(false)
    const finalTitle = title || route?.params?.title || ""
    const testIdFromRoute: string | null =
        route?.params?.assignmentId ??
        route?.params?.assignmentid ??
        route?.params?.assessmentId ??
        route?.params?.testId ??
        route?.params?.test ??
        null
    // const testName=  route?.params?.testName
    const testId: string | null =
        assessmentId != null && String(assessmentId).trim() !== '' ? String(assessmentId).trim() : testIdFromRoute
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])
    const [prompt, setPrompt] = useState(finalTitle || "dddddddd")
    const [count, setCount] = useState(5)
    const [difficulty, setDifficulty] = useState<'mixed' | 'easy' | 'medium' | 'hard'>('mixed')
    const [questionType, setQuestionType] = useState<Array<'single_choice' | 'multiple_choice' | 'text'>>([
        'single_choice',
        'multiple_choice',
    ])

    const questionTypeLabelMap: Record<(typeof questionType)[number], string> = {
        single_choice: 'Single choice',
        multiple_choice: 'Multi choice',
        text: 'Text',
    }

    const questionTypeSelectedLabels = useMemo(() => questionType.map((t) => questionTypeLabelMap[t]), [questionType])

    const difficultyLabelMap: Record<typeof difficulty, string> = {
        mixed: 'Mixed',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
    }

    const [extraContext, setExtraContext] = useState<string>('')
    const [language, setLanguage] = useState<string>('English')
    const [points, setpoints] = useState(0)
    const [defaulttime, setDefaulttime] = useState(0)
    const [avoidDuplicates, setAvoidDuplicates] = useState(false)
    const [saveDirectly, setSaveDirectly] = useState(false)

    const toggleQuestion = (id: string) => {
        setSelectedQuestionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    const toggleAllQuestions = () => {
        setSelectedQuestionIds((prev) => (prev.length === generatedQuestions.length ? [] : generatedQuestions.map((q) => q.id)))
    }

    const generatedQuestions: GeneratedQuestion[] = useMemo(() => {
        const apiQuestions = generated?.questions ?? []
        if (!Array.isArray(apiQuestions)) return []
        return (apiQuestions as AssessmentQuestionResponse[]).map((q, idx) => {
            const type = q.question_type
            const choices = Array.isArray(q?.choices) ? q.choices : []
            return {
                id: q?.id ? String(q.id) : `generated-q-${idx}`,
                difficulty: q?.difficulty || '',
                type,
                points: Number(q?.points ?? 0),
                seconds: Number(q?.time_duration ?? 0),
                question: q?.text || '',
                source: q,
                options:
                    type === 'text'
                        ? undefined
                        : choices.map((c, optIdx) => ({
                            id: c?.id != null ? Number(c.id) : optIdx + 1,
                            label: c?.value || '',
                            isCorrect: Boolean(c?.correct),
                            // Highlight the correct answer(s) by default
                            isSelected: Boolean(c?.correct),
                        })),
            }
        })
    }, [generated?.questions])

    const selectedQuestions = generatedQuestions.filter((q) => selectedQuestionIds.includes(q.id))

    // Reset selections when a new generation result arrives
    useEffect(() => {
        setSelectedQuestionIds([])
    }, [generated?.test_id, generated?.questions?.length])

    const onGenerate = () => {
        setGeneratedLoading(true)
        setGeneratedError(null)
        setGenerated(null)
        setGeneratedExpanded(true)

        const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        registerGenerateQuestionsCallbacks(requestId, {
            onSuccess: (data) => {
                setGenerated(data)
                setGeneratedLoading(false)
            },
            onError: (message) => {
                setGeneratedError(message)
                setGeneratedLoading(false)
            },
        })

        dispatch(
            generateAssessmentQuestionsRequestAction({
                params: {
                    testId,
                    prompt,
                    count,
                    difficulty,
                    question_types: questionType as any,
                    context: extraContext || undefined,
                    language: language || 'English',
                    ...(points > 0 ? { default_points: points } : {}),
                    ...(defaulttime > 0 ? { default_time_duration: defaulttime } : {}),
                    avoid_duplicates: Boolean(avoidDuplicates),
                    include_explanations: false,
                    save: Boolean(saveDirectly),
                    temperature: 0.2,
                    max_existing_questions: 20,
                } as any,
                requestId,
            }),
        )
    }

    const body = (
        <>
            {!embedded && (
                <Header title="AI Test Creation" backNavigation centerTitle onBack={goBack} />
            )}
            <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={embedded ? styles.embeddedScroll : undefined}>
                <View style={{ margin: 16, gap: 16 }}>
                    <Card style={{ gap: 16, padding: 16, }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <SvgXml xml={sparkles} />
                                <Typography variant="semiBoldTxtlg" color={colors.gray[700]}>AI Question Studio</Typography>
                                <View style={{ borderColor: colors.brand[200], borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, backgroundColor: colors.brand[50], paddingVertical: 2 }}>
                                    <Typography variant="mediumTxtxs" color={colors.brand[700]}>Premium</Typography>
                                </View>
                            </View>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>Generate high-quality questions from your prompt, then review and select before saving.</Typography>
                        </View>
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Prompt</Typography>
                            <TextField
                                value={prompt}
                                onChangeText={(t) => setPrompt(t)}
                                placeholder="Describe the type of questions you want"
                                size='Large'
                                multiline
                                numberOfLines={4}
                                style={{
                                    height: 128,
                                    textAlignVertical: 'top',
                                    paddingTop: 12,
                                }}
                            //disable={true}
                            />
                            <TagList
                                data={[
                                    "Generate screening questions for a React + TypeScript frontend role.",
                                    "Create SQL fundamentals questions focused on joins and aggregations.",
                                    "Generate analytical reasoning questions for mid-level engineers.",
                                ]}
                                bgColor={colors.gray[25]}
                                borderColor={colors.gray[200]}
                                textColor={colors.gray[700]}
                                selectedColor={{
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                    text: colors.brand[700],
                                }}
                                onSelect={(t) => {
                                    const next = Array.isArray(t) ? (t[0] ?? '') : t
                                    setPrompt(String(next ?? ''))
                                }}
                            />
                        </View>

                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Count (1–20)
                            </Typography>
                            <NumberStepper
                                value={count}
                                onChange={(t) => setCount(Number(t))}
                                min={1}
                                max={20}
                                unitLabel=""
                                padLength={0}
                            />
                        </View>

                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Difficulty
                            </Typography>
                            <TagList
                                data={["Mixed", "Easy", "Medium", "Hard"]}
                                bgColor={colors.gray[25]}
                                borderColor={colors.gray[200]}
                                textColor={colors.gray[700]}
                                selectedItem={difficultyLabelMap[difficulty]}
                                selectedColor={{
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                    text: colors.brand[700],
                                }}
                                onSelect={(item) => {
                                    const v = Array.isArray(item) ? item[0] : item
                                    const next = String(v || 'mixed').toLowerCase()
                                    if (next === 'easy' || next === 'medium' || next === 'hard' || next === 'mixed') {
                                        setDifficulty(next)
                                    }
                                }}
                            />
                        </View>
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Question types
                            </Typography>
                            <TagList
                                data={["Single choice", "Multi choice", "Text"]}
                                bgColor={colors.gray[25]}
                                borderColor={colors.gray[200]}
                                textColor={colors.gray[700]}
                                multi={true}
                                selectedItems={questionTypeSelectedLabels}
                                selectedColor={{
                                    bg: colors.brand[50],
                                    border: colors.brand[200],
                                    text: colors.brand[700],
                                }}
                                onSelect={(items) => {
                                    const list = Array.isArray(items) ? items : [items]
                                    const mapped = list.map((label) => {
                                        const l = String(label).toLowerCase()
                                        if (l.includes('single')) return 'single_choice'
                                        if (l.includes('multi')) return 'multiple_choice'
                                        return 'text'
                                    }) as Array<'single_choice' | 'multiple_choice' | 'text'>
                                    setQuestionType(mapped.length ? mapped : ['single_choice', 'multiple_choice', 'text'])
                                }}
                            />
                        </View>
                        <View style={{ gap: 6 }}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                Extra context
                            </Typography>
                            <TextField
                                value={extraContext}
                                onChangeText={(t) => { setExtraContext(t) }}
                                placeholder="Optional Constraints,skills,tone, or rubric"
                                //size='Large'
                                multiline
                                numberOfLines={4}
                                style={{
                                    height: 120,
                                    textAlignVertical: 'top',
                                    paddingTop: 12,
                                }}
                            //disable={true}
                            />
                        </View>
                        <Card style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 10 }}>

                            <SvgXml
                                xml={checkIcon}
                                color={colors.success[500]}
                                style={{ marginRight: 8, marginTop: 2 }}
                            />

                            <View style={{ flex:1}}>
                                <Typography
                                    variant="semiBoldTxtsm"
                                    color={colors.gray[700]}
                                    style={{ flexWrap: 'wrap' }}
                                >
                                    Uses test title, description, tags, and categories automatically.
                                </Typography>
                            </View>
                            <View style={{marginRight:10 ,alignItems:'flex-end', }}>
                                <Typography
                                    variant="semiBoldTxtxs"
                                    color={colors.gray[700]}
                                // style={{ flexWrap: 'wrap' }}
                                >
                                    Save directly
                                </Typography>
                                <View style={{marginRight:15}}>
                                <CustomSwitch value={saveDirectly} onValueChange={(v) => setSaveDirectly(Boolean(v))} />
                                </View>
                            </View>
                        </Card>

                        <ExpandableWrapper title={'Advanced controls'}>
                            <View style={{ gap: 16 }}>
                                <View style={{ gap: 6 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                        Language
                                    </Typography>
                                    <TextField value={language} onChangeText={(t) => setLanguage(t)} />
                                </View>
                                <View style={{ gap: 6 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                        Default points (0–100)
                                    </Typography>
                                    <NumberStepper
                                        value={points}
                                        onChange={(t) => setpoints(Number(t))}
                                        min={0}
                                        max={100}
                                        unitLabel=""
                                        padLength={0}
                                    />
                                </View>
                                <View style={{ gap: 6 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                        Default time (seconds) (20–1000)
                                    </Typography>
                                    <NumberStepper
                                        value={defaulttime}
                                        onChange={(t) => setDefaulttime(Number(t))}
                                        min={20}
                                        max={1000}
                                        unitLabel=""
                                        padLength={0}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end' }}>
                                    <Typography variant='semiBoldTxtxs'>Avoid duplicates</Typography>
                                    <CustomSwitch value={avoidDuplicates} onValueChange={(v) => setAvoidDuplicates(Boolean(v))} />
                                </View>
                            </View>
                        </ExpandableWrapper>
                        {!!generatedError && (
                            <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                {generatedError}
                            </Typography>
                        )}
                        <Button
                            disabled={generatedLoading || !testId || !prompt.trim()}
                            onPress={onGenerate}
                            isLoading={generatedLoading}
                        >
                            {generatedLoading ? 'Generating…' : 'Generate questions'}
                        </Button>
                    </Card>

                    {/* <Card> */}
                    <ExpandableWrapper
                        title={'Generated questions'}
                        expanded={generatedExpanded}
                        onExpandedChange={setGeneratedExpanded}
                    >
                        <View style={{ gap: 12 }}>
                            {generatedLoading && generatedQuestions.length === 0 ? (
                                <ShimmerQuestionList count={3} />
                            ) : (
                                <GeneratedQuestionsList
                                    questions={generatedQuestions}
                                    selectedIds={selectedQuestionIds}
                                    onToggleQuestion={toggleQuestion}
                                    onToggleAll={toggleAllQuestions}
                                />
                            )}

                            <Button
                                disabled={selectedQuestionIds.length === 0}
                                onPress={() => {
                                    if (!testId) return
                                    const payloadQuestions = selectedQuestions
                                        .map((q) => q.source)
                                        .filter((q): q is AssessmentQuestionResponse => Boolean(q))
                                        .map((q) => ({
                                            question_type: q.question_type,
                                            difficulty: q.difficulty,
                                            points: Number(q.points ?? 0),
                                            time_duration: Number(q.time_duration ?? 0),
                                            html_content: q.html_content ?? '',
                                            text: q.text ?? '',
                                            choices: Array.isArray(q.choices)
                                                ? q.choices.map((c) => ({
                                                    id: Number(c.id),
                                                    value: String(c.value ?? ''),
                                                    correct: Boolean(c.correct),
                                                }))
                                                : undefined,
                                        }))

                                    dispatch(
                                        bulkCreateAssessmentQuestionsRequestAction({
                                            testId,
                                            questions: payloadQuestions as any,
                                        }),
                                    )
                                }}
                            >
                                Add to test
                            </Button>
                        </View>
                    </ExpandableWrapper>
                    {/* </Card> */}
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
                            navigate('CreateTestQuestion',{testId})
                        },
                    }}
                />
            )}
        </>
    )

    if (embedded) {
        return <View style={styles.embeddedRoot}>{body}</View>
    }

    return <CustomSafeAreaView>{body}</CustomSafeAreaView>
}

export default AiTestQuestion

const styles = StyleSheet.create({
    embeddedRoot: {
        flex: 1,
    },
    embeddedScroll: {
        flex: 1,
    },
    shimmerBar: {
        height: 14,
        borderRadius: 8,
    },
    shimmerChip: {
        height: 18,
        width: 64,
        borderRadius: 999,
    },
    shimmerLine: {
        height: 16,
        borderRadius: 8,
    },
    shimmerOption: {
        height: 34,
        width: 150,
        borderRadius: 10,
    },
})