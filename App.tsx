import React from 'react';
import { Text, TextInput } from 'react-native';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastMessageProvider } from './src/components/organisms/toastmessage';
import { NetworkConnectivityBridge } from './src/hooks/useNetworkConnectivity';
import * as Sentry from '@sentry/react-native';
import { initSentry } from './src/utils/sentry';

// Initialize Sentry for crash reporting, performance tracing and profiling
initSentry();

// ⭐ Disable phone default font scaling for entire app
(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  allowFontScaling: false,
};

const App = () => {
  // To test Sentry error capturing, uncomment the line below:
  // React.useEffect(() => { throw new Error("Sentry Test JS Error"); }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <PaperProvider>
              <ToastMessageProvider>
                <NetworkConnectivityBridge />
                <Navigation />
              </ToastMessageProvider>
            </PaperProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
