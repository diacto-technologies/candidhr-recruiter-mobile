import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';

import FooterButtons from '../../../../components/molecules/footerbuttons';
import CustomModalWrapper, {
    CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} from '../../../../components/organisms/custommodalwrapper';
import { colors } from '../../../../theme/colors';
import { Button, CommonDropdown, Typography } from '../../../../components';
import { SvgXml } from 'react-native-svg';
import CheckBox from '../../../../components/atoms/checkbox';
import { trashIcon } from '../../../../assets/svg/trash';
import { fileIcon } from '../../../../assets/svg/file';
import AddScreeningQuestionModal, {
    AddScreeningQuestionPayload,
} from './addScreeningQuestionModal';
import CreateQuestionSetModal, { CreateQuestionSetPayload } from './createQuestionSetModal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
    createQuestionSetRequestAction,
    createScreenQuestionRequestAction,
    deleteScreenQuestionRequestAction,
    fetchQuestionSetsRequestAction,
    fetchSetQuestionsRequestAction,
} from '../../../../features/questionSets/actions';
import { clearLastCreatedQuestionSet, clearSetQuestions } from '../../../../features/questionSets/slice';
import type { ScreenQuestion } from '../../../../features/questionSets/types';
import { showToastMessage } from '../../../../utils/toast';

export type CriteriaRowPayload = { id: string; title: string; typeLabel: string };

export type ScreeningQuestionLibraryModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm?: (rows: CriteriaRowPayload[]) => void;
    /** Question ids already on the application form — shown checked when this set’s list loads. */
    alreadySelectedQuestionIds?: string[];
};

const FOOTER_BLEED = {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    marginBottom: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} as const;

type LibraryQuestionRow = {
    id: string;
    text: string;
    durationSec: number;
    responseType: 'text' | 'audio';
};

function mapScreenQuestionToRow(q: ScreenQuestion): LibraryQuestionRow {
    const t = (q.type ?? 'text').toLowerCase();
    return {
        id: q.id,
        text: q.text ?? '',
        durationSec: typeof q.time_limit === 'number' ? q.time_limit : 0,
        responseType: t === 'audio' ? 'audio' : 'text',
    };
}

export default function ScreeningQuestionLibraryModal({
    visible,
    onClose,
    onConfirm,
    alreadySelectedQuestionIds = [],
}: ScreeningQuestionLibraryModalProps) {
    const dispatch = useAppDispatch();
    const {
        items: questionSetItems,
        page: questionSetsPage,
        hasMore: questionSetsHasMore,
        loading: questionSetsLoading,
        loadingMore: questionSetsLoadingMore,
        setQuestions,
        lastCreatedQuestionSet,
        createQuestionSetLoading,
        createScreenQuestionLoading,
        deleteScreenQuestionPendingIds,
    } = useAppSelector((state) => state.questionSets);

    const {
        items: apiQuestions,
        page: questionsPage,
        hasMore: questionsHasMore,
        loading: questionsLoading,
        loadingMore: questionsLoadingMore,
    } = setQuestions;

    const [questionSetId, setQuestionSetId] = useState('');
    const [addQuestionOpen, setAddQuestionOpen] = useState(false);
    const [createSetOpen, setCreateSetOpen] = useState(false);
    /** Checkbox selection by question id. */
    const [selectedById, setSelectedById] = useState<Record<string, boolean>>({});
    /** One-time preselect merge per question set load (avoids wiping toggles on “load more”). */
    const preselectAppliedRef = useRef(false);

    const alreadySelectedKey = useMemo(
        () => [...alreadySelectedQuestionIds].sort().join('|'),
        [alreadySelectedQuestionIds]
    );

    const apiQuestionRows = useMemo(
        () => apiQuestions.map(mapScreenQuestionToRow),
        [apiQuestions]
    );

    const mergedQuestions = apiQuestionRows;

    const questionCount = mergedQuestions.length;

    const selectedCount = useMemo(
        () => mergedQuestions.filter((q) => selectedById[q.id]).length,
        [mergedQuestions, selectedById]
    );

    useEffect(() => {
        if (visible) {
            preselectAppliedRef.current = false;
        } else {
            setSelectedById({});
            preselectAppliedRef.current = false;
            dispatch(clearSetQuestions());
        }
    }, [visible, dispatch]);

    useEffect(() => {
        preselectAppliedRef.current = false;
    }, [questionSetId, alreadySelectedKey]);

    useEffect(() => {
        if (!visible || questionsLoading || mergedQuestions.length === 0) return;
        if (preselectAppliedRef.current) return;
        preselectAppliedRef.current = true;
        setSelectedById((prev) => {
            const next = { ...prev };
            for (const q of mergedQuestions) {
                if (alreadySelectedQuestionIds.includes(q.id)) {
                    next[q.id] = true;
                }
            }
            return next;
        });
    }, [
        visible,
        questionsLoading,
        mergedQuestions,
        questionSetId,
        alreadySelectedQuestionIds,
        alreadySelectedKey,
    ]);

    const toggleQuestionSelected = useCallback((id: string) => {
        setSelectedById((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const questionSetDropdownOptions = useMemo(
        () => questionSetItems.map((s) => ({ id: s.id, name: s.name })),
        [questionSetItems]
    );

    useEffect(() => {
        if (!visible) return;
        dispatch(fetchQuestionSetsRequestAction(1, false));
    }, [visible, dispatch]);

    useEffect(() => {
        const merged = questionSetDropdownOptions;
        if (merged.length === 0) return;
        setQuestionSetId((prev) => {
            if (prev && merged.some((r) => r.id === prev)) return prev;
            return merged[0].id;
        });
    }, [questionSetDropdownOptions]);

    useEffect(() => {
        if (!lastCreatedQuestionSet) return;
        setQuestionSetId(lastCreatedQuestionSet.id);
        dispatch(clearLastCreatedQuestionSet());
    }, [lastCreatedQuestionSet, dispatch]);

    useEffect(() => {
        if (!visible || !questionSetId) return;
        dispatch(fetchSetQuestionsRequestAction(questionSetId, 1, false));
    }, [visible, questionSetId, dispatch]);

    const handleLoadMoreQuestionSets = useCallback(() => {
        const nextPage = questionSetsPage + 1;
        if (
            !questionSetsHasMore ||
            questionSetsLoadingMore ||
            questionSetsLoading ||
            questionSetItems.length === 0
        ) {
            return;
        }
        dispatch(fetchQuestionSetsRequestAction(nextPage, true));
    }, [
        dispatch,
        questionSetsHasMore,
        questionSetsLoadingMore,
        questionSetsLoading,
        questionSetsPage,
        questionSetItems.length,
    ]);

    const handleLoadMoreQuestions = useCallback(() => {
        const nextPage = questionsPage + 1;
        if (
            !questionSetId ||
            !questionsHasMore ||
            questionsLoadingMore ||
            questionsLoading
        ) {
            return;
        }
        dispatch(fetchSetQuestionsRequestAction(questionSetId, nextPage, true));
    }, [
        dispatch,
        questionSetId,
        questionsHasMore,
        questionsLoadingMore,
        questionsLoading,
        questionsPage,
    ]);

    const handleCreateSet = useCallback(
        (payload: CreateQuestionSetPayload) => {
            dispatch(createQuestionSetRequestAction({ name: payload.name.trim() }));
        },
        [dispatch]
    );

    const handleAppendQuestion = useCallback(
        (payload: AddScreeningQuestionPayload) => {
            const id = questionSetId.trim();
            if (!id) {
                showToastMessage('Select a question set first', 'info');
                return;
            }
            dispatch(
                createScreenQuestionRequestAction({
                    text: payload.text.trim(),
                    time_limit: payload.durationSec,
                    type: payload.responseType,
                    question_set: id,
                })
            );
        },
        [dispatch, questionSetId]
    );

    const removeQuestion = useCallback(
        (id: string) => {
            setSelectedById((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            dispatch(deleteScreenQuestionRequestAction({ questionId: id }));
        },
        [dispatch]
    );

    const responseTypeLabel = useCallback(
        (k: 'text' | 'audio') => (k === 'audio' ? 'Audio' : 'Text'),
        []
    );

    const handleSave = useCallback(() => {
        const selectedRows = mergedQuestions.filter((q) => selectedById[q.id]);
        const rows: CriteriaRowPayload[] = selectedRows.map((q) => {
            const rawTitle = q.text.trim() || 'Untitled question';
            const title = rawTitle.length > 56 ? `${rawTitle.slice(0, 53)}…` : rawTitle;
            const typeLabel = `${responseTypeLabel(q.responseType)} · ${q.durationSec}s`;
            return { id: q.id, title, typeLabel };
        });

        const n = selectedRows.length;
        if (n === 1) {
            showToastMessage('1 question added', 'success');
        } else if (n > 1) {
            showToastMessage(`${n} questions added`, 'success');
        } else {
            showToastMessage('No questions selected', 'info');
        }

        onConfirm?.(rows);
        onClose();
    }, [mergedQuestions, onClose, onConfirm, responseTypeLabel, selectedById]);

    const typeLabel = responseTypeLabel;

    return (
        <CustomModalWrapper
            visible={visible}
            title="Question Library"
            subTitle="Select questions to screen applicants"
            onClose={onClose}
            scrollable={false}
        >
            <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                <View style={styles.section}>
                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                        Question Set
                    </Typography>
                    <View style={styles.questionSetRow}>
                        <View style={styles.dropdownWrap}>
                            <CommonDropdown
                                placeholder={
                                    questionSetsLoading && questionSetDropdownOptions.length === 0
                                        ? 'Loading sets…'
                                        : 'Select set'
                                }
                                options={questionSetDropdownOptions}
                                value={questionSetId || undefined}
                                onChange={(v) => {
                                    setQuestionSetId(String(v));
                                }}
                                disabled={questionSetsLoading && questionSetDropdownOptions.length === 0}
                                onLoadMore={
                                    questionSetsHasMore ? handleLoadMoreQuestionSets : undefined
                                }
                                onOpen={() => {
                                    if (
                                        questionSetDropdownOptions.length === 0 &&
                                        !questionSetsLoading
                                    ) {
                                        dispatch(fetchQuestionSetsRequestAction(1, false));
                                    }
                                }}
                                searchable
                            />
                        </View>
                        <Button
                            startIcon={<SvgXml xml={fileIcon} />}
                            paddingHorizontal={10}
                            disabled={createQuestionSetLoading}
                            onPress={() => setCreateSetOpen(true)}
                        >
                            New Set
                        </Button>
                    </View>
                </View>

                <View style={styles.rowHeader}>
                    <View style={styles.rowHeaderLeft}>
                        <Typography variant="regularTxtsm" color={colors.gray[800]}>
                            {`${questionCount} questions`}
                        </Typography>
                        {selectedCount > 0 ? (
                            <Typography variant="mediumTxtsm" color={colors.brand[700]}>
                                {` · ${selectedCount} selected`}
                            </Typography>
                        ) : null}
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={!questionSetId || createScreenQuestionLoading}
                        onPress={() => setAddQuestionOpen(true)}
                    >
                        <Typography
                            variant="mediumTxtsm"
                            color={
                                !questionSetId || createScreenQuestionLoading
                                    ? colors.gray[400]
                                    : colors.brand[700]
                            }
                        >
                            + Add Questions
                        </Typography>
                    </TouchableOpacity>
                </View>

                <View style={styles.listGap}>
                    {questionsLoading && mergedQuestions.length === 0 ? (
                        <Typography variant="regularTxtsm" color={colors.gray[500]}>
                            Loading questions…
                        </Typography>
                    ) : null}
                    {mergedQuestions.map((q) => (
                        <View key={q.id} style={styles.questionCard}>
                            <View style={styles.questionLeft}>
                                <View style={styles.checkboxHit}>
                                    <CheckBox
                                        checked={!!selectedById[q.id]}
                                        onChange={() => toggleQuestionSelected(q.id)}
                                    />
                                </View>
                                <View style={styles.questionTextWrap}>
                                    <Typography
                                        variant="semiBoldTxtsm"
                                        color={colors.gray[900]}
                                        style={styles.questionText}
                                    >
                                        {q.text}
                                    </Typography>
                                </View>
                            </View>
                            <View style={styles.metaRight}>
                                <View style={styles.audioGroup}>
                                    <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                                        {typeLabel(q.responseType)}
                                    </Typography>
                                </View>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[600]}>
                                    {`${q.durationSec}s`}
                                </Typography>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Remove question"
                                    hitSlop={8}
                                    disabled={!!deleteScreenQuestionPendingIds[q.id]}
                                    style={
                                        deleteScreenQuestionPendingIds[q.id]
                                            ? { opacity: 0.4 }
                                            : undefined
                                    }
                                    onPress={() => removeQuestion(q.id)}
                                >
                                    <SvgXml xml={trashIcon} width={30} height={30} color={colors.error[500]} />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                    {!questionsLoading && mergedQuestions.length === 0 && questionSetId ? (
                        <Typography variant="regularTxtsm" color={colors.gray[500]}>
                            No questions in this set yet.
                        </Typography>
                    ) : null}
                    {questionsHasMore && mergedQuestions.length > 0 ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={questionsLoadingMore}
                            onPress={handleLoadMoreQuestions}
                            style={styles.loadMoreBtn}
                        >
                            <Typography variant="mediumTxtsm" color={colors.brand[700]}>
                                {questionsLoadingMore ? 'Loading…' : 'Load more questions'}
                            </Typography>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </ScrollView>

            <View style={[FOOTER_BLEED, styles.footerBleedTop]}>
                <FooterButtons
                    footerStyle={{
                        paddingHorizontal: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
                        paddingTop: 12,
                        paddingBottom: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
                    }}
                    leftButtonProps={{
                        children: 'Cancel',
                        size: 48,
                        variant: 'outline',
                        borderColor: colors.gray[200],
                        buttonColor: colors.base.white,
                        textColor: colors.gray[900],
                        borderWidth: 1,
                        onPress: onClose,
                    }}
                    rightButtonProps={{
                        children: 'Save',
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        onPress: handleSave,
                    }}
                />
            </View>

            <AddScreeningQuestionModal
                visible={addQuestionOpen}
                onClose={() => setAddQuestionOpen(false)}
                onAdd={handleAppendQuestion}
                isSubmitting={createScreenQuestionLoading}
            />
            <CreateQuestionSetModal
                visible={createSetOpen}
                onClose={() => setCreateSetOpen(false)}
                onCreate={handleCreateSet}
                isSubmitting={createQuestionSetLoading}
            />
        </CustomModalWrapper>
    );
}

const styles = StyleSheet.create({
    scroll: {
        maxHeight: 420,
    },
    scrollContent: {
        gap: 16,
        paddingBottom: 8,
    },
    section: {
        gap: 6,
    },
    questionSetRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dropdownWrap: {
        flex: 1,
        minWidth: 0,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 4,
    },
    listGap: {
        gap: 10,
    },
    loadMoreBtn: {
        alignSelf: 'flex-start',
        paddingVertical: 6,
    },
    questionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        padding: 12,
        gap: 10,
        backgroundColor: colors.base.white,
    },
    questionLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
    },
    checkboxHit: {
        paddingTop: 2,
    },
    questionTextWrap: {
        flex: 1,
        minWidth: 0,
    },
    questionText: {
        flexShrink: 1,
    },
    metaRight: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 2,
    },
    audioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    footerBleedTop: {
        marginTop: 8,
    },
});
