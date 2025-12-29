// FeatureConsumptionChart.tsx
import React, { Fragment, useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import { useStyles } from './styles';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    selectFeatureConsumption,
    selectFeatureConsumptionLoading,
} from '../../../features/dashbaord/selectors';
import { screenWidth } from '../../../utils/devicelayout';
import { buildBarData } from './helpers';
import Shimmer from '../../atoms/shimmer';
import { BarItem } from './featureconsumptionchart';

const FeatureConsumptionChart: React.FC = () => {
    const styles = useStyles();
    const featureData = useAppSelector(selectFeatureConsumption);
    const loading = useAppSelector(selectFeatureConsumptionLoading);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const barData = buildBarData(featureData);
    const barCount = barData.length;
    const barWidth = 101;
    const availableWidth = screenWidth - 10;

    const dynamicSpacing = Math.max(
        20,
        (availableWidth - barCount * barWidth) / (barCount + 1)
    );

    const maxValue = Math.max(...barData.map(b => b.value), 0) + 20;
    if (loading) {
        return (
            <View style={styles.container}>
                <Typography variant="semiBoldTxtlg">Feature consumption</Typography>

                <View style={{ marginTop: 16, height: 164, justifyContent: 'flex-end', position: 'relative' }}>
                    {/* Grid shimmer */}
                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
                        {[0, 1, 2, 3, 4].map((_, i) => (
                            <Shimmer key={i} height={1} width="100%" style={{ marginVertical: 32 }} />
                        ))}
                    </View>

                    {/* Bars shimmer */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 20 }}>
                        {[85, 130, 95].map((height, index) => (
                            <View key={index} style={{ alignItems: 'center', gap: 8 }}>
                                <Shimmer width={32} height={height} borderRadius={5} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <Fragment>
            <View style={styles.container}>
                <Typography variant="semiBoldTxtlg">Feature consumption</Typography>

                <View>
                    <BarChart
                        data={barData}
                        barWidth={barWidth}
                        initialSpacing={dynamicSpacing / 2}
                        spacing={dynamicSpacing}
                        showGradient
                        yAxisThickness={0}
                        xAxisThickness={0}
                        height={164}
                        maxValue={maxValue}
                        barBorderTopLeftRadius={5}
                        barBorderTopRightRadius={5}
                        xAxisTextNumberOfLines={2}
                        rulesColor={colors.gray[200]}
                        rulesThickness={1}
                        hideRules={false}
                        noOfSections={5}
                        dashWidth={0}
                        dashGap={0}
                        xAxisLabelTextStyle={styles.xAxisLabel}
                        focusedBarIndex={selectedIndex}
                        onPress={(item: BarItem, index: number) => setSelectedIndex(index)}
                        hideYAxisText
                        renderTooltip={(item: BarItem) => (
                            <View style={styles.tooltipWrapper}>
                                <View style={styles.tooltipArrow} />
                                <View style={styles.tooltipContainer}>
                                    <Typography variant="semiBoldTxtxs" color={colors.base.white}>
                                        {item.value.toString().padStart(2, '0')} Users
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

export default FeatureConsumptionChart;
