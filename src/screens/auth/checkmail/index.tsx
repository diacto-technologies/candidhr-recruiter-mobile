import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import { Typography, Button } from '../../../components';
import { SvgXml } from 'react-native-svg';
import { emailIcon } from '../../../assets/svg/email';
import { colors } from '../../../theme/colors';
import { useStyles } from './styles';
const CheckMailScreen = () => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrap}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Image
            source={require('../../../assets/icons/mail.png')}
            style={{ width: 28, height: 28, tintColor: '#5F48E6' }}
          />
        </View>
      </View>

      <View style={styles.textWrap}>
        <Typography variant="semiBoldDxs" color={colors.gray[900]}>Check your mail</Typography>
        <Typography variant="regularTxtsm" style={styles.subtitle} color={colors.gray[600]}>
          We have sent a password recover instructions to your email.
        </Typography>
      </View>

      <Button
        variant="contain"
        size="Medium"
        borderRadius={8}
        textColor="#fff"
      >
        Open email app
      </Button>

      <TouchableOpacity>
        <Typography variant="semiBoldTxtsm" color={colors.gray[600]} >
          Skip, I’ll confirm later
        </Typography>
      </TouchableOpacity>
      </View>
      <View style={[styles.footer,{ paddingBottom: insets.bottom}]}>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          Did not receive email? Check your spam filter,
        </Typography>

        <TouchableOpacity>
          <Typography variant="semiBoldTxtsm" color={colors.brand[600]}>
            try another email address
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CheckMailScreen;
