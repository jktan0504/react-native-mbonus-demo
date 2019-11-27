import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity,
} from 'react-native';
import CardView from 'react-native-cardview';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_DARK_BLUE,
} from '../../../../../../utility/constants';

import { MBonusSpinner } from '../../../../../commons/Spinner';
import ChatRoomList from './parts/ChatRoomList/ChatRoomList';
import { changeSettingsLocalization, customerServiceIsRefreshing,
} from '../../../../../../controllers/actions';
import { getALLChatRoomLists
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class CustomerServiceComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            page_loading: 1,
            start_items: 0,
            fetch_length: 20,
            isLoading: true,
            isRefreshing: false,
            allChatRoomsList: [],
            chatRoomFounded: true,
            StartDateText: this.props.navigation.getParam('StartDateText', ''),
            EndDateText: this.props.navigation.getParam('EndDateText', ''),
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
        this.getAllChatRoomListService();
    }

    componentDidUpdate() {
        if(this.props.isRefreshing === true) {
            this.props.customerServiceIsRefreshing(false);
            this.getAllChatRoomListService();
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

    getAllChatRoomListService = () => {

        getALLChatRoomLists()
            .then((allChatRooms) => {
                this.setState({
                  allChatRoomsList: allChatRooms.data,
                  isRefreshing: false,
                  isLoading: false,
                });

                if (this.state.allChatRoomsList.length < 0) {
                    this.setState({
                        chatRoomFounded: false,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    allChatRoomsList: []
                });
            });
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }

    handleRefresh = () => {
        this.setState({
          seed: this.state.seed + this.state.results,
          isRefreshing: true,
        }, () => {
            console.log('seed is increasing: ${this.state.seed}');
            this.getAllChatRoomListService();
        });
    };

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

    renderContentList() {
        if (this.state.chatRoomFounded === true) {
            return (
                <ChatRoomList
                    navigation={this.props.navigation}
                    chatRoomLists={this.state.allChatRoomsList}
                    handleRefresh={this.handleRefresh}
                    isRefreshing={this.state.isRefreshing}
                />
            );
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                >
                    <Text
                        style={{
                            flex: 1,
                            justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 'bold'}}
                    >
                        {strings('filter.empty_list')}
                    </Text>
                </View>
            );
        }
    }


    render() {

        const { merchantMainContainer, mainTitleTextStyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.goBackNClear()}
                        >
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{strings('actions.customer_service')}</Title>
                    </Body>
                    <Right>
                        <Button
                            transparent
                            onPress={()=> this.props.navigation.navigate('Actions_Sub_CompanyService_CreateNewChatRoom')}
                        >
                            <Icon name='add' />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    {this.renderContentList()}
                </View>
                { this.renderSpinner() }

            </Container>
        );
    }
}

const styles = {
    MBonusGoBackHeaderStyle: {
        backgroundColor: CLR_WHITE
    },
    MBonusGoBackTitleTextStyle: {
        color: CLR_BLACK
    },
    MBonusGoBackIconTextStyle: {
        color: CLR_DARK_BLUE
    },
    merchantMainContainer: {
        backgroundColor: 'white'
    },
    mainContentViewStyle: {
        paddingTop: 30,
        paddingBottom: 25,
        paddingRight: 5,
        paddingLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    mainTitleTextStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: CLR_WHITE,
        textAlign: 'center',
        paddingTop: 10,
    },
    datePickerContainerItemStyle: {
        marginTop: 20,
        marginLeft: 45,
        marginRight: 45,
        height: 45,
        width: Dimensions.get('window').width / 1.4,
        backgroundColor: CLR_WHITE,
        borderWidth: 2,
        paddingTop: 10,
    },
    subTitleContainerItemStyle: {
        marginTop: 20,
        marginLeft: 45,
        marginRight: 45,
        height: 45,
        borderColor: CLR_WHITE,
        borderWidth: 2,
        flexDirection: 'row',
    },
    subtitleTextStyle: {
        fontSize: 14,
        color: CLR_PRIMARY_DARK,
        paddingLeft: 5,
        paddingTop: 10,
    },
    creditTextStyle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: CLR_WHITE,
    },
    statementTextStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: CLR_WHITE,
        textAlign: 'center',
        paddingTop: 20,
        marginTop: 50,
    },
    datePickerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CLR_BLACK,

    },
    filterBtnStyle: {
        marginTop: 20,
        marginLeft: 45,
        marginRight: 45,
        height: 45,
        width: Dimensions.get('window').width / 1.4,
        backgroundColor: CLR_WHITE,
        borderWidth: 2,
        paddingTop: 10,
    },
    clearBtnStyle: {
        marginTop: 20,
        marginLeft: 45,
        marginRight: 45,
        height: 45,
        width: Dimensions.get('window').width / 1.4,
        backgroundColor: CLR_WHITE,
        borderWidth: 2,
        paddingTop: 10,
    },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        isRefreshing: state.global_forms.isRefreshing,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    customerServiceIsRefreshing,
})(CustomerServiceComponent);
