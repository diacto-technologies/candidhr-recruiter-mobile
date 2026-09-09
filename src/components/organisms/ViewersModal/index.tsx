import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../../atoms';
import Icon from '../../atoms/vectoricon';
import { colors } from '../../../theme/colors';
import { formatTimeAgo } from '../../../utils/dateformatter';
import { ViewersModalProps } from './types';
import { styles } from './styles';

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const ViewersModal: React.FC<ViewersModalProps> = ({
  visible,
  onClose,
  viewersData,
  loading = false,
}) => {
  const results = viewersData?.results ?? [];
  const count = viewersData?.count ?? results.length;

  const headerTitle = useMemo(() => {
    return `Viewed by ${count} ${count === 1 ? 'person' : 'people'}`;
  }, [count]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              {headerTitle}
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <Icon name="close" size={18} color={colors.gray[400]} iconFamily="Ionicons" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.brand[600]} />
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Typography variant="regularTxtsm" color={colors.gray[500]}>
                No views yet
              </Typography>
            </View>
          ) : (
            <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
              {results.map((item, index) => {
                const viewerName = item.viewer?.name || item.viewer?.email || 'Unknown';
                const timeAgo = formatTimeAgo(item.last_viewed_at || item.first_viewed_at);

                return (
                  <View
                    key={item.viewer?.id ? `viewer-${item.viewer.id}-${index}` : `viewer-${index}`}
                    style={styles.viewerRow}
                  >
                    <View style={styles.viewerLeft}>
                      {item.viewer?.profile_pic ? (
                        <Image
                          source={{ uri: item.viewer.profile_pic }}
                          style={styles.avatar}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.initialsAvatar}>
                          <Typography variant="mediumTxtxs" color={colors.brand[700]}>
                            {getInitials(viewerName)}
                          </Typography>
                        </View>
                      )}
                      <Typography
                        variant="mediumTxtsm"
                        color={colors.gray[900]}
                        numberOfLines={1}
                        style={styles.viewerName}
                      >
                        {viewerName}
                      </Typography>
                    </View>

                    <Typography
                      variant="regularTxtsm"
                      color={colors.gray[500]}
                      style={styles.timeText}
                    >
                      {timeAgo}
                    </Typography>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ViewersModal;
