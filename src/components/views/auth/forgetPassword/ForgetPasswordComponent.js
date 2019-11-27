import React, {Component} from 'react';
import { Platform, Dimensions, ScrollView, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Text, Item,
        Input, Left, Button, Icon, Body, Title, Right, Form
} from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import { usernameTypingChanged, userForgetPasswordSubmit
} from '../../../../controllers/actions';
import { MBonusSpinner } from '../../../commons/Spinner';
import { GoBackHeader } from '../../../commons';
// localize
import { strings } from '../../../../../locales/i18n';
// Colors
import { CLR_TIFFANY_BLUE, CLR_WHITE, CLR_BLACK, CLR_DARK_TIFFANY_BLUE, CLR_DARK_BLUE
} from '../../../../utility/constants';

class ForgetPasswordComponent extends Component {

    componentDidUpdate() {
        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
        }

        if (this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
        }
    }

    onUserNameTypingChangedText(text) {
        this.props.usernameTypingChanged(text);
    }

    onUserForgetPasswordSubmit() {
        const { username } = this.props;
        this.props.userForgetPasswordSubmit({ username });
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

    render() {
        const { topSectionStyle, topSectionBGImgStyle, btmSectionStyles,
                mainFormContainerStyle, inputTextFieldContainerStyle,
                inputTextFieldImgIconStyle, inputTextFieldStyle, resetBtnStyle,
                loginBtnContainerStyle,
                loginBtnStyle
        } = styles;

        return (
            <Container>
                <GoBackHeader
                    headerTitle={strings('forget_password.forget_password')}
                    goBackAction={() => this.props.navigation.goBack()}
                />
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

                            <Item style={loginBtnContainerStyle}>
                                <Button
                                    rounded
                                    style={resetBtnStyle}
                                    onPress={this.onUserForgetPasswordSubmit.bind(this)}
                                >
                                    <Text>{strings('forget_password.reset_password')}</Text>
                                </Button>
                            </Item>

                            <Item style={loginBtnContainerStyle}>
                                <Button
                                    rounded
                                    style={loginBtnStyle}
                                    onPress={() => this.props.navigation.goBack()}
                                >
                                    <Text>{strings('login.login')}</Text>
                                </Button>
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
            </Container>
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
    resetBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 35,
    },
    loginBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 35,
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
        loading: state.auth_login.loading,
        errorMsg: state.auth_login.errorMsg,
        successMsg: state.auth_login.successMsg
    };
};

export default connect(mapStateToProps, {
    usernameTypingChanged,
    userForgetPasswordSubmit
 })(ForgetPasswordComponent);
