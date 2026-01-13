import React, { Fragment } from 'react';
import { Text } from 'react-native';
import { colors } from '../../../theme/colors';
import { TypographyProps } from './typography';
import { Fonts, fontweightType } from '../../../theme/fonts';
import { RFValue } from "react-native-responsive-fontsize";


export const textvariant = {
  H1XL: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 30,
    fontWeight: '600',
  },

  H1: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 20,
    fontWeight: '600' as fontweightType,
  },

  H2: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 18,
    fontWeight: '600' as fontweightType,
  },

  H3: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    fontWeight: '600' as fontweightType,
  },

  H4: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 14,
    fontWeight: '600' as fontweightType,
  },

  // Body text
  P1: {
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    fontWeight: '400' as fontweightType,
  },

  P2: {
    fontFamily: Fonts.InterRegular,
    fontSize: 13,
    fontWeight: '400' as fontweightType,
  },

  P3: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    fontWeight: '400' as fontweightType,
  },

  P4: {
    fontFamily: Fonts.InterRegular,
    fontSize: 11,
    fontWeight: '400' as fontweightType,
  },

  // Buttons / Tags
  T1: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    fontWeight: '600' as fontweightType,
  },

  T2: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 12,
    fontWeight: '600' as fontweightType,
  },

  P0M: {
    fontFamily: Fonts.InterMedium,
    fontSize: 12,
    fontWeight: '500',
  },
  P1M: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    fontWeight: '500',
  },
  P2M: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    fontWeight: '500',
  },
  regularD2xl: {
    fontFamily: Fonts.InterRegular,
    fontSize: 72,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 90,
    letterSpacing: 72 * 0.02,
  },

  regularDxl: {
    fontFamily: Fonts.InterRegular,
    fontSize: 60,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 72,
    letterSpacing: 60 * 0.02,
  },

  regularDlg: {
    fontFamily: Fonts.InterRegular,
    fontSize: 48,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 60,
    letterSpacing: 48 * 0.02,
  },
  regularDmd: {
    fontFamily: Fonts.InterRegular,
    fontSize: 36,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 44,
    letterSpacing: 36 * 0.02,
  },
  regularDsm: {
    fontFamily: Fonts.InterRegular,
    fontSize: 30,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 38,
  },
  regularDxs: {
    fontFamily: Fonts.InterRegular,
    fontSize: 24,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 32,
  },
  regularTxtxl: {
    fontFamily: Fonts.InterRegular,
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 30,
  },

  regularTxtlg: {
    fontFamily: Fonts.InterRegular,
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 28,
  },
  regularTxtmd: {
    fontFamily: Fonts.InterRegular,
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 24,
  },
  regularTxtsm: {
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  regularTxtxs: {
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 18,
  },


  //// Md Font 
  mediumD2xl: {
    fontFamily: Fonts.InterMedium,
    fontSize: 72,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 90,
    letterSpacing: 72 * 0.02,
  },

  mediumDxl: {
    fontFamily: Fonts.InterMedium,
    fontSize: 60,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 72,
    letterSpacing: 60 * 0.02,
  },

  mediumDlg: {
    fontFamily: Fonts.InterMedium,
    fontSize: 48,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 60,
    letterSpacing: 48 * 0.02,
  },
  mediumDmd: {
    fontFamily: Fonts.InterMedium,
    fontSize: 36,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 44,
    letterSpacing: 36 * 0.02,
  },
  mediumDsm: {
    fontFamily: Fonts.InterMedium,
    fontSize: 30,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 38,
  },
  mediumDxs: {
    fontFamily: Fonts.InterMedium,
    fontSize: 24,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 32,
  },
  mediumTxtxl: {
    fontFamily: Fonts.InterMedium,
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 30,
  },

  mediumTxtlg: {
    fontFamily: Fonts.InterMedium,
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 28,
  },
  mediumTxtmd: {
    fontFamily: Fonts.InterMedium,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 24,
  },
  mediumTxtsm: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  mediumTxtxs: {
    fontFamily: Fonts.InterMedium,
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
  },



  /// SemiBold 
  semiBoldD2xl: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 72,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 90,
  },

  semiBoldDxl: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 60,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 72,
    letterSpacing: 60 * 0.02,
  },

  semiBoldDlg: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 48,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 60,
    letterSpacing: (48 * 0.02),
  },
  semiBoldDmd: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 36,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 44,
    letterSpacing: (36 * 0.02),
  },
  semiBoldDsm: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 30,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 38,
  },
  semiBoldDxs: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 24,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 32,
  },
  semiBoldTxtxl: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 30,
  },

  semiBoldTxtlg: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 28,
  },
  semiBoldTxtmd: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
  },
  semiBoldTxtsm: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  semiBoldTxtxs: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 18,
  },

  ////Bold
  boldD2xl: {
    fontFamily: Fonts.InterBold,
    fontSize: 72,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 90,
    letterSpacing: (72 * 0.02),
  },

  boldDxl: {
    fontFamily: Fonts.InterBold,
    fontSize: 60,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 72,
    letterSpacing: (60 * 0.02),
  },

  boldDlg: {
    fontFamily: Fonts.InterBold,
    fontSize: 48,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 60,
    letterSpacing: (48 * 0.02),
  },
  boldDmd: {
    fontFamily: Fonts.InterBold,
    fontSize: 36,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 44,
    letterSpacing: (36 * 0.02),
  },
  boldDsm: {
    fontFamily: Fonts.InterBold,
    fontSize: 30,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 38,
  },
  boldDxs: {
    fontFamily: Fonts.InterBold,
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 32,
  },
  boldTxtxl: {
    fontFamily: Fonts.InterBold,
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 30,
  },

  boldTxtlg: {
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 28,
  },
  boldTxtmd: {
    fontFamily: Fonts.InterBold,
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 24,
  },
  boldTxtsm: {
    fontFamily: Fonts.InterBold,
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 20,
  },
  boldTxtxs: {
    fontFamily: Fonts.InterBold,
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 18,
  },
};

// ---------------- COMPONENT ----------------

const Typography = (props: TypographyProps) => {
  const variantStyle = textvariant[props.variant || 'P1'];

  return (
    <Fragment>
      <Text
      allowFontScaling={false}
        {...props}
        style={{
          ...variantStyle,
          ...props.style,
          color: props.color || colors.gray['900'],
        }}
      >
        {props.children}
      </Text>
    </Fragment>
  );
};

export default Typography;

