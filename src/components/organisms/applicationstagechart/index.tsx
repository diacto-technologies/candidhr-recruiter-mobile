import React, { Fragment, useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';
import Typography from '../../atoms/typography';
import { useStyles } from './styles';
import { buildBarData, getMaxValueFromStageData } from './helpers';
import Shimmer from '../../atoms/shimmer';
import type { ApplicationStageChartProps, BarItem, stageDataInterface } from './applicationstagechart';

const ApplicationStageChart: React.FC<ApplicationStageChartProps> = ({
    stageData,
    loading,
}) => {
    const styles = useStyles();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const barData = buildBarData(stageData, selectedIndex);
    const maxValueFromAPI = getMaxValueFromStageData(stageData);
    const barCount = barData.length;
    const availableWidth = screenWidth - 10;
    const barWidth = 32;
    const dynamicSpacing = Math.max(20, (availableWidth - barCount * barWidth) / (barCount + 1));
    
    if (loading) {
        return (
          <View style={styles.container}>
            <Typography variant="semiBoldTxtlg">Application per stage</Typography>
      
            <View style={styles.gridLines}>
              {/* Grid lines */}
              <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <Shimmer key={i} height={1} width="100%" style={{ marginVertical: 32 }} />
                ))}
              </View>
      
              {/* Bars + Labels */}
              <View style={styles.barLables}>
                {[85, 130, 95, 60, 75].map((height, index) => (
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
                <Typography variant="semiBoldTxtlg">Application per stage</Typography>
                <View style={{ overflow: 'hidden' }}>
                    
                    <BarChart
                        data={barData}
                        barWidth={barWidth}
                        initialSpacing={dynamicSpacing/2}
                        spacing={dynamicSpacing}
                        showGradient
                        yAxisThickness={0}
                        xAxisThickness={0}
                        height={164}
                        maxValue={maxValueFromAPI}
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
                        renderTooltip={(item: BarItem) => (
                            <View style={styles.tooltipWrapper}>
                                <View style={styles.tooltipArrow} />
                                <View style={styles.tooltipContainer}>
                                    <Typography variant="semiBoldTxtxs" color={colors.base.white}>
                                        {item.value.toString().padStart(1, '0')} Applicants
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