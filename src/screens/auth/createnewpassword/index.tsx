import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Typography, TextField, Button } from '../../../components';
import { useStyles } from './styles';
import { colors } from '../../../theme/colors';
import { SvgXml } from 'react-native-svg';
import { eyeVisibleIcon } from '../../../assets/svg/eyevisible';
import { eyeHiddenIcon } from '../../../assets/svg/eyehiddenicon';

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';

import {
  selectResetPasswordError,
  selectResetPasswordLoading,
  selectResetPasswordMessage,
  selectToken,
  selectUserId
} from '../../../features/auth/selectors';

import { resetPasswordRequestAction } from '../../../features/auth/actions';
import { goBack } from '../../../utils/navigationUtils';

const CreateNewPasswordScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Redux state
  const loading = useAppSelector(selectResetPasswordLoading);
  const message = useAppSelector(selectResetPasswordMessage);
  const error = useAppSelector(selectResetPasswordError);
    const token = useAppSelector(selectToken);
  const userId = useAppSelector(selectUserId);
  const handleReset = () => {
    if (!password || !confirmPassword) {
      console.log("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    dispatch(
      resetPasswordRequestAction({
        userId,
        token,
        password,
        password2: confirmPassword,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backNavigation={true} borderCondition={true} onBack={goBack}/>

      <View style={{ gap: 24 }}>
        <View style={styles.inner}>

          <Typography variant="semiBoldDxs" color={colors.gray[900]}>
            Create new password {token} {userId}
          </Typography>

          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Your new password must be different from previously used passwords.
          </Typography>

          {/* PASSWORD FIELD */}
          <View style={{ gap: 6 }}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              Password *
            </Typography>

            <TextField
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              endIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <SvgXml
                    xml={showPassword ? eyeVisibleIcon : eyeHiddenIcon}
                    width={22}
                    height={22}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* CONFIRM PASSWORD FIELD */}
          <View style={{ gap: 6 }}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              Confirm password *
            </Typography>

            <TextField
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              endIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <SvgXml
                    xml={showConfirmPassword ? eyeVisibleIcon : eyeHiddenIcon}
                    width={22}
                    height={22}
                  />
                </TouchableOpacity>
              }
            />
          </View>

          {/* RESET BUTTON */}
          <Button
            variant="contain"
            size="Medium"
            borderRadius={8}
            textColor="#fff"
            onPress={handleReset}
            isLoading={loading}
          >
            Reset password
          </Button>

          {/* SUCCESS MESSAGE */}
          {message && (
            <Typography variant="regularTxtsm" color={colors.success[600]}>
              {message}
            </Typography>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <Typography variant="regularTxtsm" color={colors.error[600]}>
              {error}
            </Typography>
          )}

        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateNewPasswordScreen;
