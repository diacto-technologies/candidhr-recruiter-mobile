import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';

import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/typography';
import IconButton from '../../atoms/iconbutton';
import Button from '../../atoms/button';
import { colors } from '../../../theme/colors';
import { screenWidth, screenHeight } from '../../../utils/devicelayout';

interface ResumeModalProps {
  visible: boolean;
  resumeUrl: string | null;
  onClose: () => void;
  candidateName?: string;
}

const ResumeModal: React.FC<ResumeModalProps> = ({
  visible,
  resumeUrl,
  onClose,
  candidateName = 'Candidate',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);

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


  // 📥 Download to device + Share
  const handleDownload = async () => {
    if (!resumeUrl) return;

    try {
      setDownloading(true);

      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
      }

      const downloadPath =
        Platform.OS === 'ios'
          ? `${RNFS.DocumentDirectoryPath}/resume.pdf`
          : `${RNFS.DownloadDirectoryPath}/resume.pdf`;

      await RNFS.downloadFile({
        fromUrl: resumeUrl,
        toFile: downloadPath,
      }).promise;

      await Share.open({
        url: `file://${downloadPath}`,
        type: 'application/pdf',
        showAppsToView: true,
      });

      Alert.alert('Success', 'Resume downloaded successfully');
    } catch (err) {
      Alert.alert('Download Failed', 'Unable to download resume.');
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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Button
                onPress={handleDownload}
                disabled={downloading}
                variant="outline"
                size={36}
              >
                {downloading ? 'Downloading...' : 'Download'}
              </Button> */}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-outline" size={26} />
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  modalContent: {
    width: screenWidth,
    height: screenHeight * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    width: screenWidth,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResumeModal;
