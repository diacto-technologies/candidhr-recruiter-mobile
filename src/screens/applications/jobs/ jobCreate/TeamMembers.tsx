import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import { Button, Header, Typography } from '../../../../components';
import CommonDropdown from '../../../../components/organisms/commondropdown';
import { goBack } from '../../../../utils/navigationUtils';
import { colors } from '../../../../theme/colors';
import { shadowStyles } from '../../../../theme/shadowcolor';

const JOB_CREATE_TOTAL_STEPS = 3;
const STEP_INDEX = 3;

/** Demo team list — replace with API / org users when wiring share. */
const TEAM_MEMBER_OPTIONS = [
    {
        id: 'sachin',
        name: 'Sachin',
        profile_pic: 'https://i.pravatar.cc/100?img=12',
    },
    {
        id: 'bilal',
        name: 'Bilal',
        profile_pic: 'https://i.pravatar.cc/100?img=33',
    },
    { id: 'alex', name: 'Alex', profile_pic: 'https://i.pravatar.cc/100?img=15' },
    { id: 'jamie', name: 'Jamie', profile_pic: 'https://i.pravatar.cc/100?img=47' },
    { id: 'sam', name: 'Sam', profile_pic: 'https://i.pravatar.cc/100?img=51' },
];

const TeamMembersScreen = () => {
    const [memberIds, setMemberIds] = useState<string[]>(['sachin', 'bilal']);

    const options = useMemo(() => TEAM_MEMBER_OPTIONS, []);

    return (
        <CustomSafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Header
                    title="Invite team"
                    backNavigation
                    centerTitle
                    onBack={goBack}
                    rightComponent={
                        <Typography variant="mediumTxtmd" color={colors.gray[500]}>
                            {`${STEP_INDEX}/${JOB_CREATE_TOTAL_STEPS}`}
                        </Typography>
                    }
                />
                <ProgressBar
                    progress={STEP_INDEX / JOB_CREATE_TOTAL_STEPS}
                    color={colors.brand[500]}
                    style={styles.progress}
                />

                <View style={styles.body}>
                    <Typography variant="H2" color={colors.gray[900]} style={styles.title}>
                        Add other members
                    </Typography>
                    <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.subtitle}>
                        You can add team members or invite others to collaborate on this job.
                    </Typography>

                    <View style={styles.fieldBlock}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[800]} style={styles.labelRow}>
                            Invite team members
                            <Typography color={colors.mainColors.main} variant="semiBoldTxtsm">
                                {' '}
                                *
                            </Typography>
                        </Typography>

                        <View style={styles.dropdownRow}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color={colors.gray[500]}
                                style={styles.searchIcon}
                            />
                            <View style={styles.dropdownFlex}>
                                <CommonDropdown
                                    placeholder="Add member"
                                    options={options}
                                    value={memberIds}
                                    onChange={(next) => {
                                        setMemberIds(Array.isArray(next) ? next : []);
                                    }}
                                    labelKey="name"
                                    valueKey="id"
                                    multiSelect
                                    searchable
                                    searchPlaceholder="Add member"
                                    searchField="label"
                                    mode="default"
                                    dropdownPosition="bottom"
                                    containerStyle={styles.dropdownInner}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.footerHalf}>
                        <Button
                            size={48}
                            variant="outline"
                            borderColor={colors.gray[200]}
                            buttonColor={colors.base.white}
                            textColor={colors.gray[900]}
                            borderWidth={1}
                            borderRadius={10}
                            onPress={goBack}
                        >
                            Back
                        </Button>
                    </View>
                    <View style={styles.footerHalf}>
                        <Button
                            size={48}
                            buttonColor={colors.brand[600]}
                            textColor={colors.base.white}
                            borderRadius={10}
                            onPress={() => {}}
                        >
                            Share
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </CustomSafeAreaView>
    );
};

export default TeamMembersScreen;

const styles = StyleSheet.create({
    safe: { flex: 1 },
    flex: { flex: 1 },
    progress: {
        height: 4,
        backgroundColor: colors.gray[100],
    },
    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        lineHeight: 22,
        marginBottom: 24,
    },
    fieldBlock: {
        gap: 8,
    },
    labelRow: {},
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray[300],
        backgroundColor: colors.common.white,
        paddingRight: 4,
        ...shadowStyles.shadow_xs,
    },
    searchIcon: {
        marginLeft: 12,
        marginRight: 4,
    },
    dropdownFlex: {
        flex: 1,
        minWidth: 0,
    },
    dropdownInner: {
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 24,
    },
    footerHalf: { flex: 1 },
});
