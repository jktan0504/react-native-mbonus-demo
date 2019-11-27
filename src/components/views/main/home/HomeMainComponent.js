import React, {Component} from 'react';
import { AsyncStorage, Alert, ImageBackground, View, Dimensions, Image, WebView } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import Slideshow from 'react-native-slideshow';
import HTML from 'react-native-render-html';
import { ASYNCTORAGE_USER_TOKEN, ASYNCTORAGE_APP_SHOW_WELCOME, ASYNCTORAGE_APP_IMG_SLIDERS,
    DOMAIN_URL, ASYNCTORAGE_APP_CONTACT_US, CLR_WHITE, CLR_BLACK, ASYNCTORAGE_APP_YOUTUBE_LINK,
} from '../../../../utility/constants';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization,
    changeSettingsLocalizationIsAllowed,
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import MainHeader from '../../../commons/Header/MainHeader';
import { getAppImgSliders,
} from '../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../utility/realm/app/AppSettingsRealmServices';
import { getAppSettings,
} from '../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings, changeToZH, changeToEN } from '../../../../../locales/i18n';

class HomeMainComponent extends Component {

    constructor(props) {
        super(props);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        // AsyncStorage.clear();
        this.checkWelcomePageStatus();
        this.state = {
            isMounted: false,
            user_pref_language: '',
            loading: true,
            userLogin: false,
            user_access_token: '',
            position: 1,
            interval: null,
            dataSource: [
            ],
            allDataSourceFromServices: [],
            getUpdatedImgSlider: true,
            contact_us_description: '<html></html>',
            youtubeLink: '',
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        tokenManagerCheckLogin()
            .then(res => this.setState({ userLogin: res }))
            .catch(err => alert("An error occurred"));
        tokenManagerGetAccessToken()
            .then(res => this.setState({ user_access_token: res }))
            .catch(err => alert("An error occurred"));
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
            //this.getInitialImgSliderFromLocalDB(); // Get Initial Img Slider Data From Local DB
            this.getInitialYoutubeDataFromLocalDB();
            this.getInitialContactUsDataFromLocalDB();
        });
    }

    componentDidUpdate() {
        if(this.props.user_pref_language) {
            if(this.props.languageIsAllowedChanged === true) {
                console.log(`Found Changed Language: ${this.props.user_pref_language}`);
                // this.getUpdatedImgSliderFromLocalDB();
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.setState({ isMounted: false });
    }

    getUpdatedImgSliderFromLocalDB = () => new Promise((resolve, reject) => {
        AsyncStorage.getItem(ASYNCTORAGE_APP_IMG_SLIDERS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    let mBonusLocalImgSlider = [];
                    const data = JSON.parse(localStorageData);
                    data.map((single_img_slider) => {
                        // console.log('found');
                        // console.log(single_img_slider.title_en);
                        const slider_title = this.props.user_pref_language === 'zh' ?
                            single_img_slider.title_cn : single_img_slider.title_en;
                        const slider_description = this.props.user_pref_language === 'zh' ?
                                single_img_slider.description_cn : single_img_slider.description_en;
                        let single_slider_array = {
                            title:  slider_title,
                            caption: slider_description,
                            url: `${DOMAIN_URL}${single_img_slider.image_cn}`,
                        };
                        mBonusLocalImgSlider.push(single_slider_array);
                    });

                    this.setState({
                        dataSource: mBonusLocalImgSlider,
                        allDataSourceFromServices: localStorageData,
                        loading: true,
                        getUpdatedImgSlider: false,
                    });
                    this.props.changeSettingsLocalizationIsAllowed(false);
                }
            })
            .catch(err => reject(err));
     });

    getInitialImgSliderFromLocalDB = () => new Promise((resolve, reject) => {
        AsyncStorage.getItem(ASYNCTORAGE_APP_IMG_SLIDERS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    let mBonusLocalImgSlider = [];
                    const data = JSON.parse(localStorageData);
                    data.map((single_img_slider) => {
                        // console.log('found');
                        // console.log(single_img_slider.title_en);
                        const slider_title = this.state.user_pref_language === 'zh' ?
                            single_img_slider.title_cn : single_img_slider.title_en;
                        const slider_description = this.state.user_pref_language === 'zh' ?
                                single_img_slider.description_cn : single_img_slider.description_en;
                        let single_slider_array = {
                            title: slider_title,
                            caption: slider_description,
                            url: `${DOMAIN_URL}${single_img_slider.image_cn}`,
                        };
                        mBonusLocalImgSlider.push(single_slider_array);
                    });

                    this.setState({
                        dataSource: mBonusLocalImgSlider,
                        allDataSourceFromServices: localStorageData,
                        loading: true,
                    });
                    this.getImgSliderService();
                }
                else
                {
                    this.getImgSliderService();
                }
            })
            .catch(err => reject(err));
     });

    getImgSliderService = () => {
        getAppImgSliders()
            .then((full_img_sliders) => {
                // console.log('from mbonus');
                const img_sliders = full_img_sliders.data.model;
                // console.log(img_sliders);
                this.getAndSetUpdatedData(img_sliders);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    dataSource: [],
                    loading: false
                });
            });
    }

    getAndSetUpdatedData = (data) => {
        let mBonusImgSlider = [];

        data.map((single_img_slider) => {
            // console.log('found');
            // console.log(single_img_slider.title_en);
            const slider_title = this.state.user_pref_language === 'zh' ?
                single_img_slider.title_cn : single_img_slider.title_en;
            const slider_description = this.state.user_pref_language === 'zh' ?
                    single_img_slider.description_cn : single_img_slider.description_en;
            let single_slider_array = {
                title: slider_title,
                caption: slider_description,
                url: `${DOMAIN_URL}${single_img_slider.image_cn}`,
            };
            mBonusImgSlider.push(single_slider_array);
        });

        AsyncStorage.setItem(ASYNCTORAGE_APP_IMG_SLIDERS, JSON.stringify(data));
        this.setState({
            dataSource: mBonusImgSlider,
            allDataSourceFromServices: data,
            loading: false,
        });
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

    getInitialYoutubeDataFromLocalDB = () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_APP_YOUTUBE_LINK)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        youtubeLink: localStorageData,
                    });
                    this.getYoutubeContent();
                }
                else
                {
                    this.getYoutubeContent();
                }
            })
            .catch(err => reject(err));
     });

     getYoutubeContent = () => {
         getAppSettings()
             .then((contact_us) => {
                 const youtube_data_link = contact_us.data.settings.dashboard_video_url;
                 this.getAndSetUpdatedYoutubeData(youtube_data_link);
             })
             .catch((error) => {
                 console.log(error);
                 this.setState({
                     youtubeLink: '',
                 });
             });
     }

     getAndSetUpdatedYoutubeData = (data) => {
         AsyncStorage.setItem(ASYNCTORAGE_APP_YOUTUBE_LINK, data);
         this.setState({
             youtubeLink: data,
         });
     }

    getInitialContactUsDataFromLocalDB = () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_APP_CONTACT_US)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        contact_us_description: localStorageData,
                        loading: true,
                    });
                    this.getContactUsContent();
                }
                else
                {
                    this.getContactUsContent();
                }
            })
            .catch(err => reject(err));
     });

    getContactUsContent = () => {
        getAppSettings()
            .then((contact_us) => {
                console.log('from mbonus');
                const contact_us_data = contact_us.data.settings.contact_us;
                this.getAndSetUpdatedContactUsData(contact_us_data);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    contact_us_description: [],
                    loading: false
                });
            });
    }

    getAndSetUpdatedContactUsData = (data) => {
        AsyncStorage.setItem(ASYNCTORAGE_APP_CONTACT_US, data);
        this.setState({
            contact_us_description: data,
            loading: false,
        });
    }

    getToken = async () => {
        console.log(`GetToken is Running`);
        try {
            let storage_user_access_token = await AsyncStorage.getItem(ASYNCTORAGE_USER_TOKEN);
            this.setState({ user_access_token: storage_user_access_token });
            console.log(`From Haha HomeMainComponent ${this.state.user_access_token}`);
        } catch (e) {
            console.log(`error ${e}`);
            Alert(e);
        }
    }

    checkWelcomePageStatus = async () => {
        console.log(`Checking Welcome Page is Running`);
        try {
            const SHOW_WELCOME_PAGE_NOW = await AsyncStorage.getItem(ASYNCTORAGE_APP_SHOW_WELCOME);

            if(SHOW_WELCOME_PAGE_NOW === 'true') {
                this.props.navigation.navigate('Welcome')
            }

        } catch (e) {
            console.log(`error ${e}`);
            Alert(e);
        }
    }

    renderLogin() {
        if(this.state.userLogin) {
            return (
                <Text style={{ color: 'green'}}>
                    User login is Online
                </Text>
            );
        }
        return (
            <Text style={{ color: 'red'}} >
                User login is Offline
            </Text>
        );
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    renderYoutubeSlider() {
        /*

        <Slideshow
            height={260}
            dataSource={this.state.dataSource}
            position={this.state.position}
            onPositionChanged={position => this.setState({ position })}

        />

        */
        console.log(this.state.youtubeLink);
        if(this.state.youtubeLink === '') {
            console.log('youtube link is empty');

            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('../../../../assets/images/merchant/youtube_icon.png')}
                        style={{ width: 50, height: 50 }}
                    />

                </View>
            );
        }
        else {
            return (
                <WebView
                    source={{ uri: this.state.youtubeLink }}
                    style={{ flex: 1 }}
                />
            );
        }
    }

    render() {
        const { userLogin, user_access_token } = this.state;
        const { mBonusTextStyle, asiaTextStyle, weAreNotTextStyle, homeDescriptionTextStyle,
            homeMainDescriptionContainerStyle, homeYoutubeViewContainer,
        } = styles;
        return (
            <Container>
                <MainHeader
                    navigation={this.props.navigation}
                />
                <ImageBackground
                    source={require('../../../../assets/images/home/home_bg_bluewhite.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content>
                        <View
                            style={homeYoutubeViewContainer}
                        >
                            {this.renderYoutubeSlider()}
                        </View>
                        <View
                            style={{ flex: 1 }}
                        >
                            <ImageBackground
                                source={require('../../../../assets/images/home/home_content_top_section.png')}
                                style={{
                                    width: Dimensions.get('window').width,
                                    flex: 1,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ padding: 10 }}>
                                        <ImageBackground
                                            source={require('../../../../assets/images/home/home_title_bg_banner.png')}
                                            style={{ flexDirection: 'row' }}
                                        >
                                            <Text style={mBonusTextStyle}>MBONUS</Text>
                                            <Text style={asiaTextStyle}>Asia</Text>
                                        </ImageBackground>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={weAreNotTextStyle}>{strings('home.content_title_1')}</Text>
                                    <Text style={weAreNotTextStyle}>{strings('home.content_title_2')}</Text>
                                </View>
                                <View style={homeMainDescriptionContainerStyle}>
                                    <View
                                        style={{
                                            flex: 0.6,
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={homeDescriptionTextStyle}>{strings('home.content_descp_1')}</Text>
                                        <Text style={homeDescriptionTextStyle}>{strings('home.content_descp_2')}</Text>
                                        <View  style={{ alignItems: 'center', padding: 5 }}>
                                        <Image
                                            source={require('../../../../assets/images/app/mbonus_logo_white.png')}
                                            style={{ width: 80, height: 80 }}
                                            />
                                        </View>
                                        <Text style={homeDescriptionTextStyle}>{strings('home.content_descp_3')}</Text>
                                        <Text style={homeDescriptionTextStyle}>{strings('home.content_descp_4')}</Text>
                                    </View>
                                    <View style={{ flex: 0.4, flexDirection: 'column' }}>
                                        <View style={{ flex: 0.8 }}>
                                        </View>
                                        <View style={{ flex: 0.2, alignItems: 'center' }}>
                                        <Image
                                            source={require('../../../../assets/images/home/icon_airoplane.png')}
                                            style={{ width: 80, height: 50 }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 1, marginBottom: 80 }}>

                                </View>
                            </ImageBackground>
                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: CLR_WHITE }}>
                                <View style={{ flex: 0.3, flexDirection: 'column' }}>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Image
                                            source={require('../../../../assets/images/home/icon_home_contact_1.png')}
                                            style={{ width: 60, height: 60, marginTop: 15 }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Image
                                            source={require('../../../../assets/images/home/icon_home_contact_2.png')}
                                            style={{ width: 60, height: 60 }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Image
                                            source={require('../../../../assets/images/home/icon_home_contact_3.png')}
                                            style={{ width: 60, height: 60 }}
                                        />
                                    </View>
                                </View>
                                <View style={{ flex: 0.7, padding: 10 }}>
                                    <HTML
                                        html={this.state.contact_us_description}
                                        imagesMaxWidth={Dimensions.get('window').width}
                                        emSize={20}
                                    />
                                </View>
                            </View>

                        </View>


                    </Content>

                </ImageBackground>
            </Container>
        );
    }
}

const styles = {
    mBonusTextStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: CLR_WHITE,
    },
    asiaTextStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 10,
        fontSize: 19,
        color: CLR_WHITE,
    },
    weAreNotTextStyle: {
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 20,
        paddingRight: 5,
        fontSize: 18,
        color: CLR_BLACK,
    },
    homeMainDescriptionContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    homeDescriptionTextStyle: {
        textAlign: 'justify',
        fontSize: 14,
        color: CLR_BLACK,
        paddingLeft: 20,
    },
    homeYoutubeViewContainer: {
        width: Dimensions.get('window').width,
        height: 260,
        backgroundColor: '#000'
    },
};


const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        languageIsAllowedChanged: state.locale.languageIsChanged,
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization,
    changeSettingsLocalizationIsAllowed,
 })(HomeMainComponent);
