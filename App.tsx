import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastMessageProvider } from './src/components/organisms/toastmessage';

// ⭐ Disable phone default font scaling for entire app
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  allowFontScaling: false,
};

const AppContent = () => {
  const theme = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Navigation />
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <PaperProvider>
              <ToastMessageProvider>
                <Navigation />
              </ToastMessageProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#303030',
  },
});

export default App;
