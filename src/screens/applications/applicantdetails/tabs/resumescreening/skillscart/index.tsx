import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SvgXml } from "react-native-svg";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Typography from "../../../../../../components/atoms/typography";
import { getStatusStyles } from "../../../helper";
import { colors } from "../../../../../../theme/colors";
import { checkIcon } from "../../../../../../assets/svg/check";
import { Wavy_CheckIcon } from "../../../../../../assets/svg/wavy_check";
import { shadowStyles } from "../../../../../../theme/shadowcolor";
import InfoTooltip from "../../../../../../components/atoms/Infotooltip";
import { infoIcon } from "../../../../../../assets/svg/infoicon";

interface SkillItem {
  proficiencyEvidence: string;
  proficiencyLevel: any;
  title: string;
  value: string;
  matched: boolean;
}

interface Props {
  title: string;
  overall: string;
  status: string;
  data: SkillItem[];
  isloading: boolean
}

const SkillScoreShimmer = () => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Shimmer width="40%" height={18} />
        <Shimmer width={60} height={20} borderRadius={999} />
      </View>

      {/* Gradient bar */}
      <Shimmer height={44} borderRadius={8} />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[1, 2, 3].map(i => (
          <Shimmer key={i} width={70} height={28} borderRadius={8} />
        ))}
      </View>

      {/* Skill rows */}
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={styles.skillRow}>
          <View style={styles.leftRow}>
            <Shimmer width={20} height={20} borderRadius={10} />
            <Shimmer width={120} height={14} />
          </View>

          <Shimmer width={36} height={14} />
        </View>
      ))}

      {/* Divider */}
      <Shimmer height={1} width="100%" />

      {/* View more */}
      <View style={styles.viewMore}>
        <Shimmer width={80} height={14} />
      </View>
    </View>
  );
};


const SkillScore = ({ title, overall, status, data, isloading }: Props) => {

  const [activeTab, setActiveTab] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const tabs = ["All", "Matched", "Unmatched"];

  const filteredData =
    activeTab === "All"
      ? data
      : data.filter((item) =>
        activeTab === "Matched" ? item.matched : !item.matched
      );

  const visibleData = expanded ? filteredData : filteredData.slice(0, 5);
  if (isloading) {
    return <SkillScoreShimmer />
  }
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">{title}</Typography>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: getStatusStyles(status).backgroundColor,
              borderColor: getStatusStyles(status).borderColor,
            },
          ]}
        >
          <Typography
            variant="mediumTxtxs"
            color={getStatusStyles(status).textColor}
          >
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
            <Typography
              variant="mediumTxtsm"
              style={{ flex: 1 }}
              color={colors.gray[900]}
            >
              Overall score
            </Typography>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              {overall}%
            </Typography>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              setExpanded(false); // reset when switching tabs
            }}
            style={[
              styles.tabBtn,
              activeTab === tab ? styles.tabBtnActive : styles.tabBtnDeactive,
            ]}
          >
            <Typography
              variant="mediumTxtsm"
              color={
                activeTab === tab ? colors.brand[700] : colors.gray[700]
              }
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skill List */}
      {visibleData.map((item, index) => (
        <View key={index} style={styles.skillRow}>
          <View style={styles.leftRow}>
            {item.matched ? (
              <SvgXml xml={checkIcon} height={20} width={20} />
            ) : (
              <SvgXml xml={Wavy_CheckIcon} height={20} width={20} />
            )}
            <View  style={{
                  flex: 1,
                  flexShrink: 1,
                }}>
              <Typography
                variant="mediumTxtsm"
                color={item.matched ? colors.gray[900] : colors.gray[600]}
                numberOfLines={2}
              >
                {item.title}
              </Typography>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Typography variant="regularTxtxs" color={colors.gray[600]}>
                  {item.proficiencyLevel
                    ? item.proficiencyLevel.charAt(0).toUpperCase() +
                    item.proficiencyLevel.slice(1)
                    : ""}
                </Typography>

                {item.proficiencyEvidence && (
                  <InfoTooltip text={item.proficiencyEvidence}>
                    <SvgXml xml={infoIcon} height={15} width={15}/>
                  </InfoTooltip>
                )}
              </View>
            </View>

            <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
              {item.value}
            </Typography>
          </View>
        </View>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* View more — ALWAYS SHOWN */}
      <TouchableOpacity
        style={styles.viewMore}
        onPress={() => setExpanded(!expanded)}
      >
        <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
          {expanded ? "View less" : "View more"}
        </Typography>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.brand[500]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SkillScore;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 0.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap: 16,
    // shadowColor: '#0A0D12',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 1,
    ...shadowStyles.shadow_xs
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
    // alignItems: "center",
    gap: 8,
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
