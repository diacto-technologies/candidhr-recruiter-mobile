import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const useStyles = () => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: 72,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'space-between',
            position: 'relative',
            backgroundColor:colors.base.white,
            paddingHorizontal:16,
            borderBottomColor:colors.gray['200'],
          },
          title: {
            textAlign: 'center',
          },
          subEditcontainer:{
            flexDirection:'row',
            columnGap:12
          },
          subEditcontainerWithDropdown: {
            alignItems: 'center',
          },
          statusDropdownWrapper: {
            minWidth: 180,
            maxWidth: 200,
          },
          titleCenterOverlay: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 48,
            pointerEvents: 'none',
          },
    });
};