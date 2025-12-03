import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { applicants } from "../../../utils/dummaydata";
import ApplicantList from "../applicantlist";
import SearchBar from "../../atoms/searchbar";
import CustomSwitch from "../../atoms/switchbutton";
import { Typography } from "../../atoms";
import { colors } from "../../../theme/colors";
import Divider from "../../atoms/divider";

const ApplicantsTab = () => {
  const [search, setSearch] = useState("");
  return (
    <View style={{ flex: 1}}>
      <View style={{ paddingHorizontal: 16, gap:4, paddingVertical:10}}>
      <SearchBar
        value={search}
        placeholder="Jacob johns"
        onChangeText={(t) => setSearch(t)}
      />
      <View style={styles.switchContainer}>
      <CustomSwitch/>
      <Typography variant="H4" color={colors.mainColors.carbonGray}>AI recommendation</Typography>
      </View>
      </View>
      <Divider/>
      <FlatList
      data={applicants}
      keyExtractor={(item)=>item.id.toString()}
      renderItem={({ item }) => <ApplicantList item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 16, backgroundColor:colors.common.slightlygray, paddingTop:10}}
      bounces={false}
      />
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
    //backgroundColor: "#fff",
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
    //backgroundColor: "#EEF2FF",
    color: "#4338CA",
    alignSelf: "flex-start",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  switchContainer:{flexDirection:'row',gap:12, paddingTop:12, alignItems:'center'}
});
