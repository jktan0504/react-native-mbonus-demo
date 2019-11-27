import React, {Component} from 'react';
import { Platform, Dimensions, TouchableOpacity, View, ScrollView,
    Image, KeyboardAvoidingView
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Container, Content, Text, Item, Input, Button, Form
} from 'native-base';
import { connect } from 'react-redux';
import { usernameTypingChanged, passwordTypingChanged, userLoginSubmit
} from '../../../../controllers/actions';
import { MBonusSpinner } from '../../../commons/Spinner';


// localize
import { strings } from '../../../../../locales/i18n';
// Colors
import { CLR_TIFFANY_BLUE, CLR_WHITE, CLR_BLACK, CLR_DARK_TIFFANY_BLUE
} from '../../../../utility/constants';

class LoginComponent extends Component {

    componentDidUpdate() {
        if(this.props.user_access_token) {
            this.refs.toast.show('Login Success', DURATION.LENGTH_LONG);
            setTimeout(() => {
                this.props.navigation.navigate('MainAuthRouter')
            }, 1000);

        }

        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
        }
    }

    onUserNameTypingChangedText(text) {
        this.props.usernameTypingChanged(text);
    }

    onPasswordTypingChangedText(text) {
        this.props.passwordTypingChanged(text);
    }

    onUserLoginSubmit() {
        const { username, password } = this.props;
        this.props.userLoginSubmit({ username, password });
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

    renderToastMsg() {
        if (this.props.user_access_token) {
            return (
                <View
                    style={styles.ToastViewContainerStyle}
                >
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'red'}}
                        position='top'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{color:'red'}}
                    />
                </View>
            );
        }
    }

    render() {
        const { topSectionStyle, topSectionBGImgStyle, btmSectionStyles,
                mainFormContainerStyle, inputTextFieldContainerStyle,
                inputTextFieldImgIconStyle, inputTextFieldStyle,
                forgetPasswordContainerStyle, loginBtnContainerStyle,
                loginBtnStyle, registerTextContainerStyle,
                donHaveAccountTextContainerStyle, donHaveAccountTextStyle,
                donHaveAccountRegisterTextStyle,
        } = styles;

        return (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <ScrollView>

                    <View style={topSectionStyle} >
                        <Image
                        source={require('../../../../assets/images/login/login_top_section_bg.png')}
                          style={topSectionBGImgStyle}
                        />
                    </View>
                    <View style={btmSectionStyles} >
                        <Form style={mainFormContainerStyle} >
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Image
                                source={require('../../../../assets/images/login/ic_email_login.png')}
                                  style={inputTextFieldImgIconStyle}
                                />
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('login.username')}
                                    style={inputTextFieldStyle}
                                    onChangeText={this.onUserNameTypingChangedText.bind(this)}
                                    value={this.props.username}
                                />
                            </Item>
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Image
                                source={require('../../../../assets/images/login/ic_password_login.png')}
                                  style={inputTextFieldImgIconStyle}
                                />
                                <Input
                                    secureTextEntry
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('login.password')}
                                    style={inputTextFieldStyle}
                                    onChangeText={this.onPasswordTypingChangedText.bind(this)}
                                    value={this.props.password}
                                />
                            </Item>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ForgetPassword_Route')}
                            >
                                <Text style={forgetPasswordContainerStyle}>
                                    {strings('login.forget_password')}
                                </Text>
                            </TouchableOpacity>
                            <Item style={loginBtnContainerStyle}>
                                <Button
                                    rounded
                                    style={loginBtnStyle}
                                    onPress={this.onUserLoginSubmit.bind(this)}
                                >
                                    <Text>{strings('login.login')}</Text>
                                </Button>
                            </Item>
                            <Item style={donHaveAccountTextContainerStyle}>
                                <View style={registerTextContainerStyle}>
                                    <Text
                                        style={donHaveAccountTextStyle}
                                    >
                                        {strings('login.dont_have_account')}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Register_Route')}
                                    >
                                        <Text style={donHaveAccountRegisterTextStyle}>
                                            {strings('register.register')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Item>
                            <Item style={donHaveAccountTextContainerStyle}>
                                <View style={registerTextContainerStyle}>
                                    <Text
                                        style={donHaveAccountTextStyle}
                                    >
                                        {strings('login.mbonus_copyrights')}
                                    </Text>
                                </View>
                            </Item>

                        </Form>
                    </View>
                    { this.renderSpinner() }
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'black'}}
                        position='bottom'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}

                    />
                </ScrollView>
                </KeyboardAvoidingView>
        );
    }
}

const styles = {
    topSectionStyle: {
        height: ((Dimensions.get('window').height) / 5) * 3,
        width: Dimensions.get('window').width,
        backgroundColor: CLR_TIFFANY_BLUE,
    },
    topSectionBGImgStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null
    },
    btmSectionStyles: {
        height: ((Dimensions.get('window').height) / 6) * 2.8,
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: CLR_TIFFANY_BLUE
    },
    mainFormContainerStyle: {
        flex: 1,
    },
    inputTextFieldContainerStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: CLR_WHITE,
        marginTop: 10,
        marginLeft: 45,
        marginRight: 45,
        height: 35,
    },
    inputTextFieldImgIconStyle: {
        width: 25,
        height: 25
    },
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    forgetPasswordContainerStyle: {
        paddingTop: 3,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    loginBtnContainerStyle: {
        marginTop: 10,
        marginLeft: 40,
        marginRight: 40,
        borderBottomWidth: 0,
    },
    loginBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 35,
    },
    registerTextContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    donHaveAccountTextContainerStyle: {
        marginTop: 2,
        marginLeft: 40,
        marginRight: 40,
        marginBotton: 50,
        borderBottomWidth: 0,
    },
    donHaveAccountTextStyle: {
        fontSize: 12,
    },
    donHaveAccountRegisterTextStyle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
    },
    compDetailsTextStyle: {

    },
    ToastViewContainerStyle: {
        position: 'absolute',
        marginTop: Dimensions.get('window').height / 3,
        marginLeft: Dimensions.get('window').width / 2.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
};

const mapStateToProps = state => {
    return {
        username: state.auth_login.username,
        password: state.auth_login.password,
        user_access_token: state.auth_login.user_access_token,
        loading: state.auth_login.loading,
        errorMsg: state.auth_login.errorMsg,
    };
};

export default connect(mapStateToProps, {
    usernameTypingChanged,
    passwordTypingChanged,
    userLoginSubmit
 })(LoginComponent);
