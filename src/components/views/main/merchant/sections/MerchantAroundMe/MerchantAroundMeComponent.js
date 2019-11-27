import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Alert, View, Dimensions, Image, FlatList,
    Linking, Platform, PermissionsAndroid, TouchableOpacity, ImageBackground,
    Animated, Easing,
} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
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
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getAllNearbyMerchantByLocation,
} from '../../../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class MerchantAroundMeComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            merchantDetails: [],
            merchantMarkers: [],
            isLoading: true,
            isMounted: false,
            showMap: false,
            myPosition: null,
            testKLArea: {
                latitude: 2.994943,
                longitude: 101.443130,
            },
        };
        this.spinValue = new Animated.Value(0);
    }

    openGoogleMapLink(latitude, longitude, name, merchantID) {
        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${latitude != null ?
                 parseFloat(latitude) : 3.139003},${ longitude != null ?
                           parseFloat(longitude) : 101.68685499999992}`;
        const label = name;
        const url = Platform.OS === 'ios' ? `${scheme}${label}@${latLng}` : `${scheme}${latLng})`;

        if (latitude != null) {
            /*
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log('Don\'t know how to open URI: ' + url);
                }
            }); */
            this.props.navigation.navigate('Merchant_Sub_Details', {
                merchantID,
                merchantName: name
            });
        }
    }


    renderMap() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        let { heading, coordinate } = this.props;
        const { myPosition, showMap, testKLArea } = this.state;

        if (!coordinate) {

          if (!myPosition)
          {
          }
          else {
              coordinate = myPosition;
              heading = myPosition.heading;
          }
        }

        const rotate = (typeof heading === 'number' && heading >= 0) ? `${heading}deg` : null;

        if (myPosition && showMap) {
            return (
                <MapView
                     ref={map => this.map = map}
                    style={styles.merchantMapStyle}
                    initialRegion={{

                      latitude: myPosition.latitude,
                      longitude: myPosition.longitude,
                        /*
                      latitude: testKLArea.latitude,
                      longitude: testKLArea.longitude, */
                      latitudeDelta: 0.0900,
                      longitudeDelta: 0.0900,
                    }}
                >
                    <Marker
                        style={styles.mapMarker}
                        {...this.props}
                        coordinate={coordinate}
                        /*
                        coordinate={{
                            latitude: testKLArea.latitude,
                            longitude: testKLArea.longitude,
                        }} */
                        title='You are here'
                        image={require('../../../../../../assets/images/locations/mbonus_location_mark.png')}
                    >
                        <Animated.View style={[styles.markerWrap]}>

                            <Animated.Image
                                style={{
                                  width: Dimensions.get('window').width / 1.2,
                                  height: Dimensions.get('window').width / 1.2,
                                  transform: [{ rotate: spin }] }}
                                  source={require('../../../../../../assets/images/locations/mb_radar.png')}
                            />
                        </Animated.View>
                    </Marker>

                    {this.state.merchantMarkers.map((marker, key) => (
                        <Marker
                            style={styles.mapMarker}
                            {...this.props}
                            coordinate={{
                                latitude: parseFloat(marker.latitude),
                                longitude: parseFloat(marker.longitude),
                            }}
                            title={marker.name}
                            description={this.state.user_pref_language === 'zh' ? marker.description_cn :
                                marker.description_en
                            }
                            key={marker.id}
                            onPress={this.openGoogleMapLink.bind(this, marker.latitude, marker.longitude, marker.name, marker.id
                            )}
                        >
                        <View>
                            <View
                                style={{ width: 60, height: 60, backgroundColor:"rgb(90,193,209)", justifyContent: "center", alignItems: "center", padding: 10 }}
                            >

                                <ImageLoad
                                    style={{ width: 45, height: 45 }}
                                    loadingStyle={{ size: 'large', color: 'blue' }}
                                    placeholderSource={require('../../../../../../assets/images/merchant/shop_profile.png')}
                                    placeholderStyle={{ width: 45, height: 45  }}
                                    source={{ url: `${DOMAIN_URL}/${marker.avatar}` }}
                                />

                            </View>


                            <View
                                style={{
                                    width: 0,
                                    height: 0,
                                    backgroundColor: 'transparent',
                                    borderStyle: 'solid',
                                    borderLeftWidth: 10,
                                    borderRightWidth: 10,
                                    borderBottomWidth: 11,
                                    borderLeftColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    borderBottomColor:"rgb(90,193,209)",
                                    transform: [
                                    { rotate: '180deg' }
                                    ],
                                    alignSelf: 'center'
                                    }}
                            />
                            </View>
                        </Marker>
                    ))}

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
        this.spin();
        this.setState({
            isMounted: true,
        }, () => {
            this.getUserPrefLanguage();
            this.mounted = true;
                // If you supply a coordinate prop, we won't try to track location automatically
                if (this.props.coordinate) return;

                if (Platform.OS === 'android') {
                    PermissionsAndroid.requestPermission(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                    .then(granted => {
                    if (granted && this.mounted) this.watchLocation();
                    });
               }
               else {
                 this.watchLocation();
               }
        });
    }

    getAllNearbyMerchant = (latitude, longitude, km) => {
        const submitParams = {
            longitude,
            latitude,
            km
        };

        getAllNearbyMerchantByLocation(submitParams)
            .then((allfullNearbyMerchantDetails) => {
                this.setState({
                  merchantDetails: allfullNearbyMerchantDetails.data.merchant,
                  isRefreshing: false,
                  isLoading: false,
                });
                if (this.state.merchantDetails.length > 0) {
                    this.getAllNearbyMerchantMarker(this.state.merchantDetails);
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    merchantDetails: []
                });
        });
    }

    getAllNearbyMerchantMarker(data) {
        let allNearbyMerchantMarkers = [];

        data.map((single_merchant_details) => {
            if (single_merchant_details.latitude !== null &&
                single_merchant_details.longitude !== null
            ) {
                allNearbyMerchantMarkers.push(single_merchant_details);
            }
        });
        this.setState({
            merchantMarkers: allNearbyMerchantMarkers,
            loading: false,
        });
    }

    spin() {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue,
            {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear
            }
        ).start(() => this.spin());
    }

    watchLocation() {
        const { testKLArea } = this.state;
        // eslint-disable-next-line no-undef
        this.watchID = navigator.geolocation.getCurrentPosition((position) => {
          const myLastPosition = this.state.myPosition;
          const myPosition = position.coords;
          if (myPosition !== myLastPosition) {
            this.setState({ myPosition, showMap: true });
            // this.getAllNearbyMerchant(testKLArea.latitude, testKLArea.longitude, 3);
            this.getAllNearbyMerchant(myPosition.latitude, myPosition.longitude, 5);
          }
        }, null, this.props.geolocationOptions);
  }

    componentWillUnmount() {
        this.setState({ isMounted: false });
        if (this.watchID) {
            navigator.geolocation.clearWatch(this.watchID);
        }
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

    renderMerchantAroundMeText() {
        return strings('merchant.merchant_around_me');
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
            btmCardTitleTextStyle, btmCardContactUsViewCallStyle, btmCardContactUsViewEmailStyle, btmCardContactUsTextStyle, merchantAroundMeIconStyle, merchantTopBtnViewStyle,
            merchantMapStyle, merchantTopBtnStyle, merchantTopBtnTextStyle,
        } = styles;


        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={this.renderMerchantAroundMeText()}
                    goBackAction={() => this.props.navigation.goBack()}
                />
                <View style={{ flex: 1, padding: 0 }}>
                <View style={{ flex: 0.09 }}>
                <Item style={styles.merchantTopBtnViewStyle}>
                    <Button
                        style={styles.merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, }}>
                        <Icon>
                            <Image
                                source={require('../../../../../../assets/images/merchant/merchant_around_me.png')}
                                style={styles.merchantAroundMeIconStyle}
                            />
                        </Icon>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Text
                                style={styles.merchantTopBtnTextStyle}
                            >
                                {this.renderMerchantAroundMeText()}
                            </Text>
                        </View>

                    </Button>
                </Item>
                </View>
                <View style={{ flex: 1 }}>
                    {this.renderMap()}

                </View>
                </View>


            </Container>
        );
    }
}

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const ANCHOR = { x: 0.5, y: 0.5 };

const colorOfmyLocationMapMarker = 'blue';

const propTypes = {
    ...Marker.propTypes,
    // override this prop to make it optional
    coordinate: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
    }),
    children: PropTypes.node,
    geolocationOptions: PropTypes.shape({
        enableHighAccuracy: PropTypes.bool,
        timeout: PropTypes.number,
        maximumAge: PropTypes.number,
    }),
    heading: PropTypes.number,
    enableHack: PropTypes.bool,
};

const defaultProps = {
    enableHack: false,
    geolocationOptions: GEOLOCATION_OPTIONS,
};

const SIZE = 35;
const HALO_RADIUS = 6;
const ARROW_SIZE = 7;
const ARROW_DISTANCE = 6;
const HALO_SIZE = SIZE + HALO_RADIUS;
const HEADING_BOX_SIZE = HALO_SIZE + ARROW_SIZE + ARROW_DISTANCE;

const styles = {
    merchantMainContainer: {
        backgroundColor: 'white',
        padding: 0,
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
        height: Dimensions.get('window').height,
        marginTop: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // The container is necessary to protect the markerHalo shadow from clipping
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    triangle: {
        width: 0,
     height: 0,
     backgroundColor: 'transparent',
     borderStyle: 'solid',
     borderTopWidth: 0,
     borderRightWidth: 45,
     borderBottomWidth: 90,
     borderLeftWidth: 45,
     borderTopColor: 'transparent',
     borderRightColor: 'transparent',
     borderBottomColor: 'red',
     borderLeftColor: 'transparent',
     },
      heading: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: HEADING_BOX_SIZE,
        height: HEADING_BOX_SIZE,
        alignItems: 'center',
      },
      headingPointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: ARROW_SIZE * 0.75,
        borderBottomWidth: ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE * 0.75,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colorOfmyLocationMapMarker,
        borderLeftColor: 'transparent',
      },
      markerHalo: {
        position: 'absolute',
        backgroundColor: 'white',
        top: 0,
        left: 0,
        width: HALO_SIZE,
        height: HALO_SIZE,
        borderRadius: Math.ceil(HALO_SIZE / 2),
        margin: (HEADING_BOX_SIZE - HALO_SIZE) / 2,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0,
        },
      },
      marker: {
        justifyContent: 'center',
        backgroundColor: colorOfmyLocationMapMarker,
        width: SIZE,
        height: SIZE,
        borderRadius: Math.ceil(SIZE / 2),
        margin: (HEADING_BOX_SIZE - SIZE) / 2,
      },
      markerWrap:{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft: -140,
        marginTop: -130,
      },
      markerAnimated: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
      },
      ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
      },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization
 })(MerchantAroundMeComponent);
