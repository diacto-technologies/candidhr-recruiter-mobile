import React, { Fragment } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { Header, JobCardList, SortingAndFilter, ApplicantList } from '../../../components';
import { applicants, filtersOption } from '../../../utils/dummaydata';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

const ApplicantScreen = () => {
    const inset = useRNSafeAreaInsets()
    const styles = useStyles();
    return (
        <Fragment>
            <Header title='Applicants' />
            <View style={styles.container}>
                <FlatList
                    data={applicants}
                    renderItem={({ item }) => <ApplicantList item={item} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16, gap:12 }}
                />
            </View>
            <View>
                <SortingAndFilter title='Filters' options={filtersOption} onPressFilter={() => { }} />
            </View>
        </Fragment>
    );
};

export default ApplicantScreen;

const styles = StyleSheet.create({
});
