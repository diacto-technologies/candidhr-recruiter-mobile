import React from 'react';
import { View, PanResponder } from 'react-native';
import Typography from '../../atoms/typography';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectJobFilters } from '../../../features/jobs/selectors';
import { setJobFilters } from '../../../features/jobs/slice';
import { useStyles, TRACK_WIDTH, THUMB_SIZE } from './styles';
import { ExperienceFilterProps } from './experiencefilter.d';

const ExperienceFilter: React.FC<ExperienceFilterProps> = () => {
  const dispatch = useAppDispatch();
  const jobFilters = useAppSelector(selectJobFilters);
  const styles = useStyles();

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

export default ExperienceFilter;

