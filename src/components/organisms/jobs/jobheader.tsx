import React from "react";
import { View, Text, StyleSheet } from "react-native";

const JobHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Full stack developer</Text>
      <Text style={styles.subtitle}>45 applicants • Aug 16, 2025</Text>

      <View style={styles.row}>
        <Text style={styles.location}>📍 Pune, Maharashtra</Text>
      </View>

      <View style={styles.chipRow}>
        <Text style={[styles.chip, { backgroundColor: "#EEF2FF", color: "#4338CA" }]}>
          Full time
        </Text>

        <Text style={[styles.chip, { backgroundColor: "#DCFCE7", color: "#166534" }]}>
          3 - 5 Yrs
        </Text>

        <Text style={[styles.chip, { backgroundColor: "#FDE7E9", color: "#B91C1C" }]}>
          8 - 10 LPA
        </Text>
      </View>

      <Text style={styles.closedTag}>Closed on : Aug 16, 2025</Text>
    </View>
  );
};

export default JobHeader;

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 4, fontSize: 14, color: "#6B7280" },
  row: { marginTop: 6 },
  location: { color: "#6B7280", fontSize: 14 },
  chipRow: { flexDirection: "row", marginTop: 10 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  closedTag: {
    marginTop: 10,
    color: "#B91C1C",
    fontWeight: "600",
  },
});
