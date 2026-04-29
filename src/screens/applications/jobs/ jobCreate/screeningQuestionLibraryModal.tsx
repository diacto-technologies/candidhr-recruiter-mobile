import React, { useCallback, useState } from 'react';
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

export type CriteriaRowPayload = { id: string; title: string; typeLabel: string };

export type ScreeningQuestionLibraryModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm?: (rows: CriteriaRowPayload[]) => void;
};

const FOOTER_BLEED = {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    marginBottom: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} as const;

const DEFAULT_QUESTION_SETS = [{ id: 'cs-1', name: 'Customer Success - Screening' }];

type LibraryQuestionRow = {
    id: string;
    text: string;
    durationSec: number;
    responseType: 'text' | 'audio';
};

const SAMPLE_QUESTION =
    'What is your preferred tool for data visualization, and why?';

export default function ScreeningQuestionLibraryModal({
    visible,
    onClose,
    onConfirm,
}: ScreeningQuestionLibraryModalProps) {
    const [questionSets, setQuestionSets] = useState(DEFAULT_QUESTION_SETS);
    const [questionSetId, setQuestionSetId] = useState(DEFAULT_QUESTION_SETS[0].id);
    const [addQuestionOpen, setAddQuestionOpen] = useState(false);
    const [createSetOpen, setCreateSetOpen] = useState(false);
    const [libraryQuestions, setLibraryQuestions] = useState<LibraryQuestionRow[]>([
        {
            id: '1',
            text: SAMPLE_QUESTION,
            durationSec: 30,
            responseType: 'audio',
        },
    ]);

    const questionCount = libraryQuestions.length;

    const handleCreateSet = useCallback((payload: CreateQuestionSetPayload) => {
        const id = `set-${Date.now()}`;
        setQuestionSets((prev) => [...prev, { id, name: payload.name }]);
        setQuestionSetId(id);
    }, []);

    const handleAppendQuestion = useCallback((payload: AddScreeningQuestionPayload) => {
        setLibraryQuestions((prev) => [
            ...prev,
            {
                id: `q-${Date.now()}`,
                text: payload.text,
                durationSec: payload.durationSec,
                responseType: payload.responseType,
            },
        ]);
    }, []);

    const removeQuestion = useCallback((id: string) => {
        setLibraryQuestions((rows) => rows.filter((r) => r.id !== id));
    }, []);

    const handleSave = useCallback(() => {
        onConfirm?.([]);
        onClose();
    }, [onClose, onConfirm]);

    const typeLabel = useCallback((k: 'text' | 'audio') => (k === 'audio' ? 'Audio' : 'Text'), []);

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
                                placeholder="Select set"
                                options={questionSets}
                                value={questionSetId}
                                onChange={(v) => setQuestionSetId(String(v))}
                            />
                        </View>
                        <Button
                            startIcon={<SvgXml xml={fileIcon} />}
                            paddingHorizontal={10}
                            onPress={() => setCreateSetOpen(true)}
                        >
                            New Set
                        </Button>
                    </View>
                </View>

                <View style={styles.rowHeader}>
                    <Typography variant="regularTxtsm" color={colors.gray[800]}>
                        {`${questionCount} questions`}
                    </Typography>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setAddQuestionOpen(true)}>
                        <Typography variant="mediumTxtsm" color={colors.brand[700]}>
                            + Add Questions
                        </Typography>
                    </TouchableOpacity>
                </View>

                <View style={styles.listGap}>
                    {libraryQuestions.map((q) => (
                        <View key={q.id} style={styles.questionCard}>
                            <View style={styles.questionLeft}>
                                <View style={styles.checkboxHit}>
                                    <CheckBox checked={false} onChange={() => {}} />
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
                                    onPress={() => removeQuestion(q.id)}
                                >
                                    <SvgXml xml={trashIcon} width={22} height={22} color={colors.error[500]} />
                                </Pressable>
                            </View>
                        </View>
                    ))}
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
            />
            <CreateQuestionSetModal
                visible={createSetOpen}
                onClose={() => setCreateSetOpen(false)}
                onCreate={handleCreateSet}
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
    listGap: {
        gap: 10,
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
