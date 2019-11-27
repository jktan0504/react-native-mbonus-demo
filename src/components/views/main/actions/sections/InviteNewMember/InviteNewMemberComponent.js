import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, Linking, Clipboard, Share
} from 'react-native';
import { ShareDialog, ShareButton, ShareApi } from 'react-native-fbsdk';
import moment from 'moment';
import QRCode from 'react-native-qrcode';
import { captureScreen } from 'react-native-view-shot';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_DARK_GREY, CLR_SHINE_BLUE,
    CLR_MORE_LIGHT_GREY, ASYNCTORAGE_USER_DETAILS, CLR_FB, CLR_TWITTER, CLR_WHATSAPP,
    CLR_TELEGRAM, CLR_RED
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';

import { changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

// Build up a shareable link.
const shareModel = {
  contentType: 'link',
  contentUrl: "https://facebook.com",
  contentDescription: 'Wow, check out this great site!',
};


class InviteNewMemberComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            imageURI: '',
            user_invited_link: '',
            invite_email: '',
            invited_title: '',
            invited_body: `For more information, please login to our apps\n\n\n<a href="${DOMAIN_URL}">${DOMAIN_URL}</a>`,
            shareLinkContent: {
                          contentType: 'link',
                          contentUrl: 'https://www.facebook.com',
                          contentDescription: 'Wow, check out this great site!',
                        }
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getInitialUserDataFromLocalDB();
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
                    const parse_userData = JSON.parse(localStorageData);
                    const INVITED_FULL_LINK = `${DOMAIN_URL}/share/${parse_userData.username}/${moment().unix()}/?referral=${parse_userData.username}`;

                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: true,
                        user_invited_link: INVITED_FULL_LINK,
                        invited_title: `[Invitation] You 're invited by ${parse_userData.username} !`,
                        invited_body: `For more information, please login to our apps\n\n\n<a href="${INVITED_FULL_LINK}">MBONUS ASIA</a>`,
                        shareLinkContent: {
                                      contentType: 'link',
                                      contentUrl: INVITED_FULL_LINK,
                                      contentDescription:`For more information, please login to our apps\n\n\n<a href="${INVITED_FULL_LINK}">MBONUS ASIA</a>`,
                                    }
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
                const user_details = UserFullDetails.data.user;
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

    captureScreenFunction = () => {
        captureScreen({
          format: "jpg",
          quality: 0.8
        })
        .then(
          uri => { this.setState({ imageURI: uri }); this.refs.toast.show(`Saved ${uri}`, DURATION.LENGTH_SHORT);},
          error => console.error("Oops, Something Went Wrong", error)
        );

    }

    getAndSetUpdatedData = (user_details) => {
        AsyncStorage.setItem(ASYNCTORAGE_USER_DETAILS, JSON.stringify(user_details));
        this.setState({
            userDetails: user_details,
            loading: false,
        });
    }

    onEmailTextChanged = (text) => {
        this.setState({
            invite_email: text,
        });
    }

    emailInvitedAction() {
        Linking.openURL(`mailto:${this.state.invite_email}?subject=${this.state.invited_title}&body=${this.state.invited_body}`).then((data) => {
            console.log('open whatsapp')
            }).catch(() => {
            console.log('App not installed')
            });
            /*
        Linking.openURL(`mailto:${this.state.invite_email}?subject=${this.state.invited_title}&body=${this.state.invited_body}`);*/
    }

    checkLinkUrl(url) {
        Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
              } else {
                return Linking.openURL(url);
              }
        }).catch(err => console.error('An error occurred', err));
    }

    copyToClipBoardAction() {
        Clipboard.setString(this.state.user_invited_link);
        this.refs.toast.show(strings('actions.invite_sharelink_copied'), DURATION.LENGTH_SHORT);
    }

    _fbSharedInvitedAction = () => {
        console.log('FB Pressed');

        var tmp = this;
      ShareDialog.canShow(this.state.shareLinkContent).then(
        function(canShow) {
          if (canShow) {
            return ShareDialog.show(tmp.state.shareLinkContent);
          }
        }
      ).then(
        function(result) {
          if (result.isCancelled) {
            //alert('Share cancelled');
          } else {
            // alert('Share success!!');
          }
        },
        function(error) {
          alert('Share fail with error: ' + error);
        }
      );
       /*
        ShareDialog.canShow(shareContent).then((canShow) => {
          canShow && ShareDialog.show(shareContent);
      }*/
    }

    whatsappSharedInvitedAction() {
        let url = `whatsapp://send?text=${this.state.invited_body}`;
        Linking.openURL(url).then((data) => {
            console.log('open whatsapp')
            }).catch(() => {
            this.refs.toast.show('Whatsapp Not Installed', DURATION.LENGTH_SHORT);
            });
    }

    twitterSharedInvitedAction() {
        let url = `https://twitter.com/share?url=${this.state.user_invited_link}&hashtags=IPIAM&target=blank`;
        Linking.openURL(url).then((data) => {
            //console.log('open whatsapp')
            }).catch(() => {
            this.refs.toast.show('Twitter Not Installed', DURATION.LENGTH_SHORT);
            });
    }

    telegramSharedInvitedAction() {
        let url = `https://t.me/share/url?url=${this.state.user_invited_link}&hashtags=IPIAM&target=blank`;
        Linking.openURL(url).then((data) => {
            console.log('open telegram')
            }).catch(() => {
            this.refs.toast.show('Telegram Not Installed', DURATION.LENGTH_SHORT);
            });
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
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


    render() {

        const { merchantMainContainer, mainViewContainerStyle, titleTextStyle,
            roundedRowBtnViewStyle, myButtonStyle, myButtonTextStyle, inputTextFieldStyle,
             itemRowContainerStyle, hairlineStyle, hairLineTextStyle, socialIconstyle,
             socialTextstyle, roundedRowLessPaddingBtnViewStyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('actions.invite_new_member')}
                    goBackAction={() => this.goBackNClear()}
                />
                <Content>
                    <View style={mainViewContainerStyle}>
                        <View  style={{ flex: 1, alignItems: 'center', padding: 20 }}>
                            <Text style={titleTextStyle}>
                                {strings('actions.invite_new_member')}
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 0.7,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_SHINE_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,

                                 }}
                                >
                                        <Input
                                            autoCapitalize={'none'}
                                            multiline
                                            autoCorrect={false}
                                            placeholder={strings('actions.invite_email')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text => this.onEmailTextChanged(text)}
                                            value={this.state.invite_email}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 0.3 }}
                                        onPress={this.emailInvitedAction.bind(this)}
                                    >

                                        <View style={myButtonStyle}>
                                            <Text style={myButtonTextStyle}>
                                                {strings('actions.invite_emailBtn')}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </Item>
                        </View>
                        <Item style={itemRowContainerStyle}>
                            <View style={hairlineStyle} />
                            <Text
                                style={hairLineTextStyle}
                            >
                                {strings('actions.invite_or')}
                            </Text>
                            <View style={hairlineStyle} />
                        </Item>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'column'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_SHINE_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,

                                 }}
                                >
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            multiline
                                            autoCorrect={false}
                                            placeholder={strings('actions.invite_email')}
                                            style={inputTextFieldStyle}
                                            value={this.state.user_invited_link}
                                        />
                                    </View>

                                </View>
                            </Item>

                            <Item style={roundedRowLessPaddingBtnViewStyle}>
                                <Button
                                    style={{ flex: 1,
                                    backgroundColor: CLR_DARK_GREY, }}
                                    onPress={this.copyToClipBoardAction.bind(this)}
                                >
                                    <View style={{ flex: 1, alignItems: 'center'}}>
                                        <Text
                                        >
                                            {strings('actions.invite_sharelink_copy')}
                                        </Text>
                                    </View>

                                </Button>
                            </Item>

                        </View>

                        <Item style={itemRowContainerStyle}>
                            <View style={hairlineStyle} />
                            <Text
                                style={hairLineTextStyle}
                            >
                                {strings('actions.invite_or')}
                            </Text>
                            <View style={hairlineStyle} />
                        </Item>

                        <Item style={roundedRowBtnViewStyle}>
                            <Button
                                style={{ flex: 1,
                                backgroundColor: CLR_FB, }}
                                onPress={this._fbSharedInvitedAction.bind(this)}
                            >
                                <View
                                    style={{
                                        flex: 0.1,
                                        justifyContent: 'center',
                                        paddingTop: 10
                                    }}
                                >
                                    <Icon>
                                        <Image
                                            source={require('../../../../../../assets/images/merchant/fb_icon.png')}
                                            style={socialIconstyle}
                                        />
                                    </Icon>
                                </View>
                                <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                    <Text
                                        style={socialTextstyle}
                                    >
                                        {strings('actions.invite_fb')}
                                    </Text>
                                </View>

                            </Button>


                        </Item>

                        <Item style={roundedRowLessPaddingBtnViewStyle}>
                            <Button
                                style={{ flex: 1,
                                backgroundColor: CLR_WHATSAPP, }}
                                onPress={this.whatsappSharedInvitedAction.bind(this)}
                            >
                                <View
                                    style={{
                                        flex: 0.1,
                                        justifyContent: 'center',
                                        paddingTop: 10
                                    }}
                                >
                                    <Icon>
                                        <Image
                                            source={require('../../../../../../assets/images/merchant/whatspp_icon.png')}
                                            style={socialIconstyle}
                                        />
                                    </Icon>
                                </View>
                                <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                    <Text
                                        style={socialTextstyle}
                                    >
                                        {strings('actions.invite_whatsapp')}
                                    </Text>
                                </View>

                            </Button>
                        </Item>

                        <Item style={roundedRowLessPaddingBtnViewStyle}>
                            <Button
                                style={{ flex: 1,
                                backgroundColor: CLR_TWITTER, }}
                                onPress={this.twitterSharedInvitedAction.bind(this)}
                            >
                                <View
                                    style={{
                                        flex: 0.1,
                                        justifyContent: 'center',
                                        paddingTop: 10
                                    }}
                                >
                                    <Icon>
                                        <Image
                                            source={require('../../../../../../assets/images/merchant/twitter.png')}
                                            style={socialIconstyle}
                                        />
                                    </Icon>
                                </View>
                                <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                    <Text
                                        style={socialTextstyle}
                                    >
                                        {strings('actions.invite_twitter')}
                                    </Text>
                                </View>

                            </Button>
                        </Item>

                        <Item style={roundedRowLessPaddingBtnViewStyle}>
                            <Button
                                style={{ flex: 1,
                                backgroundColor: CLR_TELEGRAM, }}
                                onPress={this.telegramSharedInvitedAction.bind(this)}
                            >
                                <View
                                    style={{
                                        flex: 0.1,
                                        justifyContent: 'center',
                                        paddingTop: 10
                                    }}
                                >
                                    <Icon>
                                        <Image
                                            source={require('../../../../../../assets/images/merchant/telegram.png')}
                                            style={socialIconstyle}
                                        />
                                    </Icon>
                                </View>
                                <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                    <Text
                                        style={socialTextstyle}
                                    >
                                        {strings('actions.invite_telegram')}
                                    </Text>
                                </View>

                            </Button>
                        </Item>

                        <Item style={itemRowContainerStyle}>
                            <View style={hairlineStyle} />
                            <Text
                                style={hairLineTextStyle}
                            >
                                {strings('actions.invite_or')}
                            </Text>
                            <View style={hairlineStyle} />
                        </Item>

                        <Item style={roundedRowBtnViewStyle}>
                            <View style={{ flex: 1, flexDirection: 'column'}}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        borderWidth: 2,
                                        borderColor: CLR_TWITTER,
                                        marginRight: 10,
                                        borderRadius: 5,
                                        backgroundColor: CLR_TWITTER,
                                        padding: 10
                                }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {strings('actions.invited_qrcode')}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            paddingTop: 10,
                                            color: CLR_RED
                                        }}
                                    >
                                        {this.state.userDetails.username}
                                    </Text>

                                    <View
                                        style={{
                                            flex: 1, marginTop: 10, padding: 10,
                                            justifyContent: 'center', alignItems: 'center'
                                        }}
                                    >
                                        <QRCode
                                            value={this.state.user_invited_link}
                                            size={Dimensions.get('window').width / 1.3}
                                            bgColor='#000'
                                            fgColor='#fff'
                                        />
                                    </View>

                                    <Item style={roundedRowLessPaddingBtnViewStyle}>
                                        <Button
                                            style={{ flex: 1,
                                            backgroundColor: CLR_DARK_GREY, }}
                                            onPress={this.captureScreenFunction.bind(this)}
                                        >
                                            <View style={{ flex: 1, alignItems: 'center'}}>
                                                <Text
                                                >
                                                    {strings('actions.invite_qrcode_download')}
                                                </Text>
                                            </View>

                                        </Button>
                                    </Item>

                                </View>

                            </View>
                        </Item>

                    </View>
                </Content>
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
        color: CLR_BLACK,
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
    roundedRowLessPaddingBtnViewStyle: {
        flex: 1,
        borderBottomWidth: 0,
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
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
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5,
    },
    itemRowContainerStyle: {
        marginTop: 25,
        marginBottom: 25,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0,
        justifyContent: 'space-around',
    },
    hairlineStyle: {
        backgroundColor: CLR_SHINE_BLUE,
        height: 2,
        width: 120
    },
    hairLineTextStyle: {
      fontFamily: 'AvenirNext-Bold',
      fontSize: 14,
      paddingHorizontal: 5,
      alignSelf: 'center',
      color: CLR_SHINE_BLUE
    },
    socialIconstyle: {
        width: 25,
        height: 25
    },
    socialTextstyle: {
        textAlign: 'center',
        color: CLR_WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
})(InviteNewMemberComponent);
