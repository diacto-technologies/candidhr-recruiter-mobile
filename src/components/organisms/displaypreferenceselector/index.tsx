import React from 'react';
import { View, Pressable, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { checkIcon } from '../../../assets/svg/check';
import Divider from '../../atoms/divider';
import { useStyles } from './styles';
import { ThemeMode } from '../../../features/theme/types';

interface DisplayPreferenceOption {
  value: ThemeMode;
  labelKey: string;
}

const DISPLAY_PREFERENCES: DisplayPreferenceOption[] = [
  { value: 'device', labelKey: 'screens.profile.deviceSettings' },
  { value: 'light', labelKey: 'screens.profile.lightMode' },
  { value: 'dark', labelKey: 'screens.profile.darkMode' },
];

interface DisplayPreferenceSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentThemeMode: ThemeMode;
  onSelectThemeMode: (themeMode: ThemeMode) => void;
}

const DisplayPreferenceSelector: React.FC<DisplayPreferenceSelectorProps> = ({
  visible,
  onClose,
  currentThemeMode,
  onSelectThemeMode,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleThemeSelect = (themeMode: ThemeMode) => {
    onSelectThemeMode(themeMode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              {t('screens.profile.selectDisplayPreference')}
            </Typography>
          </View>

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {DISPLAY_PREFERENCES.map((preference, index) => {
              const isSelected = currentThemeMode === preference.value;
              const isLast = index === DISPLAY_PREFERENCES.length - 1;

              return (
                <View key={preference.value}>
                  <Pressable
                    style={styles.preferenceItem}
                    onPress={() => handleThemeSelect(preference.value)}
                    android_ripple={{ color: colors.gray[100] }}
                  >
                    <Typography
                      variant={isSelected ? 'semiBoldTxtmd' : 'regularTxtmd'}
                      color={isSelected ? colors.gray[900] : colors.gray[700]}
                    >
                      {t(preference.labelKey)}
                    </Typography>
                    {isSelected && (
                      <SvgXml xml={checkIcon} width={20} height={20} />
                    )}
                  </Pressable>
                  {!isLast && <Divider height={1} />}
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DisplayPreferenceSelector;
