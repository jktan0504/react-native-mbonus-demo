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
import UserWalletList from '../../parts/UserWalletList/UserWalletList';
import { changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getAllTrans_MWallet_1, getAllTrans_RWallet_2, getAllTrans_SWallet_3,
    getAllTrans_BWallet_4,
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserWalletFilterResultComponent extends Component {

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
            WALLET_STATEMENT: this.props.navigation.getParam('WALLET_STATEMENT', ''),
            WALLET_CREDITS: this.props.navigation.getParam('WALLET_CREDITS', ''),
            WALLET_ACTION_ID: this.props.navigation.getParam('WALLET_ACTION_ID', ''),
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();

        switch (this.state.WALLET_ACTION_ID) {
            case 1:
                this.getTrans1_MWallet(
                    this.state.start_items,
                    this.state.fetch_length
                );
                break;
            case 2:
                this.getTrans2_RWallet(
                    this.state.start_items,
                    this.state.fetch_length
                );
                break;
            case 3:
                this.getTrans3_SWallet(
                    this.state.start_items,
                    this.state.fetch_length
                );
                break;
            case 4:
                this.getTrans4_BWallet(
                    this.state.start_items,
                    this.state.fetch_length
                );
                break;
            default:
                break;
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

    getTrans1_MWallet = (start_item, fetch_length,) => {
        const submitParams = {
            start_item,
            fetch_length,
            filter_created_after_date: this.state.StartDateText,
            filter_created_before_date: this.state.EndDateText,
        };

        getAllTrans_MWallet_1(submitParams)
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

    getTrans2_RWallet = (start_item, fetch_length,) => {
        const submitParams = {
            start_item,
            fetch_length,
            filter_created_after_date: this.state.StartDateText,
            filter_created_before_date: this.state.EndDateText,
        };

        getAllTrans_RWallet_2(submitParams)
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

    getTrans3_SWallet  = (start_item, fetch_length,) => {
        const submitParams = {
            start_item,
            fetch_length,
            filter_created_after_date: this.state.StartDateText,
            filter_created_before_date: this.state.EndDateText,
        };

        getAllTrans_SWallet_3(submitParams)
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

    getTrans4_BWallet  = (start_item, fetch_length,) => {
        const submitParams = {
            start_item,
            fetch_length,
            filter_created_after_date: this.state.StartDateText,
            filter_created_before_date: this.state.EndDateText,
        };

        getAllTrans_BWallet_4(submitParams)
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

    getAllMerchantListService = (start_item, fetch_length) => {
        const submitParams = {
            start_item,
            fetch_length
        };

        getAllMerchantList(submitParams)
            .then((allMerchantLists) => {
                this.setState({
                  merchantLists: this.state.page_loading ===  1 ? allMerchantLists.data : [...this.state.merchantLists, ...allMerchantLists.data],
                  isRefreshing: false,
                  isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    merchantLists: []
                });
            });
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

            switch (this.state.WALLET_ACTION_ID) {
                case 1:
                    this.getTrans1_MWallet(
                        this.state.start_items,
                        this.state.fetch_length
                    );
                    break;
                case 2:
                    this.getTrans2_RWallet(
                        this.state.start_items,
                        this.state.fetch_length
                    );
                    break;
                case 3:
                    this.getTrans3_SWallet(
                        this.state.start_items,
                        this.state.fetch_length
                    );
                    break;
                case 4:
                    this.getTrans4_BWallet(
                        this.state.start_items,
                        this.state.fetch_length
                    );
                    break;
                default:
                    break;
            }
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
                        <UserWalletList
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
})(UserWalletFilterResultComponent);
