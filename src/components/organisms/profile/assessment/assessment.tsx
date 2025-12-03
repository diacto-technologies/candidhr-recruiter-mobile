import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomTimeline from './timelinecard';
import AssessmentsDetails from './assessmentsdetails';
import Typography from '../../../atoms/typography';
import { colors } from '../../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { arrowDown, arrowDownGreenIcon } from '../../../../assets/svg/arrowdown';
import { leftArrowIcon } from '../../../../assets/svg/leftarrow';

export default function Assessment() {
  return (
    <View style={styles.container}>
      <View style={styles.shortListedCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, }}>
            <Text style={{ height: 8, width: 8, borderRadius: 30, backgroundColor: colors.success[500] }}></Text>
            <Typography variant='mediumTxtmd' color={colors.gray[900]}>Shortlisted</Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View>
      <View style={styles.shortListedCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent:'space-between' }}>
          <Typography variant='mediumTxtmd' color={colors.gray[900]}>Session</Typography>
          <SvgXml xml={arrowDown} />
        </View>
      </View>
      <CustomTimeline
        progress={50}
        data={[
          {
            title: "Invited On",
            date: "22 Aug 2025, 12:26 pm",
            status: "completed",
          },
          {
            title: "Link Opened",
            date: "22 Aug 2025, 12:28 pm",
            status: "completed",
          },
          {
            title: "Started",
            date: "—",
            status: "current",
          },
          {
            title: "Completed",
            date: "—",
            status: "upcoming",
          },
        ]}
      />

      <AssessmentsDetails />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
  shortListedCard: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  }
});
