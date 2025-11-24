import React, { Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";
import JobHeader from "./jobheader";

const OverviewTab = () => {
  return (
    <Fragment>
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Job description</Text>

      <Text style={styles.text}>
        We are seeking a talented UX Designer to join our team...
      </Text>

      <Text style={styles.sectionTitle}>Responsibilities</Text>
      <Text style={styles.list}>• Conduct user research and usability testing</Text>
      <Text style={styles.list}>• Create wireframes and prototypes</Text>
      <Text style={styles.list}>• Collaborate with stakeholders</Text>

      <Text style={styles.sectionTitle}>Skills & Qualifications</Text>
      <Text style={styles.list}>• Figma, XD, UI principles</Text>
      <Text style={styles.list}>• HTML, CSS, JS basic knowledge</Text>

      <Text style={styles.sectionTitle}>Skills required</Text>

      <View style={styles.tagWrap}>
        {["Design", "UI/UX", "User research", "Problem solving"].map((item) => (
          <Text key={item} style={styles.tag}>{item}</Text>
        ))}
      </View>
    </View>
    </Fragment>
  );
};

export default OverviewTab;

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },
  text: { marginTop: 8, color: "#374151", lineHeight: 20 },
  list: { marginTop: 6, color: "#4B5563" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
});
