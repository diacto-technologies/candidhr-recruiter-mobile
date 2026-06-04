import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import Typography from "../../../components/atoms/typography";
import { SvgXml } from "react-native-svg";
import { arrowDown } from "../../../assets/svg/arrowdown";
import CustomCodeEditor from "../../../components/molecules/codeEditor";
import { colors } from "../../../theme/colors";
import Icon from "../../../components/atoms/vectoricon";
import { formatTime } from "../../../utils/dateformatter";
import { CodingQuestionCardProps } from "./codingquestioncard.d";
import { useStyles } from "./styles";

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
}: CodingQuestionCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [editorCode, setEditorCode] = useState(code);
  const styles = useStyles();

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const passedCount = useMemo(() => testCases.filter(t => t.passed).length, [testCases]);

  return (
    <View style={[
      styles.card,
      expanded && styles.cardExpanded
    ]}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.header, expanded ? styles.headerExpanded : styles.headerCollapsed]}
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
          style={expanded ? styles.arrowExpanded : styles.arrowCollapsed}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.contentContainer}>
          {/* Submitted Code */}
          <Typography style={styles.subTitle} variant="semiBoldTxtsm" color={colors.gray[800]}>
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
              key={tc.input || i}
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
                  {tc.passed ? <Icon size={20} name={"checkmark-circle-outline"} iconFamily={"Ionicons"} color={colors.success[600]}/> : <Icon size={20} name={"close-circle-outline"} iconFamily={"Ionicons"} color={colors.error[600]}/>}
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
