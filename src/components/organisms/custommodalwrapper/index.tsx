import React, { useCallback, useMemo } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Typography from '../../atoms/typography'
import { colors } from '../../../theme/colors'
import { screenWidth } from '../../../utils/constants'
import { windowHeight } from '../../../utils/devicelayout'

export type CustomModalWrapperProps = {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string,
  subTitle?:string,
  showCloseButton?: boolean
  closeOnBackdropPress?: boolean
  animationType?: 'none' | 'slide' | 'fade'
  maxContentWidth?: number
  scrollable?: boolean
  maxBodyHeight?: number
}

const HEADER_HEIGHT = 48
const H_PADDING = 16

/** ScrollView / static body inset; footer can use `-marginHorizontal` of this value to span full modal width. */
export const CUSTOM_MODAL_SCROLL_CONTENT_PADDING = 16

const CustomModalWrapper: React.FC<CustomModalWrapperProps> = ({
  visible,
  onClose,
  children,
  title,
  subTitle,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
  maxContentWidth = Math.min(900, screenWidth - 32),
  scrollable = true,
  maxBodyHeight: maxBodyHeightProp,
}) => {
  const insets = useSafeAreaInsets()

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) {
      onClose()
    }
  }, [closeOnBackdropPress, onClose])

  const hasHeader = (title != null && title !== '') || showCloseButton

  const maxCardHeight = useMemo(() => {
    const vSpace = windowHeight - insets.top - insets.bottom - H_PADDING * 2
    return Math.min(windowHeight * 0.9, Math.max(280, vSpace))
  }, [insets.top, insets.bottom])

  const scrollAreaMaxHeight = useMemo(() => {
    if (maxBodyHeightProp != null) {
      return maxBodyHeightProp
    }
    const h = hasHeader ? maxCardHeight - HEADER_HEIGHT : maxCardHeight
    return Math.max(200, h)
  }, [maxBodyHeightProp, hasHeader, maxCardHeight])

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.root} pointerEvents="box-none">
          <Pressable
            style={[StyleSheet.absoluteFill, styles.backdropDim]}
            onPress={handleBackdropPress}
            accessibilityLabel="Close dialog"
            accessibilityRole="button"
          />
          <View
            style={[
              styles.cardWrap,
              {
                paddingTop: insets.top + 8,
                paddingBottom: insets.bottom + 8,
                paddingHorizontal: H_PADDING,
              },
            ]}
            pointerEvents="box-none"
          >
            <View
              style={[styles.card, { maxWidth: maxContentWidth, maxHeight: maxCardHeight }]}
            >
              <View style={styles.subcard}>
              {hasHeader ? (
                <View style={styles.header}>
                  <View>
                  {title != null && title !== '' ? (
                    <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.title}>
                      {title}
                    </Typography>
                    
                  ) : (
                    <View style={styles.titleSpacer} />
                  )}
                  {subTitle != null && subTitle !== '' ? (
                  <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.title}>
                      {subTitle}
                    </Typography>
                  ) : null}
                    </View>
                    <View>
                    <Pressable
                      onPress={onClose}
                      hitSlop={12}
                      style={styles.closeBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                    >
                      <Ionicons name="close" size={24} color={colors.gray[400]} />
                    </Pressable>
                    </View>
                </View>
              ) : null}
              {scrollable ? (
                <ScrollView
                  style={{ maxHeight: scrollAreaMaxHeight }}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  nestedScrollEnabled
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={styles.bodyStatic}>{children}</View>
              )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  backdropDim: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  cardWrap: {
    width: '100%',
    alignItems: 'center',
    maxHeight: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.base.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth:1,
    borderColor:colors.gray[200],
    padding:4
  },
  subcard: {
    paddingTop: 16,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: colors.gray[200],
    flexShrink: 1,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingLeft: 16,
    paddingRight: 8,
    minHeight: HEADER_HEIGHT,
  },
  title: {
    flex: 1,
  },
  titleSpacer: {
    flex: 1,
  },
  closeBtn: {
    paddingRight: 8,
  },
  scrollContent: {
    padding: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    paddingTop: 12,
  },
  bodyStatic: {
    padding: CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
  },
})

export default CustomModalWrapper
