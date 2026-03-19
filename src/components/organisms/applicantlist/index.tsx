import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  DimensionValue,
  Share,
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
import { capitalizeFirstLetter } from '../../../utils/stringUtils';
import { SvgXml } from 'react-native-svg';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { DropdownMenu } from '../../molecules/dropdownmenu';
import ChangeStatusModal from '../changeStatusModal';
import ShareApplicationModal from '../shareApplicationModal';
import { userIcon } from '../../../assets/svg/usericon';
import { exportIcon } from '../../../assets/svg/export';
import { editIcon } from '../../../assets/svg/edit';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { updateApplicationStatusRequestAction } from '../../../features/applications/actions';
import { applicantUserIcon } from '../../../assets/svg/applicantUser';
import { shareIcon } from '../../../assets/svg/share';

interface ApplicantCardProps {
  item?: Application | null;
  loading?: boolean;
  cardWidth?: number
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
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const menuTriggerRef = useRef<View | null>(null);
  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const STATUS_OPTIONS = [
    { id: "shortlisted", name: "Shortlisted" },
    { id: "rejected", name: "Rejected" },
    { id: "on_hold", name: "On Hold" },
    { id: "interview_scheduled", name: "Interview Scheduled" },
    { id: "final_interview", name: "Final Interview" },
    { id: "hired", name: "Hired" },
    { id: "offer_extended", name: "Offer Extended" },
    { id: "offer_accepted", name: "Offer Accepted" },
    { id: "offer_rejected", name: "Offer Rejected" },
    { id: "not_selected", name: "Not Selected" },
    { id: "withdrawn", name: "Withdrawn" },
    { id: "archived", name: "Archived" },
  ];

  const handleOpenMenu = () => {
    if (menuTriggerRef.current && 'measureInWindow' in menuTriggerRef.current) {
      (menuTriggerRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setDropdownPosition({
            left: x + width - 140,
            top: y + height - 5,
          });
          setMenuVisible(true);
        }
      );
    } else {
      setMenuVisible(true);
    }
  };

  // If loading or no item provided -> show skeleton built from ShimmerBox
  if (loading || !item) {
    return (
      <View style={styles.card}>
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
  const handlePress = (application_id: string, job_id: string) => {
    navigate('ApplicantDetails', {
      application_id,
      job_id,
    });
  };

  return (
    <Pressable style={[styles.card]} onPress={() => handlePress(item?.id, item?.job?.id)}>
      {/* Top Row - Avatar + Name */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <View style={[styles.borderWrapper]}>
            {item?.candidate?.profile_pic ?
              <Image
                source={{ uri: item?.candidate?.profile_pic }}
                style={styles.avatar}
                resizeMode="cover"
              />
              :
              // <View style={[styles.initialCircle]}>
              <Typography variant="semiBoldTxtlg" color={colors?.gray[700]} style={{ paddingRight: 5 }}> {(item?.name?.trim()?.[0] ?? "?").toUpperCase()}</Typography>
              // </View>
            }
          </View>
          <View style={{ marginLeft: 12 }}>
            <Typography variant="semiBoldTxtmd">
              {item?.name ?? (item?.id ? "?" : '')}
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Applied on : {item?.applied_at ? formatMonDDYYYY(item?.applied_at) : "_"}
            </Typography>
          </View>
        </View>

        <View style={{ alignSelf: 'flex-start' }}>
          <View
            ref={(el) => {
              menuTriggerRef.current = el;
            }}
            collapsable={false}
          >
            <Pressable onPress={handleOpenMenu}>
              <SvgXml xml={horizontalThreedotIcon} height={20} width={20} />
            </Pressable>
          </View>
        </View>
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
        <View style={{ flex: 1 }}>
          <Typography variant="regularTxtsm" color={colors.gray[500]}>
            {item?.latest_stage?.stage_name ?? "_"}
          </Typography>
        </View>
        {item?.status &&
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item?.status_label) }]} />
            <Typography variant="mediumTxtxs" color={colors.gray[700]}>
              {item?.status_label ?? "_"}
            </Typography>
          </View>
        }
      </View>

      <DropdownMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        position={dropdownPosition}
        iconColor={colors?.gray[400]}
        dropdownStyle={{
          //borderRadius: 12,
          //backgroundColor: '#fff',
          //elevation: 8,
          // paddingRight:10
        }}
        width={160}
        itemStyle={{
          //paddingVertical: 12,
        }}
        textStyle={{
          color: 'red',
        }}
        iconStyle={{
          marginRight: 12,
        }}
        iconHight={20}
        iconWidth={20}
        items={[
          {
            label: 'Profile',
            icon: applicantUserIcon,
            onPress: () => {
              if (item?.id && item?.job?.id) {
                navigate('ApplicantDetails', {
                  application_id: item.id,
                  job_id: item.job.id,
                });
              }
            },
          },
          {
            label: 'Change status',
            icon: editIcon,
            onPress: () => {
              setChangeStatusVisible(true);
            },
          },
          {
            label: 'Share',
            icon: shareIcon,
            onPress: () => {
              setMenuVisible(false);
              setShareModalVisible(true);
            },
          },
        ]}
      />

      {item && (
        <ChangeStatusModal
          visible={changeStatusVisible}
          onClose={() => setChangeStatusVisible(false)}
          applicantName={item.name ?? ''}
          currentStatus={item.status ?? null}
          newStatusOptions={STATUS_OPTIONS}
          onUpdateStatus={(selectedStatusId) => {
            if (!item?.id) return;
            dispatch(
              updateApplicationStatusRequestAction({
                id: item.id,
                status: selectedStatusId,
              })
            );
          }}
          hideAddReason
          initialEmailMessage={
            'Hi {{candidate_name}},\n\nYour application status has been updated to "{{application_status}}".\n\nThanks,\n{{company}}'
          }
        />
      )}
      {item && (
        <ShareApplicationModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          applicationId={item.id}
          initialSharedMemberIds={item.users_shared_with ?? []}
        />
      )}
    </Pressable>
  );
};

export default ApplicantCard;

