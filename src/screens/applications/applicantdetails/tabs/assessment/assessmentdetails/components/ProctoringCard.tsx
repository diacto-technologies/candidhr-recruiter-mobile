import { View, TouchableOpacity, Image, Platform, Linking } from "react-native";
import Typography from "../../../../../../../components/atoms/typography";
import { colors } from "../../../../../../../theme/colors";
import Ring from "../../../../../../../components/atoms/ring";
import VideoPlayerBox from "../../../../../../../components/molecules/videoplayer";
import SnapshotModal from "../../../../../../../components/molecules/snapshotmodal";
import Card from "../../../../../../../components/atoms/card";
import { useMemo, useState } from "react";
import React = require("react");

type Props = {
  proctoring: any;
  styles: any;
};

const toLabelFromKey = (value?: string) => {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return v
    .replace(/_/g, " ")
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default function ProctoringCard({ proctoring, styles }: Props) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  const gazeSnapshots: any[] = useMemo(
    () => proctoring?.gaze_snapshots?.snapshots ?? [],
    [proctoring]
  );

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

      <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
        <Ring percent={Number(proctoring?.integrity_score ?? 0)} showText />
        <View style={{ flex: 1, gap: 2 }}>
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Integrity Score
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            {String(proctoring?.integrity_status ?? "").trim() || "—"}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            {`${proctoring?.total_violations ?? 0} violations detected`}
          </Typography>
        </View>
      </View>

      {!!proctoring?.violations_by_type && (
        <View style={{ gap: 6 }}>
          <Typography variant="mediumTxtxs" color={colors.gray[500]}>
            VIOLATIONS BY TYPE
          </Typography>
          {Object.entries(proctoring.violations_by_type ?? {}).map(([k, v]) => (
            <View key={String(k)} style={styles.violationRow}>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {toLabelFromKey(String(k))}
              </Typography>
              <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                {String(v ?? 0)}
              </Typography>
            </View>
          ))}
        </View>
      )}

      <View style={{ gap: 10 }}>
        <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
          Recording
        </Typography>
          <VideoPlayerBox source={proctoring?.video_url ?? ""} />
      </View>

      {/* ================= GAZE SNAPSHOTS ================= */}
      {gazeSnapshots.length > 0 && (
        <View style={{ marginTop: 10, gap: 16 }}>
          <View style={{ gap: 2 }}>
            <View style={{ flexDirection: "row" }}>
              <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                Gaze snapshots
              </Typography>
              <View
                style={{
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor: colors.gray[100],
                  alignSelf: "center",
                  marginLeft: 10,
                }}
              >
                <Typography variant="mediumTxtsm" color={colors.gray[700]}>
                  {gazeSnapshots.length} captured
                </Typography>
              </View>
            </View>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Extreme gaze moments from the proctoring video.
            </Typography>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {gazeSnapshots.slice(0, visibleCount).map((snapshot: any) => (
              <TouchableOpacity
                key={snapshot?.id ?? snapshot?.image_url ?? snapshot?.image}
                onPress={() => {
                  setSelectedSnapshot(snapshot?.image_url ?? snapshot?.image ?? null);
                  setSnapshotModalVisible(true);
                }}
                style={{
                  width: "48%",
                  aspectRatio: 1.6,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: colors.gray[100],
                }}
              >
                <Image
                  source={{ uri: snapshot?.image_url ?? snapshot?.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}

            {gazeSnapshots.length > visibleCount && (
              <TouchableOpacity
                onPress={() => setVisibleCount((prev) => prev + 5)}
                style={{
                  width: "48%",
                  aspectRatio: 1.6,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: colors.brand[300],
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.brand[50],
                }}
              >
                <Typography variant="semiBoldTxtlg" color={colors.brand[600]}>
                  +
                </Typography>

                <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
                  Show next 5
                </Typography>

                <Typography variant="regularTxtsm" color={colors.brand[700]}>
                  {gazeSnapshots.length - visibleCount} more
                </Typography>
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

