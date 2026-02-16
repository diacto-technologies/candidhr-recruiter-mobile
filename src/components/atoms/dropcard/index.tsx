import React from "react";
import { View, StyleSheet } from "react-native";
import { useStyles } from "./styles";

const DropCard = ({ children }: { children?: React.ReactNode }) => {
  const styles = useStyles();
  return <View style={styles.dropcard}>{children}</View>;
};

export default DropCard;
