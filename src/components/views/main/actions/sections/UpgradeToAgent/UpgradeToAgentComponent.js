import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, Linking, Clipboard, Share
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import QRCode from 'react-native-qrcode';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input, CheckBox,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_DARK_GREY, CLR_SHINE_BLUE,
    CLR_MORE_LIGHT_GREY, ASYNCTORAGE_USER_DETAILS, CLR_FB, CLR_TWITTER, CLR_WHATSAPP,
    CLR_TELEGRAM, CLR_RED, CLR_TIFFANY_BLUE
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, globalActionsFormUpdate,
        globalFormsClearAll, globalFormsClear_UsernameSuccess,
        upgradeToAgentCheckUsernameSubmit,
        upgradeToAgentSubmit
} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getCountryOptions, getStateOptions, getAreaOptions,
} from '../../../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UpgradeToAgentComponent extends Component {

    constructor(props) {
        super(props);
        this.props.globalFormsClearAll();
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            confirmedUpgrade: false,
            lang: '',
            selectedAgent: false,
            selectedRegisterID: '',
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            phone_ext_list: [],
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getInitialUserDataFromLocalDB();
    }

    componentDidUpdate() {
        if(this.props.targetUsernameSuccessMsg) {
            this.setState({
                verifiedMsg: this.props.targetUsernameSuccessMsg,
                verifiedMsgType: 1,
            });
            this.refs.toast.show(this.props.targetUsernameSuccessMsg, DURATION.LENGTH_LONG);
            this.props.globalFormsClear_UsernameSuccess();
        }
        if (this.props.targetUsernameFailedMsg) {
            this.setState({
                verifiedMsg: this.props.targetUsernameFailedMsg,
                verifiedMsgType: 0,
            });
            this.refs.toast.show(this.props.targetUsernameFailedMsg, DURATION.LENGTH_LONG);
            this.props.globalFormsClearAll();
        }

        if(this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
            setTimeout(() => {
                this.props.globalFormsClearAll();
                this.props.navigation.goBack();
                /*
                this.props.navigation.navigate(
                    'UserMe_Sub_Main',
                    {
                        onGoBack: () => console.log('Will go back from nextComponent'),
                    }
                );*/
            }, 1000);

        }
        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
            setTimeout(() => {
                this.props.globalFormsClearAll();
                this.props.navigation.goBack();
                /*
                this.props.navigation.navigate(
                    'UserMe_Sub_Main',
                    {
                        onGoBack: () => console.log('Will go back from nextComponent'),
                    }
                );*/
            }, 1000);
        }
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

    getInitialUserDataFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: true,
                    });
                    this.getUserDetailsSevice();

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
                //console.log(user_details['name']);
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
        console.log('updated');
        console.log(this.state.userDetails);
    }

    goBackNClear() {
        this.props.globalFormsClearAll();
        this.props.navigation.goBack();
    }

    /*
    value={
        this.renderGetFormattedNumberString(parseFloat(this.state.userDetails.credit_3))
    }
    */
    renderGetFormattedNumberString(number) {
        return number.toLocaleString(undefined, { maximumFractionDigits: 4 });
        //return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    renderSpinner() {
        if (this.props.loading) {
            return (
                <MBonusSpinner
                    size={35}
                    type='Wave'
                    color='CLR_TIFFANY_BLUE'
                />
            );
        }
    }

    onSubmitUpgradeToAgentServiceAction = () => {
        console.log(this.props.current_password2);
        if (this.state.confirmedUpgrade === true && this.state.verifiedMsgType === 1 &&
            this.props.current_password2 && this.props.target_username
         ) {
            const submitParams = {
                target_username: this.props.target_username,
                current_password2: this.props.current_password2,
            };
            this.props.upgradeToAgentSubmit(submitParams);

        }
        else {
                this.refs.toast.show(strings('actions.completed_confirm'), DURATION.LENGTH_LONG);
        }
    }

    // Check TargetUsername
    checkTargetUsernameAvailable = () => {
        if (this.props.target_username) {
            const submitParams = {
                target_username: this.props.target_username,
            };
            this.setState({
                verifiedMsg: '',
                verifiedMsgType: '',
            });

            this.props.upgradeToAgentCheckUsernameSubmit(submitParams);
        }
    }

    renderVerifiedUsername() {
        if(this.state.verifiedMsgType === 1) {
            return (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'green', textAlign: 'center' }}
                    >
                        {strings('user_profile.verified')}
                    </Text>
                </View>
            );
        }
        if (this.state.verifiedMsgType === 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'red', textAlign: 'center' }}
                    >
                        {strings('user_profile.unverified')}
                    </Text>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'red', textAlign: 'center' }}
                    >
                        {this.state.verifiedMsg}
                    </Text>
                </View>
            );
        }
    }

    render() {

        const { merchantMainContainer, titleTextStyle, socialIconstyle, roundedRowBtnViewStyle,
            inputTextFieldStyle, myButtonStyle, myButtonTextStyle, socialTextstyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('actions.upgrade_to_agent')}
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/actions/green_bg.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                            <Text
                                style={titleTextStyle}
                            >
                                {strings('actions.upgrade_to_agent_500')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 15 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE
                                        }}
                                    >
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            multiline
                                            autoCorrect={false}
                                            placeholder={strings('actions.register_target_username')}
                                            style={inputTextFieldStyle}

                                            value={this.state.userDetails.credit_3}
                                        />
                                    </View>
                                </View>
                            </Item>
                            <Text
                                style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                            >
                                {strings('actions.current_rp')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 0.7,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE
                                 }}
                                >
                                        <Input
                                            autoCapitalize={'none'}
                                            multiline
                                            autoCorrect={false}
                                            placeholder={strings('actions.register_target_username')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'target_username',
                                                    value: text,
                                            })}
                                            value={this.props.target_username}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 0.3 }}
                                        onPress={this.checkTargetUsernameAvailable.bind(this)}
                                    >

                                        <View style={myButtonStyle}>
                                            <Text style={myButtonTextStyle}>
                                                {strings('user_profile.verify')}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </Item>
                        </View>

                        {this.renderVerifiedUsername()}

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        borderWidth: 2,
                                        borderColor: CLR_WHITE,
                                        marginRight: 10,
                                        borderRadius: 5,
                                        backgroundColor: CLR_WHITE
                                    }}
                                >
                                    <Input
                                        secureTextEntry
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_current_wallet_password')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'current_password2',
                                                value: text,
                                        })}
                                        value={this.props.current_password2}
                                    />
                                </View>
                            </Item>
                        </View>
                        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                            <Text
                                style={{ textAlign: 'center', fontSize: 14 }}
                            >
                                {strings('actions.upgrade_current_wallet_rm')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column',}}>
                            <Item style={styles.itemRowContainerStyle}>
                                <CheckBox
                                    checked={this.state.confirmedUpgrade}
                                    color="blue"
                                    onPress={() => this.setState({ confirmedUpgrade: !this.state.confirmedUpgrade })}
                                />
                                <Body style={{ paddingLeft: 10, marginLeft: 10 }}>
                                    <Text style={{ fontSize: 14, color: CLR_BLACK }}>{strings('actions.upgrade_checkbox')}</Text>
                                </Body>

                            </Item>
                        </View>

                        <View
                            style={{ flex: 1 }}
                        >
                            <Item style={roundedRowBtnViewStyle}>
                                <Button
                                    style={{ flex: 1,
                                    backgroundColor: CLR_DARK_GREY, }}
                                    onPress={this.onSubmitUpgradeToAgentServiceAction.bind(this)}
                                >
                                    <View style={{ flex: 1, alignItems: 'center'}} >
                                        <Text
                                        >
                                            {strings('actions.upgrade_agent_confirm')}
                                        </Text>
                                    </View>

                                </Button>
                            </Item>
                        </View>

                    </Content>
                </ImageBackground>
                { this.renderSpinner() }
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'black' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}

                />
            </Container>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: CLR_MORE_LIGHT_GREY
    },
    mainViewContainerStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    titleTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: CLR_WHITE,
    },
    socialIconstyle: {
        width: 65,
        height: 65,
        alignSelf: 'center'
    },
    roundedRowBtnViewStyle: {
        flex: 1,
        marginTop: 15,
        borderBottomWidth: 0,
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
    },
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5,
    },
    myButtonStyle: {
        padding: 10,
        flex: 1,
        borderRadius: 5,
        backgroundColor: CLR_DARK_GREY,
        justifyContent: 'center',
        alignItems: 'center'
    },
    myButtonTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CLR_WHITE,
    },
    socialTextstyle: {
        textAlign: 'center',
        color: CLR_WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputSpinnerTextFieldContainerStyle: {
        paddingTop: 3,
        paddingBottom: 3,
        padding: 10,
        marginTop: 20,
        height: 40,
        flexDirection: 'row',
    },
    contactFieldLeftStyle: {
        flex: 3
    },
    contactFieldRightStyle: {
        flex: 5
    },
    contactInputTextFieldLeftStyle: {
        backgroundColor: CLR_WHITE,
        height: 40,
    },
    contactInputTextFieldRightStyle: {
        backgroundColor: CLR_WHITE,
        height: 40,
        marginLeft: 10
    },
    merchantTopBtnStyle: {
        flex: 1,
        backgroundColor: CLR_FB,
    },
    dontHaveReferralTextStyle: {
        fontSize: 12,
        marginLeft: 5,

    },
    itemRowContainerStyle: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        errorMsg: state.global_forms.errorMsg,
        successMsg: state.global_forms.successMsg,
        loading: state.global_forms.loading,
        target_username: state.global_forms.target_username,
        targetUsernameSuccessMsg: state.global_forms.targetUsernameSuccessMsg,
        targetUsernameFailedMsg: state.global_forms.targetUsernameFailedMsg,
        current_password2: state.global_forms.current_password2,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    globalActionsFormUpdate,
    globalFormsClearAll,
    globalFormsClear_UsernameSuccess,
    upgradeToAgentCheckUsernameSubmit,
    upgradeToAgentSubmit,
})(UpgradeToAgentComponent);
