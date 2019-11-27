import React, {Component} from 'react';
import { AsyncStorage, Alert, Image, Dimensions, View, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_WHITE } from '../../../../utility/constants';
import MainHeader from '../../../commons/Header/MainHeader';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';

// localize
import { strings } from '../../../../../locales/i18n';

class EcommerceMainComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = { userLogin: false, user_access_token: '' };
    }

    componentDidMount() {
        tokenManagerCheckLogin()
            .then(res => this.setState({ userLogin: res }))
            .catch(err => alert("An error occurred"));
        tokenManagerGetAccessToken()
            .then(res => this.setState({ user_access_token: res }))
            .catch(err => alert("An error occurred"));
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

    render() {
        const { mainContainerImgBgStyles, mainContentViewContainerStyle } = styles;
        return (
            <Container>
                <MainHeader
                    navigation={this.props.navigation}
                />
                <View style={mainContentViewContainerStyle}>
                    <ImageBackground
                    source={require('../../../../assets/images/ecommerce/comming_soon_bg.png')}
                    style={mainContainerImgBgStyles}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                    color: CLR_WHITE,
                                    fontWeight: 'bold',
                                    fontSize: 28,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                }}
                            >
                                {strings('ecommerce.welcome')}
                            </Text>
                            <Text style={{
                                    color: CLR_WHITE,
                                    fontSize: 15,
                                }}
                            >
                                {strings('ecommerce.welcome_description')}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            </Container>
        );
    }
}

const styles = {
    mainContentViewContainerStyle: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    mainContainerImgBgStyles: {
        flex: 1,

        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
};


const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization,
 })(EcommerceMainComponent);
