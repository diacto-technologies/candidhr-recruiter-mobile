import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import FooterButtons from '../../molecules/footerbuttons';
import Card from '../../atoms/card';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../assets/svg/closeicon';
import { TextField } from '../../atoms/textfield';
import CheckBox from '../../atoms/checkbox';
import CommonDropdown from '../commondropdown';
import { getReasonCategoryListRequestAction, getReasonListRequestAction, updateStageStatusRequestAction, getApplicationReasonsListRequestAction } from '../../../features/applications/actions';
import {
  selectReasonCategoryList,
  selectReasonList,
  selectReasonListLoading,
  selectReasonListError,
  selectSelectedApplication,
  selectUpdateStageStatusLoading,
} from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';

const STATUS_LABELS: Record<string, string> = {
  approved: 'Approved',
  not_approved: 'Not Approved',
  approval_pending: 'Approval Pending',
  pending: 'Approval Pending',
  under_review: 'Approval Pending',
};

const EMAIL_TOKENS = [
  '{{candidate_name}}',
  '{{job_title}}',
  '{{application_status}}',
  '{{stage_status}}',
  '{{company}}',
];

export interface ChangeStatusModalProps {
  visible: boolean;
  onClose: () => void;
  applicantName?: string;
  /** Optional context id to display (e.g. stage id) */
  entityId?: string | null;
  currentStatus: string | null | undefined;
  newStatusOptions: Array<{ id: string; name: string }>;
  onUpdateStatus: (newStatusId: string, options?: { addReason?: boolean; categoryId?: string; reasonId?: string; emailCandidate?: boolean; subject?: string; message?: string }) => void;
  initialNewStatusId?: string | null;
  /** When provided with applicationId, Update status triggers PATCH /applications/v1/stages/{stageId}/{status}/ */
  stageId?: string | null;
  /** Required with stageId for API flow; used to refetch application and stages on success */
  applicationId?: string | null;
  /** Used by reasons API (e.g. "Resume Screening") */
  contentType?: string | null;
  /** When true, hides the "Add reason" section (e.g. for header application-status flow) */
  hideAddReason?: boolean;
  /** When set, used as the default email message when modal opens (e.g. application-status message with {{application_status}}) */
  initialEmailMessage?: string;
}

const ChangeStatusModal = ({
  visible,
  onClose,
  applicantName = '',
  entityId,
  currentStatus,
  newStatusOptions,
  onUpdateStatus,
  initialNewStatusId,
  stageId,
  applicationId,
  contentType,
  hideAddReason = false,
  initialEmailMessage,
}: ChangeStatusModalProps) => {
  const defaultMessage = 'Hi {{candidate_name}},\nYour stage status has been updated to "{{stage_status}}".\nThanks,\n{{company}}';
  const [selectedNewStatusId, setSelectedNewStatusId] = useState<string | null>(null);

  useEffect(() => {
    if (visible && initialNewStatusId != null) {
      setSelectedNewStatusId(initialNewStatusId);
    }
    if (!visible) {
      setSelectedNewStatusId(null);
    }
  }, [visible, initialNewStatusId]);
  const [addReason, setAddReason] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedReasonIds, setSelectedReasonIds] = useState<string[]>([]);
  const [emailCandidate, setEmailCandidate] = useState(false);
  const [subject, setSubject] = useState('Update on your application for {{job_title}}');
  const [message, setMessage] = useState(initialEmailMessage ?? defaultMessage);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (visible && initialEmailMessage != null) {
      setMessage(initialEmailMessage);
    }
  }, [visible, initialEmailMessage]);

  const dispatch = useDispatch();
  const reasonCategories = useAppSelector(selectReasonCategoryList);
  const reasonList = useAppSelector(selectReasonList);
  const reasonListLoading = useAppSelector(selectReasonListLoading);
  const reasonListError = useAppSelector(selectReasonListError);
  const updateStageStatusLoading = useAppSelector(selectUpdateStageStatusLoading);
  const application = useAppSelector(selectSelectedApplication);

  useEffect(() => {
    if (visible) {
      dispatch(getReasonCategoryListRequestAction());
      dispatch(getReasonListRequestAction(1));
    }
  }, [visible, dispatch]);

  const reasonDropdownOptions = useMemo(() => {
    const categorySet = selectedCategories.length > 0 ? new Set(selectedCategories) : null;
    const filtered = categorySet
      ? reasonList.filter((item) => {
          if (!item.category) return true;
          const categoryId = item.category.toLowerCase().replace(/\s+/g, '_');
          return categorySet.has(categoryId);
        })
      : reasonList;
    return filtered.map((item) => ({
      id: item.id,
      name: item.note?.trim() || '(No note)',
    }));
  }, [reasonList, selectedCategories]);

  const currentStatusStr =
    typeof currentStatus === 'string' ? currentStatus : currentStatus != null ? String(currentStatus) : '';

  const currentLabel = currentStatusStr
    ? STATUS_LABELS[currentStatusStr] ?? currentStatusStr.replace(/_/g, ' ')
    : '—';
  const newStatusOptionsFiltered = useMemo(
    () =>
      (newStatusOptions ?? []).filter(
        (o) => (o?.id ?? '').toLowerCase() !== currentStatusStr.toLowerCase()
      ),
    [newStatusOptions, currentStatusStr]
  );
  useEffect(() => {
    if (visible && selectedNewStatusId != null && currentStatusStr) {
      if ((selectedNewStatusId ?? '').toLowerCase() === currentStatusStr.toLowerCase()) {
        setSelectedNewStatusId(null);
      }
    }
  }, [visible, currentStatusStr, selectedNewStatusId]);
  const selectedNewOption = newStatusOptionsFiltered.find((o) => o.id === selectedNewStatusId);

  const isEmailFieldsInvalid = emailCandidate && (!subject.trim() || !message.trim());
  const isUpdateDisabled =
    !selectedNewStatusId ||
    isEmailFieldsInvalid ||
    (addReason && selectedReasonIds.length === 0) ||
    updateStageStatusLoading;

  const useApiFlow = Boolean(stageId && applicationId);

  const handleUpdate = () => {
    if (!selectedNewStatusId) return;
    if (emailCandidate && (!subject.trim() || !message.trim())) return;

    const options = {
      addReason: addReason || undefined,
      categoryId: addReason ? (selectedCategoryId ?? undefined) : undefined,
      reasonId: undefined,
      emailCandidate: emailCandidate || undefined,
      subject: emailCandidate ? subject : undefined,
      message: emailCandidate ? message : undefined,
    };

    if (useApiFlow && stageId && applicationId) {
      dispatch(
        updateStageStatusRequestAction({
          stageId,
          status: selectedNewStatusId,
          applicationId: application?.id ?? applicationId ?? '',
          jobId: application?.job?.id,
          reasonIds: addReason ? selectedReasonIds : undefined,
          contentType: addReason ? (contentType ?? undefined) : undefined,
          emailCandidate: emailCandidate || undefined,
          subject: emailCandidate ? subject : undefined,
          message: emailCandidate ? message : undefined,
        })
      );
      onUpdateStatus(selectedNewStatusId, options);
      onClose();
    } else {
      onUpdateStatus(selectedNewStatusId, options);
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedNewStatusId(null);
    setAddReason(false);
    setSelectedCategoryId(null);
    setSelectedReasonIds([]);
    setSelectedCategories([]);
    setEmailCandidate(false);
    setSubject('Update on your application for {{job_title}}');
    setMessage(initialEmailMessage ?? defaultMessage);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
        <Card style={styles.card}>
          <View style={styles.submodalCard}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {/* <View style={styles.headerIconWrap}>
                <Ionicons name="checkmark" size={18} color={colors.brand[600]} />
              </View> */}
                <View>
                  <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                    Change status
                  </Typography>
                  {applicantName ? (
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      {applicantName}
                    </Typography>
                  ) : null}
                </View>
              </View>
              <Pressable onPress={handleClose} hitSlop={12}>
                <SvgXml xml={closeIcon} fill={colors.gray[400]} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  Current
                </Typography>
                {/* <View style={styles.row}> */}
                <TextField
                  value={currentLabel ?? ''}
                  // onChangeText={setSelectedReasonId}
                  placeholder="Current"
                  editable={false}
                  style={styles.input}
                  size="Medium"
                  disable={true}
                />

                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  New Status
                </Typography>
                <CommonDropdown
                  placeholder="Select new status"
                  options={newStatusOptionsFiltered}
                  value={selectedNewStatusId ?? ''}
                  onChange={(nextValue) => {
                    setSelectedNewStatusId(nextValue ?? null);
                  }}
                  labelKey="name"
                  valueKey="id"
                  showIndexAndTotal={false}
                  mode="default"
                  dropdownPosition="bottom"
                  disabled={initialNewStatusId != null}
                />
              </View>

              {!hideAddReason ? (
                <View style={[styles.optionSection, { marginBottom: 20, borderColor: addReason ? colors.brand[500] : colors.gray[200] }]}>
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
                        Add reason
                      </Typography>
                      <CheckBox
                        checked={addReason}
                        onChange={() => {
                          setAddReason((prev) => {
                            const next = !prev;
                            if (!next) {
                              setSelectedCategories([]);
                              setSelectedCategoryId(null);
                              setSelectedReasonIds([]);
                            }
                            return next;
                          });
                        }}
                      />
                    </View>
                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                      Attach a reason for this status change (optional).
                    </Typography>
                  </View>
                  {addReason ? (
                    <View style={{ gap: 12 }}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                        {reasonCategories.map((item) => {
                          const selected = selectedCategories.includes(item.id);

                          return (
                            <Pressable
                              key={item.id}
                              onPress={() => {
                                const nextSelectedCategories = selected
                                  ? selectedCategories.filter(id => id !== item.id)
                                  : [...selectedCategories, item.id];

                                setSelectedCategories(nextSelectedCategories);
                                setSelectedCategoryId(nextSelectedCategories[0] ?? null);
                              }}
                              style={[
                                styles.categoryPill,
                                selected && styles.categoryPillSelected
                              ]}
                            >
                              <Typography
                                variant="mediumTxtsm"
                                color={selected ? colors.brand[700] : colors.gray[700]}
                              >
                                {item.name}
                              </Typography>
                            </Pressable>
                          );
                        })}
                      </View>
                      {/* Select reason */}
                      <CommonDropdown
                        placeholder="Select a reason"
                        options={reasonDropdownOptions}
                        value={selectedReasonIds}
                        onChange={(nextValue) =>
                          setSelectedReasonIds(Array.isArray(nextValue) ? nextValue : [])
                        }
                        labelKey="name"
                        valueKey="id"
                        showIndexAndTotal={false}
                        mode="default"
                        dropdownPosition="bottom"
                        disabled={reasonListLoading}
                        error={reasonListError ?? undefined}
                        multiSelect
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

          <View style={[styles.optionSection, { borderColor: emailCandidate ? colors.brand[500] : colors.gray[200] }]}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
                  Email Candidate
                </Typography>
                <CheckBox
                  checked={emailCandidate}
                  onChange={() => {
                    setEmailCandidate((prev) => {
                      const next = !prev;
                      if (!next) {
                        setSubject('Update on your application for {{job_title}}');
                        setMessage(initialEmailMessage ?? defaultMessage);
                      }
                      return next;
                    });
                  }}
                />
              </View>
              <Typography variant="regularTxtsm" color={colors.gray[500]}>
                Sends a status update email after the status is changed.
              </Typography>
            </View>
            {emailCandidate ? (
              <View style={{gap:8}}>
                <View style={styles.requiredLabelRow}>
                  <Typography variant="mediumTxtsm" color={colors.gray[700]}>Subject </Typography>
                  <Typography variant="regularTxtsm" color={colors.error[500]}>*</Typography>
                </View>

                <TextField
                  value={subject}
                  onChangeText={(text) => { setSubject(text) }}
                  placeholder="Subject"
                  style={styles.input}
                  size="Medium"
                  multiline
                />

                <View style={styles.requiredLabelRow}>
                   <Typography variant="mediumTxtsm" color={colors.gray[700]}>Message </Typography>
                  <Typography variant="regularTxtsm" color={colors.error[500]}>*</Typography>
                </View>

                <TextField
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Message"
                  style={[styles.input, styles.textArea]}
                  size="Large"
                  multiline
                />
                <Typography variant="regularTxtxs" color={colors.gray[500]} style={styles.label}>
                  Tokens: {EMAIL_TOKENS.join(', ')}
                </Typography>
              </View>
            ) : null}
          </View>
        </ScrollView>
        <FooterButtons
          leftButtonProps={{
            children: "Cancel",
            variant: "outline",
            size: 44,
            buttonColor: colors.base.white,
            textColor: colors.gray[700],
            borderColor: colors.gray[300],
            borderWidth: 1,
            borderRadius: 8,
            borderGradientOpacity: 0.25,
            shadowColor: colors.gray[700],
            onPress: handleClose,
          }}
          rightButtonProps={{
            children: updateStageStatusLoading ? "Updating…" : "Update status",
            variant: "contain",
            size: 44,
            buttonColor: colors.brand[600],
            textColor: colors.base.white,
            borderColor: colors.base.white,
            borderRadius: 8,
            onPress: handleUpdate,
            disabled: isUpdateDisabled,
          }}
        />
      </View>
    </Card>
      </KeyboardAvoidingView >
    </Modal >
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 13, 18, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: colors.base.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  headerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand[100],
  },
  scroll: { maxHeight: 400 },
  scrollContent: { padding: 20, paddingBottom: 12 },
  section: {
    gap: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newStatusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  pillSelected: {
    backgroundColor: colors.brand[600],
    borderColor: colors.brand[600],
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.gray[400],
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand[600],
    borderColor: colors.brand[600],
  },
  hint: {
    marginBottom: 12,
    marginLeft: 30,
  },
  label: {
    marginBottom: 6,
    marginTop: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.gray[900],
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  submodalCard: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: colors.gray[200],
    overflow: "hidden",
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.base.white,
  },

  categoryPillSelected: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[400],
  },
  optionSection: {
    gap: 12,
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
  },
  requiredLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryHint: {
    marginTop: 8,
  },
});

export default ChangeStatusModal;
