import React, {Component} from 'react';
import { AsyncStorage, Alert, TouchableOpacity, View, ImageBackground, Image,
        Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text
} from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, ASYNCTORAGE_APP_SHOW_WELCOME, ASYNCTORAGE_USER_DETAILS,
    ASYNCTORAGE_USER_LAST_LOGIN,
    CLR_DARK_BLUE, CLR_BLACK
} from '../../../../utility/constants';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import MainHeader from '../../../commons/Header/MainHeader';
import { getAuthUserDetails,
} from '../../../../utility/networking/MBonusAuthServices';
// localize
import { strings } from '../../../../../locales/i18n';

class WelcomeMainComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        AsyncStorage.setItem(ASYNCTORAGE_APP_SHOW_WELCOME, 'false');

        this.state = ({
            isMounted: false,
            loading: true,
            userDetails: [],
            last_login_date_time: '',
        });
    }

    componentDidMount() {
        this.setState({ isMounted: true }, () => {
            /*
            tokenManagerCheckLogin()
                .then(res => this.setState({ userLogin: res }))
                .catch(err => alert("An error occurred")); */
            this.getInitialUserDataFromLocalDB();
            this.getUserLastLoginFrmDB();
        });
    }

    componentWillUnmount() {

    }

    getUserLastLoginFrmDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_LAST_LOGIN)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        last_login_date_time: localStorageData,
                    });
                }
            })
            .catch(err => reject(err));
     });

    getInitialUserDataFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: true,
                    });
                    //this.getUserDetailsSevice();
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
                console.log(user_details['name']);
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
    }


    checkWelcomePageStatus = async () => {
        try {
            const SHOW_WELCOME_PAGE_NOW = await AsyncStorage.getItem(ASYNCTORAGE_APP_SHOW_WELCOME);

            if(SHOW_WELCOME_PAGE_NOW === 'false') {
                this.props.navigation.navigate('Home')
            }

        } catch (e) {
            console.log(`error ${e}`);
            Alert(e);
        }
    }

    goToHome() {
        this.setState({ isMounted: false });
        AsyncStorage.setItem(ASYNCTORAGE_APP_SHOW_WELCOME, 'false');
        this.props.navigation.navigate('Home')
    }

    render() {
        const { userDetails, last_login_date_time } = this.state;

        const { topSectionStyle, mbonuLogoImgStyle, btmSectionStyle, welcomeBackTextStyle,
            usernameTextStyle, lastLoginTextStyle
        } = styles;

        return (
            <Container>
                <MainHeader
                    navigation={this.props.navigation}
                />
                    <ImageBackground
                        source={require('../../../../assets/images/welcome/welcome_back_background.png')}
                        style={{ flex: 1, flexDirection: 'column' }}>
                        <TouchableOpacity
                            onPress={this.goToHome.bind(this)}
                            style={{ flex: 1, flexDirection: 'column' }}
                        >
                            <View
                                style={topSectionStyle}
                            >
                                <Image
                                    style={mbonuLogoImgStyle}
                                    source={require('../../../../assets/images/app/mbonus_logo_white.png')}
                                />
                            </View>
                            <View
                                style={btmSectionStyle}
                            >
                                <Text style={welcomeBackTextStyle}>
                                    {strings('welcome.welcome_back')}
                                </Text>
                                <Text style={usernameTextStyle}>
                                    { userDetails.name }
                                </Text>
                                <Text style={lastLoginTextStyle}>
                                    {strings('welcome.last_login_at')} { last_login_date_time }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ImageBackground>
            </Container>
        );
    }
}

const styles = {
    topSectionStyle: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    mbonuLogoImgStyle: {
        width: 95,
        height: 95,
        marginTop: 10,
    },
    btmSectionStyle: {
        flex: 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeBackTextStyle: {
        fontSize: 25,
        color: CLR_DARK_BLUE,
        padding: 5,
    },
    usernameTextStyle: {
        fontSize: 35,
        color: CLR_BLACK,
        fontWeight: 'bold',
        padding: 5,
    },
    lastLoginTextStyle: {
        fontSize: 14,
        color: CLR_BLACK,
        padding: 5,
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
 })(WelcomeMainComponent);
