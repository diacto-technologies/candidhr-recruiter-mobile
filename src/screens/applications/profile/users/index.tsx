import React, { Fragment, useRef, useState, useCallback } from 'react';
import {
  View,
  Animated,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview';
import Header from '../../../../components/organisms/header';
import { goBack } from '../../../../utils/navigationUtils';
import { windowWidth } from '../../../../utils/devicelayout';
import SearchBar from '../../../../components/atoms/searchbar';
import Button from '../../../../components/atoms/button';
import { SvgXml } from 'react-native-svg';
import { Fonts } from '../../../../theme/fonts';
import { useRNSafeAreaInsets } from '../../../../hooks/useRNSafeAreaInsets';
import { sortIcon } from '../../../../assets/svg/sort';
interface User {
  id: string;
  name: string;
  email: string;
  invited_on: string;
  role: string;
}

// Mock data for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Sachin patidar', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'Admin' },
  { id: '2', name: 'Rakshat amin', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'Participant' },
  { id: '3', name: 'Samta raka', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'Admin G' },
  { id: '4', name: 'Harsh vikram', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'Participant' },
  { id: '5', name: 'Aman sisodiya', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'Editor' },
  { id: '6', name: 'Pravin khandare', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'View Only' },
  { id: '7', name: 'Pravin khandare', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'View Only' },
  { id: '8', name: 'Pravin khandare', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'View Only' },
  { id: '9', name: 'Pravin khandare', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'View Only' },
  { id: '10', name: 'Pravin khandare', email: 'jacob@diacto.com', invited_on: 'June 18, 2025', role: 'View Only' },
];

const TRACK_WIDTH = 320;

const Users = () => {
  const insets = useRNSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth - 40);
  const [searchText, setSearchText] = useState('');
  const shadowOpacity = useRef(new Animated.Value(0)).current;

  // TODO: Replace with actual API data
  const [users] = useState<User[]>(MOCK_USERS);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show/hide shadow based on scrollX
  scrollX.addListener(({ value }) => {
    Animated.timing(shadowOpacity, {
      toValue: value > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  });

  const onContainerLayout = (e: any) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const visibleWidth = containerWidth - 140;
  const scrollRange = Math.max(contentWidth - visibleWidth, 0);

  const THUMB_WIDTH =
    scrollRange > 0
      ? Math.max((visibleWidth / contentWidth) * TRACK_WIDTH, 40)
      : TRACK_WIDTH - 20;

  const translateX = scrollX.interpolate({
    inputRange: [0, scrollRange],
    outputRange: [0, TRACK_WIDTH - THUMB_WIDTH],
    extrapolate: 'clamp',
  });

  const handleAddUsers = useCallback(() => {
    // TODO: Implement add users functionality
    console.log('Add users pressed');
  }, []);

  const handleSort = useCallback(() => {
    // TODO: Implement sort functionality
    console.log('Sort pressed');
  }, []);

  /** LEFT FIXED COLUMN - Name */
  const renderLeftColumn = ({ item, index }: { item: User; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : '#FFF';

    return (
      <View style={[styles.leftFixedColumn, { backgroundColor: bg }]}>
        <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
          {item.name}
        </Typography>
        <Typography variant="regularTxtxs" color={colors.gray[500]}>
          {item.email}
        </Typography>
      </View>
    );
  };

  /** RIGHT SCROLLABLE CELLS - Invited on, Role */
  const renderRightRow = ({ item, index }: { item: User; index: number }) => {
    const bg = index % 2 === 1 ? colors.neutrals.lightGray : '#FFF';

    return (
      <View style={[styles.row, { backgroundColor: bg }]}>
        <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
          {item.invited_on}
        </Typography>
        <Typography style={styles.cell} variant="regularTxtsm" color={colors.gray[600]}>
          {item.role}
        </Typography>
      </View>
    );
  };

  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title="Users" backNavigation showTitle onBack={goBack}/>

        {/* Search and Sort Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search"
              onClear={() => setSearchText('')}
            />
          </View>
          <Pressable style={styles.sortButton} onPress={handleSort}>
            <SvgXml xml={sortIcon} width={20} height={20} />
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]} style={styles.sortText}>
              Sort
            </Typography>
          </Pressable>
        </View>

        {/* Table */}
        <View style={styles.card} onLayout={onContainerLayout}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            bounces={false}
          >
            <View style={styles.tableContainer}>
              {/* Left Fixed Column */}
              <Animated.View
                style={[
                  styles.leftFixedWrapper,
                  {
                    shadowColor: '#0A0D12',
                    shadowOffset: { width: 2, height: 0 },
                    shadowOpacity: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.06],
                    }),
                    shadowRadius: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                    elevation: shadowOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 6],
                    }),
                  },
                ]}
              >
                {/* LEFT COLUMN HEADER */}
                <View style={styles.headerRow}>
                  <Typography
                    variant="semiBoldTxtxs"
                    style={styles.headerText}
                    color={colors.gray[500]}
                  >
                    Name
                  </Typography>
                </View>

                <FlatList
                  data={filteredUsers}
                  renderItem={renderLeftColumn}
                  keyExtractor={(item) => `left-${item.id}`}
                  scrollEnabled={false}
                />
              </Animated.View>

              {/* Right Scrollable Columns */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onContentSizeChange={(w) => setContentWidth(w)}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                bounces={false}
              >
                <View>
                  <View style={styles.headerRow}>
                    {['Invited on', 'Role'].map((title, index) => (
                      <Typography
                        key={index}
                        variant="semiBoldTxtxs"
                        style={styles.headerText}
                        color={colors.gray[500]}
                      >
                        {title}
                      </Typography>
                    ))}
                  </View>

                  <FlatList
                    data={filteredUsers}
                    renderItem={renderRightRow}
                    keyExtractor={(item) => `right-${item.id}`}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        {/* Scroll indicator */}
        <View style={styles.paginationContainer}>
          <View style={[styles.scrollTrack, { width: TRACK_WIDTH - 250 }]}>
            <Animated.View
              style={[
                styles.scrollThumb,
                { width: THUMB_WIDTH, transform: [{ translateX }] },
              ]}
            />
          </View>
        </View>
      </CustomSafeAreaView>

      {/* Add Users Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.insetsBottom + 16 }]}>
        <Button onPress={handleAddUsers} style={styles.addButton}>
          Add users
        </Button>
      </View>
    </Fragment>
  );
};

export default Users;

const MIN_COL_WIDTH = windowWidth * 0.35;

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.base.white,
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sortText: {
    marginLeft: 8,
  },

  card: {
    flex: 1,
    backgroundColor: colors.base.white,
    borderTopWidth: 1,
    borderColor: colors.gray[200],
  },

  tableContainer: {
    flexDirection: 'row',
  },

  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    paddingLeft: 20,
    backgroundColor: colors.gray[50],
  },

  headerText: {
    minWidth: MIN_COL_WIDTH,
    marginRight: 16,
  },

  row: {
    flexDirection: 'row',
    height: 73,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    paddingLeft: 20,
    alignItems: 'center',
  },

  cell: {
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    minWidth: MIN_COL_WIDTH,
    marginRight: 16,
  },

  /** FIXED LEFT COLUMN */
  leftFixedWrapper: {
    width: '50%',
    backgroundColor: colors.base.white,
    borderRightWidth: 1,
    borderColor: colors.gray[200],
    zIndex: 10,
  },

  leftFixedColumn: {
    height: 73,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    justifyContent: 'center',
  },

  /** SCROLLBAR */
  scrollTrack: {
    paddingVertical: 10,
  },
  scrollThumb: {
    height: 6,
    backgroundColor: colors.mainColors.scrollBar,
    borderRadius: 10,
  },

  paginationContainer: {
    flexDirection: 'row',
    borderColor: colors.gray[200],
    alignSelf: 'center',
  },

  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.base.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },

  addButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.brand[600],
  },
});
