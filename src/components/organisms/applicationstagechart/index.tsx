import React, { Fragment, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';
import Typography from '../../atoms/typography';
import { Fonts } from '../../../theme/fonts';

interface BarItem {
    value: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
}

const ApplicationStageChart: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const barData: BarItem[] = [
        { value: 3, label: 'Resume screening', frontColor: '#F5F5F5' },
        { value: 8, label: 'Assessm-ent', frontColor: '#645CE7', gradientColor: '#8681E8' },
        { value: 4, label: 'Video\ninterview', frontColor: '#F5F5F5' },
        { value: 2, label: 'Rejected', frontColor: '#F5F5F5' },
        { value: 5, label: 'On hold', frontColor: '#F5F5F5' },
    ];

    // ✅ Responsive Spacing
    const barCount = barData.length;
    const dynamicSpacing = (screenWidth - barCount * 40) / barCount;

    return (
        <Fragment>
            <View style={styles.container}>
                <Typography variant='H2' color={colors.grayScale.richBlack}>Application per stage</Typography>
                <View style={{ overflow: 'hidden' }}>
                    <BarChart
                        data={barData}
                        barWidth={32}
                        initialSpacing={dynamicSpacing / 2}
                        spacing={dynamicSpacing}
                        showGradient
                        yAxisThickness={0}
                        xAxisThickness={0}
                        barBorderTopLeftRadius={5}
                        barBorderTopRightRadius={5}
                        barBorderBottomLeftRadius={0}
                        barBorderBottomRightRadius={0}
                        xAxisTextNumberOfLines={2}
                        rulesColor={colors.mainColors.borderColor}
                        rulesThickness={1}
                        hideRules={false}
                        noOfSections={5}
                        dashWidth={0}
                        dashGap={0}
                        xAxisLabelTextStyle={styles.xAxisLabel}
                        onPress={(item: BarItem, index: number) => setSelectedIndex(index)}
                        focusedBarIndex={selectedIndex}
                        hideYAxisText
                        renderTooltip={(item: BarItem) => (
                            <View style={styles.tooltipWrapper}>
                                <View style={styles.tooltipArrow} />
                                <View style={styles.tooltipContainer}>
                                    <Text style={styles.tooltipText}>
                                        {item.value.toString().padStart(2, '0')} Applicants
                                    </Text>
                                </View>
                            </View>

                        )}
                    />
                </View>
            </View>
        </Fragment>
    );
};

export default ApplicationStageChart;

interface Style {
    container: ViewStyle;
    xAxisLabel: TextStyle;
    tooltipContainer: ViewStyle;
    tooltipText: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        backgroundColor: colors.common.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.mainColors.borderColor,
        shadowColor: 'rgba(10, 13, 18, 0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        gap: 20,
    },
    xAxisLabel: {
        fontSize: 12,
        fontFamily: Fonts.InterRegular,
        fontWeight: '400',
        color: colors.grayScale.grayDark,
        textAlign: 'center',
    },
    tooltipWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        top: -22,
        marginLeft: 40,   // adjust as needed
    },
    tooltipArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },

    tooltipContainer: {
        backgroundColor: colors.grayScale.black,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tooltipText: {
        fontSize: 14,
        fontFamily: Fonts.InterSemiBold,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
