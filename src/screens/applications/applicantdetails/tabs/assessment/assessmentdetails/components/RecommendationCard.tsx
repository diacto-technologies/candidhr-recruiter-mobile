import React from "react";
import { View } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import Card from "../../../../../../../components/atoms/card";
import Icon from "../../../../../../../components/atoms/vectoricon";
import { SvgXml } from "react-native-svg";
import { warningIcon } from "../../../../../../../assets/svg/warning";

type Props = {
  recommendations: any;
  overallAssessmentText?: string;
  styles: any;
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

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            paddingHorizontal:8,
            paddingVertical:4,
            borderRadius: 999,
            backgroundColor: colors.warning[50],
            borderWidth: 1,
            borderColor: colors.warning[200],
          }}
        >
          <Typography variant="mediumTxtxs" color={colors.warning[700]}>
            {String(recommendations?.recommendation ?? "—")}
          </Typography>
        </View>

        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Confidence:{" "}
          <Typography variant="mediumTxtxs" color={colors.gray[900]}>
            {String(recommendations?.confidence_level ?? "—")}
          </Typography>
        </Typography>
      </View>

      {!!recommendations?.suggested_next_steps && (
        <Typography variant="regularTxtsm" color={colors.gray[700]}>
          {String(recommendations.suggested_next_steps)}
        </Typography>
      )}

      {Array.isArray(recommendations?.key_considerations) &&
        recommendations.key_considerations.length > 0 && (
          <View style={{ gap:8}}>
            {recommendations.key_considerations.map((txt: any, idx: number) => (
              <View key={String(idx)} style={styles.bulletRow}>
                {/* <View style={styles.warningIcon}> */}
               <SvgXml xml={warningIcon}/>
                {/* </View> */}
                <Typography variant="regularTxtsm" color={colors.gray[700]} style={{ flex: 1 }}>
                  {String(txt)}
                </Typography>
              </View>
            ))}
          </View>
        )}

      {!!recommendations?.suggested_next_steps && (
        <Typography variant="regularTxtsm" color={colors.gray[500]}>
          {String(overallAssessmentText ?? "").trim()}
        </Typography>
      )}
    </Card>
  );
}

