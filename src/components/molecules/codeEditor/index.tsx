import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";

interface Props {
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}

export default function CustomCodeEditor({
  value,
  editable = false,
  onChangeText,
}: Props) {
  const lines = value.split("\n");

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
          value={value}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.white,
    borderRadius: 10,
    borderColor:colors?.gray[200],
    borderWidth:1
  },
  wrapper: {
    flexDirection: "row",
  },
  lineNumbers: {
    marginRight: 12,
    borderColor:colors?.gray[200],
    backgroundColor:colors?.gray[50],
    padding:10
  },
  lineNumber: {
    color: colors.gray[400],
    height: 20,
    textAlign: "right",
  },
  editor: {
    //minWidth: 300,
    minHeight: 160,
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
  },
  readOnly: {
    color: colors.gray[600],
  },
});
