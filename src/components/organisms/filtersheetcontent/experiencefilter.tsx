// components/ExperienceFilter.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';

interface Props {
  value: number;
  onValueChange: (value: number) => void;
}

const ExperienceFilter: React.FC<Props> = ({ value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Typography variant="P2M">
          {value} {value === 1 ? 'Year' : 'Years'}
        </Typography>
      </View>

      <View style={styles.sliderWrapper}>
        <Slider
         style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#6C4BE7"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor={colors.common.white}
        />
        {/* <View style={styles.labels}>
          <Typography variant="P2" color="#9CA3AF">0 Years</Typography>
          <Typography variant="P2" color="#9CA3AF">20+ Years</Typography>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
  badge: {
    alignSelf: 'flex-start',
  },
  sliderWrapper: { paddingHorizontal: 4 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default ExperienceFilter;