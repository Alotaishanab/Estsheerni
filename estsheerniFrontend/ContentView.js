import React from 'react';
import { View, Text, Button } from 'react-native';

const ContentView = ({ onLogout }) => {
  return (
    <View>
      <Text>You are logged in!</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

export default ContentView;