import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import { IBottomsheet } from './bottomsheet';
import IconButton from '../../atoms/iconbutton';
import { useStyles } from './styles';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { screenHeight } from '../../../utils/devicelayout';

const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  subTitle,
  showHeadline,
}: IBottomsheet) => {
  const { insetsTop } = useRNSafeAreaInsets();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    } else {
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const isClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* {visible &&
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
            } */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => {
          isClose();
        }}
      >
        <View style={styles.closeIcon}>
          <TouchableOpacity
            style={styles.touchableMask}
            activeOpacity={1}
            onPress={() => {
              isClose();
            }}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.sheetContainer, { maxHeight: screenHeight - (insetsTop + 20) }]}
          >
            <View style={{
              flex: 1, 
              marginTop: 5,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              paddingTop: 10,
              marginHorizontal: 5,
              borderColor:colors.mainColors.borderColor
            }}>
              <Pressable style={{ width: 40, borderWidth: 2, borderRadius: 8, borderColor: '#E9EAEB', alignSelf: 'center' }} onPress={onClose}></Pressable>
              <View style={styles.header}>
                <View style={styles.touchableMask}>
                  {title && showHeadline ? (
                    <Typography variant="H1" color={colors.common.black}>
                      {title}
                    </Typography>
                  ) : (
                    <Typography variant="P2" color={colors.grayScale.grayDark}>
                      {title}
                    </Typography>
                  )}
                  {subTitle && (
                    <Typography variant="P2" style={styles.subTitle}>
                      {subTitle}
                    </Typography>
                  )}
                </View>
                {/* <IconButton
                onPress={() => {
                  isClose();
                }}
                size={24}
                variant="text"
              >
                <Ionicons name="close-outline" size={20} />
              </IconButton> */}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Typography variant="H4" color={colors.neutrals.red}>Clear all</Typography>
                </View>
              </View>
            </View>
            {children}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </Fragment>
  );
};

export default BottomSheet;
