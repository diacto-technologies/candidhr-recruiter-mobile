import React from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

/** GitHub-dark–style canvas, uniform light text (no syntax highlighting). */
export const CODE_EDITOR_SURFACE = "#0d1117";
const CODE_TEXT = "#FFFFFF";
const CODE_PLACEHOLDER = "#6e7681";

export const codeEditorMonoFont = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
}) as string;

export type CodeEditorInputProps = Omit<TextInputProps, "style"> & {
  /** Outer rounded shell (background, margins, min height). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Extra styles merged into the `TextInput` (e.g. minHeight). */
  inputStyle?: StyleProp<TextStyle>;
};

/**
 * Dark code-block editor: navy panel, white monospace text, rounded corners.
 * Prefer over `TextField` for code—`TextField` does not merge arbitrary text styles.
 */
const CodeEditorInput = ({
  containerStyle,
  inputStyle,
  multiline = true,
  autoCapitalize = "none",
  autoCorrect = false,
  spellCheck = false,
  placeholderTextColor = CODE_PLACEHOLDER,
  ...rest
}: CodeEditorInputProps) => {
  return (
    <View style={[styles.shell, containerStyle]}>
      <TextInput
        {...rest}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        placeholderTextColor={placeholderTextColor}
        textAlignVertical="top"
        selectionColor="#58a6ff"
        style={[styles.input, inputStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    marginTop: 8,
    minHeight: 180,
    borderRadius: 12,
    backgroundColor: CODE_EDITOR_SURFACE,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    minHeight: 180,
    padding: 12,
    color: CODE_TEXT,
    fontFamily: codeEditorMonoFont,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default CodeEditorInput;
