import React, { useState } from 'react';
import { View } from 'react-native';
import { useAppDispatch } from '../../../store/hooks';
import { Button, Header, TextField, Typography } from '../../../components';
import { colors } from '../../../theme/colors';
import { goBack, navigate } from '../../../utils/navigationUtils';
import { useStyles } from './styles';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { setOrigin } from '../../../features/auth/slice';

const OrgnizationalSwitch = () => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {

    if (!orgName.trim()) {
      setError('Please enter your organization name');
      return;
    }
    dispatch(setOrigin(`https://${orgName.trim().toLowerCase()}.candidhr.ai`));
    navigate('LoginScreen');
  };

  return (
    <CustomSafeAreaView>
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
            onChangeText={(t) => {
              setOrgName(t);
              setError('');
            }}
            isError={!!error}
            error={error}
            autoCapitalize="none"
          />
        </View>

        {!!orgName && (
          <Typography variant="regularTxtsm" color={colors.gray[500]}>
            https://{orgName?.toLowerCase()}.candidhr.ai
          </Typography>
        )}

        <Button
          variant="contain"
          onPress={handleContinue}
          disabled={!orgName}
        >
          Continue
        </Button>
      </View>
    </CustomSafeAreaView>
  );
};

export default OrgnizationalSwitch;
