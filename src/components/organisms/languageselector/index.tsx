import React from 'react';
import { View, Pressable, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { checkIcon } from '../../../assets/svg/check';
import Divider from '../../atoms/divider';
import { useStyles } from './styles';
import { SUPPORTED_LANGUAGES } from '../../../config/languages';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (languageCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleLanguageSelect = (languageCode: string) => {
    onSelectLanguage(languageCode);
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
              {t('screens.profile.selectLanguage')}
            </Typography>
          </View>

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {SUPPORTED_LANGUAGES.map((language, index) => {
              const isSelected = currentLanguage === language.code;
              const isLast = index === SUPPORTED_LANGUAGES.length - 1;

              return (
                <View key={language.code}>
                  <Pressable
                    style={styles.languageItem}
                    onPress={() => handleLanguageSelect(language.code)}
                    android_ripple={{ color: colors.gray[100] }}
                  >
                    <Typography
                      variant={isSelected ? 'semiBoldTxtmd' : 'regularTxtmd'}
                      color={isSelected ? colors.gray[900] : colors.gray[700]}
                    >
                      {language.label}
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

export default LanguageSelector;
