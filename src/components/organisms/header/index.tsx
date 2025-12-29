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
import { useStyles } from './styles';
// import { searchIcon } from '../../assets/svg/search';
// import { horizontalThreedotIcon } from '../../assets/svg/horizontalthreedoticon';
// import { editIcon } from '../../assets/svg/edit';
// import { backButtonIcon } from '../../assets/svg/backbutton';

const Header = ({
  title,
  showTitle,       // ⭐ NEW
  onBack,
  backNavigation,
  edit,
  threedot,
  borderCondition
}: IHeader) => {

  const styles = useStyles();

  return (
    <View style={[styles.container, { borderBottomWidth: !borderCondition ? 1 : 0 }]}>

      {backNavigation ? (
        <>
          <Pressable onPress={onBack}>
            <SvgXml xml={backButtonIcon} />
          </Pressable>

          {/* ✅ Show title ONLY if showTitle = true */}
          {showTitle ? (
            <Typography variant="semiBoldTxtxl">
              {title}
            </Typography>
          ) : null}

          <View style={styles.subEditcontainer}>
            {edit ? (
              <Pressable>
                <SvgXml xml={editIcon} />
              </Pressable>
            ) : null}

            {threedot ? (
              <Pressable>
                <SvgXml xml={horizontalThreedotIcon} />
              </Pressable>
            ) : null}
          </View>
        </>
      ) : (
        <>
          {/* Normal header mode → ALWAYS show title */}
          <Typography variant="semiBoldTxtxl">{title}</Typography>

          <Pressable onPress={onBack}>
            <SvgXml xml={searchIcon} />
          </Pressable>
        </>
      )}

    </View>
  );
};


export default Header;
