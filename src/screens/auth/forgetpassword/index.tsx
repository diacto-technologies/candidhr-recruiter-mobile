import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Typography, TextField, Button } from '../../../components';
import { colors } from '../../../theme/colors';
import { goBack, navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';

const ForgetPasswordScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <Header backNavigation={true} borderCondition={true} onBack={() => goBack()}/>

      <View style={styles.inner}>
        <View style={styles.gap}>
        <Typography variant="semiBoldDxs" color={colors.gray[900]}>Forget password</Typography>
        <Typography variant="regularTxtmd" color={colors.gray[600]}>
          No worries, we’ll send you reset instructions.
        </Typography>
        </View>
        <View style={styles.gap}>
        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Email <Text style={{color:colors.brand[600]}}>*</Text></Typography>
        <TextField placeholder="Enter your email" />
        </View>

        <Button
           variant="contain"
           size="Medium"
           borderRadius={8}
           textColor={colors.base.white}
           onPress={()=>{navigate('CheckMailScreen')}}
        >
          Reset password
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;
