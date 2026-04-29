import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { colors } from '../../../theme/colors';
import Typography from '../typography';

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  /** Editor area first; toolbar sits under the sheet (matches mobile job-description mocks). */
  toolbarAtBottom?: boolean;
  /** Hide “Normal / headings” control — only B, I, U, lists, etc. */
  hideBlockStyleControls?: boolean;
  /** Shows red outline + caption under the toolbar/editor block */
  error?: string;
};

type BlockFormat = 'normal' | 'h2' | 'h3';

const BLOCK_OPTIONS: { key: BlockFormat; label: string }[] = [
  { key: 'normal', label: 'Normal' },
  { key: 'h2', label: 'Heading 2' },
  { key: 'h3', label: 'Heading 3' },
];

/**
 * Matches design: B, I, U, strikethrough, lists, indent, align left, link, clear —
 * paired with Normal / Heading style dropdown (`hideBlockStyleControls={false}`).
 */
const FULL_TOOLBAR_ACTIONS = [
  actions.setBold,
  actions.setItalic,
  actions.setUnderline,
  actions.setStrikethrough,
  actions.insertOrderedList,
  actions.insertBulletsList,
  actions.outdent,
  actions.indent,
  actions.alignLeft,
  actions.insertLink,
  actions.removeFormat,
];

/** B / I / U — left group */
const MINIMAL_TOOLBAR_PRIMARY = [
  actions.setBold,
  actions.setItalic,
  actions.setUnderline,
];
/** Bullets — right of separator */
const MINIMAL_TOOLBAR_LIST = [actions.insertBulletsList];

const RichTextField: React.FC<Props> = ({
  value = '',
  onChange,
  height = 200,
  placeholder = 'Enter instructions...',
  disabled = false,
  toolbarAtBottom = false,
  hideBlockStyleControls = false,
  error,
}) => {
  const richText = useRef<RichEditor>(null);
  const lastEmittedHtml = useRef(value);
  const [blockFormat, setBlockFormat] = useState<BlockFormat>('normal');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (value === lastEmittedHtml.current) return;
    richText.current?.setContentHTML(value);
    lastEmittedHtml.current = value;
  }, [value]);

  const handleChange = (html: string) => {
    if (disabled) return;
    lastEmittedHtml.current = html;
    onChange?.(html);
  };

  const applyBlockFormat = (key: BlockFormat) => {
    if (disabled) return;
    const ed = richText.current;
    if (ed) {
      ed.focusContentEditor();
      if (key === 'normal') {
        ed.sendAction(actions.setParagraph, 'result');
      } else if (key === 'h2') {
        ed.sendAction(actions.heading2, 'result');
      } else {
        ed.sendAction(actions.heading3, 'result');
      }
    }
    setBlockFormat(key);
    setDropdownOpen(false);
  };

  const currentLabel =
    BLOCK_OPTIONS.find((o) => o.key === blockFormat)?.label ?? 'Normal';

  useEffect(() => {
    if (disabled && dropdownOpen) setDropdownOpen(false);
  }, [disabled, dropdownOpen]);

  const toolbarRow = (
    <View
      style={[
        styles.toolbarRow,
        toolbarAtBottom ? styles.toolbarRowBottom : styles.toolbarRowTop,
        disabled ? { opacity: 0.7 } : null,
      ]}
    >
      {!hideBlockStyleControls ? (
        <Pressable
          onPress={() => !disabled && setDropdownOpen(true)}
          disabled={disabled}
          style={styles.blockDropdownTrigger}
          accessibilityRole="button"
          accessibilityLabel="Text style"
        >
          <Text
            style={[
              styles.blockDropdownTriggerText,
              disabled ? { color: colors.gray[400] } : null,
            ]}
          >
            {currentLabel}
          </Text>
          <Ionicons
            name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={disabled ? colors.gray[400] : colors.gray[700]}
          />
        </Pressable>
      ) : null}

      {hideBlockStyleControls ? (
        <View style={styles.minimalToolbarInner}>
          <RichToolbar
            editor={richText}
            actions={MINIMAL_TOOLBAR_PRIMARY}
            iconTint={disabled ? colors.gray[400] : colors.gray[600]}
            selectedIconTint={disabled ? colors.gray[400] : colors.brand[600]}
            style={styles.richToolbarGroup}
          />
          <View style={styles.toolbarSeparator} />
          <RichToolbar
            editor={richText}
            actions={MINIMAL_TOOLBAR_LIST}
            iconTint={disabled ? colors.gray[400] : colors.gray[600]}
            selectedIconTint={disabled ? colors.gray[400] : colors.brand[600]}
            style={styles.richToolbarGroup}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.toolbarScroll}
          contentContainerStyle={styles.toolbarScrollContent}
        >
          <RichToolbar
            editor={richText}
            actions={FULL_TOOLBAR_ACTIONS}
            iconTint={disabled ? colors.gray[400] : colors.gray[700]}
            selectedIconTint={disabled ? colors.gray[400] : colors.brand[500]}
            style={styles.richToolbarFull}
          />
        </ScrollView>
      )}
    </View>
  );

  const editorBlock = (
    <View style={{ height }}>
      <View
        style={{ flex: 1, backgroundColor: disabled ? colors.gray[200] : colors.base.white }}
        pointerEvents={disabled ? 'none' : 'auto'}
      >
        <RichEditor
          ref={richText}
          initialContentHTML={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled as any}
          style={{ flex: 1 }}
          editorStyle={{
            contentCSSText: `
                min-height: ${height}px;
                padding: 12px;
                font-size: 14px;
                ${disabled
                  ? `
                    color: ${colors.gray[400]};
                    body, p, span, div, li, ul, ol, h1, h2, h3, h4, h5, h6 {
                      color: ${colors.gray[400]} !important;
                    }
                    a { color: ${colors.gray[400]} !important; }
                  `
                  : ''}
                ${disabled ? `background-color: ${colors.gray[200]};` : ''}
              `,
            cssText: `
                h2 { font-size: 20px; font-weight: 400; margin: 0.35em 0; }
                h3 { font-size: 18px; font-weight: 400; margin: 0.35em 0; }
              `,
          }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  return (
    <View>
      <View
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: error ? colors.error[500] : colors.gray[200],
          backgroundColor: disabled ? colors.gray[100] : colors.base.white,
        }}
      >
      {toolbarAtBottom ? (
        <>
          {editorBlock}
          {toolbarRow}
        </>
      ) : (
        <>
          {toolbarRow}
          {editorBlock}
        </>
      )}

      <Modal
        visible={!hideBlockStyleControls && dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                {BLOCK_OPTIONS.map((opt) => {
                  const selected = opt.key === blockFormat;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => applyBlockFormat(opt.key)}
                      style={({ pressed }) => [
                        styles.blockOptionRow,
                        pressed && styles.blockOptionRowPressed,
                        selected && styles.blockOptionRowSelected,
                      ]}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected }}
                    >
                      <Text style={styles.blockOptionLabel}>{opt.label}</Text>
                      {selected ? (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={colors.brand[600]}
                        />
                      ) : (
                        <View style={styles.checkPlaceholder} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    {!!error ? (
      <Typography variant="regularTxtsm" color={colors.error[600]} style={{ marginTop: 6 }}>
        {error}
      </Typography>
    ) : null}
  </View>
  );
};

const styles = StyleSheet.create({
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  toolbarRowTop: {
    backgroundColor: colors.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  toolbarRowBottom: {
    backgroundColor: colors.base.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  minimalToolbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    paddingVertical: 2,
  },
  toolbarSeparator: {
    width: 1,
    height: 22,
    backgroundColor: colors.gray[300],
    marginHorizontal: 2,
  },
  richToolbarGroup: {
    backgroundColor: 'transparent',
  },
  richToolbarFull: {
    backgroundColor: 'transparent',
    minHeight: 40,
    alignSelf: 'flex-start',
  },
  toolbarScroll: {
    flex: 1,
    maxHeight: 48,
    minWidth: 0,
  },
  toolbarScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    flexGrow: 1,
  },
  blockDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
  },
  blockDropdownTriggerText: {
    fontSize: 14,
    color: colors.gray[900],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalSheet: {
    backgroundColor: colors.base.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  blockOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  blockOptionRowPressed: {
    backgroundColor: colors.gray[50],
  },
  blockOptionRowSelected: {
    backgroundColor: colors.brand[50],
  },
  blockOptionLabel: {
    fontSize: 16,
    color: colors.gray[900],
    flex: 1,
  },
  checkPlaceholder: {
    width: 20,
    height: 20,
  },
});

export default RichTextField;
