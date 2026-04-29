import React from 'react';
import { Modal, Pressable, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
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
  /** Optional icon color for this item (overrides iconColor from props) */
  iconColor?: string;
  /** Optional label color (e.g. destructive actions) */
  labelColor?: string;
}

export interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  position: { left: number; top: number };
  items: DropdownMenuItem[];
  renderContent?: () => React.ReactNode;
  width?: number;
  iconWidth:number,
  iconHight:number

  /** styles from parent */
  dropdownStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  /** Dynamic color for all icons (stroke/fill). Overridable per item via item.iconColor */
  iconColor?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  position,
  items,
  renderContent,
  width = 140,
  iconWidth=16,
  iconHight=16,
  dropdownStyle,
  itemStyle,
  textStyle,
  iconStyle,
  iconColor,
}) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={dropdownMenuStyles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            dropdownMenuStyles.dropdown,
            {
              left: position.left,
              top: position.top,
              width,
            },
            dropdownStyle, // external dropdown style
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {renderContent ? (
            <View>{renderContent()}</View>
          ) : (
            items.map((item, index) => (
              <Pressable
                key={index}
                style={[dropdownMenuStyles.dropdownItem, itemStyle]} // external item style
                onPress={() => {
                  item.onPress();
                  if (item.closeOnPress !== false) {
                    onClose();
                  }
                }}
              >
                <SvgXml
                  xml={
                    (item.iconColor ?? iconColor)
                      ? applySvgColor(item.icon, item.iconColor ?? iconColor!)
                      : item.icon
                  }
                  style={[dropdownMenuStyles.dropdownItemIcon, iconStyle]} // external icon style
                  width={iconWidth}
                  height={iconHight}
                />

                <Typography
                  variant="semiBoldTxtsm"
                  color={item.labelColor ?? colors.gray[700]}
                  style={textStyle} // external text style
                >
                  {item.label}
                </Typography>
              </Pressable>
            ))
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DropdownMenu;