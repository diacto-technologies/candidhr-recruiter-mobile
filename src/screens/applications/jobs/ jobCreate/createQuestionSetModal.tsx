import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography, TextField } from '../../../../components/atoms';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import CustomModalWrapper, {
    CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} from '../../../../components/organisms/custommodalwrapper';
import { colors } from '../../../../theme/colors';

const MAX_NAME_CHARS = 50;

export type CreateQuestionSetPayload = {
    name: string;
};

type CreateQuestionSetModalProps = {
    visible: boolean;
    onClose: () => void;
    onCreate: (payload: CreateQuestionSetPayload) => void;
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

/** Bleed footer past CustomModalWrapper body padding (same pattern as Add criteria). */
const FOOTER_BLEED = {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    marginBottom: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} as const;

export default function CreateQuestionSetModal({
    visible,
    onClose,
    onCreate,
}: CreateQuestionSetModalProps) {
    const [name, setName] = useState('');

    const reset = useCallback(() => {
        setName('');
    }, []);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const handleCreate = useCallback(() => {
        const n = name.trim();
        if (!n) return;
        onCreate({ name: n });
        reset();
        onClose();
    }, [name, onClose, onCreate, reset]);

    return (
        <CustomModalWrapper
            visible={visible}
            title="Create Question Set"
            subTitle="Organize your screening questions"
            onClose={handleClose}
            scrollable={false}
        >
            <View style={styles.block}>
                <FieldLabel>Name</FieldLabel>
                <View style={styles.fieldWrap}>
                    <TextField
                        value={name}
                        onChangeText={(v) => setName(v.slice(0, MAX_NAME_CHARS))}
                        placeholder="e.g. Customer Success – Screening"
                        size="Medium"
                        showOutline
                    />
                    <Typography variant="regularTxtxs" color={colors.gray[400]} style={styles.counter}>
                        {`${name.length}/${MAX_NAME_CHARS}`}
                    </Typography>
                </View>
            </View>

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
                        children: 'Create',
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderRadius: 12,
                        onPress: handleCreate,
                        disabled: !name.trim(),
                    }}
                />
            </View>
        </CustomModalWrapper>
    );
}

const styles = StyleSheet.create({
    block: {
        gap: 6,
        paddingBottom: 8,
    },
    fieldWrap: {
        gap: 4,
    },
    counter: {
        alignSelf: 'flex-end',
    },
    footerBleedTop: {
        marginTop: 16,
    },
});
