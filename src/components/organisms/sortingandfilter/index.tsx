import { View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import React, { FC, Fragment } from 'react';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { filterIcon } from '../../../assets/svg/filter';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setSort } from '../../../features/applications/slice';
import { selectApplicationsFilters } from '../../../features/applications/selectors';

interface Props {
  title: string;
  options: string[];
  onPressFilter: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  onItemPress: (item: string) => void;
}

const SortingAndFilter: FC<Props> = ({
  title,
  options,
  onPressFilter,
  selectedTab,
  setSelectedTab,
  onItemPress
}) => {

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectApplicationsFilters);

  return (
    <Fragment>
      <View style={{
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: colors.common.white,
        borderBottomWidth: 2,
        borderColor: colors.gray[200],
      }}>
        <Pressable
          onPress={onPressFilter}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 4,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ position: 'relative' }}>
            <SvgXml xml={filterIcon} color={colors.brand[500]} />
            <View
              style={{
                position: 'absolute',
                top: 1,
                left: 0,
                height: 7,
                width: 7,
                borderRadius: 4,
                backgroundColor: colors.brand[500],
              }}
            />
          </View>

          <Typography variant="H4" style={{ color: '#535862' }}>
            {title}
          </Typography>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options?.map((item, index) => {

            const isSortable = item === 'Applied' || item === 'Last Update';
            const isSortActive = filters.sortBy === item;
            const dir = filters.sortDir;

            const isActive = item === selectedTab;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onItemPress(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // paddingVertical: 4,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isActive ? colors.brand[200] : '#E9EAEB',
                  backgroundColor: isActive ? colors.brand[50] : '#FAFAFA',
                  marginRight: 12,
                  gap: 4,
                }}
              >

                <Typography
                  variant="P1M"
                  color={isActive ? colors.brand[700] : '#414651'}
                >
                  {item}
                </Typography>
                {isSortable && (
                  <Typography variant="regularTxtxs" color={colors.gray[500]}>
                    {isSortActive
                      ? (dir === 'desc' ? '▼' : '▲')
                      : '▲'}
                  </Typography>
                )}

              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Fragment>
  );
};

export default SortingAndFilter;
