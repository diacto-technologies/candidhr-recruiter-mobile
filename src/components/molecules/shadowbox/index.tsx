import React from "react";
import { View, StyleSheet } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { colors } from "../../../theme/colors";

interface Props {
  children: React.ReactNode;
  radius?: number;
  size?: number;
  shadow?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const SHADOW_MAP = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 18,
  "2xl": 28,
  "3xl": 38,
};

const SkeuoIconBox = ({
  children,
  radius = 8,
  size = 40,
  shadow = "sm",
}: Props) => {
  const distance = SHADOW_MAP["xs"];

  return (
    <Shadow
      distance={distance}
      offset={[0, 4]}
      //startColor="rgba(10,13,18,0.18)"
      //endColor="rgba(10,13,18,0.05)"
      paintInside={true}
      style={{ borderRadius: radius }}
    >
      <View
        style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: radius,
            padding: size * 0.25,
          },
        ]}
      >
        {/* Inset shadows */}
        <View
          style={[
            styles.insetTop,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}
        />
        <View
          style={[
            styles.insetBottom,
            { borderBottomLeftRadius: radius, borderBottomRightRadius: radius },
          ]}
        />
        <View style={[styles.insetBorder, { borderRadius: radius }]} />

        {children}
      </View>
    </Shadow>
  );
};

export default SkeuoIconBox;

const styles = StyleSheet.create({
  inner: {
    backgroundColor: colors.base.white,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  insetTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    //backgroundColor: "rgba(10,13,18,0.04)",
  },

  insetBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
   // backgroundColor: "rgba(10,13,18,0.05)",
  },

  insetBorder: {
    position: "absolute",
    inset: 0,
    borderWidth: 1,
    //borderColor: "rgba(10,13,18,0.18)",
  },
});
