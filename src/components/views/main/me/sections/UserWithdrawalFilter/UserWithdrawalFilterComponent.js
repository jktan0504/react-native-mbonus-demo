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
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization
} from '../../../../../../controllers/actions';

import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserWithdrawalFilterComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            isLoading: false,
            isRefreshing: false,
            StartDateText: '',
            StartDateHolder: null,
            EndDateText: '',
            EndDateHolder: null,
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        const { WALLET_TITLE, WALLET_SUBTITLE, WALLET_STATEMENT, WALLET_CREDITS,
            WALLET_ACTION_ID
        } = this.state;

        this.getUserPrefLanguage();
        console.log(
            `From Filter Component: ==> ${WALLET_TITLE} ${WALLET_SUBTITLE}
            ${WALLET_STATEMENT} ${WALLET_CREDITS} ${WALLET_ACTION_ID}`
        );
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

    StartDatePickerMainFunctionCall = () => {

          let DateHolder = this.state.StartDateHolder;

          if(!DateHolder || DateHolder == null){

            DateHolder = new Date();
            this.setState({
              StartDateHolder: DateHolder
            });
          }

          //To open the dialog
          this.refs.StartDatePickerDialog.open({

            date: DateHolder,

          });
    }

    onStartDatePickedFunction = (date) => {
        this.setState({
          dobDate: date,
          StartDateText: moment(date).format('YYYY-MM-DD')
        });
    }

    EndDatePickerMainFunctionCall = () => {

          let DateHolder = this.state.EndDateHolder;

          if(!DateHolder || DateHolder == null){

            DateHolder = new Date();
            this.setState({
              EndDateHolder: DateHolder
            });
          }

          //To open the dialog
          this.refs.EndDatePickerDialog.open({

            date: DateHolder,

          });
    }

    onEndDatePickedFunction = (date) => {
        // const unixTimestamp = moment(date, 'DD-MMM-YYYY').unix();
        // console.log(unixTimestamp);
        this.setState({
          dobDate: date,
          EndDateText: moment(date).format('YYYY-MM-DD')
        });
    }

    resetAllDate() {
        this.setState({
          StartDateText: '',
          EndDateText: '',
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

    renderStartDateText() {
        if (this.state.StartDateText) {
            return this.state.StartDateText;
        }
        else {
            return strings('filter.start_date');
        }
    }

    renderEndDateText() {
        if (this.state.EndDateText) {
            return this.state.EndDateText;
        }
        else {
            return strings('filter.end_date');
        }
    }

    goToWalletRecordFilterResult() {
        const { StartDateText, EndDateText } = this.state;

        this.props.navigation.navigate('UserMe_Sub_Withdrawal_Filter_Result', {
            StartDateText,
            EndDateText,
        });
    }

    render() {

        const { merchantMainContainer, mainContentViewStyle, mainTitleTextStyle,
            subTitleContainerItemStyle, subtitleTextStyle, creditTextStyle,
            statementTextStyle, datePickerContainerItemStyle, filterBtnStyle,
            clearBtnStyle,
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('withdrawal.my_withdrawal')}
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/me/wallet_filter_bg.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content
                        style={{ flex: 1 }}
                    >
                        <View
                            style={mainContentViewStyle}
                        >
                            <Text
                                style={statementTextStyle}
                            >
                                {strings('withdrawal.my_withdrawal')}
                            </Text>
                            <Item rounded style={datePickerContainerItemStyle}>
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                   onPress={this.StartDatePickerMainFunctionCall.bind(this)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                           style={styles.datePickerText}>
                                           {this.renderStartDateText()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Item>

                            <Item rounded style={datePickerContainerItemStyle}>
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                   onPress={this.EndDatePickerMainFunctionCall.bind(this)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                           style={styles.datePickerText}>
                                           {this.renderEndDateText()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Item>

                            <Item rounded style={filterBtnStyle}>
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                   onPress={this.goToWalletRecordFilterResult.bind(this)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                           style={styles.datePickerText}>
                                           {strings('filter.filter_now')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Item>

                            <Item rounded style={clearBtnStyle}>
                                <TouchableOpacity
                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                   onPress={this.resetAllDate.bind(this)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text
                                           style={styles.datePickerText}>
                                           {strings('filter.reset')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Item>
                        </View>

                    </Content>
                </ImageBackground>
                { this.renderSpinner() }
                <DatePickerDialog
                    ref="StartDatePickerDialog"
                    onDatePicked={this.onStartDatePickedFunction.bind(this)}
                />
                <DatePickerDialog
                    ref="EndDatePickerDialog"
                    onDatePicked={this.onEndDatePickedFunction.bind(this)}
                />
            </Container>
        );
    }
}

const styles = {
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
        fontSize: 25,
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
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
})(UserWithdrawalFilterComponent);
