import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { dropdownMenuStyles } from './styles';
import { DropdownMenuItem, DropdownMenuProps } from './dropdownmenu.d';

/** Applies dynamic color to SVG XML (stroke and fill, keeps fill="none") */
function applySvgColor(xml: string, color: string): string {
  return xml
    .replace(/\bstroke=["'][^"']*["']/g, `stroke="${color}"`)
    .replace(/\bfill=["'](?!none["'])[^"']*["']/g, `fill="${color}"`);
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
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
    >
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
                  color={colors.gray[700]}
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