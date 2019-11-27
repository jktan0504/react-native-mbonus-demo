import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, FlatList } from 'react-native';
import CardView from 'react-native-cardview';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_MORE_DARK_GREY
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import MerchantList from '../../parts/MerchantList/MerchantList';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization,
    merchantClearFilterOptionSelected,
} from '../../../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { getAllQueriesMerchantList,
} from '../../../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class MerchantSearchResultComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            userLogin: false,
            user_access_token: '',
            page_loading: 1,
            start_items: 0,
            fetch_length: 400,
            merchantLists: [],
            isLoading: true,
            isRefreshing: false,
            emptyEndOfSearch: false,
            countryName: this.props.navigation.getParam('selectedCountryName', ''),
            StateName: this.props.navigation.getParam('selectedStateName', ''),
            AreaName: this.props.navigation.getParam('selectedAreaName', ''),
            NOBName: this.props.navigation.getParam('selectedNobName', ''),
            selected_country_id: this.props.navigation.getParam('selected_country_id', ''),
            selected_state_id: this.props.navigation.getParam('selected_state_id', ''),
            selected_area_id: this.props.navigation.getParam('selected_area_id', ''),
            selected_nob_id: this.props.navigation.getParam('selected_nob_id', ''),
            merchantQuriesString: this.props.navigation.getParam('merchant_filer_string', ''),
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        const { selected_country_id, selected_state_id, selected_area_id, selected_nob_id,
            merchantQuriesString
        } = this.state;

        tokenManagerCheckLogin()
            .then(res => this.setState({ userLogin: res }))
            .catch(err => alert("An error occurred"));
        tokenManagerGetAccessToken()
            .then(res => this.setState({ user_access_token: res }))
            .catch(err => alert("An error occurred"));
        this.getAllMerchantListService(
            this.state.start_items,
            this.state.fetch_length,
            selected_country_id,
            selected_state_id,
            selected_area_id,
            selected_nob_id,
            merchantQuriesString,

        );
        console.log('from result string is: ');
        console.log(this.props.navigation.getParam('merchant_filer_string', '1'));
    }

    getAllMerchantListService = (
        start_item, fetch_length,
        country_id, state_id, area_id, nob_id, merchant_name
    ) => {
        console.log(`startItem: ${start_item}`);

        const submitParams = {
            start_item,
            fetch_length,
            filter_country_id: country_id,
            filter_country_location_id: state_id,
            filter_country_location_id_2: area_id,
            filter_nature_of_business: nob_id,
            filter_name: merchant_name
        };

        getAllQueriesMerchantList(submitParams)
            .then((allMerchantLists) => {
                console.log('finish get All Merchant');
                console.log(allMerchantLists);
                if (allMerchantLists.recordsFiltered > 0) {
                    this.setState({
                      merchantLists: this.state.page_loading ===  1 ? allMerchantLists.data : [...this.state.merchantLists, ...allMerchantLists.data],
                      isRefreshing: false,
                      isLoading: false,
                    });
                }
                else {
                    console.log('Found empty, now go to pagination');
                    if (start_item < allMerchantLists.recordsTotal) {
                        this.handlePaginationLoadMoreMerchantList();
                    }
                    else {
                        this.setState({
                            emptyEndOfSearch: true,
                            isRefreshing: false,
                            isLoading: false,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    emptyEndOfSearch: true,
                    isRefreshing: false,
                    isLoading: false,
                    // merchantLists: []
                });
            });
    }

    handleRefresh = () => {
        this.setState({
          seed: this.state.seed + this.state.results,
          isRefreshing: true,
        }, () => {
            console.log('seed is increasing: ${this.state.seed}');
          this.loadUsers();
        });
    };

    handlePaginationLoadMoreMerchantList = () => {
        const { selected_country_id, selected_state_id, selected_area_id, selected_nob_id,
            merchantQuriesString
        } = this.state;

        console.log('pagingation is running');

        this.setState({
            page_loading: this.state.page_loading + 1,
            start_items: ((this.state.page_loading) * this.state.fetch_length)
                               + this.state.page_loading,
            isLoading: true,

        }, () => {


            this.getAllMerchantListService(
                this.state.start_items,
                this.state.fetch_length,
                selected_country_id,
                selected_state_id,
                selected_area_id,
                selected_nob_id,
                merchantQuriesString,
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

    renderMerchantResultQueriesText() {
        const { countryName, StateName, AreaName, NOBName,
            merchantQuriesString
        } = this.state;

        let quriesString = '';

        if (countryName !== null && countryName !== '') {
            quriesString += `" ${countryName} "  `;
        }
        if (StateName !== null && StateName !== '') {
            quriesString += `" ${StateName} "  `;
        }
        if (AreaName !== null && AreaName !== '') {
            quriesString += `" ${AreaName} "  `;
        }
        if (NOBName !== null && NOBName !== '') {
            quriesString += `" ${NOBName} " `;
        }
        if (merchantQuriesString) {
            quriesString += `" ${merchantQuriesString} " `;
        }

        return quriesString;
    }

    renderMerchantResultContent() {
        if (this.state.emptyEndOfSearch) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>
                        {strings('merchant.merchant_search_result_no_found')}
                    </Text>
                </View>
            );
        }
        else {
            return (
                <MerchantList
                    navigation={this.props.navigation}
                    merchantLists={this.state.merchantLists}
                    handleRefresh={this.handleRefresh}
                    handlePagination={this.handlePaginationLoadMoreMerchantList}
                    isRefreshing={this.state.isRefreshing}
                />
            );
        }
    }

    goBackNClear() {
        this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }

    render() {
        const { userLogin, user_access_token, merchantLists, isRefreshing } = this.state;
        const { merchantMainContainer, merchantTopBtnViewStyle, merchantTopBtnStyle,
              merchantAroundMeIconStyle, merchantTopBtnTextStyle, merchantQuriesTextStyle,

        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('picker.search_result')}
                    goBackAction={() => this.goBackNClear()}
                />
                <View style={{ flex: 0.2, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantTopBtnStyle}
                            onPress={this.handlePaginationLoadMoreMerchantList.bind(this)}
                        >
                            <View style={{ flex: 0.3, }}>
                            <Icon>
                                <Image
                                    source={require('../../../../../../assets/images/merchant/merchant_around_me.png')}
                                    style={merchantAroundMeIconStyle}
                                />
                            </Icon>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text
                                    style={merchantTopBtnTextStyle}
                                >
                                    {strings('picker.search_result')}
                                </Text>
                            </View>

                        </Button>
                    </Item>
                    <Item style={merchantTopBtnViewStyle}>
                        <Text
                            style={merchantQuriesTextStyle}
                        >
                            {this.renderMerchantResultQueriesText()}
                        </Text>
                    </Item>
                </View>
                <View style={{ flex: 0.8, paddingTop: 15 }}>
                    {this.renderMerchantResultContent()}
                </View>
                { this.renderSpinner() }
            </Container>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: 'white'
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
    merchantQuriesTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: CLR_MORE_DARK_GREY,
    },

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization,
    merchantClearFilterOptionSelected,
 })(MerchantSearchResultComponent);
