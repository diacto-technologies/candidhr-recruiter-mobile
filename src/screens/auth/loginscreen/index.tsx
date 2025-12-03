import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button, Header, TextField, Typography } from '../../../components';
import { selectUser } from '../../../features/auth';
import { colors } from '../../../theme/colors';
import { Text } from 'react-native-gesture-handler';
import { goBack, navigate } from '../../../utils/navigationUtils';
import CheckBox from '../../../components/atoms/checkbox';
import { useStyles } from './styles';

const LoginScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <Header backNavigation={true} borderCondition={true} onBack={()=>{goBack()}} />

      <View style={styles.inner}>
        {/* Title */}
        <View style={{ gap: 6 }}>
          <Typography variant="semiBoldDxs" color={colors.gray[900]}>Sign in</Typography>
          <Typography variant="regularTxtmd" color={colors.gray[600]}>
            Please sign in to your account.
          </Typography>
        </View>

        {/* Email */}
        <View style={styles.label}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Email <Text style={{ color: colors.brand[600] }}>*</Text></Typography>
          <TextField placeholder="Enter your email" />
        </View>

        {/* Password */}
        <View style={styles.label}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Password <Text style={{ color: colors.brand[600] }}>*</Text></Typography>
          <TextField placeholder="Enter password" secureTextEntry={true}/>
        </View>

        {/* Remember + Forgot */}
        <View style={styles.row}>
          <View style={{flexDirection:'row', gap:8, alignItems:'center'}}>
          <TouchableOpacity>
          <CheckBox type="square" />
          </TouchableOpacity>
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Remember me</Typography>
            </View>

          <TouchableOpacity>
            <Typography variant="semiBoldTxtsm" color={colors.brand[700]} onPress={()=>navigate('ForgetPasswordScreen')}>
              Forget password
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Continue */}
        <Button
          variant="contain"
          size="Medium"
          borderRadius={8}
          textColor="#fff"
          onPress={()=>{navigate("UserBottomTab")}}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
