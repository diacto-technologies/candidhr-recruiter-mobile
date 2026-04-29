import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import { useRoute } from '@react-navigation/native'
import Header from '../../../../components/organisms/header'
import Typography from '../../../../components/atoms/typography'
import { colors } from '../../../../theme/colors'
import { goBack, navigate} from '../../../../utils/navigationUtils'
import { ProgressBar } from 'react-native-paper'
import { Button } from '../../../../components'
import { listIcon } from '../../../../assets/svg/list'
import { codeIcon } from '../../../../assets/svg/code'
import SelectableCard from '../../../../components/molecules/selectablecard'
import { selectCreatedAssessment, selectPostAssessmentError, selectPostAssessmentLoading } from '../../../../features/assessments/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { postAssessmentTestRequest } from '../../../../features/assessments/slice'

const CreateTestType = () => {
  const route = useRoute<any>()
  const CURRENT_STEP = route.params?.step || 1
  const TOTAL_STEPS = route.params?.TOTAL_STEPS
  const testName = route.params?.testName
  const description = route.params?.description
  const instruction = route.params?.instruction

  // API expects test_type values like "aptitude" | "technical"
  const [selected, setSelected] = useState<'aptitude' | 'coding'>('aptitude')
  const [didSubmit, setDidSubmit] = useState(false)
  const dispatch = useDispatch();
  const loading = useSelector(selectPostAssessmentLoading);
  const error = useSelector(selectPostAssessmentError);
  const createdAssessment = useSelector(selectCreatedAssessment);

  useEffect(() => {
    const id = createdAssessment?.id
    if (didSubmit && id && !loading) {
      navigate('CreateTestWith', {
        step: CURRENT_STEP + 1,
        TOTAL_STEPS: TOTAL_STEPS,
        assessmentId: id,
        testType: selected,
        testName:testName,
      });
    }
  }, [didSubmit, createdAssessment?.id, loading, CURRENT_STEP, TOTAL_STEPS]);

  return (
    <CustomSafeAreaView>

      {/* Header */}
      <Header
        title="Create Test"
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

      {/* Content */}
      <View style={{ flex: 1, padding: 16, justifyContent: 'space-around' }}>
        <View style={{ flex: 1, gap: 12 }}>
          {/* Aptitude Card */}
          <SelectableCard
            title="Aptitude"
            description="MCQs, reasoning, verbal, quantitative, short answers."
            icon={listIcon}
            isSelected={selected === 'aptitude'}
            onPress={() => setSelected('aptitude')}
          />

          <SelectableCard
            title="Coding"
            description="Programming problems, test cases, runtime evaluation."
            icon={codeIcon}
            isSelected={selected === 'coding'}
            onPress={() => setSelected('coding')}
          />
        </View>
        <View style={{}}>
          <Button disabled={loading} onPress={() => {
            setDidSubmit(true)
            dispatch(
              postAssessmentTestRequest({
                title: testName,
                description: description,
                instructions: instruction,
                instructions_html: instruction,
                test_type: selected,
                categories: [],
                tags: [],
                skills: [],
              })
            );
          }}>Next</Button>
        </View>
      </View>
    </CustomSafeAreaView>
  )
}

export default CreateTestType