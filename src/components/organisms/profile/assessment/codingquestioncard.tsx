import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { arrowDown } from "../../../../assets/svg/arrowdown";
import CustomCodeEditor from "../../../molecules/codeEditor";
import { SvgXml } from "react-native-svg";
import Icon from "../../../atoms/vectoricon";

interface TestCase {
  input: string;
  output: string;
  passed: boolean;
}

interface Props {
  index: number;
  title: string;
  language: string;
  code: string;
  testCases: TestCase[];
  canEditCode?: boolean;
}

export default function CodingQuestionCard({
  index,
  title,
  language,
  code,
  testCases,
  canEditCode = false,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [editorCode, setEditorCode] = useState(code);

  const passedCount = testCases.filter(t => t.passed).length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.header,{ borderBottomWidth: expanded ? 1 :0}]}
        onPress={() => setExpanded(!expanded)}
      >
        <Typography variant="semiBoldTxtsm">
          {index + 1}. {title}
        </Typography>
        <SvgXml
          xml={arrowDown}
          width={20}
          height={20}
          style={{
            transform: [{ rotate: expanded ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={{paddingHorizontal:16}}>
          {/* Submitted Code */}
          <Typography style={styles.subTitle} variant="semiBoldTxtsm" color={colors?.gray[800]}>
            Submitted code ({language})
          </Typography>

          <CustomCodeEditor
            value={editorCode}
            editable={canEditCode}
            onChangeText={setEditorCode}
          />

          {/* Test case results */}
          <View style={styles.testHeader}>
            <Typography variant="semiBoldTxtsm">
              Test case results
            </Typography>
            <Typography>
              {passedCount}/{testCases.length}
            </Typography>
          </View>

          {testCases.map((tc, i) => (
            <View
              key={i}
              style={[
                styles.testCard,
                tc.passed ? styles.pass : styles.fail,
              ]}
            >
              <View style={styles.testTitle}>
                <Typography variant="semiBoldTxtsm">
                  Test Case #{i + 1}
                </Typography>
                <Typography>
                  {tc.passed ? <Icon size={20} name={"checkmark-circle-outline"} iconFamily={"Ionicons"} color={colors?.success[600]}/> : <Icon size={20} name={"close-circle-outline"} iconFamily={"Ionicons"} color={colors?.error[600]}/>}
                </Typography>
              </View>

              <Typography style={styles.label} variant="semiBoldTxtsm">Input</Typography>
              <View style={styles.box}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>{tc.input}</Typography>
              </View>

              <Typography style={styles.label} variant="semiBoldTxtsm">
                Your output
              </Typography>
              <View style={styles.box}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {tc.output || "No output"}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor:  colors.gray[200],
    paddingBottom:16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderColor:colors.gray[200]
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: colors.gray[700],
  },

  testHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testCard: {
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  pass: {
    backgroundColor: colors.success[50],
  },
  fail: {
    backgroundColor: colors.error[50],
  },
  testTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    color: colors.gray[600],
  },
  box: {
    backgroundColor: colors.gray[50],
    borderRadius:8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
});
