import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import Header from '../../../../components/organisms/header'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import Typography from '../../../../components/atoms/typography'
import { ProgressBar } from 'react-native-paper'
import { useRoute } from '@react-navigation/native'
import { colors } from '../../../../theme/colors'
import SelectableCard from '../../../../components/molecules/selectablecard'
import { listIcon } from '../../../../assets/svg/list'
import { codeIcon } from '../../../../assets/svg/code'
import FooterButtons from '../../../../components/molecules/footerbuttons'
import AiTestQuestion from './aitestquestion'
import Divider from '../../../../components/atoms/divider'

const CreateTestWith = () => {
    const route = useRoute<any>()
    const CURRENT_STEP = route.params?.step || 1
    const TOTAL_STEPS = route.params?.TOTAL_STEPS
    const assessmentId = route.params?.assessmentId
    const testName = route.params?.testName
    const testType = route.params?.testType as 'aptitude' | 'coding' | undefined
    const [selected, setSelected] = useState<'question' | 'upload' | 'ai'>('question')
    return (
        <CustomSafeAreaView>
            <Header
                title="Test Creation"
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
                style={{
                    height: 4,
                    backgroundColor: colors.gray[100],
                }}
            />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 16, justifyContent: 'space-around' }}>
                    <View style={{ flex: 1, gap: 12 }}>
                        <SelectableCard
                            title="Question"
                            description="Create your own questions manually by adding them one by one."
                            icon={listIcon}
                            isSelected={selected === 'question'}
                            onPress={() => setSelected('question')}
                        />

                        {testType !== "coding" && (
                            <SelectableCard
                                title="Upload (Excel)"
                                description="Upload questions in bulk using an Excel file for faster setup."
                                icon={codeIcon}
                                isSelected={selected === 'upload'}
                                onPress={() => setSelected('upload')}
                            />
                        )}

                        <SelectableCard
                            title="Generate AI"
                            description="Automatically generate test questions using AI based on your requirements."
                            icon={codeIcon}
                            isSelected={selected === 'ai'}
                            onPress={() => setSelected('ai')}
                        />
                    </View>
                </View>
            </ScrollView>
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
                    children: "Next",
                    size: 44,
                    borderWidth: 1,
                    buttonColor: colors.brand[600],
                    textColor: colors.base.white,
                    borderColor: colors.base.white,
                    borderRadius: 8,
                    onPress: () => {
                        let screen = "";

                        if (selected === "ai") {
                            screen = testType === "coding"
                                ? "AiCodingTestQuestion"
                                : "AiTestQuestion";
                        }
                        else if (selected === "upload") {
                            if (testType === "coding") {
                                screen = "CodingTestQuestion"; // fallback
                            } else {
                                screen = "ExcelTestUpload";
                            }
                        }
                        else {
                            screen = testType === "coding"
                                ? "CodingTestQuestion"
                                : "CreateTestQuestion";
                        }

                        navigate(screen, {
                            step: CURRENT_STEP + 1,
                            TOTAL_STEPS,
                            assessmentId,
                            title: testName,
                            testId:assessmentId,
                        });
                    }
                }} />
        </CustomSafeAreaView>
    )
}

export default CreateTestWith