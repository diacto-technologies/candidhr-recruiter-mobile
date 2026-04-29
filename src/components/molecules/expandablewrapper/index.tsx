import React, { useState, ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { arrowDown } from "../../../assets/svg/arrowdown";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import Card from "../../atoms/card";

interface ExpandableWrapperProps {
  title: string;
  subTitle: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  rightComponent?: ReactNode; // optional (like points/time etc)
  /** Controlled expanded state */
  expanded?: boolean;
  /** Called when expanded state changes (controlled or uncontrolled) */
  onExpandedChange?: (expanded: boolean) => void;
}

const ExpandableWrapper = ({
  title,
  subTitle,
  children,
  defaultExpanded = false,
  rightComponent,
  expanded: expandedProp,
  onExpandedChange,
}: ExpandableWrapperProps) => {
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;

  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) {
      setExpandedState(next);
    }
    onExpandedChange?.(next);
  };

  return (
    <Card style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={[
          styles.header,
          { borderBottomWidth: expanded ? 1 : 0 },
        ]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.left}>
          <View>
            <Typography variant="semiBoldTxtsm">
              {title}
            </Typography>
            {subTitle &&
              <Typography variant="regularTxtsm" color={colors.gray[600]} ellipsizeMode='tail'>
                {subTitle}
              </Typography>
            }
          </View>
        </View>
        {rightComponent && (
          <View>
            {rightComponent}
          </View>
        )}

        <SvgXml
          xml={arrowDown}
          width={20}
          height={20}
          style={{
            transform: [{ rotate: expanded ? "180deg" : "0deg" }],
            marginLeft: 10
          }}
        />
      </TouchableOpacity>

      {/* Content */}
      {expanded && <View style={styles.content}>{children}</View>}
    </Card>
  );
};

export default ExpandableWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    //alignItems:'center',
    borderColor: colors.gray[200],
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12,
    //alignItems:'center'
  },
  content: {
    padding: 16,
  },
});