import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Typography, TextField, Button } from '../../../components';
import { useStyles } from './styles';

const CreateNewPasswordScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <Header backNavigation={true} borderCondition={true} />

      <View style={styles.inner}>
        <Typography variant="H2">Create new password</Typography>

        <Typography variant="H2" style={styles.subtitle}>
          Your new password must be different from previous used password.
        </Typography>

        {/* Password */}
        <Typography variant="H2" style={styles.label}>
          Password *
        </Typography>
        <TextField placeholder="Enter new password" secureTextEntry />

        <Typography variant="H2" style={styles.helper}>
          Must be at least 8 characters
        </Typography>

        {/* Confirm */}
        <Typography variant="BodyMedium" style={styles.label}>
          Confirm password *
        </Typography>
        <TextField placeholder="Confirm password" secureTextEntry />

        <Typography variant="BodySmall" style={styles.helper}>
          Both password must match
        </Typography>

        <Button
          variant="contain"
          size="Medium"
          borderRadius={8}
          textColor="#fff"
        >
          Reset password
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateNewPasswordScreen;
