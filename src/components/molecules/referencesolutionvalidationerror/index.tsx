import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import type { ReferenceSolutionValidationRow } from "../../../features/assessments/types";

export type ReferenceSolutionValidationErrorPanelProps = {
  rows: ReferenceSolutionValidationRow[];
  /** When set, shows a button on each row that has a non-empty actual output. */
  onUseActualAsExpected?: (row: ReferenceSolutionValidationRow) => void;
};

function trimDisplay(v: unknown): string {
  if (typeof v === "string") return v;
  return String(v ?? "");
}

/** Normalize stdin/stdout for matching a validation row to a draft test case. */
export function normalizeIoForMatch(s: string | undefined): string {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

/** Minimal test-case shape for hiding rows once expected matches reference actual. */
export type ReferenceDraftTestCaseLike = {
  input?: string;
  expectedOutput?: string;
};

/**
 * True when the draft already matches what the reference run printed for this input
 * (e.g. after "Use actual as expected" or a manual edit).
 */
export function isReferenceValidationRowResolvedAgainstDraft(
  row: ReferenceSolutionValidationRow,
  testCases: ReferenceDraftTestCaseLike[],
): boolean {
  const inputKey = normalizeIoForMatch(row.input);
  const want = normalizeIoForMatch(row.actual_output);
  if (!want) {
    return false;
  }
  const tc = testCases.find((t) => normalizeIoForMatch(t.input) === inputKey);
  if (!tc) {
    return false;
  }
  return normalizeIoForMatch(tc.expectedOutput) === want;
}

/** Keeps only rows that still disagree with the current draft (for live UI after fixes). */
export function filterUnresolvedReferenceValidationRows(
  rows: ReferenceSolutionValidationRow[] | null | undefined,
  testCases: ReferenceDraftTestCaseLike[],
): ReferenceSolutionValidationRow[] {
  if (!rows?.length) {
    return [];
  }
  return rows.filter(
    (row) => !isReferenceValidationRowResolvedAgainstDraft(row, testCases),
  );
}

/**
 * Pink summary + white cards for API reference-solution validation failures
 * (`details.details.reference_solutions`).
 */
const ReferenceSolutionValidationErrorPanel = ({
  rows,
  onUseActualAsExpected,
}: ReferenceSolutionValidationErrorPanelProps) => {
  const languageKeys = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const r of rows) {
      const lang = trimDisplay(r.language).trim();
      const key = lang || "__none__";
      if (!seen.has(key)) {
        seen.add(key);
        ordered.push(key);
      }
    }
    return ordered;
  }, [rows]);

  const [activeLangKey, setActiveLangKey] = useState<string | null>(null);

  const langKeysJoined = languageKeys.join("\u0000");
  useEffect(() => {
    setActiveLangKey((prev) =>
      prev && languageKeys.includes(prev) ? prev : languageKeys[0] ?? null,
    );
  }, [langKeysJoined, languageKeys]);

  const resolvedActiveKey =
    activeLangKey && languageKeys.includes(activeLangKey)
      ? activeLangKey
      : languageKeys[0] ?? "__none__";

  const displayRows = useMemo(() => {
    if (languageKeys.length <= 1) {
      return rows;
    }
    return rows.filter((r) => {
      const key = trimDisplay(r.language).trim() || "__none__";
      return key === resolvedActiveKey;
    });
  }, [rows, languageKeys.length, resolvedActiveKey]);

  const n = displayRows.length;
  const headline =
    n === 1
      ? "Reference solution failed on 1 test case"
      : `Reference solution failed on ${n} test cases`;

  const showLangTabs = languageKeys.length > 1;

  return (
    <View style={styles.outer}>
      {showLangTabs && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.langScroll}
          contentContainerStyle={styles.langScrollContent}
        >
          {languageKeys.map((key) => {
            const label =
              key === "__none__" ? "Unknown language" : key;
            const active = key === resolvedActiveKey;
            return (
              <Pressable
                key={key}
                onPress={() => setActiveLangKey(key)}
                style={[
                  styles.langTab,
                  active ? styles.langTabActive : styles.langTabIdle,
                ]}
              >
                <View style={styles.langTabInner}>
                  <Typography
                    variant="semiBoldTxtsm"
                    color={active ? colors.gray[900] : colors.gray[500]}
                  >
                    {label}
                  </Typography>
                  <View style={styles.errorDot} />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      <Typography variant="semiBoldTxtsm" color={colors.error[700]}>
        {headline}
      </Typography>
      {displayRows.map((row, i) => {
        const actualRaw = trimDisplay(row.actual_output);
        const hasActual =
          typeof row.actual_output === "string" && row.actual_output.trim().length > 0;
        return (
          <View key={i} style={styles.card}>
            <Typography variant="semiBoldTxtsm" color={colors.error[600]}>
              {trimDisplay(row.error) || "Error"}
            </Typography>
            <Typography variant="regularTxtxs" color={colors.gray[700]} style={styles.subMessage}>
              {trimDisplay(row.message).trim() || "No error message"}
            </Typography>
            <View style={styles.grid}>
              <View style={styles.gridCol}>
                <Typography variant="regularTxtxs" color={colors.gray[600]}>
                  Input
                </Typography>
                <Text style={styles.mono} selectable>
                  {trimDisplay(row.input)}
                </Text>
              </View>
              <View style={styles.gridCol}>
                <Typography variant="regularTxtxs" color={colors.gray[600]}>
                  Expected
                </Typography>
                <Text style={styles.mono} selectable>
                  {trimDisplay(row.output)}
                </Text>
              </View>
              <View style={styles.gridCol}>
                <Typography variant="regularTxtxs" color={colors.gray[600]}>
                  Actual (reference run)
                </Typography>
                <View style={styles.actualBox}>
                  <Text style={styles.monoActual} selectable>
                    {hasActual ? actualRaw : "—"}
                  </Text>
                </View>
                {onUseActualAsExpected && hasActual && (
                  <>
                    <Pressable
                      onPress={() => onUseActualAsExpected(row)}
                      style={({ pressed }) => [
                        styles.useActualBtn,
                        pressed && styles.useActualBtnPressed,
                      ]}
                    >
                      <Typography variant="semiBoldTxtxs" color={colors.success[800]}>
                        Use actual as expected output
                      </Typography>
                    </Pressable>
                    <Typography variant="regularTxtxs" color={colors.gray[600]} style={styles.useActualHint}>
                      Updates this test case&apos;s expected output so it matches what the reference
                      solution printed.
                    </Typography>
                  </>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderWidth: 1,
    borderColor: colors.error[200],
    borderRadius: 12,
    backgroundColor: colors.error[50],
    padding: 12,
    gap: 12,
  },
  langScroll: {
    marginHorizontal: -4,
    marginBottom: -4,
  },
  langScrollContent: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  langTab: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  langTabActive: {
    backgroundColor: colors.base.white,
    borderColor: colors.gray[200],
  },
  langTabIdle: {
    backgroundColor: "transparent",
    borderColor: colors.gray[200],
  },
  langTabInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error[500],
  },
  card: {
    backgroundColor: colors.base.white,
    borderWidth: 1,
    borderColor: colors.error[200],
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  subMessage: {
    marginTop: -2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  gridCol: {
    flexGrow: 1,
    flexBasis: "28%",
    minWidth: 96,
    gap: 4,
  },
  mono: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray[800],
  },
  actualBox: {
    backgroundColor: colors.warning[50],
    borderWidth: 1,
    borderColor: colors.warning[200],
    borderRadius: 8,
    padding: 8,
    minHeight: 40,
  },
  monoActual: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray[900],
  },
  useActualBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.success[100],
    borderWidth: 1,
    borderColor: colors.success[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  useActualBtnPressed: {
    opacity: 0.85,
  },
  useActualHint: {
    marginTop: 4,
    maxWidth: 280,
  },
});

export default ReferenceSolutionValidationErrorPanel;
