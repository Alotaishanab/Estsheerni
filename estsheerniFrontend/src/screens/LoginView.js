import React, { useState } from 'react';
import { TextInput, Text, View, Button, Alert, StyleSheet } from 'react-native';
import MainPageView from './MainPage';

const LoginView = ({ authenticationManager, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    authenticationManager.logIn(email, password)
      .then(() => {
        onLoginSuccess();  // Notify App component about successful login
      })
      .catch(error => {
        console.error("Login failed: ", error);
        Alert.alert("Login failed: ", error.message);
      });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        style={styles.input} 
        onChangeText={setEmail} 
        value={email} 
        placeholder="Email" 
        keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} 
        onChangeText={setPassword} 
        value={password} 
        placeholder="Password" 
        secureTextEntry 
      />
      <Button 
        onPress={handleLogin} 
        title="Login" 
        color="blue" 
      />
      {shouldNavigate && <TabBarViewController />} {/* Replace TabBarViewController with actual component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});

export default LoginView;
