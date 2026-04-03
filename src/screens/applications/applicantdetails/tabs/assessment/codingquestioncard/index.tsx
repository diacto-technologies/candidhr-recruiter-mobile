import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Typography from "../../../../../../components/atoms/typography";
import { SvgXml } from "react-native-svg";
import { arrowDown } from "../../../../../../assets/svg/arrowdown";
import CustomCodeEditor from "../../../../../../components/molecules/codeEditor";
import { colors } from "../../../../../../theme/colors";
import Icon from "../../../../../../components/atoms/vectoricon";

interface TestCase {
  input: string;
  output: string;
  expectedOutput?: string;
  passed: boolean;
}

interface Props {
  index: number;
  title: string;
  language: string;
  code: string;
  testCases: TestCase[];
  pointsObtained?: number;
  totalPoints?: number;
  timeSpentSeconds?: number;
  canEditCode?: boolean;
}

const formatTime = (seconds?: number) => {
  const s = Number(seconds ?? 0);
  if (!Number.isFinite(s) || s <= 0) return "0s";
  const mins = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  if (mins <= 0) return `${rem}s`;
  return `${mins}m ${rem}s`;
};

export default function CodingQuestionCard({
  index,
  title,
  language,
  code,
  testCases,
  pointsObtained,
  totalPoints,
  timeSpentSeconds,
  canEditCode = false,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [editorCode, setEditorCode] = useState(code);

  const passedCount = testCases.filter(t => t.passed).length;

  return (
    <View style={[
      styles.card,
      expanded && { paddingBottom: 16 }
    ]}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.header,{ borderBottomWidth: expanded ? 1 :0}]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Typography variant="semiBoldTxtsm">
            {index + 1}. {title}
          </Typography>

          {(totalPoints !== undefined || timeSpentSeconds !== undefined) && (
            <View style={styles.metaRow}>
              {totalPoints !== undefined && (
                <View style={styles.pointsRow}>
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {pointsObtained ?? 0}
                  </Typography>
                  <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                    {" "}
                    / {totalPoints} pts
                  </Typography>
                </View>
              )}

              {timeSpentSeconds !== undefined && (
                <View style={styles.timeRow}>
                  <Icon
                    size={16}
                    name={"time-outline"}
                    iconFamily={"Ionicons"}
                    color={colors.gray[500]}
                  />
                  <Typography variant="regularTxtsm" color={colors.gray[500]}>
                    {" "}
                    {formatTime(timeSpentSeconds)}
                  </Typography>
                </View>
              )}
            </View>
          )}
        </View>

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

              {tc.expectedOutput !== undefined && (
                <>
                  <Typography style={styles.label} variant="semiBoldTxtsm">
                    Expected
                  </Typography>
                  <View style={styles.box}>
                    <Typography variant="regularTxtsm" color={colors.gray[600]}>
                      {tc.expectedOutput || "No expected output"}
                    </Typography>
                  </View>
                </>
              )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "center",
    padding: 16,
    borderColor:colors.gray[200]
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
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
