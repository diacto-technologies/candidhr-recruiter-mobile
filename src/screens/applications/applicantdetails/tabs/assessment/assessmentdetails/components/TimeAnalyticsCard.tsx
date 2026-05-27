import React, { useMemo } from "react";
import { View } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import Card from "../../../../../../../components/atoms/card";
import type { PerformanceReportResponse } from "../../../../../../../features/applications/types";
import { useStyles } from "../styles";

type Props = {
  timeAnalytics: NonNullable<PerformanceReportResponse["time_analytics"]> | undefined;
  styles: ReturnType<typeof useStyles>;
};

export default function TimeAnalyticsCard({ timeAnalytics, styles }: Props) {
  const stats = useMemo(() => {
    if (!timeAnalytics) return [];
    
    return [
      {
        label: "TOTAL TIME",
        value: timeAnalytics.total_time_taken_formatted ?? "—",
      },
      {
        label: "TIME LIMIT",
        value: timeAnalytics.time_limit_formatted ?? "—",
      },
      {
        label: "EFFICIENCY",
        value: timeAnalytics.time_efficiency != null 
          ? `${timeAnalytics.time_efficiency}%` 
          : "—",
      },
      {
        label: "AVG / Q",
        value: timeAnalytics.average_time_per_question != null 
          ? `${timeAnalytics.average_time_per_question}s` 
          : "—",
      },
    ];
  }, [timeAnalytics]);

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
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statTile}>
            <Typography variant="mediumTxtxs" color={colors.gray[600]}>
              {stat.label}
            </Typography>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              {stat.value}
            </Typography>
          </View>
        ))}
      </View>
    </Card>
  );
}

