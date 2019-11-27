import React, { Component } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, Linking, Clipboard, Share
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import QRCode from 'react-native-qrcode';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-crop-picker';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input, CheckBox,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_DARK_GREY, CLR_SHINE_BLUE,
    CLR_MORE_LIGHT_GREY, ASYNCTORAGE_USER_DETAILS, CLR_FB, CLR_TWITTER, CLR_WHATSAPP,
    CLR_TELEGRAM, CLR_RED, CLR_TIFFANY_BLUE, CLR_GREY,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, globalActionsFormUpdate, referNewMerchantSubmit,
        globalFormUpdateCountryOptionSelected,
        globalFormUpdateStateOptionSelected,
        globalFormUpdateAreaOptionSelected,
        globalFormsUpdatephoneExtOptionSelected,
        globalFormsClearAll,
        globalFormUpdateNOBOptionSelected,
        globalFormUpdateMerchantGroupOptionSelected,
        globalFormUpdateCompBankOptionSelected,
} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getCountryOptions, getStateOptions, getAreaOptions, getCompanyBankOptions,
    getMerchantGroupOptions, getNOBOptions
} from '../../../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class ReferNewMerchantComponent extends Component {

    constructor(props) {
        super(props);
        this.props.globalFormsClearAll();
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            confirmedInformation: false,
            selectedAgent: false,
            selectedRegisterID: '',
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            phone_ext_list: [],
            nob_list: [],
            comp_bank_list: [],
            merchant_group_list: [],

            comp_logo_imgPathText: '',
            comp_logo_imgDisplayPathText: '',
            comp_logo_mime: '',
            comp_logo_filename: '',

            comp_nc_imgPathText: '',
            comp_nc_imgDisplayPathText: '',
            comp_nc_mime: '',
            comp_nc_filename: '',

            comp_ssm_imgPathText: '',
            comp_ssm_imgDisplayPathText: '',
            comp_ssm_mime: '',
            comp_ssm_filename: '',

            comp_bank_slip_imgPathText: '',
            comp_bank_slip_imgDisplayPathText: '',
            comp_bank_slip_mime: '',
            comp_bank_slip_filename: '',

            comp_supp_document_imgPathText: '',
            comp_supp_document_imgDisplayPathText: '',
            comp_supp_document_mime: '',
            comp_supp_document_filename: '',
        };
    }

    componentDidMount() {
        this.getUserPrefLanguage();
        this.getNOBOptionList();
        this.getCountryOptionList();
        this.getCompanyBankOptionList();
        this.getMerchantGroupsOptionList();
    }

    componentDidUpdate() {
        if(this.props.targetUsernameSuccessMsg) {

            this.setState({
                verifiedMsg: this.props.targetUsernameSuccessMsg,
                verifiedMsgType: 1,
            });
            this.refs.toast.show(this.props.targetUsernameSuccessMsg, DURATION.LENGTH_LONG);
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

    getNOBOptionList = () => {
        getNOBOptions()
            .then((allNOBs) => {
                this.setState({
                    nob_list: allNOBs.data.model,
                });
                console.log(allNOBs);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    nob_list: [],
                });
            });
    }

    getCompanyBankOptionList = () => {
        getCompanyBankOptions()
            .then((allCompanyBanks) => {
                this.setState({
                    comp_bank_list: allCompanyBanks.data.model,
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    comp_bank_list: [],
                });
            });
    }

    getMerchantGroupsOptionList = () => {
        getMerchantGroupOptions()
            .then((allMerchantGroups) => {
                this.setState({
                    merchant_group_list: allMerchantGroups.data.model,
                });
                console.log(allMerchantGroups);
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    merchant_group_list: [],
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

    // CompBank Options
    onSelectedCompBankOptions(value) {
        this.props.globalFormUpdateCompBankOptionSelected(value);
        console.log(`selected comp Bank id ${value}`);
    }

    // NOB Options
    onSelectedNOBOptions(value) {
        this.props.globalFormUpdateNOBOptionSelected(value);
        console.log(`selected nob id ${value}`);
    }

    // CompBank Options
    onSelectedMerchantGroupOptions(value) {
        this.props.globalFormUpdateMerchantGroupOptionSelected(value);
        console.log(`selected merchant group id ${value}`);
    }


    // Phone Ext
    onSelectedPhoneExt(value) {
        this.props.globalFormsUpdatephoneExtOptionSelected(value);
        console.log(`selected phone ext id ${value}`);
    }

    // Country Options
    onSelectedCountry(value) {
        this.props.globalFormUpdateCountryOptionSelected(value);
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
        this.props.globalFormUpdateStateOptionSelected(value);
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
        this.props.globalFormUpdateAreaOptionSelected(value);
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


    goBackNClear() {
        this.props.globalFormsClearAll();
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

    renderNOBSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>

                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select NOB"
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
                              selectedValue={this.props.selected_nob_id}
                              onValueChange={this.onSelectedNOBOptions.bind(this)}
                            >
                            {this.state.nob_list.map((member, key) => {

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
                <View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 20 }}>
                    <Text
                        style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                    >
                        {strings('actions.refer_nature_bs_1')}
                    </Text>
                </View>
                </View>
            );
    }

    renderMerchantGroupSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>

                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Merchant Group"
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
                              selectedValue={this.props.selected_mg_id}
                              onValueChange={this.onSelectedMerchantGroupOptions.bind(this)}
                            >
                            {this.state.merchant_group_list.map((member, key) => {

                                return (
                                     <Picker.Item
                                        label={this.state.user_pref_language === 'zh' ?
                                            member.group_name : member.group_name
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
                <View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 20 }}>
                    <Text
                        style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                    >
                        {strings('actions.refer_group_name')}
                    </Text>
                </View>
                </View>
            );
    }

    renderCompBankSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.1, marginLeft: 10 }}>

                        </View>
                        <View style={{ flex: 0.9, alignItems: 'center'}}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Country"
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
                              selectedValue={this.props.selected_comp_bank_id}
                              onValueChange={this.onSelectedCompBankOptions.bind(this)}
                            >
                            {this.state.comp_bank_list.map((member, key) => {

                                return (
                                     <Picker.Item
                                        label={
                                            member.account_name + ' ' + (this.state.user_pref_language === 'zh' ?
                                            member.name_cn : member.name_en ) + ' ' + member.account_number

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
                <View style={{ alignItems: 'center', paddingTop: 5, paddingBottom: 20 }}>
                    <Text
                        style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                    >
                        {strings('actions.refer_comp_bank_selection')}
                    </Text>
                </View>
                </View>
            );
    }

    renderLocationSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,
            reminderTextRedStyle,

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
                              textStyle={{ color: CLR_BLACK }}
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

                <Text style={reminderTextRedStyle}>
                    {strings('picker.country_reminder')}
                </Text>
                
                { this.renderStateSpinner() }
                { this.renderAreaSpinner() }

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
                            <Text style={{ color: CLR_BLACK }}>{strings('picker.state')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select State"
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
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        if (this.props.selected_state_id) {
            return (
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{ color: CLR_BLACK }}>{strings('picker.area')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Area"
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

    openCompLogoImgPickerCropperActions() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            hideBottomControls: true,
            showCropGuidelines: true
        })
        .then(image => {
            console.log(image);
            const imgDisplayPath = image.path.replace('react-native-image-crop-picker', `jk-mbonus-crop`);
            this.setState({
                comp_logo_imgPathText: image.path,
                comp_logo_imgDisplayPathText: imgDisplayPath,
                comp_logo_mime: image.mime,
                comp_logo_filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-comp-logo.jpg' : 'my-comp-logo.png')
            });
        });
    }

    renderCompLogoImg() {
        if (this.state.comp_logo_imgPathText) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageLoad
                        style={{ width: 200, height: 200 }}
                        loadingStyle={{ size: 'large', color: 'blue' }}
                        placeholderSource={require('../../../../../../assets/images/merchant/shop_profile.png')}
                        placeholderStyle={{ width: 200, height: 200 }}
                        source={{ uri: this.state.comp_logo_imgPathText }}
                    />
                </View>
            );
        }
    }

    renderCompLogoImgPathText() {
        if (this.state.comp_logo_imgDisplayPathText) {
            return this.state.comp_logo_imgDisplayPathText;
        }
        else {
            return strings('actions.refercompany_logo');
        }
    }

    openCompNameCardImgPickerCropperActions() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            hideBottomControls: true,
            showCropGuidelines: true
        })
        .then(image => {
            console.log(image);
            const imgDisplayPath = image.path.replace('react-native-image-crop-picker', `jk-mbonus-crop`);
            this.setState({
                comp_nc_imgPathText: image.path,
                comp_nc_imgDisplayPathText: imgDisplayPath,
                comp_nc_mime: image.mime,
                comp_nc_filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-nc.jpg' : 'my-nc.png')
            });
        });
    }

    renderCompNamecardImgPathText() {
        if (this.state.comp_nc_imgDisplayPathText) {
            return this.state.comp_nc_imgDisplayPathText;
        }
        else {
            return strings('actions.refernamecard');
        }
    }

    openCompSSMImgPickerCropperActions() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            hideBottomControls: true,
            showCropGuidelines: true
        })
        .then(image => {
            console.log(image);
            const imgDisplayPath = image.path.replace('react-native-image-crop-picker', `jk-mbonus-crop`);
            this.setState({
                comp_ssm_imgPathText: image.path,
                comp_ssm_imgDisplayPathText: imgDisplayPath,
                comp_ssm_mime: image.mime,
                comp_ssm_filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-ssm.jpg' : 'my-ssm.png')
            });
        });
    }

    renderCompSSMImgPathText() {
        if (this.state.comp_ssm_imgDisplayPathText) {
            return this.state.comp_ssm_imgDisplayPathText;
        }
        else {
            return strings('actions.refer_ssm');
        }
    }

    openCompBankSlipImgPickerCropperActions() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            hideBottomControls: true,
            showCropGuidelines: true
        })
        .then(image => {
            console.log(image);
            const imgDisplayPath = image.path.replace('react-native-image-crop-picker', `jk-mbonus-crop`);
            this.setState({
                comp_bank_slip_imgPathText: image.path,
                comp_bank_slip_imgDisplayPathText: imgDisplayPath,
                comp_bank_slip_mime: image.mime,
                comp_bank_slip_filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-bank-slip.jpg' : 'my-bank-slip.png')
            });
        });
    }

    renderCompBankSlipImgPathText() {
        if (this.state.comp_bank_slip_imgDisplayPathText) {
            return this.state.comp_bank_slip_imgDisplayPathText;
        }
        else {
            return strings('actions.refer_bankInSlip');
        }
    }

    openCompSuppDocImgPickerCropperActions() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            hideBottomControls: true,
            showCropGuidelines: true
        })
        .then(image => {
            console.log(image);
            const imgDisplayPath = image.path.replace('react-native-image-crop-picker', `jk-mbonus-crop`);
            this.setState({
                comp_supp_document_imgPathText: image.path,
                comp_supp_document_imgDisplayPathText: imgDisplayPath,
                comp_supp_document_mime: image.mime,
                comp_supp_document_filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-supp-document.jpg' : 'my-supp-document.png')
            });
        });
    }

    renderCompSuppDocImgPathText() {
        if (this.state.comp_supp_document_imgDisplayPathText) {
            return this.state.comp_supp_document_imgDisplayPathText;
        }
        else {
            return strings('actions.refer_invoice');
        }
    }

    // submit Register request
    onSubmitReferNewMerchantRequest = () => {

        if (
            this.state.confirmedInformation &&
            this.props.name &&
            this.props.email &&
            this.props.selected_nob_id &&
            this.props.rebate_to_offer &&
            this.props.pic_name &&
            this.props.pic_contact_number &&
            this.props.selected_mg_id &&
            this.props.bank_reference_number &&
            this.props.current_password2 &&
            this.props.selected_country_id &&
            this.props.selected_country_id &&
            this.props.selected_state_id &&
            this.props.selected_area_id &&
            this.props.selected_country_id &&
            this.props.selected_comp_bank_id &&
            this.props.remark &&
            this.state.comp_logo_imgPathText &&
            this.state.comp_logo_mime &&
            this.state.comp_logo_filename &&
            this.state.comp_nc_imgPathText &&
            this.state.comp_nc_mime &&
            this.state.comp_nc_filename &&
            this.state.comp_bank_slip_imgPathText &&
            this.state.comp_bank_slip_mime &&
            this.state.comp_bank_slip_filename &&
            this.state.comp_ssm_imgPathText &&
            this.state.comp_ssm_mime &&
            this.state.comp_ssm_filename
        ) {

            const submitParams = {
                name: this.props.name,
                email: this.props.email,
                nature_of_business_1: this.props.selected_nob_id,
                nature_of_business_2: this.props.selected_nob_id,
                nature_of_business_3: this.props.selected_nob_id,
                rebate_to_offer: this.props.rebate_to_offer,
                pic_name: this.props.pic_name,
                pic_contact_number: this.props.pic_contact_number,
                group_id: this.props.selected_mg_id,
                i_confirm: 1,
                bank_reference_number: this.props.bank_reference_number,
                current_password2: this.props.current_password2,
                country_id: this.props.selected_country_id,
                country_location_id: this.props.selected_state_id,
                country_location_id_2: this.props.selected_area_id,
                contact_country_id: this.props.selected_country_id,
                company_bank: this.props.selected_comp_bank_id,
                remark: this.props.remark,
                company_logo_attachment: this.state.comp_logo_imgPathText,
                comp_mime: this.state.comp_logo_mime,
                comp_filename: this.state.comp_logo_filename,
                name_card_attachment: this.state.comp_nc_imgPathText,
                namecard_mime: this.state.comp_nc_mime,
                namecard_filename: this.state.comp_nc_filename,
                receipt: this.state.comp_bank_slip_imgPathText,
                receipt_mime: this.state.comp_bank_slip_mime,
                receipt_filename: this.state.comp_bank_slip_filename,
                ssm_attachment: this.state.comp_ssm_imgPathText,
                ssm_mime: this.state.comp_ssm_mime,
                ssm_filename: this.state.comp_ssm_filename,
                invoice: this.state.comp_supp_document_imgPathText,
                invoice_mime: this.state.comp_supp_document_mime,
                invoice_filename: this.state.comp_supp_document_filename,
            };

            this.props.referNewMerchantSubmit(submitParams);
        }
        else {
            this.refs.toast.show(strings('actions.completed_confirm'), DURATION.LENGTH_LONG);
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
                                {strings('actions.refer_new_merchant')}
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
                                    marginTop: -40,
                                }}
                            >
                                <Image
                                    source={require('../../../../../../assets/images/actions/refer_new_merchant_logo.png')}
                                    style={{ width: 80, height: 80 }}
                                />
                            </View>

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
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_company_name')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'name',
                                                    value: text,
                                            })}
                                            value={this.props.name}
                                        />
                                    </View>
                                </Item>
                            </View>
                            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                                <Text
                                    style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                                >
                                    {strings('actions.refer_company_name_desp')}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE,
                                            flexDirection: 'row'
                                        }}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openCompLogoImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderCompLogoImgPathText()}
                                            </Text>
                                        </View>
                                    </View>
                                </Item>

                            </View>

                            {this.renderCompLogoImg()}

                            <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
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
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_email_address')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'email',
                                                    value: text,
                                            })}
                                            value={this.props.email}
                                        />
                                    </View>
                                </Item>
                            </View>

                            {this.renderNOBSpinner()}

                            {this.renderMerchantGroupSpinner()}

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
                                            keyboardType={'numeric'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_to_offer')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'rebate_to_offer',
                                                    value: text,
                                            })}
                                            value={this.props.rebate_to_offer}
                                        />
                                    </View>
                                </Item>
                            </View>
                            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                                <Text
                                    style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                                >
                                    {strings('actions.referto_offer_descp1')}
                                </Text>
                                <Text
                                    style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                                >
                                    {strings('actions.refer_to_offer_descp2')}
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE,
                                            flexDirection: 'row'
                                        }}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openCompNameCardImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderCompNamecardImgPathText()}
                                            </Text>
                                        </View>
                                    </View>
                                </Item>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE,
                                            flexDirection: 'row'
                                        }}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openCompSSMImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderCompSSMImgPathText()}
                                            </Text>
                                        </View>
                                    </View>
                                </Item>
                            </View>
                            <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                                <Text
                                    style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                                >
                                    {strings('actions.refer_ssm_desc')}
                                </Text>
                            </View>

                            {this.renderLocationSpinner()}

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
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_person_inchargeName')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'pic_name',
                                                    value: text,
                                            })}
                                            value={this.props.pic_name}
                                        />
                                    </View>
                                </Item>
                            </View>

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
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_person_inchargeContact')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'pic_contact_number',
                                                    value: text,
                                            })}
                                            value={this.props.pic_contact_number}
                                        />
                                    </View>
                                </Item>
                            </View>

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
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_remark')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'remark',
                                                    value: text,
                                            })}
                                            value={this.props.remark}
                                        />
                                    </View>
                                </Item>
                            </View>

                            {this.renderCompBankSpinner()}

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
                                            keyboardType={'numeric'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('actions.refer_company_bank_reference_num')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text =>
                                                this.props.globalActionsFormUpdate({
                                                    props: 'bank_reference_number',
                                                    value: text,
                                            })}
                                            value={this.props.bank_reference_number}
                                        />
                                    </View>
                                </Item>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE,
                                            flexDirection: 'row'
                                        }}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openCompBankSlipImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderCompBankSlipImgPathText()}
                                            </Text>
                                        </View>
                                    </View>
                                </Item>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            borderWidth: 2,
                                            borderColor: CLR_WHITE,
                                            marginRight: 10,
                                            borderRadius: 5,
                                            backgroundColor: CLR_WHITE,
                                            flexDirection: 'row'
                                        }}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openCompSuppDocImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderCompSuppDocImgPathText()}
                                            </Text>
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
                        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                            <Text
                                style={{ textAlign: 'center', fontSize: 14 }}
                            >
                                {strings('actions.refer_currentWPassword_descp')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column',}}>
                            <Item style={styles.itemRowContainerStyle}>
                                <CheckBox
                                    checked={this.state.confirmedInformation}
                                    color="green"
                                    onPress={() => this.setState({ confirmedInformation: !this.state.confirmedInformation })}
                                />
                                <Body style={{ paddingLeft: 10, marginLeft: 10 }}>
                                    <Text style={{ fontSize: 14, color: CLR_WHITE }}>{strings('actions.refer_confirmation')}</Text>
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
                                    onPress={this.onSubmitReferNewMerchantRequest.bind(this)}
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
    reminderTextRedStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: CLR_RED,
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
        selected_phone_ext_id: state.global_forms.selected_phone_ext_id,
        selected_nob_id: state.global_forms.selected_nob_id,
        selected_mg_id: state.global_forms.selected_mg_id,
        selected_comp_bank_id: state.global_forms.selected_comp_bank_id,
        name: state.global_forms.name,
        email: state.global_forms.email,
        rebate_to_offer: state.global_forms.rebate_to_offer,
        pic_name: state.global_forms.pic_name,
        pic_contact_number: state.global_forms.pic_contact_number,
        bank_reference_number: state.global_forms.bank_reference_number,
        current_password2: state.global_forms.current_password2,
        remark: state.global_forms.remark,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    globalActionsFormUpdate,
    globalFormUpdateCountryOptionSelected,
    globalFormUpdateStateOptionSelected,
    globalFormUpdateAreaOptionSelected,
    globalFormsClearAll,
    globalFormUpdateNOBOptionSelected,
    globalFormUpdateMerchantGroupOptionSelected,
    globalFormUpdateCompBankOptionSelected,
    globalFormsUpdatephoneExtOptionSelected,
    referNewMerchantSubmit,
})(ReferNewMerchantComponent);
