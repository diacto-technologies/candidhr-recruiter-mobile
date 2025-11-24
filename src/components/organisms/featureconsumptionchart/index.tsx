import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

interface BarItem {
    value: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
}

const FeatureConsumptionChart: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const barData: BarItem[] = [
        { value: 3, label: 'Resume screening', frontColor: '#F5F5F5' },
        { value: 8, label: 'Assessm-ent', frontColor: '#645CE7', gradientColor: '#8681E8' },
        { value: 4, label: 'Video\ninterview', frontColor: '#F5F5F5' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feature consumption</Text>

            <View style={{ overflow: 'hidden' }}>
                <BarChart
                    data={barData}
                    barWidth={101}
                    initialSpacing={20}
                    spacing={8}
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
    );
};

export default FeatureConsumptionChart;

interface Style {
    container: ViewStyle;
    title: TextStyle;
    xAxisLabel: TextStyle;
    tooltipContainer: ViewStyle;
    tooltipText: TextStyle;
}

const styles = StyleSheet.create<Style>({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.mainColors.borderColor,
        shadowColor: 'rgba(10, 13, 18, 0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    xAxisLabel: {
        fontSize: 12,
        color: '#5A5A5A',
        textAlign: 'center',
        lineHeight: 14,
    },
    tooltipWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        top: -8,
        marginLeft: 105,   // adjust as needed
      },
      tooltipArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#181D27',   // arrow color
      },
      
      tooltipContainer: {
        backgroundColor: '#181D27',
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
