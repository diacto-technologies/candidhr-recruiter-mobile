import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';

export const useStyles = () => {
  const inset = useRNSafeAreaInsets()
    return StyleSheet.create({
      container: {
        flex: 1,
        paddingTop:inset.insetsTop,
        paddingBottom:inset.insetsBottom,
        //backgroundColor:colors.base.white
    },
        subContainer: { flex: 1, backgroundColor: '#F6F6F8' },
        tabContainer: {
          position: "relative",
          backgroundColor:colors.base.white,
        },
        bottomBorder: {
          height: 1,
          backgroundColor: colors.mainColors.borderColor || "#E5E5E5",
          marginTop: -1,
        },
        profileCard: {
          backgroundColor: '#fff',
          margin: 12,
          padding: 16,
          borderRadius: 12,
          flexDirection: 'row',
        },
        avatar: {
          width: 64,
          height: 64,
          backgroundColor: '#e8dff8',
          borderRadius: 32,
          marginRight: 12,
        },
        name: { fontSize: 18, fontWeight: '700' },
        sub: { color: '#666', marginTop: 4 },
        meta: { color: '#999', marginTop: 6 },
        tabRow: { flexDirection: 'row', marginHorizontal: 12, marginBottom: 10 },
        tabButton: {
          flex: 1,
          backgroundColor: '#fff',
          paddingVertical: 10,
          marginHorizontal: 4,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#eee',
          alignItems: 'center',
        },
        tabActive: { backgroundColor: '#6b46c1', borderColor: '#6b46c1' },
        tabText: { color: '#333', fontWeight: '600' },
        tabTextActive: { color: '#fff' },
        row: {
          flexDirection: 'row',
          marginTop: 18,
        },
        iconBox: {
          width: 48,
          height: 48,
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E1E1E1',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        },
    });
};
