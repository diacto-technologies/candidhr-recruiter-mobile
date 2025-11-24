import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ApplicantsTab = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>Jacob Johns</Text>
              <Text style={styles.sub}>
                Applied on : Aug 16, 2025
              </Text>
              <Text style={styles.sub}>Applied for : Frontend developer</Text>
            </View>
          </View>

          <Text style={styles.status}>Resume screening - Applied</Text>
        </View>
      ))}
    </View>
  );
};

export default ApplicantsTab;

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  status: {
    marginTop: 10,
    padding: 6,
    backgroundColor: "#EEF2FF",
    color: "#4338CA",
    alignSelf: "flex-start",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },
});
