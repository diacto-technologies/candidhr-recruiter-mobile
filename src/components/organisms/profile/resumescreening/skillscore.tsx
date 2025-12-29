import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { checkIcon } from "../../../../assets/svg/check";
import { SvgXml } from "react-native-svg";
import { Wavy_CheckIcon } from "../../../../assets/svg/wavy_check";

interface SkillItem {
  title: string;
  value: string;
  matched: boolean;
}

interface Props {
  title: string;
  overall: string;
  status: string;
  data: SkillItem[];
}

const SkillScore = ({ title, overall, status, data }: Props) => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Matched", "Unmatched"];

  const filteredData =
    activeTab === "All"
      ? data
      : data.filter((item) =>
        activeTab === "Matched" ? item.matched : !item.matched
      );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">{title}</Typography>

        <View style={styles.statusPill}>
          <Typography variant="mediumTxtxs" color={colors.warning[700]}>
            {status}
          </Typography>
        </View>
      </View>

      {/* Gradient score bar */}
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={[
            "rgba(138, 218, 255, 0.74)",
            "rgba(138, 218, 255, 0)"
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientBox}
        >
          <View style={styles.gradientTextcontainer}>
            <Typography variant="mediumTxtsm" style={{ flex: 1 }} color={colors.gray[900]}>
              Overall score
            </Typography>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>{overall}%</Typography>
          </View>
        </LinearGradient>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabBtn,
              activeTab === tab ? styles.tabBtnActive : styles.tabBtnDeactive, ,
            ]}
          >
            <Typography
              variant="mediumTxtsm"
              color={activeTab === tab ? colors.brand[700] : colors.gray[700]}
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skill List */}
      {filteredData.map((item, index) => (
        <View key={index} style={styles.skillRow}>
          <View style={styles.leftRow}>
            {item.matched ? (
               <SvgXml xml={checkIcon} height={20} width={20}/>
            ) : (
              <SvgXml xml={Wavy_CheckIcon} height={20} width={20}/>
            )}
            <Typography
              variant="mediumTxtsm"
              color={item.matched ? colors.gray[900] : colors.gray[600]}
              numberOfLines={2}
              style={{ flex: 0.8,
                flexShrink: 1,}}
            >
              {item.title}
            </Typography>
          </View>

          <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>{item.value}</Typography>
        </View>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* View more */}
      <TouchableOpacity style={styles.viewMore}>
        <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
          View more
        </Typography>
        <Ionicons  name="chevron-down" size={20} color={colors.brand[500]} />
      </TouchableOpacity>
    </View>
  );
};

export default SkillScore;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    gap: 8,
    borderRadius: 9999,
    backgroundColor: colors.warning[50],
    borderWidth: 1,
    borderColor: colors.warning[200],
    alignItems: 'center'
  },

  gradientBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: 'center'
  },
  tabBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },

  tabActive: {
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[200],
  },

  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap:8
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },

  viewMore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  gradientWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  gradientTextcontainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabBtnActive: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[200],
    borderWidth: 1,
  },
  tabBtnDeactive: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
  },
});
