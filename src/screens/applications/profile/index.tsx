import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../../components';
import { goBack } from '../../../utils/navigationUtils';

const Profile = () => {
  return (
    <Fragment>
        <Header title='Applicants' backNavigation={true} onBack={()=>goBack()}/>
    <View style={styles.container}>
    </View>
    </Fragment>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1,},
  text: { fontSize: 22, fontWeight: '600' }
});
