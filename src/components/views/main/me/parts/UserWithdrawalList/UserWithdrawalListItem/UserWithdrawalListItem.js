import React, { Component } from 'react';
import { Image, View, Linking, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL, CLR_PRIMARY_DARK, CLR_DARK_TIFFANY_BLUE,
    CLR_BLACK, CLR_GREY
} from '../../../../../../../utility/constants';
import { Card, CardSection } from '../../../../../../commons';
import { getMBonusAppLanguageSetting,
} from '../../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../../locales/i18n';

class UserWithdrawalListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_pref_language: '',
        }
    }

    componentDidMount() {
        this.getUserPrefLanguage();
    }

    getUserPrefLanguage = () => {
        getMBonusAppLanguageSetting().then((locale) => {
            this.setState({
                user_pref_language: locale
            });
        }).catch((err) => {
            this.setState({
                user_pref_language: 'en'
            });
        });
    }

    render() {
        const { walletSingleItem, goToMerchantDetails
        } = this.props;
        const { merchantCardContainerStyle, cardSectionContainer,
            cardSectionRowViewContainer, cardSectionLeftViewContainer, cardSectionRightViewContainer, cardLeftTitleTextStyle
        } = styles;

        return (
            <TouchableOpacity
                onPress={goToMerchantDetails}
            >
            <View style={merchantCardContainerStyle}>
                <Card>
                    <CardSection>
                        <View style={cardSectionContainer}>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_bank')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            this.state.user_pref_language === 'zh' ?
                                                walletSingleItem.bank_name_cn :
                                                walletSingleItem.bank_name_en
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text  style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_bank_holderName')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.bank_account_name
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text  style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_bank_accountNo')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.bank_account_number
                                        }
                                    </Text>
                                </View>
                            </View>


                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text  style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_amount')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.amount
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_amount_adfees')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.amount_after_admin_fees
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_myr')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.local_currency_amount
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_status')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.status
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={cardSectionRowViewContainer}>
                                <View style={cardSectionLeftViewContainer}>
                                    <Text style={cardLeftTitleTextStyle}>
                                        {strings('withdrawal.withdrawal_createdAt')}
                                    </Text>
                                </View>
                                <View style={cardSectionRightViewContainer}>
                                    <Text
                                        style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                                color: CLR_DARK_TIFFANY_BLUE
                                            }}
                                    >
                                        {
                                            walletSingleItem.created_at
                                        }
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </CardSection>
                </Card>
            </View>
            <Toast
                ref="toast"
                style={{backgroundColor:'black'}}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}

            />
            </TouchableOpacity>
        );
    }
}

const styles = {
    merchantCardContainerStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    cardSectionContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
    },
    cardSectionRowViewContainer: {
        flex: 1,
        flexDirection: 'row',
        borderColor: CLR_GREY,
        borderBottomWidth: 2,
    },
    cardSectionLeftViewContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
    },
    cardLeftTitleTextStyle: {
        textAlign: 'left',
        fontSize: 16,
    },
    cardSectionRightViewContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
    },

};


export default UserWithdrawalListItem;
