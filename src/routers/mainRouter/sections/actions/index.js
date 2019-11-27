import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// Home Screen
import ActionsMainComponent from '../../../../components/views/main/actions/ActionsMainComponent';
// Header Series
import ChangeLocalizationComponent from '../../../../components/views/shared/language/ChangeLocalizationComponent';
import MyQRCodeComponent from '../../../../components/views/shared/qr_code/MyQRCodeComponent';
import NotificationComponent from '../../../../components/views/shared/notification/NotificationComponent';
// Merchant Seach By Location Screen
import MerchantSearchByLocationComponent from '../../../../components/views/main/merchant/sections/MerchantSearchByLocation/MerchantSearchByLocationComponent';
// Invite New Member
import InviteNewMemberComponent from '../../../../components/views/main/actions/sections/InviteNewMember/InviteNewMemberComponent';
// Register New Member
import RegisterNewMemberComponent from '../../../../components/views/main/actions/sections/RegisterNewMember/RegisterNewMemberComponent';
// Upgrade To Agent
import UpgradeToAgentComponent from '../../../../components/views/main/actions/sections/UpgradeToAgent/UpgradeToAgentComponent';
// M E Withdrawal
import MeVoucherWithdrawalComponent from '../../../../components/views/main/actions/sections/MeVoucherWithdrawal/MeVoucherWithdrawalComponent';
// Tranfer E Voucher
import TransferEVoucherComponent from '../../../../components/views/main/actions/sections/TransferEVoucher/TransferEVoucherComponent';
// Refer New Merchant
import ReferNewMerchantComponent from '../../../../components/views/main/actions/sections/ReferNewMerchant/ReferNewMerchantComponent';
// Company Representative
import CompanyRepresentativeComponent from '../../../../components/views/main/actions/sections/CompanyRepresentative/CompanyRepresentativeComponent';
// Customer Service
import CustomerServiceComponent from '../../../../components/views/main/actions/sections/CustomerServices/CustomerServiceComponent';
// Single Chat Reply Service
import SingleChatRoomComponent from '../../../../components/views/main/actions/sections/CustomerServices/sub_sections/SingleChatRoom/SingleChatRoomComponent';
// Create New Chat Room Service
import CreateChatRoomComponent from '../../../../components/views/main/actions/sections/CustomerServices/sub_sections/CreateChatRoom/CreateChatRoomComponent';



// MainScreen, Child StackNavigator for each Tab
// HomeStack
const ActionsTabStack = createStackNavigator(
    {
        Localization: ChangeLocalizationComponent,
        My_QRCode: MyQRCodeComponent,
        Notifications: NotificationComponent,
        Actions_Sub_Main: ActionsMainComponent,
        Merchant_sub_Search_By_Location: MerchantSearchByLocationComponent,
        Actions_Sub_InviteNewMember: InviteNewMemberComponent,
        Actions_SubRegistereNewMember: RegisterNewMemberComponent,
        Actions_SubUpgradeToAgent: UpgradeToAgentComponent,
        Actions_Sub_EVoucherWithdrawal: MeVoucherWithdrawalComponent,
        Actions_SubTransferEVouchert: TransferEVoucherComponent,
        Actions_Sub_ReferNewMerchant: ReferNewMerchantComponent,
        Actions_Sub_CompanyRepresentative: CompanyRepresentativeComponent,
        Actions_Sub_CompanyServiceMain: CustomerServiceComponent,
        Actions_Sub_CompanyService_SingleChatReply: SingleChatRoomComponent,
        Actions_Sub_CompanyService_CreateNewChatRoom: CreateChatRoomComponent,
    },
    {
        initialRouteName: 'Actions_Sub_Main',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            header: null // remove header in AuthenticateStack
        },
    }
);

export default ActionsTabStack;
