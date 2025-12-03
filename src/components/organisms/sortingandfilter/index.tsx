import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import React, { FC, Fragment } from 'react';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { filterDotIcon, filterIcon } from '../../../assets/svg/filter';

const SortingAndFilter: FC<{
    title: string;
    options: string[];
    onPressFilter: () => void;
}> = ({ title, options, onPressFilter }) => {
    return (
        <Fragment>
            <View style={{ flexDirection: 'row', paddingVertical: 8, backgroundColor: colors.common.white, borderBottomWidth:2, borderColor:colors.gray[200] }}>
                {/* Filters Button */}
                <Pressable
                    onPress={onPressFilter}   //CLICK HANDLER
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                    }}
                >
                    <View>
                        <SvgXml xml={filterDotIcon} style={{ position: 'absolute' }} />
                        <SvgXml xml={filterIcon} />
                    </View>
                    <Typography variant="H4" style={{ color: '#535862' }}>
                        {title}
                    </Typography>
                </Pressable>

                {/* Scrollable options */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    {options?.map((item, index) => {
                        const isSelected = index === 0;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: isSelected ? '#DDDBFF' : '#E9EAEB',
                                    backgroundColor: isSelected ? '#F7F6FF' : '#FAFAFA',
                                    marginRight: 12,
                                }}
                            >
                                <Typography
                                    variant="P1M"
                                    color={isSelected ? '#6C4BE7' : '#414651'}
                                >
                                    {item}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </Fragment>
    );
};

export default SortingAndFilter;
