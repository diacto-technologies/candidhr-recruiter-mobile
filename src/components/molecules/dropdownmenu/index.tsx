import React from 'react';
import {
  Modal,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { dropdownMenuStyles } from './styles';

/** Applies dynamic color to SVG XML (stroke and fill, keeps fill="none") */
function applySvgColor(xml: string, color: string): string {
  return xml
    .replace(/\bstroke=["'][^"']*["']/g, `stroke="${color}"`)
    .replace(/\bfill=["'](?!none["'])[^"']*["']/g, `fill="${color}"`);
}

export interface DropdownMenuItem {
  label: string;
  icon: string;
  onPress: () => void;
  closeOnPress?: boolean;
  iconColor?: string;
  labelColor?: string;
}

export interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  position: { left: number; top: number };
  items: DropdownMenuItem[];
  renderContent?: () => React.ReactNode;
  width?: number;
  iconWidth?: number;
  iconHight?: number;
  dropdownStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  position,
  items,
  renderContent,
  width = 140,
  iconWidth = 16,
  iconHight = 16,
  dropdownStyle,
  itemStyle,
  textStyle,
  iconStyle,
  iconColor,
}) => {
  if (!visible) return null;

  const flattenedTextStyle =
    textStyle != null ? StyleSheet.flatten(textStyle) : undefined;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={dropdownMenuStyles.modalRoot}>
        <Pressable
          style={[StyleSheet.absoluteFillObject, dropdownMenuStyles.backdropDim]}
          onPress={onClose}
          accessibilityLabel="Dismiss menu"
        />
        <Pressable
          style={[
            dropdownMenuStyles.dropdown,
            {
              left: position.left,
              top: position.top,
              width,
            },
            dropdownStyle,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {renderContent ? (
            <View>{renderContent()}</View>
          ) : (
            items.map((item, index) => (
              <Pressable
                key={index}
                style={[dropdownMenuStyles.dropdownItem, itemStyle]}
                onPress={() => {
                  item.onPress();
                  if (item.closeOnPress !== false) {
                    onClose();
                  }
                }}
              >
                <SvgXml
                  xml={
                    item.iconColor ?? iconColor
                      ? applySvgColor(item.icon, item.iconColor ?? iconColor!)
                      : item.icon
                  }
                  style={[dropdownMenuStyles.dropdownItemIcon, iconStyle]}
                  width={iconWidth}
                  height={iconHight}
                />

                <Typography
                  variant="semiBoldTxtsm"
                  color={item.labelColor ?? colors.gray[700]}
                  style={flattenedTextStyle}
                >
                  {item.label}
                </Typography>
              </Pressable>
            ))
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

export default DropdownMenu;
