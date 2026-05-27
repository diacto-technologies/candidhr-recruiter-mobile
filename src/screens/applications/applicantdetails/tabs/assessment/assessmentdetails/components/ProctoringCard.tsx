import { View, TouchableOpacity, Image } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import VideoPlayerBox from "../../../../../../../components/molecules/videoplayer";
import SnapshotModal from "../../../../../../../components/molecules/snapshotmodal";
import Card from "../../../../../../../components/atoms/card";
import { useMemo, useState } from "react";
import React from "react";
import type { PerformanceReportResponse } from "../../../../../../../features/applications/types";
import { useStyles } from "../styles";

type ProctoringData = NonNullable<PerformanceReportResponse["proctoring_summary"]>;

type Props = {
  proctoring: ProctoringData;
  styles: ReturnType<typeof useStyles>;
};

const getViolationCount = (violationsByType: Record<string, number> | undefined, keys: string[]) => {
  if (!violationsByType) return 0;
  for (const k of keys) {
    const v = violationsByType[k as keyof typeof violationsByType];
    if (v !== undefined && v !== null && Number.isFinite(Number(v))) return Number(v);
  }
  return 0;
};

export default function ProctoringCard({ proctoring, styles }: Props) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  const gazeSnapshots: any[] = useMemo(
    () => proctoring?.gaze_snapshots?.snapshots ?? [],
    [proctoring]
  );

  const violationsByType = useMemo(
    () => (proctoring?.violations_by_type as Record<string, number> | undefined) ?? {},
    [proctoring]
  );

  const metrics = useMemo(
    () => [
      {
        label: "Tab switches",
        value: getViolationCount(violationsByType, ["tab_switches", "tab_switch", "tab_switch_count"]),
      },
      {
        label: "Mouse leave",
        value: getViolationCount(violationsByType, ["mouse_leave", "mouse_leaves", "mouse_leave_count"]),
      },
      {
        label: "Screen exit",
        value: getViolationCount(violationsByType, ["screen_exit", "screen_exits", "screen_exit_count"]),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [violationsByType]
  );

  const hiddenSnapshotCount = Math.max(0, gazeSnapshots.length - visibleCount);
  
  const visibleSnapshots = useMemo(() => {
    return gazeSnapshots.slice(0, Math.min(visibleCount, gazeSnapshots.length));
  }, [gazeSnapshots, visibleCount]);

  if (!proctoring) return null;

  return (
    <Card style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <Typography variant="semiBoldTxtlg">
            Proctoring
          </Typography>
        </View>
      </View>

      <View style={styles.videoContainer}>
        <VideoPlayerBox source={proctoring?.video_url ?? ""} />
      </View>
      <View style={styles.metricsRow}>
        {metrics.map((m, idx) => (
          <React.Fragment key={m.label}>
            <View style={styles.metricTile}>
              <Typography variant="semiBoldDxs" color={colors.gray[900]}>
                {String(m.value).padStart(2, "0")}
              </Typography>
              <Typography variant="regularTxtmd" color={colors.gray[600]}>
                {m.label}
              </Typography>
            </View>
            {idx !== metrics.length - 1 && (
              <View style={styles.dividerLine} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* ================= GAZE SNAPSHOTS ================= */}
      {gazeSnapshots.length > 0 && (
        <View style={styles.snapshotHeader}>
          <Typography
            variant="mediumTxtxs"
            color={colors.gray[400]}
            style={{ letterSpacing: 0.9 }}
          >
            {`SNAPSHOTS (${String(gazeSnapshots.length).padStart(2, "0")})`}
          </Typography>

          <View style={{ position: "relative" }}>
            <View style={styles.snapshotGrid}>
              {visibleSnapshots.map((snapshot: any, idx: number) => {
                const uri = snapshot?.image_url ?? snapshot?.image ?? null;
                const isFadedPreview = gazeSnapshots.length > 4 && visibleCount <= 6 && idx >= 4;

                return (
                  <TouchableOpacity
                    key={snapshot?.id ?? uri ?? String(idx)}
                    onPress={() => {
                      setSelectedSnapshot(uri);
                      setSnapshotModalVisible(true);
                    }}
                    style={[
                      styles.snapshotThumbnail,
                      isFadedPreview && styles.fadedThumbnail,
                    ]}
                  >
                    {!!uri && (
                      <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {visibleCount < gazeSnapshots.length && (
              <TouchableOpacity
                onPress={() => setVisibleCount(gazeSnapshots.length)}
                style={styles.viewAllBtnContainer}
              >
                <View style={styles.viewAllBtn}>
                  <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
                    {hiddenSnapshotCount > 1
                      ? `View all (${hiddenSnapshotCount})`
                      : "View all"}
                  </Typography>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <SnapshotModal
        visible={snapshotModalVisible}
        imageUri={selectedSnapshot}
        onClose={() => {
          setSnapshotModalVisible(false);
          setSelectedSnapshot(null);
        }}
      />
    </Card>
  );
}

