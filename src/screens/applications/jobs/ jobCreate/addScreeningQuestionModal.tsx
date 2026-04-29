import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Typography, TextField } from '../../../../components/atoms';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import NumberStepper from '../../../../components/atoms/numberstepper';
import CustomModalWrapper from '../../../../components/organisms/custommodalwrapper';
import { colors } from '../../../../theme/colors';

const TYPE_OPTIONS = [
    { id: 'text', name: 'Text' },
    { id: 'audio', name: 'Audio' },
];

const MAX_QUESTION_CHARS = 200;

export type AddScreeningQuestionPayload = {
    text: string;
    durationSec: number;
    responseType: 'text' | 'audio';
};

type AddScreeningQuestionModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdd: (payload: AddScreeningQuestionPayload) => void;
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

export default function AddScreeningQuestionModal({
    visible,
    onClose,
    onAdd,
}: AddScreeningQuestionModalProps) {
    const [text, setText] = useState('');
    const [durationSec, setDurationSec] = useState(30);
    const [typeId, setTypeId] = useState<string>(TYPE_OPTIONS[0].id);

    const reset = useCallback(() => {
        setText('');
        setDurationSec(30);
        setTypeId(TYPE_OPTIONS[0].id);
    }, []);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const handleAdd = useCallback(() => {
        const t = text.trim();
        if (!t) return;
        const responseType = typeId === 'audio' ? 'audio' : 'text';
        onAdd({ text: t, durationSec, responseType });
        reset();
        onClose();
    }, [durationSec, onAdd, onClose, reset, text, typeId]);

    return (
        <CustomModalWrapper
            visible={visible}
            title="Add Question"
            subTitle="Add to the selected question set"
            onClose={handleClose}
            scrollable={false}
        >
            <View style={styles.body}>
                <View style={styles.block}>
                    <FieldLabel>Question</FieldLabel>
                    <View style={styles.questionWrap}>
                        <TextField
                            value={text}
                            onChangeText={(v) => setText(v.slice(0, MAX_QUESTION_CHARS))}
                            placeholder="Type your question here..."
                            multiline
                            size="Large"
                            showOutline
                        />
                        <Typography variant="regularTxtxs" color={colors.gray[400]} style={styles.charCounter}>
                            {`${text.length}/${MAX_QUESTION_CHARS}`}
                        </Typography>
                    </View>
                </View>

                <View style={styles.block}>
                    <FieldLabel>Duration</FieldLabel>
                    <NumberStepper
                        value={durationSec}
                        onChange={setDurationSec}
                        min={5}
                        max={600}
                        step={5}
                        unitLabel="sec"
                    />
                </View>

                <View style={styles.block}>
                    <FieldLabel>Type</FieldLabel>
                    <CommonDropdown
                        placeholder="Select type"
                        options={TYPE_OPTIONS}
                        value={typeId}
                        onChange={(v) => setTypeId(String(v))}
                    />
                </View>

                <Button
                    size={48}
                    variant="contain"
                    buttonColor={colors.brand[600]}
                    textColor={colors.base.white}
                    borderRadius={12}
                    onPress={handleAdd}
                    disabled={!text.trim()}
                    startIcon={<Ionicons name="add" size={20} color={colors.base.white} />}
                >
                    Add
                </Button>
            </View>
        </CustomModalWrapper>
    );
}

const styles = StyleSheet.create({
    body: {
        gap: 16,
        paddingBottom: 8,
    },
    block: {
        gap: 6,
    },
    questionWrap: {
        gap: 4,
    },
    charCounter: {
        alignSelf: 'flex-end',
    },
});
