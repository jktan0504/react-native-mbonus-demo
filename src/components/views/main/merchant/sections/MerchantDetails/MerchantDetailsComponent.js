import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, FlatList,
    Linking, Platform, PermissionsAndroid, TouchableOpacity
} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Slideshow from 'react-native-slideshow';
import ImageLoad from 'react-native-image-placeholder';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_BLUE_GREY, CLR_DARK_GREY, CLR_MORE_DARK_GREY
} from '../../../../../../utility/constants';
import { GoBackHeader, CountryStateIcons, MerchantCard, CardSection } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import MerchantSocialIconsList from '../../parts/MerchantSocialIconsList/MerchantSocialIconsList';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getMerchantDetailsByID,
} from '../../../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class MerchantDetailsComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            merchantDetails: [],
            merchantCountry: [],
            merchantState: [],
            isLoading: true,
            position: 1,
            interval: null,
            dataSource: [
            ],
            isMounted: false,
            showMap: false,
        };
    }

    openGoogleMapLink() {
        const { merchantDetails } = this.state;
        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${merchantDetails.latitude != null ?
                 merchantDetails.latitude : 3.139003},${ merchantDetails.longitude != null ?
                           merchantDetails.longitude : 101.68685499999992}`;
        const label = merchantDetails.name;
        const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng})`;

        if (merchantDetails.latitude != null) {
            this.openExternalApp(url);
        }
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

    renderMap() {
        const { merchantDetails } = this.state;
        if (this.state.showMap) {
            return (
                <MapView
                    style={styles.merchantMapStyle}
                    initialRegion={{
                      latitude: merchantDetails.latitude != null ?
                                parseFloat(merchantDetails.latitude) : 3.139003,
                      longitude: merchantDetails.longitude != null ?
                                parseFloat(merchantDetails.longitude) : 101.68685499999992,
                      latitudeDelta: 0.002,
                      longitudeDelta: 0.0021,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: merchantDetails.latitude != null ?
                                      parseFloat(merchantDetails.latitude) : 3.139003,
                            longitude: merchantDetails.longitude != null ?
                                      parseFloat(merchantDetails.longitude) : 101.68685499999992,
                          }}
                          onPress={this.openGoogleMapLink.bind(this)}
                          title={merchantDetails.name}
                          image={require('../../../../../../assets/images/locations/mbonus_location_mark.png')}
                          description={`${merchantDetails.name}`}
                    />
                </MapView>
            );
        }
        else {
            return (
                <Image
                    source={require('../../../../../../assets/images/locations/loading_map.gif')}
                    style={{ flex: 1, width: null, height: 250 }}
                />
            );
        }

    }

    componentDidMount() {
        this.setState({
            isMounted: true,
            interval: setInterval(() => {
                this.setState({
                  position: this.state.position ===
                  (this.state.dataSource.length - 1) ? 0 : this.state.position + 1
                });
            }, 2000),
        }, () => {
            this.getUserPrefLanguage();
            this.getMerchantDetails(this.props.navigation.getParam('merchantID', '1'));
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.setState({ isMounted: false });
    }

    getUserPrefLanguage = () => {
        getMBonusAppLanguageSetting().then((locale) => {
            this.setState({
                user_pref_language: locale
            });
            console.log(locale);
        }).catch((err) => {
            this.setState({
                user_pref_language: 'en'
            });
        });
    }

    getMerchantDetails = (merchantID) => {
        const submitParams = {
            merchantID
        };

        getMerchantDetailsByID(submitParams)
            .then((fullMerchantDetails) => {
                this.setState({
                  merchantDetails: fullMerchantDetails.data.merchant,
                  merchantCountry: fullMerchantDetails.data.merchant.country,
                  merchantState: fullMerchantDetails.data.merchant.state,
                  isRefreshing: false,
                  isLoading: false,
                  showMap: true,
                });
                console.log(this.state.merchantDetails);
                this.getMerchantImgGalleries();
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    merchantDetails: []
                });
        });
    }

    getMerchantImgGalleries() {
        const { merchantDetails } = this.state;

        let merchantImgGallerySlider = [];

        if (merchantDetails.photo_1) {
            let single_slider_array = {
                caption: merchantDetails.photo_1_description != null ?
                    merchantDetails.photo_1_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_1}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_2 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_2_description != null ?
                    merchantDetails.photo_2_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_2}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_3 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_3_description != null ?
                    merchantDetails.photo_3_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_3}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_4 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_4_description != null ?
                    merchantDetails.photo_4_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_4}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_5 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_5_description != null ?
                    merchantDetails.photo_5_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_5}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_6 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_6_description != null ?
                    merchantDetails.photo_1_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_6}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_7 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_7_description != null ?
                    merchantDetails.photo_7_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_7}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_8 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_8_description != null ?
                    merchantDetails.photo_8_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_8}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_9 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_9_description != null ?
                    merchantDetails.photo_9_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_9}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        if (merchantDetails.photo_10 != null) {
            let single_slider_array = {
                caption: merchantDetails.photo_10_description != null ?
                    merchantDetails.photo_10_description : '',
                url: `${DOMAIN_URL}/${merchantDetails.photo_10}`,
            };
            merchantImgGallerySlider.push(single_slider_array);
        }

        this.setState({
            dataSource: merchantImgGallerySlider,
            loading: true,
        });

        console.log(`size of gallery: ${merchantImgGallerySlider.length} `);
    }

    openCallPhoneLink() {
        if (Platform.OS === 'ios') {
            RNImmediatePhoneCall.immediatePhoneCall(this.state.merchantDetails.contact_number);
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
                    Linking.openURL(`tel:${this.props.merchantSingleItem.contact_number}`);
                } else {
                    this.refs.toast.show(strings('permission.phoneCall_permission_denied'));
                }
            } catch (err) {
                this.refs.toast.show(err);
            }
        }
    }

    openEmailLink() {
        Linking.openURL(`mailto:${this.state.merchantDetails.email}?subject=MBonus Merchant &body=Hi, I would like to know more about your business`)
    }


    render() {
        const { navigation } = this.props;
        const merchantName = navigation.getParam('merchantName',
            strings('merchant.merchant_details')
        );
        const { merchantDetails, merchantCountry, merchantState } = this.state;
        const { merchantMainContainer, merchantTopDetailsContainerStyle,
            merchantNameTextStyle, merchantAddressTextStyle, merchantBtmDetailsContainerStyle,
            topCardSectionStyle, btmCardSectionStyle, merchantAboutUsTextStyle,
            btmCardTitleTextStyle, btmCardContactUsViewCallStyle, btmCardContactUsViewEmailStyle, btmCardContactUsTextStyle,
            merchantMapStyle,
        } = styles;

        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={merchantName}
                    goBackAction={() => this.props.navigation.goBack()}
                />
                <Content>
                    <Slideshow
                        height={260}
                        dataSource={this.state.dataSource}
                        position={this.state.position}
                        onPositionChanged={position => this.setState({ position })}
                    />
                    <View style={{ flex: 1 }}>
                        <View
                            style={{ flex: 1, flexDirection: 'row' }}
                        >
                            <View
                                style={{ flex: 0.4, padding: 10, marginTop: -50 }}
                            >
                                <ImageLoad
                                    style={{ width: 130, height: 130 }}
                                    loadingStyle={{ size: 'large', color: 'blue' }}
                                    placeholderSource={require('../../../../../../assets/images/merchant/shop_profile.png')}
                                    placeholderStyle={{ width: 130, height: 130  }}
                                    source={{ uri: `${DOMAIN_URL}/${merchantDetails.avatar}` }}
                                />
                            </View>
                            <View
                                style={{ flex: 0.6, flexDirection: 'column'}}
                            >
                                <CountryStateIcons
                                    countryFlag={merchantCountry.country_name_en}
                                    stateFlag={merchantState.location_name_en}
                                />
                                <MerchantSocialIconsList
                                    merchantSingleItem={merchantDetails}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={merchantTopDetailsContainerStyle}>
                        <Text style={merchantNameTextStyle}>{merchantDetails.name}</Text>
                        <Text style={merchantAddressTextStyle}>{merchantDetails.address}</Text>
                    </View>
                    <View style={merchantBtmDetailsContainerStyle}>
                        <MerchantCard>
                            <CardSection>
                                <View
                                    style={{ flex: 1, flexDirection: 'column' }}
                                >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <Text
                                                style={btmCardTitleTextStyle}
                                            >
                                                {strings('merchant.merchant_about_us')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={btmCardSectionStyle}>
                                        <Text
                                            style={merchantAboutUsTextStyle}
                                        >
                                            {this.state.user_pref_language === 'en' ? merchantDetails.description_en : merchantDetails.description_cn}
                                        </Text>
                                    </View>
                                </View>
                            </CardSection>
                        </MerchantCard>
                        <MerchantCard>
                            <CardSection>
                                <View
                                    style={{ flex: 1, flexDirection: 'column' }}
                                >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <Text
                                                style={btmCardTitleTextStyle}
                                            >
                                                {strings('merchant.merchant_contact_us')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={btmCardSectionStyle}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={btmCardContactUsViewCallStyle}>
                                                <View style={{
                                                    flex: 1, padding: 10 }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={this.openCallPhoneLink.bind(this)}
                                                    >
                                                        <Image
                                                            source={require('../../../../../../assets/images/merchant/whatspp_icon.png')}
                                                            style={{ width: 30, height: 30 }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <Text
                                                    style={btmCardContactUsTextStyle}
                                                >
                                                    {merchantDetails.contact_number}
                                                </Text>
                                            </View>
                                            <View style={btmCardContactUsViewEmailStyle}>
                                                <View style={{
                                                    flex: 1, padding: 10, justifyContent: 'center' }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={this.openEmailLink.bind(this)}
                                                    >
                                                        <Image
                                                            source={require('../../../../../../assets/images/merchant/ic_action_email.png')}
                                                            style={{ width: 35, height: 30, }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <Text
                                                    style={btmCardContactUsTextStyle}
                                                >
                                                    {merchantDetails.email}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </CardSection>
                        </MerchantCard>
                        <MerchantCard>
                            <CardSection>
                                <View
                                    style={{ flex: 1, flexDirection: 'column' }}
                                >
                                    <View style={topCardSectionStyle}>
                                        <View
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <Text
                                                style={btmCardTitleTextStyle}
                                            >
                                                {strings('merchant.merchant_find_us')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={btmCardSectionStyle}>
                                        {this.renderMap()}
                                    </View>
                                </View>
                            </CardSection>
                        </MerchantCard>

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
        flexDirection: 'column',
        borderBottomWidth: 2,
        borderColor: CLR_DARK_GREY,
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
    }

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization
 })(MerchantDetailsComponent);
