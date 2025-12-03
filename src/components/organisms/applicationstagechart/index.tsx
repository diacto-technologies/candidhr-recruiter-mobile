import React, { Fragment, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // <-- ADDED
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';
import Typography from '../../atoms/typography';
import { Fonts } from '../../../theme/fonts';
import { useStyles } from './styles';

interface BarItem {
    value: number;
    label: string;
    frontColor: string;
    gradientColor?: string;
}

const ApplicationStageChart: React.FC = () => {
    const styles = useStyles();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const barData: BarItem[] = [
        { value: 3, label: 'Resume screening', frontColor: colors.gray[100], gradientColor: colors.gray[100] },
        { value: 8, label: 'Assessm-ent', frontColor: colors.brand[500], gradientColor: colors.brand[600] },
        { value: 4, label: 'Video\ninterview', frontColor: colors.gray[100], gradientColor: colors.gray[100] },
        { value: 2, label: 'Rejected', frontColor: colors.gray[100], gradientColor: colors.gray[100] },
        { value: 5, label: 'On hold', frontColor: colors.gray[100], gradientColor: colors.gray[100] },
    ];

    // ✅ Responsive Spacing
    const barCount = barData.length;
    const dynamicSpacing = (screenWidth - barCount * 40) / barCount;

    return (
        <Fragment>
            <View style={styles.container}>
                <Typography variant="semiBoldTxtlg">Application per stage</Typography>
                <View style={{ overflow: 'hidden'}}>
                    <BarChart
                        data={barData}
                        barWidth={32}
                        initialSpacing={dynamicSpacing / 2}
                        spacing={dynamicSpacing}
                        showGradient
                        yAxisThickness={0}
                        xAxisThickness={0}
                        height={164}
                        maxValue={10}  
                        barBorderTopLeftRadius={5}
                        barBorderTopRightRadius={5}
                        barBorderBottomLeftRadius={0}
                        barBorderBottomRightRadius={0}
                        xAxisTextNumberOfLines={2}
                        rulesColor={colors.gray[200]}
                        rulesThickness={1}
                        hideRules={false}
                        noOfSections={5}
                        dashWidth={0}
                        dashGap={0}
                        xAxisLabelTextStyle={styles.xAxisLabel}
                        onPress={(item: BarItem, index: number) => setSelectedIndex(index)}
                        focusedBarIndex={selectedIndex}
                        hideYAxisText
                        customBarContent={(item: BarItem) => {
                            const start = item.frontColor || colors.base.white;
                            const end = item.gradientColor || item.frontColor || colors.base.white;
                            return (
                                <LinearGradient
                                    colors={[start, end]}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={{
                                        width: '100%',
                                        flex: 1,
                                        borderTopLeftRadius: 5,
                                        borderTopRightRadius: 5,
                                    }}
                                />
                            );
                        }}
                        renderTooltip={(item: BarItem) => (
                            <View style={styles.tooltipWrapper}>
                                <View style={styles.tooltipArrow} />
                                <View style={styles.tooltipContainer}>
                                    <Typography variant="semiBoldTxtxs" color={colors.base.white}>
                                        {item.value.toString().padStart(2, '0')} Applicants
                                    </Typography>
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
