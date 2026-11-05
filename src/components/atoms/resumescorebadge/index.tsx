import React, { useMemo } from 'react';
import { View } from 'react-native';
import Typography from '../typography';
import {
  getResumeScoreColorInfo,
  getCandidateResumeScoreInfo,
  ResumeScoreColorInfo,
} from '../../../utils/resumeScore';
import { ResumeScoreBadgeProps } from './resumescorebadge.d';
import { useStyles } from './styles';

const ResumeScoreBadge: React.FC<ResumeScoreBadgeProps> = ({
  score,
  candidate,
  size = 'md',
  showLabel = false,
  style,
  textStyle,
  fallbackText,
}) => {
  const styles = useStyles();

  const scoreInfo: ResumeScoreColorInfo | null = useMemo(() => {
    if (score != null) {
      return getResumeScoreColorInfo(score);
    }
    if (candidate) {
      return getCandidateResumeScoreInfo(candidate);
    }
    return null;
  }, [score, candidate]);

  if (!scoreInfo) {
    if (!fallbackText) return null;
    return (
      <View style={[styles.badge, styles.badgeMd, style]}>
        <Typography variant="boldTxtsm" color="#717680" style={textStyle}>
          {fallbackText}
        </Typography>
      </View>
    );
  }

  const sizeBadgeStyle =
    size === 'sm' ? styles.badgeSm : size === 'lg' ? styles.badgeLg : styles.badgeMd;
  const sizeTextStyle =
    size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;
  const typographyVariant =
    size === 'sm' ? 'boldTxtxs' : size === 'lg' ? 'boldTxtmd' : 'boldTxtsm';

  return (
    <View
      style={[
        styles.badge,
        sizeBadgeStyle,
        { backgroundColor: scoreInfo.bg },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Resume score ${scoreInfo.formatted}, ${scoreInfo.tierLabel}`}
    >
      <Typography
        variant={typographyVariant}
        color={scoreInfo.fg}
        style={[sizeTextStyle, textStyle]}
      >
        {scoreInfo.formatted}
      </Typography>
      {showLabel ? (
        <Typography variant="regularTxtxs" color={scoreInfo.fg} style={styles.labelText}>
          {scoreInfo.tierLabel}
        </Typography>
      ) : null}
    </View>
  );
};

export default React.memo(ResumeScoreBadge);

