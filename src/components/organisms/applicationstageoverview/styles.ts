import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { windowWidth } from '../../../utils/devicelayout';

export const useStyles = () => {
  const MIN_COL_WIDTH = windowWidth * 0.35;
    return StyleSheet.create({
        card: {
            backgroundColor: colors.base.white,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.gray['200'],
            shadowColor: 'rgba(10, 13, 18, 0.3)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          },
          title: {
            //padding:16
          },
        
          /* Header */
          headerRow: {
            flexDirection: 'row',
            paddingVertical:8,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.gray['200'],
            paddingLeft: 20,
            backgroundColor: colors.gray[50],
          },
          headerText: {
            minWidth: MIN_COL_WIDTH,
            marginRight: 16,
          },
        
          /* Rows */
          row: {
            flexDirection: 'row',
            paddingVertical: 24,
            borderBottomWidth: 1,
            borderBottomColor:colors.gray['200'],
            paddingLeft: 20,
          },
          cell: {
            minWidth: MIN_COL_WIDTH,
            marginRight: 16,
          },
        
          /* Scroll Bar */
          scrollTrack: {
            paddingVertical: 6,
          },
          scrollThumb: {
            height: 6,
            backgroundColor: colors.mainColors.scrollBar,
            borderRadius: 10,
          },
        
          /* Pagination */
          paginationContainer: {
            flexDirection: 'row',
            //justifyContent: 'space-between',
            padding: 16,
            //alignItems: 'center',
            borderTopWidth: 1,
            borderColor: colors.gray['200'],
            alignSelf:"center"
          },
          arrowButton: {
            width: 36,
            height: 36,
            borderRadius:8,
            borderWidth: 1,
            borderColor: colors.gray[300],
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.base.white,
          },
          pageText: {
            color: colors.gray[700],
          },
    });
};