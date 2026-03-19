import React from "react";
import { View } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import Card from "../../../../../../../components/atoms/card";

type Props = {
  timeAnalytics: any;
  styles: any;
};

export default function TimeAnalyticsCard({ timeAnalytics, styles }: Props) {
  if (!timeAnalytics) return null;

  return (
    <Card style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Time Analytics
          </Typography>
        </View>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statTile}>
          <Typography variant="mediumTxtxs" color={colors.gray[600]}>
            TOTAL TIME
          </Typography>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {timeAnalytics?.total_time_taken_formatted ?? "—"}
          </Typography>
        </View>

        <View style={styles.statTile}>
          <Typography variant="mediumTxtxs" color={colors.gray[600]}>
            TIME LIMIT
          </Typography>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {timeAnalytics?.time_limit_formatted ?? "—"}
          </Typography>
        </View>

        <View style={styles.statTile}>
          <Typography variant="mediumTxtxs" color={colors.gray[600]}>
            EFFICIENCY
          </Typography>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {typeof timeAnalytics?.time_efficiency === "number"
              ? `${timeAnalytics.time_efficiency}%`
              : `${timeAnalytics?.time_efficiency ?? "—"}%`}
          </Typography>
        </View>

        <View style={styles.statTile}>
          <Typography variant="mediumTxtxs" color={colors.gray[600]}>
            AVG / Q
          </Typography>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            {typeof timeAnalytics?.average_time_per_question === "number"
              ? `${timeAnalytics.average_time_per_question}s`
              : `${timeAnalytics?.average_time_per_question ?? "—"}s`}
          </Typography>
        </View>
      </View>
    </Card>
  );
}

