import React, { Fragment } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pluscircle } from '../../../assets/svg/pluscircle';
import { Header, JobCardList, SortingAndFilter, ApplicantList } from '../../../components';
import { applicants, filtersOption } from '../../../utils/dummaydata';
import { colors } from '../../../theme/colors';

const ApplicantScreen = () => {
    return (
        <Fragment>
            <Header title='Applicants' />
            <View style={styles.container}>
                <FlatList
                    data={applicants}
                    renderItem={({ item }) => <ApplicantList item={item} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View>
                <SortingAndFilter title='Filters' options={filtersOption} onPressFilter={() => {}} />
            </View>
        </Fragment>
    );
};

export default ApplicantScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.lightGray,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    text: { fontSize: 22, fontWeight: '600' }
});
