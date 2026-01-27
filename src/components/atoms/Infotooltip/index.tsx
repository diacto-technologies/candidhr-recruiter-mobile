import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  UIManager,
  findNodeHandle,
  Dimensions,
} from "react-native";
import Typography from "../typography";
import { colors } from "../../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TOOLTIP_WIDTH = 260;
const GAP = 8;
const SIDE_PADDING = 10;

const InfoTooltip = ({ text, children }: any) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [tooltipHeight, setTooltipHeight] = useState(0);

  const iconRef = useRef<View>(null);
  const hideTimerRef = useRef<any>(null); // ✅ timer ref

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showTooltip = () => {
    clearHideTimer(); // ✅ if already scheduled to hide, cancel it

    const handle = findNodeHandle(iconRef.current);
    if (!handle) return;

    UIManager.measureInWindow(handle, (x, y, w, h) => {
      setPos({ x, y, w, h });
      setVisible(true);
    });
  };

  const hideTooltipAfterDelay = () => {
    clearHideTimer();

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 2000); // ✅ 3 sec
  };

  const position = useMemo(() => {
    let left = pos.x + pos.w / 2 - TOOLTIP_WIDTH / 2;

    if (left < SIDE_PADDING) left = SIDE_PADDING;

    if (left + TOOLTIP_WIDTH > SCREEN_WIDTH - SIDE_PADDING) {
      left = SCREEN_WIDTH - TOOLTIP_WIDTH - SIDE_PADDING;
    }

    let top = pos.y - 60;

    if (tooltipHeight > 0) {
      const aboveTop = pos.y - tooltipHeight - GAP;
      const belowTop = pos.y + pos.h + GAP;

      top = aboveTop > SIDE_PADDING ? aboveTop : belowTop;
    }

    return { left, top };
  }, [pos, tooltipHeight]);

  return (
    <View>
      <Pressable
        ref={iconRef}
        onPressIn={showTooltip}            // ✅ show immediately like hover
        onPressOut={hideTooltipAfterDelay} // ✅ hide after 3 sec
      >
        {children}
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        {/* If user taps outside → close immediately */}
        <Pressable
          style={styles.overlay}
          onPress={() => {
            clearHideTimer();
            setVisible(false);
          }}
        >
          <View
            onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
            style={[
              styles.tooltipBox,
              { top: position.top, left: position.left },
            ]}
          >
            <Typography variant="regularTxtxs" color={colors.base.white}>
              {text}
            </Typography>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default InfoTooltip;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  tooltipBox: {
    position: "absolute",
    width: TOOLTIP_WIDTH,
    backgroundColor: "#1F2937",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
