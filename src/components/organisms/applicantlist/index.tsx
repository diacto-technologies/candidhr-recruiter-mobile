import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable
} from 'react-native';
import { navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import { Typography } from '../../atoms';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';

interface ApplicantItem {
  id: string;
  name: string;
  appliedDate: string;
  jobRole: string;
  stage: string;
  status: string;
  avatar: string;
}

const ApplicantCard = ({ item }: { item: ApplicantItem }) => {
  const styles = useStyles();
  return (
    <Pressable style={styles.card} onPress={()=>navigate('ApplicantDetails')}>
      
      {/* Top Row - Avatar + Name + 3 Dots */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View>
            <Typography variant='semiBoldTxtmd'>{item.name}</Typography>
            <Typography variant='regularTxtsm' color={colors.gray[600]}>
              Applied on : {item.appliedDate}
            </Typography>
          </View>
        </View>

        <TouchableOpacity>
          <Typography style={styles.menu}>⋯</Typography>
        </TouchableOpacity>
      </View>

      {/* Applied For */}
      <Typography variant='regularTxtsm' color={colors.gray[600]}>
        Applied for : <Typography variant='mediumTxtsm' color={colors.gray[700]}>{item.jobRole}</Typography>
      </Typography>

      {/* Divider */}
     <Divider/>

      {/* Stage + Status Badge */}
      <View style={styles.rowBetween}>
        <Typography variant='regularTxtsm' color={colors.gray[500]}>{item.stage}</Typography>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Typography variant='mediumTxtxs' color={colors.gray[700]}>{item.status}</Typography>
        </View>
      </View>

    </Pressable>
  );
};

export default ApplicantCard;
