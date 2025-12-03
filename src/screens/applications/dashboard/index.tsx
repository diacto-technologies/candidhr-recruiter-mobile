import React, { Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header, Button, StatusBar, StatCard, ApplicationStageChart, FeatureConsumptionChart, ApplicationStageOverview, SortingAndFilter, BottomSheet } from '../../../components';
import { filtersOption } from '../../../utils/dummaydata';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './styles';

const Dashboard = () => {
    const styles = useStyles();
    const { insetsBottom, insetsTop } = useRNSafeAreaInsets();
    return (
        <Fragment>
             <View style={[styles.container,{paddingTop: insetsTop}]}>
                <StatusBar showWhite />
                <Header title='Dashbaord' />
                {/* <View style={styles.container}> */}
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
                        <View style={[styles.listContainer, { paddingBottom: insetsBottom || 16 }]}>
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
                            <FeatureConsumptionChart />
                            <ApplicationStageOverview />
                        </View>
                    </ScrollView>
                </View>
            {/* </SafeAreaView> */}
        </Fragment>
    );
};

export default Dashboard;
