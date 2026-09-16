import React, { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../theme/colors';
import { screenWidth } from '../../../utils/devicelayout';
import Typography from '../../atoms/typography';
import { useStyles } from './styles';
import { buildBarData, getMaxValueFromStageData } from './helpers';
import Shimmer from '../../atoms/shimmer';
import type { ApplicationStageChartProps, BarItem, stageDataInterface } from './applicationstagechart';
import { isTablet } from 'react-native-device-info';

const CHART_HEIGHT = 184;
const DUMMY_BAR_HEIGHTS = [85, 130, 95, 60, 75, 50, 40];
const IS_TABLET = isTablet();

const ApplicationStageChart: React.FC<ApplicationStageChartProps> = ({
  stageData,
  loading,
}) => {
  const styles = useStyles();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [chartContainerWidth, setChartContainerWidth] = useState<number>(0);
  
  const maxValueFromAPI = useMemo(() => getMaxValueFromStageData(stageData), [stageData]);
  
  const barData = useMemo(() => {
      return buildBarData(stageData, selectedIndex, styles.topLabelText);
  }, [stageData, selectedIndex, styles.topLabelText]);

  const barCount = barData.length;
  const barWidth = IS_TABLET ? 46 : 28;
  const initialSpacing = IS_TABLET ? 24 : 16;
  const endSpacing = IS_TABLET ? 24 : 16;

  const dynamicSpacing = useMemo(() => {
    const available = chartContainerWidth > 0 ? chartContainerWidth : screenWidth - 48;
    const remaining = available - initialSpacing - endSpacing - barCount * barWidth;
    if (barCount <= 1) return 20;
    return Math.max(10, Math.floor(remaining / (barCount - 1)));
  }, [chartContainerWidth, barCount, barWidth, initialSpacing, endSpacing]);

  const handleBarPress = useCallback((item: BarItem, index: number) => {
      setSelectedIndex(index);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Typography variant="semiBoldTxtlg">Application per stage</Typography>
        </View>

        <View style={styles.gridLines}>
          {/* Grid lines */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            {[0, 1, 2, 3, 4].map((_, i) => (
              <Shimmer key={i} height={1} width="100%" style={{ marginVertical: 32 }} />
            ))}
          </View>

          {/* Bars + Labels */}
          <View style={styles.barLabels}>
            {DUMMY_BAR_HEIGHTS.map((height, index) => (
              <View key={index} style={{ alignItems: 'center', gap: 8, paddingHorizontal: 6 }}>
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
      <View style={styles.headerRow}>
        <Typography variant="semiBoldTxtlg">Application per stage</Typography>
      </View>
      <View 
        style={styles.chartWrapper}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - chartContainerWidth) > 1) {
            setChartContainerWidth(w);
          }
        }}
      >
        <BarChart
          data={barData}
          barWidth={barWidth}
          initialSpacing={initialSpacing}
          endSpacing={endSpacing}
          spacing={dynamicSpacing}
          showGradient
          yAxisThickness={0}
          xAxisThickness={0}
          height={CHART_HEIGHT}
          maxValue={maxValueFromAPI}
          minHeight={4}
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
          onPress={handleBarPress}
          focusedBarIndex={selectedIndex}
          hideYAxisText
          topLabelContainerStyle={styles.topLabelContainer}
          topLabelTextStyle={styles.topLabelText}
          renderTooltip={(item: BarItem, index?: number) => {
            const activeIdx = index !== undefined ? index : selectedIndex;
            const isRightSide = activeIdx >= 4;
            const count = item.actualValue !== undefined ? item.actualValue : item.value;

            if (isRightSide) {
              return (
                <View style={styles.tooltipWrapperRightSide}>
                  <View style={styles.tooltipContainer}>
                    <Typography variant="semiBoldTxtxs" color={colors.base.white}>
                      {count.toLocaleString()} Applicants
                    </Typography>
                  </View>
                  <View style={styles.tooltipArrowRight} />
                </View>
              );
            }

            return (
              <View style={styles.tooltipWrapperLeftSide}>
                <View style={styles.tooltipArrowLeft} />
                <View style={styles.tooltipContainer}>
                  <Typography variant="semiBoldTxtxs" color={colors.base.white}>
                    {count.toLocaleString()} Applicants
                  </Typography>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ApplicationStageChart;