import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Typography, TextField, Button } from '../../../components';
import { colors } from '../../../theme/colors';
import { goBack, navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  forgotPasswordRequestAction
} from '../../../features/auth/actions';
import {
  selectForgotPasswordLoading,
  selectForgotPasswordMessage,
  selectAuthError,
  forgetPassowrdError
} from '../../../features/auth/selectors';
import { clearError } from '../../../features/auth/slice';

const ForgetPasswordScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectForgotPasswordLoading);
  const successMessage = useAppSelector(selectForgotPasswordMessage);
  const errorMessage = useAppSelector(selectAuthError);
  const error = useAppSelector(forgetPassowrdError);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState('');

  // useEffect(() => {
  //   if (successMessage) {
  //     navigate("CheckMailScreen");
  //   }
  // }, [successMessage]);

  const handleReset = () => {
    setEmailError(""); // Clear previous email validation errors
    // Note: Don't clear auth error here - let it be cleared by forgotPasswordRequest action
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }
    // CASE 1 → Missing '@'
    if (!email.includes("@")) {
      setEmailError(`Please include an '@' in the email address. '${email}' is missing an '@'.`);
      return;
    }
    const [local, domain] = email.split("@");
    // CASE 2 → No domain after '@'
    if (!domain || domain.trim() === "") {
      setEmailError(`Please enter a part following '@'. '${email}' is incomplete.`);
      return;
    }
    // NEW CASE → Local-part (before '@') contains invalid characters
    const invalidLocal = local.match(/[^a-zA-Z0-9._-]/);
    if (invalidLocal) {
      const symbol = invalidLocal[0];
      setEmailError(`A part before '@' should not contain the symbol '${symbol}'.`);
      return;
    }
    // CASE 3 → Invalid characters in the domain part
    const invalidDomain = domain.match(/[^a-zA-Z0-9.-]/);
    if (invalidDomain) {
      const symbol = invalidDomain[0];
      setEmailError(`A part followed by '@' should not contain the symbol '${symbol}'.`);
      return;
    }
    // CASE 4 → Space in domain
    if (/\s/.test(domain)) {
      setEmailError(`A part followed by '@' should not contain the symbol ' '.`);
      return;
    }
    dispatch(forgotPasswordRequestAction(email));
  };



  return (
    <SafeAreaView style={styles.container}>
      <Header backNavigation={true} borderCondition={true} onBack={() => goBack()} />

      <View style={styles.inner}>

        <View style={styles.gap}>
          <Typography variant="semiBoldDxs" color={colors.gray[900]}>
            Forgot password
          </Typography>
          <Typography variant="regularTxtmd" color={colors.gray[600]}>
            Password reset link will be sent to the below registered email
          </Typography>
        </View>

        <View style={styles.gap}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
            Email <Text style={{ color: colors.brand[600] }}>*</Text>
          </Typography>
          <TextField
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
              if (errorMessage) dispatch(clearError()); // Clear error when user starts typing
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            //editable={!loading}
            isError={!!emailError}
            error={emailError}
          />
        </View>

        <Button
          variant="contain"
          size="Medium"
          borderRadius={8}
          textColor={colors.base.white}
          isLoading={loading}
          onPress={handleReset}
          disabled={!email}
        >
          Reset password
        </Button>
        <Typography variant="regularTxtsm" color={colors.error[600]}>
          {error}{ }
        </Typography>
        {/* {errorMessage && (
          <View style={{ marginTop: 16, backgroundColor: colors?.gray[100], alignItems: 'center', paddingVertical: 10, marginHorizontal: 10, borderRadius: 8 }}>
            <Typography variant="regularTxtsm" color={colors.error[600]}>
              {errorMessage}
            </Typography>
          </View>
        )} */}

      </View>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;
