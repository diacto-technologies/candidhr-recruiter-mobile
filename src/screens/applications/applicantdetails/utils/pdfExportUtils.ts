import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const exportApplicationPdf = async (
  html: string,
  candidateName: string,
  applicationId: string
): Promise<void> => {
  if (!html) throw new Error("Empty HTML provided to PDF exporter.");

  const safeCandidateName = (candidateName || 'Candidate')
    .trim()
    .replace(/[^a-z0-9-_ ]/gi, '')
    .replace(/\s+/g, '_');

  const baseFileName = `Application_${safeCandidateName}_${String(applicationId).slice(-6)}_${Date.now()}`;

  const result = await generatePDF({
    html,
    fileName: baseFileName,
    ...(Platform.OS === 'ios' ? { directory: 'Documents' as const } : {}),
    width: 595,
    height: 842,
    ...(Platform.OS === 'android' ? { shouldPrintBackgrounds: true } : {}),
  });

  const rawPath =
    (result as { filePath?: string }).filePath ??
    (result as { file_path?: string }).file_path ??
    '';
  const pdfPath = rawPath.startsWith('file://') ? rawPath.slice('file://'.length) : rawPath;

  if (!pdfPath) {
    throw new Error('PDF generation returned no file path.');
  }

  if (Platform.OS === 'ios') {
    const exists = await RNFS.exists(pdfPath);
    if (!exists) {
      throw new Error('PDF was not written successfully.');
    }
    const fileUrl = pdfPath.startsWith('file://') ? pdfPath : `file://${pdfPath}`;
    await Share.open({
      urls: [fileUrl],
      type: 'application/pdf',
      saveToFiles: true,
      failOnCancel: false,
    });
    return;
  }

  if (Platform.OS === 'android') {
    const outName = `${baseFileName}.pdf`;
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: outName,
        parentFolder: 'CandidHR',
        mimeType: 'application/pdf',
      },
      'Download',
      pdfPath
    );
    try {
      await RNFS.unlink(pdfPath);
    } catch {
      /* ignore cleanup errors */
    }
  }
};
