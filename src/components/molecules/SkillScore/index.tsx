import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SvgXml } from "react-native-svg";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import { useStyles } from "./styles";
import { Props } from "./skillscore";
import { colors } from "../../../theme/colors";
import { checkIcon } from "../../../assets/svg/check";
import { Wavy_CheckIcon } from "../../../assets/svg/wavy_check";
import InfoTooltip from "../../../components/atoms/Infotooltip";
import { infoIcon } from "../../../assets/svg/infoicon";

const TABS = ["All", "Matched", "Unmatched"];

const SkillScoreShimmer = () => {
  const styles = useStyles();
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


const SkillScore = ({ title, overall, data, isloading }: Props) => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const filteredData = React.useMemo(() => {
    if (activeTab === "All") return data;
    return data.filter((item) =>
      activeTab === "Matched" ? item.matched : !item.matched
    );
  }, [activeTab, data]);

  const visibleData = expanded ? filteredData : filteredData.slice(0, 5);
  if (isloading) {
    return <SkillScoreShimmer />
  }
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">{title}</Typography>
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
        {TABS.map((tab) => (
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
      {visibleData.map((item) => (
        <View key={item.title} style={styles.skillRow}>
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
                {item.proficiencyEvidence && (
                  <InfoTooltip text={item.proficiencyEvidence}>
                    <SvgXml xml={infoIcon} height={15} width={15} style={{marginLeft:10}}/>
                  </InfoTooltip>
                )}
              </Typography>
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


