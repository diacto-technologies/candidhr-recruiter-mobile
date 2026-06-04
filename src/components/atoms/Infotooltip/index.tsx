import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Modal,
  Pressable,
  UIManager,
  findNodeHandle,
  Dimensions,
} from "react-native";
import Typography from "../typography";
import { colors } from "../../../theme/colors";
import { InfoTooltipProps } from "./infotooltip.d";
import { useStyles, TOOLTIP_WIDTH, GAP, SIDE_PADDING } from "./styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [tooltipHeight, setTooltipHeight] = useState(0);

  const iconRef = useRef<View>(null);
  const hideTimerRef = useRef<any>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showTooltip = () => {
    clearHideTimer();

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
    }, 2000);
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

  const styles = useStyles(position);

  return (
    <View>
      <Pressable
        ref={iconRef}
        onPressIn={showTooltip}
        onPressOut={hideTooltipAfterDelay}
      >
        {children}
      </Pressable>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => {
            clearHideTimer();
            setVisible(false);
          }}
        >
          <View
            onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
            style={styles.tooltipBox}
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

