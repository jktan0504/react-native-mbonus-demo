import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// Merchant Main Screen
import MerchantMainComponent from '../../../../components/views/main/merchant/MerchantMainComponent';
import ChangeLocalizationComponent from '../../../../components/views/shared/language/ChangeLocalizationComponent';
import MyQRCodeComponent from '../../../../components/views/shared/qr_code/MyQRCodeComponent';
import NotificationComponent from '../../../../components/views/shared/notification/NotificationComponent';
// Merchant Details Screen
import MerchantDetailsComponent from '../../../../components/views/main/merchant/sections/MerchantDetails/MerchantDetailsComponent';
// Merchant Around Me Screen
import MerchantAroundMeComponent from '../../../../components/views/main/merchant/sections/MerchantAroundMe/MerchantAroundMeComponent';
// Merchant Seach By Location Screen
import MerchantSearchByLocationComponent from '../../../../components/views/main/merchant/sections/MerchantSearchByLocation/MerchantSearchByLocationComponent';
// Merchant Search By Location Result Screen
import MerchantSearchResultComponent from '../../../../components/views/main/merchant/sections/MerchantSearchResult/MerchantSearchResultComponent';

// MainScreen, Child StackNavigator for each Tab
// HomeStack
const MerchantTabStack = createStackNavigator(
    {
        Localization: ChangeLocalizationComponent,
        My_QRCode: MyQRCodeComponent,
        Notifications: NotificationComponent,
        Merchant_Sub_Main: MerchantMainComponent,
        Merchant_Sub_Details: MerchantDetailsComponent,
        Merchant_Sub_Around_Me: MerchantAroundMeComponent,
        Merchant_sub_Search_By_Location: MerchantSearchByLocationComponent,
        Merchant_sub_Search_Result: MerchantSearchResultComponent,
    },
    {
        initialRouteName: 'Merchant_Sub_Main',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            header: null // remove header in AuthenticateStack
        },
    }
);

export default MerchantTabStack;
