import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, TextField, Typography, Button } from '../../../components';
import { colors } from '../../../theme/colors';
import { goBack } from '../../../utils/navigationUtils';
import { ScrollView } from 'react-native-gesture-handler';
import { useStyles } from './styles';

const ContactUsScreen = () => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView>
        <View style={{ flex: 1 }}>
          <Header
            backNavigation={true}
            borderCondition={true}
            onBack={() => goBack()}
          />

          <View style={styles.inner}>
            <View style={styles.gap}>
              <Typography variant="semiBoldDxs" color={colors.gray[900]}>
                Contact us
              </Typography>
              <Typography variant="regularTxtmd" color={colors.gray[600]}>
                Please sign in to your account
              </Typography>
            </View>

            {/* Form Fields */}
            <View style={{ gap: 16 }}>
              <View style={styles.gap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Full name <Text style={styles.validateTxt}>*</Text>
                </Typography>
                <TextField placeholder="Enter your full name" />
              </View>

              <View style={styles.gap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Work email <Text style={styles.validateTxt}>*</Text>
                </Typography>
                <TextField placeholder="Enter your work email" />
              </View>

              <View style={styles.gap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Phone <Text style={styles.validateTxt}>*</Text>
                </Typography>
                <TextField placeholder="+91 000 000 0000" />
              </View>

              <View style={styles.gap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Company name <Text style={styles.validateTxt}>*</Text>
                </Typography>
                <TextField placeholder="Enter your company name" />
              </View>

              <View style={styles.gap}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Job title <Text style={styles.validateTxt}>*</Text>
                </Typography>
                <TextField placeholder="Enter your job title" />
              </View>
            </View>

            <Button
              variant="contain"
              size="Medium"
              borderRadius={8}
              textColor="#fff"
            >
              Submit
            </Button>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
