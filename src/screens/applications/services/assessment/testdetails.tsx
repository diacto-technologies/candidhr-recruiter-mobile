import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import { goBack } from '../../../../utils/navigationUtils'
import Typography from '../../../../components/atoms/typography'
import { colors } from '../../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { arrowDown } from '../../../../assets/svg/arrowdown'

const TestDetails = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [questionDropdownOpen, setQuestionDropdownOpen] = useState(false)

    const questions = useMemo(
        () => [
            {
                id: 1,
                difficulty: 'Easy',
                type: 'Multiple choice',
                points: 2,
                seconds: 45,
                question: 'Which of the following pairs of words are most logically related?',
                options: ['Doctor : Hospital', 'Teacher : School', 'Painter : Brush', 'Chef : Recipe'],
                correctIndex: 1,
                selectedIndexes: [1],
            },
            {
                id: 2,
                difficulty: 'Hard',
                type: 'Single choice',
                points: 5,
                seconds: 90,
                question: 'Arrange the following words to form a logical sequence: 1. Seed 2. Plant 3. Fruit 4. Flower 5. Sapling',
                options: ['1-5-2-4-3', '1-5-2-3-4', '5-1-2-4-3', '1-2-5-4-3'],
                correctIndex: 0,
                selectedIndexes: [2],
            },
            {
                id: 3,
                difficulty: 'Medium',
                type: 'Multiple choice',
                points: 3,
                seconds: 75,
                question: 'Select all statements that are logically equivalent to: If it rains, then the ground gets wet.',
                options: [
                    'If the ground is not wet, then it did not rain.',
                    'If it does not rain, then the ground is not wet.',
                    'If the ground gets wet, then it rained.',
                    'The ground gets wet only if it rains.',
                ],
                correctIndexes: [0],
                selectedIndexes: [0, 3],
            },
            {
                id: 4,
                difficulty: 'Easy',
                type: 'Single choice',
                points: 2,
                seconds: 45,
                question: 'Which of the following numbers is the odd one out? 7, 13, 21, 27, 31',
                options: ['7', '13', '21', '27', '31'],
                correctIndex: 2,
                selectedIndexes: [4],
            },
            {
                id: 5,
                difficulty: 'Medium',
                type: 'Single choice',
                points: 3,
                seconds: 60,
                question: 'If all roses are flowers and some flowers fade quickly, which of the following must be true?',
                options: [
                    'Some roses fade quickly.',
                    'All flowers are roses.',
                    'Some roses are flowers.',
                    'No roses fade quickly.',
                ],
                correctIndex: 2,
                selectedIndexes: [],
            },
        ],
        [],
    )

    const selectedQuestion = questions[activeIndex]

    const questionOptions = useMemo(
        () =>
            questions.map((q, index) => ({
                label: q.question,
                value: index,
                original: q,
            })),
        [questions],
    )

    const formatSeconds = (sec: number) => {
        if (!Number.isFinite(sec)) return '0s'
        const m = Math.floor(sec / 60)
        const s = Math.floor(sec % 60)
        if (m <= 0) return `${s}s`
        return `${m}m ${s}s`
    }

    return (
        <CustomSafeAreaView>
            <Header
                title="Test details"
                backNavigation
                centerTitle
                onBack={goBack}
            />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                                Questions
                            </Typography>

                            {questions.length > 0 && (
                                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                    {String(activeIndex + 1)}/{String(questions.length)}
                                </Typography>
                            )}
                        </View>

                        <View style={styles.dropdownWrapper}>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setQuestionDropdownOpen((p) => !p)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.selectedRow}>
                                    <View style={styles.selectedContent}>
                                        <Typography
                                            variant="mediumTxtmd"
                                            color={colors.gray[900]}
                                            numberOfLines={1}
                                        >
                                            {selectedQuestion?.question ?? '—'}
                                        </Typography>
                                    </View>
                                    <SvgXml xml={arrowDown} />
                                </View>
                            </TouchableOpacity>

                            {questionDropdownOpen && (
                                <View style={styles.dropdownContainer}>
                                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                                        {questionOptions.map((item) => {
                                            const q = item.original
                                            const isActive = item.value === activeIndex
                                            return (
                                                <TouchableOpacity
                                                    key={String(item.value)}
                                                    style={[
                                                        styles.dropdownItem,
                                                        isActive && styles.dropdownItemActive,
                                                    ]}
                                                    onPress={() => {
                                                        setActiveIndex(item.value)
                                                        setQuestionDropdownOpen(false)
                                                    }}
                                                    activeOpacity={0.85}
                                                >
                                                    <Image
                                                        source={{
                                                            uri: 'https://dummyimage.com/140x140/e5e7eb/111827.png&text=Q',
                                                        }}
                                                        resizeMode="cover"
                                                        style={styles.thumbnail}
                                                    />
                                                    <View style={styles.dropdownContent}>
                                                        <Typography
                                                            variant="mediumTxtmd"
                                                            color={colors.gray[900]}
                                                            numberOfLines={3}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {q.question}
                                                        </Typography>
                                                        <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                                            {q.type} · {q.difficulty} · {q.points} pts · {formatSeconds(q.seconds)}
                                                        </Typography>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Selected Question Card (AssessmentsDetails style) */}
                        <View style={styles.qCard}>
                            <View style={styles.qCardTop}>
                                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                                    {formatSeconds(selectedQuestion?.seconds ?? 0)} · {selectedQuestion?.points ?? 0} pts
                                </Typography>

                                <View style={styles.topChips}>
                                    <View
                                        style={[
                                            styles.smallChip,
                                            { backgroundColor: colors.brand[50], borderColor: colors.brand[200] },
                                        ]}
                                    >
                                        <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                                            {selectedQuestion?.difficulty ?? '—'}
                                        </Typography>
                                    </View>

                                    <View
                                        style={[
                                            styles.smallChip,
                                            {
                                                backgroundColor: colors.warning[50],
                                                borderColor: colors.warning[200],
                                            },
                                        ]}
                                    >
                                        <Typography variant="mediumTxtxs" color={colors.warning[700]}>
                                            {selectedQuestion?.type ?? '—'}
                                        </Typography>
                                    </View>
                                </View>
                            </View>

                            <View style={{ padding: 12, gap: 12 }}>
                                <Typography variant="mediumTxtmd" color={colors.gray[900]}>
                                    {String(activeIndex + 1)}. {selectedQuestion?.question ?? '—'}
                                </Typography>

                                <View style={{ gap: 12 }}>
                                    {/* Selected answer(s) */}
                                    <View style={styles.optionRow}>
                                        {(selectedQuestion?.options ?? []).map((label, idx) => {
                                            const selectedSet = new Set<number>(
                                                Array.isArray((selectedQuestion as any)?.selectedIndexes)
                                                    ? (selectedQuestion as any).selectedIndexes
                                                    : [],
                                            )
                                            const correctSet = new Set<number>(
                                                Array.isArray((selectedQuestion as any)?.correctIndexes)
                                                    ? (selectedQuestion as any).correctIndexes
                                                    : typeof (selectedQuestion as any)?.correctIndex === 'number'
                                                      ? [(selectedQuestion as any).correctIndex]
                                                      : [],
                                            )

                                            const isSelected = selectedSet.has(idx)
                                            const isCorrect = correctSet.has(idx)

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
                                                    key={`${selectedQuestion?.id ?? 'q'}-chip-${idx}`}
                                                    style={[styles.optionChip, { backgroundColor, borderColor }]}
                                                >
                                                    <Typography variant="mediumTxtsm" color={textColor}>
                                                        {label}
                                                    </Typography>
                                                </View>
                                            )
                                        })}

                                        {(selectedQuestion as any)?.selectedIndexes?.length === 0 && (
                                            <Typography variant="regularTxtsm" color={colors.error[500]}>
                                                No option selected
                                            </Typography>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </CustomSafeAreaView>
    )
}

export default TestDetails

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: colors.common.white,
        // borderRadius: 12,
        // borderWidth: 0.5,
        // borderColor: colors.gray[200],
        padding: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownWrapper: {
        marginTop: 16,
        zIndex: 1000,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        backgroundColor: colors.common.white,
        padding: 12,
        shadowColor: 'rgb(10, 13, 18)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    selectedContent: {
        flex: 1,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        backgroundColor: colors.common.white,
        marginTop: 4,
        elevation: 10,
        shadowColor: '#0A0D12',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        maxHeight: 380,
        overflow: 'hidden',
    },
    dropdownScroll: {
        maxHeight: 380,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    dropdownItemActive: {
        backgroundColor: colors.brand[25],
        borderLeftWidth: 3,
        borderLeftColor: colors.brand[600],
    },
    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: colors.gray[200],
    },
    dropdownContent: {
        flex: 1,
        gap: 4,
    },
    qCard: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        marginTop: 16,
        backgroundColor: colors.common.white,
    },
    qCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        padding: 12,
    },
    topChips: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    smallChip: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        borderWidth: 1,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
    optionChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
})