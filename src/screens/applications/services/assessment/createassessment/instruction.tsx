import { View, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import CustomSafeAreaView from '../../../../../components/atoms/customsafeareaview'
import Header from '../../../../../components/organisms/header'
import { goBack, navigate } from '../../../../../utils/navigationUtils'
import { colors } from '../../../../../theme/colors'
import Typography from '../../../../../components/atoms/typography'
import { useRoute } from '@react-navigation/native'
import { ProgressBar } from 'react-native-paper'
import FooterButtons from '../../../../../components/molecules/footerbuttons'
import RichTextField from '../../../../../components/atoms/richtextscreen'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { setAssessmentCreateWizardInstructionsHtml } from '../../../../../features/assessments/slice'
import {
  selectLoadBlueprintForEditLoading,
  selectAssessmentCreateWizardInstructionsHtml,
  selectAssessmentCreateWizardBasicInfo,
  selectAssessmentCreateWizardLoadBlueprintDetail,
} from '../../../../../features/assessments/selectors'

const Instruction = () => {
  const route = useRoute<any>()
  const dispatch = useAppDispatch()
  const storeInstructionsHtml = useSelector(
    selectAssessmentCreateWizardInstructionsHtml
  )
  const loadBlueprintLoading = useSelector(selectLoadBlueprintForEditLoading)
  const wizardBasic = useSelector(selectAssessmentCreateWizardBasicInfo)
  const loadBlueprintDetail = useSelector(
    selectAssessmentCreateWizardLoadBlueprintDetail
  )
  const fromStoreOnce = useRef(false)
  const routeBlueprintId =
    typeof route.params?.blueprintId === 'string'
      ? route.params.blueprintId.trim()
      : ''
  const CURRENT_STEP = route.params?.step || 1
  const TOTAL_STEPS = route.params?.TOTAL_STEPS || 4
  const [instructionsHtml, setInstructionsHtml] = useState('')

  useLayoutEffect(() => {
    fromStoreOnce.current = false
    if (routeBlueprintId) {
      setInstructionsHtml('')
    }
  }, [routeBlueprintId])

  useEffect(() => {
    if (fromStoreOnce.current || loadBlueprintLoading) {
      return
    }
    if (!routeBlueprintId) {
      return
    }
    fromStoreOnce.current = true
    setInstructionsHtml(storeInstructionsHtml)
  }, [loadBlueprintLoading, routeBlueprintId, storeInstructionsHtml])

  return (
    <CustomSafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>

      {/* Header */}
      <View>
        <Header
          subtitle="Create assessment"
          title="Instructions"
          backNavigation
          centerTitle
          onBack={goBack}
          rightComponent={
            <Typography variant="mediumTxtmd" color={colors.gray[500]}>
              {CURRENT_STEP}/{TOTAL_STEPS}
            </Typography>
          }
        />
        {/* Progress */}
        <ProgressBar
          progress={CURRENT_STEP / TOTAL_STEPS}
          color={colors.brand[500]}
          style={{
            height: 4,
            backgroundColor: colors.gray[100],
          }}
        />
      </View>
      <ScrollView>
        <View style={{ padding: 16, gap:16 }}>
          <View style={{gap:2}}>
          <Typography variant="semiBoldTxtmd">
            Candidate Instructions (Optional)
          </Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Add any guidance candidates should read before starting the assessment.
          </Typography>
          </View>
          <View style={{gap:6}}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
            Instructions (rich text)
          </Typography>
          <RichTextField
            value={instructionsHtml}
            onChange={setInstructionsHtml}
            placeholder="Enter instructions..."
            //disabled={wizardBasic?.is_published && storeInstructionsHtml !=='' }
          />
          <Typography variant="regularTxtxs" color={colors.gray[600]}>
            This field is optional. Both plain text and HTML will be saved.
          </Typography>
        </View>
        </View>
      </ScrollView>
      <View>
        <FooterButtons
          leftButtonProps={{
            children: "Back",
            size: 44,
            buttonColor: colors.base.white,
            textColor: colors.gray[700],
            borderColor: colors.gray[300],
            borderWidth: 1,
            borderRadius: 8,
            borderGradientOpacity: 0.25,
            shadowColor: colors.gray[700],
            onPress: () => { goBack() },
          }}

          rightButtonProps={{
            children: "Continue",
            size: 44,
            borderWidth: 1,
            buttonColor: colors.brand[600],
            textColor: colors.base.white,
            borderColor: colors.base.white,
            borderRadius: 8,
            onPress: () => {
              dispatch(setAssessmentCreateWizardInstructionsHtml(instructionsHtml))
              navigate('Proctoring', {
                step: 4,
                TOTAL_STEPS: 4,
                blueprintId: route.params?.blueprintId,
              })
            },
          }} />
      </View>
    </CustomSafeAreaView>
  )
}

export default Instruction