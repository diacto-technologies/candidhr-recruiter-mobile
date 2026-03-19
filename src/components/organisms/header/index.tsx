import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, Easing, Dimensions } from 'react-native';
import Typography from '../../atoms/typography';
import type { IHeader } from './header';
import { SvgXml } from 'react-native-svg';
import { backButtonIcon } from '../../../assets/svg/backbutton';
import { editIcon } from '../../../assets/svg/edit';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { searchIcon } from '../../../assets/svg/search';
import { useStyles } from './styles';
import SearchBar from '../../atoms/searchbar';
import StatusDropdown from '../dropdown/statusDropdown';

const { width: screenWidth } = Dimensions.get('window');

const Header = ({
  title,
  showTitle = true,
  onBack,
  backNavigation,
  edit,
  threedot,
  onThreeDotPress,
  borderCondition,
  showSearchIcon = false,
  onSearchIconPress,
  enableJobSearch = false,
  jobNameList = [],
  jobNameListLoading = false,
  jobNameListNext = null,
  searchText = '',
  onSearchTextChange,
  openSearch = false,
  onSearchToggle,
  onLoadMore,
  onJobSelect,
  onSearchClear,
  selectedJob,
  simpleSearch = false,
  onSimpleSearch,
  onSimpleClear,
  simpleSearchPlaceholder = "Search",
  statusDropdown = false,
  statusOptions = [],
  statusLabelKey = 'name',
  statusValueKey = 'id',
  statusValue,
  onStatusSelect,
  statusOpenModalOnSelect = false,
  statusChangeStatusModalProps,
}: IHeader) => {
  const styles = useStyles();

  // ✅ Animation value
  const anim = useRef(new Animated.Value(0)).current;

  // ✅ animate open/close
  useEffect(() => {
    Animated.timing(anim, {
      toValue: openSearch ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [openSearch]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  const searchOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSearchToggle = () => {
    if (onSearchToggle) {
      onSearchToggle(!openSearch);
    }
  };

  return (
    <View style={[styles.container, { borderBottomWidth: !borderCondition ? 1 : 0 }]}>
      {backNavigation ? (
        <>
          {/* ✅ Back + Title Row */}
          {(showTitle && !enableJobSearch) || enableJobSearch ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Pressable onPress={onBack} style={{ zIndex: 999 }}>
                <SvgXml xml={backButtonIcon} />
              </Pressable>

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Typography variant="semiBoldTxtxl" numberOfLines={1}>
                  {selectedJob?.title ? selectedJob.title : title}
                </Typography>
              </View>
            </View>
          ) : (
            // ✅ If title not required then only back icon
            <Pressable onPress={onBack} style={{ zIndex: 999 }}>
              <SvgXml xml={backButtonIcon} />
            </Pressable>
          )}

          {/* ✅ Right side: status dropdown + icons */}
          <View style={[styles.subEditcontainer, statusDropdown && styles.subEditcontainerWithDropdown]}>
            {statusDropdown && (
              <View style={styles.statusDropdownWrapper}>
                <StatusDropdown
                  label="Status"
                  options={statusOptions}
                  labelKey={statusLabelKey}
                  valueKey={statusValueKey}
                  setValue={statusValue}
                  onSelect={onStatusSelect}
                  compact
                  openModalOnSelect={statusOpenModalOnSelect}
                  changeStatusModalProps={statusChangeStatusModalProps}
                />
              </View>
            )}
            {showSearchIcon && !enableJobSearch && (
              <Pressable onPress={onSearchIconPress}>
                <SvgXml xml={searchIcon} />
              </Pressable>
            )}

            {enableJobSearch && (
              <Pressable onPress={handleSearchToggle}>
                <SvgXml xml={searchIcon} />
              </Pressable>
            )}

            {edit ? (
              <Pressable>
                <SvgXml xml={editIcon} />
              </Pressable>
            ) : null}

            {threedot ? (
              <Pressable onPress={onThreeDotPress}>
                <SvgXml xml={horizontalThreedotIcon} />
              </Pressable>
            ) : null}
          </View>
        </>
      ) : (
        <>
          {/* ✅ Left: Title / SearchBar */}
          {enableJobSearch && openSearch ? (
            <Animated.View
              style={{
                flex: 1,
                marginRight: 12,
                zIndex: 999,
                opacity: searchOpacity,
                transform: [{ translateX }],
              }}
            >
              <SearchBar
                value={searchText}
                onChangeText={simpleSearch ? (onSimpleSearch || (() => { })) : (onSearchTextChange || (() => { }))}
                placeholder={simpleSearch ? simpleSearchPlaceholder : "Select a job"}
                dropdown={!simpleSearch}
                data={simpleSearch ? [] : (jobNameList || [])}
                onSelect={simpleSearch ? undefined : onJobSelect}
                onEndReached={simpleSearch ? undefined : onLoadMore}
                loading={simpleSearch ? false : jobNameListLoading}
                onClear={simpleSearch ? onSimpleClear : onSearchClear}
              />
            </Animated.View>
          ) : (
            <Typography variant="semiBoldTxtxl">
              {selectedJob?.title ? selectedJob.title : title}
            </Typography>
          )}

          {/* ✅ Right: icons (search / three-dot) */}
          <View style={styles.subEditcontainer}>
            {showSearchIcon && !enableJobSearch && (
              <Pressable onPress={onSearchIconPress}>
                <SvgXml xml={searchIcon} />
              </Pressable>
            )}

            {enableJobSearch && (
              <Pressable onPress={handleSearchToggle}>
                <SvgXml xml={searchIcon} />
              </Pressable>
            )}

            {threedot ? (
              <Pressable onPress={onThreeDotPress}>
                <SvgXml xml={horizontalThreedotIcon} />
              </Pressable>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

export default Header;
