import { View, Pressable, StyleSheet } from 'react-native';
import React, { useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomSafeAreaView from '../../../../../components/atoms/customsafeareaview';
import Header from '../../../../../components/organisms/header';
import { goBack, navigate } from '../../../../../utils/navigationUtils';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/atoms/typography';
import { useRoute } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import FooterButtons from '../../../../../components/molecules/footerbuttons';
import { Button, CommonDropdown, Label } from '../../../../../components';
import NumberStepper from '../../../../../components/atoms/numberstepper';
import Divider from '../../../../../components/atoms/divider';
import Card from '../../../../../components/atoms/card';
import CustomSwitch from '../../../../../components/atoms/switchbutton';
import { SvgXml } from 'react-native-svg';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import type { RenderItemParams } from 'react-native-draggable-flatlist';
import { listIcon } from '../../../../../assets/svg/list';
import { deleteIcon } from '../../../../../assets/svg/deleteicon';
import type { CommonDropdownOption } from '../../../../../components/organisms/commondropdown/types';
import {
  fetchAssessmentTestOptionsRequest,
  setAssessmentCreateWizardSections,
} from '../../../../../features/assessments/slice';
import {
  selectAssessmentTestOptionsItems,
  selectAssessmentTestOptionsListHasMore,
  selectAssessmentTestOptionsListLoading,
  selectAssessmentTestOptionsListPage,
  selectLoadBlueprintForEditLoading,
  selectAssessmentCreateWizardSections,
  selectAssessmentCreateWizardBasicInfo,
  selectAssessmentCreateWizardLoadBlueprintDetail,
} from '../../../../../features/assessments/selectors';
import type { AssessmentTestOption } from '../../../../../features/assessments/types';
import { formatCustomTime } from '../../../../../utils/timeFormatter';

const DEFAULT_QUESTION_POOL = 7;
const SECTION_REQUIRED_MESSAGE = 'Add at least one section.';
const TEST_REQUIRED_MESSAGE = 'Select a test.';

const makeId = () => `section_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

function visualIndexDuringDrag(dataIndex: number, from: number, to: number): number {
  if (from === to) return dataIndex;
  if (from < to) {
    if (dataIndex === from) return to;
    if (dataIndex > from && dataIndex <= to) return dataIndex - 1;
    return dataIndex;
  }
  if (dataIndex === from) return to;
  if (dataIndex >= to && dataIndex < from) return dataIndex + 1;
  return dataIndex;
}

type SectionItem = {
  id: string;
  testId?: string;
  testTitle?: string;
  toShow: number;
  required: number;
  shuffle: boolean;
  labelQuestions: number;
  labelMarks: number;
  labelDuration: number;
};

const createEmptySection = (): SectionItem => ({
  id: makeId(),
  testId: undefined,
  testTitle: undefined,
  toShow: 1,
  required: 1,
  shuffle: false,
  labelQuestions: DEFAULT_QUESTION_POOL,
  labelMarks: 10,
  labelDuration: 10,
});

/** Prefer totals from the stored test list so steppers update when the test row loads or changes. */
function getQuestionPool(
  testId: string | undefined,
  labelQuestions: number,
  tests: AssessmentTestOption[]
): number {
  if (testId) {
    const found = tests.find((x) => x.id === testId);
    if (found != null && found.total_questions != null && found.total_questions > 0) {
      return found.total_questions;
    }
  }
  if (labelQuestions > 0) {
    return labelQuestions;
  }
  return DEFAULT_QUESTION_POOL;
}

function getSelectedTest(
  testId: string | undefined,
  tests: AssessmentTestOption[]
): AssessmentTestOption | undefined {
  if (!testId) {
    return undefined;
  }
  return tests.find((x) => x.id === testId);
}

const Section = () => {
  const route = useRoute<any>();
  const CURRENT_STEP = route.params?.step || 1;
  const TOTAL_STEPS = route.params?.TOTAL_STEPS || 4;
  const dispatch = useDispatch();

  const [sections, setSections] = useState<SectionItem[]>(() => []);
  const [continueError, setContinueError] = useState('');
  const [sectionIdsMissingTest, setSectionIdsMissingTest] = useState<string[]>([]);
  const [dragReorder, setDragReorder] = useState<{
    from: number;
    placeholder: number;
  } | null>(null);

  const testOptionsItems = useSelector(selectAssessmentTestOptionsItems);
  const testOptionsLoading = useSelector(selectAssessmentTestOptionsListLoading);
  const testOptionsHasMore = useSelector(selectAssessmentTestOptionsListHasMore);
  const testOptionsPage = useSelector(selectAssessmentTestOptionsListPage);
  const loadBlueprintLoading = useSelector(selectLoadBlueprintForEditLoading);
  const wizardBasic = useSelector(selectAssessmentCreateWizardBasicInfo);
  const loadBlueprintDetail = useSelector(
    selectAssessmentCreateWizardLoadBlueprintDetail
  );
  const isBlueprintPublished = Boolean(
    wizardBasic?.is_published ?? loadBlueprintDetail?.is_published
  );
  const blueprintSectionsFromStore = useSelector(
    selectAssessmentCreateWizardSections
  );
  const routeBlueprintId =
    typeof route.params?.blueprintId === 'string'
      ? route.params.blueprintId.trim()
      : '';

  useLayoutEffect(() => {
    if (!routeBlueprintId) {
      return;
    }
    setSections([]);
    setSectionIdsMissingTest([]);
    setContinueError('');
  }, [routeBlueprintId]);

  const testDropdownOptions: CommonDropdownOption[] = useMemo(
    () =>
      testOptionsItems.map((t) => ({
        id: t.id,
        name: t.title,
        ...t,
      })),
    [testOptionsItems]
  );

  /** NestableDraggableFlatList can skip row updates; keep example text / steppers in sync when test or pools change. */
  const listRowStateKey = useMemo(
    () =>
      `${sections
        .map(
          (s) =>
            `${s.id}/${s.testId ?? '-'}/${s.toShow}/${s.required}/${s.labelQuestions}`
        )
        .join('|')}|${testOptionsItems
        .map((t) => `${t.id}~${t.total_questions ?? 0}~${t.total_marks ?? 0}~${t.time_duration ?? 0}`)
        .join(',')}`,
    [sections, testOptionsItems]
  );

  useEffect(() => {
    dispatch(
      fetchAssessmentTestOptionsRequest({
        page: 1,
        page_size: 20,
        is_published: true,
        append: false,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (loadBlueprintLoading || !routeBlueprintId) {
      return;
    }
    if (blueprintSectionsFromStore.length === 0) {
      return;
    }
    setSections((prev) => {
      if (prev.length > 0) {
        return prev;
      }
      return blueprintSectionsFromStore.map((s) => ({
        id: s.id,
        testId: s.testId,
        testTitle: s.testTitle,
        toShow: s.toShow,
        required: s.required,
        shuffle: s.shuffle,
        labelQuestions: s.labelQuestions ?? DEFAULT_QUESTION_POOL,
        labelMarks: s.labelMarks ?? 10,
        labelDuration: s.labelDuration ?? 10,
      }));
    });
  }, [loadBlueprintLoading, routeBlueprintId, blueprintSectionsFromStore]);

  useEffect(() => {
    if (sections.length > 0) {
      setContinueError('');
    }
  }, [sections.length]);

  /** Keep section limits aligned with the selected test in Redux (pagination, late fetch, or API updates). */
  useEffect(() => {
    if (testOptionsItems.length === 0) {
      return;
    }
    setSections((prev) => {
      let changed = false;
      const next = prev.map((s) => {
        if (!s.testId) {
          return s;
        }
        const found = testOptionsItems.find((x) => x.id === s.testId);
        if (!found) {
          return s;
        }
        const totalQ = Math.max(1, found.total_questions ?? 1);
        const nextToShow = Math.min(Math.max(1, s.toShow), totalQ);
        let nextRequired = Math.min(Math.max(1, s.required), nextToShow);
        if (nextToShow === totalQ && nextToShow > s.required) {
          nextRequired = nextToShow;
        }
        const nq = found.total_questions ?? s.labelQuestions;
        const nextPatch = {
          labelQuestions: nq,
          labelMarks: found.total_marks ?? s.labelMarks,
          labelDuration: found.time_duration ?? s.labelDuration,
          testTitle: found.title || s.testTitle,
          toShow: nextToShow,
          required: nextRequired,
        };
        if (
          s.labelQuestions === nextPatch.labelQuestions &&
          s.labelMarks === nextPatch.labelMarks &&
          s.labelDuration === nextPatch.labelDuration &&
          s.testTitle === nextPatch.testTitle &&
          s.toShow === nextToShow &&
          s.required === nextRequired
        ) {
          return s;
        }
        changed = true;
        return { ...s, ...nextPatch };
      });
      return changed ? next : prev;
    });
  }, [testOptionsItems]);

  const handleLoadMoreTestOptions = useCallback(() => {
    if (testOptionsLoading || !testOptionsHasMore) return;
    dispatch(
      fetchAssessmentTestOptionsRequest({
        page: testOptionsPage + 1,
        page_size: 20,
        is_published: true,
        append: true,
      })
    );
  }, [dispatch, testOptionsLoading, testOptionsHasMore, testOptionsPage]);

  const onOpenTestDropdown = useCallback(() => {
    if (testDropdownOptions.length === 0 && !testOptionsLoading) {
      dispatch(
        fetchAssessmentTestOptionsRequest({
          page: 1,
          page_size: 20,
          is_published: true,
          append: false,
        })
      );
    }
  }, [testDropdownOptions.length, testOptionsLoading, dispatch]);

  const handleAddSection = useCallback(() => {
    setContinueError('');
    setSectionIdsMissingTest([]);
    setSections((prev) => [...prev, createEmptySection()]);
  }, []);

  const handleContinue = useCallback(() => {
    if (sections.length === 0) {
      setSectionIdsMissingTest([]);
      setContinueError(SECTION_REQUIRED_MESSAGE);
      return;
    }
    setContinueError('');
    const withoutTest = sections.filter((s) => !s.testId);
    if (withoutTest.length > 0) {
      setSectionIdsMissingTest(withoutTest.map((s) => s.id));
      return;
    }
    setSectionIdsMissingTest([]);
    const sectionsPayload = sections
      .filter((s) => s.testId && String(s.testId).trim())
      .map((s) => ({
        id: s.id,
        testId: s.testId as string,
        toShow: s.toShow,
        required: s.required,
        shuffle: s.shuffle,
      }));
    dispatch(setAssessmentCreateWizardSections(sectionsPayload));
    navigate('Instruction', {
      step: 3,
      TOTAL_STEPS: 4,
      blueprintId: route.params?.blueprintId,
    });
  }, [sections, dispatch, route.params?.blueprintId]);

  const updateSection = useCallback((id: string, patch: Partial<SectionItem>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = { ...s, ...patch };
        if (patch.toShow != null) {
          if (next.toShow > s.toShow) {
            /** "Required" should match the new "of" value when the pool grows (e.g. 01 → 05). */
            next.required = next.toShow;
          } else {
            next.required = Math.min(s.required, next.toShow);
          }
        } else if (next.required > next.toShow) {
          next.required = next.toShow;
        }
        return next;
      })
    );
  }, []);

  const handleDeleteSection = useCallback((id: string) => {
    setSectionIdsMissingTest((prev) => prev.filter((x) => x !== id));
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const onDragEndSections = useCallback(
    (params: { data: SectionItem[]; from: number; to: number }) => {
      setSections(params.data);
      setDragReorder(null);
    },
    []
  );

  const onDragBeginSection = useCallback((index: number) => {
    setDragReorder({ from: index, placeholder: index });
  }, []);

  const onPlaceholderIndexChange = useCallback((index: number) => {
    setDragReorder((prev) => (prev != null ? { ...prev, placeholder: index } : null));
  }, []);

  const keyExtractor = useCallback((item: SectionItem) => item.id, []);

  const renderSectionItem = useCallback(
    ({ item: section, drag, isActive, getIndex }: RenderItemParams<SectionItem>) => {
      const dataIndex = getIndex() ?? 0;
      const displayIndex =
        dragReorder != null
          ? visualIndexDuringDrag(dataIndex, dragReorder.from, dragReorder.placeholder)
          : dataIndex;
      const selectedTest = getSelectedTest(section.testId, testOptionsItems);
      const questionPool = Math.max(
        1,
        getQuestionPool(section.testId, section.labelQuestions, testOptionsItems)
      );
      const displayMarks = selectedTest?.total_marks ?? section.labelMarks;
      /** Test options API uses `time_duration` in minutes (see AssessmentTestOption, assessment cards). */
      const displayDurationMin = selectedTest?.time_duration ?? section.labelDuration;
      const showTestError = sectionIdsMissingTest.includes(section.id);
      const hasTest = Boolean(section.testId);
      return (
        <ScaleDecorator>
          <Card style={[styles.assessmentCard, isActive && styles.assessmentCardActive]}>
            <View style={styles.sectionTitleRow}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                {`Section ${displayIndex + 1}`}
              </Typography>
              <View style={styles.sectionTitleActions}>
                <Pressable
                  onLongPress={isBlueprintPublished ? undefined : drag}
                  delayLongPress={180}
                  accessibilityRole="button"
                  accessibilityLabel="Drag to reorder section"
                  style={({ pressed }) => [styles.dragHandle, pressed && styles.dragHandlePressed]}
                  disabled={isActive || isBlueprintPublished}
                >
                  <SvgXml xml={listIcon} width={28} height={28} />
                </Pressable>
                <Pressable
                  onPress={() => handleDeleteSection(section.id)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Delete section"
                  disabled={isBlueprintPublished}
                >
                  <SvgXml
                    xml={deleteIcon}
                    width={18}
                    height={18}
                    color={colors.error[500]}
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.fieldGap}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Test
              </Typography>
              <CommonDropdown
                placeholder="Search and select a test..."
                options={testDropdownOptions}
                value={section.testId}
                onChange={(
                  value: string | string[],
                  option?: CommonDropdownOption | CommonDropdownOption[]
                ) => {
                  const v = Array.isArray(value) ? value[0] : value;
                  const raw = !Array.isArray(option) ? option : undefined;
                  const valueId = (v as string) || undefined;
                  const fromList =
                    (raw as { id?: string } | undefined)?.id && testOptionsItems.length
                      ? testOptionsItems.find(
                        (o) => o.id === (raw as { id: string }).id
                      )
                      : undefined;
                  const t: AssessmentTestOption | undefined =
                    fromList ?? (valueId && testOptionsItems.length
                      ? testOptionsItems.find((o) => o.id === valueId)
                      : (raw as AssessmentTestOption | undefined));
                  if (t?.id) {
                    setSectionIdsMissingTest((prev) =>
                      prev.filter((x) => x !== section.id)
                    );
                    const totalQ = Math.max(1, t.total_questions ?? 1);
                    /** Default to the full test pool so the stepper value matches "of {total_questions}". */
                    const nextToShow = totalQ;
                    const nextRequired = nextToShow;
                    updateSection(section.id, {
                      testId: t.id,
                      testTitle: t.title,
                      labelQuestions: t.total_questions ?? 0,
                      labelMarks: t.total_marks ?? 0,
                      labelDuration: t.time_duration ?? 0,
                      toShow: nextToShow,
                      required: nextRequired,
                    });
                  } else {
                    updateSection(section.id, {
                      testId: valueId,
                      testTitle: undefined,
                    });
                  }
                }}
                onOpen={onOpenTestDropdown}
                onLoadMore={handleLoadMoreTestOptions}
                labelKey="name"
                valueKey="id"
                searchable
                searchField="name"
                searchPlaceholder="Search a test by name, role or type"
                error={showTestError ? TEST_REQUIRED_MESSAGE : undefined}
                containerStyle={[
                  styles.testDropdown,
                  showTestError && styles.testDropdownError,
                ]}
                mode="default"
                dropdownPosition="auto"
                disabled={isBlueprintPublished}
              />
            </View>
            {section.testId &&
              <View style={styles.labelsRow}>
                <Label
                  variant="mediumTxtxs"
                  text={`Questions:${questionPool}`}
                  textColor={colors.brand[700]}
                  borderColor={colors.brand[200]}
                  backgroundColor={colors.brand[50]}
                  borderWidth={1}
                  borderRadius={6}
                />
                <Label
                  variant="mediumTxtxs"
                  text={`Total Marks:${displayMarks}`}
                  textColor={colors.Teal[700]}
                  borderColor={colors.Teal[200]}
                  backgroundColor={colors.Teal[50]}
                  borderWidth={1}
                  borderRadius={6}
                />
                <Label
                  variant="mediumTxtxs"
                  text={`Duration:${formatCustomTime(displayDurationMin, {
                    inputUnit: 'seconds',
                    mode: 'min',
                  })}`}
                  textColor={colors.orange[700]}
                  borderColor={colors.orange[200]}
                  backgroundColor={colors.orange[50]}
                  borderWidth={1}
                  borderRadius={6}
                />
              </View>}
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleBlock}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {section.testTitle || 'Test'}
                </Typography>
                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                  Set how many questions to show and how many are required.
                </Typography>
              </View>
            </View>
            <View style={styles.stepBlock}>
              <View style={styles.fieldGap}>
                <Typography variant="mediumTxtsm">Questions to show</Typography>
                <View style={styles.stepperLine}>
                  <View style={styles.stepperWidth}>
                    <NumberStepper
                      key={`${section.id}-show-${questionPool}`}
                      value={section.toShow}
                      onChange={(v) => updateSection(section.id, { toShow: v })}
                      min={1}
                      max={questionPool}
                      step={1}
                      unitLabel=""
                      padLength={2}
                      editable
                      disabled={isBlueprintPublished}
                    />
                  </View>
                  <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                    {`of ${questionPool}`}
                  </Typography>
                </View>
                {hasTest ? (
                  <Typography
                    key={`hint-pool-${section.id}-${section.testId}-${section.toShow}-${questionPool}`}
                    variant="regularTxtsm"
                    color={colors.gray[800]}
                  >
                    {`Example: show 4 of 6 questions.`}
                  </Typography>
                ) : (
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Questions count is available once a test is selected.
                  </Typography>
                )}
              </View>
              <View style={styles.fieldGap}>
                <Typography variant="mediumTxtsm">Required questions (from shown)</Typography>
                <View style={styles.stepperLine}>
                  <View style={styles.stepperWidth}>
                    <NumberStepper
                      key={`${section.id}-req-${section.toShow}`}
                      value={section.required}
                      onChange={(v) => updateSection(section.id, { required: v })}
                      min={1}
                      max={Math.max(1, section.toShow)}
                      step={1}
                      unitLabel=""
                      padLength={2}
                      editable
                      disabled={isBlueprintPublished}
                    />
                  </View>
                  <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                    {`of ${section.toShow}`}
                  </Typography>
                </View>
                {hasTest ? (
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    {`Must be between 1 and ${section.toShow}.`}
                  </Typography>
                ) : (
                  <Typography variant="regularTxtsm" color={colors.gray[600]}>
                    Questions count is available once a test is selected.
                  </Typography>
                )}
              </View>
            </View>

            <Divider height={1} color={colors.gray[200]} />

            <View style={styles.controlsRow}>
              <View style={styles.randomizeRow}>
                <View style={styles.randomizeText}>
                  <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                    Shuffle questions in this section
                  </Typography>
                  <Typography variant="regularTxtsm" color={colors.gray[800]}>
                    Randomize the order of shown questions.
                  </Typography>
                </View>
                <View>
                  <CustomSwitch
                    value={section.shuffle}
                    onValueChange={(v) => updateSection(section.id, { shuffle: v })}
                    backgroundActive={colors.brand[600]}
                    backgroundInactive={colors.gray[200]}
                    circleActiveColor={colors.base.white}
                    circleInActiveColor={colors.base.white}
                  />
                </View>
              </View>
            </View>
          </Card>
        </ScaleDecorator>
      );
    },
    [
      handleDeleteSection,
      dragReorder,
      sections.length,
      testDropdownOptions,
      testOptionsItems,
      updateSection,
      onOpenTestDropdown,
      handleLoadMoreTestOptions,
      sectionIdsMissingTest,
      isBlueprintPublished,
    ]
  );

  return (
    <CustomSafeAreaView style={styles.screen}>
      <View>
        <Header
          subtitle="Create assessment"
          title="Section"
          backNavigation
          centerTitle
          onBack={goBack}
          rightComponent={
            <Typography variant="mediumTxtmd" color={colors.gray[500]}>
              {CURRENT_STEP}/{TOTAL_STEPS}
            </Typography>
          }
        />
        <ProgressBar
          progress={CURRENT_STEP / TOTAL_STEPS}
          color={colors.brand[500]}
          style={styles.progressBar}
        />
      </View>
      <NestableScrollContainer
        style={styles.nestableScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topBlock}>
          <View style={styles.instructionsRow}>
            <View style={styles.instructionsText}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Test Sections
              </Typography>
              <Typography
                variant="regularTxtsm"
                color={colors.gray[600]}
                style={styles.instructionsSub}
              >
                Add tests as sections and decide how many questions to include per test.
              </Typography>
            </View>
            <Button
              paddingHorizontal={8}
              size={40}
              onPress={handleAddSection}
              disabled={isBlueprintPublished}
            >
              + Add Section
            </Button>
          </View>
          <Divider height={1} />
        </View>

        {continueError ? (
          <Typography variant="regularTxtsm" color={colors.error[600]}>
            {continueError}
          </Typography>
        ) : null}

        {sections.length === 0 ? (
          <View style={styles.emptyState}>
            <Typography
              variant="regularTxtsm"
              color={colors.gray[600]}
              style={styles.emptyStateText}
            >
              No sections added yet.
            </Typography>
            <Typography
              variant="regularTxtsm"
              color={colors.gray[600]}
              style={[styles.emptyStateText, styles.emptyStateSub]}
            >
              Click &quot;Add Section&quot; to get started.
            </Typography>
          </View>
        ) : (
          <NestableDraggableFlatList<SectionItem>
            data={sections}
            keyExtractor={keyExtractor}
            renderItem={renderSectionItem}
            onDragBegin={onDragBeginSection}
            onPlaceholderIndexChange={onPlaceholderIndexChange}
            onDragEnd={onDragEndSections}
            extraData={{
              dragReorder,
              testListVersion: testDropdownOptions.length,
              sectionIdsMissingTestKey: sectionIdsMissingTest.join(),
              listRowStateKey,
              isBlueprintPublished,
            }}
            scrollEnabled={false}
            ItemSeparatorComponent={listItemSeparator}
          />
        )}
      </NestableScrollContainer>
      <View>
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
              goBack();
            },
          }}
          rightButtonProps={{
            children: 'Continue',
            size: 44,
            borderWidth: 1,
            buttonColor: colors.brand[600],
            textColor: colors.base.white,
            borderColor: colors.base.white,
            borderRadius: 8,
            onPress: handleContinue,
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'space-between' },
  nestableScroll: { flex: 1 },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[100],
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 16,
  },
  topBlock: { gap: 16 },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  instructionsText: { flex: 1, minWidth: 0 },
  instructionsSub: { marginTop: 6 },
  assessmentCard: {
    borderWidth: 1.5,
    borderColor: colors.brand[500],
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: colors.base.white,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dragHandle: {
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  dragHandlePressed: {
    opacity: 0.7,
  },
  assessmentCardActive: {
    opacity: 0.95,
  },
  fieldGap: { gap: 6 },
  testDropdown: { width: '100%' },
  testDropdownError: {
    borderColor: colors.error[500],
    borderWidth: 1,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepBlock: { gap: 10 },
  stepperLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepperWidth: { width: '80%', flex: 0 },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleBlock: { flex: 1 },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  randomizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    width: '100%',
  },
  randomizeText: { flex: 1, paddingRight: 8 },
  listItemSeparator: { height: 16 },
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
  },
  emptyStateSub: {
    marginTop: 6,
  },
});

const listItemSeparator = () => <View style={styles.listItemSeparator} />;

export default Section;
