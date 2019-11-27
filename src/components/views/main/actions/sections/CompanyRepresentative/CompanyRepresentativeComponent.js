import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, Linking, Clipboard, Share
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input, CheckBox,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL, CLR_PRIMARY,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_DARK_GREY, CLR_SHINE_BLUE,
    CLR_MORE_LIGHT_GREY, ASYNCTORAGE_USER_DETAILS, CLR_FB, CLR_TWITTER, CLR_WHATSAPP,
    CLR_TELEGRAM, CLR_RED, CLR_TIFFANY_BLUE, CLR_GREY, CLR_LIGHT_GREY,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, globalFormUpdateCountryOptionSelected,
    globalFormUpdateStateOptionSelected, userCompRepRefCheckUsernameSubmit, globalFormsClearAll,
    globalFormUpdateAreaOptionSelected, globalActionsFormUpdate, userCompRepRefSubmit,
    userCompRepBecomeSubmit, globalFormsClear_UsernameSuccess,
} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getCountryOptions, getStateOptions, getAreaOptions
} from '../../../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class CompanyRepresentativeComponent extends Component {

    constructor(props) {
        super(props);
        this.props.globalFormsClearAll();
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            verifiedMsg: '',
            verifiedMsgType: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            phone_ext_list: [],

            isReferCompanyRef: true,
            selectedTypeID: 1,
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getCountryOptionList();
    }

    componentDidUpdate() {
        if(this.props.targetUsernameSuccessMsg) {

            this.setState({
                verifiedMsg: this.props.targetUsernameSuccessMsg,
                verifiedMsgType: 1,
            });
            this.refs.toast.show(this.props.targetUsernameSuccessMsg, DURATION.LENGTH_LONG);
            this.props.globalFormsClear_UsernameSuccess();
        }
        if (this.props.targetUsernameFailedMsg) {
            this.setState({
                verifiedMsg: this.props.targetUsernameFailedMsg,
                verifiedMsgType: 0,
            });
            this.refs.toast.show(this.props.targetUsernameFailedMsg, DURATION.LENGTH_LONG);
            this.props.globalFormsClearAll();
        }
        if (this.props.loading) {
            this.refs.toast.show('LOADING NOW', DURATION.LENGTH_LONG);
            //this.props.globalFormsClearAll();
        }
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


    getCountryOptionList = () => {
        getCountryOptions()
            .then((countries) => {

                let data = countries.data.model;
                let filterData = [];
                for(var i = 0; i < data.length; i++) {
                    if(data[i].model.ext) {
                        console.log('found ext');
                        filterData.push(data[i]);
                    }
                }
                this.setState({
                    phone_ext_list: filterData,
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

    // Country Options
    onSelectedCountry(value) {
        this.props.globalFormUpdateCountryOptionSelected(value);
        console.log(`selected country ext id ${value}`);
        this.setState({
            state_options_list: [],
            area_options_list: [],
        });

        this.getStateOptionList(value);
    }

    // State Options
    onSelectedState(value) {
        this.props.globalFormUpdateStateOptionSelected(value);
        console.log(`selected state id ${value}`);
        this.setState({
            area_options_list: [],
        });

        this.getAreaOptionList(
            this.props.selected_country_id,
            value
        );
    }

    // Area Options
    onSelectedArea(value) {
        this.props.globalFormUpdateAreaOptionSelected(value);
        console.log(`selected area id ${value}`);
    }

    onSelectedType(value) {
        console.log(`selected type of refer id ${value}`);

        this.setState({
            selectedTypeID: value,
        });
    }


    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
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

    selectedRefSection() {
        this.setState({
            isReferCompanyRef: true,
        });
    }

    selectedBecomeSection() {
        this.setState({
            isReferCompanyRef: false,
        });
    }

    onSubmitServiceAction = () => {
        if (this.state.isReferCompanyRef === true) {
            if (this.state.userIsVerified && this.props.target_username) {
                switch (this.state.selectedTypeID) {
                    case 1:
                        console.log('ref country');
                        const submitRefCountryParams = {
                            type_id: 1,
                            target_username: this.props.target_username,
                            country_id: this.props.selected_country_id,
                            current_password2: this.props.current_password2,
                        };
                        this.props.userCompRepRefSubmit(submitRefCountryParams);
                        break;
                    case 2:
                        console.log('ref state');
                        const submitRefStateParams = {
                            type_id: 2,
                            target_username: this.props.target_username,
                            country_id: this.props.selected_country_id,
                            country_location_id: this.props.selected_state_id,
                            current_password2: this.props.current_password2,
                        };
                        this.props.userCompRepRefSubmit(submitRefStateParams);
                        break;
                    case 3:
                        console.log('ref area');
                        const submitRefAreaParams = {
                            type_id: 3,
                            target_username: this.props.target_username,
                            country_id: this.props.selected_country_id,
                            country_location_id: this.props.selected_state_id,
                            country_location_id_2: this.props.selected_area_id,
                            current_password2: this.props.current_password2,
                        };
                        this.props.userCompRepRefSubmit(submitRefAreaParams);
                        break;
                }
            }
            else {
                this.refs.toast.show(strings('user_profile.target_username_is_not_verified'), DURATION.LENGTH_LONG);
            }

        }
        else {
            switch (this.state.selectedTypeID) {
                case 1:
                    console.log('become country');
                    const submitBecomeCountryParams = {
                        type_id: 1,
                        country_id: this.props.selected_country_id,
                        current_password2: this.props.current_password2,
                    };
                    this.props.userCompRepBecomeSubmit(submitBecomeCountryParams);
                    break;
                case 2:
                    console.log('become state');
                    const submitBecomeStateParams = {
                        type_id: 2,
                        country_id: this.props.selected_country_id,
                        country_location_id: this.props.selected_state_id,
                        current_password2: this.props.current_password2,
                    };
                    this.props.userCompRepBecomeSubmit(submitBecomeStateParams);
                    break;
                case 3:
                    console.log('become area');
                    const submitBecomeAreaParams = {
                        type_id: 3,
                        country_id: this.props.selected_country_id,
                        country_location_id: this.props.selected_state_id,
                        country_location_id_2: this.props.selected_area_id,
                        current_password2: this.props.current_password2,
                    };
                    this.props.userCompRepBecomeSubmit(submitBecomeAreaParams);
                    break;
            }
        }
    }

    renderRefTyperSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 1 }}>
                            <Picker
                                mode="dropdown"
                                enabled={true}
                                placeholder="Select Ref"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder={strings('picker.please_select')}
                                textStyle={{ color: CLR_BLACK, fontWeight: 'bold' }}
                                itemStyle={{
                                    backgroundColor: "#d3d3d3",
                                    marginLeft: 0,
                                    paddingLeft: 10
                                }}
                                itemTextStyle={{ color: '#000' }}
                                style={countryLocationPickerStyle}
                                selectedValue={this.state.selectedTypeID}
                                onValueChange={this.onSelectedType.bind(this)}
                            >
                                <Picker.Item
                                   label={strings('actions.refer_country_option')}
                                   value={1}
                                   key='refer-1'
                                />
                                <Picker.Item
                                   label={strings('actions.refer_state_option')}
                                   value={2}
                                   key='refer-2'
                                />
                                <Picker.Item
                                   label={strings('actions.refer_area_option')}
                                   value={3}
                                   key='refer-3'
                                />

                            </Picker>
                        </View>
                    </Button>
                </Item>
                <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                    <Text
                        style={{ textAlign: 'center', fontSize: 14 }}
                    >
                        {strings('actions.select_refer_company_representative')}
                    </Text>
                </View>

                </View>
            );
    }

    renderBecomeTyperSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 1 }}>
                            <Picker
                                mode="dropdown"
                                enabled={true}
                                placeholder="Select Become"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder={strings('picker.please_select')}
                                textStyle={{ color: CLR_BLACK, fontWeight: 'bold' }}
                                itemStyle={{
                                    backgroundColor: "#d3d3d3",
                                    marginLeft: 0,
                                    paddingLeft: 10
                                }}
                                itemTextStyle={{ color: '#000' }}
                                style={countryLocationPickerStyle}
                                selectedValue={this.state.selectedTypeID}
                                onValueChange={this.onSelectedType.bind(this)}
                            >
                                <Picker.Item
                                   label={strings('actions.become_country_option')}
                                   value={1}
                                   key='refer-1'
                                />
                                <Picker.Item
                                   label={strings('actions.become_state_option')}
                                   value={2}
                                   key='refer-2'
                                />
                                <Picker.Item
                                   label={strings('actions.become_area_option')}
                                   value={3}
                                   key='refer-3'
                                />

                            </Picker>
                        </View>
                    </Button>
                </Item>
                <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                    <Text
                        style={{ textAlign: 'center', fontSize: 14 }}
                    >
                        {strings('actions.select_refer_company_representative')}
                    </Text>
                </View>

                </View>
            );
    }


    renderCountrySpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{ color: CLR_BLACK }}>{strings('picker.country')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Country"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_BLACK, fontWeight: 'bold' }}
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
                                            member.model.country_name_cn : member.model.country_name_en + ' ' + member.price
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

                </View>
            );
    }

    renderStateSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.props.selected_country_id) {
            return (
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{color: CLR_BLACK}}>{strings('picker.state')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select State"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_BLACK, fontWeight: 'bold' }}
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
                                             member.model.location_name_cn : member.model.location_name_en + ' ' + member.price
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
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.props.selected_state_id) {
            return (
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{color: CLR_BLACK}}>{strings('picker.area')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Area"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_BLACK, fontWeight: 'bold' }}
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
                                             member.model.location_name_cn : member.model.location_name_en + ' ' + member.price
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

    renderLocationSpinner() {
        switch (this.state.selectedTypeID) {
            case 1:
                return (
                    <View style={{ flex: 1 }}>
                        {this.renderCountrySpinner()}
                    </View>
                );
            case 2:
                return (
                    <View style={{ flex: 1 }}>
                        { this.renderCountrySpinner()}
                        { this.renderStateSpinner() }
                    </View>
                );
            case 3:
                return (
                    <View style={{ flex: 1 }}>
                        { this.renderCountrySpinner()}
                        { this.renderStateSpinner() }
                        { this.renderAreaSpinner() }
                    </View>
                );
            default:
                return (
                    <View style={{ flex: 1 }}>
                        {this.renderCountrySpinner()}
                    </View>
                );
        }
    }


    // Check TargetUsername
    checkTargetUsernameAvailable = () => {
        if (this.props.target_username) {
            const submitParams = {
                target_username: this.props.target_username,
            };
            this.setState({
                verifiedMsg: '',
                verifiedMsgType: '',
            });

            this.props.userCompRepRefCheckUsernameSubmit(submitParams);
        }
    }

    renderVerifiedUsername() {
        if(this.state.verifiedMsgType === 1) {
            return (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'green', textAlign: 'center' }}
                    >
                        {strings('user_profile.verified')}
                    </Text>
                </View>
            );
        }
        if (this.state.verifiedMsgType === 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'red', textAlign: 'center' }}
                    >
                        {strings('user_profile.unverified')}
                    </Text>
                    <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: 'red', textAlign: 'center' }}
                    >
                        {this.state.verifiedMsg}
                    </Text>
                </View>
            );
        }
    }

    renderSectionContent() {
        const { merchantMainContainer, titleTextStyle, socialIconstyle, roundedRowBtnViewStyle,
            inputTextFieldStyle, myButtonStyle, myButtonTextStyle, socialTextstyle, browseButtonStyle, browseButtonTextStyle,
        } = styles;

        if (this.state.isReferCompanyRef === true) {
            return (
                <View style={{ flex: 1 }}>

                    {this.renderRefTyperSpinner()}

                    {this.renderLocationSpinner()}

                    <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                        <Item style={roundedRowBtnViewStyle}>
                            <View style={{ flex: 1, flexDirection: 'row'}}>
                                <View
                                    style={{
                                        flex: 0.7,
                                        justifyContent: 'center',
                                        borderWidth: 2,
                                        borderColor: CLR_WHITE,
                                        marginRight: 10,
                                        borderRadius: 5,
                                        backgroundColor: CLR_WHITE
                             }}
                            >
                                    <Input
                                        autoCapitalize={'none'}
                                        multiline
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_target_username')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'target_username',
                                                value: text,
                                        })}
                                        value={this.props.target_username}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{ flex: 0.3 }}
                                    onPress={this.checkTargetUsernameAvailable.bind(this)}
                                >

                                    <View style={myButtonStyle}>
                                        <Text style={myButtonTextStyle}>
                                            {strings('user_profile.verify')}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </Item>
                        {this.renderVerifiedUsername()}
                    </View>

                </View>
            );
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderBecomeTyperSpinner()}
                    {this.renderLocationSpinner()}
                </View>
            );
        }
    }

    render() {

        const { merchantMainContainer, titleTextStyle, socialIconstyle, roundedRowBtnViewStyle,
            inputTextFieldStyle, myButtonStyle, myButtonTextStyle, socialTextstyle, browseButtonStyle, browseButtonTextStyle,
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle=''
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/me/refer_bg_square.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
                            <Text
                                style={titleTextStyle}
                            >
                                {strings('actions.company_representative')}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                padding: 10,
                                borderWidth: 2,
                                borderColor: CLR_WHITE,
                                borderRadius: 10,
                                marginTop: 50,
                                marginLeft: 2,
                                marginRight: 2,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',

                                }}
                            >
                                <Image
                                    source={require('../../../../../../assets/images/actions/map_malaysia.png')}
                                    style={{ width: 300, height: 150 }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.selectedRefSection.bind(this)}
                                        >
                                            <View
                                                style={{
                                                    padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.state.isReferCompanyRef === true ?
                                                    CLR_PRIMARY : CLR_LIGHT_GREY }}
                                            >
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('actions.refer_company_representative')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.selectedBecomeSection.bind(this)}
                                        >
                                            <View
                                                style={{
                                                    padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.state.isReferCompanyRef === true ?
                                                    CLR_LIGHT_GREY : CLR_PRIMARY }}
                                            >
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('actions.become_company_representative')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </Item>
                            </View>

                            {this.renderSectionContent()}


                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE
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



                            <View
                                style={{ flex: 1 }}
                            >
                                <Item style={roundedRowBtnViewStyle}>
                                    <Button
                                        style={{ flex: 1,
                                        backgroundColor: CLR_DARK_GREY, }}
                                        onPress={this.onSubmitServiceAction.bind(this)}
                                    >
                                        <View style={{ flex: 1, alignItems: 'center'}}>
                                            <Text
                                            >
                                                {strings('actions.register_confirm')}
                                            </Text>
                                        </View>

                                    </Button>
                                </Item>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
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
        backgroundColor: CLR_MORE_LIGHT_GREY
    },
    mainViewContainerStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    titleTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: CLR_WHITE,
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
    },
    dontHaveReferralTextStyle: {
        fontSize: 13,
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
    browseButtonStyle: {
        padding: 10,
        flex: 1,
        borderRadius: 5,
        backgroundColor: CLR_GREY,
        justifyContent: 'center',
        alignItems: 'center'
    },
    browseButtonTextStyle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        errorMsg: state.global_forms.errorMsg,
        successMsg: state.global_forms.successMsg,
        loading: state.global_forms.loading,
        selected_country_id: state.global_forms.selected_country_id,
        selected_state_id: state.global_forms.selected_state_id,
        selected_area_id: state.global_forms.selected_area_id,
        target_username: state.global_forms.target_username,
        targetUsernameSuccessMsg: state.global_forms.targetUsernameSuccessMsg,
        targetUsernameFailedMsg: state.global_forms.targetUsernameFailedMsg,
        current_password2: state.global_forms.current_password2,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    globalActionsFormUpdate,
    globalFormUpdateCountryOptionSelected,
    globalFormUpdateStateOptionSelected,
    globalFormUpdateAreaOptionSelected,
    userCompRepRefSubmit,
    userCompRepRefCheckUsernameSubmit,
    globalFormsClearAll,
    userCompRepBecomeSubmit,
    globalFormsClear_UsernameSuccess,
})(CompanyRepresentativeComponent);
