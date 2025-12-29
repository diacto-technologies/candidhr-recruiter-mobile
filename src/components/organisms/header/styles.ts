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
          }
    });
};