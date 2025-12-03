import { View, Text, TextInput, useColorScheme} from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './src/navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors';
import StatusBar from './src/components/atoms/statusbar';

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
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            {/* <SafeAreaView style={{ flex: 1, backgroundColor: colors.common.white }}>  */}
            {/* <StatusBar showWhite/> */}
            <Navigation />
            {/* </SafeAreaView>  */}
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
