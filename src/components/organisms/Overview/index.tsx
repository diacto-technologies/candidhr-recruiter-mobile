import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectApplicationsDetailLoading, selectSelectedApplication } from "../../../features/applications/selectors";
import Shimmer from "../../../components/atoms/shimmer";
import Typography from "../../../components/atoms/typography";
import VideoPlayerBox from "../../../components/molecules/videoplayer";
import { SvgXml } from "react-native-svg";
import { phoneIcon } from "../../../assets/svg/phone";
import { emailIcon } from "../../../assets/svg/email";
import InfoRow from "../../../components/molecules/inforow";
import { colors } from "../../../theme/colors";
import { walletIcon } from "../../../assets/svg/wallet";
import { currencyRuppeIcon } from "../../../assets/svg/currencyruppe";
import { calenderIcon } from "../../../assets/svg/calender";
import { lockIcon } from "../../../assets/svg/lock";
import { eyeVisibleIcon } from "../../../assets/svg/eyevisible";
import { eyeHiddenIcon } from "../../../assets/svg/eyehiddenicon";
import Icon from "../../../components/atoms/vectoricon";
import { useStyles } from "./styles";
import { ApplicationContext, OverviewApplication } from "./overView";
import { PERMISSIONS } from "../../../utils/permission.constants";
import { usePermission } from "../../../hooks/usePermission";
import PermissionGate from "../../molecules/permissiongate";
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
  const { can } = usePermission();
  const [isCurrentSalaryVisible, setIsCurrentSalaryVisible] = useState(false);
  const [isExpectedSalaryVisible, setIsExpectedSalaryVisible] = useState(false);

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
    noticePeriodDays:
      ctx?.notice_period_in_months ??
      person?.notice_period_in_months ??
      0,
    relevantExpMonths:
      ctx?.relevant_experience_in_months ??
      application?.resume?.relevant_experience_in_months ??
      0,
  };

  const currentCtcNum = Number(data.currentCtc) || 0;
  const expectedCtcNum = Number(data.expectedCtc) || 0;
  const noticePeriodNum = Number(data.noticePeriodDays) || 0;
  const relevantExpNum = Number(data.relevantExpMonths) || 0;

  const hasBothCtc = currentCtcNum > 0 && expectedCtcNum > 0;
  const percentageChange = hasBothCtc
    ? Math.round((Math.abs(expectedCtcNum - currentCtcNum) / currentCtcNum) * 100)
    : null;
  const isPositive = expectedCtcNum >= currentCtcNum;

  const hasCurrentSalaryPermission = can(PERMISSIONS.View_Current_Salary);
  const hasExpectedSalaryPermission = can(PERMISSIONS.View_Expected_Salary);

  const showPercentageBadge =
    hasExpectedSalaryPermission &&
    isExpectedSalaryVisible &&
    hasCurrentSalaryPermission &&
    isCurrentSalaryVisible &&
    percentageChange !== null;

  return (
    <View style={styles.card}>
      <Typography variant="semiBoldTxtlg">Overview</Typography>
      {/* Phone Number */}
      <View style={styles.videoBox}>
        {data.introductionVideo &&
          <VideoPlayerBox
            source={data.introductionVideo}
          />
        }
      </View>
      <View style={{ gap: 12 }}>
        <PermissionGate permission={PERMISSIONS.view_applicant_mobile_number}>
          <InfoRow
            icon={phoneIcon}
            title="Phone number"
            value={data.contact}
            copyText={data.contact || undefined}
          />
        </PermissionGate>
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
          <Typography
            variant="semiBoldTxtsm"
            color={colors.gray[800]}
            style={
              !hasCurrentSalaryPermission || (currentCtcNum > 0 && !isCurrentSalaryVisible)
                ? styles.maskedText
                : undefined
            }
          >
            {!hasCurrentSalaryPermission
              ? '* * * * * * *'
              : currentCtcNum > 0
              ? isCurrentSalaryVisible
                ? `₹ ${currentCtcNum.toLocaleString('en-IN')}`
                : '* * * * * * *'
              : 'Not provided'}
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Current salary
          </Typography>
        </View>

        {!hasCurrentSalaryPermission ? (
          <View style={styles.actionIconBox}>
            <SvgXml xml={lockIcon} width={18} height={18} />
          </View>
        ) : currentCtcNum > 0 ? (
          <Pressable
            onPress={() => setIsCurrentSalaryVisible((prev) => !prev)}
            hitSlop={8}
            style={styles.actionIconBox}
            accessibilityRole="button"
            accessibilityLabel={isCurrentSalaryVisible ? 'Hide current salary' : 'Show current salary'}
          >
            <SvgXml
              xml={isCurrentSalaryVisible ? eyeVisibleIcon : eyeHiddenIcon}
              width={18}
              height={18}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Expected Salary */}
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={currencyRuppeIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography
              variant="semiBoldTxtsm"
              color={colors.gray[800]}
              style={
                !hasExpectedSalaryPermission || (expectedCtcNum > 0 && !isExpectedSalaryVisible)
                  ? styles.maskedText
                  : undefined
              }
            >
              {!hasExpectedSalaryPermission
                ? '* * * * * * *'
                : expectedCtcNum > 0
                ? isExpectedSalaryVisible
                  ? `₹ ${expectedCtcNum.toLocaleString('en-IN')}`
                  : '* * * * * * *'
                : 'Not provided'}
            </Typography>
            {showPercentageBadge && (
              <View
                style={[
                  styles.percentageBadge,
                  {
                    backgroundColor: isPositive ? colors.success[50] : colors.error[50],
                    borderColor: isPositive ? colors.success[200] : colors.error[200],
                  },
                ]}
              >
                <Icon
                  name={isPositive ? "trending-up" : "trending-down"}
                  iconFamily="Feather"
                  size={12}
                  color={isPositive ? colors.success[700] : colors.error[700]}
                />
                <Typography
                  variant="mediumTxtxs"
                  color={isPositive ? colors.success[700] : colors.error[700]}
                >
                  {percentageChange}%
                </Typography>
              </View>
            )}
          </View>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Expected salary
          </Typography>
        </View>

        {!hasExpectedSalaryPermission ? (
          <View style={styles.actionIconBox}>
            <SvgXml xml={lockIcon} width={18} height={18} />
          </View>
        ) : expectedCtcNum > 0 ? (
          <Pressable
            onPress={() => setIsExpectedSalaryVisible((prev) => !prev)}
            hitSlop={8}
            style={styles.actionIconBox}
            accessibilityRole="button"
            accessibilityLabel={isExpectedSalaryVisible ? 'Hide expected salary' : 'Show expected salary'}
          >
            <SvgXml
              xml={isExpectedSalaryVisible ? eyeVisibleIcon : eyeHiddenIcon}
              width={18}
              height={18}
            />
          </Pressable>
        ) : null}
      </View>
      {/* Notice Period */}

      <View style={styles.row}>
        <View style={styles.iconBox}>
          <SvgXml xml={calenderIcon} height={20} width={20} />
        </View>

        <View style={styles.textBox}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
            {noticePeriodNum > 0
              ? `${noticePeriodNum} ${noticePeriodNum === 1 ? 'day' : 'days'}`
              : 'Not provided'}
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
            {relevantExpNum > 0
              ? `${relevantExpNum} ${relevantExpNum === 1 ? 'month' : 'months'}`
              : 'Not provided'}
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
