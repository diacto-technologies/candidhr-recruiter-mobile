import React, { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import Typography from '../../atoms/typography';
import { useStyles } from './styles';
import { screenWidth } from '../../../utils/devicelayout';
import { buildBarData } from './helpers';
import Shimmer from '../../atoms/shimmer';
import { BarItem, FeatureConsumptionChartProps } from './featureconsumptionchart';
import { isTablet } from 'react-native-device-info';

const CHART_HEIGHT = 164;
const SCREEN_PADDING = 10;
const DUMMY_BAR_HEIGHTS = [85, 130, 95];
const IS_TABLET = isTablet();

const FeatureConsumptionChart: React.FC<FeatureConsumptionChartProps> = ({
    featureData,
    loading,
}) => {
    const styles = useStyles();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const barData = useMemo(() => {
        return buildBarData(featureData, selectedIndex);
    }, [featureData, selectedIndex]);

    const maxValue = useMemo(() => {
        return Math.max(...barData.map(b => b.value), 0) + 20;
    }, [barData]);

    const barCount = barData.length;
    const barWidth = IS_TABLET ? 280 : 101;
    const availableWidth = screenWidth - SCREEN_PADDING;

    const dynamicSpacing = Math.max(
        20, 
        (availableWidth - barCount * barWidth) / (barCount + 1)
    );

    const handleBarPress = useCallback((item: BarItem, index: number) => {
        setSelectedIndex(index);
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Typography variant="semiBoldTxtlg">Feature consumption</Typography>

                <View style={styles.gridLines}>
                    {/* Grid shimmer */}
                    <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
                        {[0, 1, 2, 3, 4].map((_, i) => (
                            <Shimmer key={i} height={1} width="100%" style={{ marginVertical: 32 }} />
                        ))}
                    </View>

                    {/* Bars shimmer */}
                    <View style={styles.barLabels}>
                        {DUMMY_BAR_HEIGHTS.map((height, index) => (
                            <View key={index} style={styles.barItem}>
                                <Shimmer width={barWidth} height={height} borderRadius={5} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Typography variant="semiBoldTxtlg">Feature consumption</Typography>

            <View style={{ overflow: 'hidden' }}>
                <BarChart
                    data={barData}
                    barWidth={barWidth}
                    initialSpacing={dynamicSpacing / 2}
                    spacing={dynamicSpacing}
                    showGradient
                    yAxisThickness={0}
                    xAxisThickness={0}
                    height={CHART_HEIGHT}
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
                    onPress={handleBarPress}
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
    );
};

export default FeatureConsumptionChart;
