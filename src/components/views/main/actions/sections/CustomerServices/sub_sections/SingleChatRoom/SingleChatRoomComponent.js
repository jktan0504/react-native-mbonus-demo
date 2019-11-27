import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, FlatList,
    Linking, Platform, PermissionsAndroid, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Input, List,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_BLUE_GREY, CLR_DARK_GREY, CLR_MORE_DARK_GREY
} from '../../../../../../../../utility/constants';
import { GoBackHeader, CountryStateIcons, MerchantCard, CardSection } from '../../../../../../../commons';
import { MBonusSpinner } from '../../../../../../../commons/Spinner';
import SingleChatRoomList from '../../parts/SingleChatRoomList/SingleChatRoomList';
import { tokenManagerCheckLogin, globalActionsFormUpdate, changeSettingsLocalization,
    userCustomerServiceMsgSubmit, globalFormsClearAll,
} from '../../../../../../../../controllers/actions';
import { getMBonusAppLanguageSetting,
} from '../../../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getSingleChatRoomByID,
} from '../../../../../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../../../../../locales/i18n';

class SingleChatRoomComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            isLoading: true,
            isMounted: false,
            chatRoomDetailsList: [],
            chatRoomID: this.props.navigation.getParam('chatroom_id', ''),
            chatRoomTitle: this.props.navigation.getParam('chatroom_title', ''),
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getSingleChatRoomByIDService(this.props.navigation.getParam('chatroom_id'));
    }

    componentDidUpdate() {
        if(this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
            this.getSingleChatRoomByIDService(this.props.navigation.getParam('chatroom_id'));
            this.props.globalFormsClearAll();

        }
        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.setState({ isMounted: false });
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

    getSingleChatRoomByIDService(chatroom_id) {
        const submitParams = {
            chatroom_id
        };

        getSingleChatRoomByID(submitParams)
            .then((fullChatRoomDetails) => {
                this.setState({
                    chatRoomDetailsList: fullChatRoomDetails.data.model.chats
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    chatRoomDetailsList: []
                });
        });
    }

    submitSingleReplyService = () => {
        if (this.props.customer_service_msg) {
            const submitParams = {
                message: this.props.customer_service_msg,
                chatroom_id: this.props.navigation.getParam('chatroom_id'),
            };
            this.props.userCustomerServiceMsgSubmit(submitParams);
        }
        else {
            this.refs.toast.show(strings('actions.chat_room_warning'), DURATION.LENGTH_LONG);
        }
    }

    goBackNClear() {
        this.props.globalFormsClearAll();
        this.props.navigation.goBack();
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
        const { navigation } = this.props;

        const { chatRoomID } = this.state;
        const { merchantMainContainer
        } = styles;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={chatRoomID}
                    goBackAction={this.goBackNClear.bind(this)}
                />
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 0.9 }}>
                        <List style={{ flex: 1 }}>
                            <SingleChatRoomList
                                navigation={this.props.navigation}
                                singleChatRoomList={this.state.chatRoomDetailsList}
                                handleRefresh={this.handleRefresh}
                                isRefreshing={this.state.isRefreshing}
                            />
                        </List>
                    </View>

                    <View
                        style={{
                            flex: 0.1,
                            paddingLeft: 2,
                            paddingRight: 2,
                            padding: 5,
                            borderTopWidth: 1,
                            borderTopColor: CLR_DARK_TIFFANY_BLUE
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.78, alignItems: 'flex-start', padding: 10 }}>
                                <Input
                                    autoCapitalize={'none'}
                                    multiline
                                    autoCorrect={false}
                                    placeholder={strings('actions.enter_message')}
                                    style={{ fontSize: 16 }}
                                    onChangeText={text =>
                                        this.props.globalActionsFormUpdate({
                                            props: 'customer_service_msg',
                                            value: text,
                                    })}
                                    value={this.props.customer_service_msg}
                                />
                            </View>
                            <View style={{ flex: 0.22 }}>
                                <Button
                                    style={{ flex: 1 }}
                                    onPress={this.submitSingleReplyService.bind(this)}
                                >
                                    <Text>{strings('actions.enter_message_send')}</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
                {this.renderSpinner()}
                <Toast
                    ref="toast"
                    style={{ backgroundColor:'black' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}

                />
            </Container>
            </KeyboardAvoidingView>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: 'white',
        paddingBottom: 10
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
        height: 300,
        marginTop: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        customer_service_msg: state.global_forms.customer_service_msg,
        errorMsg: state.global_forms.errorMsg,
        successMsg: state.global_forms.successMsg,
        loading: state.global_forms.loading,
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization,
    globalActionsFormUpdate,
    userCustomerServiceMsgSubmit,
    globalFormsClearAll,
 })(SingleChatRoomComponent);
