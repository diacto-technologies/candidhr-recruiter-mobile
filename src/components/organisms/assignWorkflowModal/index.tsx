import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SvgXml } from "react-native-svg";

import Typography from "../../atoms/typography";
import Card from "../../atoms/card";
import CheckBox from "../../atoms/checkbox";
import FooterButtons from "../../molecules/footerbuttons";
import TagList from "../../molecules/taglist";
import CommonDropdown from "../commondropdown";
import { colors } from "../../../theme/colors";
import { closeIcon } from "../../../assets/svg/closeicon";
import { assignedUserIcon } from "../../../assets/svg/assigneduser";
import { emailIcon } from "../../../assets/svg/email";
import type { Job, JobDetail } from "../../../features/jobs/types";
import {
    assignWorkflowToJobRequestAction,
    clearAssignWorkflowSubmitSuccess,
    getJobDetailRequestAction,
} from "../../../features/jobs";
import {
    getWorkflowsRequestAction,
    workflowsListReset,
    selectWorkflowsListItems,
    selectWorkflowsListLoading,
    selectWorkflowsListNext,
    selectWorkflowsListPage,
    selectWorkflowsListPageSize,
} from "../../../features/workflows";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const WORKFLOW_PAGE_SIZE = 10;

function isValidEmail(s: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function resolveWorkflowId(j: Job | JobDetail | null): string | null {
    if (!j?.workflow) return null;
    const w = j.workflow as string | { id?: string };
    if (typeof w === "string") {
        const t = w.trim();
        return t || null;
    }
    const id = w.id?.trim();
    return id || null;
}

function resolveWorkflowName(j: Job | JobDetail | null): string {
    if (!j?.workflow) return "";
    const w = j.workflow as string | { name?: string };
    if (typeof w === "string") return "";
    return w.name ?? "";
}

export type AssignWorkflowModalProps = {
    visible: boolean;
    onClose: () => void;
    job: Job | null;
};

export default function AssignWorkflowModal({ visible, onClose, job }: AssignWorkflowModalProps) {
    const dispatch = useAppDispatch();
    const selectedJob = useAppSelector((s) => s.jobs.selectedJob);
    const jobDetailLoading = useAppSelector((s) => s.jobs.jobDetailLoading);
    const jobDetailRequestJobId = useAppSelector((s) => s.jobs.jobDetailRequestJobId);
    const workflows = useAppSelector(selectWorkflowsListItems);
    const listLoading = useAppSelector(selectWorkflowsListLoading);
    const workflowsNext = useAppSelector(selectWorkflowsListNext);
    const workflowsPage = useAppSelector(selectWorkflowsListPage);
    const workflowsPageSize = useAppSelector(selectWorkflowsListPageSize);

    const jobId = job?.id ?? null;
    const effectiveJob: Job | JobDetail | null =
        jobId && selectedJob?.id === jobId ? selectedJob : job ?? null;
    const jobTitle = effectiveJob?.title ?? job?.title ?? "";

    const assignLoading = useAppSelector((s) =>
        jobId ? s.jobs.assignWorkflowLoadingJobId === jobId : false
    );
    const assignSucceeded = useAppSelector((s) => s.jobs.assignWorkflowSubmitSucceeded);

    const needsStoreDetail = Boolean(visible && jobId && selectedJob?.id !== jobId);
    const fetchingJobDetail = Boolean(
        needsStoreDetail && jobDetailLoading && jobDetailRequestJobId === jobId
    );

    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

    const [inviteFromApplicationForm, setInviteFromApplicationForm] = useState(true);
    const [inviteViaEmail, setInviteViaEmail] = useState(true);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
    const [emailDraft, setEmailDraft] = useState("");
    const [emailCandidate, setEmailCandidate] = useState(false);

    const reset = useCallback(() => {
        dispatch(workflowsListReset());
        dispatch(clearAssignWorkflowSubmitSuccess());
        setSelectedWorkflowId(null);
        setInviteFromApplicationForm(true);
        setInviteViaEmail(true);
        setInviteEmails([]);
        setEmailDraft("");
        setEmailCandidate(false);
    }, [dispatch]);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    useEffect(() => {
        if (!visible || !jobId) return;
        if (selectedJob?.id === jobId) return;
        if (jobDetailLoading && jobDetailRequestJobId === jobId) return;
        dispatch(getJobDetailRequestAction(jobId));
    }, [visible, jobId, selectedJob?.id, jobDetailLoading, jobDetailRequestJobId, dispatch]);

    useEffect(() => {
        if (!visible || !jobId || !effectiveJob) {
            return;
        }
        dispatch(workflowsListReset());
        setSelectedWorkflowId(resolveWorkflowId(effectiveJob));
        setInviteFromApplicationForm(effectiveJob.invite_via_application_form ?? true);
        setInviteViaEmail(effectiveJob.invite_via_email ?? true);
        setInviteEmails(Array.isArray(effectiveJob.emails) ? [...effectiveJob.emails] : []);
        setEmailDraft("");
        const j = effectiveJob as Job & { new_applicant_notify?: boolean };
        setEmailCandidate(
            Boolean(j.email_candidate ?? j.new_applicant_notify)
        );
        dispatch(clearAssignWorkflowSubmitSuccess());
    }, [visible, jobId, effectiveJob, dispatch]);

    useEffect(() => {
        if (!visible || !assignSucceeded) return;
        dispatch(clearAssignWorkflowSubmitSuccess());
        handleClose();
    }, [visible, assignSucceeded, dispatch, handleClose]);

    const tryAddEmailToken = useCallback((raw: string) => {
        const trimmed = raw.trim();
        if (!trimmed) return;
        if (!isValidEmail(trimmed)) {
            return;
        }
        const lower = trimmed.toLowerCase();
        setInviteEmails((prev) => {
            if (prev.some((e) => e.toLowerCase() === lower)) return prev;
            return [...prev, trimmed];
        });
    }, []);

    const handleEmailDraftChange = useCallback(
        (t: string) => {
            const last = t[t.length - 1];
            if (last === " " || last === ",") {
                const piece = t.slice(0, -1);
                if (piece.trim()) tryAddEmailToken(piece);
                setEmailDraft("");
                return;
            }
            setEmailDraft(t);
        },
        [tryAddEmailToken]
    );

    const commitEmailDraft = useCallback(() => {
        if (emailDraft.trim()) tryAddEmailToken(emailDraft);
        setEmailDraft("");
    }, [emailDraft, tryAddEmailToken]);

    const handleDropdownOpen = useCallback(() => {
        if (workflows.length === 0 && !listLoading) {
            dispatch(
                getWorkflowsRequestAction({ page: 1, pageSize: workflowsPageSize || WORKFLOW_PAGE_SIZE })
            );
        }
    }, [workflows.length, listLoading, dispatch, workflowsPageSize]);

    const handleLoadMore = useCallback(() => {
        if (!workflowsNext || listLoading) return;
        dispatch(
            getWorkflowsRequestAction({
                page: workflowsPage + 1,
                pageSize: workflowsPageSize || WORKFLOW_PAGE_SIZE,
            })
        );
    }, [workflowsNext, listLoading, dispatch, workflowsPage, workflowsPageSize]);

    const handleAssign = useCallback(() => {
        if (!jobId || !selectedWorkflowId || !effectiveJob || assignLoading) return;
        if (inviteViaEmail && inviteEmails.length === 0) return;
        const wf = workflows.find((w) => w.id === selectedWorkflowId);
        dispatch(
            assignWorkflowToJobRequestAction({
                jobId,
                workflowId: selectedWorkflowId,
                workflowName:
                    wf?.name ?? resolveWorkflowName(effectiveJob) ?? "",
                invite_via_application_form: inviteFromApplicationForm,
                invite_via_email: inviteViaEmail,
                emails: inviteViaEmail ? inviteEmails : [],
                email_candidate: emailCandidate,
                job: effectiveJob as Job,
            })
        );
    }, [
        jobId,
        selectedWorkflowId,
        effectiveJob,
        assignLoading,
        inviteFromApplicationForm,
        inviteViaEmail,
        inviteEmails,
        emailCandidate,
        workflows,
        dispatch,
    ]);

    if (!visible || !jobId) {
        return null;
    }

    const showWorkflowOptions = Boolean(selectedWorkflowId);
    const assignDisabled =
        fetchingJobDetail ||
        !selectedWorkflowId ||
        assignLoading ||
        (inviteViaEmail && inviteEmails.length === 0);
    const emailsRequiredMessage =
        inviteViaEmail && inviteEmails.length === 0
            ? "Please add at least one email address."
            : null;

    const mailXml = emailIcon.replace(/#414651/g, colors.brand[600]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <KeyboardAvoidingView
                style={styles.backdrop}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
                <Card style={styles.card}>
                    <View style={styles.submodalCard}>
                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                <View style={styles.headerIconWrap}>
                                    <SvgXml xml={assignedUserIcon} width={20} height={20} />
                                </View>
                                <View style={styles.headerTitles}>
                                    <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                                        Assign Workflow
                                    </Typography>
                                    <Typography variant="regularTxtsm" color={colors.gray[500]} numberOfLines={1}>
                                        Job: {jobTitle}
                                    </Typography>
                                </View>
                            </View>
                            <Pressable onPress={handleClose} hitSlop={12} accessibilityRole="button">
                                <SvgXml xml={closeIcon} fill={colors.gray[400]} />
                            </Pressable>
                        </View>

                        <ScrollView
                            style={styles.scroll}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {fetchingJobDetail ? (
                                <View style={styles.detailLoader}>
                                    <ActivityIndicator color={colors.brand[600]} size="small" />
                                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                        Loading job details…
                                    </Typography>
                                </View>
                            ) : (
                                <>
                            <View style={styles.section}>
                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                    Select workflow
                                </Typography>
                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                    Search and select a workflow to assign to this job.
                                </Typography>
                                {listLoading && workflows.length === 0 ? (
                                    <View style={styles.listLoader}>
                                        <ActivityIndicator color={colors.brand[600]} size="small" />
                                    </View>
                                ) : (
                                    <CommonDropdown
                                        placeholder="Search workflows..."
                                        options={workflows}
                                        value={selectedWorkflowId ?? ""}
                                        onChange={(v) => {
                                            const id = typeof v === "string" ? v : "";
                                            setSelectedWorkflowId(id || null);
                                        }}
                                        onOpen={handleDropdownOpen}
                                        onLoadMore={handleLoadMore}
                                        labelKey="name"
                                        valueKey="id"
                                        mode="default"
                                        dropdownPosition="bottom"
                                        multiSelect={false}
                                        searchable
                                        searchPlaceholder="Search workflows..."
                                        searchField="name"
                                        showIndexAndTotal={false}
                                    />
                                )}
                            </View>

                            {showWorkflowOptions ? (
                                <View style={styles.workflowOptions}>
                                    <View style={styles.optionCard}>
                                        <View style={styles.optionRowCheckboxLeft}>
                                            <CheckBox
                                                checked={inviteFromApplicationForm}
                                                onChange={() =>
                                                    setInviteFromApplicationForm((p) => !p)
                                                }
                                            />
                                            <Pressable
                                                style={styles.optionTextCol}
                                                onPress={() =>
                                                    setInviteFromApplicationForm((p) => !p)
                                                }
                                                accessibilityRole="checkbox"
                                                accessibilityState={{ checked: inviteFromApplicationForm }}
                                            >
                                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                                    Include from job application form
                                                </Typography>
                                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                                    Auto-add candidates who applied via the job form
                                                </Typography>
                                            </Pressable>
                                        </View>
                                    </View>

                                    <View style={styles.optionCard}>
                                        <View style={styles.optionRowCheckboxLeft}>
                                            <CheckBox
                                                checked={inviteViaEmail}
                                                onChange={() => setInviteViaEmail((p) => !p)}
                                            />
                                            <Pressable
                                                style={styles.optionTextCol}
                                                onPress={() => setInviteViaEmail((p) => !p)}
                                                accessibilityRole="checkbox"
                                                accessibilityState={{ checked: inviteViaEmail }}
                                            >
                                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                                    Invite via email
                                                </Typography>
                                                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                                    Manually enter email addresses to invite candidates
                                                </Typography>
                                            </Pressable>
                                        </View>
                                    </View>

                                    {inviteViaEmail ? (
                                        <View style={styles.optionCard}>
                                            <View style={styles.emailBlockHeader}>
                                                <SvgXml xml={mailXml} width={20} height={20} />
                                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                                    Email addresses
                                                </Typography>
                                            </View>
                                            <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                                Type an email and press Enter or Space to add.
                                            </Typography>
                                            <TextInput
                                                value={emailDraft}
                                                onChangeText={handleEmailDraftChange}
                                                onSubmitEditing={commitEmailDraft}
                                                placeholder="name@company.com"
                                                placeholderTextColor={colors.gray[500]}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                style={[
                                                    styles.emailInput,
                                                    emailsRequiredMessage ? styles.emailInputError : null,
                                                ]}
                                            />
                                            {inviteEmails.length > 0 ? (
                                                <TagList
                                                    data={inviteEmails}
                                                    onRemove={(index) => {
                                                        setInviteEmails((prev) =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                    textColor={colors.brand[700]}
                                                    bgColor={colors.brand[50]}
                                                    borderColor={colors.brand[200]}
                                                />
                                            ) : null}
                                            {emailsRequiredMessage ? (
                                                <Typography variant="regularTxtsm" color={colors.error[500]}>
                                                    {emailsRequiredMessage}
                                                </Typography>
                                            ) : null}
                                        </View>
                                    ) : null}

                                    {/* <View style={styles.optionCard}>
                                        <View style={styles.emailCandidateHeaderRow}>
                                            <Pressable
                                                style={styles.emailCandidateTitlePress}
                                                onPress={() => setEmailCandidate((p) => !p)}
                                            >
                                                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                                    Email Candidate
                                                </Typography>
                                            </Pressable>
                                            <CheckBox
                                                checked={emailCandidate}
                                                onChange={() => setEmailCandidate((p) => !p)}
                                            />
                                        </View>
                                        <Typography variant="regularTxtsm" color={colors.gray[500]}>
                                            Sends a status update email after the status is changed.
                                        </Typography>
                                    </View> */}
                                </View>
                            ) : null}
                                </>
                            )}
                        </ScrollView>

                        <FooterButtons
                            footerStyle={styles.footerBleed}
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
                                disabled: assignLoading,
                            }}
                            rightButtonProps={{
                                children: "Assign Workflow",
                                size: 48,
                                buttonColor: colors.brand[600],
                                textColor: colors.base.white,
                                borderRadius: 12,
                                onPress: handleAssign,
                                disabled: assignDisabled,
                                isLoading: assignLoading,
                            }}
                        />
                    </View>
                </Card>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(10, 13, 18, 0.45)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        maxHeight: "90%",
        backgroundColor: colors.base.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray[200],
        overflow: "hidden",
        padding: 4,
    },
    submodalCard: {
        borderWidth: 2,
        borderRadius: 16,
        borderColor: colors.gray[200],
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexShrink: 1,
    },
    headerIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.brand[100],
    },
    headerTitles: {
        flexShrink: 1,
        gap: 2,
    },
    scroll: { maxHeight: 480 },
    scrollContent: { padding: 20, paddingBottom: 12, gap: 16 },
    section: {
        gap: 10,
    },
    workflowOptions: {
        gap: 12,
    },
    optionCard: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 12,
        padding: 14,
        gap: 8,
        backgroundColor: colors.base.white,
    },
    optionRowCheckboxLeft: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    optionTextCol: {
        flex: 1,
        gap: 4,
    },
    emailBlockHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    emailInput: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: colors.gray[900],
        marginTop: 4,
    },
    emailInputError: {
        borderColor: colors.error[500],
    },
    emailCandidateHeaderRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },
    emailCandidateTitlePress: {
        flex: 1,
    },
    listLoader: {
        paddingVertical: 16,
        alignItems: "center",
    },
    detailLoader: {
        paddingVertical: 32,
        alignItems: "center",
        gap: 12,
    },
    /** Counteract submodal horizontal inset so footer spans card width like other modals. */
    footerBleed: {
        marginHorizontal: -2,
        paddingBottom: 4,
    },
});
