import React, { FC } from "react";

// All supported icon packs from react-native-vector-icons
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";

interface IconProps {
  color?: string;
  size: number;
  name: string;
  iconFamily:
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "FontAwesome"
    | "FontAwesome5"
    | "FontAwesome6"
    | "Fontisto"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";
}

const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
  switch (iconFamily) {
    case "AntDesign":
      return <AntDesign name={name} size={size} color={color} />;

    case "Entypo":
      return <Entypo name={name} size={size} color={color} />;

    case "EvilIcons":
      return <EvilIcons name={name} size={size} color={color} />;

    case "Feather":
      return <Feather name={name} size={size} color={color} />;

    case "FontAwesome":
      return <FontAwesome name={name} size={size} color={color} />;

    case "FontAwesome5":
      return <FontAwesome5 name={name} size={size} color={color} />;

    case "FontAwesome6":
      return <FontAwesome6 name={name} size={size} color={color} />;

    case "Fontisto":
      return <Fontisto name={name} size={size} color={color} />;

    case "Foundation":
      return <Foundation name={name} size={size} color={color} />;

    case "Ionicons":
      return <Ionicons name={name} size={size} color={color} />;

    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={name} size={size} color={color} />;

    case "MaterialIcons":
      return <MaterialIcons name={name} size={size} color={color} />;

    case "Octicons":
      return <Octicons name={name} size={size} color={color} />;

    case "SimpleLineIcons":
      return <SimpleLineIcons name={name} size={size} color={color} />;

    case "Zocial":
      return <Zocial name={name} size={size} color={color} />;

    default:
      return null;
  }
};

export default Icon;
