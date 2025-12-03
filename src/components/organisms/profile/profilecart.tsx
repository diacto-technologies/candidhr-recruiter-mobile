import React, { Fragment } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../theme/colors';
import { Typography } from '../../atoms';
import { SvgXml } from 'react-native-svg';
import Icon from '../../atoms/vectoricon';
import { jobIcon } from '../../../assets/svg/jobicon';
import { locationIcon } from '../../../assets/svg/location';
import { singleDotIcon } from '../../../assets/svg/singledot';

const ProfileCart = () => {
  return (
    <View style={styles.container}> 
      <LinearGradient
        colors={[colors.brand[100], '#E3E1FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      />
      <View style={styles.photoWrapper}>
        <View style={styles.photoBorder}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/35.jpg' }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={{ gap: 4 }}>
          <Typography variant="semiBoldDxs">Sachin patidar</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Applied on: Aug 16, 2025, for{' '}
            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              Frontend developer
            </Typography>
          </Typography>

          <View style={styles.row}>
            <SvgXml xml={locationIcon} width={16} height={16} />
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Pune, Maharashtra
            </Typography>
            <SvgXml xml={singleDotIcon} />
            <SvgXml xml={jobIcon} height={20} width={20} />
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              3 years
            </Typography>
          </View>
        </View>

        {/* Social Icons */}
        <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <Icon name="logo-linkedin" size={20} color="#0A66C2" iconFamily="Ionicons" />
          </View>
          <View style={styles.iconBox}>
            <Icon name="logo-github" size={20} color="#000" iconFamily="Ionicons" />
          </View>
          <View style={styles.iconBox}>
            <Icon name="globe" size={20} color="#444" iconFamily="Entypo" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.white,
    overflow: 'hidden', 
  },
  header: {
    height:90,
    borderRadius: 12,
    margin:4
  },
  photoWrapper: {
    position: 'absolute',
    top: 35,
    left: 24,
    zIndex: 10,
  },
  photoBorder: {
    width: 96,
    height: 96,
    borderRadius:50,
    backgroundColor: colors.base.white,
    padding: 4,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  infoContainer: {
    paddingHorizontal:16,
    paddingTop: 52,
    paddingBottom: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.base.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default ProfileCart;