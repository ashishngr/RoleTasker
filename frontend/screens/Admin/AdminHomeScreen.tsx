import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StorageUtils from '../../utils/storage_utils';
const AdminHomeScreen: React.FC = () => {
   
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Admin! This is your Home Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminHomeScreen;