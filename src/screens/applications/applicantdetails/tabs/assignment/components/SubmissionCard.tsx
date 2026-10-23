import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { showToastMessage } from '../../../../../../utils/toast';
import { SvgXml } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../../../components/atoms/typography';
import Card from '../../../../../../components/atoms/card';
import { colors } from '../../../../../../theme/colors';
import { fileIconWithColor } from '../../../../../../assets/svg/file';
import { downloadIcon } from '../../../../../../assets/svg/download';
import { closeIconSm } from '../../../../../../assets/svg/closeicon';
import {
  AssignmentDeliverableSubmission,
  AssignmentDeliverable,
} from '../../../../../../features/applications/types';
import { useStyles } from '../styles';
import { editIcon } from '../../../../../../assets/svg/edit';
import { globeIcon } from '../../../../../../assets/svg/globe';
import { InfoRow } from '../../../../../../components/molecules/inforow';

interface Props {
  submissions: AssignmentDeliverableSubmission[];
  deliverables?: AssignmentDeliverable[];
  candidateName?: string;
  candidateComments?: string | null;
}

const getCandidateInitials = (name?: string): string => {
  if (!name) return 'C';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const getFirstName = (name?: string): string => {
  if (!name) return 'candidate';
  return name.trim().split(/\s+/)[0] || 'candidate';
};

const stripHtml = (html?: string | null): string => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const getWordCount = (htmlOrText?: string | null): number => {
  if (!htmlOrText) return 0;
  const clean = htmlOrText.replace(/<[^>]*>/g, ' ').trim();
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
};

export const SubmissionCard: React.FC<Props> = React.memo(({
  submissions,
  deliverables,
  candidateName,
  candidateComments,
}) => {
  const styles = useStyles();

  const [selectedTextModal, setSelectedTextModal] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleOpenUrl = useCallback((url?: string | null) => {
    if (!url) {
      Alert.alert('Notice', 'No URL provided.');
      return;
    }
    const targetUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    Linking.canOpenURL(targetUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(targetUrl);
        } else {
          Alert.alert('Error', 'Unable to open link.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open link.');
      });
  }, []);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getMimeTypeFromFilename = useCallback((filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'txt':
        return 'text/plain';
      case 'zip':
        return 'application/zip';
      default:
        return 'application/octet-stream';
    }
  }, []);

  const handleDownload = useCallback(
    async (url?: string | null, suggestedName?: string, deliverableId?: string) => {
      if (!url) {
        showToastMessage('No download link available for this deliverable.', 'error');
        return;
      }

      const fileKey = deliverableId || url;
      setDownloadingId(fileKey);

      try {
        const rawName =
          suggestedName ||
          url.split('?')[0].split('/').pop() ||
          `submission_${Date.now()}`;
        const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const mimeType = getMimeTypeFromFilename(safeName);

        const tempPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${safeName}`;

        const res = await ReactNativeBlobUtil.config({
          path: tempPath,
          fileCache: true,
          overwrite: true,
        }).fetch('GET', url);

        const status = res?.info?.()?.status ?? 0;
        if (status >= 400) {
          throw new Error(`Server returned HTTP ${status}`);
        }

        if (Platform.OS === 'android') {
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: safeName,
              parentFolder: 'CandidHR',
              mimeType,
            },
            'Download',
            tempPath
          );
          showToastMessage(`Saved to Downloads (${safeName})`, 'success');
        } else {
          await Share.open({
            urls: [`file://${tempPath}`],
            type: mimeType,
            saveToFiles: true,
            failOnCancel: false,
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Download failed';
        showToastMessage(`Download failed: ${message}`, 'error');
      } finally {
        setDownloadingId(null);
      }
    },
    [getMimeTypeFromFilename]
  );

  const totalCount = submissions.length;

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.submissionHeaderRow}>
        <View style={styles.submissionTitleRow}>
          <Typography style={styles.submissionTitle} variant="semiBoldTxtlg">
            Submission
          </Typography>
        </View>

        <Typography style={styles.deliverablesCountText}>
          {totalCount} {totalCount === 1 ? 'deliverable' : 'deliverables'}
        </Typography>
      </View>

      {/* Deliverable Items */}
      {submissions.length === 0 ? (
        <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.noSubmissionsText}>
          No deliverables submitted yet.
        </Typography>
      ) : (
        <View style={styles.deliverablesList}>
          {submissions.map((sub, index) => {
            const deliverableDef = deliverables?.find((d) => d.id === sub.deliverable);
            const type = (sub.deliverable_type || deliverableDef?.type || 'file').toLowerCase();

            const title =
              sub.label ||
              deliverableDef?.label ||
              (type === 'url'
                ? 'Primary submission link'
                : type === 'text'
                ? 'Approach & trade-offs write-up'
                : sub.original_filename || `Deliverable ${index + 1}`);

            const plainText = stripHtml(sub.text);
            const wordCount = getWordCount(sub.text);

            const deliverableIcon =
              type === 'url'
                ? globeIcon
                : type === 'text'
                ? editIcon
                : fileIconWithColor();

            const subtitle =
              type === 'url'
                ? sub.url || 'No URL'
                : type === 'text'
                ? `Written response · ${wordCount} ${wordCount === 1 ? 'word' : 'words'}`
                : sub.original_filename || 'Document';

            const rightAction =
              type === 'url' ? (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => handleOpenUrl(sub.url)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Open Link"
                >
                  <Typography style={styles.linkButtonText}>Link</Typography>
                  <Ionicons name="open-outline" size={15} color={colors.gray[700]} />
                </TouchableOpacity>
              ) : type === 'text' ? (
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => setSelectedTextModal({ title, content: plainText })}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Read written response"
                >
                  <Typography style={styles.readButtonText} color={colors.gray[700]}>
                    Read
                  </Typography>
                </TouchableOpacity>
              ) : (
                Boolean(sub.download_url || sub.url) && (
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() =>
                      handleDownload(
                        sub.download_url || sub.url,
                        sub.original_filename || `${title}.pdf`,
                        sub.id || String(index)
                      )
                    }
                    disabled={downloadingId === (sub.id || String(index))}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Download submission"
                  >
                    {downloadingId === (sub.id || String(index)) ? (
                      <ActivityIndicator size="small" color={colors.brand[600]} />
                    ) : (
                      <SvgXml
                        xml={downloadIcon}
                        width={18}
                        height={18}
                        stroke={colors.gray[700]}
                      />
                    )}
                  </TouchableOpacity>
                )
              );

            return (
              <View key={sub.id || index} style={styles.deliverableCard}>
                <InfoRow
                  icon={deliverableIcon}
                  value={title}
                  valueStyle={styles.deliverableTitleText}
                  valueNumberOfLines={1}
                  valueEllipsizeMode="tail"
                  title={subtitle}
                  titleStyle={styles.deliverableSubtitleText}
                  titleNumberOfLines={1}
                  titleEllipsizeMode={type === 'url' ? 'middle' : 'tail'}
                  rightContent={rightAction}
                  height={18}
                  width={18}
                />

                {/* Text Preview for Written Responses */}
                {type === 'text' && Boolean(plainText) && (
                  <Typography
                    style={styles.deliverableTextPreview}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {plainText}
                  </Typography>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Candidate Comments Section */}
      {Boolean(candidateComments) && (
        <View>
          <View style={styles.candidateCommentDivider} />

          <View style={styles.candidateCommentContainer}>
            <View style={styles.candidateAvatar}>
              <Typography style={styles.candidateAvatarText}>
                {getCandidateInitials(candidateName)}
              </Typography>
            </View>

            <View style={styles.candidateCommentMeta}>
              <View style={styles.candidateCommentNameRow}>
                <Typography style={styles.candidateCommentName}>
                  {candidateName}
                </Typography>
                <Typography style={styles.candidateCommentNoteLabel}>
                  Note from {getFirstName(candidateName)}
                </Typography>
              </View>

              <View style={styles.candidateCommentBubble}>
                <Typography style={styles.candidateCommentBubbleText} color={colors.base.white}>
                  {candidateComments}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Read Written Response Modal */}
      {selectedTextModal !== null && (
        <Modal
          visible={Boolean(selectedTextModal)}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedTextModal(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedTextModal(null)}>
            <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeaderRow}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={1}>
                  {selectedTextModal.title}
                </Typography>
                <TouchableOpacity
                  onPress={() => setSelectedTextModal(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <SvgXml xml={closeIconSm(colors.gray[600])} width={20} height={20} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScrollBody}>
                <Typography variant="regularTxtsm" color={colors.gray[800]} style={styles.modalExplanationText}>
                  {selectedTextModal.content}
                </Typography>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Card>
  );
});
