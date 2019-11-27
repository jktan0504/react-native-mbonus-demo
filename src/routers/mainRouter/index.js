import React from 'react';
import { Platform, StatusBar, Image, AsyncStorage } from 'react-native';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
// React Nativation
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
// localize
import { strings } from '../../../locales/i18n';
import { CLR_ACTIVE_BTM_NAVBAR, ASYNCTORAGE_USER_PREF_LANGUAGE } from '../../utility/constants';

// Tab Screens
import HomeTabStack from './sections/home';
import MerchantTabStack from './sections/merchant';
import EcommerceTabStack from './sections/ecommerce';
import ActionsTabStack from './sections/actions';
import UserMeTabStack from './sections/me';

const navigationHomeOptions = () => ({
	tabBarLabel: strings('btmNavigation.home_page'),            // it stay in french whatever choosen langage
    tabBarIcon: ({ tintColor }) => (
         <Image
           source={require('../../assets/images/btmNavigation/home_icon.png')}
           style={[styles.myNavIconStyle, { tintColor: tintColor }]}
         />
    ),
    tabBarOptions: { activeTintColor: CLR_ACTIVE_BTM_NAVBAR, },
    lazy: true,
 });

const navigationMerchantOptions = () => ({
    tabBarLabel: strings('btmNavigation.merchant_page'),
    // tabBarLabel: USER_PREF_LANGUAGE === 'zh' ? '贸易商' : 'MERCHANT',
    tabBarIcon: ({ tintColor }) => (
        <Image
            source={require('../../assets/images/btmNavigation/offline_merchant_icon.png')}
            style={[styles.myMerchantNavIconStyle, { tintColor: tintColor }]}
        />
    ),
    tabBarOptions: { activeTintColor: CLR_ACTIVE_BTM_NAVBAR, },
    lazy: true,
});

const navigationEcommerceOptions = () => ({
    tabBarLabel: strings('btmNavigation.ecommerce_page'),
    //tabBarLabel: USER_PREF_LANGUAGE === 'zh' ? '电子商务' : 'ECOMMERCE',
    tabBarIcon: ({ tintColor }) => (
         <Image
           source={require('../../assets/images/btmNavigation/ecommerce_icon.png')}
           style={[styles.myNavIconStyle, { tintColor: tintColor }]}
         />
    ),
    tabBarOptions: { activeTintColor: CLR_ACTIVE_BTM_NAVBAR, },
    lazy: true,
});

const navigationActionsOptions = () => ({
    tabBarLabel: strings('btmNavigation.action_page'),
    //tabBarLabel: USER_PREF_LANGUAGE === 'zh' ? '议案' : 'ACTION',
    tabBarIcon: ({ tintColor }) => (
         <Image
           source={require('../../assets/images/btmNavigation/action_icon.png')}
           style={[styles.myNavIconStyle, { tintColor: tintColor }]}
         />
    ),
    tabBarOptions: { activeTintColor: CLR_ACTIVE_BTM_NAVBAR, },
    lazy: true,
});

const navigationMeOptions = () => ({
    tabBarLabel: strings('btmNavigation.me_page'),
    // tabBarLabel: USER_PREF_LANGUAGE === 'zh' ? '我' : 'ME',
    tabBarIcon: ({ tintColor }) => (
         <Image
           source={require('../../assets/images/btmNavigation/me_icon.png')}
           style={[styles.myNavIconStyle, { tintColor: tintColor }]}
         />
    ),
    tabBarOptions: { activeTintColor: CLR_ACTIVE_BTM_NAVBAR, },
    lazy: true,
});


export const MainNavBtmTabNav = createBottomTabNavigator(
    {
        Home: {
            screen: HomeTabStack,
            navigationOptions: navigationHomeOptions
        },
        Merchant: {
            screen: MerchantTabStack,
            navigationOptions: navigationMerchantOptions
        },
        Ecommerce: {
            screen: EcommerceTabStack,
            navigationOptions: navigationEcommerceOptions
        },
        Actions: {
            screen: ActionsTabStack,
            navigationOptions: navigationActionsOptions
        },
        Me: {
            screen: UserMeTabStack,
            navigationOptions: navigationMeOptions
        },
    },
	{
        backBehavior: false,
    }

);

export const styles = {
    myNavIconStyle: {
        width: 28,
        height: 28,
    },
	myMerchantNavIconStyle: {
		width: 20,
		height: 30,
	},
};
