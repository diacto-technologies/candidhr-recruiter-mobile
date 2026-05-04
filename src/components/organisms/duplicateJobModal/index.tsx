import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { TextField, Typography } from "../../atoms";
import Icon from "../../atoms/vectoricon";
import CheckBox from "../../atoms/checkbox";
import FooterButtons from "../../molecules/footerbuttons";
import LocationAutocompleteField from "../../molecules/locationautocompletefield";
import CustomModalWrapper, {
    CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} from "../custommodalwrapper";
import { colors } from "../../../theme/colors";
import type { LocationAutocompleteItem } from "../../../features/locations";
import { clearSelectedLocation, selectLocationSuccess } from "../../../features/locations";
import type { SavedLocationData } from "../../../features/locations/types";
import { jobsApi } from "../../../features/jobs/api";
import type { Job } from "../../../features/jobs/types";
import { createJobSuccess } from "../../../features/jobs";
import { useAppDispatch } from "../../../store/hooks";
import { showToastMessage } from "../../../utils/toast";
import { navigate } from "../../../utils/navigationUtils";

const FOOTER_BLEED = {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    marginBottom: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
} as const;

/** Minimal shape from GET job or list row `location_detail`. */
type LocationDetailLike = {
    id: string;
    place_id?: string | null;
    display_name: string;
    name?: string;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    country_code?: string;
    latitude?: string | null;
    longitude?: string | null;
    location_type?: string;
};

function locationDetailToSavedData(ld: LocationDetailLike): SavedLocationData {
    return {
        id: ld.id,
        place_id: ld.place_id ?? null,
        display_name: ld.display_name,
        name: (ld.name ?? ld.city ?? "").trim() || ld.display_name,
        city: ld.city ?? "",
        state: ld.state ?? "",
        country: ld.country ?? "",
        country_code: ld.country_code ?? "",
        latitude: ld.latitude ?? null,
        longitude: ld.longitude ?? null,
        location_type: ld.location_type ?? "town",
    };
}

function hasListLocationDetail(job: Job | null): job is Job & { location_detail: LocationDetailLike } {
    if (!job?.id) return false;
    const ld = job.location_detail as LocationDetailLike | undefined;
    return !!ld && typeof ld === "object" && String(ld.id ?? "").length > 0;
}

export type DuplicateJobModalProps = {
    visible: boolean;
    onClose: () => void;
    /** Job row from the list — `id` used for POST …/duplicate/; optional `location_detail` skips GET. */
    sourceJob: Job | null;
};

export default function DuplicateJobModal({ visible, onClose, sourceJob }: DuplicateJobModalProps) {
    const dispatch = useAppDispatch();
    const submitLockRef = useRef(false);

    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [locationDetail, setLocationDetail] = useState<LocationAutocompleteItem | null>(null);
    const [copySharedUsers, setCopySharedUsers] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ jobTitle?: string; location?: string }>({});
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const sourceJobId = sourceJob?.id ?? null;

    const resetForm = useCallback(() => {
        setJobTitle("");
        setLocation("");
        setLocationDetail(null);
        setCopySharedUsers(false);
        setFieldErrors({});
        setDetailError(null);
        setSubmitting(false);
        submitLockRef.current = false;
    }, []);

    const handleClose = useCallback(() => {
        submitLockRef.current = false;
        dispatch(clearSelectedLocation());
        resetForm();
        onClose();
    }, [dispatch, onClose, resetForm]);

    const clearFieldError = useCallback((key: keyof typeof fieldErrors) => {
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    useEffect(() => {
        if (!visible || !sourceJobId || !sourceJob) {
            return;
        }

        dispatch(clearSelectedLocation());

        if (hasListLocationDetail(sourceJob)) {
            setDetailLoading(false);
            setDetailError(null);
            setJobTitle(`(Copy) ${sourceJob.title ?? ""}`.trim());
            setLocation(sourceJob.location ?? "");
            dispatch(selectLocationSuccess(locationDetailToSavedData(sourceJob.location_detail)));
            return;
        }

        let cancelled = false;
        setDetailLoading(true);
        setDetailError(null);
        setLocationDetail(null);

        (async () => {
            try {
                const detail = await jobsApi.getJobDetail(sourceJobId);
                if (cancelled) return;
                setJobTitle(`(Copy) ${detail.title ?? ""}`.trim());
                setLocation(detail.location ?? "");
                if (detail.location_detail?.id) {
                    dispatch(selectLocationSuccess(locationDetailToSavedData(detail.location_detail)));
                } else {
                    setLocationDetail(null);
                }
            } catch (e) {
                if (cancelled) return;
                const msg = e instanceof Error ? e.message : "Could not load job";
                setDetailError(msg);
            } finally {
                if (!cancelled) setDetailLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [visible, sourceJobId, sourceJob, dispatch]);

    const validate = useCallback(() => {
        const next: { jobTitle?: string; location?: string } = {};
        if (!jobTitle.trim()) next.jobTitle = "Job title is required";
        if (!locationDetail?.id) next.location = "Select a verified location";
        setFieldErrors(next);
        return Object.keys(next).length === 0;
    }, [jobTitle, locationDetail?.id]);

    const onCreate = useCallback(async () => {
        if (!sourceJobId || detailLoading || submitLockRef.current) return;
        if (!validate()) return;
        const locationId = locationDetail?.id;
        if (!locationId) return;

        submitLockRef.current = true;
        setSubmitting(true);
        try {
            const job = await jobsApi.duplicateJob(sourceJobId, {
                title: jobTitle.trim(),
                location: location.trim(),
                location_id: locationId,
                copy_shared_users: copySharedUsers,
            });
            dispatch(createJobSuccess(job));
            showToastMessage("Job copy created", "success");
            handleClose();
            // navigate("jobdetails", { jobId: job.id });
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Could not duplicate job";
            showToastMessage(msg, "error");
        } finally {
            submitLockRef.current = false;
            setSubmitting(false);
        }
    }, [
        sourceJobId,
        detailLoading,
        validate,
        locationDetail?.id,
        jobTitle,
        location,
        copySharedUsers,
        dispatch,
        handleClose,
    ]);

    const onCopySharedInfo = useCallback(() => {
        Alert.alert(
            "Copy shared users",
            "When enabled, people who had access to the original job are given access to this copy."
        );
    }, []);

    if (!visible || !sourceJobId) {
        return null;
    }

    const formBlocked = detailLoading || !!detailError;
    const createDisabled =
        formBlocked || submitting || !jobTitle.trim() || !locationDetail?.id;

    return (
        <CustomModalWrapper
            visible={visible}
            title="Duplicate Job"
            onClose={handleClose}
            closeOnBackdropPress={!submitting}
            scrollable
        >
            {detailLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator color={colors.brand[600]} />
                    <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ marginTop: 8 }}>
                        Loading job…
                    </Typography>
                </View>
            ) : detailError ? (
                <Typography variant="regularTxtsm" color={colors.error[600]}>
                    {detailError}
                </Typography>
            ) : (
                <View style={styles.body}>
                    <View style={styles.fieldBlock}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                            Job Title
                        </Typography>
                        <TextField
                            value={jobTitle}
                            onChangeText={(t) => {
                                setJobTitle(t);
                                clearFieldError("jobTitle");
                            }}
                            placeholder="Job title"
                            size="Medium"
                            showOutline
                            isError={!!fieldErrors.jobTitle}
                            error={fieldErrors.jobTitle}
                        />
                    </View>

                    <LocationAutocompleteField
                        lable="Location"
                        isRequired
                        placeholder="Search location"
                        value={location}
                        onChangeText={(t) => {
                            setLocation(t);
                            setLocationDetail(null);
                            clearFieldError("location");
                        }}
                        onSelectLocation={(item: LocationAutocompleteItem | null) => {
                            setLocationDetail(item);
                            clearFieldError("location");
                        }}
                        startIcon={
                            <Icon
                                size={20}
                                name="location"
                                iconFamily="Octicons"
                                color={colors.gray[400]}
                            />
                        }
                        size="Medium"
                        isError={!!fieldErrors.location}
                        error={fieldErrors.location}
                    />

                    <View style={styles.checkboxRow}>
                        <CheckBox
                            checked={copySharedUsers}
                            onChange={() => setCopySharedUsers((v) => !v)}
                        />
                        <Pressable
                            style={styles.checkboxLabel}
                            onPress={() => setCopySharedUsers((v) => !v)}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: copySharedUsers }}
                        >
                            <Typography variant="regularTxtsm" color={colors.gray[800]}>
                                Copy shared users
                            </Typography>
                        </Pressable>
                        <Pressable
                            onPress={onCopySharedInfo}
                            hitSlop={10}
                            accessibilityRole="button"
                            accessibilityLabel="About copy shared users"
                        >
                            <Ionicons name="information-circle-outline" size={20} color={colors.gray[500]} />
                        </Pressable>
                    </View>
                </View>
            )}

            <View style={[FOOTER_BLEED, styles.footerTop]}>
                <FooterButtons
                    footerStyle={{
                        paddingHorizontal: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
                        paddingTop: 12,
                        paddingBottom: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
                    }}
                    leftButtonProps={{
                        children: "Cancel",
                        size: 48,
                        variant: "outline",
                        borderColor: colors.gray[200],
                        buttonColor: colors.base.white,
                        textColor: colors.gray[900],
                        borderWidth: 1,
                        borderRadius: 12,
                        onPress: handleClose,
                        disabled: submitting,
                    }}
                    rightButtonProps={{
                        children: "Create",
                        size: 48,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderRadius: 12,
                        onPress: onCreate,
                        disabled: createDisabled,
                        isLoading: submitting,
                    }}
                />
            </View>
        </CustomModalWrapper>
    );
}

const styles = StyleSheet.create({
    body: {
        gap: 16,
        paddingBottom: 8,
    },
    fieldBlock: {
        gap: 6,
    },
    loader: {
        alignItems: "center",
        paddingVertical: 24,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    checkboxLabel: {
        flex: 1,
    },
    footerTop: {
        marginTop: 8,
    },
});
