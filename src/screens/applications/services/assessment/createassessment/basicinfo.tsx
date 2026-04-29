import { View, ScrollView, ActivityIndicator, Keyboard } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import CustomSafeAreaView from '../../../../../components/atoms/customsafeareaview'
import Header from '../../../../../components/organisms/header'
import { goBack, navigate } from '../../../../../utils/navigationUtils'
import { colors } from '../../../../../theme/colors'
import Typography from '../../../../../components/atoms/typography'
import { useRoute } from '@react-navigation/native'
import { ProgressBar } from 'react-native-paper'
import FooterButtons from '../../../../../components/molecules/footerbuttons'
import { Button, TextField } from '../../../../../components'
import NumberStepper, {
    type NumberStepperHandle,
} from '../../../../../components/atoms/numberstepper'
import TagList from '../../../../../components/molecules/taglist'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import {
    setAssessmentCreateWizardBasicInfo,
    loadBlueprintForEditRequest,
} from '../../../../../features/assessments/slice'
import {
    selectLoadBlueprintForEditLoading,
    selectLoadBlueprintForEditError,
    selectAssessmentCreateWizardBasicInfo,
    selectAssessmentCreateWizardLoadBlueprintDetail,
} from '../../../../../features/assessments/selectors'
import { showToastMessage } from '../../../../../utils/toast'

const MAX_DESCRIPTION_LENGTH = 150
const DESCRIPTION_LENGTH_ERROR = 'Maximum 150 characters allowed'
const DURATION_EXCEED_ERROR =
    'Duration cannot exceed 3 hours (180 minutes).'
const PASSING_RANGE_ERROR = 'Passing score must be between 0 and 100.'
const DURATION_RANGE_ERROR = 'Duration must be between 1 and 180 minutes.'

const STEP_MAX = 999999999

const durationErrorFor = (n: number) => {
    if (n < 1) {
        return DURATION_RANGE_ERROR
    }
    if (n > 180) {
        return DURATION_EXCEED_ERROR
    }
    return ''
}

const passingErrorFor = (n: number) => {
    if (n < 0 || n > 100) {
        return PASSING_RANGE_ERROR
    }
    return ''
}

const BasicInfo = () => {
    const route = useRoute<any>()
    const dispatch = useAppDispatch()
    const loadBlueprintLoading = useSelector(selectLoadBlueprintForEditLoading)
    const loadBlueprintError = useSelector(selectLoadBlueprintForEditError)
    const wizardBasic = useSelector(selectAssessmentCreateWizardBasicInfo)
    /** Full GET /blueprints/{id}/ (created_by, sections, questions, proctoring_configuration, …). */
    const loadBlueprintDetail = useSelector(
        selectAssessmentCreateWizardLoadBlueprintDetail
    )
    const formSyncedFromStore = useRef(false)
    const durationStepperRef = useRef<NumberStepperHandle>(null)
    const passingStepperRef = useRef<NumberStepperHandle>(null)
    const routeBlueprintId =
        typeof route.params?.blueprintId === 'string'
            ? route.params.blueprintId.trim()
            : ''

    const CURRENT_STEP = route.params?.step || 1
    const TOTAL_STEPS = route.params?.TOTAL_STEPS || 4
    const [assessmentTitle, setAssessmentTitle] = useState('')
    const [titleError, setTitleError] = useState('')
    const [description, setDescription] = useState('')
    const [durationMins, setDurationMins] = useState(60)
    const [passingScore, setPassingScore] = useState(50)
    /** After user taps Continue, show duration / passing validation (no layout or input change). */
    const [triedStepFields, setTriedStepFields] = useState(false)
    const [skillInput, setSkillInput] = useState('')
    const [skills, setSkills] = useState<string[]>([])

    useEffect(() => {
        formSyncedFromStore.current = false
        setTriedStepFields(false)
        setTitleError('')
        setSkillInput('')
        if (routeBlueprintId) {
            setAssessmentTitle('')
            setDescription('')
            setDurationMins(60)
            setPassingScore(50)
            setSkills([])
        }
    }, [routeBlueprintId])

    useEffect(() => {
        if (!routeBlueprintId) {
            return
        }
        dispatch(loadBlueprintForEditRequest({ blueprintId: routeBlueprintId }))
    }, [routeBlueprintId, dispatch])

    useEffect(() => {
        if (loadBlueprintError) {
            showToastMessage(String(loadBlueprintError), 'error')
        }
    }, [loadBlueprintError])

    useEffect(() => {
        if (formSyncedFromStore.current || loadBlueprintLoading) {
            return
        }
        if (!routeBlueprintId || !wizardBasic) {
            return
        }
        const idFromStore = String(wizardBasic.id ?? '').trim()
        if (idFromStore && idFromStore !== routeBlueprintId) {
            return
        }
        formSyncedFromStore.current = true
        setAssessmentTitle(wizardBasic.title)
        setDescription(wizardBasic.description)
        setDurationMins(wizardBasic.durationMins)
        setPassingScore(wizardBasic.passingScore)
        setSkills([...wizardBasic.skills])
    }, [loadBlueprintLoading, routeBlueprintId, wizardBasic])

    const addSkills = () => {
        const raw = skillInput.trim()
        if (!raw) {
            return
        }
        const parts = raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
        if (parts.length === 0) {
            return
        }
        setSkills((prev) => {
            const next = [...prev]
            for (const p of parts) {
                if (
                    !next.some(
                        (s) => s.toLowerCase() === p.toLowerCase()
                    )
                ) {
                    next.push(p)
                }
            }
            return next
        })
        setSkillInput('')
    }

    const removeSkillAt = (index: number) => {
        setSkills((prev) => prev.filter((_, i) => i !== index))
    }

    const descriptionTooLong = description.length > MAX_DESCRIPTION_LENGTH
    const durationError = triedStepFields ? durationErrorFor(durationMins) : ''
    const passingError = triedStepFields ? passingErrorFor(passingScore) : ''

    const onContinue = () => {
        Keyboard.dismiss()
        const durationCommitted =
            durationStepperRef.current?.commit() ?? durationMins
        const passingCommitted =
            passingStepperRef.current?.commit() ?? passingScore
        setTriedStepFields(true)
        if (!assessmentTitle.trim()) {
            setTitleError('Assessment title is required.')
        } else {
            setTitleError('')
        }
        if (
            !assessmentTitle.trim() ||
            descriptionTooLong ||
            durationErrorFor(durationCommitted) ||
            passingErrorFor(passingCommitted)
        ) {
            return
        }
        dispatch(
            setAssessmentCreateWizardBasicInfo({
                title: assessmentTitle.trim(),
                description,
                durationMins: durationCommitted,
                passingScore: passingCommitted,
                skills: [...skills],
            })
        )
        navigate('Section', {
            step: 2,
            TOTAL_STEPS: 4,
            blueprintId: route.params?.blueprintId,
        })
    }

    const showEditLoader = Boolean(routeBlueprintId && loadBlueprintLoading)
    const isBlueprintPublished = Boolean(
        wizardBasic?.is_published ?? loadBlueprintDetail?.is_published
    )

    return (
        <CustomSafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>

            {/* Header */}
            <View>
                <Header
                    subtitle="Create assessment"
                    title="Basic Info"
                    backNavigation
                    centerTitle
                    onBack={goBack}
                    rightComponent={
                        <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                            {CURRENT_STEP}/{TOTAL_STEPS}
                        </Typography>
                    }
                />
                {/* Progress */}
                <ProgressBar
                    progress={CURRENT_STEP / TOTAL_STEPS}
                    color={colors.brand[500]}
                    style={{
                        height: 4,
                        backgroundColor: colors.gray[100],
                    }}
                />
            </View>
            {showEditLoader ? (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 32,
                    }}
                >
                    <ActivityIndicator size="large" color={colors.brand[600]} />
                    <Typography
                        variant="regularTxtsm"
                        color={colors.gray[600]}
                        style={{ marginTop: 12 }}
                    >
                        Loading assessment…
                    </Typography>
                </View>
            ) : null}
            {!showEditLoader ? (
            <ScrollView>
                <View style={{ padding: 16, gap: 16 }}>
                    <View style={{ gap: 6 }}>
                        <Typography variant='semiBoldTxtsm'>
                            Assessment Title{' '}
                            <Typography variant='semiBoldTxtsm' color={colors.error[500]}>
                                *
                            </Typography>
                        </Typography>
                        <TextField
                            value={assessmentTitle}
                            onChangeText={(t) => {
                                setAssessmentTitle(t)
                                if (titleError) {
                                    setTitleError('')
                                }
                            }}
                            placeholder="e.g., Full Stack Developer Assessment"
                            isError={!!titleError}
                            error={titleError}
                            disable={isBlueprintPublished}
                        />
                    </View>
                    <View style={{ gap: 6 }}>
                        <Typography variant="semiBoldTxtsm">Description</Typography>
                        <TextField
                            multiline
                            height={120}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what this assessment covers"
                            isError={descriptionTooLong}
                            error={descriptionTooLong ? DESCRIPTION_LENGTH_ERROR : ''}
                            disable={Boolean(
                                wizardBasic?.is_published && wizardBasic.description
                            )}
                        />
                    </View>
                    <View style={{ gap: 6 }}>
                        <Typography variant="semiBoldTxtsm">
                            Default Duration (1 – 180 mins)
                        </Typography>
                        <NumberStepper
                            ref={durationStepperRef}
                            value={durationMins}
                            onChange={setDurationMins}
                            min={1}
                            max={STEP_MAX}
                            unitLabel=""
                            padLength={1}
                            error={durationError}
                            disabled={isBlueprintPublished}
                        />
                    </View>
                    <View style={{ gap: 6 }}>
                        <Typography variant="semiBoldTxtsm">Passing Score (%)</Typography>
                        <NumberStepper
                            ref={passingStepperRef}
                            value={passingScore}
                            onChange={setPassingScore}
                            min={0}
                            max={STEP_MAX}
                            unitLabel=""
                            padLength={1}
                            error={passingError}
                            disabled={isBlueprintPublished}
                        />
                    </View>
                    <View style={{ gap: 6 }}>
                        <Typography variant="semiBoldTxtsm">Skills (Tags)</Typography>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 8,
                                alignItems: 'flex-start',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <TextField
                                    value={skillInput}
                                    onChangeText={setSkillInput}
                                    placeholder="e.g., python, react, sql"
                                    returnKeyType="done"
                                    blurOnSubmit
                                    onSubmitEditing={addSkills}
                                    disable={isBlueprintPublished}
                                />
                            </View>
                            <Button
                                paddingHorizontal={8}
                                onPress={addSkills}
                                disabled={isBlueprintPublished}
                            >
                                Add
                            </Button>
                        </View>
                        {skills.length > 0 ? (
                            <TagList
                                data={skills}
                                bgColor=""
                                onRemove={isBlueprintPublished ? undefined : removeSkillAt}
                            />
                        ) : null}
                    </View>
                </View>
            </ScrollView>
            ) : null}
            {!showEditLoader ? (
            <View>
                <FooterButtons
                    leftButtonProps={{
                        children: "Back",
                        size: 44,
                        buttonColor: colors.base.white,
                        textColor: colors.gray[700],
                        borderColor: colors.gray[300],
                        borderWidth: 1,
                        borderRadius: 8,
                        borderGradientOpacity: 0.25,
                        shadowColor: colors.gray[700],
                        onPress: () => { goBack() },
                    }}

                    rightButtonProps={{
                        children: "Continue",
                        size: 44,
                        borderWidth: 1,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderColor: colors.base.white,
                        borderRadius: 8,
                        onPress: onContinue,
                    }} />
            </View>
            ) : null}
        </CustomSafeAreaView>
    )
}

export default BasicInfo