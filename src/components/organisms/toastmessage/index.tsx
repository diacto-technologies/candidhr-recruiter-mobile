import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { ToastPosition, ToastVariant, ShowOptions, ToastContextValue } from './toastmessage';
import Typography from '../../atoms/typography';
import { infoIcon } from '../../../assets/svg/infoicon';
import { errorIcon } from '../../../assets/svg/error';
import { warningIcon } from '../../../assets/svg/warning';
import { successIcon } from '../../../assets/svg/success';
import { setGlobalToast } from '../../../utils/toast';

const ToastContext = createContext<ToastContextValue | null>(null);
export function useToastToastMessage() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastMessageProvider />');
  return ctx;
}

export function ToastMessageProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const [opts, setOpts] = useState<Required<ShowOptions>>(() => ({
    message: '',
    position: 'bottom',
    animatedPosition: true,
    duration: 2000,
    edgeOffset: 24,
    maxWidth: '92%',
    containerStyle: {},
    toastStyle: {},
    textStyle: {},
    dismissOnPress: true,
    variant: 'success',
  }));

  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const animateIn = useCallback(
    (position: ToastPosition, animatedPosition: boolean) => {
      const startY = position === 'top' ? -20 : 20;
      translate.setValue(animatedPosition ? startY : 0);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: animatedPosition ? 220 : 0,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    },
    [opacity, translate],
  );

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(translate, {
        toValue: opts.position === 'top' ? -10 : 10,
        duration: opts.animatedPosition ? 160 : 0,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(({ finished }) => {
      if (finished) setVisible(false);
    });
  }, [opts.position, opts.animatedPosition, opacity, translate]);

  const showToast = useCallback(
    (input: ShowOptions | string) => {
      const next = typeof input === 'string' ? { message: input } : input;
      const merged: Required<ShowOptions> = {
        ...opts,
        ...next,
        message: typeof input === 'string' ? input : next.message,
        position: next.position ?? opts.position,
        animatedPosition: next.animatedPosition ?? opts.animatedPosition,
        duration: next.duration ?? opts.duration,
        edgeOffset: next.edgeOffset ?? opts.edgeOffset,
        // maxWidth: next.maxWidth ?? opts.maxWidth,
        containerStyle: next.containerStyle ?? opts.containerStyle,
        toastStyle: next.toastStyle ?? opts.toastStyle,
        textStyle: next.textStyle ?? opts.textStyle,
        dismissOnPress: next.dismissOnPress ?? opts.dismissOnPress,
        variant: next.variant ?? 'success',
      };

      clearTimer();
      setOpts(merged);
      setVisible(true);
      animateIn(merged.position, merged.animatedPosition);

      if (merged.duration > 0) {
        timerRef.current = setTimeout(() => {
          animateOut();
        }, merged.duration);
      }
    },
    [opts, animateIn, animateOut],
  );

  // Set up global toast reference
  useEffect(() => {
    // Create a wrapper function that accepts message and variant
    const globalToastWrapper = (message: string, variant: ToastVariant = 'error') => {
      showToast({ message, variant });
    };
    
    setGlobalToast(globalToastWrapper);
  }, [showToast]);

  const hideToast = useCallback(() => {
    clearTimer();
    animateOut();
  }, [animateOut]);

  useEffect(() => () => clearTimer(), []);

  const safeTop = Platform.select({ android: StatusBar.currentHeight ?? 0, ios: 0 }) || 0;

  const wrapperStyle: ViewStyle = useMemo(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      paddingHorizontal: 16,
      ...(opts.position === 'top' && {
        top: insets.top + 5,
      }),
      ...(opts.position === 'bottom' && {
        bottom: insets.bottom || 20,
      }),
    };
  }, [opts.position, opts.edgeOffset, safeTop]);

  // --- Variant colors & icons ---
  const variantStyles: Record<
    ToastVariant,
    { svg: string; bg: string; border: string; color: string; icon: string }
  > = {
    success: {
      svg: successIcon,
      bg: '#FFFFFF',
      border: '#15803d',
      color: '#166534',
      icon: 'checkmark-circle',
    },
    info: {
      svg: infoIcon,
      bg: '#E7F2FD',
      border: '#0284c7',
      color: '#075985',
      icon: 'information-circle',
    },
    error: {
      svg: errorIcon,
      bg: '#FEEBEB',
      border: '#b91c1c',
      color: '#7f1d1d',
      icon: 'close-circle',
    },
    warning: {
      svg: warningIcon,
      bg: '#FFF6EB',
      border: '#ca8a04',
      color: '#713f12',
      icon: 'warning',
    },
  };

  const variant = variantStyles[opts.variant];

  return (
    <ToastContext.Provider value={{ showToast, hideToast, isVisible: visible }}>
      {children}
      {visible ? (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback onPress={opts.dismissOnPress ? hideToast : undefined}>
            <Animated.View
              style={[wrapperStyle, { opacity, transform: [{ translateY: translate }] }]}
            >
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: variant.bg,
                    borderColor: variant.border,
                    gap: 8,
                  },
                  opts.toastStyle,
                ]}
              >
                <SvgXml xml={variant.svg} />
                <Typography
                  numberOfLines={3}
                  variant="P3C"
                  color={variant.color}
                  style={{ flex: 1, ...opts.textStyle }}
                >
                  {opts.message || "Can't process your request. Please try again later"}
                </Typography>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1.2,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
