import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import FooterButtons from '../../molecules/footerbuttons';
import Card from '../../atoms/card';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../assets/svg/closeicon';
import { TextField } from '../../atoms/textfield';
import CheckBox from '../../atoms/checkbox';
import CommonDropdown from '../commondropdown';
import {
  getReasonCategoryListRequestAction,
  getReasonListRequestAction,
  updateStageStatusRequestAction,
} from '../../../features/applications/actions';
import {
  selectReasonCategoryList,
  selectReasonList,
  selectReasonListLoading,
  selectReasonListError,
  selectSelectedApplication,
  selectUpdateStageStatusLoading,
} from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import { ChangeStatusModalProps } from './changestatusmodal.d';
import { useStyles } from './styles';

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
  const styles = useStyles();

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
        <Card style={styles.card}>
          <View style={styles.submodalCard}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
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
                <TextField
                  value={capitalizeFirstLetter(currentLabel) ?? ''}
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
                <View
                  style={[
                    styles.optionSection,
                    styles.reasonSectionMargin,
                    addReason ? styles.optionSectionActive : styles.optionSectionInactive,
                  ]}
                >
                  <View>
                    <View style={styles.optionHeader}>
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
                    <View style={styles.reasonDropdownContainer}>
                      <View style={styles.categoriesContainer}>
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

              <View
                style={[
                  styles.optionSection,
                  emailCandidate ? styles.optionSectionActive : styles.optionSectionInactive,
                ]}
              >
                <View>
                  <View style={styles.optionHeader}>
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
                  <View style={styles.emailFieldsContainer}>
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

export default ChangeStatusModal;
