import React from "react";
import { View } from "react-native";
import Typography from "../../../components/atoms/typography";
import { colors } from "../../../theme/colors";
import Card from "../../../components/atoms/card";
import { SvgXml } from "react-native-svg";
import { warningIcon } from "../../../assets/svg/warning";
import type { PerformanceReportResponse } from "../../../features/applications/types";
import { useStyles } from "../../organisms/AssessmentDetails/styles";

type Props = {
  recommendations: PerformanceReportResponse["recommendations"] | undefined;
  overallAssessmentText?: string;
  styles: ReturnType<typeof useStyles>;
};

export default function RecommendationCard({
  recommendations,
  overallAssessmentText,
  styles,
}: Props) {
  if (!recommendations) return null;

  return (
    <Card style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Recommendation
          </Typography>
        </View>
      </View>

      <View style={styles.recommendationRow}>
        <View style={styles.recommendationBadge}>
          <Typography variant="mediumTxtxs" color={colors.warning[700]}>
            {recommendations.recommendation ?? "—"}
          </Typography>
        </View>

        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Confidence:{" "}
          <Typography variant="mediumTxtxs" color={colors.gray[900]}>
            {recommendations.confidence_level ?? "—"}
          </Typography>
        </Typography>
      </View>

      {!!recommendations.suggested_next_steps && (
        <Typography variant="regularTxtsm" color={colors.gray[700]}>
          {recommendations.suggested_next_steps}
        </Typography>
      )}

      {Array.isArray(recommendations.key_considerations) &&
        recommendations.key_considerations.length > 0 && (
          <View style={styles.recommendationGap}>
            {recommendations.key_considerations.map((txt: string) => (
              <View key={txt} style={styles.bulletRow}>
               <SvgXml xml={warningIcon}/>
                <Typography variant="regularTxtsm" color={colors.gray[700]} style={{ flex: 1 }}>
                  {txt}
                </Typography>
              </View>
            ))}
          </View>
        )}

      {!!overallAssessmentText && (
        <Typography variant="regularTxtsm" color={colors.gray[500]}>
          {overallAssessmentText.trim()}
        </Typography>
      )}
    </Card>
  );
}

