import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// Home Screen
import UserMeMainComponent from '../../../../components/views/main/me/UserMeMainComponent';
// Header Series
import ChangeLocalizationComponent from '../../../../components/views/shared/language/ChangeLocalizationComponent';
import MyQRCodeComponent from '../../../../components/views/shared/qr_code/MyQRCodeComponent';
import NotificationComponent from '../../../../components/views/shared/notification/NotificationComponent';
// Merchant Seach By Location Screen
import MerchantSearchByLocationComponent from '../../../../components/views/main/merchant/sections/MerchantSearchByLocation/MerchantSearchByLocationComponent';
// User Wallet Filter Screen
import UserWalletFilterComponent from '../../../../components/views/main/me/sections/UserWalletFilter/UserWalletFilterComponent';
// User Wallet Filter Result Screen
import UserWalletFilterResultComponent from '../../../../components/views/main/me/sections/UserWalletFilterResult/UserWalletFilterResultComponent';
// User Withdrawal Filter Screen
import UserWithdrawalFilterComponent from '../../../../components/views/main/me/sections/UserWithdrawalFilter/UserWithdrawalFilterComponent';
// User Withdrawal Filter Result Screen
import UserWithdrawalFilterResultComponent from '../../../../components/views/main/me/sections/UserWithdrawalFilterResult/UserWithdrawalFilterResultComponent';
// User Announcement Screen
import AnnouncementsComponent from '../../../../components/views/main/me/sections/Announcement/AnnouncementsComponent';
// User Pending Rebate Filter Result Screen
import UserPendingRebateFilterComponent from '../../../../components/views/main/me/sections/UserPendingRebateFilter/UserPendingRebateFilterComponent';
// User Pending Rebate Filter Result Screen
import UserPendingRebateFilterResultComponent from '../../../../components/views/main/me/sections/UserPendingRebateFilterResult/UserPendingRebateFilterResultComponent';
// User My Community Screen
import UserMyCommunityComponent from '../../../../components/views/main/me/sections/UserMyCommunity/UserMyCommunityComponent';
// User My Community Screen
import UserQRCodeScannerComponent from '../../../../components/views/main/me/sections/UserQRCodeScanner/UserQRCodeScannerComponent';
// User Settings Screen
import UserSettingsComponent from '../../../../components/views/main/me/sections/UserSettings/UserSettingsComponent';
import TNCComponent from '../../../../components/views/auth/tnc/TNCComponent';
import UserMyProfileUpdateComponent from '../../../../components/views/main/me/sections/UserMyProfileUpdate/UserMyProfileUpdateComponent';

// MainScreen, Child StackNavigator for each Tab
// HomeStack
const UserMeTabStack = createStackNavigator(
    {
        Localization: ChangeLocalizationComponent,
        My_QRCode: MyQRCodeComponent,
        Notifications: NotificationComponent,
        TNC_Route: TNCComponent,
        Merchant_sub_Search_By_Location: MerchantSearchByLocationComponent,
        UserMe_Sub_Main: UserMeMainComponent,
        UserMe_Sub_Wallet_Filter: UserWalletFilterComponent,
        UserMe_Sub_Wallet_Filter_Result: UserWalletFilterResultComponent,
        UserMe_Sub_Withdrawal_Filter: UserWithdrawalFilterComponent,
        UserMe_Sub_Withdrawal_Filter_Result: UserWithdrawalFilterResultComponent,
        UserMe_Sub_Announcements: AnnouncementsComponent,
        UserMe_Sub_PendingRebate_Filter: UserPendingRebateFilterComponent,
        UserMe_Sub_PendingRebate_Filter_Result: UserPendingRebateFilterResultComponent,
        UserMe_Sub_My_Community: UserMyCommunityComponent,
        UserMe_Sub_QR_Scanner: UserQRCodeScannerComponent,
        User_Sub_Settings: UserSettingsComponent,
        User_Sub_ProfileUpdate: UserMyProfileUpdateComponent,
    },
    {
        initialRouteName: 'UserMe_Sub_Main',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            header: null // remove header in AuthenticateStack
        },
    }
);

export default UserMeTabStack;
