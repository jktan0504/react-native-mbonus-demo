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
    CLR_TELEGRAM, CLR_RED, CLR_TIFFANY_BLUE
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization, globalActionsFormUpdate,
        globalFormsClear_UsernameSuccess,
        globalFormUpdateCountryOptionSelected,
        globalFormUpdateStateOptionSelected,
        globalFormUpdateAreaOptionSelected,
        globalFormsUpdatephoneExtOptionSelected,
        globalFormsClearAll,
        registerNewMemberActionSubmit, registerNewMemberCheckUsernameSubmit,

} from '../../../../../../controllers/actions';
import { getAuthUserDetails
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';
import { getCountryOptions, getStateOptions, getAreaOptions,
} from '../../../../../../utility/networking/MBonusUnAuthServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class RegisterNewMemberComponent extends Component {

    constructor(props) {
        super(props);
        this.props.globalFormsClearAll();
        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            userDetails: [],
            isLoading: false,
            isRefreshing: false,
            verifiedMsg: '',
            verifiedMsgType: '',
            confirmedRegister: false,
            confirmedRead: false,
            lang: 'en',
            selectedAgent: false,
            selectedRegisterID: '',
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            phone_ext_list: [],
            selectedGenderID: 0,
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

    // Phone Ext
    onSelectedPhoneExt(value) {
        this.props.globalFormsUpdatephoneExtOptionSelected(value);
        console.log(`selected phone ext id ${value}`);
    }

    // Gender Options
    onSelectedGender(value) {
        console.log(`selected gender id ${value}`);
        this.setState({
            selectedGenderID: value,
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

    onLangSelected = (lang) => {
        this.setState({
            user_pref_language: lang
        });
        let selectedLang = '';
        switch (lang) {
            case 'cn':
                selectedLang = strings('language.zh');
                break;
            case 'en':
                selectedLang = strings('language.en');
                break;
        }
        this.refs.toast.show(`${selectedLang} ${strings('actions.register_selected_lang')}`, DURATION.LENGTH_LONG);
    }

    selectedDifferentRegisterType = (selectedID) => {
        this.setState({
            selectedAgent: !this.state.selectedAgent,
            selectedRegisterID: selectedID,
        });
        let selectedType = '';
        switch(selectedID) {
            case 2:
                selectedType = strings('actions.register_agent');
                break;
            case 1:
                selectedType = strings('actions.register_member');
                break;
        }
        this.refs.toast.show(`${selectedType} ${strings('actions.register_selected_lang')}`, DURATION.LENGTH_LONG);
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

    renderGenderSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text style={{ color: CLR_BLACK }}>{strings('picker.gender')}</Text>
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
                                selectedValue={this.state.selectedGenderID}
                                onValueChange={this.onSelectedGender.bind(this)}
                            >
                                <Picker.Item
                                   label={strings('picker.male')}
                                   value={0}
                                   key='male-0'
                                />
                                <Picker.Item
                                   label={strings('picker.female')}
                                   value={1}
                                   key='female-1'
                                />

                            </Picker>
                        </View>
                    </Button>
                </Item>

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
                            <Text  style={{ color: CLR_BLACK }}>{strings('picker.country')}</Text>
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
                                        key={member.id}
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
                            <Text  style={{ color: CLR_BLACK }}>{strings('picker.state')}</Text>
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
                                         value={member.id} key={member.id} />
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
                            <Text  style={{ color: CLR_BLACK }}>{strings('picker.area')}</Text>
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
                                         value={member.id} key={member.id} />
                                    );
                                })}

                            </Picker>
                        </View>
                    </Button>
                </Item>
            );
        }
    }

    onSubmitNewMemberServiceAction = () => {

        if (this.state.confirmedRegister === true &&
            this.state.verifiedMsgType === 1 &&
            this.state.confirmedRead === true
            /*
            && this.state.lang
            && this.state.selectedRegisterID
            && this.props.target_username
            && this.props.name
            && this.props.national_id
            && this.props.contact_number_plain
            && this.state.selectedGenderID
            && this.props.email
            && this.props.selected_country_id
            && this.props.selected_state_id
            && this.props.selected_area_id
            && this.props.phone_ext_id
            && this.props.new_password
            && this.props.new_password_confirmation
            && this.props.new_wallet_password
            && this.props.new_wallet_password_confirmation
            && this.props.current_password2*/
         ) {

            const submitParams = {
                i_confirm: 1,
                i_agree: 1,
                lang: this.state.lang,
                registration_type: this.state.selectedRegisterID,
                username: this.props.target_username,
                name: this.props.name,
                national_id: this.props.national_id,
                contact_number: this.props.contact_number_plain,
                gender: this.state.selectedGenderID,
                email: this.props.email,
                country_id: this.props.selected_country_id,
                country_location_id: this.props.selected_state_id,
                country_location_id_2: this.props.selected_area_id,
                contact_country_id: this.props.phone_ext_id,
                password: this.props.new_password,
                password_confirmation: this.props.new_password_confirmation,
                password2: this.props.new_wallet_password,
                password2_confirmation: this.props.new_wallet_password_confirmation,
                current_password2: this.props.current_password2,
            };


            this.props.registerNewMemberActionSubmit(submitParams);

        }
        else {
            const submitParams = {
                verifiedMsg: this.state.verifiedMsgType,
                i_confirm: this.state.confirmedRegister,
                i_agree: this.state.confirmedRead,
                lang: this.state.lang,
                registration_type: this.state.selectedRegisterID,
                username: this.props.target_username,
                name: this.props.name,
                national_id: this.props.national_id,
                contact_number: this.props.contact_number_plain,
                gender: this.state.selectedGenderID,
                email: this.props.email,
                country_id: this.props.selected_country_id,
                country_location_id: this.props.selected_state_id,
                country_location_id_2: this.props.selected_area_id,
                contact_country_id: this.props.phone_ext_id,
                password: this.props.new_password,
                password_confirmation: this.props.new_password_confirmation,
                password2: this.props.new_wallet_password,
                password2_confirmation: this.props.new_wallet_password_confirmation,
                current_password2: this.props.current_password2,
            };

            console.log(submitParams);

                this.refs.toast.show(strings('actions.completed_confirm'), DURATION.LENGTH_LONG);
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

            this.props.registerNewMemberCheckUsernameSubmit(submitParams);
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


    render() {

        const { merchantMainContainer, titleTextStyle, socialIconstyle, roundedRowBtnViewStyle,
            inputTextFieldStyle, myButtonStyle, myButtonTextStyle, socialTextstyle
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('actions.register_new_member')}
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/actions/green_bg.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content>
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
                            <Text
                                style={titleTextStyle}
                            >
                                {strings('actions.register_new_member')}
                            </Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                            <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end'
                                }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.onLangSelected('en')}
                                >
                                    <Image
                                        source={require('../../../../../../assets/images/actions/lang_eng.png')}
                                        style={socialIconstyle}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                            </View>
                            <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start'
                                }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.onLangSelected('cn')}
                                >
                                    <Image
                                        source={require('../../../../../../assets/images/actions/lang_zh.png')}
                                        style={socialIconstyle}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                            <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end'
                                }}
                            >
                                <Item style={roundedRowBtnViewStyle}>
                                    <Button
                                        style={{ flex: 1,
                                            backgroundColor:
                                            this.state.selectedRegisterID === 2 ?
                                            CLR_TELEGRAM : CLR_DARK_GREY,
                                        }}
                                        onPress={() => this.selectedDifferentRegisterType(2)}
                                    >
                                        <View
                                            style={{
                                                flex: 0.1,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Icon>
                                                <Image
                                                    source={require('../../../../../../assets/images/actions/reg_agent.png')}
                                                    style={{ width: 35, height: 35 }}
                                                />
                                            </Icon>
                                        </View>
                                        <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                            <Text
                                                style={socialTextstyle}
                                            >
                                                {strings('actions.register_agent')}
                                            </Text>
                                        </View>

                                    </Button>
                                </Item>
                            </View>

                            <View
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start'
                                }}
                            >
                                <Item style={roundedRowBtnViewStyle}>
                                    <Button
                                        style={{ flex: 1,
                                            backgroundColor:
                                            this.state.selectedRegisterID === 1 ?
                                            CLR_TELEGRAM : CLR_DARK_GREY,
                                        }}
                                            onPress={() => this.selectedDifferentRegisterType(1)}
                                    >
                                        <View
                                            style={{
                                                flex: 0.1,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Icon>
                                                <Image
                                                    source={require('../../../../../../assets/images/actions/reg_member.png')}
                                                    style={{ width: 35, height: 35 }}
                                                />
                                            </Icon>
                                        </View>
                                        <View style={{ flex: 0.9,  alignItems: 'center' }}>
                                            <Text
                                                style={socialTextstyle}
                                            >
                                                {strings('actions.register_member')}
                                            </Text>
                                        </View>

                                    </Button>
                                </Item>
                            </View>
                        </View>

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
                        </View>

                        {this.renderVerifiedUsername()}

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
                                        placeholder={strings('actions.register_user_fullname_nationalID')}
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
                                        placeholder={strings('actions.register_nationalID')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'national_id',
                                                value: text,
                                        })}
                                        value={this.props.national_id}
                                    />
                                </View>
                            </Item>
                        </View>

                        <View style={styles.inputSpinnerTextFieldContainerStyle}>
                            <View style={styles.contactFieldLeftStyle}>
                                <Item style={styles.contactInputTextFieldLeftStyle}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholder="+60"
                                         textStyle={{ fontWeight: 'bold' }}
                                        headerBackButtonText={strings('app.back')}
                                        style={{ width: 250 }}
                                        selectedValue={this.props.phone_ext_id}
                                        onValueChange={this.onSelectedPhoneExt.bind(this)}
                                    >
                                        {this.state.phone_ext_list.map((member, key) => {

                                            return (
                                                 <Picker.Item label={member.model.ext} value={member.model.id} key={member.name} />
                                            );
                                        })}
                                    </Picker>
                                </Item>
                            </View>
                            <View style={styles.contactFieldRightStyle}>
                                <Item style={styles.contactInputTextFieldRightStyle}>
                                    <Input
                                        keyboardType={'numeric'}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('register.contact_number')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'contact_number_plain',
                                                value: text,
                                        })}
                                        value={this.props.contact_number_plain}
                                    />
                                </Item>
                            </View>
                        </View>

                        {this.renderGenderSpinner()}

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
                                        placeholder={strings('actions.register_email')}
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
                                        secureTextEntry
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_login_password')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'new_password',
                                                value: text,
                                        })}
                                        value={this.props.new_password}
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
                                        secureTextEntry
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_login_password_confirmation')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'new_password_confirmation',
                                                value: text,
                                        })}
                                        value={this.props.new_password_confirmation}
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
                                        secureTextEntry
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_password2')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'new_wallet_password',
                                                value: text,
                                        })}
                                        value={this.props.new_wallet_password}
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
                                        secureTextEntry
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        placeholder={strings('actions.register_password2_Confirmation')}
                                        style={inputTextFieldStyle}
                                        onChangeText={text =>
                                            this.props.globalActionsFormUpdate({
                                                props: 'new_wallet_password_confirmation',
                                                value: text,
                                        })}
                                        value={this.props.new_wallet_password_confirmation}
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
                                style={{ textAlign: 'center', fontSize: 14, color: CLR_WHITE }}
                            >
                                {strings('actions.register_current_wallet_password_reminder')}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column',}}>
                            <Item style={styles.itemRowContainerStyle}>
                                <CheckBox
                                    checked={this.state.confirmedRegister}
                                    color="blue"
                                    onPress={() => this.setState({ confirmedRegister: !this.state.confirmedRegister })}
                                />
                                <Body style={{ paddingLeft: 10, marginLeft: 10 }}>
                                    <Text style={{ fontSize: 14, color: CLR_WHITE }}>{strings('actions.register_i_confirm')}</Text>
                                </Body>

                            </Item>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column',}}>
                            <Item style={styles.itemRowContainerStyle}>
                                <CheckBox
                                    checked={this.state.confirmedRead}
                                    color="blue"
                                    onPress={() => this.setState({ confirmedRead: !this.state.confirmedRead })}
                                />
                                <Body style={{ paddingLeft: 10, marginLeft: 10 }}>
                                    <Text style={{ fontSize: 14, color: CLR_WHITE }}>{strings('actions.register_I_read')}</Text>
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
                                    onPress={this.onSubmitNewMemberServiceAction.bind(this)}
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
        target_username: state.global_forms.target_username,
        targetUsernameSuccessMsg: state.global_forms.targetUsernameSuccessMsg,
        targetUsernameFailedMsg: state.global_forms.targetUsernameFailedMsg,
        selected_country_id: state.global_forms.selected_country_id,
        selected_state_id: state.global_forms.selected_state_id,
        selected_area_id: state.global_forms.selected_area_id,
        phone_ext_id: state.global_forms.selected_phone_ext_id,
        name: state.global_forms.name,
        national_id: state.global_forms.national_id,
        contact_number_plain: state.global_forms.contact_number_plain,
        email: state.global_forms.email,
        new_password: state.global_forms.new_password,
        new_password_confirmation: state.global_forms.new_password_confirmation,
        new_wallet_password: state.global_forms.new_wallet_password,
        new_wallet_password_confirmation: state.global_forms.new_wallet_password_confirmation,
        current_password2: state.global_forms.current_password2,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    globalActionsFormUpdate,
    globalFormUpdateCountryOptionSelected,
    globalFormUpdateStateOptionSelected,
    globalFormUpdateAreaOptionSelected,
    globalFormsUpdatephoneExtOptionSelected,
    globalFormsClearAll,
    registerNewMemberActionSubmit,
    globalFormsClear_UsernameSuccess,
    registerNewMemberCheckUsernameSubmit,
})(RegisterNewMemberComponent);
