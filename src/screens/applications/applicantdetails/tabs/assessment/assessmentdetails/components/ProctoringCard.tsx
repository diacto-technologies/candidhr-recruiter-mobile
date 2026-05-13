import { View, TouchableOpacity, Image } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import VideoPlayerBox from "../../../../../../../components/molecules/videoplayer";
import SnapshotModal from "../../../../../../../components/molecules/snapshotmodal";
import Card from "../../../../../../../components/atoms/card";
import { useMemo, useState } from "react";
import React from "react";

type Props = {
  proctoring: any;
  styles: any;
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
    () => proctoring?.violations_by_type ?? {},
    [proctoring]
  );

  const getViolationCount = (keys: string[]) => {
    for (const k of keys) {
      const v = (violationsByType as any)?.[k];
      if (v !== undefined && v !== null && Number.isFinite(Number(v))) return Number(v);
    }
    return 0;
  };

  const metrics = useMemo(
    () => [
      {
        label: "Tab switches",
        value: getViolationCount(["tab_switches", "tab_switch", "tab_switch_count"]),
      },
      {
        label: "Mouse leave",
        value: getViolationCount(["mouse_leave", "mouse_leaves", "mouse_leave_count"]),
      },
      {
        label: "Screen exit",
        value: getViolationCount(["screen_exit", "screen_exits", "screen_exit_count"]),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [violationsByType]
  );

  const hiddenSnapshotCount = Math.max(0, gazeSnapshots.length - visibleCount);

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

      <View
        style={{
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: colors.gray[100],
        }}
      >
        <VideoPlayerBox source={proctoring?.video_url ?? ""} />
      </View>
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: colors.gray[200],
          paddingBottom: 8,
        }}
      >
        {metrics.map((m, idx) => (
          <React.Fragment key={m.label}>
            <View style={{ flex: 1, gap: 4 }}>
              <Typography variant="semiBoldDxs" color={colors.gray[900]}>
                {String(m.value).padStart(2, "0")}
              </Typography>
              <Typography variant="regularTxtmd" color={colors.gray[600]}>
                {m.label}
              </Typography>
            </View>
            {idx !== metrics.length - 1 && (
              <View
                style={{
                  height:'100%',
                  width: 2,
                  backgroundColor: colors.gray[200],
                  marginHorizontal: 14,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* ================= GAZE SNAPSHOTS ================= */}
      {gazeSnapshots.length > 0 && (
        <View style={{ marginTop: 6, gap: 12 }}>
          <Typography
            variant="mediumTxtxs"
            color={colors.gray[400]}
            style={{ letterSpacing: 0.9 }}
          >
            {`SNAPSHOTS (${String(gazeSnapshots.length).padStart(2, "0")})`}
          </Typography>

          <View style={{ position: "relative" }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                rowGap: 12,
              }}
            >
              {gazeSnapshots.slice(0, Math.min(visibleCount, gazeSnapshots.length)).map((snapshot: any, idx: number) => {
                const uri = snapshot?.image_url ?? snapshot?.image ?? null;
                const isFadedPreview = gazeSnapshots.length > 4 && visibleCount <= 6 && idx >= 4;

                return (
                  <TouchableOpacity
                    key={snapshot?.id ?? uri ?? String(idx)}
                    onPress={() => {
                      setSelectedSnapshot(uri);
                      setSnapshotModalVisible(true);
                    }}
                    style={{
                      width: "23%",
                      aspectRatio: 1,
                      borderRadius: 16,
                      overflow: "hidden",
                      backgroundColor: colors.gray[100],
                      opacity: isFadedPreview ? 0.25 : 1,
                    }}
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
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 12,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.gray[200],
                    backgroundColor: colors.common.white,
                  }}
                >
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

