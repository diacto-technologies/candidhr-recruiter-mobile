import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { colors } from "../../../../../theme/colors";
import { Illustrations } from "../../../../../assets/svg/illustrations";
import { SvgXml } from "react-native-svg";
import { ApplicantList } from "../../../../../components/organisms";
import SearchBar from "../../../../../components/atoms/searchbar";
import { Divider } from "react-native-paper";
import { Typography } from "../../../../../components";
import BackgroundPattern from "../../../../../components/atoms/backgroundpattern";
import CustomSwitch from "../../../../../components/atoms/switchbutton";
import { useStyles } from "./styles";
import DeviceInfo from "react-native-device-info";
import { useApplicantsTabController } from "./hooks/useApplicantsTabController";

const ApplicantsTab = () => {
  const styles = useStyles();
  const isTablet = DeviceInfo.isTablet();
  const ctrl = useApplicantsTabController();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={ctrl.filters.name}
          placeholder="User search by name"
          onChangeText={ctrl.handleSearch}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchContainer}>
            <CustomSwitch value={ctrl.aiEnabled} onValueChange={ctrl.setAiEnabled} />
            <Typography variant="H4" color={colors.mainColors.carbonGray}>
              AI recommendation
            </Typography>
          </View>
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={ctrl.handleExport}
          >
            <Typography variant="H4" color={colors.brand[600]}>
              + Export
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <Divider />

      {/* 📄List */}
      <FlatList
        data={ctrl.dataSource}
        keyExtractor={(item) =>
          item.__skeleton ? item.__id : String(item.id)
        }
        renderItem={({ item }) =>
          item.__skeleton ? (
            <ApplicantList loading />
          ) : (
            <ApplicantList item={item} />
          )
        }
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? "tablet-2" : "mobile-1"}
        columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        bounces={false}
        onEndReached={ctrl.handleEndReached}
        onMomentumScrollBegin={ctrl.handleMomentumScrollBegin}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !ctrl.loading ? (
            <BackgroundPattern bgStyle={styles.emptyStateBg}>
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateTextWrap}>
                  <SvgXml xml={Illustrations} style={styles.emptyStateSvg} />
                  <Typography variant="semiBoldTxtmd">
                    No results found
                  </Typography>

                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[500]}
                    style={styles.emptyStateSubtext}
                  >
                    Try adjusting your search or filters
                  </Typography>
                </View>
              </View>
            </BackgroundPattern>
          ) : null
        }
      />
    </View>
  );
};

export default ApplicantsTab;
