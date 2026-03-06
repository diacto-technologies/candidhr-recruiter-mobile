import React from 'react';
import { View, Image } from 'react-native';
import Card from '../../atoms/card';
import Typography from '../../atoms/typography';
import Divider from '../../atoms/divider';
import Shimmer from '../../atoms/shimmer';
import { SvgXml } from 'react-native-svg';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { useStyles } from './styles';
import { colors } from '../../../theme/colors';
import { getStatusColor } from '../../organisms/applicantlist/helper';
import { navigate } from '../../../utils/navigationUtils';
import { formatMonDDYYYY } from '../../../utils/dateformatter';

const AssignedAssessmentCard = ({ item }: any) => {
  const styles = useStyles();

  return (
    <Card style={styles.card} onPress={() =>  navigate('ApplicantDetails', {
      application_id:item?.application_id,
      tab:'Assessments'
    })}>
      {/* ---------- TOP ROW ---------- */}
      <View style={styles.rowBetween}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
              <Typography variant="semiBoldTxtlg" color={colors?.gray[700]} style={{ paddingRight: 5 }}> {(item?.name?.trim()?.[0] ?? "").toUpperCase()}</Typography>
          </View>

          <View>
            <Typography variant="semiBoldTxtmd">
              {item.name}
            </Typography>

            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {item.email}
            </Typography>
          </View>
        </View>

        <SvgXml xml={horizontalThreedotIcon} width={20} height={20} style={{ marginBottom: 20 }} />
      </View>

      {/* ---------- INFO SECTION ---------- */}
      <View style={styles.infoSection}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Job : <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>{item.job}</Typography>
        </Typography>

        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Assigned by : <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>{item.assignedBy}</Typography>
        </Typography>
      </View>

      <Divider />

      {/* ---------- BOTTOM ROW ---------- */}
      <View style={styles.rowBetween}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Assigned : {formatMonDDYYYY(item?.assignedDate,"MMM DD YYYY")}
        </Typography>

        <View style={styles.statusBadge}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor(item?.status) }]}
          />
          <Typography variant="mediumTxtxs">
            {item.status}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export const AssignedAssessmentCardShimmer: React.FC = () => {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      {/* ---------- TOP ROW (SHIMMER) ---------- */}
      <View style={styles.rowBetween}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Shimmer width={40} height={40} borderRadius={20} />
          </View>

          <View>
            <Shimmer width={140} height={16} borderRadius={6} style={{ marginBottom: 6 }} />
            <Shimmer width={110} height={12} borderRadius={6} />
          </View>
        </View>

        <Shimmer width={20} height={20} borderRadius={10} />
      </View>

      {/* ---------- INFO SECTION (SHIMMER) ---------- */}
      <View style={styles.infoSection}>
        <Shimmer width="70%" height={14} borderRadius={6} style={{ marginBottom: 8 }} />
        <Shimmer width="65%" height={14} borderRadius={6} />
      </View>

      <Divider />

      {/* ---------- BOTTOM ROW (SHIMMER) ---------- */}
      <View style={styles.rowBetween}>
        <Shimmer width="40%" height={14} borderRadius={6} />

        <View style={styles.statusBadge}>
          <Shimmer width={8} height={8} borderRadius={4} style={{ marginRight: 6 }} />
          <Shimmer width={60} height={14} borderRadius={6} />
        </View>
      </View>
    </Card>
  );
};

export default AssignedAssessmentCard;
