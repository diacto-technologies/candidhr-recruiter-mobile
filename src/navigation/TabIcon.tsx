import { FC, memo } from "react";
import { Image, TextStyle, View, ViewStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import React from "react";
import { Colors } from "../utils/constants";
import { Typography } from "../components";
import { SvgXml } from "react-native-svg";
import { dashboardIcon, focusedDashboardIcon } from "../assets/svg/dashboardicon";
import { focusedUserApplicationIcon, userApplicationIcon } from "../assets/svg/userapplicationicon";
import { focusedJobIcon, jobIcon } from "../assets/svg/jobicon";
import { horizontalThreedotIcon } from "../assets/svg/horizontalthreedoticon";
import { settingIcon } from "../assets/svg/settingicon";

interface TabProps {
    name: string;
}

const Styles = {
    width: RFValue(18),
    height: RFValue(18)
};

const tabStyle: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical:24,
};

const textInactive: TextStyle = {
    textAlign: "center",
    marginTop: 4,
    color: Colors.lightText,
    fontSize: RFValue(9.5)
};

const textActive: TextStyle = {
    textAlign: "center",
    marginTop: 4,
    color: Colors.active,
    fontSize: RFValue(9.5)
};

const TabIcon: FC<TabProps> = memo(({ name }) => {
    return (
        <View style={tabStyle}>
            {name === "Dashboard" ? <SvgXml xml={dashboardIcon} height={24} width={24} /> :
                name === "JobsScreen" ? <SvgXml xml={jobIcon} height={24} width={24} /> :
                    name === "ApplicantScreen" ? <SvgXml xml={userApplicationIcon} height={24} width={24} /> :
                        <SvgXml xml={settingIcon} height={24} width={24} />}
        </View>
    );
});

const TabIconFocused: FC<TabProps> = memo(({ name }) => {
    return (
        <View style={tabStyle}>

            {name === "Dashboard" ? <SvgXml xml={focusedDashboardIcon} height={24} width={24} /> :
                name === "JobsScreen" ? <SvgXml xml={focusedJobIcon} height={24} width={24} /> :
                    name === "ApplicantScreen" ? <SvgXml xml={focusedUserApplicationIcon} height={24} width={24} /> :
                        <SvgXml xml={settingIcon} height={24} width={24} />}
        </View>
    );
});

export const DashboardTabIcon: FC<{ focused: boolean }> = ({ focused }) =>
    focused ? <TabIconFocused name="Dashboard" /> : <TabIcon name="Dashboard" />;

export const JobsTabIcon: FC<{ focused: boolean }> = ({ focused }) =>
    focused ? <TabIconFocused name="JobsScreen" /> : <TabIcon name="JobsScreen" />;

export const ApplicantTabIcon: FC<{ focused: boolean }> = ({ focused }) =>
    focused ? <TabIconFocused name="ApplicantScreen" /> : <TabIcon name="ApplicantScreen" />;

export const ProfileTabIcon: FC<{ focused: boolean }> = ({ focused }) =>
    focused ? <TabIconFocused name="Profile" /> : <TabIcon name="Profile" />;
