import React from "react";
import { View, TextInput, ScrollView } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { CustomCodeEditorProps } from "./codeeditor.d";
import { useStyles } from "./styles";

export default function CustomCodeEditor({
  value,
  editable = false,
  onChangeText,
}: CustomCodeEditorProps) {
  const lines = value?.split("\n") ?? [""];
  const styles = useStyles();

  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.wrapper}>
        {/* Line Numbers */}
        <View style={styles.lineNumbers}>
          {lines.map((_, index) => (
            <Typography key={index} style={styles.lineNumber} variant="semiBoldTxtsm" color={colors?.gray[500]}>
              {index + 1}
            </Typography>
          ))}
        </View>

        {/* Code Input */}
        <TextInput
          value={value ?? ""}
          onChangeText={onChangeText}
          editable={editable}
          multiline
          scrollEnabled
          textAlignVertical="top"
          style={[
            styles.editor,
            !editable && styles.readOnly,
          ]}
        />
      </View>
    </ScrollView>
  );
}

