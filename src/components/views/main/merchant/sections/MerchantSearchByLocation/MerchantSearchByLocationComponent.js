import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image } from 'react-native';
import CardView from 'react-native-cardview';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, merchantFilterCountryOptionSelected,
    merchantFilterStateOptionSelected, merchantFilterAreaOptionSelected,
    merchantClearFilterOptionSelected, merchantFilterNobOptionSelected,
    merchantFilterFormUpdate,
} from '../../../../../../controllers/actions';
import { getCountryOptions, getStateOptions, getAreaOptions, getNOBOptions,
} from '../../../../../../utility/networking/MBonusUnAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class MerchantSearchByLocationComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            isLoading: false,
            isRefreshing: false,
            showLocation: false,
            showState: false,
            showArea: false,
            showNOB: false,
            selectedCountryName: '',
            selectedStateName: '',
            selectedAreaName: '',
            selectedNobName: '',
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            nob_options_list: [],
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
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

    getNOBOptionList = () => {
        getNOBOptions()
            .then((nobs) => {

                let data = nobs.data.model;

                console.log(nobs.data.model);
                this.setState({
                    nob_options_list: nobs.data.model,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    nob_options_list: [],
                });
            });
    }

    getCountryOptionList = () => {
        getCountryOptions()
            .then((countries) => {

                let data = countries.data.model;

                console.log(countries.data.model);
                this.setState({
                    country_options_list: countries.data.model,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    country_options_list: [],
                });
            });
    }

    getStateOptionList = (country_id) => {
        const submitParams = {
            country_id,
        };

        getStateOptions(submitParams)
            .then((states) => {
                this.setState({
                    state_options_list: states.data.model
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    state_options_list: []
                });
            });
    }

    getAreaOptionList = (country_id, country_location_id) => {
        const submitParams = {
            country_id,
            country_location_id
        };

        getAreaOptions(submitParams)
            .then((areas) => {
                this.setState({
                    area_options_list: areas.data.model
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    area_options_list: []
                });
            });
    }

    // Select Picker Helper
    // NOB Options
    onSelectedNOB(value) {
        this.props.merchantFilterNobOptionSelected(value);
        console.log(`selected nob ext id ${value}`);

        this.state.nob_options_list.map((member, key) => {

            if (value === member.id) {
                this.setState({
                    selectedNobName: this.state.user_pref_language === 'zh' ?
                        member.name_cn : member.name_en,
                });
            }
        });

    }

    // Country Options
    onSelectedCountry(value) {
        this.props.merchantFilterCountryOptionSelected(value);
        console.log(`selected country ext id ${value}`);
        this.setState({
            state_options_list: [],
            area_options_list: [],
        });

        this.state.country_options_list.map((member, key) => {

            if (value === member.id) {
                this.setState({
                    selectedCountryName: this.state.user_pref_language === 'zh' ?
                        member.model.country_name_cn : member.model.country_name_en,
                });
            }
        });

        this.getStateOptionList(value);
    }

    // State Options
    onSelectedState(value) {
        this.props.merchantFilterStateOptionSelected(value);
        console.log(`selected state id ${value}`);
        this.setState({
            area_options_list: [],
        });

        this.state.state_options_list.map((member, key) => {

            if (value === member.id) {
                this.setState({
                    selectedStateName: this.state.user_pref_language === 'zh' ?
                        member.model.location_name_cn : member.model.location_name_en,
                });
            }
        });

        this.getAreaOptionList(
            this.props.selected_country_id,
            value
        );
    }

    // Area Options
    onSelectedArea(value) {
        this.props.merchantFilterAreaOptionSelected(value);
        console.log(`selected area id ${value}`);

        this.state.area_options_list.map((member, key) => {

            if (value === member.id) {
                this.setState({
                    selectedAreaName: this.state.user_pref_language === 'zh' ?
                        member.model.location_name_cn : member.model.location_name_en,
                });
            }
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

    renderMerchantAroundMeText() {
        return strings('merchant.merchant_around_me');
    }

    filterByLocation() {
        this.props.merchantClearFilterOptionSelected();
        this.setState({
            showLocation: !this.state.showLocation
        });
        this.getCountryOptionList();
    }

    filterByNOB() {
        this.setState({
            showNOB: !this.state.showNOB
        });
        this.getNOBOptionList();
    }

    goBackNClear() {
        this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }

    renderLocationSpinner() {
        const { merchantTopBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.state.showLocation) {
            return (
                <View>
                <Item style={merchantTopBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text>{strings('picker.country')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Country"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: "#000" }}
                              itemStyle={{
                                backgroundColor: "#d3d3d3",
                                marginLeft: 0,
                                paddingLeft: 10
                              }}
                              itemTextStyle={{ color: '#000' }}
                              style={countryLocationPickerStyle}
                              selectedValue={this.props.selected_country_id}
                              onValueChange={this.onSelectedCountry.bind(this)}
                            >
                            {this.state.country_options_list.map((member, key) => {

                                return (
                                     <Picker.Item
                                        label={this.state.user_pref_language === 'zh' ?
                                            member.model.country_name_cn : member.model.country_name_en
                                        }
                                        value={member.id}
                                        key={member.name}
                                    />
                                );
                            })}

                            </Picker>
                        </View>
                    </Button>
                </Item>

                { this.renderStateSpinner() }
                { this.renderAreaSpinner() }

                </View>
            );
        }
    }

    renderStateSpinner() {
        const { merchantTopBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.props.selected_country_id) {
            return (
                <Item style={merchantTopBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text>{strings('picker.state')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select State"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: "#000" }}
                              itemStyle={{
                                backgroundColor: "#d3d3d3",
                                marginLeft: 0,
                                paddingLeft: 10
                              }}
                              itemTextStyle={{ color: '#000' }}
                              style={countryLocationPickerStyle}
                              selectedValue={this.props.selected_state_id}
                              onValueChange={this.onSelectedState.bind(this)}
                            >
                                {this.state.state_options_list.map((member, key) => {

                                    return (
                                         <Picker.Item
                                         label={this.state.user_pref_language === 'zh' ?
                                             member.model.location_name_cn : member.model.location_name_en
                                         }
                                         value={member.id} key={member.name} />
                                    );
                                })}

                            </Picker>
                        </View>
                    </Button>
                </Item>
            );
        }
    }

    renderAreaSpinner() {
        const { merchantTopBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.props.selected_state_id) {
            return (
                <Item style={merchantTopBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text>{strings('picker.area')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Area"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: "#000" }}
                              itemStyle={{
                                backgroundColor: "#d3d3d3",
                                marginLeft: 0,
                                paddingLeft: 10
                              }}
                              itemTextStyle={{ color: '#000' }}
                              style={countryLocationPickerStyle}
                              selectedValue={this.props.selected_area_id}
                              onValueChange={this.onSelectedArea.bind(this)}
                            >
                                {this.state.area_options_list.map((member, key) => {

                                    return (
                                         <Picker.Item
                                         label={this.state.user_pref_language === 'zh' ?
                                             member.model.location_name_cn : member.model.location_name_en
                                         }
                                         value={member.id} key={member.name} />
                                    );
                                })}

                            </Picker>
                        </View>
                    </Button>
                </Item>
            );
        }
    }

    renderNOBSpinner() {
        const { merchantTopBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.state.showNOB) {
            return (
                <View>
                <Item style={merchantTopBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text>{strings('picker.nob')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select NOB"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: "#000" }}
                              itemStyle={{
                                backgroundColor: "#d3d3d3",
                                marginLeft: 0,
                                paddingLeft: 10
                              }}
                              itemTextStyle={{ color: '#000' }}
                              style={countryLocationPickerStyle}
                              selectedValue={this.props.selected_nob_id}
                              onValueChange={this.onSelectedNOB.bind(this)}
                            >
                            {this.state.nob_options_list.map((member, key) => {

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
    }

    filterNowGoToResult() {
        const { selected_country_id, selected_state_id, selected_area_id,
            selected_nob_id, merchant_filer_string
        } = this.props;
        const { selectedCountryName, selectedStateName, selectedAreaName,
            selectedNobName
        } = this.state;
        const merchant_name_string = '';


        console.log('from search');
        console.log(this.props.merchant_filer_string);

        this.props.navigation.navigate('Merchant_sub_Search_Result', {
            selected_country_id,
            selected_state_id,
            selected_area_id,
            selected_nob_id,
            merchant_filer_string,
            selectedCountryName,
            selectedStateName,
            selectedAreaName,
            selectedNobName,
        });
    }

    render() {
        const { userLogin, user_access_token, merchantLists, isRefreshing } = this.state;
        const { merchantMainContainer, merchantTopBtnViewStyle, merchantTopBtnStyle,
              merchantAroundMeIconStyle, merchantTopBtnTextStyle, merchantFilterBtnStyle,
              merchantFilterBtnTextStyle, merchantTopTitleBtnStyle, merchantFilterTextViewStyle,
              inputTextFieldStyle,

        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('merchant.merchant_search')}
                    goBackAction={() => this.goBackNClear()}
                />
                <Content>
                <View style={{ flex: 0.2, flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantTopTitleBtnStyle}
                            onPress={this.filterByLocation.bind(this)}
                        >
                            <View style={{ flex: 0.3, }}>
                            <Icon>
                                <Image
                                    source={require('../../../../../../assets/images/merchant/country_search.png')}
                                    style={merchantAroundMeIconStyle}
                                />
                            </Icon>
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <Text
                                    style={merchantTopBtnTextStyle}
                                >
                                    {strings('merchant.merchant_search_by_location')}
                                </Text>
                            </View>

                        </Button>
                    </Item>

                    {this.renderLocationSpinner()}

                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantTopTitleBtnStyle}
                            onPress={this.filterByNOB.bind(this)}
                        >
                            <View style={{ flex: 0.2 }}>
                            <Icon>
                                <Image
                                    source={require('../../../../../../assets/images/merchant/ic_action_companyrepresentative.png')}
                                    style={merchantAroundMeIconStyle}
                                />
                            </Icon>
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <Text
                                    style={merchantTopBtnTextStyle}
                                >
                                    {strings('merchant.merchant_search_by_nob')}
                                </Text>
                            </View>

                        </Button>
                    </Item>

                    {this.renderNOBSpinner()}

                    <Item style={merchantTopBtnViewStyle}>
                        <View
                            style={merchantFilterTextViewStyle}
                        >
                            <Input
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('merchant.merchant_search_by_comp_name')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.merchantFilterFormUpdate({
                                    props: 'merchant_filer_string',
                                    value: text,
                                })}
                                value={this.props.merchant_filer_string}
                            />

                        </View>
                    </Item>
                </View>
                <View style={{ flex: 0.8, paddingTop: 15 }}>

                </View>
                </Content>
                <View style={{ paddingBottom: 55 }}>
                    <Item style={merchantTopBtnViewStyle}>
                        <Button
                            style={merchantFilterBtnStyle}
                            onPress={this.filterNowGoToResult.bind(this)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={merchantFilterBtnTextStyle}
                                >
                                    {strings('filter.filter_now')}
                                </Text>
                            </View>

                        </Button>
                    </Item>
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
    merchantTopTitleBtnStyle: {
        flex: 1,
        backgroundColor: CLR_PRIMARY_DARK,
    },
    merchantTopBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
    },
    merchantFilterTextViewStyle: {
        flex: 1,
        backgroundColor: CLR_WHITE,
        borderColor: CLR_BLACK,
        borderWidth: 2,
    },
    merchantAroundMeIconStyle: {
        width: 35,
        height: 35,
    },
    merchantTopBtnTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    merchantFilterBtnStyle: {
        flex: 1,
        backgroundColor: CLR_PURPLE,
    },
    merchantFilterBtnTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    countryLocationPickerStyle: {
        width: 350,
    },
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
    },

};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        selected_country_id: state.merchant_filter.selected_country_id,
        selected_state_id: state.merchant_filter.selected_state_id,
        selected_area_id: state.merchant_filter.selected_area_id,
        selected_nob_id: state.merchant_filter.selected_nob_id,
        merchant_filer_string: state.merchant_filter.merchant_filer_string,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    merchantFilterCountryOptionSelected,
    merchantFilterStateOptionSelected,
    merchantFilterAreaOptionSelected,
    merchantClearFilterOptionSelected,
    merchantFilterNobOptionSelected,
    merchantFilterFormUpdate,
})(MerchantSearchByLocationComponent);
