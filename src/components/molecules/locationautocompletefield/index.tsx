import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    View,
    type TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import { TextField } from '../../atoms/textfield';
import Button from '../../atoms/button';
import type { TextFieldSize } from '../../atoms/textfield/textfield.d';
import { colors } from '../../../theme/colors';
import { shadowStyles } from '../../../theme/shadowcolor';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    locationAutocompleteClear,
    locationAutocompleteRequest,
    selectLocationRequest,
    clearSelectedLocation,
    savedLocationToItem,
} from '../../../features/locations';
import {
    selectLocationAutocompleteLoading,
    selectLocationAutocompleteResults,
    selectSavedLocation,
    selectLocationSelectLoading,
    selectLocationSelectError,
} from '../../../features/locations/selectors';
import type { LocationAutocompleteItem } from '../../../features/locations/types';
import Icon from '../../atoms/vectoricon';

export type LocationAutocompleteFieldProps = {
    value: string;
    onChangeText: (text: string) => void;
    /** After POST /locations/select/ succeeds; pass null when cleared */
    onSelectLocation: (item: LocationAutocompleteItem | null) => void;
    lable?: string;
    placeholder?: string;
    isRequired?: boolean;
    startIcon?: React.ReactElement;
    size?: TextFieldSize;
    isError?: boolean;
    error?: string;
    debounceMs?: number;
    minQueryLength?: number;
};

const LIST_MAX_H = 220;

function dropdownLabel(item: LocationAutocompleteItem): string {
    const city = item.city?.trim();
    const state = item.state?.trim();
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return item.display_name?.trim() ?? '';
}

function buildsManualPayload(
    cityRaw: string,
    stateRaw: string,
    countryRaw: string
): LocationAutocompleteItem {
    const city = cityRaw.trim();
    const state = stateRaw.trim();
    const country = countryRaw.trim();
    const display = [city, state, country].filter(Boolean).join(', ');
    return {
        place_id: null,
        display_name: display || city,
        city: city || null,
        state: state || null,
        country: country || null,
        lat: null,
        lon: null,
        type: 'manual',
    };
}

const LocationAutocompleteField: React.FC<LocationAutocompleteFieldProps> = ({
    value,
    onChangeText,
    onSelectLocation,
    lable = 'Location',
    placeholder = 'Search location',
    isRequired,
    startIcon,
    size = 'Medium',
    isError,
    error,
    debounceMs = 380,
    minQueryLength = 2,
}) => {
    const dispatch = useAppDispatch();
    const results = useAppSelector(selectLocationAutocompleteResults);
    const loading = useAppSelector(selectLocationAutocompleteLoading);
    const saved = useAppSelector(selectSavedLocation);
    const selectLoading = useAppSelector(selectLocationSelectLoading);
    const selectError = useAppSelector(selectLocationSelectError);

    const cityInputRef = useRef<TextInput | null>(null);
    const lastSyncedSavedId = useRef<string | null>(null);

    const [open, setOpen] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [manualCity, setManualCity] = useState('');
    const [manualState, setManualState] = useState('');
    const [manualCountry, setManualCountry] = useState('');
    const [manualCityError, setManualCityError] = useState<string | undefined>();

    const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filteredResults = useMemo(
        () =>
            results.filter((r) => String(r.type).toLowerCase() !== 'manual'),
        [results]
    );

    useEffect(() => {
        if (!saved?.id) {
            lastSyncedSavedId.current = null;
            return;
        }
        const id = saved.id;
        if (lastSyncedSavedId.current === id) return;
        lastSyncedSavedId.current = id;

        const line = (saved.name || saved.city || '').trim();
        onChangeText(line);
        onSelectLocation(savedLocationToItem(saved));
        setManualMode(false);
        setManualCity('');
        setManualState('');
        setManualCountry('');
        setManualCityError(undefined);
        setOpen(false);
    }, [saved, onChangeText, onSelectLocation]);

    const cancelBlur = useCallback(() => {
        if (blurTimer.current) {
            clearTimeout(blurTimer.current);
            blurTimer.current = null;
        }
    }, []);

    useEffect(() => {
        if (!manualMode) return undefined;
        const t = setTimeout(() => {
            cityInputRef.current?.focus();
        }, 180);
        return () => clearTimeout(t);
    }, [manualMode]);

    useEffect(() => {
        if (manualMode) return undefined;
        const q = value.trim();
        if (q.length < minQueryLength) {
            dispatch(locationAutocompleteClear());
            return undefined;
        }
        if (saved?.id) return undefined;
        const tid = setTimeout(() => {
            dispatch(
                locationAutocompleteRequest({ q, page: 1, page_size: 10 })
            );
        }, debounceMs);
        return () => clearTimeout(tid);
    }, [value, debounceMs, minQueryLength, dispatch, manualMode, saved?.id]);

    useEffect(
        () => () => {
            dispatch(locationAutocompleteClear());
        },
        [dispatch]
    );

    const onFocus = () => {
        if (saved?.id) return;
        cancelBlur();
        setOpen(true);
    };

    const scheduleClose = () => {
        blurTimer.current = setTimeout(() => setOpen(false), 200);
    };

    const onBlur = () => {
        scheduleClose();
    };

    const clearVerifiedAndSearch = () => {
        cancelBlur();
        dispatch(clearSelectedLocation());
        dispatch(locationAutocompleteClear());
        onChangeText('');
        onSelectLocation(null);
        setOpen(false);
        setManualMode(false);
        lastSyncedSavedId.current = null;
    };

    const openManualEntry = useCallback(() => {
        cancelBlur();
        dispatch(locationAutocompleteClear());
        setOpen(false);
        setManualCityError(undefined);
        setManualCity(value.trim());
        setManualState('');
        setManualCountry('');
        setManualMode(true);
        Keyboard.dismiss();
    }, [cancelBlur, dispatch, value]);

    const handlePick = (item: LocationAutocompleteItem) => {
        if (String(item.type).toLowerCase() === 'manual') {
            openManualEntry();
            return;
        }
        if (selectLoading) return;
        cancelBlur();
        dispatch(selectLocationRequest(item));
        dispatch(locationAutocompleteClear());
        setOpen(false);
        setManualMode(false);
        Keyboard.dismiss();
    };

    const confirmManual = () => {
        const trimmedCity = manualCity.trim();
        if (!trimmedCity) {
            setManualCityError('City is required');
            return;
        }
        const payload = buildsManualPayload(manualCity, manualState, manualCountry);
        dispatch(selectLocationRequest(payload));
        dispatch(locationAutocompleteClear());
        Keyboard.dismiss();
    };

    const cancelManual = () => {
        setManualMode(false);
        setManualCityError(undefined);
    };

    const showAutocompletePanel =
        !saved?.id &&
        !manualMode &&
        open &&
        value.trim().length >= minQueryLength;

    const clearSearchOnly = () => {
        cancelBlur();
        onChangeText('');
        dispatch(locationAutocompleteClear());
        dispatch(clearSelectedLocation());
        onSelectLocation(null);
        setOpen(false);
        lastSyncedSavedId.current = null;
    };

    const labelBlock = (
        <View style={styles.labelRow}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                {lable}
            </Typography>
            {isRequired ? (
                <Typography color={colors.error[500]} variant="semiBoldTxtsm">
                    {' '}
                    *
                </Typography>
            ) : null}
        </View>
    );

    if (saved?.id) {
        return (
            <View style={styles.wrap}>
                {labelBlock}
                <View style={styles.verifiedBox}>
                    <Icon
                        size={20}
                        name="location"
                        iconFamily="Octicons"
                        color={colors.success[500]}
                    />
                    <Typography
                        variant="regularTxtsm"
                        color={colors.gray[900]}
                        style={styles.verifiedText}
                        numberOfLines={2}
                    >
                        {saved.display_name}
                    </Typography>
                    <Pressable
                        onPress={clearVerifiedAndSearch}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Clear location"
                        style={styles.clearHit}
                    >
                        <Ionicons
                            name="close"
                            size={22}
                            color={colors.gray[400]}
                        />
                    </Pressable>
                </View>
                <View style={styles.verifiedBadgeRow}>
                    <View style={styles.verifiedDot} />
                    <Typography variant="mediumTxtsm" color={colors.success[600]}>
                        Location verified
                    </Typography>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrap}>
            {labelBlock}
            <TextField
                lable=""
                placeholder={placeholder}
                value={value}
                onChangeText={(t: string) => {
                    onChangeText(t);
                    dispatch(clearSelectedLocation());
                    lastSyncedSavedId.current = null;
                    onSelectLocation(null);
                    if (open) setOpen(true);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                startIcon={startIcon}
                endIcon={
                    value.trim().length > 0
                        ? () => (
                            <Pressable
                                onPress={clearSearchOnly}
                                hitSlop={10}
                                accessibilityRole="button"
                                accessibilityLabel="Clear location search"
                                style={styles.clearHit}
                            >
                                <Ionicons
                                    name="closemu"
                                    size={22}
                                    color={colors.gray[400]}
                                />
                            </Pressable>
                        )
                        : undefined
                }
                size={size}
                isError={isError}
                error={
                    selectError ? undefined : error
                }
            />

            {selectError ? (
                <Typography
                    variant="regularTxtsm"
                    color={colors.error[600]}
                    style={styles.remoteErr}
                >
                    {selectError}
                </Typography>
            ) : null}

            {!manualMode ? (
                <Typography
                    variant="regularTxtsm"
                    color={colors.gray[500]}
                    style={styles.hintBelowField}
                >
                    Type to search — select a suggestion to confirm
                </Typography>
            ) : null}

            {showAutocompletePanel ? (
                <View style={styles.dropdown} pointerEvents="box-none">
                    {selectLoading ? (
                        <View style={styles.selectLoadingStrip}>
                            <ActivityIndicator
                                color={colors.brand[600]}
                                size="small"
                            />
                            <Typography
                                variant="regularTxtsm"
                                color={colors.gray[600]}
                                style={{ marginLeft: 8 }}
                            >
                                Saving location…
                            </Typography>
                        </View>
                    ) : null}
                    {loading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator
                                color={colors.brand[600]}
                                size="small"
                            />
                        </View>
                    ) : null}

                    {!loading && filteredResults.length === 0 ? (
                        <View style={styles.emptyHint}>
                            <View style={styles.emptyHintRow}>
                                <Typography
                                    variant="regularTxtsm"
                                    color={colors.gray[500]}
                                >
                                    No matching places — try{' '}
                                </Typography>
                                <Pressable onPress={openManualEntry} hitSlop={8}>
                                    <Typography
                                        variant="semiBoldTxtsm"
                                        color={colors.brand[700]}
                                    >
                                        enter manually
                                    </Typography>
                                </Pressable>
                            </View>
                        </View>
                    ) : null}

                    <FlatList
                        data={filteredResults}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={{ maxHeight: LIST_MAX_H }}
                        keyExtractor={(item, index) =>
                            item.place_id != null &&
                                item.place_id !== ''
                                ? String(item.place_id)
                                : `row-${index}-${item.display_name}`
                        }
                        renderItem={({ item }) => (
                            <Pressable
                                onPressIn={cancelBlur}
                                onPress={() => handlePick(item)}
                                disabled={selectLoading}
                                style={({ pressed }) => [
                                    styles.row,
                                    selectLoading && { opacity: 0.5 },
                                    pressed && { opacity: 0.9 },
                                ]}
                            >
                                <Typography
                                    variant="regularTxtsm"
                                    color={colors.gray[900]}
                                    numberOfLines={3}
                                >
                                    {dropdownLabel(item)}
                                </Typography>
                            </Pressable>
                        )}
                        ListFooterComponent={
                            <Pressable
                                onPressIn={cancelBlur}
                                onPress={openManualEntry}
                                disabled={selectLoading}
                                style={({ pressed }) => [
                                    styles.manualFooterRow,
                                    pressed && { opacity: 0.92 },
                                    selectLoading && { opacity: 0.5 },
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel="Enter location manually"
                            >
                                <Icon
                                    size={20}
                                    name="location"
                                    iconFamily="Octicons"
                                    color={colors.gray[400]}
                                />
                                <Typography
                                    variant="mediumTxtsm"
                                    color={colors.brand[700]}
                                >
                                    Enter location manually
                                </Typography>
                            </Pressable>
                        }
                    />
                </View>
            ) : null}

            {manualMode ? (
                <View style={styles.manualCard}>
                    <View style={styles.manualCardHeader}>
                        <Icon
                            size={20}
                            name="location"
                            iconFamily="Octicons"
                            color={colors.gray[400]}
                        />
                        <Typography
                            variant="semiBoldTxtsm"
                            color={colors.gray[800]}
                        >
                            Enter location manually
                        </Typography>
                    </View>

                    <TextField
                        ref={cityInputRef}
                        lable="City"
                        isRequired
                        placeholder="City"
                        value={manualCity}
                        onChangeText={(t) => {
                            setManualCity(t);
                            setManualCityError(undefined);
                        }}
                        size="Medium"
                        isError={!!manualCityError}
                        error={manualCityError}
                    />

                    <TextField
                        lable="State / Province"
                        placeholder="State or province"
                        value={manualState}
                        onChangeText={setManualState}
                        size="Medium"
                    />

                    <TextField
                        lable="Country"
                        placeholder="Country"
                        value={manualCountry}
                        onChangeText={setManualCountry}
                        size="Medium"
                    />

                    <View style={styles.manualActions}>
                        <View style={styles.manualActionFlex}>
                            <Button
                                size={44}
                                buttonColor={colors.brand[600]}
                                textColor={colors.base.white}
                                onPress={confirmManual}
                                isLoading={selectLoading}
                            >
                                Confirm Location
                            </Button>
                        </View>
                        <View style={styles.manualActionFlex}>
                            <Button
                                size={44}
                                variant="outline"
                                borderColor={colors.gray[300]}
                                textColor={colors.gray[800]}
                                buttonColor={colors.base.white}
                                borderWidth={1}
                                onPress={cancelManual}
                                disabled={selectLoading}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        zIndex: 12,
        elevation: 6,
        position: 'relative',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    verifiedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.success[400],
        backgroundColor: colors.success[25],
    },
    verifiedPin: {
        marginRight: 10,
    },
    verifiedText: {
        flex: 1,
        minWidth: 0,
        marginLeft:10
    },
    verifiedBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop:2,
    },
    verifiedDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success[500],
        marginLeft:5
    },
    remoteErr: {
        marginTop: 6,
    },
    hintBelowField: {
        marginTop: 4,
    },
    selectLoadingStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.gray[100],
        backgroundColor: colors.gray[25],
    },
    clearHit: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: colors.base.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[200],
        overflow: 'hidden',
        ...shadowStyles.shadow_lg,
    },
    loadingRow: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyHint: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.gray[100],
    },
    emptyHintRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    row: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.gray[100],
    },
    manualFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.gray[100],
        backgroundColor: colors.gray[25],
    },
    manualCard: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.gray[25],
        borderWidth: 1,
        borderColor: colors.gray[200],
        gap: 12,
        ...shadowStyles.shadow_xs,
    },
    manualCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 2,
    },
    manualActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
        alignItems: 'stretch',
    },
    manualActionFlex: {
        flex: 1,
        minWidth: 0,
    },
});

export default LocationAutocompleteField;
