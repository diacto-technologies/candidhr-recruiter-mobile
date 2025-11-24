import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable,
} from 'react-native';
import { Svg, SvgXml } from 'react-native-svg';
import { JobList } from '../../../utils/dummaydata';
import { Illustrations } from '../../../assets/svg/illustrations';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { Typography } from '../../atoms';
import { colors } from '../../../theme/colors';
import Divider from '../../atoms/divider';
import { navigate } from '../../../utils/navigationUtils';

interface JobItem {
    id: string;
    title: string;
    applicants: number;
    date: string;
    author: string;
    status: 'Published' | 'Unpublished';
}

const JobCardList = () => {
    const renderItem = ({ item }: { item: JobItem }) => {
        return (
            <Pressable style={styles.card} onPress={()=>navigate('JobDetailScreen')}>
                <View style={styles.rowBetween}>
                    <Typography variant='H3' color={colors.mainColors.blueGrayTitle}>{item.title}</Typography>
                    <TouchableOpacity>
                        <SvgXml xml={horizontalThreedotIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                <Typography variant='P1M' color={colors.mainColors.carbonGray}>{item.applicants} applicants</Typography>
                    <Text style={styles.dot}></Text>
                    <Typography variant='P1' color={colors.grayScale.slateGray}>{item.date}</Typography>
                </View>
                <View style={{paddingTop:10}}>
                <Divider height={2} marginVertical={6} color={colors.mainColors.borderColor} />
                <View style={styles.rowBetween}>
                <Typography variant='P1' color={colors.grayScale.slateGray}>By {item.author}</Typography>
                    <View
                        style={[
                            styles.statusBadge,
                            item.status === 'Published'
                                ? styles.published
                                : styles.unpublished,
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: item.status === 'Published' ? '#12B76A' : '#F04438' },
                            ]}
                        />
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                </View>
                </Pressable>
        );
    };

    return (
        <FlatList
            data={JobList as JobItem[]}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 12, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <SvgXml xml={Illustrations} width={150} height={120} />

                    <Text style={styles.emptyTitle}>No jobs found</Text>

                    <Text style={styles.emptySubtitle}>
                        Your search “Landing pae design” did not match any projects. try afgain.
                    </Text>

                    <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.buttonText}>Add new job</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

export default JobCardList;

const styles = StyleSheet.create({
    card: {
        backgroundColor:colors.common.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 6,},
    rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dot: {marginHorizontal: 6 , height:16 , borderColor:colors.mainColors.borderColor, borderWidth:1},
    author: { color: '#475467', fontSize: 13, marginTop: 8 },
    statusText: { fontSize: 12, marginLeft: 6, fontWeight: '500', color: '#344054' },
    statusDot: { width: 8, height: 8, borderRadius:50 },
    published: { backgroundColor: colors.common.white },
    unpublished: { backgroundColor: colors.common.white },

    // --- Empty Screen Styles ---
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: -40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#101828',
        marginTop: 15,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#667085',
        textAlign: 'center',
        marginTop: 8,
    },
    createButton: {
        marginTop: 30,
        backgroundColor: '#6366F1',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius:6,
        marginTop: 8,
        borderWidth:1,
        borderColor:colors.mainColors.borderColor,
        // Shadow
        shadowColor: '#0A0D12',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      },
      
});
