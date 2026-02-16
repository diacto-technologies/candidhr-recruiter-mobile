import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { SvgXml } from 'react-native-svg'

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import SlideAnimatedTab from '../../../../components/molecules/slideanimatedtab'
import FooterButtons from '../../../../components/molecules/footerbuttons'
import AssessmentCard from '../../../../components/molecules/assessmentcard'
import AssignedAssessmentCard from '../../../../components/molecules/assignedAssessmentCard'
import PrebuildAssessmentCard from '../../../../components/molecules/assessmentprebuild'
import BottomSheet from '../../../../components/organisms/bottomsheet'
import FilterSheetContent from '../../../../components/organisms/filtersheetcontent'
import SortingAndFilter from '../../../../components/organisms/sortingandfilter'
import Shimmer from '../../../../components/atoms/shimmer'
import Card from '../../../../components/atoms/card'

import { assignedUserIcon } from '../../../../assets/svg/assigneduser'
import { plusIcon } from '../../../../assets/svg/plus'
import { colors } from '../../../../theme/colors'
import {
  assessmentAssignedData,
  assignedAssessments,
  jobFiltersOption,
} from '../../../../utils/dummaydata'
import { goBack } from '../../../../utils/navigationUtils'
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getAssessmentsRequestAction } from '../../../../features/assessments/actions'
import {
  selectAssessments,
  selectAssessmentsLoading,
  selectAssessmentsHasMore,
  selectAssessmentsPagination,
} from '../../../../features/assessments/selectors'
import type { Assessment } from '../../../../features/assessments/types'
import { useStyles } from './styles'


const ASSESSMENT_TABS = ['My company', 'Prebuild', 'Assigned'] as const
type AssessmentTab = (typeof ASSESSMENT_TABS)[number]
const TAB_KEYS = {
  MY_COMPANY: 'My company',
  PREBUILD: 'Prebuild',
  ASSIGNED: 'Assigned',
} as const
const PAGINATION = { END_REACHED_THRESHOLD: 0.3, INITIAL_PAGE: 1 } as const
const SHIMMER_COUNTS = { EMPTY_LIST: 5, FOOTER: 2 } as const

type FilterOption = (typeof assessmentAssignedData)[number] | null

const tabPanelStyle = (visible: boolean) => ({
  ...StyleSheet.absoluteFillObject,
  opacity: visible ? 1 : 0,
  pointerEvents: visible ? ('auto' as const) : ('none' as const),
})

const getFooterButtonProps = () => ({
  left: {
    children: 'Assign' as const,
    variant: 'contain' as const,
    size: 44,
    buttonColor: colors.base.white,
    textColor: colors.gray[700],
    borderColor: colors.gray[300],
    borderWidth: 1,
    borderRadius: 8,
    borderGradientOpacity: 0.25,
    shadowColor: colors.gray[700],
    onPress: () => {},
    startIcon: <SvgXml xml={assignedUserIcon} />,
  },
  right: {
    children: 'Create' as const,
    variant: 'contain' as const,
    size: 44,
    borderWidth: 1,
    buttonColor: colors.brand[600],
    textColor: colors.base.white,
    borderColor: colors.base.white,
    borderRadius: 8,
    onPress: () => {},
    startIcon: <SvgXml xml={plusIcon} />,
  },
})

const ASSIGNED_FOOTER_STYLE = {
  paddingBottom: 12,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
} as const

// -----------------------------------------------------------------------------
// In-file shimmer (used only here; extract to AssessmentCardShimmer.tsx if reused)
// -----------------------------------------------------------------------------
const AssessmentCardShimmer: React.FC = () => (
  <Card style={{ marginBottom: 12, padding: 16 }}>
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

const AssessmentScreen: React.FC = () => {
  const styles = useStyles()
  const insets = useRNSafeAreaInsets()
  const dispatch = useAppDispatch()

  const [activeTab, setActiveTab] = useState<AssessmentTab>(TAB_KEYS.MY_COMPANY)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(null)

  const assessmentsList = useAppSelector(selectAssessments)
  const loading = useAppSelector(selectAssessmentsLoading)
  const hasMore = useAppSelector(selectAssessmentsHasMore)
  const pagination = useAppSelector(selectAssessmentsPagination)

  const isMyCompany = activeTab === TAB_KEYS.MY_COMPANY
  const isAssigned = activeTab === TAB_KEYS.ASSIGNED
  const isPrebuild = activeTab === TAB_KEYS.PREBUILD

  const footerButtonProps = useMemo(getFooterButtonProps, [])

  useEffect(() => {
    dispatch(getAssessmentsRequestAction({ page: PAGINATION.INITIAL_PAGE, append: false }))
  }, [dispatch])

  const loadMoreMyCompany = useCallback(() => {
    if (!hasMore || loading) return
    dispatch(getAssessmentsRequestAction({ page: pagination.page + 1, append: true }))
  }, [hasMore, loading, pagination.page, dispatch])

  const handleClearFilters = useCallback(() => setSelectedFilter(null), [])
  const handleApplyFilters = useCallback(() => setFilterSheetOpen(false), [])
  const handleOpenFilter = useCallback((item?: FilterOption) => {
    if (item != null) setSelectedFilter(item)
    setFilterSheetOpen(true)
  }, [])

  const renderMyCompanyItem = useCallback(
    ({ item }: { item: Assessment }) => <AssessmentCard item={item} />,
    []
  )
  const renderAssignedItem = useCallback(
    ({ item }: { item: (typeof assignedAssessments)[number] }) => <AssignedAssessmentCard item={item} />,
    []
  )

  const renderMyCompanyListFooter = useCallback(() => {
    if (!loading || assessmentsList.length === 0) return null
    return (
      <View style={{ paddingTop: 8 }}>
        {Array.from({ length: SHIMMER_COUNTS.FOOTER }, (_, i) => (
          <AssessmentCardShimmer key={i} />
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

  return (
    <CustomSafeAreaView>
      <Header title="Assessments" backNavigation enableJobSearch onBack={goBack} />

      <View style={{ flex: 1 }}>
        <View>
          <SlideAnimatedTab
            tabs={[...ASSESSMENT_TABS]}
            activeTab={activeTab}
            onChangeTab={(label) => setActiveTab(label as AssessmentTab)}
          />
          <View style={styles.bottomBorder} />
        </View>

        <View style={{ flex: 1 }} collapsable={false}>
          <View style={[tabPanelStyle(isMyCompany), { flex: 1 }]}>
            <FlatList
              data={assessmentsList}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16 }}
              onEndReached={loadMoreMyCompany}
              onEndReachedThreshold={PAGINATION.END_REACHED_THRESHOLD}
              ListFooterComponent={renderMyCompanyListFooter}
              ListEmptyComponent={renderMyCompanyListEmpty}
              renderItem={renderMyCompanyItem}
            />
          </View>
          <View style={[tabPanelStyle(isPrebuild), { flex: 1 }]}>
            <PrebuildAssessmentCard />
          </View>
          <View style={[tabPanelStyle(isAssigned), { flex: 1 }]}>
            <FlatList
              data={assignedAssessments}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16 }}
              renderItem={renderAssignedItem}
            />
          </View>
        </View>
      </View>

      {isMyCompany && (
        <FooterButtons
          leftButtonProps={footerButtonProps.left}
          rightButtonProps={footerButtonProps.right}
        />
      )}

      {isAssigned && (
        <View>
          <FooterButtons
            leftButtonProps={footerButtonProps.left}
            rightButtonProps={footerButtonProps.right}
            footerStyle={ASSIGNED_FOOTER_STYLE}
          />
          <View
            style={{
              marginBottom: insets.insetsBottom,
              borderTopWidth: 1,
              borderColor: colors.gray[200],
            }}
          >
            <SortingAndFilter
              title="Filters"
              options={assessmentAssignedData}
              onPressFilter={() => handleOpenFilter()}
              selectedTab={selectedFilter ?? ''}
              onItemPress={handleOpenFilter}
              setSelectedTab={(tab) => setSelectedFilter(tab as FilterOption)}
              containerStyle={{}}
              chipStyle={{}}
              activeChipStyle={{}}
            />
            <BottomSheet
              visible={filterSheetOpen}
              onClose={() => setFilterSheetOpen(false)}
              title="Filter by"
              showHeadline
              onClearAll={handleClearFilters}
            >
              <FilterSheetContent
                onCancel={() => setFilterSheetOpen(false)}
                onApply={handleApplyFilters}
                selectedTab={selectedFilter ?? ''}
                setSelectedTab={(tab) => setSelectedFilter(tab as FilterOption)}
                filtersConfig={jobFiltersOption}
                onClearAll={handleClearFilters}
                job_Id={undefined}
                mode="job"
              />
            </BottomSheet>
          </View>
        </View>
      )}
    </CustomSafeAreaView>
  )
}

export default AssessmentScreen
