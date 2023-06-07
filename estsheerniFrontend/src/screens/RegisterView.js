import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AuthenticationManager from './services/AuthenticationManager';
import LanguageContext from './services/LanguageContext';

const RegisterView = () => {
  const { language, handleLanguageChange } = useContext(LanguageContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const handleRegister = async () => {
    if (isValidFields()) {
      try {
        await AuthenticationManager.register(email, password, firstName, lastName, phoneNumber);
        // Registration successful, handle navigation or presentation logic here
        Alert.alert("Registration Success", "You have successfully registered.");
      } catch (error) {
        // Registration failed, handle the error
        Alert.alert("Registration Error", error.message);
      }
    } else {
      Alert.alert("Registration Error", "Please fill in all the fields correctly.");
    }
  };

  const isValidFields = () => {
    // Check if all required fields are not empty
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      phoneNumber.trim() === "" ||
      password.trim() === "" ||
      passwordAgain.trim() === ""
    ) {
      return false;
    }

    // Check if email is valid
    const emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegEx.test(email)) {
      return false;
    }

    // Check if phone number is valid
    const phoneNumberRegEx = /^05[0-9]{8}$/;
    if (!phoneNumberRegEx.test(phoneNumber)) {
      return false;
    }

    // Check if passwords match
    if (password !== passwordAgain) {
      return false;
    }

    return true;
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLanguageChange} style={styles.languageButton}>
        <Text>{language}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Password Again"
        secureTextEntry
        onChangeText={setPasswordAgain}
        value={passwordAgain}
      />
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
  languageButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterView;


