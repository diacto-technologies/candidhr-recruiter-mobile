import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Typography, TextField } from '../../../../components/atoms';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import QuestionOptionsField from '../../../../components/molecules/questionoptionsfield';
import { QuestionOptionItem } from '../../../../components/molecules/questionoptionsfield/types';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import CustomModalWrapper, {
    CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} from '../../../../components/organisms/custommodalwrapper';
import { colors } from '../../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FORMAT_OPTIONS = [
    { id: 'single_choice', name: 'Single choice' },
    { id: 'multiple_choice', name: 'Multiple choice' },
    { id: 'yes_no', name: 'Yes / No' },
] as const;

export type CriteriaFormatId = (typeof FORMAT_OPTIONS)[number]['id'];

const YES_NO_OPTIONS: QuestionOptionItem[] = [
    { id: 'criteria-yn-yes', text: 'Yes' },
    { id: 'criteria-yn-no', text: 'No' },
];

const INITIAL_OPTION_ROWS = (): QuestionOptionItem[] =>
    Array.from({ length: 4 }, (_, i) => ({
        id: `criteria-opt-${i}`,
        text: '',
    }));

export type AddCriteriaSavePayload = {
    questionText: string;
    formatId: string;
    formatLabel: string;
    options: QuestionOptionItem[];
    correctOptionIds: string[];
};

type AddCriteriaModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (payload: AddCriteriaSavePayload) => void;
};

function FieldLabel({ children }: { children: string }) {
    return (
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
            {children}
            <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                {' '}
                *
            </Typography>
        </Typography>
    );
}

/** Scroll body has horizontal padding; footer bleeds edge-to-edge inside the modal card. */
const FOOTER_BLEED = {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    marginBottom: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} as const;

/** Estimated space outside the scroll viewport (chrome + footer pinned at bottom). */
const MODAL_CHROME_VERTICAL = 200;

export default function AddCriteriaModal({ visible, onClose, onSave }: AddCriteriaModalProps) {
    const { height: windowHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    /** Fixed max height so long option lists scroll inside; footer stays visible. */
    const formScrollMaxHeight = useMemo(() => {
        const safeViewport = windowHeight - insets.top - insets.bottom - 32;
        const target = safeViewport - MODAL_CHROME_VERTICAL;
        return Math.max(220, Math.min(target, windowHeight * 0.55));
    }, [windowHeight, insets.top, insets.bottom]);
    const initialOpts = INITIAL_OPTION_ROWS();
    const optionIdSeq = useRef(4);
    const [questionText, setQuestionText] = useState('');
    const [formatId, setFormatId] = useState<CriteriaFormatId>(FORMAT_OPTIONS[1].id);
    const [options, setOptions] = useState<QuestionOptionItem[]>(initialOpts);
    const [correctIds, setCorrectIds] = useState<Set<string>>(() => new Set([initialOpts[0].id]));

    const applyFormatId = useCallback((next: CriteriaFormatId) => {
        setFormatId(next);
        if (next === 'yes_no') {
            setOptions(YES_NO_OPTIONS);
            setCorrectIds(new Set([YES_NO_OPTIONS[0].id]));
            optionIdSeq.current = 4;
            return;
        }
        const rows = INITIAL_OPTION_ROWS();
        setOptions(rows);
        setCorrectIds(new Set([rows[0].id]));
        optionIdSeq.current = 4;
    }, []);

    const reset = useCallback(() => {
        optionIdSeq.current = 4;
        setQuestionText('');
        applyFormatId(FORMAT_OPTIONS[1].id);
    }, [applyFormatId]);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const isOptionCorrect = useCallback((id: string) => correctIds.has(id), [correctIds]);

    const onOptionTextChange = useCallback(
        (id: string, text: string) => {
            if (formatId === 'yes_no') return;
            setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
        },
        [formatId],
    );

    const onAddOption = useCallback(() => {
        if (formatId === 'yes_no') return;
        optionIdSeq.current += 1;
        const id = `criteria-opt-${optionIdSeq.current}`;
        setOptions((prev) => [...prev, { id, text: '' }]);
    }, [formatId]);

    const onRemoveOption = useCallback(
        (id: string) => {
            if (formatId === 'yes_no') return;
            setOptions((prev) => prev.filter((o) => o.id !== id));
            setCorrectIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        },
        [formatId],
    );

    const onToggleCorrect = useCallback(
        (id: string) => {
            if (formatId === 'multiple_choice') {
                setCorrectIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                });
                return;
            }
            setCorrectIds(new Set([id]));
        },
        [formatId],
    );

    const handleSave = useCallback(() => {
        const formatLabel =
            FORMAT_OPTIONS.find((f) => f.id === formatId)?.name ?? 'Multiple choice';
        onSave({
            questionText: questionText.trim(),
            formatId,
            formatLabel,
            options,
            correctOptionIds: Array.from(correctIds),
        });
        reset();
        onClose();
    }, [correctIds, formatId, onClose, onSave, options, questionText, reset]);

    const onFormatDropdownChange = useCallback(
        (v: string | number) => applyFormatId(String(v) as CriteriaFormatId),
        [applyFormatId],
    );

    const lockYesNoLabels = formatId === 'yes_no';

    return (
        <CustomModalWrapper
            visible={visible}
            title="Add criteria"
            onClose={handleClose}
            scrollable={false}
        >
            <ScrollView
                style={[styles.scrollArea, { maxHeight: formScrollMaxHeight }]}
                contentContainerStyle={styles.scrollInner}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                bounces={false}
                nestedScrollEnabled
            >
                <View style={styles.block}>
                    <FieldLabel>Question</FieldLabel>
                    <TextField
                        value={questionText}
                        onChangeText={setQuestionText}
                        placeholder="Write your job title"
                    />
                </View>

                <View style={styles.block}>
                    <FieldLabel>Format</FieldLabel>
                    <CommonDropdown
                        placeholder="Select"
                        options={[...FORMAT_OPTIONS]}
                        value={formatId}
                        onChange={onFormatDropdownChange}
                    />
                </View>

                <QuestionOptionsField
                    mode={formatId === 'multiple_choice' ? 'multiple' : 'single'}
                    options={options}
                    labelColor={colors.gray[700]}
                    optionsPresentation={lockYesNoLabels ? 'yesNo' : 'standard'}
                    isOptionCorrect={isOptionCorrect}
                    onOptionTextChange={onOptionTextChange}
                    onAddOption={onAddOption}
                    onRemoveOption={onRemoveOption}
                    onToggleCorrect={onToggleCorrect}
                    minOptions={2}
                    required
                    showAddOption={!lockYesNoLabels}
                    optionInputsEditable={!lockYesNoLabels}
                />
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
                        borderRadius: 12,
                        onPress: handleClose,
                    }}
                    rightButtonProps={{
                        children: 'Save',
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderRadius: 12,
                        onPress: handleSave,
                    }}
                />
            </View>
        </CustomModalWrapper>
    );
}

const styles = StyleSheet.create({
    scrollArea: {
        flexGrow: 0,
        flexShrink: 1,
        width: '100%',
    },
    scrollInner: {
        gap: 16,
        paddingBottom: 8,
    },
    block: {
        gap: 6,
    },
    footerBleedTop: {
        marginTop: 8,
    },
});
