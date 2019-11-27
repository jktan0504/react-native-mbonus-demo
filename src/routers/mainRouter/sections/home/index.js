import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// Home Screen
import HomeMainComponent from '../../../../components/views/main/home/HomeMainComponent';
import WelcomeMainComponent from '../../../../components/views/main/welcome/WelcomeMainComponent';
// Header Series
import ChangeLocalizationComponent from '../../../../components/views/shared/language/ChangeLocalizationComponent';
import MyQRCodeComponent from '../../../../components/views/shared/qr_code/MyQRCodeComponent';
import NotificationComponent from '../../../../components/views/shared/notification/NotificationComponent';
// Merchant Seach By Location Screen
import MerchantSearchByLocationComponent from '../../../../components/views/main/merchant/sections/MerchantSearchByLocation/MerchantSearchByLocationComponent';

// MainScreen, Child StackNavigator for each Tab
// HomeStack
const HomeTabStack = createStackNavigator(
    {
        Home: HomeMainComponent,
        Welcome: WelcomeMainComponent,
        Localization: ChangeLocalizationComponent,
        My_QRCode: MyQRCodeComponent,
        Notifications: NotificationComponent,
        Merchant_sub_Search_By_Location: MerchantSearchByLocationComponent,
    },
    {

        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
            },
        }),
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            header: null, // remove header in AuthenticateStack
        },
    }
);

export default HomeTabStack;
