import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectJobFilters } from '../../../features/jobs/selectors';
import { setJobFilters } from '../../../features/jobs/slice';

const { width } = Dimensions.get('window');

// Track = 80% of screen width
const TRACK_WIDTH = width * 0.48;
const THUMB_SIZE = 26;

const ExperienceFilter = () => {
  const dispatch = useAppDispatch();
  const jobFilters = useAppSelector(selectJobFilters);

  const value = Number(jobFilters.experience || 0);
  const min = 0;
  const max = 40;
  const step = 1;

  const ratio = (value - min) / (max - min);
  const thumbX = ratio * TRACK_WIDTH;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (_, g) => {
      let newX = Math.min(Math.max(g.dx + thumbX, 0), TRACK_WIDTH);
      let newValue = min + (newX / TRACK_WIDTH) * (max - min);

      newValue = Math.round(newValue / step) * step;

      dispatch(
        setJobFilters({
          ...jobFilters,
          experience: String(newValue),
        })
      );
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Typography variant="mediumTxtmd">
          {value} {value <= 1 ? 'Year' : 'Years'}
        </Typography>
      </View>

      <View style={styles.sliderContainer}>
        <View style={[styles.track, { width: TRACK_WIDTH }]} />

        <View style={[styles.trackFill, { width: thumbX }]} />

        <View
          {...panResponder.panHandlers}
          style={[styles.thumb, { left: thumbX - THUMB_SIZE / 2 }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: width * 0.076,
  },

  badge: {
    alignSelf: 'flex-start',
    //marginLeft: 10,
  },

  sliderContainer: {
    marginTop: 14,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  track: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 6,
    position: 'absolute',
  },

  trackFill: {
    height: 6,
    backgroundColor: colors.brand[600],
    borderRadius: 6,
    position: 'absolute',
    left: 0,
  },

  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: colors.common.white,
    borderRadius: THUMB_SIZE,
    borderWidth: 2,
    borderColor: colors.brand[600],
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default ExperienceFilter;
