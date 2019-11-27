import React, { Component, PropTypes } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-crop-picker';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { Container, Header, Title, Content, Footer, Picker, Input,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK, CLR_GREY, CLR_DARK_GREY,
    CLR_LIGHT_GREY, CLR_FB, CLR_TIFFANY_BLUE
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { MBonusHorizontalLine } from '../../../../../commons/HorizontalLine';
import { changeSettingsLocalization, userProfileFormUpdate,
    userProfileUpdateCountryOptionSelected,
    userProfileUpdateStateOptionSelected,
    userProfileUpdateAreaOptionSelected,
    userProfileUpdatephoneExtOptionSelected, userProfleUpdateSubmit,
    userUpdateClearAll, userProfileUpdateIsRefreshing
} from '../../../../../../controllers/actions';

import { getCountryOptions, getStateOptions, getAreaOptions,
} from '../../../../../../utility/networking/MBonusUnAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserMyProfileUpdateComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            isLoading: false,
            isRefreshing: false,
            userDetails: this.props.navigation.getParam('userFullData'),
            isPersonalInfoSection: true,
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            phone_ext_list: [],
            DoBText: '',
            DoBHolder: null,
            imgPathText: '',
            imgDisplayPathText: '',
            mime: '',
            filename: '',
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
        this.getCountryOptionList();
    }

    componentDidUpdate() {
        if(this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
            setTimeout(() => {
                this.props.userUpdateClearAll();
                this.props.userProfileUpdateIsRefreshing(true);
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

    DoBPickerMainFunctionCall = () => {

          let DateHolder = this.state.DoBHolder;

          if(!DateHolder || DateHolder == null){

            DateHolder = new Date();
            this.setState({
              DoBHolder: DateHolder
            });
          }

          //To open the dialog
          this.refs.DoBPickerDialog.open({

            date: DateHolder,

          });
    }

    onDoBPickedFunction = (date) => {
        this.setState({
            DoBText: moment(date).format('YYYY-MM-DD')
        });
        this.props.userProfileFormUpdate({
            props: 'date_of_birth',
            value: moment(date).format('YYYY-MM-DD'),
        })
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

                this.state.country_options_list.map((member, key) => {

                    if (this.state.userDetails.country_id === member.name) {
                        this.props.userProfileUpdateCountryOptionSelected(member.id);
                        this.props.userProfileUpdateStateOptionSelected(
                            this.state.userDetails.state_id);
                        this.props.userProfileUpdateAreaOptionSelected(
                            this.state.userDetails.area_id);
                        this.props.userProfileUpdatephoneExtOptionSelected(this.state.userDetails.contact_country_id);
                        console.log(`how ${this.props.selected_country_id}`);
                        this.getStateOptionList(this.props.selected_country_id);
                        this.getAreaOptionList(
                            this.props.selected_country_id,
                            this.props.selected_state_id
                        );
                        console.log(`found match ${member.id}`);
                    }
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
        this.props.userProfileUpdatephoneExtOptionSelected(value);
        // console.log(`selected phone ext id ${value}`);
    }

    // Country Options
    onSelectedCountry(value) {
        /*
        this.props.userProfileUpdateCountryOptionSelected(value);
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

        this.getStateOptionList(value);*/
    }

    // State Options
    onSelectedState(value) {
        this.props.userProfileUpdateStateOptionSelected(value);
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
        this.props.userProfileUpdateAreaOptionSelected(value);
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
        /*
        if (this.props.loading) {
            return (
                <MBonusSpinner
                    size={35}
                    type='Wave'
                    color='CLR_TIFFANY_BLUE'
                />
            );
        }*/
    }


    goBackNClear() {
        this.props.userUpdateClearAll();
        this.props.navigation.goBack();
    }

    selectedDifferentSection() {
        this.setState({
            isPersonalInfoSection: !this.state.isPersonalInfoSection,
        });
    }

    openImgPickerCropperActions() {
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
                imgPathText: image.path,
                imgDisplayPathText: imgDisplayPath,
                mime: image.mime,
                filename: image.filename ? image.filename : (image.mime === 'image/jpeg' ? 'my-avatar.jpg' : 'my-avatar.png')
            });
        });
    }

    // submit Register request
    onSubmitUserProfileUpdateRequest = () => {
        console.log(this.props);
        const submitParams = {
            email: this.props.email ? this.props.email : this.state.userDetails.email,
            name: this.props.name ? this.props.name : this.state.userDetails.name,
            current_password2: this.props.current_password2,
            country_id: this.props.selected_country_id,
            contact_number: this.props.contact_number ? this.props.contact_number : this.state.userDetails.contact_number_plain,
            country_location_id: this.props.selected_state_id,
            country_location_id_2: this.props.selected_area_id,
            contact_country_id: this.props.selected_country_id ,
            address: this.props.address ? this.props.address : this.state.userDetails.address,
            date_of_birth: this.props.date_of_birth ? this.props.date_of_birth : this.state.userDetails.date_of_birth,
            new_password: this.props.new_password,
            new_password_confirmation: this.props.new_password_confirmation,
            new_wallet_password: this.props.new_wallet_password,
            new_wallet_password_confirmation: this.props.new_wallet_password_confirmation,
            avatar: this.state.imgPathText,
            mime: this.state.mime,
            filename: this.state.filename,
            agree: 1
        };
        console.log('check');
        console.log(this.props);
        console.log('check');
        console.log(submitParams);
        this.props.userProfleUpdateSubmit(submitParams);
    }


    renderLocationSpinner() {
        const { roundedRowBtnViewStyle, merchantTopBtnStyle, countryLocationPickerStyle,

        } = styles;

        return (
                <View>
                <Item style={roundedRowBtnViewStyle}>
                    <Button
                        style={merchantTopBtnStyle}

                    >
                        <View style={{ flex: 0.3, marginLeft: 10 }}>
                            <Text>{strings('picker.country')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={false}
                              placeholder="Select Country"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_TIFFANY_BLUE }}
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
                            <Text>{strings('picker.state')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select State"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_TIFFANY_BLUE }}
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
                            <Text>{strings('picker.area')}</Text>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <Picker
                              mode="dropdown"
                              enabled={true}
                              placeholder="Select Area"
                              iosIcon={<Icon name="ios-arrow-down-outline" />}
                              placeholder={strings('picker.please_select')}
                              textStyle={{ color: CLR_TIFFANY_BLUE }}
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

    renderDoBText() {
        if (this.state.DoBText) {
            return this.state.DoBText;
        }
        else {
            if (this.state.date_of_birth) {
                return this.state.date_of_birth;
            }
            else {
                if(this.state.userDetails.date_of_birth) {
                    return this.state.userDetails.date_of_birth;
                }
                return strings('user_profile.dob');
            }
        }
    }

    renderImgPathText() {
        if (this.state.imgDisplayPathText) {
            return this.state.imgDisplayPathText;
        }
        else {
            return strings('user_profile.profile_img');
        }
    }


    renderSectionContent() {
        const { roundedRowBtnViewStyle, inputTextFieldStyle } = styles;

        if (this.state.isPersonalInfoSection === true) {
            return (
                <View style={{ flex: 1 }}>

                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('register.email')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'email',
                                    value: text,
                                })}
                                value={this.state.userDetails.email}
                            />
                        </View>
                    </Item>

                    {this.renderLocationSpinner()}

                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                multiline
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('user_profile.address')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'address',
                                    value: text,
                                })}
                                value={this.state.userDetails.address}
                            />
                        </View>
                    </Item>
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
                                    onChangeText={text => this.props.userProfileFormUpdate({
                                        props: 'contact_number',
                                        value: text,
                                    })}
                                    value={this.state.userDetails.contact_number_plain}
                                />
                            </Item>
                        </View>
                    </View>

                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                editable={false}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('register.ic_number_passport_number')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'name',
                                    value: text,
                                })}
                                value={this.state.userDetails.national_id}
                            />
                        </View>
                    </Item>
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <Text
                            style={{ textAlign: 'center', fontSize: 14}}
                        >
                            {strings('register.register_nationalID_reminder')}
                        </Text>
                    </View>

                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                editable={false}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('actions.register_gender')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'gender',
                                    value: text,
                                })}
                                value={this.state.userDetails.gender}
                            />
                        </View>
                    </Item>

                    <Item style={roundedRowBtnViewStyle}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={this.DoBPickerMainFunctionCall.bind(this)}
                        >
                            <View style={{ flex: 1, flexDirection: 'column', height: 45 }}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text
                                       style={styles.datePickerText}>
                                       {this.renderDoBText()}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Item>

                    <DatePickerDialog
                        ref="DoBPickerDialog"
                        onDatePicked={this.onDoBPickedFunction.bind(this)}
                    />
                </View>
            );
        }
        else {
            return (
                <View>
                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                secureTextEntry
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('user_profile.new_password')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'new_password',
                                    value: text,
                                })}
                                value={this.props.new_password}
                            />
                        </View>
                    </Item>
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <Text
                            style={{ textAlign: 'center', fontSize: 14}}
                        >
                            {strings('user_profile.password_reminder')}
                        </Text>
                    </View>
                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                secureTextEntry
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('user_profile.new_password_confirmation')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'new_password_confirmation',
                                    value: text,
                                })}
                                value={this.props.new_password_confirmation}
                            />
                        </View>
                    </Item>
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <Text
                            style={{ textAlign: 'center', fontSize: 14}}
                        >
                            {strings('user_profile.password_reminder')}
                        </Text>
                    </View>
                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                secureTextEntry
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('user_profile.new_wallet_password')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'new_wallet_password',
                                    value: text,
                                })}
                                value={this.props.new_wallet_password}
                            />
                        </View>
                    </Item>
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <Text
                            style={{ textAlign: 'center', fontSize: 14}}
                        >
                            {strings('user_profile.password_reminder')}
                        </Text>
                    </View>
                    <Item style={roundedRowBtnViewStyle}>
                        <View style={{ flex: 1, flexDirection: 'column'}}>
                            <Input
                                secureTextEntry
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                placeholder={strings('user_profile.new_wallet_password_confirmation')}
                                style={inputTextFieldStyle}
                                onChangeText={text => this.props.userProfileFormUpdate({
                                    props: 'new_wallet_password_confirmation',
                                    value: text,
                                })}
                                value={this.props.new_wallet_password_confirmation}
                            />
                        </View>
                    </Item>
                    <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 20 }}>
                        <Text
                            style={{ textAlign: 'center', fontSize: 14}}
                        >
                            {strings('user_profile.password_reminder')}
                        </Text>
                    </View>
                </View>
            );
        }

    }

    render() {
        const { userDetails } = this.state;
        const { merchantMainContainer, profileTitleTextStyle, roundedRowBtnViewStyle,
            browseButtonStyle, browseButtonTextStyle, inputTextFieldStyle, updateBtnStyle,
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('user_profile.profile_update')}
                    goBackAction={() => this.goBackNClear()}
                />
                <ImageBackground
                    source={require('../../../../../../assets/images/me/me_editprofile_bg.png')}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <Content
                        style={{ flex: 1 }}
                    >
                        <View
                        style={{ flex: 1, padding: 20, marginBottom: 50 }}
                        >
                            <View style={{ flex: 1, alignItems: 'center'}}>
                                <Text style={profileTitleTextStyle}>
                                    {strings('user_profile.title')}
                                </Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <ImageLoad
                                    style={{ width: 200, height: 200 }}
                                    loadingStyle={{ size: 'large', color: 'blue' }}
                                    placeholderSource={require('../../../../../../assets/images/me/me_icon.png')}
                                    placeholderStyle={{ width: 200, height: 200 }}
                                    source={{ uri: this.state.imgPathText ? this.state.imgPathText : userDetails.avatar }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={{ flex: 0.3 }}
                                            onPress={this.openImgPickerCropperActions.bind(this)}
                                        >

                                            <View style={browseButtonStyle}>
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.browse')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <View style={{ flex: 0.7, justifyContent: 'center'}}>
                                            <Text
                                                style={{
                                                    paddingLeft: 5, textAlign: 'left',
                                                    fontSize: 14
                                                }}
                                            >
                                                {this.renderImgPathText()}
                                            </Text>
                                        </View>
                                    </View>
                                </Item>

                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.selectedDifferentSection.bind(this)}
                                        >
                                            <View
                                                style={{
                                                    padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.state.isPersonalInfoSection === true ?
                                                    CLR_DARK_GREY : CLR_LIGHT_GREY}}
                                            >
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.personal_info')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            onPress={this.selectedDifferentSection.bind(this)}
                                        >
                                            <View
                                                style={{
                                                    padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.state.isPersonalInfoSection === true ?
                                                    CLR_LIGHT_GREY : CLR_DARK_GREY}}
                                            >
                                                <Text style={browseButtonTextStyle}>
                                                    {strings('user_profile.password')}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </Item>

                            </View>
                            <View>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'column'}}>
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('login.username')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text => this.props.userProfileFormUpdate({
                                                props: 'username',
                                                value: text,
                                            })}
                                            value={this.state.userDetails.username}
                                        />
                                    </View>
                                </Item>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'column'}}>
                                        <Input
                                            editable={false}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('register.full_name_as_per_ic')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text => this.props.userProfileFormUpdate({
                                                props: 'name',
                                                value: text,
                                            })}
                                            value={this.state.userDetails.name}
                                        />
                                    </View>
                                </Item>
                            </View>

                            {this.renderSectionContent()}

                            <MBonusHorizontalLine />

                            <View>
                                <Item style={roundedRowBtnViewStyle}>
                                    <View style={{ flex: 1, flexDirection: 'column'}}>
                                        <Input
                                            secureTextEntry
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('user_profile.current_wallet_password')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text => this.props.userProfileFormUpdate({
                                                props: 'current_password2',
                                                value: text,
                                            })}
                                            value={this.props.current_password2}
                                        />
                                    </View>
                                </Item>

                                <Item style={roundedRowBtnViewStyle}>
                                    <Button
                                        style={{ flex: 1,
                                        backgroundColor: CLR_DARK_TIFFANY_BLUE, }}
                                        onPress={this.onSubmitUserProfileUpdateRequest.bind()}
                                    >

                                        <View style={{ flex: 1, alignItems: 'center'}}>
                                            <Text

                                            >
                                                {strings('user_profile.update')}
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
                    style={{backgroundColor:'black'}}
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
        backgroundColor: 'white',
    },
    profileTitleTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    roundedRowBtnViewStyle: {
        flex: 1,
        marginTop: 15,
        borderBottomWidth: 0,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
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
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 5,
        paddingBottom: 5,
    },
    merchantTopBtnStyle: {
        flex: 1,
        backgroundColor: CLR_FB,
    },
    countryLocationPickerStyle: {
        width: 350,
    },
    inputSpinnerTextFieldContainerStyle: {
        paddingTop: 3,
        paddingBottom: 3,
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
    datePickerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CLR_BLACK,

    },
    updateBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 35,
    },
};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
        loading: state.user_update.loading,
        selected_country_id: state.user_update.selected_country_id,
        selected_state_id: state.user_update.selected_state_id,
        selected_area_id: state.user_update.selected_area_id,
        phone_ext_id: state.user_update.selected_phone_ext_id,
        username: state.user_update.username,
        name: state.user_update.name,
        email: state.user_update.email,
        address: state.user_update.address,
        contact_number_plain: state.user_update.contact_number_plain,
        date_of_birth: state.user_update.date_of_birth,
        current_password2: state.user_update.current_password2,
        new_password: state.user_update.new_password,
        new_password_confirmation: state.user_update.new_password_confirmation,
        new_wallet_password: state.user_update.new_wallet_password,
        new_wallet_password_confirmation: state.user_update.new_wallet_password_confirmation,
        errorMsg: state.user_update.errorMsg,
        successMsg: state.user_update.successMsg,
        isRefreshing: state.user_update.isRefreshing,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
    userProfileFormUpdate,
    userProfileUpdateCountryOptionSelected,
    userProfileUpdateStateOptionSelected,
    userProfileUpdateAreaOptionSelected,
    userProfileUpdatephoneExtOptionSelected,
    userProfleUpdateSubmit,
    userUpdateClearAll,
    userProfileUpdateIsRefreshing
})(UserMyProfileUpdateComponent);
