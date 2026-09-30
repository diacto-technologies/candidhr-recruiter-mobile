import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Button, Header, TextField, Typography } from '../../../components';
import { colors } from '../../../theme/colors';
import { goBack } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import {
  checkSubdomainRequestAction,
  clearSubdomainError,
  selectCheckSubdomainError,
  selectCheckSubdomainLoading,
} from '../../../features/auth';
import BackgroundPattern from '../../../components/atoms/backgroundpattern';
import { validateOrganizationName } from '../../../utils/validation';

const OrgnizationalSwitch = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectCheckSubdomainLoading);
  const subdomainError = useAppSelector(selectCheckSubdomainError);

  const [orgName, setOrgName] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearSubdomainError());
    };
  }, [dispatch]);

  const handleOrgChange = useCallback(
    (text: string) => {
      setOrgName(text);
      if (validationError) {
        setValidationError('');
      }
      if (subdomainError) {
        dispatch(clearSubdomainError());
      }
    },
    [validationError, subdomainError, dispatch]
  );

  const handleContinue = useCallback(() => {
    const validation = validateOrganizationName(orgName);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    dispatch(checkSubdomainRequestAction(orgName.trim().toLowerCase()));
  }, [orgName, dispatch]);

  const displayError = validationError || subdomainError || '';
  const isButtonDisabled = !orgName.trim() || isLoading;

  return (
    <CustomSafeAreaView>
      <BackgroundPattern>
        <Header backNavigation={true} onBack={goBack} borderCondition={true} />
        <View style={styles.inner}>
          <Typography variant="semiBoldDxs" color={colors.gray[900]}>
            Enter your organization
          </Typography>

          <View style={styles.label}>
            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
              Organization Name *
            </Typography>

            <TextField
              placeholder="e.g. diacto"
              value={orgName}
              onChangeText={handleOrgChange}
              isError={!!displayError}
              error={displayError}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {!!orgName && (
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              https://{orgName?.trim().toLowerCase()}.candidhr.ai
            </Typography>
          )}

          <Button
            variant="contain"
            onPress={handleContinue}
            disabled={isButtonDisabled}
            isLoading={isLoading}
            borderColor={colors.gray[200]}
            textColor={isButtonDisabled ? colors.gray[400] : colors.base.white}
          >
            Continue
          </Button>
        </View>
      </BackgroundPattern>
    </CustomSafeAreaView>
  );
};

export default OrgnizationalSwitch;
