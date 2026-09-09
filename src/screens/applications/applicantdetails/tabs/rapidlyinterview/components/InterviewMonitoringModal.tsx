import React, { useMemo, useCallback } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Typography } from '../../../../../../components';
import { colors } from '../../../../../../theme/colors';
import { useStyles } from '../styles';
import {
  ProctoringData,
  ProctoringByQuestion,
  ProctoringObserved,
} from '../../../../../../features/rapidhire/types';
import { smartphoneIcon } from '../../../../../../assets/svg/smartphone';
import { laptopIcon } from '../../../../../../assets/svg/laptop';
import { exitIcon } from '../../../../../../assets/svg/exitlink';
import { fullscreenIcon } from '../../../../../../assets/svg/fullscreen';
import { cameraIcon } from '../../../../../../assets/svg/camera';
import { microphoneIcon } from '../../../../../../assets/svg/microphone';
import { pageReloadIcon } from '../../../../../../assets/svg/pageReload';
import { modalCloseIcon } from '../../../../../../assets/svg/closeicon';

// ─── Props ────────────────────────────────────────────────────────────────────

interface InterviewMonitoringModalProps {
  visible: boolean;
  onClose: () => void;
  proctoring: ProctoringData | null | undefined;
  candidateName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InterviewMonitoringModal: React.FC<InterviewMonitoringModalProps> = React.memo(({
  visible,
  onClose,
  proctoring,
  candidateName,
}) => {
  const styles = useStyles();

  const deviceHeadline = proctoring?.device_label?.headline ?? '';
  const deviceDetails = proctoring?.device_label?.details?.join(' · ') ?? '';

  const isMobileDevice = useMemo(() => {
    const platform = (proctoring?.device?.platform ?? '').toLowerCase();
    const headline = (proctoring?.device_label?.headline ?? '').toLowerCase();
    const userAgent = (proctoring?.device?.user_agent ?? '').toLowerCase();
    return (
      platform.includes('android') ||
      platform.includes('ios') ||
      platform.includes('iphone') ||
      platform.includes('ipad') ||
      platform.includes('mobile') ||
      headline.includes('android') ||
      headline.includes('ios') ||
      headline.includes('iphone') ||
      headline.includes('mobile') ||
      userAgent.includes('android') ||
      userAgent.includes('mobile')
    );
  }, [proctoring?.device, proctoring?.device_label]);

  const questions: ProctoringByQuestion[] = useMemo(
    () => proctoring?.by_question ?? [],
    [proctoring?.by_question],
  );

  const maxCount = useMemo(
    () => Math.max(1, ...questions.map(q => q.count)),
    [questions],
  );

  const observations: ProctoringObserved[] = useMemo(
    () => proctoring?.observed ?? [],
    [proctoring?.observed],
  );

  const firstName = useMemo(() => {
    if (!candidateName) return '';
    return candidateName.split(' ')[0];
  }, [candidateName]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const getObservationStyle = useCallback((obs: ProctoringObserved) => {
    const iconKey = (obs.icon || obs.key || '').toLowerCase();
    const isAmber =
      Boolean(obs.notable) ||
      iconKey.includes('exit') ||
      iconKey.includes('fullscreen') ||
      iconKey.includes('away');

    if (isAmber) {
      return {
        type: 'amber' as const,
        iconColor: '#D97706',
        containerStyle: styles.monitoringObservedIconAmber,
        sentenceVariant: 'semiBoldTxtsm' as const,
        tagColor: '#B54708',
        tagVariant: 'semiBoldTxtsm' as const,
      };
    }

    return {
      type: 'purple' as const,
      iconColor: '#645CE7',
      containerStyle: styles.monitoringObservedIconPurple,
      sentenceVariant: 'regularTxtsm' as const,
      tagColor: colors.gray[500],
      tagVariant: 'regularTxtsm' as const,
    };
  }, [styles]);

  const renderObservationIcon = useCallback((obs: ProctoringObserved) => {
    const obsStyle = getObservationStyle(obs);
    const iconKey = (obs.icon || obs.key || '').toLowerCase();
    let xml = exitIcon(obsStyle.iconColor);

    if (
      iconKey.includes('reload') ||
      iconKey.includes('refresh') ||
      obs.sentence?.toLowerCase().includes('reload')
    ) {
      xml = pageReloadIcon(obsStyle.iconColor);
    } else if (iconKey.includes('fullscreen')) {
      xml = fullscreenIcon(obsStyle.iconColor);
    } else if (iconKey.includes('camera')) {
      xml = cameraIcon(obsStyle.iconColor);
    } else if (iconKey.includes('mic')) {
      xml = microphoneIcon(obsStyle.iconColor);
    } else if (iconKey.includes('exit') || iconKey.includes('away') || iconKey.includes('leave')) {
      xml = exitIcon(obsStyle.iconColor);
    }

    return (
      <View style={[styles.monitoringObservedIcon, obsStyle.containerStyle]}>
        <SvgXml xml={xml} width={20} height={20} />
      </View>
    );
  }, [getObservationStyle, styles]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={handleClose} />
        <View style={styles.modalContainer}>

          {/* ── Header ──────────────────────────────────────────────── */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.flex1}>
              <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
                Interview monitoring
              </Typography>
              <Typography
                variant="regularTxtsm"
                color={colors.gray[600]}
                style={styles.marginTop2}
              >
                {firstName ? `Reported by ${firstName}'s browser` : "Reported by candidate's browser"}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeButton}
            >
              <SvgXml xml={modalCloseIcon(colors.gray[500])} width={22} height={22} />
            </TouchableOpacity>
          </View>

          {/* ── Body ────────────────────────────────────────────────── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalScroll}
          >

            {/* Device Used */}
            <Typography
              variant="semiBoldTxtxs"
              color={colors.gray[500]}
              style={styles.monitoringSectionHeader}
            >
              DEVICE USED
            </Typography>

            <View style={styles.monitoringDeviceCard}>
              <View style={styles.monitoringDeviceIconWrap}>
                <SvgXml
                  xml={isMobileDevice ? smartphoneIcon(colors.gray[700]) : laptopIcon(colors.gray[700])}
                  width={22}
                  height={22}
                />
              </View>
              <View style={styles.monitoringDeviceTextWrap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                  {deviceHeadline || 'Unknown device'}
                </Typography>
                {deviceDetails ? (
                  <Typography variant="regularTxtxs" color={colors.gray[500]}>
                    {deviceDetails}
                  </Typography>
                ) : null}
              </View>
            </View>

            {/* Where It Happened — bar chart */}
            {questions.length > 0 && (
              <>
                <Typography
                  variant="semiBoldTxtxs"
                  color={colors.gray[500]}
                  style={styles.monitoringSectionHeader}
                >
                  WHERE IT HAPPENED
                </Typography>

                <View style={styles.monitoringBarChart}>
                  {questions.map((q) => {
                    const hasSignals = q.count > 0;
                    const fillPercent = hasSignals
                      ? Math.max(15, Math.round((q.count / maxCount) * 100))
                      : 0;

                    return (
                      <View key={q.label} style={styles.monitoringBarItem}>
                        <View style={styles.monitoringBarCountWrap}>
                          {hasSignals ? (
                            <Typography
                              variant="semiBoldTxtxs"
                              color={colors.brand[600]}
                            >
                              {q.count}
                            </Typography>
                          ) : null}
                        </View>
                        <View style={styles.monitoringBarTrack}>
                          {hasSignals ? (
                            <View
                              style={[
                                styles.monitoringBarFill,
                                { height: `${fillPercent}%` },
                              ]}
                            />
                          ) : null}
                        </View>
                        <Typography
                          variant={hasSignals ? 'semiBoldTxtxs' : 'mediumTxtxs'}
                          color={hasSignals ? colors.brand[600] : colors.gray[400]}
                          style={styles.monitoringBarLabel}
                        >
                          {q.label}
                        </Typography>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* What Was Observed */}
            {observations.length > 0 && (
              <>
                <Typography
                  variant="semiBoldTxtxs"
                  color={colors.gray[500]}
                  style={styles.monitoringSectionHeader}
                >
                  WHAT WAS OBSERVED
                </Typography>

                <View style={styles.monitoringObservedList}>
                  {observations.map((obs) => {
                    const obsStyle = getObservationStyle(obs);

                    return (
                      <View key={obs.key} style={styles.monitoringObservedRow}>
                        {renderObservationIcon(obs)}

                        <View style={styles.flex1}>
                          <Typography
                            variant={obsStyle.sentenceVariant}
                            color={colors.gray[900]}
                          >
                            {obs.sentence}
                          </Typography>
                        </View>

                        {obs.where ? (
                          <Typography
                            variant={obsStyle.tagVariant}
                            color={obsStyle.tagColor}
                          >
                            {obs.where}
                          </Typography>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </ScrollView>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <View style={styles.monitoringFooter}>
            <Typography variant="regularTxtxs" color={colors.gray[500]}>
              Observations from the candidate's browser during the interview. They
              are not a judgement and were not used to score this candidate.
            </Typography>
          </View>
        </View>
      </View>
    </Modal>
  );
});
