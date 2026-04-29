import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    FlatList,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TagList from '../taglist';
import Typography from '../../atoms/typography';
import { styles as dropdownFieldStyles } from '../../organisms/commondropdown/styles';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

export type SkillOption = { id: string; name: string };

export interface SkillTagComposerProps {
    skills: string[];
    options: SkillOption[];
    onAppendSkill: (raw: string) => void;
    onRemoveSkillAt: (index: number) => void;
    placeholder?: string;
    error?: string;
}

function norm(s: string) {
    return s.trim().toLowerCase();
}

/** Match `styles.optionsContainer` max height in CommonDropdown */
const SKILL_LIST_MAX_HEIGHT = 200;

const SkillTagComposer: React.FC<SkillTagComposerProps> = ({
    skills,
    options,
    onAppendSkill,
    onRemoveSkillAt,
    placeholder = 'Add tags…',
    error,
}) => {
    const [draft, setDraft] = useState('');
    const [focus, setFocus] = useState(false);
    const [open, setOpen] = useState(false);
    const blurCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearBlurTimer = useCallback(() => {
        if (blurCloseTimer.current) {
            clearTimeout(blurCloseTimer.current);
            blurCloseTimer.current = null;
        }
    }, []);

    useEffect(() => () => clearBlurTimer(), [clearBlurTimer]);

    const canAddDraft = useMemo(() => {
        const t = draft.trim();
        if (!t) return false;
        return !skills.some((s) => norm(s) === norm(t));
    }, [draft, skills]);

    const exactCatalogMatch = useMemo(
        () =>
            !!draft.trim() &&
            options.some((o) => norm(o.name) === norm(draft.trim())),
        [draft, options]
    );

    const showAddCustomRow = canAddDraft && !exactCatalogMatch;

    /** Catalog options not yet selected; filtered by typed draft */
    const listRows = useMemo(() => {
        const q = norm(draft);
        return options.filter((o) => {
            if (skills.some((s) => norm(s) === norm(o.name))) return false;
            if (!q) return true;
            return norm(o.name).includes(q);
        });
    }, [draft, options, skills]);

    const allCatalogPicked = useMemo(() => {
        const names = new Set(skills.map((s) => norm(s)));
        return options.length > 0 && options.every((o) => names.has(norm(o.name)));
    }, [options, skills]);

    const shellActive = focus || open;

    const commitDraft = useCallback(() => {
        const t = draft.trim();
        if (!t) return;
        onAppendSkill(t);
        setDraft('');
        Keyboard.dismiss();
    }, [draft, onAppendSkill]);

    const pickOption = useCallback(
        (name: string) => {
            clearBlurTimer();
            onAppendSkill(name);
            setDraft('');
            setOpen(true);
        },
        [clearBlurTimer, onAppendSkill]
    );

    const toggleOpen = useCallback(() => {
        clearBlurTimer();
        setOpen((o) => !o);
    }, [clearBlurTimer]);

    const onInputBlur = useCallback(() => {
        setFocus(false);
        blurCloseTimer.current = setTimeout(() => {
            setOpen(false);
            blurCloseTimer.current = null;
        }, 220);
    }, []);

    const onInputFocus = useCallback(() => {
        clearBlurTimer();
        setFocus(true);
        setOpen(true);
    }, [clearBlurTimer]);

    const showEmptyHint = open && allCatalogPicked && draft.trim() === '';

    const showDropdownList = open && listRows.length > 0;

    const showOnlyCustomAdd =
        open && showAddCustomRow && listRows.length === 0 && !!draft.trim();

    return (
        <View style={[styles.root, open && styles.rootRaised]}>
            <View
                style={[
                    dropdownFieldStyles.container,
                    styles.shellStretch,
                    shellActive && !error && dropdownFieldStyles.containerFocused,
                    !!error && styles.shellInvalid,
                ]}
            >
                <View style={styles.shellInner}>
                    {skills.length > 0 ? (
                        <View style={styles.tagsBlock}>
                            <TagList
                                data={skills}
                                textColor={colors.gray[900]}
                                bgColor={colors.gray[50]}
                                borderColor={colors.gray[200]}
                                onRemove={onRemoveSkillAt}
                            />
                        </View>
                    ) : null}
                    <View style={styles.inputChevronWrap}>
                        <TextInput
                            style={styles.textInput}
                            value={draft}
                            onChangeText={(t) => {
                                setDraft(t);
                                setOpen(true);
                            }}
                            placeholder={skills.length === 0 ? placeholder : ''}
                            placeholderTextColor={colors.gray[500]}
                            onSubmitEditing={commitDraft}
                            returnKeyType="done"
                            blurOnSubmit={false}
                            onFocus={onInputFocus}
                            onBlur={onInputBlur}
                        />
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={open ? 'Close skill list' : 'Open skill list'}
                            hitSlop={12}
                            onPress={toggleOpen}
                            style={styles.chevronWrap}
                        >
                            <Ionicons
                                name={open ? 'chevron-up' : 'chevron-down'}
                                size={22}
                                color={colors.gray[500]}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
            {error ? (
                <Typography variant="regularTxtsm" color={colors.error[500]} style={styles.fieldError}>
                    {error}
                </Typography>
            ) : null}

            {showEmptyHint ? (
                <View style={dropdownFieldStyles.optionsContainer}>
                    <View style={styles.dropdownEmpty}>
                        <Typography variant="regularTxtsm" color={colors.gray[500]}>
                            All listed skills are selected. Type to add a custom skill.
                        </Typography>
                    </View>
                </View>
            ) : null}

            {showDropdownList ? (
                <View style={dropdownFieldStyles.optionsContainer}>
                    <FlatList
                        data={listRows}
                        keyExtractor={(item) => String(item.id)}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        style={{ maxHeight: SKILL_LIST_MAX_HEIGHT }}
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    dropdownFieldStyles.optionItem,
                                    index === 0 && dropdownFieldStyles.selectedOptionItem,
                                    pressed && { opacity: 0.92 },
                                ]}
                                onPressIn={() => clearBlurTimer()}
                                onPress={() => pickOption(item.name)}
                            >
                                <Typography
                                    variant="mediumTxtsm"
                                    color={colors.gray[900]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={dropdownFieldStyles.optionNameText}
                                >
                                    {item.name}
                                </Typography>
                            </Pressable>
                        )}
                        ListHeaderComponent={
                            showAddCustomRow && listRows.length > 0 ? (
                                <Pressable
                                    style={({ pressed }) => [
                                        dropdownFieldStyles.optionItem,
                                        dropdownFieldStyles.selectedOptionItem,
                                        pressed && { opacity: 0.92 },
                                    ]}
                                    onPressIn={() => clearBlurTimer()}
                                    onPress={() => {
                                        onAppendSkill(draft.trim());
                                        setDraft('');
                                    }}
                                >
                                    <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
                                        Add “{draft.trim()}”
                                    </Typography>
                                </Pressable>
                            ) : null
                        }
                        ListEmptyComponent={
                            draft.trim() && listRows.length === 0 && !showAddCustomRow ? (
                                <View style={styles.dropdownEmpty}>
                                    <Typography variant="regularTxtsm" color={colors.gray[400]}>
                                        No matching skills.
                                    </Typography>
                                </View>
                            ) : null
                        }
                    />
                </View>
            ) : showOnlyCustomAdd ? (
                <View style={dropdownFieldStyles.optionsContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            dropdownFieldStyles.optionItem,
                            dropdownFieldStyles.selectedOptionItem,
                            pressed && { opacity: 0.92 },
                        ]}
                        onPressIn={() => clearBlurTimer()}
                        onPress={() => {
                            onAppendSkill(draft.trim());
                            setDraft('');
                            setOpen(false);
                        }}
                    >
                        <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
                            Add “{draft.trim()}”
                        </Typography>
                    </Pressable>
                </View>
            ) : null}
        </View>
    );
};

export default SkillTagComposer;

const styles = StyleSheet.create({
    root: {
        zIndex: 2,
    },
    rootRaised: {
        zIndex: 999,
        elevation: 12,
    },
    shellInner: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    tagsBlock: {
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: '100%',
    },
    shellStretch: {
        width: '100%',
        minHeight: 48,
    },
    inputChevronWrap: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 120,
    },
    textInput: {
        flex: 1,
        minWidth: 80,
        fontFamily: Fonts.InterMedium,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.gray[900],
        paddingVertical: Platform.OS === 'ios' ? 6 : 4,
        margin: 0,
        paddingRight: 4,
    },
    chevronWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4,
    },
    shellInvalid: {
        borderColor: colors.error[500],
        borderWidth: 1,
    },
    fieldError: {
        marginTop: 4,
    },
    dropdownEmpty: {
        paddingHorizontal: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
});
