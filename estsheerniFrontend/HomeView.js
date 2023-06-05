import React, { useState } from 'react';
import { Text, Image, View, Button, StyleSheet } from 'react-native';

const StandardButton = ({title, color, onPress}) => (
    <Button title={title} color={color} onPress={onPress} />
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
                <StandardButton title="View Homepage" color="blue" onPress={() => {}} />
            ) : (
                <View>
                    <StandardButton title="Login" color="blue" onPress={() => {}} />
                    <StandardButton title="Register" color="green" onPress={() => {}} />

                    <View style={styles.divider} />

                    <StandardButton title="Continue with Apple" color="black" onPress={() => setIsLoggedIn(true)} />
                    <StandardButton title="Continue with Google" color="red" onPress={() => setIsLoggedIn(true)} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center'
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 30,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20
    },
    textContainer: {
        width: '80%',
        marginBottom: 30
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
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
});

export default HomeView;
