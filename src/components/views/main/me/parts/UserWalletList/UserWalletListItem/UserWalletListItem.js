import React, { Component } from 'react';
import { Image, View, Linking, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL, CLR_PRIMARY_DARK, CLR_DARK_TIFFANY_BLUE,
    CLR_BLACK,
} from '../../../../../../../utility/constants';
import { Card, CardSection } from '../../../../../../commons';
// localize
import { strings } from '../../../../../../../../locales/i18n';

class UserWalletListItem extends Component {

    constructor(props) {
        super(props);
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
        const { merchantCardContainerStyle, merchantItemCardSectionStyle,
            merchantUsernameTextStyle, merchantAddressTextStyle, merchantContactTextStyle
        } = styles;

        return (
            <TouchableOpacity
                onPress={goToMerchantDetails}
            >
            <View style={merchantCardContainerStyle}>
                <Card>
                    <CardSection>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: CLR_DARK_TIFFANY_BLUE
                                        }}
                                >
                                    {walletSingleItem.transaction_type}
                                </Text>
                            </View>
                            <View style={{ flex: 1, paddingTop: 20 }}>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: CLR_PRIMARY_DARK,
                                    }}
                                >
                                    {walletSingleItem.amount}
                                </Text>
                            </View>
                            <View style={{ flex: 1, paddingTop: 10 }}>
                                <Text
                                style={{
                                    textAlign: 'right',
                                    fontSize: 16,
                                    color: CLR_BLACK,
                                }}
                                >
                                    {walletSingleItem.created_at}
                                </Text>
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
    merchantItemCardSectionStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
    },
    merchantUsernameTextStyle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    merchantAddressTextStyle: {
        fontSize: 14,
        paddingTop: 3,
        paddingBottom: 3,
    },
    merchantContactTextStyle: {
        fontSize: 14,
        paddingTop: 3,
        paddingBottom: 3,
    },
    merchantSocialIconstyle: {
        width: 28,
        height: 28,
    },
};


export default UserWalletListItem;
