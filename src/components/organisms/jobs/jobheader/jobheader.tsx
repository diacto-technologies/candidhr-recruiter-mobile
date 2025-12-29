import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { locationIcon } from "../../../../assets/svg/location";
import { useStyles } from "./styles";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../../features/jobs/selectors";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";

const JobHeader = () => {
  const styles = useStyles();
  const jobs = useAppSelector(selectSelectedJob);
  const loading = useAppSelector(selectJobsLoading);
  const closeDate = jobs?.close_date ? new Date(jobs.close_date) : null;
  const isClosed = closeDate ? closeDate < new Date() : false;
  return (
    <View style={styles.container}>
      <Typography variant="semiBoldTxtxl">{jobs?.title ?? ""}</Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="mediumTxtsm" color={colors.gray[700]}>{jobs?.views_count ?? ""} applicants</Typography>
        <View style={styles.dot}></View>
        <Typography variant="regularTxtsm" color={colors.gray[500]}>{formatMonDDYYYY(jobs?.created_at ?? "")}</Typography>
      </View>
      <View style={{ gap: 10 }}>
        <View style={styles.row}>
          <SvgXml xml={locationIcon} />
          <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ paddingLeft: 8 }}>{jobs?.location + "," + jobs?.owner?.state ?? ""}</Typography>
        </View>
        <View style={styles.chipRow}>
          <View style={[styles.chip, { backgroundColor: colors.brand[50], borderColor: colors.brand[200] }]}>
            <Typography variant="mediumTxtxs" color={colors.brand[700]}>{jobs?.employment_type ?? ""}</Typography>
          </View>

          <View style={[styles.chip, { backgroundColor: colors.Teal[50], borderColor: colors.Teal[200] }]}>
            <Typography variant="mediumTxtxs" color={colors.Teal[700]}>{jobs?.min_experience ?? ""} - {jobs?.max_experience ?? ""} Yrs</Typography>
          </View>

          {/* <View style={[styles.chip,{backgroundColor:colors.orange[50],borderColor:colors.orange[200]}]}>
        <Typography variant="mediumTxtxs" color={colors.orange[700]}>8 - 10 LPA</Typography>
        </View> */}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography variant='regularTxtsm' color={colors.gray[500]}>Closed on :</Typography>
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>{formatMonDDYYYY(jobs?.close_date ?? "")}</Typography>
          <View style={[styles.close, { backgroundColor: colors.error[50], borderColor: colors.error[200] }]}>
            {isClosed ? (
              <Typography
                variant="mediumTxtxs"
                color={colors.error[700]}
              >
                Closed
              </Typography>
            ) : (
              <Typography
              variant="mediumTxtxs"
              color={colors.error[700]}
              >
                Open
              </Typography>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default JobHeader;