// components/ApplicantCard/index.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import { Typography } from '../../atoms';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';
import { Application } from '../../../features/applications/types';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { getStatusColor } from './helper';

interface ApplicantCardProps {
  item?: Application | null;
  loading?: boolean;
  cardWidth?:number
}
const ShimmerBox: React.FC<{
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}> = ({ width = '100%', height = 12, borderRadius = 6, }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: '#E6E6E6',
        },
      ]}
    >
      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
        <LinearGradient
          colors={['#E6E6E6', '#F2F2F2', '#E6E6E6']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const ApplicantCard: React.FC<ApplicantCardProps> = ({ item = null, loading = false, cardWidth }) => {
  const styles = useStyles();

  // If loading or no item provided -> show skeleton built from ShimmerBox
  if (loading || !item) {
    return (
      <View style={[styles.card,{width:cardWidth}]}>
        {/* Top row: avatar + two lines */}
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <ShimmerBox width={56} height={56} borderRadius={28} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <ShimmerBox width={'60%'} height={14} borderRadius={6} style={{ marginBottom: 8 }} />
              <ShimmerBox width={'40%'} height={12} borderRadius={6} />
            </View>
          </View>

          {/* <ShimmerBox width={24} height={24} borderRadius={12} /> */}
        </View>

        {/* Applied for lines */}
        <View style={{ marginTop: 12 }}>
          <ShimmerBox width={'45%'} height={12} borderRadius={6} style={{ marginBottom: 8 }} />
          <ShimmerBox width={'85%'} height={12} borderRadius={6} />
        </View>

        <Divider />

        {/* Footer: stage + status */}
        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <ShimmerBox width={'30%'} height={12} borderRadius={6} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShimmerBox width={12} height={12} borderRadius={6} />
            <ShimmerBox width={60} height={12} borderRadius={6} />
          </View>
        </View>
      </View>
    );
  }
  const handlePress = (application_id: string, job_id:string) => {
    navigate('ApplicantDetails', {
      application_id,
      job_id,
    });
  };

  return (
    <Pressable style={[styles.card,{width: cardWidth}]}  onPress={() => handlePress(item?.id, item?.job?.id)}>
      {/* Top Row - Avatar + Name */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Image
            source={{ uri: item?.profilePic || 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={{ marginLeft: 12 }}>
            <Typography variant="semiBoldTxtmd">{item?.name ?? "_"}</Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Applied on : {formatMonDDYYYY(item?.applied_at)}
            </Typography>
          </View>
        </View>

        <TouchableOpacity>
          <Typography style={styles.menu}>⋯</Typography>
        </TouchableOpacity>
      </View>

      {/* Applied For */}
      <Typography variant="regularTxtsm" color={colors.gray[600]}>
        Applied for :{' '}
        <Typography variant="mediumTxtsm" color={colors.gray[700]}>
          {item?.job?.title ?? "_"}
        </Typography>
      </Typography>

      <Divider />

      {/* Stage + Status */}
      <View style={styles.rowBetween}>
        <Typography variant="regularTxtsm" color={colors.gray[500]}>
          {item?.stage_name ?? "_"}
        </Typography>

        <View style={styles.statusBadge}>
          <View style={[styles.statusDot,{ backgroundColor: getStatusColor(item?.stages?.latest_status) } ]}/>
          <Typography variant="mediumTxtxs" color={colors.gray[700]}>
            {item?.stages?.latest_status ?? "_"}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

export default ApplicantCard;

