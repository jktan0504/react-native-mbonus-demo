import React, {Component} from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, ListItem,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import MainHeader from '../../../commons/Header/MainHeader';
import { ASYNCTORAGE_USER_DETAILS, CLR_WHITE, CLR_LIGHT_GREY } from '../../../../utility/constants';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { getAuthUserDetails,
} from '../../../../utility/networking/MBonusAuthServices';
// localize
import { strings } from '../../../../../locales/i18n';

class ActionsMainComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = {
            userDetails: [],
        };
    }

    componentDidMount() {
        this.getInitialUserDataFromLocalDB();
    }

    getInitialUserDataFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: false,
                    });
                    console.log(this.state.userDetails);
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

    getAndSetUpdatedData = (user_details) => {
         AsyncStorage.setItem(ASYNCTORAGE_USER_DETAILS, JSON.stringify(user_details));
         this.setState({
             userDetails: user_details,
             loading: false,
         });
    }

    renderReferMerchantAction() {
        const { listItemStyle, bodyBtmPartStyle, titleTextStyle } = styles;

        if(this.state.userDetails.can_refer_new_merchant === 1) {
            return (
                <ListItem style={listItemStyle}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this.goToActions_ReferNewMerchant.bind(this)}
                    >
                    <Body style={bodyBtmPartStyle}>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../../../assets/images/actions/ic_action_refernewmerchant.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={titleTextStyle}>
                                {strings('actions.refer_new_merchant')}
                            </Text>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../../../assets/images/actions/ic_go_next.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </View>
                    </Body>
                    </TouchableOpacity>
                </ListItem>
            );
        }
    }

    renderCompanyRepresentativeAction() {
        const { listItemStyle, bodyBtmPartStyle, titleTextStyle } = styles;

        if(this.state.userDetails.can_refer_new_company_representative === 1) {
            return (
                <ListItem style={listItemStyle}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this.goToActions_compRepresentative.bind(this)}
                    >
                    <Body style={bodyBtmPartStyle}>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../../../assets/images/actions/ic_action_companyrepresentative.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </View>
                        <View style={{ flex: 0.8 }}>
                            <Text style={titleTextStyle}>
                                {strings('actions.company_representative')}
                            </Text>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../../../assets/images/actions/ic_go_next.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </View>
                    </Body>
                    </TouchableOpacity>
                </ListItem>
            );
        }
    }

    goToActions_InviteNewMember() {
        this.props.navigation.navigate('Actions_Sub_InviteNewMember', {
        });
    }

    goToActions_RegisterNewMember() {
        this.props.navigation.navigate('Actions_SubRegistereNewMember', {
        });
    }

    goToActions_UpgradeToAgent() {
        this.props.navigation.navigate('Actions_SubUpgradeToAgent', {
        });
    }

    goToActions_MeVoucherWithdrawal() {
        this.props.navigation.navigate('Actions_Sub_EVoucherWithdrawal', {
        });
    }

    goToActions_TransferEVoucher() {
        this.props.navigation.navigate('Actions_SubTransferEVouchert', {
        });
    }

    goToActions_CustomerService() {
        this.props.navigation.navigate('Actions_Sub_CompanyServiceMain', {
        });
    }

    goToActions_ReferNewMerchant() {
        this.props.navigation.navigate('Actions_Sub_ReferNewMerchant', {
        });
    }

    goToActions_compRepresentative() {
        this.props.navigation.navigate('Actions_Sub_CompanyRepresentative', {
        });
    }

    render() {
        const { merchantMainContainer, bodyBtmPartStyle, listItemStyle,
            titleTextStyle,
        } = styles;
        return (
            <Container>
                <MainHeader
                    navigation={this.props.navigation}
                />
                <Content style={merchantMainContainer}>
                    <View style={{ paddingTop: 10, marginBottom: 20 }}>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_InviteNewMember.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_invitenewmember.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.invite_new_member')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_RegisterNewMember.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_expandgroup.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.register_new_member')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_UpgradeToAgent.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_upgradetoagent.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.upgrade_to_agent')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_MeVoucherWithdrawal.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_mevoucherwithdrawal.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.m_evoucher_withdrawal')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_TransferEVoucher.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_transferevoucher.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.transfer_voucher')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        <ListItem style={listItemStyle}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this.goToActions_CustomerService.bind(this)}
                            >
                            <Body style={bodyBtmPartStyle}>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_action_customerservice.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ flex: 0.8 }}>
                                    <Text style={titleTextStyle}>
                                        {strings('actions.customer_service')}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/actions/ic_go_next.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                            </Body>
                            </TouchableOpacity>
                        </ListItem>
                        {this.renderReferMerchantAction()}
                        {this.renderCompanyRepresentativeAction()}
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: CLR_WHITE,
        paddingRight: 10,
    },
    listItemStyle: {
        borderBottomWidth: 1,
    },
    bodyBtmPartStyle: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        width: Dimensions.get('window').width / 1.2,
    },
    titleTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

};



const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization
 })(ActionsMainComponent);
