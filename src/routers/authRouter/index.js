import React from 'react';
import { Platform, StatusBar } from 'react-native';
// React Nativation
import { createStackNavigator } from 'react-navigation';

// Screen
import LoginComponent from '../../components/views/auth/login/LoginComponent';
import RegisterComponent from '../../components/views/auth/register/RegisterComponent';
import ForgetPasswordComponent from '../../components/views/auth/forgetPassword/ForgetPasswordComponent';
import TNCComponent from '../../components/views/auth/tnc/TNCComponent';

const headerStyle = {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
};

export const AuthenticateStack = createStackNavigator(
    {
        Login_Route: LoginComponent,
        Register_Route: RegisterComponent,
        ForgetPassword_Route: ForgetPasswordComponent,
        TNC_Route: TNCComponent,
    },
    {
        initialRouteName: 'Login_Route',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            header: null // remove header in AuthenticateStack
        },
    }
);
