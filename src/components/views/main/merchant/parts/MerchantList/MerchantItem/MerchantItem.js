import React, { Component } from 'react';
import { Image, View, Linking, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../../../../../utility/constants';
import { Card, GreyCardSection } from '../../../../../../commons';
// localize
import { strings } from '../../../../../../../../locales/i18n';

class MerchantItem extends Component {

    constructor(props) {
        super(props);
    }

    openFBLink() {
        Linking.openURL(this.props.merchantSingleItem.facebook);
    }

    openCallPhoneLink() {
        if (Platform.OS === 'ios') {
            RNImmediatePhoneCall.immediatePhoneCall(this.props.merchantSingleItem.contact_number);
        }
        else {
            this.requestPhoneCallPermission();
        }
    }

    async requestPhoneCallPermission() {
        const checkPhoneCallPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
        if (checkPhoneCallPermission === PermissionsAndroid.RESULTS.GRANTED) {
            this.refs.toast.show(strings('permission.phoneCall_permission_granted'));
        } else {
            try {
                const granted = await   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                    {
                        title: strings('permission.phoneCall_title'),
                        message: strings('permission.phoneCall_message')
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.refs.toast.show(strings('permission.phoneCall_permission_granted'));
                    RNImmediatePhoneCall.immediatePhoneCall(this.props.merchantSingleItem.contact_number);
                } else {
                    this.refs.toast.show(strings('permission.phoneCall_permission_denied'));
                }
            } catch (err) {
                this.refs.toast.show(err);
            }
        }
    }

    openYoutubeLink() {
        Linking.openURL(this.props.merchantSingleItem.youtube);
    }

    openGoogleMapLink() {
        /*
        Linking.openURL(`https://maps.apple.com/?q=${this.props.merchantSingleItem.username}&ll=-8.4526503,115.2353083`);*/
        // 37.484847,-122.148386

        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${this.props.merchantSingleItem.latitude},${this.props.merchantSingleItem.longitude}`;
        const label = this.props.merchantSingleItem.username;
        const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng})`;

        /*
        const platformURL = Platform.OS === 'ios' ? `http://maps.apple.com/maps?daddr=${this.props.merchantSingleItem.address}` : `http://maps.google.com/maps?daddr=${this.props.merchantSingleItem.address}`
        */
        this.openExternalApp(url);
    }

    openExternalApp(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            } else {
              console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }

    openTwitterLink() {
        Linking.openURL(this.props.merchantSingleItem.twitter);
    }

    renderFBIcon() {
        if (this.props.merchantSingleItem.facebook != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openFBLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../../assets/images/merchant/fb_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>

            );
        }
    }

    renderPhoneIcon() {
        if (this.props.merchantSingleItem.contact_number != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openCallPhoneLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../../assets/images/merchant/whatspp_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    renderYoutubeIcon() {
        if (this.props.merchantSingleItem.youtube != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openYoutubeLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../../assets/images/merchant/youtube_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }
    renderLocationsIcon() {
        if (this.props.merchantSingleItem.map_address != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openGoogleMapLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../../assets/images/merchant/location_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    renderTwitterIcon() {
        if (this.props.merchantSingleItem.twitter != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openTwitterLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../../assets/images/merchant/fb_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        const { merchantSingleItem, goToMerchantDetails
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
                    <GreyCardSection>
                        <View style={merchantItemCardSectionStyle}>
                            <View
                                style={{ flex: 0.45 }}
                            >
                                <ImageLoad
                                    style={{ width: 130, height: 130 }}
                                    loadingStyle={{ size: 'large', color: 'blue' }}
                                    placeholderSource={require('../../../../../../../assets/images/merchant/shop_profile.png')}
                                    placeholderStyle={{ width: 130, height: 130  }}
                                    source={{ uri: `${DOMAIN_URL}/${merchantSingleItem.avatar}` }}
                                />
                            </View>
                            <View
                                style={{ flex: 0.55 }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={merchantUsernameTextStyle}
                                >{ merchantSingleItem.name }</Text>
                                <Text
                                    numberOfLines={3}
                                    style={merchantAddressTextStyle}
                                >{ merchantSingleItem.address }</Text>
                                <Text
                                    numberOfLines={1}
                                    style={merchantContactTextStyle}
                                >{ merchantSingleItem.contact_number }</Text>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    {this.renderFBIcon()}
                                    {this.renderPhoneIcon()}
                                    {this.renderYoutubeIcon()}
                                    {this.renderLocationsIcon()}

                                </View>
                            </View>
                        </View>
                    </GreyCardSection>
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


export default MerchantItem;
