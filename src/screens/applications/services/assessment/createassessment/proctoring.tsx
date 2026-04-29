import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CustomSafeAreaView from '../../../../../components/atoms/customsafeareaview';
import Header from '../../../../../components/organisms/header';
import { goBack, navigate } from '../../../../../utils/navigationUtils';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/atoms/typography';
import { useRoute } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import FooterButtons from '../../../../../components/molecules/footerbuttons';
import Card from '../../../../../components/atoms/card';
import CustomSwitch from '../../../../../components/atoms/switchbutton';
import NumberStepper from '../../../../../components/atoms/numberstepper';
import { Label } from '../../../../../components';
import { SvgXml } from 'react-native-svg';
import { fullScreenIcon } from '../../../../../assets/svg/fullscreen';
import { tabSwitchIcon } from '../../../../../assets/svg/tabswitch';
import { shieldIcon } from '../../../../../assets/svg/shield';
import { cameraIcon } from '../../../../../assets/svg/camera';
import { eyeVisibleIcon } from '../../../../../assets/svg/eyevisible';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import {
  submitBlueprintRequest,
  resetAssessmentCreateWizard,
} from '../../../../../features/assessments/slice';
import {
  selectSubmitBlueprintLoading,
  selectSubmitBlueprintError,
  selectLastSubmitBlueprint,
  selectLoadBlueprintForEditLoading,
  selectAssessmentCreateWizardProctoringDraft,
  selectAssessmentCreateWizardBasicInfo,
  selectAssessmentCreateWizardLoadBlueprintDetail,
  selectAssessmentCreateWizardBlueprintId,
} from '../../../../../features/assessments/selectors';
import type { AssessmentCreateWizardProctoring } from '../../../../../features/assessments/types';
import { showToastMessage } from '../../../../../utils/toast';

const PROCTORING_DEFAULTS: AssessmentCreateWizardProctoring = {
  fullscreen: true,
  tabSwitch: true,
  copyPaste: false,
  rightClick: false,
  singleScreen: false,
  webcam: true,
  eyeGaze: false,
  autoSubmit: false,
  maxTabSwitch: 3,
  maxFullscreenExit: 3,
};

const Proctoring = () => {
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const submitLoading = useSelector(selectSubmitBlueprintLoading);
  const submitError = useSelector(selectSubmitBlueprintError);
  const lastSaved = useSelector(selectLastSubmitBlueprint);
  const loadBlueprintLoading = useSelector(selectLoadBlueprintForEditLoading);
  const proctoringDraft = useSelector(selectAssessmentCreateWizardProctoringDraft);
  const wizardBasic = useSelector(selectAssessmentCreateWizardBasicInfo);
  const loadBlueprintDetail = useSelector(
    selectAssessmentCreateWizardLoadBlueprintDetail
  );
  const wizardBlueprintId = useSelector(selectAssessmentCreateWizardBlueprintId);
  const isBlueprintPublished = Boolean(
    wizardBasic?.is_published ?? loadBlueprintDetail?.is_published
  );
  const routeBlueprintId =
    typeof route.params?.blueprintId === 'string'
      ? route.params.blueprintId.trim()
      : '';
  const isEditingExistingBlueprint = Boolean(
    routeBlueprintId || (wizardBlueprintId && wizardBlueprintId.trim())
  );
  const settingsHydratedRef = useRef(false);
  const savedIdRef = useRef<string | null>(null);

  const CURRENT_STEP = route.params?.step || 1;
  const TOTAL_STEPS = route.params?.TOTAL_STEPS || 4;

  const [settings, setSettings] = useState(() => ({ ...PROCTORING_DEFAULTS }));

  useLayoutEffect(() => {
    settingsHydratedRef.current = false;
    if (routeBlueprintId) {
      setSettings({ ...PROCTORING_DEFAULTS });
    }
  }, [routeBlueprintId]);

  useEffect(() => {
    if (settingsHydratedRef.current || loadBlueprintLoading) {
      return;
    }
    if (!routeBlueprintId || !proctoringDraft) {
      return;
    }
    settingsHydratedRef.current = true;
    setSettings({
      fullscreen: proctoringDraft.fullscreen,
      tabSwitch: proctoringDraft.tabSwitch,
      copyPaste: proctoringDraft.copyPaste,
      rightClick: proctoringDraft.rightClick,
      singleScreen: proctoringDraft.singleScreen,
      webcam: proctoringDraft.webcam,
      eyeGaze: proctoringDraft.eyeGaze,
      autoSubmit: proctoringDraft.autoSubmit,
      maxTabSwitch: proctoringDraft.maxTabSwitch,
      maxFullscreenExit: proctoringDraft.maxFullscreenExit,
    });
  }, [loadBlueprintLoading, routeBlueprintId, proctoringDraft]);

  useEffect(() => {
    if (submitError) {
      showToastMessage(String(submitError), 'error');
    }
  }, [submitError]);

  useEffect(() => {
    if (!lastSaved?.id || lastSaved.id === savedIdRef.current) {
      return;
    }
    savedIdRef.current = lastSaved.id;
    showToastMessage(
      isEditingExistingBlueprint ? 'Changes saved' : 'Assessment saved',
      'success'
    );
    dispatch(resetAssessmentCreateWizard());
    navigate('AssessmentOverView',{ blueprintId: lastSaved.id });
  }, [lastSaved?.id, dispatch, isEditingExistingBlueprint]);

  const enabledCount = Object.values(settings).filter(v => v === true).length;

  const onCreateAssessment = () => {
    const proctoring: AssessmentCreateWizardProctoring = {
      fullscreen: settings.fullscreen,
      tabSwitch: settings.tabSwitch,
      copyPaste: settings.copyPaste,
      rightClick: settings.rightClick,
      singleScreen: settings.singleScreen,
      webcam: settings.webcam,
      eyeGaze: settings.eyeGaze,
      autoSubmit: settings.autoSubmit,
      maxTabSwitch: settings.maxTabSwitch,
      maxFullscreenExit: settings.maxFullscreenExit,
    };
    dispatch(submitBlueprintRequest({ proctoring }));
  };

  const ToggleItem = ({
    title,
    subtitle,
    value,
    onChange,
    Recommended,
    Icon,
    monitoring,
    disabled = false,
  }: any) => (
    <View style={[styles.toggleRow, disabled && styles.toggleRowDisabled]}>
      <View style={styles.toggleText}>
        <View style={styles.toggleLeft}>
          <View style={styles.toggleIcon}>
            <SvgXml
              xml={Icon}
              height={16}
              width={16}
              color={disabled ? colors.gray[400] : colors.gray[600]}
            />
          </View>
          <View style={styles.toggleCopy}>
            <View style={styles.titleRow}>
              <Typography variant="semiBoldTxtsm">
                {title}
              </Typography>
              {Recommended && (
                <Label
                  text={'Recommended'}
                  textColor={colors.success[700]}
                  borderColor={colors.success[200]}
                  backgroundColor={colors.success[50]}
                  paddingVertical={2}
                  paddingHorizontal={8}
                  style={styles.recommendedLabel}
                />
              )}
            </View>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              {subtitle}
            </Typography>
            {monitoring && !settings.webcam && (
              <Typography variant="regularTxtxs" color={colors.warning[600]}>
                Requires webcam monitoring to be enabled
              </Typography>
            )}
          </View>
        </View>
      </View>

      <CustomSwitch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        backgroundActive={disabled?colors.brand[400]:colors.brand[600]}
        backgroundInactive={disabled? colors.gray[200]:colors.gray[400]}
        circleActiveColor={colors.base.white}
        circleInActiveColor={colors.base.white}
      />
    </View>
  );

  return (
    <CustomSafeAreaView style={styles.container}>
      {/* Header */}
      <View>
        <Header
          subtitle="Create assessment"
          title="Proctoring"
          backNavigation
          centerTitle
          onBack={goBack}
          rightComponent={
            <Typography variant="mediumTxtmd" color={colors.gray[500]}>
              {CURRENT_STEP}/{TOTAL_STEPS}
            </Typography>
          }
        />

        <ProgressBar
          progress={CURRENT_STEP / TOTAL_STEPS}
          color={colors.brand[500]}
          style={styles.progress}
        />
      </View>

      {/* Content */}
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Title */}
          <View>
            <Typography variant="semiBoldTxtmd">
              Proctoring Controls
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[600]}>
              Configure monitoring signals for this assessment. These settings affect candidate experience and review evidence.
            </Typography>

            <Typography
              variant="mediumTxtsm"
              color={colors.brand[600]}
              style={styles.enabledText}
            >
              {enabledCount} of 8 enabled
            </Typography>
          </View>

          {/* Environment */}
          <Card style={styles.card}>
            <View>
              <Typography variant="semiBoldTxtmd">Environment & Access</Typography>
              <Typography variant="regularTxtsm" color={colors.gray[500]}>Configure monitoring signals for this assessment. These settings affect candidate experience and review evidence.</Typography>
            </View>

            <ToggleItem
              title={"Fullscreen\nrequired"}
              subtitle="Keep candidates in fullscreen"
              value={settings.fullscreen}
              Recommended={true}
              onChange={(v: any) => setSettings(s => ({ ...s, fullscreen: v }))}
              Icon={fullScreenIcon}
              disabled={isBlueprintPublished}
            />

            <ToggleItem
              title="Tab switching"
              subtitle="Track tab switching"
              value={settings.tabSwitch}
              Recommended={true}
              onChange={(v: any) => setSettings(s => ({ ...s, tabSwitch: v }))}
              Icon={tabSwitchIcon}
              disabled={isBlueprintPublished}
            />

            <ToggleItem
              title="Disable copy/paste"
              subtitle="Prevent copy paste"
              value={settings.copyPaste}
              onChange={(v: any) => setSettings(s => ({ ...s, copyPaste: v }))}
              Icon={shieldIcon}
              disabled={isBlueprintPublished}
            />

            <ToggleItem
              title="Disable right click"
              subtitle="Disable context menu"
              value={settings.rightClick}
              onChange={(v: any) => setSettings(s => ({ ...s, rightClick: v }))}
              Icon={shieldIcon}
              disabled={isBlueprintPublished}
            />

            <ToggleItem
              title="Single screen only"
              subtitle="Prevent multiple screens"
              value={settings.singleScreen}
              onChange={(v: any) => setSettings(s => ({ ...s, singleScreen: v }))}
              Icon={shieldIcon}
              disabled={isBlueprintPublished}
            />
          </Card>

          {/* Monitoring */}
          <Card style={styles.card}>
            <Typography variant="semiBoldTxtmd">Live Monitoring</Typography>

            <ToggleItem
              title={"Webcam\nmonitoring"}
              subtitle="Enable webcam tracking"
              Recommended={true}
              value={settings.webcam}
              onChange={(v: any) =>
                setSettings((s) => ({ ...s, webcam: v, ...(!v ? { eyeGaze: false } : {}) }))
              }
              Icon={cameraIcon}
              disabled={isBlueprintPublished}
            />

            <ToggleItem
              title={"Eye gaze\nmonitoring"}
              subtitle="Track eye movement"
              Recommended={true}
              value={settings.eyeGaze}
              onChange={(v: any) => setSettings(s => ({ ...s, eyeGaze: v }))}
              Icon={eyeVisibleIcon}
              monitoring={true}
              disabled={isBlueprintPublished || !settings.webcam}
            />
          </Card>

          {/* Violation */}
          <Card style={styles.card}>
            <View>
              <Typography variant="semiBoldTxtmd">Violation Handling</Typography>
              <Typography variant="regularTxtsm">Define how the system responds to violations.</Typography>
            </View>

            <ToggleItem
              title="Auto submit on violation"
              subtitle="Submit automatically"
              value={settings.autoSubmit}
              onChange={(v: any) => setSettings(s => ({ ...s, autoSubmit: v }))}
              Icon={shieldIcon}
              disabled={isBlueprintPublished}
            />
            {settings.autoSubmit &&
              <>
                <View>
                  <Typography variant="semiBoldTxtmd">Limits & Access</Typography>
                  <Typography variant="regularTxtsm">Fine tune limits for tab switching, fullscreen exits, and IP restrictions.</Typography>
                </View>


                <View style={styles.stepperBlock}>
                  <Typography variant="mediumTxtsm">Max tab switches</Typography>
                  <NumberStepper
                    value={settings.maxTabSwitch}
                    onChange={(v) => setSettings(s => ({ ...s, maxTabSwitch: v }))}
                    min={1}
                    max={10}
                    disabled={isBlueprintPublished}
                  />
                </View>

                <View style={styles.stepperBlock}>
                  <Typography variant="mediumTxtsm">Max fullscreen exits</Typography>
                  <NumberStepper
                    value={settings.maxFullscreenExit}
                    onChange={(v) => setSettings(s => ({ ...s, maxFullscreenExit: v }))}
                    min={1}
                    max={10}
                    disabled={isBlueprintPublished}
                  />
                </View>
              </>
            }
          </Card>
          <View style={{ backgroundColor: colors.warning[50], padding: 10, borderWidth: 1, borderColor: colors.warning[200], borderRadius: 12 }}>
            <Typography variant="regularTxtxs" color={colors.warning[900]}>Enabling more signals increases monitoring depth. Make sure your candidates are informed about these controls before starting.</Typography>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <FooterButtons
        leftButtonProps={{
          children: "Back",
          size: 44,
          buttonColor: colors.base.white,
          textColor: colors.gray[700],
          borderColor: colors.gray[300],
          borderWidth: 1,
          borderRadius: 8,
          onPress: goBack,
        }}
        rightButtonProps={{
          children: submitLoading
            ? 'Saving…'
            : isEditingExistingBlueprint
              ? 'Save changes'
              : 'Create Assessment',
          size: 44,
          buttonColor: colors.brand[600],
          textColor: colors.base.white,
          borderRadius: 8,
          onPress: onCreateAssessment,
          // disabled: submitLoading || isBlueprintPublished,
        }}
      />
    </CustomSafeAreaView>
  );
};

export default Proctoring;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progress: {
    height: 4,
    backgroundColor: colors.gray[100],
  },
  content: {
    padding: 16,
    gap: 16,
  },
  enabledText: {
    marginTop: 6,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.base.white,
  },
  toggleRowDisabled: {
    opacity: 0.9,
    backgroundColor: colors.gray[50],
  },
  toggleText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.base.white,
    borderColor: colors.gray[300],
    justifyContent: "center",
    alignItems: "center",
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 1 },
    //shadowOpacity: 0.1,
    //shadowRadius: 2,
    //elevation: 1,
  },
  toggleCopy: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 8,
  },
  recommendedLabel: {
    //alignSelf: 'center',
  },
  stepperBlock: {
    gap: 6,
    marginTop: 10,
  },
});