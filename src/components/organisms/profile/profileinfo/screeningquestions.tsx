import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { playIcon } from "../../../../assets/svg/play";

interface QuestionItem {
  id: number;
  type: "audio" | "mcq" | "text";
  question: string;
  response?: string;
  expectedResponse?: string;
  audioDuration?: string;
  textAnswer?: string;
}

interface Props {
  data: QuestionItem[];
}

const ScreeningQuestions = ({ data }: Props) => {
  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "MCQ’s", "Audio", "Text"];

  const filteredData =
    selectedTab === "All"
      ? data
      : data.filter((item) => {
          if (selectedTab === "MCQ’s") return item.type === "mcq";
          if (selectedTab === "Audio") return item.type === "audio";
          if (selectedTab === "Text") return item.type === "text";
          return true;
        });

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">
        Screening questions
      </Typography>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabBtn,
              selectedTab === tab ? styles.tabBtnActive: styles.tabBtnDeactive,
            ]}
          >
            <Typography
              variant="mediumTxtsm"
              color={selectedTab === tab ? colors.brand[700] : colors.gray[700]}
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question List */}
      {filteredData.map((item) => (
        <View key={item.id} style={styles.innerCard}>
          <View style={{flexDirection:'row'}}>
           <Typography variant="mediumTxtmd" color="#1F2937">
            {item.id}. {""}
          </Typography>
          <Typography variant="mediumTxtmd" color="#1F2937">
           {item.question}
          </Typography>
          </View>

          {/* AUDIO TYPE */}
          {item.type === "audio" && (
            <View style={styles.audioBox}>
               <SvgXml xml={playIcon} height={20} width={25} color={colors.gray[700]}/>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                0:00
              </Typography>

              <View style={styles.audioProgress}>
                <View style={styles.audioFilled} />
              </View>

              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {item.audioDuration || "1:23"}
              </Typography>
            </View>
          )}

          {/* MCQ TYPE */}
          {item.type === "mcq" && (
            <>
              <View style={styles.row}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Response :
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.error[500]}>
                  {"  "}
                  {item.response}
                </Typography>
              </View>

              <View style={styles.row}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  Expected response :
                </Typography>
                <Typography variant="semiBoldTxtsm" color={colors.success[500]}>
                  {"  "}
                  {item.expectedResponse}
                </Typography>
              </View>
            </>
          )}

          {/* TEXT TYPE */}
          {item.type === "text" && (
            <Typography
              variant="P2"
              color={colors.gray[700]}
              style={{ marginTop: 4 }}
            >
              {item.textAnswer}
            </Typography>
          )}
        </View>
      ))}
    </View>
  );
};

export default ScreeningQuestions;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    gap:16,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tabBtn: {
    paddingVertical:4,
    paddingHorizontal:12,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    backgroundColor: colors.gray[100],
  },
  tabBtnActive: {
    backgroundColor: colors.brand[50],
    borderColor: colors.brand[200],
    borderWidth: 1,
  },
  tabBtnDeactive:{
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderWidth: 1,
  },
  innerCard: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    padding: 12,
    gap:12,
  },
  question: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[100],
    padding: 12,
    gap:8,
    borderRadius:8,
  },
  audioProgress: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  audioFilled: {
    width: "45%",
    height: "100%",
    backgroundColor: colors.brand[600],
  },
});
