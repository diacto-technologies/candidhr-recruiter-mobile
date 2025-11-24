import React, { Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Button, StatusBar, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, SortingAndFilter, BottomSheet } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { colors } from '../../../theme/colors';

const Dashboard = () => {
    return (
        <Fragment>
            <Header title='Dashbaord'  />
            <View style={styles.container}>
                <ScrollView style={styles.scrollContent}>
                    <View style={styles.listContainer}>
                        <StatCard
                            title="Total Applications"
                            value={235}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Total Applications"
                            value={435}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <StatCard
                            title="Total Applications"
                            value={675}
                            percentage="2.5%"
                            subText="Greater than last month"
                            onPressInfo={() => console.log('Info clicked')}
                        />
                        <ApplicationStageChart
                        />
                        <FeatureConsumptionChart/>
                        <ApplicationStageOverview/>
                        <BottomSheet>
                        </BottomSheet>
                    </View>
                </ScrollView>
            </View>
        </Fragment>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.neutrals.lightGray,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    listContainer: {
        gap: 16,
    }
});
