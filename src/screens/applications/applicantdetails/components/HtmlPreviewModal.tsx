import React from 'react';
import { View, Modal, TouchableOpacity, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface HtmlPreviewModalProps {
  visible: boolean;
  htmlPreview: string;
  mountKey: number;
  onClose: () => void;
  onError: (msg: string) => void;
}

export const HtmlPreviewModal: React.FC<HtmlPreviewModalProps> = ({
  visible,
  htmlPreview,
  mountKey,
  onClose,
  onError,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {visible && htmlPreview ? (
          <WebView
            key={mountKey}
            originWhitelist={['*']}
            source={{ html: htmlPreview, baseUrl: '' }}
            style={{ flex: 1, backgroundColor: '#fff' }}
            javaScriptEnabled
            domStorageEnabled={Platform.OS === 'android'}
            mixedContentMode="always"
            setBuiltInZoomControls={false}
            onError={(ev) => {
              if (__DEV__) {
                console.warn('WebView preview error', ev.nativeEvent);
              }
              onError('Preview failed to load in the browser view.');
            }}
          />
        ) : null}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: Platform.OS === 'android' ? 14 : 52,
            right: 16,
            backgroundColor: '#111827',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 999,
            zIndex: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
