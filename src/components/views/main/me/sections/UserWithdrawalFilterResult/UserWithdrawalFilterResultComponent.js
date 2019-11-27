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
import UserWithdrawalList from '../../parts/UserWithdrawalList/UserWithdrawalList';
import { changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getAllTrans_Withdrawal
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserWithdrawalFilterResultComponent extends Component {

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
            transactionLists: [],
            StartDateText: this.props.navigation.getParam('StartDateText', ''),
            EndDateText: this.props.navigation.getParam('EndDateText', ''),
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
        console.log('running withdrwal resul');
        this.getTrans_Withdrawal(
            this.state.start_items,
            this.state.fetch_length
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

    getTrans_Withdrawal = (start_item, fetch_length,) => {
        console.log('running getTrans_Withdrawal');
        const submitParams = {
            start_item,
            fetch_length,
            filter_created_after_date: this.state.StartDateText,
            filter_created_before_date: this.state.EndDateText,
        };

        getAllTrans_Withdrawal(submitParams)
            .then((allTransactions) => {
                this.setState({
                  transactionLists: this.state.page_loading ===  1 ? allTransactions.data : [...this.state.transactionLists, ...allTransactions.data],
                  isRefreshing: false,
                  isLoading: false,
                });
                console.log(allTransactions);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    transactionLists: []
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
            // this.loadUsers();
        });
    };


    handlePaginationLoadMoreTransactionList = () => {
        console.log('pagination is running');
        this.setState({
            page_loading: this.state.page_loading + 1,
            start_items: ((this.state.page_loading) * this.state.fetch_length)
                               + this.state.page_loading,
            isLoading: true,

        }, () => {

            this.getTrans_Withdrawal(
                this.state.start_items,
                this.state.fetch_length
            );
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


    render() {

        const { merchantMainContainer
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('filter.result')}
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/me/wallet_filter_bg.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <View
                        style={{ flex: 1 }}
                    >
                        <UserWithdrawalList
                            navigation={this.props.navigation}
                            transactionList={this.state.transactionLists}
                            handleRefresh={this.handleRefresh}
                            handlePagination={this.handlePaginationLoadMoreTransactionList}
                            isRefreshing={this.state.isRefreshing}
                        />

                    </View>
                </ImageBackground>
                { this.renderSpinner() }

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
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
})(UserWithdrawalFilterResultComponent);
