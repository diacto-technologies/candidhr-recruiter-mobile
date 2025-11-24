// import React, { Fragment } from 'react';
// import { Text } from 'react-native';
// import { Fonts, fontweightType } from '../../theme/fonts';
// import { TypographyProps } from './typography';
// import { colors } from '../../../theme/colors';

// export const textvariant = {
//   H1: { fontFamily: Fonts.CTCSplashRoundedBold, fontSize: 18, fontWeight: '600' as fontweightType },
//   H1B: { fontFamily: Fonts.BSBloggerSans, fontSize: 16, fontWeight: '600' as fontweightType },
//   H1C: {
//     fontFamily: Fonts.CTCSplashRoundedBold,
//     fontSize: 36,
//     fontWeight: '600' as fontweightType,
//   },
//   H2: {},
//   H2B: {},
//   H2C: {},
//   H3: {},
//   H3B: { fontFamily: Fonts.BSBloggerSans, fontSize: 24, fontWeight: '600' as fontweightType },
//   H3C: {},
//   H4: {},
//   H4B: { fontFamily: Fonts.BSBloggerSans, fontSize: 20, fontWeight: '600' as fontweightType },
//   H4C: {},
//   H5: { fontFamily: Fonts.Akrobat, fontSize: 12, FontWeight: '900' as fontweightType },
//   H5B: { fontFamily: Fonts.BSBloggerSans, fontSize: 16, fontWeight: '400' as fontweightType },
//   H5C: { fontFamily: Fonts.Akrobat, fontSize: 14, FontWeight: '900' as fontweightType },
//   H6: { fontFamily: Fonts.Akrobat, fontSize: 20, FontWeight: '600' as fontweightType },
//   H7: { fontFamily: Fonts.Akrobat, fontSize: 30, FontWeight: '600' as fontweightType },
//   H6B: { fontFamily: Fonts.Akrobat, fontSize: 16, FontWeight: '900' as fontweightType },
//   H6C: { fontFamily: Fonts.Akrobat, fontSize: 24, FontWeight: '900' as fontweightType },

//   P1: {},
//   P1B: { fontFamily: Fonts.calibriregular, fontSize: 13, fontWeight: '400' as fontweightType },
//   P1C: { fontFamily: Fonts.calibriregular, fontSize: 14, fontWeight: '400' as fontweightType },
//   P2: { fontFamily: Fonts.calibriregular, fontSize: 40, fontWeight: '400' as fontweightType },
//   P2B: { fontFamily: Fonts.BSBloggerSans, fontSize: 14, fontWeight: '400' as fontweightType },
//   P2C: { fontFamily: Fonts.calibribold, fontSize: 14, fontWeight: '600' as fontweightType },
//   P3: { fontFamily: Fonts.calibriregular, fontSize: 14, fontWeight: '400' as fontweightType },
//   P3B: { fontFamily: Fonts.calibribold, fontSize: 12, fontWeight: '600' as fontweightType },
//   P3C: { fontFamily: Fonts.calibriregular, fontSize: 12, fontWeight: '400' as fontweightType },
//   P4: {},
//   P4B: {},
//   P4C: {},
//   P5: {},
//   P5B: {},
//   P5C: {},
//   P6: {},
//   P6B: {},
//   P6C: {},

//   P11: { fontFamily: Fonts.RubikRegular, fontSize: 12 },
//   T11: { fontFamily: Fonts.RubikMedium, fontSize: 12 },
// };

// const Typography = (props: TypographyProps) => {
//   return (
//     <Fragment>
//       <Text
//         {...props}
//         style={{
//           ...textvariant[props?.variant || 'H4B'],
//           ...props.style,
//           color: props.color || colors.grayScale.darkGray,
//         }}
//       >
//         {props.children}
//       </Text>
//     </Fragment>
//   );
// };

// export default Typography;


// components/typography/Typography.tsx

import React, { Fragment } from 'react';
import { Text } from 'react-native';
import { colors } from '../../../theme/colors';
import { TypographyProps } from './typography';
import { Fonts, fontweightType } from '../../../theme/fonts';

// ---------------- TEXT VARIANTS ----------------

export const textvariant = {
  // Headings

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
  P1M: {
  fontFamily: Fonts.InterMedium,
  fontSize: 14,
  fontWeight: '500',
},
P2M: {
  fontFamily: Fonts.InterMedium,
  fontSize: 16,
  fontWeight: '500',
}
};

// ---------------- COMPONENT ----------------

const Typography = (props: TypographyProps) => {
  const variantStyle = textvariant[props.variant || 'P1'];

  return (
    <Fragment>
      <Text
        {...props}
        style={{
          ...variantStyle,
          ...props.style,
          color: props.color || colors.grayScale.darkGray,
        }}
      >
        {props.children}
      </Text>
    </Fragment>
  );
};

export default Typography;

