import React, {Component} from 'react';
import { AsyncStorage, Alert, ImageBackground, View, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, ListItem, CheckBox, Text } from 'native-base';
import Slideshow from 'react-native-slideshow';
import { ASYNCTORAGE_USER_TOKEN, ASYNCTORAGE_APP_SHOW_WELCOME, ASYNCTORAGE_APP_IMG_SLIDERS,
    DOMAIN_URL,
} from '../../../../utility/constants';
import { tokenManagerCheckLogin, userUpdateLanguageAction, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { GoBackHeader } from '../../../commons';
import { getAppImgSliders,
} from '../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings, changeToZH, changeToEN } from '../../../../../locales/i18n';

class ChangeLocalizationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userDetails: [],
            user_pref_language: '',
            isMounted: true,
            isChineseLanguage: false,
            isEnglsihLanguage: false,
            error_msg: '',
            successMsg: '',
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getUserPrefLanguage();
    }
    componentDidUpdate() {
        if(this.props.successMsg) {
            console.log(this.props.successMsg);
        }
        if (this.props.errorMsg) {
            console.log(this.props.errorMsg);
        }
    }

    getUserPrefLanguage = () => {
        getMBonusAppLanguageSetting().then((locale) => {
            this.setState({
                user_pref_language: locale
            });
            switch (locale) {
                case 'zh':
                    this.setState({
                        isChineseLanguage: true,
                    });
                break;
                case 'en':
                    this.setState({
                        isEnglsihLanguage: true,
                    });
                break;
            }
        }).catch((err) => {
            this.setState({
                user_pref_language: 'en'
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.setState({ isMounted: false });
    }

    changeLangaugeToZh = () => {
        // console.log('CHange is pressed');
        // changeToZH();
        // this.forceUpdate();
        // this.componentWillUnmount();

        this.props.changeSettingsLocalization('zh');
        this.setState({
            isChineseLanguage: true,
        });
        const submitParams = {
            lang: 'cn',
        };
        this.props.userUpdateLanguageAction(submitParams);

        this.props.navigation.goBack();
    }

    changeLangaugeToEN = () => {
        // console.log('CHange is pressed');
        // changeToEN();
        // this.forceUpdate();
        // this.componentWillUnmount();
        this.props.changeSettingsLocalization('en');
        this.setState({
            isEnglsihLanguage: true,
        });
        const submitParams = {
            lang: 'en',
        };
        this.props.userUpdateLanguageAction(submitParams);
        this.props.navigation.goBack();
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }

    switchLanguageAction = () => {
        this.setState({
           isChineseLanguage: !this.state.isChineseLanguage,
        });
        let locale = '';
        if (this.state.isChineseLanguage === false) {
            locale = strings('language.zh');
        }
        else {
            locale = strings('language.en');
        }
        Alert.alert(
            `Your selected Langugage is ${locale}`
        );

        /*
         * Ori Language btmNavigation
         *
         <Button onPress={ this.changeLangaugeToZh.bind(this) }>
             <Text>{strings('welcome.welcome_back')}</Text>
         </Button>
         <Button onPress={ this.changeLangaugeToEN.bind(this) }>
             <Text>{strings('welcome.welcome_back')}</Text>
         </Button>

         * **/

     }

    render() {
        const { userLogin, user_access_token } = this.state;
        return (
            <Container>
                <GoBackHeader
                    headerTitle={strings('language.change_lang')}
                    goBackAction={() => this.goBackNClear()}
                />
                <View style={{ flex: 1,
                        backgroundColor: 'white',
                        padding: 10,
                        flexDirection: 'column'
                    }}
                >

                    <ListItem>
                        <TouchableOpacity
                            onPress={this.changeLangaugeToZh.bind(this)}
                            style={{ flex: 1, flexDirection: 'row' }}
                        >
                        <CheckBox
                            checked={this.state.isChineseLanguage}
                            //onValueChange={this.state.isChineseLanguage}
                            //onPress={this.changeLangaugeToZH.bind(this)}
                        />
                        <Body>
                            <Text>{strings('language.zh')}</Text>
                        </Body>
                        </TouchableOpacity>
                    </ListItem>


                    <ListItem>
                        <TouchableOpacity
                            onPress={this.changeLangaugeToEN.bind(this)}
                            style={{ flex: 1, flexDirection: 'row' }}
                        >
                        <CheckBox
                            checked={this.state.isEnglsihLanguage}
                            //onPress={this.changeLangaugeToEN.bind(this)}
                            //onValueChange={this.state.isChineseLanguage}
                        />
                        <Body>
                            <Text>{strings('language.en')}</Text>
                        </Body>
                        </TouchableOpacity>
                    </ListItem>



                </View>
            </Container>
        );
    }
}


const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        success_msg: state.user_update.successMsg,
        error_msg: state.user_update.errorMsg,
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization,
    userUpdateLanguageAction
 })(ChangeLocalizationComponent);
