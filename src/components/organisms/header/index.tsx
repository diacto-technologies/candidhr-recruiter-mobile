import React from 'react';
import { View, Pressable, StyleSheet, Image, Text } from 'react-native';
import Typography from '../../atoms/typography';
// import { icons } from '../../assets/icons';
import type { IHeader } from './header';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { backButtonIcon } from '../../../assets/svg/backbutton';
import { editIcon } from '../../../assets/svg/edit';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { searchIcon } from '../../../assets/svg/search';
// import { searchIcon } from '../../assets/svg/search';
// import { horizontalThreedotIcon } from '../../assets/svg/horizontalthreedoticon';
// import { editIcon } from '../../assets/svg/edit';
// import { backButtonIcon } from '../../assets/svg/backbutton';

const Header = ({ title, onBack, backNavigation }: IHeader) => {
  return (
    <View style={styles.container}>
      {backNavigation ? (
        <>
          <Pressable onPress={onBack} style={styles.backButton}>
            <SvgXml xml={backButtonIcon} />
          </Pressable>
          <View style={styles.subEditcontainer}>
          <Pressable onPress={()=>{}} style={styles.backButton}>
            <SvgXml xml={editIcon} />
          </Pressable>

          <Pressable onPress={()=>{}} style={styles.backButton}>
            <SvgXml xml={horizontalThreedotIcon} />
          </Pressable>
          </View>
        </>
      ) : (
        <>
          <Typography variant="H1" style={styles.title}>
            {title}
          </Typography>

          <Pressable onPress={onBack} style={styles.backButton}>
            <SvgXml xml={searchIcon} />
          </Pressable>
        </>
      )}

    </View>
  );
};


const styles = StyleSheet.create({
  backButton: {
    // left: 0,
    // padding: 8,
    // position: 'absolute',
  },
  backIcon: {
    height: 18,
    tintColor: colors.grayScale.black,
    width: 18,
  },
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    position: 'relative',
    backgroundColor:'white',
    paddingHorizontal:20,
    borderBottomColor:colors.mainColors.borderColor,
    borderBottomWidth:1,
  },
  title: {
    textAlign: 'center',
  },
  subEditcontainer:{
    flexDirection:'row',
    columnGap:12
  }
});

export default Header;
