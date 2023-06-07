import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeView from './HomeView';
import LoginView from './LoginView';

const MainPageView = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setTimeout(() => {
                navigateToLoginPage();
            }, 1500);
        }
    }, [isLoggedIn]);

    const navigateToLoginPage = () => {
        setIsLoggedIn(true);
    };

    return (
        <View style={styles.container}>
            {isLoggedIn ? <HomeView /> : <LoginView />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
});

export default MainPageView;
