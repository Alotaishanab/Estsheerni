import React, { useState } from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';

const CustomButton = ({title, color, onPress}) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: color}]}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const HomeView = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <View style={styles.container}>
            <Image source={require('./path_to_your_image.png')} style={styles.image} />
            <Text style={styles.header}>Legal Hub</Text>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Welcome to Legal Hub</Text>
                <Text style={styles.subtitle}>Connecting you to the best legal professionals.</Text>
            </View>

            {isLoggedIn ? (
                <CustomButton title="View Homepage" color="#406E9F" onPress={() => {}} />
            ) : (
                <View>
                    <CustomButton title="Login" color="#406E9F" onPress={() => {}} />
                    <CustomButton title="Register" color="#2E7D32" onPress={() => {}} />

                    <View style={styles.divider} />

                    <CustomButton title="Continue with Apple" color="#000" onPress={() => setIsLoggedIn(true)} />
                    <CustomButton title="Continue with Google" color="#4285F4" onPress={() => setIsLoggedIn(true)} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 30,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#406E9F',
    },
    textContainer: {
        width: '80%',
        marginBottom: 30
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2E7D32',
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10
    },
    divider: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
});

export default HomeView;
