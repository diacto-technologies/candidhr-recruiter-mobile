import { Linking, Platform } from 'react-native';

export const openExternalLink = async (url: string | null | undefined) => {
  if (!url) return;

  let finalUrl = url.trim();
  if (!finalUrl.startsWith('http')) {
    finalUrl = `https://${finalUrl}`;
  }

  if (Platform.OS === 'android') {
    const browserUrl = `intent://${finalUrl.replace(
      /^https?:\/\//,
      ''
    )}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;

    try {
      await Linking.openURL(browserUrl);
      return;
    } catch (e) {
      // Fall through to regular URL
    }
  }

  try {
    const encodedUrl = encodeURI(finalUrl);
    const supported = await Linking.canOpenURL(encodedUrl);
    
    if (supported) {
      await Linking.openURL(encodedUrl);
    } else {
      // Fallback to unencoded or just try opening it anyway
      await Linking.openURL(finalUrl);
    }
  } catch (error) {
    // Silently fail
  }
};
