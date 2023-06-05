import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AuthenticationManager from './AuthenticationManager';

const RegisterView = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const register = async () => {
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
        // Check if name is not empty
        if (firstName.trim() === "" || lastName.trim() === "") {
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

        // Check if password is not empty and matches
        if (password.trim() === "" || password !== passwordAgain) {
            return false;
        }

        return true;
    };

    return (
        <View style={styles.container}>
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
                placeholder="Re-enter Password"
                secureTextEntry
                onChangeText={setPasswordAgain}
                value={passwordAgain}
            />
            <Button onPress={register} title="Register" color="green" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
    },
});

export default RegisterView;
