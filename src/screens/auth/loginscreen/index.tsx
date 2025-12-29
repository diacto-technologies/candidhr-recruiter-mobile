import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button, Header, TextField, Typography } from '../../../components';
import {
  loginRequestAction,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoading,
  selectSavedEmail,
  selectSavedPassword,
  selectSavedRemember
} from '../../../features/auth';
import { colors } from '../../../theme/colors';
import { goBack, navigate, resetAndNavigate } from '../../../utils/navigationUtils';
import CheckBox from '../../../components/atoms/checkbox';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { eyeVisibleIcon } from '../../../assets/svg/eyevisible';
import { clearCredentials, saveCredentials } from '../../../features/auth/slice';

const LoginScreen = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const savedEmail = useAppSelector(selectSavedEmail);
  const savedPassword = useAppSelector(selectSavedPassword);
  const savedRemember = useAppSelector(selectSavedRemember);


  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState(savedEmail || '');
  const [password, setPassword] = useState(savedPassword || '');
  const [rememberMe, setRememberMe] = useState(savedRemember);
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (isAuthenticated) {
      resetAndNavigate("UserBottomTab");
    }
  }, [isAuthenticated]);


  const handleLogin = () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setEmailError(`Please include an '@' in the email address. '${email}' is missing an '@'.`);
      return;
    }

    const [local, domain] = email.split("@");

    if (!domain || domain.trim() === "") {
      setEmailError(`Please enter a part following '@'. '${email}' is incomplete.`);
      return;
    }

    const invalidLocal = local.match(/[^a-zA-Z0-9._-]/);
    if (invalidLocal) {
      const symbol = invalidLocal[0];
      setEmailError(`A part before '@' should not contain the symbol '${symbol}'.`);
      return;
    }

    const invalidDomain = domain.match(/[^a-zA-Z0-9.-]/);
    if (invalidDomain) {
      const symbol = invalidDomain[0];
      setEmailError(`A part followed by '@' should not contain the symbol '${symbol}'.`);
      return;
    }

    if (/\s/.test(domain)) {
      setEmailError(`A part followed by '@' should not contain the symbol ' '.`);
      return;
    }

    dispatch(loginRequestAction({ email: email.trim(), password }));

    if (rememberMe) {
      dispatch(saveCredentials({ email, password }));
    } else {
      dispatch(clearCredentials());
    }
  };



  return (
    <CustomSafeAreaView>
      <Header backNavigation={true} onBack={goBack} />

      <View style={styles.inner}>

        <Typography variant="semiBoldDxs" color={colors.gray[900]}>
          Sign in
        </Typography>

        <View style={styles.label}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
            Email *
          </Typography>

          <TextField
            placeholder="Enter your email"
            value={email}
            onChangeText={(t) => { setEmail(t); setEmailError(''); }}
            isError={!!emailError}
            error={emailError}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.label}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
            Password *
          </Typography>

          <TextField
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          // endIcon={
          //   <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          //     <SvgXml xml={showPassword ? eyeVisibleIcon : eyeVisibleIcon} width={22} height={22} />
          //   </TouchableOpacity>
          // }
          />
        </View>

        <View style={styles.row}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <CheckBox
              type="square"
              checked={rememberMe}
              onChange={() => {
                const newValue = !rememberMe;
                setRememberMe(newValue);
                if (newValue) {
                  dispatch(saveCredentials({ email, password }));
                } else {
                  dispatch(clearCredentials());
                }
              }}
            />
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              Remember me
            </Typography>
          </View>

          <TouchableOpacity onPress={() => navigate("ForgetPasswordScreen")}>
            <Typography variant="semiBoldTxtsm" color={colors.brand[700]}>
              Forgot password?
            </Typography>
          </TouchableOpacity>
        </View>

        <Button variant="contain" onPress={handleLogin} disabled={!email || !password}>
          Continue
        </Button>

        {/* {error && (
          <Typography variant="regularTxtsm" color={colors.error[600]}>
            {error}
          </Typography>
        )} */}

      </View>
    </CustomSafeAreaView>
  );
};

export default LoginScreen;
