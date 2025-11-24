// interface FontsProps {
//   Akrobat: string;
//   BSBloggerSans1: string;
//   BSBloggerSans: string;
//   calibribold: string;
//   calibribolditalic: string;
//   calibrilight: string;
//   calibrilightitalic: string;
//   calibriregular: string;
//   calibriregularitalic: string;
//   CTCSplashRoundedBold: string;
//   CTCSplashRoundedBoldItalic: string;
//   CTCSplashRoundedRegular: string;
//   CTCSplashRoundedRegularItalic: string;
//   RubikBlack: string;
//   RubikBlackItalic: string;
//   RubikBold: string;
//   RubikBoldItalic: string;
//   RubikExtraBold: string;
//   RubikExtraBoldItalic: string;
//   RubikItalic: string;
//   RubikLight: string;
//   RubikLightItalic: string;
//   RubikMedium: string;
//   RubikMediumItalic: string;
//   RubikRegular: string;
//   RubikSemiBold: string;
//   RubikSemiBoldItalic: string;
// }

// export const Fonts: FontsProps = {
//   Akrobat: 'Akrobat',
//   BSBloggerSans1: 'BSBloggerSans1',
//   BSBloggerSans: 'BSBloggerSans',
//   calibribold: 'calibribold',
//   calibribolditalic: 'calibribolditalic',
//   calibrilight: 'calibrilight',
//   calibrilightitalic: 'calibrilightitalic',
//   calibriregular: 'calibriregular',
//   calibriregularitalic: 'calibriregularitalic',
//   CTCSplashRoundedBold: 'CTCSplashRoundedBold',
//   CTCSplashRoundedBoldItalic: 'CTCSplashRoundedBoldItalic',
//   CTCSplashRoundedRegular: 'CTCSplashRoundedRegular',
//   CTCSplashRoundedRegularItalic: 'CTCSplashRoundedRegularItalic',
//   RubikBlack: 'Rubik-Black',
//   RubikBlackItalic: 'Rubik-BlackItalic',
//   RubikBold: 'Rubik-Bold',
//   RubikBoldItalic: 'Rubik-BoldItalic',
//   RubikExtraBold: 'Rubik-ExtraBold',
//   RubikExtraBoldItalic: 'Rubik-ExtraBoldItalic',
//   RubikItalic: 'Rubik-Italic',
//   RubikLight: 'Rubik-Light',
//   RubikLightItalic: 'Rubik-LightItalic',
//   RubikMedium: 'Rubik-Medium',
//   RubikMediumItalic: 'Rubik-MediumItalic',
//   RubikRegular: 'Rubik-Regular',
//   RubikSemiBold: 'Rubik-SemiBold',
//   RubikSemiBoldItalic: 'Rubik-SemiBoldItalic',
// };

// export type fontweightType =
//   | 'normal'
//   | 'bold'
//   | '100'
//   | '200'
//   | '300'
//   | '400'
//   | '500'
//   | '600'
//   | '700'
//   | '800'
//   | '900'
//   | 100
//   | 200
//   | 300
//   | 400
//   | 500
//   | 600
//   | 700
//   | 800
//   | 900
//   | 'ultralight'
//   | 'thin'
//   | 'light'
//   | 'medium'
//   | 'regular'
//   | 'semibold'
//   | 'condensedBold'
//   | 'condensed'
//   | 'heavy'
//   | 'black'
//   | undefined;

// export interface fontweightProps {
//   PoppinsBlack: fontweightType;
//   PoppinsBlackItalic: fontweightType;
//   PoppinsBold: fontweightType;
//   PoppinsBoldItalic: fontweightType;
//   PoppinsExtraBold: fontweightType;
//   PoppinsExtraBoldItalic: fontweightType;
//   PoppinsExtraLight: fontweightType;
//   PoppinsExtraLightItalic: fontweightType;
//   PoppinsItalic: fontweightType;
//   PoppinsLight: fontweightType;
//   PoppinsLightItalic: fontweightType;
//   PoppinsMedium: fontweightType;
//   PoppinsMediumItalic: fontweightType;
//   PoppinsRegular: fontweightType;
//   PoppinsSemiBold: fontweightType;
//   PoppinsSemiBoldItalic: fontweightType;
//   PoppinsThin: fontweightType;
//   PoppinsThinItalic: fontweightType;
// }

// export const FontWeight: fontweightProps = {
//   PoppinsBlack: '900',
//   PoppinsBlackItalic: '900',
//   PoppinsBold: '700',
//   PoppinsBoldItalic: '700',
//   PoppinsExtraBold: '800',
//   PoppinsExtraBoldItalic: '800',
//   PoppinsExtraLight: '200',
//   PoppinsExtraLightItalic: '200',
//   PoppinsItalic: 'normal',
//   PoppinsLight: '300',
//   PoppinsLightItalic: '300',
//   PoppinsMedium: '500',
//   PoppinsMediumItalic: '500',
//   PoppinsRegular: '400',
//   PoppinsSemiBold: '600',
//   PoppinsSemiBoldItalic: '600',
//   PoppinsThin: '100',
//   PoppinsThinItalic: '100',
// };
export interface FontsProps {
  calibribold: any;
  calibriregular: any;
  InterRegular: string;
  InterMedium: string;
  InterSemiBold: string;
  InterBold: string;
}

export const Fonts: FontsProps = {
  InterRegular: 'Inter-Regular',
  InterMedium: 'Inter-Medium',
  InterSemiBold: 'Inter-SemiBold',
  InterBold: 'Inter-Bold',
};

// Inter official supported weights
export type fontweightType = '400' | '500' | '600' | '700';
