import React, { Fragment, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import Assessment from '../../../components/organisms/profile/assessment/assessment';
import ProfileInfo from '../../../components/organisms/profile/profileinfo/profileInfo';
import ResumeScreening from '../../../components/organisms/profile/resumescreening/resumescreening';
import VideoInterview from '../../../components/organisms/profile/videointerview/videoInterview';
import ProfileCart from '../../../components/organisms/profile/profilecart';
import { Header } from '../../../components';
import { goBack } from '../../../utils/navigationUtils';
import SlideAnimatedTab from '../../../components/molecules/slideanimatedtab';
import { colors } from '../../../theme/colors';
import { useStyles } from './applicantDetails.styles';
import FooterButtons from '../../../components/molecules/footerbuttons';
import { SvgXml } from 'react-native-svg';
import { telePhoneIcon } from '../../../assets/svg/telephone';
import { fileIcon } from '../../../assets/svg/file';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getApplicationDetailRequestAction, getApplicationResponsesRequestAction, getAssessmentLogsRequestAction, getAssessmentReportRequestAction, getResumeScreeningResponsesRequestAction } from '../../../features/applications/actions';
import { useRoute } from '@react-navigation/native';
import { selectAssessmentLogs, selectSelectedApplication } from '../../../features/applications/selectors';
import { useAppSelector } from '../../../hooks/useAppSelector';

const tabs: string[] = ['ProfileInfo', 'ResumeScreening', 'Assessment', 'Video interview']
export default function ApplicantDetails() {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('ProfileInfo');
  const route = useRoute();
  const dispatch = useAppDispatch();
  const {  application_id,
    job_id, } = route.params as { application_id: string , job_id:string };

    useEffect(()=>{
      dispatch(getApplicationDetailRequestAction(application_id));
      dispatch(getApplicationResponsesRequestAction({application_id,job_id}))
      dispatch(getResumeScreeningResponsesRequestAction(application_id))
    },[])

  const renderTab = () => {
    switch (activeTab) {
      case 'ProfileInfo':
        return <ProfileInfo />;
      case 'ResumeScreening':
        return <ResumeScreening />;
      case 'Assessment':
        return  <Assessment />;
      case 'Video interview':
        return <VideoInterview />;
      default:
        return <></>;
    }
  };
  console.log(application_id,"application_idapplication_idapplication_idapplication_id")

  return (
    <Fragment>
     <CustomSafeAreaView>
      <Header backNavigation={true} onBack={() => goBack()} threedot={true}/>
      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.subContainer}>
        <ProfileCart />
        <View style={styles.tabContainer}>
          <SlideAnimatedTab
            tabs={tabs}
            activeTab={activeTab}
            onChangeTab={(label) => setActiveTab(label)}
          />

        <View style={styles.bottomBorder} />
      </View>
      <View style={{paddingHorizontal:16, paddingVertical:16}}>
          {renderTab()}
          </View>
      </View>
      </ScrollView>
      <View>
        <FooterButtons
          leftButtonProps={{
            children: "View resume",
            variant:"contain",
            size: 44,
            buttonColor:colors.base.white,
            textColor:colors.gray[700],
            borderColor:colors.gray[300],
            borderWidth:1,
            borderRadius:8,
            borderGradientOpacity:0.25,
            shadowColor:colors.gray[700],
            onPress: () => console.log("Unpublish"),
            startIcon: <SvgXml xml={fileIcon} />,
          }}
          rightButtonProps={{
            children: "call",
            variant: "contain",
            size: 44,
            borderWidth:1,
            buttonColor:colors.brand[600],
            textColor:colors.base.white,
            borderColor:colors.base.white,
            borderRadius:8,
            onPress: () => console.log("Copy"),
            startIcon: <SvgXml xml={telePhoneIcon} />,
          }}
        />
        </View>
        </CustomSafeAreaView>
    </Fragment>
  );
}
