import React, { useState, useEffect, useMemo, FC } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import FooterButtons from '../../molecules/footerbuttons';
import Card from '../../atoms/card';
import { closeIcon } from '../../../assets/svg/closeicon';
import { TextField } from '../../atoms/textfield';
import CommonDropdown from '../commondropdown';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  getEmailTemplatesListRequestAction,
  previewEmailTemplateRequestAction,
  clearEmailTemplatePreviewAction,
  sendEmailRequestAction,
} from '../../../features/applications/actions';
import {
  selectEmailTemplates,
  selectEmailTemplatesLoading,
  selectEmailTemplatePreview,
  selectSendEmailLoading,
  selectSendEmailSuccess,
} from '../../../features/applications/selectors';
import { resetSendEmailState } from '../../../features/applications/slice';
import { SendEmailModalProps } from './sendemailmodal.d';
import { useStyles } from './styles';

const EMAIL_TOKENS = [
  '{{candidate_name}}',
  '{{job_title}}',
  '{{application_status}}',
  '{{stage_status}}',
  '{{company}}',
];

const SendEmailModal: FC<SendEmailModalProps> = ({
  visible,
  onClose,
  applicationId,
  candidateName = '',
  candidateEmail = '',
  jobTitle,
  status,
  initialSubject,
  initialMessage,
}) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const defaultSubject = initialSubject || (jobTitle ? `Update on your application for ${jobTitle}` : 'Update on your application for {{job_title}}');
  const defaultMessage = initialMessage || 'Hi {{candidate_name}},\n\nYour application status has been updated to "{{application_status}}".\n\nThanks,\n{{company}}';

  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState<string | null>(null);

  const emailTemplates = useAppSelector(selectEmailTemplates);
  const emailTemplatesLoading = useAppSelector(selectEmailTemplatesLoading);
  const emailTemplatePreview = useAppSelector(selectEmailTemplatePreview);
  const sendEmailLoading = useAppSelector(selectSendEmailLoading);
  const sendEmailSuccess = useAppSelector(selectSendEmailSuccess);

  useEffect(() => {
    if (visible) {
      dispatch(resetSendEmailState());
      dispatch(getEmailTemplatesListRequestAction(status || ''));
    }
  }, [visible, status, dispatch]);

  useEffect(() => {
    if (emailTemplatePreview) {
      setSubject(emailTemplatePreview.subject || '');
      setMessage(emailTemplatePreview.body || '');
    }
  }, [emailTemplatePreview]);

  const resetForm = () => {
    setSelectedEmailTemplateId(null);
    dispatch(clearEmailTemplatePreviewAction());
    setSubject(defaultSubject);
    setMessage(defaultMessage);
  };

  const handleClose = () => {
    resetForm();
    dispatch(resetSendEmailState());
    onClose();
  };

  // Close modal after successful email send
  useEffect(() => {
    if (sendEmailSuccess) {
      handleClose();
    }
  }, [sendEmailSuccess]);

  const handleSendEmail = () => {
    if (!subject.trim() || !message.trim() || !applicationId || sendEmailLoading) return;

    dispatch(
      sendEmailRequestAction({
        application_id: applicationId,
        subject: subject.trim(),
        message: message.trim(),
      })
    );
  };

  const isSendDisabled = !subject.trim() || !message.trim() || sendEmailLoading;

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
                    Send email
                  </Typography>
                  {candidateName ? (
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      {candidateName}{candidateEmail ? ` · ${candidateEmail}` : ''}
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
              <View style={styles.emailFieldsContainer}>
                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  Use template (optional)
                </Typography>
                <CommonDropdown
                  placeholder="Use template (optional)"
                  options={[
                    ...(selectedEmailTemplateId ? [{ id: 'clear', name: 'Clear template' }] : []),
                    ...(emailTemplates || []),
                  ]}
                  multilineOptions={true}
                  labelKey="name"
                  valueKey="id"
                  value={selectedEmailTemplateId}
                  disabled={emailTemplatesLoading}
                  onChange={(value, item) => {
                    if (item?.id === 'clear' || value === 'clear') {
                      setSelectedEmailTemplateId(null);
                      setSubject(defaultSubject);
                      setMessage(defaultMessage);
                      dispatch(clearEmailTemplatePreviewAction());
                    } else if (item?.id || value) {
                      const id = String(item?.id || value);
                      setSelectedEmailTemplateId(id);
                      if (applicationId) {
                        dispatch(
                          previewEmailTemplateRequestAction({
                            template_id: id,
                            application_id: applicationId,
                          })
                        );
                      }
                    }
                  }}
                />

                {selectedEmailTemplateId == null && (
                  <>
                    <View style={styles.requiredLabelRow}>
                      <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                        Subject{' '}
                      </Typography>
                      <Typography variant="regularTxtsm" color={colors.error[500]}>
                        *
                      </Typography>
                    </View>

                    <TextField
                      value={subject}
                      onChangeText={(text) => {
                        setSubject(text);
                      }}
                      placeholder="Subject"
                      style={styles.input}
                      size="Medium"
                      multiline
                    />
                  </>
                )}

                <View style={styles.requiredLabelRow}>
                  <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                    Message{' '}
                  </Typography>
                  <Typography variant="regularTxtsm" color={colors.error[500]}>
                    *
                  </Typography>
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
            </ScrollView>

            <FooterButtons
              footerStyle={{ paddingBottom: 16 }}
              leftButtonProps={{
                children: 'Cancel',
                variant: 'outline',
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
                children: sendEmailLoading ? 'Sending…' : 'Send email',
                variant: 'contain',
                size: 44,
                buttonColor: colors.brand[600],
                textColor: colors.base.white,
                borderColor: colors.base.white,
                borderRadius: 8,
                onPress: handleSendEmail,
                disabled: isSendDisabled,
              }}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SendEmailModal;
