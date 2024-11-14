import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tasks: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Admin! This is your Tasks Screen.</Text>
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

export default Tasks;