import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SvgXml } from 'react-native-svg';

import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import { downloadIcon } from '../../../assets/svg/download';
import { showToastMessage } from '../../../utils/toast';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permission.constants';
import { ResumeModalProps } from './resumemodal.d';
import { useStyles } from './styles';

const ResumeModal: React.FC<ResumeModalProps> = ({
  visible,
  resumeUrl,
  onClose,
  candidateName = 'Candidate',
}) => {
  const { can } = usePermission();
  const canDownloadResume = can(PERMISSIONS.DOWNLOAD_RESUME_FILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    if (visible && resumeUrl) {
      downloadPDF();
    }
  }, [visible, resumeUrl]);

  // 📥 Download into cache (stable path → avoids ENOENT)
  const downloadPDF = async () => {
    try {
      setLoading(true);
      setError(null);

      const filename = 'resume.pdf';
      const path = `${RNFS.CachesDirectoryPath}/${filename}`;

      await RNFS.downloadFile({
        fromUrl: resumeUrl!,
        toFile: path,
      }).promise;

      setPdfPath(path);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load PDF. Please try again.');
      setLoading(false);
      console.log('PDF Load Error:', err);
    }
  };

  // 📥 Download to device's Download folder
  const handleDownload = async () => {
    if (!resumeUrl && !pdfPath) return;

    try {
      setDownloading(true);

      const safeCandidateName = (candidateName || 'Candidate')
        .trim()
        .replace(/[^a-z0-9-_ ]/gi, '')
        .replace(/\s+/g, '_');
      const fileName = `Resume_${safeCandidateName}_${Date.now()}.pdf`;

      const sourcePath = pdfPath || `${RNFS.CachesDirectoryPath}/resume.pdf`;
      const exists = await RNFS.exists(sourcePath);

      if (!exists && resumeUrl) {
        await RNFS.downloadFile({
          fromUrl: resumeUrl,
          toFile: sourcePath,
        }).promise;
      }

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,
            parentFolder: 'Download',
            mimeType: 'application/pdf',
          },
          'Download',
          sourcePath
        );
        showToastMessage('Resume saved to Downloads', 'success');
      } else {
        const fileUrl = sourcePath.startsWith('file://') ? sourcePath : `file://${sourcePath}`;
        await Share.open({
          urls: [fileUrl],
          type: 'application/pdf',
          saveToFiles: true,
          failOnCancel: false,
        });
      }
    } catch (err: any) {
      if (err?.message !== 'User did not share') {
        showToastMessage('Unable to download resume', 'error');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Resume
              </Typography>
              {pageCount > 0 && (
                <Typography variant="regularTxtxs" color={colors.gray[600]}>
                  Page {currentPage} of {pageCount}
                </Typography>
              )}
            </View>

            <View style={styles.headerRight}>
              {canDownloadResume && (
                <TouchableOpacity
                  onPress={handleDownload}
                  disabled={downloading}
                  style={{ padding: 6, marginRight: 8 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color={colors.brand[600]} />
                  ) : (
                    <SvgXml
                      xml={downloadIcon}
                      width={22}
                      height={22}
                      color={colors.gray[700]}
                    />
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-outline" size={26} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* PDF Area */}
          <View style={styles.pdfContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand[600]} />
                <Typography>Loading resume…</Typography>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Typography>{error}</Typography>

                <Button
                  onPress={downloadPDF}
                  variant="contain"
                  size={40}
                >
                  Retry
                </Button>
              </View>
            )}

            {!loading && pdfPath && !error && (
              <Pdf
                source={{ uri: `file://${pdfPath}` }}
                onLoadComplete={(pages) => setPageCount(pages)}
                onPageChanged={(p) => setCurrentPage(p)}
                style={styles.pdf}
                enablePaging
              />
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ResumeModal;
