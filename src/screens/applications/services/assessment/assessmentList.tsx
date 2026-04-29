import { View, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import SlideAnimatedTab from '../../../../components/molecules/slideanimatedtab'
import { colors } from '../../../../theme/colors'
import { Shimmer, Typography } from '../../../../components'
import { SvgXml } from 'react-native-svg'
import { filter2Icon } from '../../../../assets/svg/filter2'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { selectAssessments, selectAssessmentsCounts, selectAssessmentsHasMore, selectAssessmentsLoading, selectAssessmentsPagination } from '../../../../features/assessments/selectors'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { getAssessmentsRequestAction } from '../../../../features/assessments/actions'
import Card from '../../../../components/atoms/card'
import { Assessment } from '../../../../features/assessments/types'
import AssessmentCard from '../../../../components/molecules/assessmentcard'
import BottomSheet from '../../../../components/organisms/bottomsheet'
import AssessmentListCard from '../../../../components/molecules/assessmentcard/assessmentListcard'
import { screenHeight } from '../../../../utils/devicelayout'

const ASSESSMENT_TABS = ['All', 'Draft', 'Published', 'Archived'] as const
type AssessmentTab = (typeof ASSESSMENT_TABS)[number]

const TAB_KEYS = {
    All: 'All',
    Draft: 'Draft',
    Published: 'Published',
    Archived: 'Archived'
} as const

/** Blueprints list sort options (API `o` param) — differs from Test Library. */
const SORT_OPTIONS = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Title (A-Z)', value: 'title' },
    { label: 'Title (Z-A)', value: '-title' },
    { label: 'Most Questions', value: '-total_questions' },
    { label: 'Least Questions', value: 'total_questions' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']
const DEFAULT_SORT: SortValue = '-created_at'

const AssessmentList = () => {
    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState<AssessmentTab>(TAB_KEYS.All)
    const [filterSheetOpen, setFilterSheetOpen] = useState(false)
    const [sortBy, setSortBy] = useState<SortValue>(DEFAULT_SORT)
    const [draftSortBy, setDraftSortBy] = useState<SortValue>(DEFAULT_SORT)
    const [openSearch, setOpenSearch] = useState(false)
    const [titleSearchInput, setTitleSearchInput] = useState('')
    const [debouncedTitle, setDebouncedTitle] = useState('')
    const assessmentsList = useAppSelector(selectAssessments)
    const loading = useAppSelector(selectAssessmentsLoading)
    const hasMore = useAppSelector(selectAssessmentsHasMore)
    const pagination = useAppSelector(selectAssessmentsPagination)
    const counts = useAppSelector(selectAssessmentsCounts)
    const safeCount = (value: unknown) => {
        const n = typeof value === 'number' ? value : Number(value)
        return Number.isFinite(n) ? n : 0
    }
    const PAGINATION = { END_REACHED_THRESHOLD: 0.3, INITIAL_PAGE: 1 } as const
    const SHIMMER_COUNTS = { EMPTY_LIST: 5, FOOTER: 2 } as const

    const activeTabQuery = useMemo(() => {
        if (activeTab === TAB_KEYS.Draft) return { is_published: false, is_archived: false }
        if (activeTab === TAB_KEYS.Published) return { is_published: true, is_archived: false }
        if (activeTab === TAB_KEYS.Archived) return { is_archived: true }
        return {}
    }, [activeTab])

    const titleQueryParam = debouncedTitle.trim() || undefined

    useEffect(() => {
        const t = setTimeout(() => setDebouncedTitle(titleSearchInput), 400)
        return () => clearTimeout(t)
    }, [titleSearchInput])

    const AssessmentCardShimmer: React.FC = () => (
        <Card style={{flex:1,marginBottom: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Shimmer width="70%" height={18} borderRadius={6} />
                <Shimmer width={20} height={20} borderRadius={6} />
            </View>
            <Shimmer width="55%" height={14} borderRadius={6} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Shimmer width="45%" height={14} borderRadius={6} />
                <View style={{ width: 10 }} />
                <Shimmer width="40%" height={14} borderRadius={6} />
            </View>
            <View style={{ height: 1, backgroundColor: colors.gray[200], marginVertical: 8 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Shimmer width={32} height={32} borderRadius={16} />
                    <Shimmer width={48} height={14} borderRadius={6} style={{ marginLeft: 8, alignSelf: 'center' }} />
                </View>
                <Shimmer width={64} height={20} borderRadius={6} />
            </View>
        </Card>
    )

    useEffect(() => {
        dispatch(
            getAssessmentsRequestAction({
                page: PAGINATION.INITIAL_PAGE,
                append: false,
                listSource: 'blueprints',
                o: sortBy,
                title: titleQueryParam,
                ...activeTabQuery,
            })
        )
    }, [dispatch, activeTabQuery, sortBy, titleQueryParam])

    const loadMoreMyCompany = useCallback(() => {
        if (!hasMore || loading) return
        dispatch(
            getAssessmentsRequestAction({
                page: pagination.page + 1,
                append: true,
                listSource: 'blueprints',
                o: sortBy,
                title: titleQueryParam,
                ...activeTabQuery,
            })
        )
    }, [hasMore, loading, pagination.page, dispatch, activeTabQuery, sortBy, titleQueryParam])

    const onApplySort = useCallback(() => {
        setSortBy(draftSortBy)
        setFilterSheetOpen(false)
    }, [draftSortBy])

    const renderMyCompanyListFooter = useCallback(() => {
        if (!loading || assessmentsList.length === 0) return null
        return (
            <View style={{ paddingTop: 8 }}>
                {Array.from({ length: SHIMMER_COUNTS.FOOTER }, (_, i) => (
                    // <AssessmentCardShimmer key={i} />
                    <Shimmer height={12} borderRadius={6} key={i} />
                ))}
            </View>
        )
    }, [loading, assessmentsList.length])

    const renderMyCompanyListEmpty = useCallback(
        () =>
            !loading ? null : (
                <View style={{ paddingTop: 8 }}>
                    {Array.from({ length: SHIMMER_COUNTS.EMPTY_LIST }, (_, i) => (
                        <AssessmentCardShimmer key={i} />
                    ))}
                </View>
            ),
        [loading]
    )

    const renderMyCompanyItem = useCallback(
        ({ item }: { item: Assessment }) => <AssessmentListCard item={item} />,
        []
    )

    return (
        <CustomSafeAreaView>
            <Header
                title="Assessments"
                backNavigation
                enableJobSearch
                simpleSearch
                simpleSearchPlaceholder="Search by title"
                openSearch={openSearch}
                onSearchToggle={setOpenSearch}
                searchText={titleSearchInput}
                onSimpleSearch={setTitleSearchInput}
                onSimpleClear={() => {
                    setTitleSearchInput('')
                    setDebouncedTitle('')
                    setOpenSearch(false)
                }}
                onBack={()=>navigate('AssessmentScreen')}
            />
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Pressable
                    onPress={() => {
                        setDraftSortBy(sortBy)
                        setFilterSheetOpen(true)
                    }}
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            paddingHorizontal: 8,
                        },
                    ]}
                >
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }}>
                        <View style={{}}>
                            <SvgXml xml={filter2Icon} color={colors.gray[500]} height={20} width={20} />
                        </View>

                        <Typography variant="semiBoldTxtsm" color={colors.gray[600]}>
                            Filter
                        </Typography>
                    </View>
                </Pressable>
                <View style={{ flex: 1 }}>
                    <SlideAnimatedTab
                        tabs={[...ASSESSMENT_TABS]}
                        activeTab={activeTab}
                        onChangeTab={(label) => setActiveTab(label as AssessmentTab)}
                        counts={{
                            All: safeCount(counts.all),
                            Draft: safeCount(counts.draft),
                            Published: safeCount(counts.published),
                            Archived: safeCount(counts.archived),
                        }}
                        countShow={true}
                    />
                </View>
            </View>
            <View style={styles.bottomBorder} />
            <FlatList
                data={assessmentsList}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
                onEndReached={loadMoreMyCompany}
                onEndReachedThreshold={PAGINATION.END_REACHED_THRESHOLD}
                ListFooterComponent={renderMyCompanyListFooter}
                ListEmptyComponent={renderMyCompanyListEmpty}
                renderItem={renderMyCompanyItem}
            />
            <BottomSheet
                visible={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                title="Sort"
                onClearAll={() => setDraftSortBy(DEFAULT_SORT)}
                sheetHeightRatio={0}  hight={undefined} 
            >
                <View style={styles.sortSheetContent}>
                    {SORT_OPTIONS.map((option) => {
                        const isSelected = draftSortBy === option.value
                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => setDraftSortBy(option.value)}
                                style={styles.sortRow}
                            >
                                <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
                                    {option.label}
                                </Typography>
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected ? <View style={styles.radioInner} /> : null}
                                </View>
                            </Pressable>
                        )
                    })}

                    <Pressable style={styles.applyButton} onPress={onApplySort}>
                        <Typography variant="semiBoldTxtmd" color={colors.base.white}>
                            Apply
                        </Typography>
                    </Pressable>
                </View>
            </BottomSheet>
        </CustomSafeAreaView>
    )
}

export default AssessmentList

const styles = StyleSheet.create({
    bottomBorder: {
        height: 1,
        backgroundColor: colors.mainColors.borderColor || "#E5E5E5",
        marginTop: -1,
    },
    sortSheetContent: {
        marginBottom:5,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 18,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        marginHorizontal: 5,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderColor: colors.gray[200],
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.gray[300],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.base.white,
    },
    radioOuterSelected: {
        borderColor: colors.brand[600],
        borderWidth: 2,
    },
    radioInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: colors.brand[600],
    },
    applyButton: {
        marginTop: 8,
        backgroundColor: colors.brand[600],
        borderRadius: 10,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
})