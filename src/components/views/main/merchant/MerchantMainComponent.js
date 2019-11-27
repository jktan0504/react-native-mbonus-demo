import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, FlatList } from 'react-native';
import CardView from 'react-native-cardview';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL } from '../../../../utility/constants';
import MainHeader from '../../../commons/Header/MainHeader';
import MerchantList from './parts/MerchantList/MerchantList';
import { MBonusSpinner } from '../../../commons/Spinner';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { getAllMerchantList,
} from '../../../../utility/networking/MBonusAuthServices';

// localize
import { strings } from '../../../../../locales/i18n';

class MerchantMainCompomnent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            userLogin: false,
            user_access_token: '',
            page_loading: 1,
            start_items: 0,
            fetch_length: 3,
            merchantLists: [],
            isLoading: true,
            isRefreshing: false,
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        tokenManagerCheckLogin()
            .then(res => this.setState({ userLogin: res }))
            .catch(err => alert("An error occurred"));
        tokenManagerGetAccessToken()
            .then(res => this.setState({ user_access_token: res }))
            .catch(err => alert("An error occurred"));
        this.getAllMerchantListService(
            this.state.start_items,
            this.state.fetch_length
        );
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

    handlePaginationLoadMoreMerchantList = () => {

        this.setState({
            page_loading: this.state.page_loading + 1,
            start_items: ((this.state.page_loading) * this.state.fetch_length)
                               + this.state.page_loading,
            isLoading: true,

        }, () => {
            console.log(`startItem: ${this.state.start_items}`);
            this.getAllMerchantListService(
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

    renderMerchantAroundMeText() {
        return strings('merchant.merchant_around_me');
    }

    goToMerchantAroundMe() {
        this.props.navigation.navigate('Merchant_Sub_Around_Me')
    }

    goToMerchantSearchByLocation() {
        this.props.navigation.navigate('Merchant_sub_Search_By_Location')
    }

    render() {
        const { userLogin, user_access_token, merchantLists, isRefreshing } = this.state;
        const { merchantMainContainer, merchantTopBtnViewStyle, merchantTopBtnStyle,
              merchantAroundMeIconStyle, merchantTopBtnTextStyle,
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <MainHeader
                    navigation={this.props.navigation}
                />
                <View style={{ flex: 0.2, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantTopBtnStyle}
                            onPress={this.goToMerchantAroundMe.bind(this)}
                        >
                            <View style={{ flex: 0.3, }}>
                            <Icon>
                                <Image
                                    source={require('../../../../assets/images/merchant/merchant_around_me.png')}
                                    style={merchantAroundMeIconStyle}
                                />
                            </Icon>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text
                                    style={merchantTopBtnTextStyle}
                                >
                                    {this.renderMerchantAroundMeText()}
                                </Text>
                            </View>

                        </Button>
                    </Item>
                    <View style={{ height: 20 }} />
                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantTopBtnStyle}
                            onPress={this.goToMerchantSearchByLocation.bind(this)}
                        >
                            <View style={{ flex: 0.3 }}>
                            <Icon>
                                <Image
                                    source={require('../../../../assets/images/merchant/country_search.png')}
                                    style={merchantAroundMeIconStyle}
                                />
                            </Icon>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text
                                    style={merchantTopBtnTextStyle}
                                >
                                    {strings('merchant.merchant_search')}
                                </Text>
                            </View>

                        </Button>
                    </Item>
                </View>
                <View style={{ height: 20, paddingBottom: 10 }} />
                <View style={{ flex: 0.8, paddingTop: 20, marginTop: 10 }}>
                    <MerchantList
                        navigation={this.props.navigation}
                        merchantLists={this.state.merchantLists}
                        handleRefresh={this.handleRefresh}
                        handlePagination={this.handlePaginationLoadMoreMerchantList}
                        isRefreshing={this.state.isRefreshing}
                    />
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
        marginTop: 10,

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

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin,
    changeSettingsLocalization
 })(MerchantMainCompomnent);
