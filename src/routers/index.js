import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createSwitchNavigator,
         createStackNavigator,
         createBottomTabNavigator
       } from 'react-navigation';
import { AuthenticateStack } from './authRouter'; // Auth Router
import { MainNavBtmTabNav } from './mainRouter';

// custom header styles
const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};


export const createRootNavigator = (signedIn) => {
  return createSwitchNavigator(
    {
      UnAuthRouter: {
        screen: AuthenticateStack
      },
      MainAuthRouter: {
        screen: MainNavBtmTabNav
      }
    },
    {
      initialRouteName: signedIn ? 'MainAuthRouter' : 'UnAuthRouter'
    }
  );
};
