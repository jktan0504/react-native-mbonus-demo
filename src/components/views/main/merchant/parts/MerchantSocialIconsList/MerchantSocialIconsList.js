import React, {Component} from 'react';
import { Image, View, Linking, Text, TouchableOpacity, Platform, PermissionsAndroid,
    Alert,
} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../../../../utility/constants';

class MerchantSocialIconsList extends Component {

    constructor(props) {
        super(props);
    }

    openFBLink() {
        Linking.openURL(this.props.merchantSingleItem.facebook);
    }

    openCallPhoneLink() {
        Alert('running');
        if (Platform.OS === 'ios') {
            RNImmediatePhoneCall.immediatePhoneCall(this.props.merchantSingleItem.contact_number);
        }
        else {
            this.requestPhoneCallPermission();
        }
    }
    // SoS

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
                    // Linking.openURL(`tel:${this.props.merchantSingleItem.contact_number}`);

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

    openInstagramLink() {
        Linking.openURL(this.props.merchantSingleItem.instagram);
    }

    renderFBIcon() {
        if (this.props.merchantSingleItem.facebook != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openFBLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../assets/images/merchant/fb_icon.png')}
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
                            source={require('../../../../../../assets/images/merchant/whatspp_icon.png')}
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
                            source={require('../../../../../../assets/images/merchant/youtube_icon.png')}
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
                            source={require('../../../../../../assets/images/merchant/location_icon.png')}
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
                            source={require('../../../../../../assets/images/merchant/fb_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    renderInstagramIcon() {
        if (this.props.merchantSingleItem.instagram != null) {
            return (
                <View  style={{ padding: 3 }}>
                    <TouchableOpacity
                        onPress={this.openInstagramLink.bind(this)}
                    >
                        <Image
                            source={require('../../../../../../assets/images/merchant/instagram_icon.png')}
                            style={styles.merchantSocialIconstyle}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    render() {
        return (

            <View
                style={{ flex: 1, flexDirection: 'row' }}
            >
                {this.renderFBIcon()}
                {this.renderPhoneIcon()}
                {this.renderYoutubeIcon()}
                {this.renderLocationsIcon()}
                {this.renderInstagramIcon()}
            </View>
        );
    }
}

const styles = {
    headerBGStyles: {
        backgroundColor: CLR_MAIN_HEADER_BAR,
    },
};


export default MerchantSocialIconsList;
