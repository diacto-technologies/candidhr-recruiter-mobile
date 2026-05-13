import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import { selectApplicationsDetailLoading, selectSelectedApplication } from "../../../../../../features/applications/selectors";
import Shimmer from "../../../../../../components/atoms/shimmer";
import Typography from "../../../../../../components/atoms/typography";
import VideoPlayerBox from "../../../../../../components/molecules/videoplayer";
import { SvgXml } from "react-native-svg";
import { phoneIcon } from "../../../../../../assets/svg/phone";
import CopyText from "../../../../../../components/molecules/copyText";
import { copyIcon } from "../../../../../../assets/svg/copy";
import { emailIcon } from "../../../../../../assets/svg/email";
import { colors } from "../../../../../../theme/colors";
import { walletIcon } from "../../../../../../assets/svg/wallet";
import { currencyRuppeIcon } from "../../../../../../assets/svg/currencyruppe";
import { calenderIcon } from "../../../../../../assets/svg/calender";
import { useStyles } from "./styles";
import { ApplicationContext, OverviewApplication } from "./overView";
const fallbackContext: ApplicationContext = {};

const OverviewCardShimmer = () => {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <Shimmer height={20} width="40%" />

      <Shimmer height={180} borderRadius={14} />

      {[1, 2, 3, 4].map(i => (
        <View key={i} style={styles.row}>
          <Shimmer width={40} height={40} borderRadius={8} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Shimmer width="60%" height={14} />
            <Shimmer width="40%" height={12} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

const OverviewCard = () => {
  const styles = useStyles();
  const application = useAppSelector(selectSelectedApplication) as OverviewApplication | null;
  const loading = useAppSelector(selectApplicationsDetailLoading);
  if (loading) {
    return <OverviewCardShimmer />;
  }

  // API payloads can have `applicant` (list/filter API) or `candidate` (detail API).
  const person = application?.applicant ?? application?.candidate;
  const ctx = application?.application_context ?? fallbackContext;

  const data = {
    contact: String(person?.contact ?? ""),
    email: String(person?.email ?? ""),
    introductionVideo:
      person?.introduction_video ??
      application?.resume?.introduction_video ??
      "",
    currentCtc:
      ctx?.current_ctc ?? application?.current_ctc ?? 0,
    expectedCtc:
      ctx?.expected_ctc ?? application?.expected_ctc ?? 0,
    noticePeriodMonths:
      ctx?.notice_period_in_months ??
      person?.notice_period_in_months ??
      0,
    relevantExpMonths:
      ctx?.relevant_experience_in_months ??
      application?.resume?.relevant_experience_in_months ??
      0,
  };

  const InfoRow = ({
    icon,
    title,
    value,
    copyText,
  }: {
    icon: string;
    title: string;
    value: string;
    copyText?: string;
  }) => (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <SvgXml xml={icon} height={20} width={20} />
      </View>

      <View style={styles.textBox}>
        <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
          {value || "Not provided"}
        </Typography>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          {title}
        </Typography>
      </View>

      {!!copyText && (
        <CopyText text={copyText} message={`${title} copied`}>
          <SvgXml xml={copyIcon} height={20} width={20} />
        </CopyText>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">Overview</Typography>
      {/* Phone Number */}
      <View style={styles.videoBox}>
        <VideoPlayerBox
          source={data.introductionVideo}
        />
      </View>
      <View style={{ gap: 12 }}>
        <InfoRow
          icon={phoneIcon}
          title="Phone number"
          value={data.contact}
          copyText={data.contact || undefined}
        />

        {/* Email */}
        <InfoRow
          icon={emailIcon}
          title="Email address"
          value={data.email}
          copyText={data.email || undefined}
        />
      </View>
      <View style={styles.divider} />

      {/* Current Salary */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={walletIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            ₹ {data.currentCtc || 0}
          </Typography>
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
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            ₹ {data.expectedCtc || 0}
          </Typography>
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
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            {data.noticePeriodMonths || 0} months
          </Typography>
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
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            {data.relevantExpMonths || 0} months
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Relevant Experience
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default OverviewCard;
