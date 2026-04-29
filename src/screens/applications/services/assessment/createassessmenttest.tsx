import { ScrollView, StyleSheet, View } from 'react-native'
import Shimmer from '../../../../components/atoms/shimmer'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import Typography from '../../../../components/atoms/typography'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import { ProgressBar } from 'react-native-paper'
import { colors } from '../../../../theme/colors'
import { TextField } from '../../../../components/atoms/textfield'
import RichTextField from '../../../../components/atoms/richtextscreen'
import FooterButtons from '../../../../components/molecules/footerbuttons'
import {
    selectAssessmentTestDetail,
    selectAssessmentTestDetailLoading,
    selectUpdateAssessmentTestLoading,
    selectAssessmentCategoriesItems,
    selectAssessmentCategoriesListLoading,
    selectAssessmentCategoriesListHasMore,
    selectAssessmentCategoriesListPage,
} from '../../../../features/assessments/selectors'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import {
    clearAssessmentTestDetail,
    updateAssessmentTestRequest,
    fetchAssessmentCategoriesRequest,
} from '../../../../features/assessments/slice'
import { AssessmentCategory, AssessmentResponse } from '../../../../features/assessments/types'
import { showToastMessage } from '../../../../utils/toast'
import TagList from '../../../../components/molecules/taglist'
import { capitalizeFirstLetter } from '../../../../utils/stringUtils'
import { Button, CommonDropdown } from '../../../../components'

/** Test detail GET returns category objects; PUT expects id strings only. */
function normalizeCategoryIds(categories: string[] | AssessmentCategory[] | undefined): string[] {
    if (!Array.isArray(categories)) return []
    return categories
        .map((item) => {
            if (typeof item === 'string') return item
            if (item && typeof item === 'object' && 'id' in item && typeof (item as AssessmentCategory).id === 'string') {
                return (item as AssessmentCategory).id
            }
            return ''
        })
        .filter(Boolean)
}

const CategoriesFieldShimmer = () => (
    <View style={{ gap: 6 }}>
        <Shimmer width="38%" height={14} borderRadius={6} />
        <Shimmer width="100%" height={48} borderRadius={10} />
    </View>
)

const EmbeddedSettingsFormShimmer = () => (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <View style={{ gap: 8 }}>
            <Shimmer width="32%" height={14} borderRadius={6} />
            <Shimmer width="100%" height={44} borderRadius={8} />
        </View>
        <View style={{ gap: 8 }}>
            <Shimmer width="28%" height={14} borderRadius={6} />
            <Shimmer width="100%" height={128} borderRadius={8} />
        </View>
        <View style={{ gap: 8 }}>
            <Shimmer width="24%" height={14} borderRadius={6} />
            <Shimmer width={96} height={32} borderRadius={8} />
        </View>
        <CategoriesFieldShimmer />
        <View style={{ gap: 8 }}>
            <Shimmer width="36%" height={14} borderRadius={6} />
            <Shimmer width="100%" height={120} borderRadius={8} />
        </View>
        <View style={{ gap: 10, paddingTop: 4 }}>
            <Shimmer width="100%" height={14} borderRadius={6} />
            <Shimmer width="92%" height={14} borderRadius={6} />
            <Shimmer width="78%" height={14} borderRadius={6} />
        </View>
    </View>
)

const EmbeddedPageFooterShimmer = () => (
    <View style={styles.embeddedFooterShimmer}>
        <Shimmer height={44} borderRadius={8} style={styles.embeddedFooterShimmerBtn} />
        <Shimmer height={44} borderRadius={8} style={styles.embeddedFooterShimmerBtn} />
    </View>
)

const CURRENT_STEP = 1
const TOTAL_STEPS = 3

type CreateAssessmentTestRouteParams = {
    freshStart?: boolean
}

const CreateAssessmentTest = ({ embedded = false }) => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const route = useRoute()
    const freshStartParam =
        (route.params as CreateAssessmentTestRouteParams | undefined)?.freshStart === true
    const [testName, setTestName] = useState('');
    const [description, setDescription] = useState('');
    const [instruction, setInstruction] = useState('');
    const [testNameError, setTestNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [instructionError, setInstructionError] = useState('');
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [categoryError, setCategoryError] = useState('');
    const testDetail = useSelector(selectAssessmentTestDetail)
    const testDetailLoading = useSelector(selectAssessmentTestDetailLoading)
    const updateTestLoading = useSelector(selectUpdateAssessmentTestLoading)
    const categoriesItems = useSelector(selectAssessmentCategoriesItems)
    const categoriesLoading = useSelector(selectAssessmentCategoriesListLoading)
    const categoriesHasMore = useSelector(selectAssessmentCategoriesListHasMore)
    const categoriesPage = useSelector(selectAssessmentCategoriesListPage)

    const categoryOptions = useMemo(
        () => categoriesItems.map((c) => ({ label: c.name, value: c.id })),
        [categoriesItems],
    )

    const showCategoriesShimmer =
        testDetail?.test_type === 'coding' && categoriesLoading && categoryOptions.length === 0
    const showCategoriesPaginationShimmer =
        testDetail?.test_type === 'coding' && categoriesLoading && categoryOptions.length > 0

    useEffect(() => {
        if (!embedded || testDetail?.test_type !== 'coding') return
        dispatch(fetchAssessmentCategoriesRequest({ page: 1, append: false, o: 'name' }))
    }, [embedded, testDetail?.test_type, dispatch])

    useEffect(() => {
        if (!embedded || testDetail?.test_type !== 'coding') return
        setCategoryIds(normalizeCategoryIds(testDetail?.categories))
    }, [embedded, testDetail?.id, testDetail?.categories, testDetail?.test_type])

    useFocusEffect(
        useCallback(() => {
            if (embedded) return
            if (!freshStartParam) return
            dispatch(clearAssessmentTestDetail())
            setTestName('')
            setDescription('')
            setInstruction('')
            setTestNameError('')
            setDescriptionError('')
            setInstructionError('')
            navigation.setParams({ freshStart: false } as never)
        }, [embedded, freshStartParam, dispatch, navigation])
    )

    useEffect(() => {
        if (embedded) {
            setTestName(testDetail?.title ?? '')
            setDescription(testDetail?.description ?? '')
            setInstruction(testDetail?.instructions_html ?? testDetail?.instructions ?? '')
            return
        }
        if (!testDetail?.id) {
            return
        }
        setTestName(testDetail.title ?? '')
        setDescription(testDetail.description ?? '')
        setInstruction(testDetail.instructions_html ?? testDetail.instructions ?? '')
    }, [embedded, testDetail])

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    const handleValidation = () => {
        let isValid = true;

        if (!testName.trim()) {
            setTestNameError('Test name is required');
            isValid = false;
        } else {
            setTestNameError('');
        }
        if (description.length > 150) {
            setDescriptionError('Maximum 150 characters allowed');
            isValid = false;
        } else {
            setDescriptionError('');
        }
        const plainInstruction = stripHtml(instruction);

        if (plainInstruction.length > 400) {
            setInstructionError('Maximum 400 characters allowed');
            isValid = false;
        } else {
            setInstructionError('');
        }

        if (testDetail?.test_type === 'coding' && categoryIds.length === 0) {
            setCategoryError('Select at least one category');
            isValid = false;
        } else {
            setCategoryError('');
        }

        return isValid;
    };

    const handleEmbeddedSave = () => {
        if (!handleValidation()) {
            return;
        }
        if (!testDetail?.id) {
            showToastMessage('Test not loaded', 'error');
            return;
        }
        const plainInstructions = stripHtml(instruction);
        const { categories: _categoriesFromServer, ...testDetailForPut } = testDetail
        const body: AssessmentResponse = {
            ...testDetailForPut,
            title: testName.trim(),
            description: description ?? '',
            instructions: plainInstructions,
            instructions_html: instruction,
            categories:
                testDetail.test_type === 'coding'
                    ? categoryIds
                    : normalizeCategoryIds(testDetail.categories),
        };
        dispatch(updateAssessmentTestRequest({ testId: testDetail.id, body }));
    };

    return (
        <>
            {embedded ? (
                <View style={styles.embeddedRoot}>
                    {/* {testDetailLoading  ? (
                        <>
                            <ScrollView
                                style={styles.embeddedScroll}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                contentContainerStyle={styles.embeddedShimmerScrollContent}
                            >
                                <EmbeddedSettingsFormShimmer />
                            </ScrollView>
                            <EmbeddedPageFooterShimmer />
                        </>
                    ) : ( */}
                        <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        contentContainerStyle={{ paddingTop: 0 }}
                    >
                        <View style={{ paddingHorizontal: 16, gap: 12 }}>
                            <View style={{ gap: 4 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Test name</Typography>
                                    <Typography variant="semiBoldTxtsm" color={colors.error[500]}>*</Typography>
                                </View>
                                <TextField
                                    value={testName}
                                    onChangeText={(t) => {
                                        setTestName(t);
                                        if (t.trim() === '') {
                                            setTestNameError('Test name is required');
                                        } else {
                                            setTestNameError('');
                                        }
                                    }}
                                    placeholder="e.g SQL Fundamental"
                                    size="Small"
                                    keyboardType="name-phone-pad"
                                />
                                {testNameError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                        {testNameError}
                                    </Typography>
                                ) : null}
                            </View>
                            <View style={{ gap: 4 }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Description</Typography>
                                <TextField
                                    value={description}
                                    onChangeText={(t) => {
                                        if (t.length <= 150) {
                                            setDescription(t);
                                            setDescriptionError('');
                                        } else {
                                            setDescription(t);
                                            setDescriptionError('Maximum 150 characters allowed');
                                        }
                                    }}
                                    placeholder="Optional. Briefly describe what this test evalutes"
                                    size='Large'
                                    multiline
                                    numberOfLines={4}
                                    style={{
                                        height: 128,
                                        textAlignVertical: 'top',
                                        paddingTop: 12,
                                    }}
                                />
                                {descriptionError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[500]}>
                                        {descriptionError}
                                    </Typography>
                                ) : null}
                            </View>
                            {testDetail?.test_type &&
                                <View style={{ gap: 4 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Test Type</Typography>
                                    <TagList data={[capitalizeFirstLetter(testDetail?.test_type)]} />
                                </View>
                            }
                            {testDetail?.test_type === 'coding' && (
                                <View style={{ gap: 6 }}>
                                    {/* {showCategoriesShimmer ? (
                                        <CategoriesFieldShimmer />
                                    ) : ( */}
                                        <>
                                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                                Categories 
                                                <Typography variant="semiBoldTxtsm" color={colors.error[500]}> *</Typography>
                                            </Typography>
                                            <CommonDropdown
                                                placeholder="Select categories"
                                                options={categoryOptions}
                                                value={categoryIds}
                                                labelKey="label"
                                                valueKey="value"
                                                multiSelect
                                                searchable
                                                searchPlaceholder="Search categories…"
                                                disabled={testDetail?.is_published}
                                                onChange={(vals) => {
                                                    const next = Array.isArray(vals) ? vals : vals ? [vals] : []
                                                    setCategoryIds(next as string[])
                                                    setCategoryError('')
                                                }}
                                                onLoadMore={() => {
                                                    if (!categoriesHasMore || categoriesLoading || testDetail?.is_published) {
                                                        return
                                                    }
                                                    dispatch(
                                                        fetchAssessmentCategoriesRequest({
                                                            page: categoriesPage + 1,
                                                            append: true,
                                                            o: 'name',
                                                        }),
                                                    )
                                                }}
                                            />
                                            {showCategoriesPaginationShimmer ? (
                                                <Shimmer width="100%" height={10} borderRadius={6} />
                                            ) : null}
                                        </>
                                    {/* )} */}
                                    {categoryError ? (
                                        <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                            {categoryError}
                                        </Typography>
                                    ) : null}
                                </View>
                            )}
                            <View style={{ gap: 4 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Instructions</Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>(rich text)</Typography>
                                </View>
                                <RichTextField
                                    value={instruction}
                                    onChange={(html: string) => {
                                        const plainText = html.replace(/<[^>]*>/g, '');

                                        if (plainText.length <= 400) {
                                            setInstruction(html);
                                            setInstructionError('');
                                        } else {
                                            const trimmedText = plainText.slice(0, 400);
                                            setInstruction(trimmedText);
                                            setInstructionError('Maximum 400 characters allowed');
                                        }
                                    }}
                                    placeholder="Enter instructions..."
                                />
                                {instructionError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[500]}>
                                        {instructionError}
                                    </Typography>
                                ) : null}
                                <Typography variant='semiBoldTxtxs' color={colors.gray[500]}>
                                    Shown to candidates before they start the test.
                                </Typography>
                            </View>
                        </View>
                    </ScrollView>
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
                            onPress: () => { },
                        }}

                        rightButtonProps={{
                            children: 'Save',
                            size: 44,
                            borderWidth: 1,
                            buttonColor: colors.brand[600],
                            textColor: colors.base.white,
                            borderColor: colors.base.white,
                            borderRadius: 8,
                            isLoading: updateTestLoading,
                            disabled: !testDetail?.id || testDetailLoading,
                            onPress: handleEmbeddedSave,
                        }} />
                        </>
                    {/* )} */}
                </View>
            ) : (
                <CustomSafeAreaView style={{ flex: 1 }}>
                    {!embedded && (
                        <View style={{ marginBottom: 16 }}>
                            <Header
                                title="Create Test"
                                backNavigation
                                centerTitle
                                onBack={goBack}
                                rightComponent={
                                    <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                                        {CURRENT_STEP}/{TOTAL_STEPS}
                                    </Typography>
                                }
                            />
                            <View>
                                <ProgressBar
                                    progress={CURRENT_STEP / TOTAL_STEPS}
                                    color={colors.brand[500]}
                                    style={{
                                        height: 4,
                                        backgroundColor: colors.gray[100],
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        <View style={{ paddingHorizontal: 16, gap: 16 }}>
                            <View style={{ gap: 6 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Test name</Typography>
                                    <Typography variant="semiBoldTxtsm" color={colors.error[500]}>*</Typography>
                                </View>
                                <TextField
                                    value={testName}
                                    onChangeText={(t) => {
                                        setTestName(t);
                                        if (t.trim() === '') {
                                            setTestNameError('Test name is required');
                                        } else {
                                            setTestNameError('');
                                        }
                                    }}
                                    placeholder="e.g SQL Fundamental"
                                    size="Medium"
                                    keyboardType="name-phone-pad"
                                />
                                {testNameError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[600]}>
                                        {testNameError}
                                    </Typography>
                                ) : null}
                            </View>
                            <View style={{ gap: 6 }}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Description</Typography>
                                <TextField
                                    value={description}
                                    onChangeText={(t) => {
                                        if (t.length <= 150) {
                                            setDescription(t);
                                            setDescriptionError('');
                                        } else {
                                            setDescription(t);
                                            setDescriptionError('Maximum 150 characters allowed');
                                        }
                                    }}
                                    placeholder="Optional. Briefly describe what this test evalutes"
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
                                {descriptionError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[500]}>
                                        {descriptionError}
                                    </Typography>
                                ) : null}
                            </View>
                            <View style={{ gap: 6 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Instructions</Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[600]}>(rich text)</Typography>
                                </View>
                                <RichTextField
                                    value={instruction}
                                    onChange={(html: string) => {
                                        // Remove HTML tags to count only text
                                        const plainText = html.replace(/<[^>]*>/g, '');

                                        if (plainText.length <= 400) {
                                            setInstruction(html);
                                            setInstructionError('');
                                        } else {
                                            // Prevent extra input (truncate)
                                            const trimmedText = plainText.slice(0, 400);
                                            setInstruction(trimmedText);
                                            setInstructionError('Maximum 400 characters allowed');
                                        }
                                    }}
                                    placeholder="Enter instructions..."
                                />
                                {instructionError ? (
                                    <Typography variant="semiBoldTxtxs" color={colors.error[500]}>
                                        {instructionError}
                                    </Typography>
                                ) : null}
                                <Typography variant='semiBoldTxtxs' color={colors.gray[500]}>Shown to candidates before they start the test.</Typography>
                            </View>
                        </View>
                    </ScrollView>
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
                            onPress: () => { },
                        }}

                        rightButtonProps={{
                            children: "Next",
                            size: 44,
                            borderWidth: 1,
                            buttonColor: colors.brand[600],
                            textColor: colors.base.white,
                            borderColor: colors.base.white,
                            borderRadius: 8,
                            onPress: () => {
                                if (handleValidation()) {
                                    if (CURRENT_STEP < TOTAL_STEPS) {
                                        navigate('CreateTestType', {
                                            step: CURRENT_STEP + 1,
                                            TOTAL_STEPS: TOTAL_STEPS,
                                            testName,
                                            description,
                                            instruction,
                                        });
                                    }
                                }
                            }
                        }} />
                </CustomSafeAreaView>
            )}
        </>
    )
}

export default CreateAssessmentTest;

const styles = StyleSheet.create({
    embeddedRoot: {
        flex: 1,
        backgroundColor: colors.base.white,
    },
    embeddedScroll: {
        flex: 1,
    },
    embeddedShimmerScrollContent: {
        flexGrow: 1,
        paddingTop: 0,
        paddingBottom: 8,
    },
    embeddedFooterShimmer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.gray[200],
        backgroundColor: colors.base.white,
    },
    embeddedFooterShimmerBtn: {
        flex: 1,
        maxWidth: '48%',
    },
})