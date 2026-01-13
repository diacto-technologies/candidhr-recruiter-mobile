import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../../components';
import { goBack } from '../../../utils/navigationUtils';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';

const Profile = () => {
  return (
    <Fragment>
      <CustomSafeAreaView>
        <Header title='Setting' backNavigation={true} onBack={()=>goBack()}/>
    <View style={styles.container}>
    </View>
    </CustomSafeAreaView>
    </Fragment>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1,},
  text: { fontSize: 22, fontWeight: '600' }
});
