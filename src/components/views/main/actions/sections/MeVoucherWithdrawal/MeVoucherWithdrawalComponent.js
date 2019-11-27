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
    CLR_TELEGRAM, CLR_RED, CLR_TIFFANY_BLUE, CLR_LIGHT_GREY, ASYNCTORAGE_USER_BANK_REREFERENCE,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, globalFormsClearAll,
    globalFormUpdateBankOptionSelected, WithdrawalSubmit, globalActionsFormUpdate,
} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getBankOptions
} from '../../../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class MeVoucherWithdrawalComponent extends Component {

    constructor(props) {
        super(props);
        this.props.globalFormsClearAll();
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            confirmedWithdrawal: false,
            bank_options_list: [],
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getInitialUserDataFromLocalDB();
        this.getInitialBankNumberFromLocalDB();
        this.getAllAvaibleBankOptions();
    }

    componentDidUpdate() {

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

    getInitialBankNumberFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_BANK_REREFERENCE)
            .then(localStorageData => {
                if (localStorageData !== null) {
                    this.props.globalActionsFormUpdate({
                        props: 'bank_reference_number',
                        value: localStorageData,
                    })
                }
            })
            .catch(err => reject(err));
     });

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

    getAllAvaibleBankOptions = () => {
        console.log('bank is running');
        getBankOptions()
            .then((allbanks) => {
                console.log(allbanks);
                this.setState({
                    bank_options_list: allbanks.data.model,
                });
                console.log(allbanks);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    bank_options_list: [],
                });
            });
    }

    // Bank Selection
    onSelectedBankOptions(value) {
        this.props.globalFormUpdateBankOptionSelected(value);
        console.log(`selected phone ext id ${value}`);
    }

    goBackNClear() {
        this.props.globalFormsClearAll();
        this.props.navigation.goBack();
    }

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

    renderBankSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{ color: CLR_BLACK }}>{strings('actions.m_evoucher_bank')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Bank"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_BLACK }}
                              itemStyle={{
                                backgroundColor: "#d3d3d3",
                                marginLeft: 0,
                                paddingLeft: 10
                              }}
                              itemTextStyle={{ color: '#000' }}
                              style={countryLocationPickerStyle}
                              selectedValue={this.props.selected_bank_id}
                              onValueChange={this.onSelectedBankOptions.bind(this)}
                            >
                            {this.state.bank_options_list.map((member, key) => {

                                return (
                                     <Picker.Item
                                        label={this.state.user_pref_language === 'zh' ?
                                            member.name_cn : member.name_en
                                        }
                                        value={member.id}
                                        key={member.id}
                                    />
                                );
                            })}

                            </Picker>
                        </View>
                    </Button>
                </Item>

                </View>
            );
    }

    onSubmitWithdrawalServiceAction = () => {

        if (this.state.confirmedWithdrawal === true &&
            this.props.selected_bank_id && this.props.bank_reference_number &&
            this.props.current_password2
         ) {

            const submitParams = {
                i_confirm: 1,
                bank_id: this.props.selected_bank_id,
                national_id: this.state.userDetails.national_id,
                bank_account_number: this.props.bank_reference_number,
                amount: this.props.trans_m_amount,
                current_password2: this.props.current_password2,
            };
            AsyncStorage.setItem(ASYNCTORAGE_USER_BANK_REREFERENCE, this.props.bank_reference_number);
            this.props.WithdrawalSubmit(submitParams);

        }
        else {
                this.refs.toast.show(strings('actions.completed_confirm'), DURATION.LENGTH_LONG);
        }
    }


    render() {

        const { merchantMainContainer, titleTextStyle, socialIconstyle, roundedRowBtnViewStyle,
            inputTextFieldStyle, myButtonStyle, myButtonTextStyle, socialTextstyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('actions.m_evoucher_withdrawal')}
                    goBackAction={() => this.goBackNClear()}
                />
                <Content>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 30 }}>
                            <Text
                                style={titleTextStyle}
                            >
                                {strings('actions.m_evoucher_withdrawal')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 15 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 3,
                                            borderColor: CLR_TIFFANY_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Input
                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.m_evoucher_amount')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'trans_m_amount',
                                                    value: text,
                                            })}
                                            value={this.props.trans_m_amount}
                                        />
                                    </View>
                                </View>
                            </Item>
                            <Text
                                style={{ textAlign: 'center', fontSize: 14, color: CLR_BLACK }}
                            >
                                {strings('actions.m_evoucher_balance')}： <Text style={{ fontWeight: 'bold' }}>
                                {
                                    this.state.userDetails.credit_1
                                }
                                </Text>
                            </Text>
                        </View>

                        {this.renderBankSpinner()}

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 5 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 3,
                                            borderColor: CLR_TIFFANY_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.m_evoucher_amount')}
                                            style={inputTextFieldStyle}
                                            value={this.state.userDetails.national_id}
                                        />
                                    </View>
                                </View>
                            </Item>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 5 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 3,
                                            borderColor: CLR_TIFFANY_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.m_evoucher_amount')}
                                            style={inputTextFieldStyle}
                                            value={this.state.userDetails.name}
                                        />
                                    </View>
                                </View>
                            </Item>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', marginTop: 5 }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View style={{ flex: 1, flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 3,
                                            borderColor: CLR_TIFFANY_BLUE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Input

                                            autoCapitalize={'none'}
                                            keyboardType={'numeric'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.m_evoucher_bank_account_number')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'bank_reference_number',
                                                    value: text,
                                            })}
                                            value={this.props.bank_reference_number}
                                        />
                                    </View>
                                </View>
                            </Item>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Item style={roundedRowBtnViewStyle}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        borderWidth: 3,
                                        borderColor: CLR_TIFFANY_BLUE,
                                        marginRight: 10,
                                        borderRadius: 5,
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
                                {strings('actions.m_evoucher_wallet_password_rm')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column',}}>
                            <Item style={styles.itemRowContainerStyle}>
                                <CheckBox
                                    checked={this.state.confirmedWithdrawal}
                                    color="blue"
                                    onPress={() => this.setState({ confirmedWithdrawal: !this.state.confirmedWithdrawal })}
                                />
                                <Body style={{ paddingLeft: 10, marginLeft: 10 }}>
                                    <Text style={{ fontSize: 14, color: CLR_BLACK }}>{strings('actions.m_evoucher_cm_info')}</Text>
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
                                    onPress={this.onSubmitWithdrawalServiceAction.bind(this)}
                                >
                                    <View style={{ flex: 1, alignItems: 'center'}}>
                                        <Text
                                        >
                                            {strings('actions.confirm_txt')}
                                        </Text>
                                    </View>

                                </Button>
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
        backgroundColor: CLR_WHITE
    },
    mainViewContainerStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    titleTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: CLR_BLACK,
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
        backgroundColor: CLR_WHITE,
        borderWidth: 3,
        borderColor: CLR_TIFFANY_BLUE,
        marginRight: 10,
        borderRadius: 5,
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
        trans_m_amount: state.global_forms.trans_m_amount,
        current_password2: state.global_forms.current_password2,
        selected_bank_id: state.global_forms.selected_bank_id,
        bank_reference_number: state.global_forms.bank_reference_number,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    globalFormsClearAll,
    globalActionsFormUpdate,
    globalFormUpdateBankOptionSelected,
    WithdrawalSubmit,
})(MeVoucherWithdrawalComponent);
