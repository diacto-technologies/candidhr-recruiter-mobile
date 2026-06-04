import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import { IBottomsheet } from './bottomsheet';
import { useStyles } from './styles';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { screenHeight as staticScreenHeight } from '../../../utils/devicelayout';

const BottomSheet = ({
  visible,
  onClose,
  children,
  title,
  subTitle,
  showHeadline,
  onClearAll,
  hight
}: IBottomsheet) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { insetsTop } = useRNSafeAreaInsets();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyles();

  const isLandscape = windowWidth > windowHeight;
  let SHEET_HEIGHT = windowHeight * 0.8;

  if (hight) {
    if (isLandscape) {
      SHEET_HEIGHT = Math.min(hight, windowHeight * 0.8);
    } else {
      const designBase = staticScreenHeight;
      const currentBase = windowHeight;
      SHEET_HEIGHT = hight * (currentBase / designBase);
      SHEET_HEIGHT = Math.min(SHEET_HEIGHT, windowHeight * 0.85);
    }
  }


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
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <View style={styles.closeIcon}>
          <TouchableOpacity
            style={styles.touchableMask}
            activeOpacity={1}
            onPress={() => isClose()}
          />
          <View
            style={[styles.sheetContainer, {height: SHEET_HEIGHT, paddingBottom: insetsTop > 0 ? 6 : 0 }]}
          >
            <View style={{
              paddingTop: 12,
              gap: 16,
              paddingBottom: 16,
              borderLeftWidth:2,
              borderRightWidth:2,
              borderTopWidth:2,
              marginHorizontal:6,
              marginTop:6,
              borderTopRightRadius:16,
              borderTopLeftRadius:16,
              borderColor:colors.gray[200]
            }}>
              <View style={styles.dragHandle} />
              <View style={styles.header}>
                <View style={styles.touchableMask}>
                  {title && showHeadline ? (
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      {title}
                    </Typography>
                  ) : (
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                      {title}
                    </Typography>
                  )}
                  {subTitle && (
                    <Typography variant="semiBoldTxtmd" style={styles.subTitle}>
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
                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => onClearAll?.()}>
                  <Typography variant="semiBoldTxtsm" color={colors.error[600]}>Clear all</Typography>
                </TouchableOpacity>
              </View>
            </View>
            {children}
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default BottomSheet;
