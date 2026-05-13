import { RefObject } from 'react';
import { Share, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

/**
 * Renders `viewRef` to a temporary image and opens the system share sheet.
 */
export async function captureAndShareView(
  viewRef: RefObject<View | null>,
  options?: { dialogTitle?: string }
): Promise<void> {
  const target = viewRef.current;
  if (!target) {
    return;
  }
  const uri = await captureRef(target, {
    format: 'png',
    quality: 0.92,
    fileName: 'snapshot',
  });
  await Share.share({
    url: uri,
    title: options?.dialogTitle,
    message: options?.dialogTitle ?? '',
  });
}
