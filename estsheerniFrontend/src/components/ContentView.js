import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ContentView = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.text}>You are successfully logged in!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={onLogout} color='#FF6347'/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    marginBottom: 60,
  },
  buttonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
});

export default ContentView;
