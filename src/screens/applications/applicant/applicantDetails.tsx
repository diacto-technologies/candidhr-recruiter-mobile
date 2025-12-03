import React, { Fragment, useState } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import Assessment from '../../../components/organisms/profile/assessment/assessment';
import ProfileInfo from '../../../components/organisms/profile/profileinfo/profileInfo';
import ResumeScreening from '../../../components/organisms/profile/resumescreening/resumescreening';
import VideoInterview from '../../../components/organisms/profile/videoInterview';
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

const tabs: string[] = ['ProfileInfo', 'ResumeScreening', 'Assessment', 'Video']
export default function ApplicantDetails() {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState('ProfileInfo');

  const renderTab = () => {
    switch (activeTab) {
      case 'ProfileInfo':
        return <ProfileInfo />;
      case 'ResumeScreening':
        return <ResumeScreening />;
      case 'Assessment':
        return <Assessment />;
      case 'Video':
        return <VideoInterview />;
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      <Header backNavigation={true} onBack={() => goBack()} />
      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.container}>
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
            buttonColor:colors.brand[600],
            textColor:colors.base.white,
            borderColor:colors.base.white,
            borderRadius:8,
            onPress: () => console.log("Copy"),
            startIcon: <SvgXml xml={telePhoneIcon} />,
          }}
        />
        </View>
    </Fragment>
  );
}
