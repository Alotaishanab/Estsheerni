import React, { useState } from 'react';
import { TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import LanguageContext from './services/LanguageContext';

const LoginView = ({ authenticationManager, onLoginSuccess }) => {
  const { language, handleLanguageChange } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    authenticationManager.logIn(email, password)
      .then(() => {
        onLoginSuccess();
      })
      .catch(error => {
        console.error("Login failed: ", error);
        Alert.alert("Login failed: ", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default LoginView;

