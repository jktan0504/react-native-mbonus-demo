import React, { Component, PropTypes } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, Permissions, Linking, Switch
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input, ListItem,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_MORE_LIGHT_GREY,
    CLR_LIGHT_GREY,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getAuthUserMyCommunityData
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting, getMBonusNotificaitonSettings,
    setUserNotificationConfiguration,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserSettingsComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            isLoading: false,
            isRefreshing: false,
            isNotificationOn: false,
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
        this.getUserNotificationSettings();
    }

    getUserNotificationSettings = () => {
        getMBonusNotificaitonSettings().then((isNotificationOn) => {
            switch (isNotificationOn) {
                case 'true':
                    this.setState({
                        isNotificationOn: true
                    });
                    break;
                case 'false':
                    this.setState({
                        isNotificationOn: false
                    });
                        break;
                default:
            }
        }).catch((err) => {
            this.setState({
                isNotificationOn: false
            });
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

    renderSpinner() {
        if (this.state.isLoading) {
            return (
                <MBonusSpinner
                    size={35}
                    type='Wave'
                    color='CLR_TIFFANY_BLUE'
                />
            );
        }
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }

    gotToTNC() {
        this.props.navigation.navigate('TNC_Route', {
        });
    }

    changeNotificaitonConfiguration() {
        this.setState({
            isNotificationOn: !this.state.isNotificationOn,
        });
        setUserNotificationConfiguration(!this.state.isNotificationOn);
    }

    render() {

        const { merchantMainContainer, listItemHolderStyle, bodyBtmPartStyle,
            listTitleItemHolderStyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('me.btn_settings')}
                    goBackAction={() => this.goBackNClear()}
                />
                <Content>
                    <ListItem style={listTitleItemHolderStyle}>
                        <Body style={{ flex: 1 }}>
                            <Text>{strings('settings.general')}</Text>
                        </Body>
                    </ListItem>
                    <ListItem style={listItemHolderStyle}>
                        <Body style={bodyBtmPartStyle}>
                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../../../../../assets/images/me/ic_action_notification.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <Text>{strings('notification.notification')}</Text>
                            </View>
                            <View style={{ flex: 0.1 }}>
                                <Switch
                                    onValueChange={this.changeNotificaitonConfiguration.bind(this)}
                                     value={this.state.isNotificationOn}
                                />
                            </View>
                        </Body>
                    </ListItem>
                    <ListItem style={listTitleItemHolderStyle}>
                        <Body style={{ flex: 1 }}>
                            <Text>{strings('settings.about')}</Text>
                        </Body>
                    </ListItem>

                    <ListItem style={listItemHolderStyle}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this.gotToTNC.bind(this)}
                        >
                        <Body style={bodyBtmPartStyle}>
                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../../../../../assets/images/me/ic_action_tnc.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <Text>{strings('tnc.tnc')}</Text>
                            </View>
                        </Body>
                        </TouchableOpacity>
                        <Body style={bodyBtmPartStyle}>
                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={require('../../../../../../assets/images/app/mbonus_logo_white.png')}
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>
                            <View style={{ flex: 0.9, flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {strings('app.app_name')}  {strings('app.app_version')}</Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        paddingTop: 10,
                                    }}>
                                    <Text style={{ fontSize: 12 }}>{strings('login.mbonus_copyrights')}</Text>
                                </View>
                            </View>
                        </Body>
                    </ListItem>
                </Content>

                { this.renderSpinner() }
            </Container>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: CLR_MORE_LIGHT_GREY
    },
    listTitleItemHolderStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginRight: 10,
    },
    listItemHolderStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginRight: 10,
        backgroundColor: 'white',
        borderBottomWidth: 0,
    },
    bodyBtmPartStyle: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: CLR_LIGHT_GREY,
        flexDirection: 'row',
        width: Dimensions.get('window').width / 1.2,
    },

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
})(UserSettingsComponent);
