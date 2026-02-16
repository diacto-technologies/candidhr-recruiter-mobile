import React from 'react';
import { View, Image } from 'react-native';
import Card from '../../atoms/card';
import Typography from '../../atoms/typography';
import Divider from '../../atoms/divider';
import { SvgXml } from 'react-native-svg';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { useStyles } from './styles';
import { colors } from '../../../theme/colors';

const AssignedAssessmentCard = ({ item }: any) => {
  const styles = useStyles();

  return (
    <Card style={styles.card}>
      {/* ---------- TOP ROW ---------- */}
      <View style={styles.rowBetween}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: item.profile }}
              style={styles.avatar}
            />
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

        <SvgXml xml={horizontalThreedotIcon} width={20} height={20} style={{marginBottom:20}} />
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
          Assigned : {item.assignedDate}
        </Typography>

        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.statusColor || '#22C55E' }
            ]}
          />
          <Typography variant="mediumTxtxs">
            {item.status}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export default AssignedAssessmentCard;
