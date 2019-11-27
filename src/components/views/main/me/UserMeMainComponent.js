import React, {Component} from 'react';
import { AsyncStorage, Alert, View, TouchableOpacity,
    Dimensions, Image,
} from 'react-native';
import Slideshow from 'react-native-slideshow';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import MainHeader from '../../../commons/Header/MainHeader';
import { CountryStateIcons, Card, CardSection } from '../../../commons';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_BLUE_GREY, CLR_DARK_GREY, CLR_MORE_DARK_GREY, ASYNCTORAGE_USER_DETAILS,
    CLR_GREY,
} from '../../../../utility/constants';
import { changeSettingsLocalization, userProfileUpdateIsRefreshing
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { getAuthUserDetails,
} from '../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../locales/i18n';

class UserMeMainComponent extends Component {

    constructor(props) {
        console.log('constructor main');
        super(props);
        // AsyncStorage.clear();
        this.state = {
            userDetails: [],
            isRefreshing: false,
        };
    }

    componentDidMount() {
        console.log('Did Mount User Main');
        this.getInitialUserDataFromLocalDB();
    }

    componentDidUpdate() {
        if(this.props.isRefreshing === true) {
            console.log('update now');
            this.props.userProfileUpdateIsRefreshing(false);
            this.getInitialUserDataFromLocalDB();
        }
    }


    getInitialUserDataFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: true,
                    });
                    this.getUserDetailsSevice();

                }
                else
                {
                    this.getUserDetailsSevice();
                }
            })
            .catch(err => reject(err));
     });

    getUserDetailsSevice = () => {
        getAuthUserDetails()
            .then((UserFullDetails) => {
                console.log('from auth mbonus');
                console.log(UserFullDetails);
                const user_details = UserFullDetails.data.user;
                //console.log(tnc.data.data);
                //const user_json = JSON.stringify(user_details);
                //console.log(user_details['name']);
                this.getAndSetUpdatedData(user_details);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    userDetails: [],
                    loading: false
                });
            });
    }

    getAndSetUpdatedData = (user_details) => {
        AsyncStorage.setItem(ASYNCTORAGE_USER_DETAILS, JSON.stringify(user_details));
        this.setState({
            userDetails: user_details,
            loading: false,
        });
        console.log('updated');
        console.log(this.state.userDetails);
    }

    renderGetFormattedNumberString(number) {
        return number.toLocaleString(undefined, { maximumFractionDigits: 4 });
        //return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    userLogoutActionn() {
        // Works on both iOS and Android
        Alert.alert(
          strings('logout.logout_confirmation_title'),
          '',
          [
              {
                  text: strings('logout.logout_no'),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
              },
              {
                  text: strings('logout.logout_yes'),
                  onPress: () => this.confirmLogout()
              },
          ],
          { cancelable: false }
        )
    }

    confirmLogout() {
        // console.log('Confirm Logout');
        AsyncStorage.clear();
        this.props.navigation.navigate('Login_Route')
    }

    goToWalletRecordFilter(
        WALLET_TITLE,
        WALLET_SUBTITLE,
        WALLET_STATEMENT,
        WALLET_CREDITS,
        WALLET_ACTION_ID,
    ) {

        this.props.navigation.navigate('UserMe_Sub_Wallet_Filter', {
            WALLET_TITLE,
            WALLET_SUBTITLE,
            WALLET_STATEMENT,
            WALLET_CREDITS,
            WALLET_ACTION_ID,
        });
    }

    goToWithdrawalFilter() {

        this.props.navigation.navigate('UserMe_Sub_Withdrawal_Filter', {
        });
    }

    goToAnnouncements() {
        this.props.navigation.navigate('UserMe_Sub_Announcements', {
        });
    }

    goToMyCommunity() {
        this.props.navigation.navigate('UserMe_Sub_My_Community', {
        });
    }

    goToPendingRebateFilter() {
        this.props.navigation.navigate('UserMe_Sub_PendingRebate_Filter', {
        });
    }

    goToQRScanner() {
        this.props.navigation.navigate('UserMe_Sub_QR_Scanner', {
        });
    }

    goToUserSettingsConfiguration() {
        this.props.navigation.navigate('User_Sub_Settings', {
        });
    }

    forceUpdateHandlerNow = () => {
        this.forceUpdate();
    };

    forceUpdateHandler = data => {
        this.setState(data);
        this.forceUpdate();
    };

    goToUserProfileUpdate() {

        this.props.navigation.navigate('User_Sub_ProfileUpdate', {
            userFullData: this.state.userDetails
        });

    }

    render() {
        const { userDetails } = this.state;

        const { merchantMainContainer, merchantTopDetailsContainerStyle,
            merchantNameTextStyle, merchantAddressTextStyle, merchantBtmDetailsContainerStyle,
            topCardSectionStyle, btmCardSectionStyle, merchantAboutUsTextStyle,
            btmCardTitleTextStyle, btmCardContactUsViewCallStyle, btmCardContactUsViewEmailStyle, btmCardContactUsTextStyle, userNameTextStyle, userMyProfileBtnStyle,
            merchantMapStyle, userWalletTextStyle, userWalletIconStyle, userTouchableViewStyle,
            userIconTextStyle, userBtmToachableBtnStyle,
        } = styles;

        return (
            <Container style={merchantMainContainer}>
                <MainHeader
                    navigation={this.props.navigation}
                />
                <Content>
                    <Image
                        source={require('../../../../assets/images/me/mbonus_me_cv.png')}
                        style={{ width: Dimensions.get('window').width, height: 260 }}
                    />
                    <View style={{ flex: 1 }}>
                        <View
                            style={{ flex: 1, flexDirection: 'row' }}
                        >
                            <View
                                style={{ flex: 0.4, padding: 10, marginTop: -50 }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={this.goToUserProfileUpdate.bind(this)}
                                >
                                    <ImageLoad
                                        style={{ width: 130, height: 130 }}
                                        loadingStyle={{ size: 'large', color: 'blue' }}
                                        placeholderSource={require('../../../../assets/images/me/me_icon.png')}
                                        placeholderStyle={{ width: 130, height: 130 }}
                                        source={{ uri: userDetails.avatar }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{ flex: 0.6, flexDirection: 'column' }}
                            >
                                <CountryStateIcons
                                    countryFlag={userDetails.country}
                                    stateFlag={userDetails.state}
                                />

                            </View>
                        </View>
                    </View>
                    <View style={merchantTopDetailsContainerStyle}>
                        <Text style={merchantNameTextStyle}>{userDetails.name}</Text>
                        <Text style={userNameTextStyle}>{userDetails.username}</Text>
                        <Text style={merchantAddressTextStyle}>{userDetails.address}</Text>
                        <Button
                            style={userMyProfileBtnStyle}
                            onPress={this.goToUserProfileUpdate.bind(this)}
                        >
                            <Text>
                                {strings('me.my_profile')}
                            </Text>
                        </Button>
                    </View>
                    <View style={merchantBtmDetailsContainerStyle}>
                        <Card>
                            <CardSection>
                                <View
                                    style={{ flex: 1, flexDirection: 'column' }}
                                >
                                    <TouchableOpacity
                                        style={userTouchableViewStyle}
                                        onPress={() => this.goToWalletRecordFilter(
                                            strings('wallet.m_wallet_1'),
                                            strings('wallet.m_wallet_1_vouher'),
                                            strings('wallet.m_wallet_1_statement'),
                                            userDetails.credit_1,
                                            1,
                                        )}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{
                                                flex: 0.6,
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <Image
                                                source={require('../../../../assets/images/me/my_wallet.png')}
                                                    style={userWalletIconStyle}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 0.4,
                                                    justifyContent: 'flex-end',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {strings('wallet.m_wallet_1')}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {
                                                            userDetails.credit_1
                                                        }
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={userTouchableViewStyle}
                                        onPress={() => this.goToWalletRecordFilter(
                                            strings('wallet.r_wallet_2'),
                                            strings('wallet.r_wallet_2_vouher'),
                                            strings('wallet.r_wallet_2_statement'),
                                            userDetails.credit_2,
                                            2,
                                        )}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{
                                                flex: 0.6,
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <Image
                                                source={require('../../../../assets/images/me/register_wallet.png')}
                                                    style={userWalletIconStyle}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 0.4,
                                                    justifyContent: 'flex-end',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {strings('wallet.r_wallet_2')}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {
                                                            userDetails.credit_2
                                                        }
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={userTouchableViewStyle}
                                        onPress={() => this.goToWalletRecordFilter(
                                            strings('wallet.b_wallet_4'),
                                            strings('wallet.b_wallet_4_vouher'),
                                            strings('wallet.b_wallet_4_statement'),
                                            userDetails.credit_4,
                                            4,
                                        )}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{
                                                flex: 0.6,
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <Image
                                                source={require('../../../../assets/images/me/icon_bigbonus.png')}
                                                    style={userWalletIconStyle}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 0.4,
                                                    justifyContent: 'flex-end',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {strings('wallet.b_wallet_4')}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {
                                                            userDetails.credit_4
                                                        }
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={userTouchableViewStyle}
                                        onPress={() => this.goToWalletRecordFilter(
                                            strings('wallet.s_wallet_3'),
                                            strings('wallet.s_wallet_3_vouher'),
                                            strings('wallet.s_wallet_3_statement'),
                                            userDetails.credit_3,
                                            3,
                                        )}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{
                                                flex: 0.5,
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <Image
                                                source={require('../../../../assets/images/me/icon_smallbonus.png')}
                                                    style={userWalletIconStyle}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flex: 0.5,
                                                    justifyContent: 'flex-end',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {strings('wallet.s_wallet_3')}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={userWalletTextStyle}
                                                    >
                                                        {
                                                        userDetails.credit_3
                                                        }
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>

                                    <View
                                        style={userTouchableViewStyle}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.goToWithdrawalFilter.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/icon_mywallet_action.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={userIconTextStyle}>
                                                    {strings('me.btn_withdrawal')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.goToAnnouncements.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/icon_settings.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={{
                                                    fontSize: 11,
                                                color: CLR_MORE_DARK_GREY,
                                                textAlign: 'center',
                                                paddingTop: 5,
                                                paddingBottom: 5 }}>
                                                    {strings('me.btn_announcements')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.goToMyCommunity.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/report_mlm.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={{
                                                    fontSize: 11.5,
                                                color: CLR_MORE_DARK_GREY,
                                                textAlign: 'center',
                                                paddingTop: 5,
                                                paddingBottom: 5
                                                }}>
                                                    {strings('me.btn_my_community')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.goToPendingRebateFilter.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/report_download.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text  style={{
                                                    fontSize: 11.5,
                                                color: CLR_MORE_DARK_GREY,
                                                textAlign: 'center',
                                                paddingTop: 5,
                                                paddingBottom: 5 }}>
                                                    {strings('me.btn_my_pending_rebate')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>
                                    </View>
                                    </View>

                                    <View
                                        style={userTouchableViewStyle}
                                    >
                                    <View style={topCardSectionStyle}>
                                        <TouchableOpacity
                                            style={userBtmToachableBtnStyle}
                                            onPress={this.goToQRScanner.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/qr_scan.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={userIconTextStyle}>
                                                    {strings('me.btn_qrcode')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={userBtmToachableBtnStyle}
                                            onPress={this.goToUserSettingsConfiguration.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/icon_settings.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={userIconTextStyle}>
                                                    {strings('me.btn_settings')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={userBtmToachableBtnStyle}
                                            onPress={this.userLogoutActionn.bind(this)}
                                        >
                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >
                                            <View style={{ flex: 0.8, alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../../../assets/images/me/logout.png')}
                                                        style={userWalletIconStyle}
                                                />
                                            </View>

                                            <View style={{ flex: 0.2 }}>
                                                <Text style={userIconTextStyle}>
                                                    {strings('me.btn_logout')}
                                                </Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>

                                        <View
                                            style={{ flex: 1, flexDirection: 'column' }}
                                        >

                                        </View>
                                    </View>
                                    </View>

                                </View>
                            </CardSection>
                        </Card>

                    </View>
                </Content>
            </Container>

        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: 'white',
        paddingBottom: 10
    },
    merchantTopBtnViewStyle: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0,
        justifyContent: 'center',


    },
    merchantTopBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
    },
    merchantAroundMeIconStyle: {
        width: 35,
        height: 35,
    },
    merchantTopBtnTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    merchantTopDetailsContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10,
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 10
    },
    merchantNameTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: CLR_BLUE_GREY,
    },
    userNameTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CLR_BLUE_GREY,
    },
    merchantAddressTextStyle: {
        fontSize: 16,
        color: CLR_DARK_GREY,
    },
    merchantBtmDetailsContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 5
    },
    topCardSectionStyle: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: CLR_GREY,
    },
    btmCardSectionStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    btmCardTitleTextStyle:{
        fontSize: 18,
        fontWeight: 'bold',
        color: CLR_MORE_DARK_GREY,
        textAlign: 'center',
    },
    merchantAboutUsTextStyle: {
        color: CLR_MORE_DARK_GREY,
        padding: 5,
        fontSize: 16,
        textAlign: 'justify',
    },
    btmCardContactUsViewCallStyle: {
        flex: 0.4,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    btmCardContactUsViewEmailStyle: {
        flex: 0.6,
        padding: 10,
        flexDirection: 'column',
    },
    btmCardContactUsTextStyle: {
        fontSize: 12.5,
        color: CLR_DARK_GREY,
    },
    merchantMapStyle: {
        flex: 1,
        height: 300,
        marginTop: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMyProfileBtnStyle: {
        padding: 5,
        marginTop: 10,
        marginBottom: 5,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
    },
    userWalletTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CLR_MORE_DARK_GREY,
        textAlign: 'right',
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
    },
    userWalletIconStyle: {
         width: 50,
         height: 50,
         alignItems: 'center',
    },
    userTouchableViewStyle: {
        paddingTop: 10,

    },
    userIconTextStyle: {
        fontSize: 11.5,
        color: CLR_MORE_DARK_GREY,
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
    },
    userBtmToachableBtnStyle: {
        flex: 1,
    }


};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        isRefreshing: state.user_update.isRefreshing,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    userProfileUpdateIsRefreshing
 })(UserMeMainComponent);
