import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
        backgroundColor: colors.common.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray[300],
        paddingLeft: 12,
        paddingRight:6,
        shadowColor: '#0A0D12',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },

    dropdownLabelStyle: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    star: {
        color: colors.error[500],
    },

    dropdown: {
        position:'relative',
        alignSelf:'center',
        borderWidth: 0,
        backgroundColor: colors.common.white,
        //minHeight: 42,
    },

    optionsContainer: {
        borderRadius: 8,
        borderColor: colors.gray[300],
        elevation: 20,
        width: '100%',
        marginTop:10,
    },

    labelText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    error: {
        marginTop: 4,
        fontSize: 12,
        color: colors.error[500],
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    pickerWrapper: {
        flex: 1,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    optionText: {
        fontFamily: Fonts.InterBold,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        color: colors.gray[900],
    },

    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});
