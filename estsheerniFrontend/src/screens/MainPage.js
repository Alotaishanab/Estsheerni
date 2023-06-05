import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
        <View>
            {isLoggedIn ? <HomeView /> : <LoginView />}
        </View>
    );
};

export default MainPageView;
