import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ImportCandidatesTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Import Candidates Screen</Text>
    </View>
  );
};

export default ImportCandidatesTab;

const styles = StyleSheet.create({
  container: { padding: 16 },
  text: { fontSize: 16, color: "#374151" },
});
