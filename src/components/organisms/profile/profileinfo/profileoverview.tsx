import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import Typography from "../../../atoms/typography";
import VideoPlayerBox from "../../../molecules/videoplayer";
import { phoneIcon } from "../../../../assets/svg/phone";
import { SvgXml } from "react-native-svg";
import { copyIcon } from "../../../../assets/svg/copy";
import { emailIcon } from "../../../../assets/svg/email";
import { walletIcon } from "../../../../assets/svg/wallet";
import { currencyRuppeIcon } from "../../../../assets/svg/currencyruppe";
import { calenderIcon } from "../../../../assets/svg/calender";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectSelectedApplication } from "../../../../features/applications/selectors";
import { applicants } from "../../../../utils/dummaydata";
import { formatNoticePeriod } from "../../../../utils/experienceformatter";
import FooterButtons from "../../../molecules/footerbuttons";
import { useRNSafeAreaInsets } from "../../../../hooks/useRNSafeAreaInsets";

const OverviewCard = () => {
  const application = useAppSelector(selectSelectedApplication);
  const insets = useRNSafeAreaInsets();
  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">Overview</Typography>
      {/* Phone Number */}
      <View style={styles.videoBox}>
        <VideoPlayerBox
          source={
            application?.resume?.introduction_video
              ? application.resume.introduction_video
              : "https://www.w3schools.com/html/mov_bbb.mp4"
          }
        />
      </View>
      <View style={{ gap: 12 }}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <SvgXml xml={phoneIcon} height={20} width={20} />
          </View>
          <View style={styles.textBox}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>{application?.candidate?.contact ?? "_"}</Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Phone number
            </Typography>
          </View>

          <TouchableOpacity>
            <SvgXml xml={copyIcon} height={20} width={20} />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <SvgXml xml={emailIcon} height={20} width={20} />
          </View>

          <View style={styles.textBox}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>{application?.candidate?.email ?? "_"}</Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Email address
            </Typography>
          </View>

          <TouchableOpacity>
            <SvgXml xml={copyIcon} height={20} width={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Current Salary */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={walletIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>₹ {application?.current_ctc ?? "0"}</Typography>
          <Typography variant="P2" color={colors.gray[600]}>
            Current salary
          </Typography>
        </View>
      </View>

      {/* Expected Salary */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={currencyRuppeIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>₹ {application?.expected_ctc ?? "0"}</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Expected salary
          </Typography>
        </View>
      </View>
      {/* Notice Period */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={calenderIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>{application?.notice_period_in_months ?? 0}days</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Notice period
          </Typography>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={calenderIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>{application?.resume?.relevant_experience_in_months ?? 0}months</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Relevant Experience
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default OverviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 16,
    padding: 16,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.base.white,
    borderColor: colors.gray[300],
    justifyContent: "center",
    alignItems: "center",
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 1 },
    //shadowOpacity: 0.1,
    //shadowRadius: 2,
    //elevation: 1,
  },

  textBox: {
    flex: 1,
    marginLeft: 14,
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  videoBox: {
    flex: 1,
    width: "100%",
    //height: 180,
    borderRadius: 14,
    //overflow: "hidden",
    // position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  insetTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "rgba(10,13,18,0.05)",
    zIndex: 1,
  },

  insetBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "rgba(10,13,18,0.04)",
    zIndex: 1,
  },

});
