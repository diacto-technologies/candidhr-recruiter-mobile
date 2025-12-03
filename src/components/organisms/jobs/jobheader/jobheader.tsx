import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { locationIcon } from "../../../../assets/svg/location";
import { useStyles } from "./styles";

const JobHeader = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Typography variant="H1" color={colors.mainColors.blueGrayTitle}>Full stack developer</Typography>
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <Typography variant="P1M" color={colors.mainColors.carbonGray}>45 applicants</Typography>
       <View style={styles.dot}></View>
      <Typography variant="P1" color={colors.grayScale.slateGray}>Aug 16, 2025</Typography>
      </View>
      <View style={{gap:10}}>
      <View style={styles.row}>
        <SvgXml xml={locationIcon}  />
        <Typography variant="P1" color={colors.grayScale.slateGray} style={{paddingLeft:8}}>Pune, Maharashtra</Typography>
      </View>
      <View style={styles.chipRow}>
      <View style={[styles.chip,{backgroundColor:'#F7F6FF',borderColor:'#DDDBFF'}]}>
      <Typography variant="P0M" color={'#5148CF'}>Full time</Typography>
        </View>

        <View style={[styles.chip,{backgroundColor:'#F0FDF9',borderColor:'#99F6E0'}]}>
        <Typography variant="P0M" color={'#107569'}>3 - 5 Yrs</Typography>
        </View>

        <View style={[styles.chip,{backgroundColor:'#FFF6ED',borderColor:'#FDDCAB'}]}>
        <Typography variant="P0M" color={'#C4320A'}>8 - 10 LPA</Typography>
        </View>
      </View>
      <View style={{flexDirection:'row',alignItems:'center', gap:8}}>
      <Typography  variant='P1' color={colors.grayScale.slateGray}>Closed on :</Typography>
      <Typography variant="P0M" color={colors.mainColors.carbonGray}>Aug 16, 2025</Typography>
      <View style={[styles.close,{backgroundColor:'#FEF3F2',borderColor:'#FECDCA'}]}>
        <Typography variant="P0M" color={'#B42318'}>Closed</Typography>
        </View>
        </View>
      </View>
    </View>
  );
};

export default JobHeader;