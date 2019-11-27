import React, {Component} from 'react';
import { Platform, Dimensions, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { Container, Content, Text, CheckBox, Picker,
        Header, Left, Button, Icon, Body, Title, Right, Form, Item, Input
} from 'native-base';
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { phoneExtOptionSelected, getPhoneExtOptionSubmit, countryOptionSelected,
    stateOptionSelected, areaOptionSelected, userRegisterFormUpdate, userRegisterSubmit,
} from '../../../../controllers/actions';
import { MBonusSpinner } from '../../../commons/Spinner';
import { MBonusHorizontalLine } from '../../../commons/HorizontalLine';
import { GoBackHeader } from '../../../commons';
// localize
import { strings } from '../../../../../locales/i18n';
// Colors
import { CLR_TIFFANY_BLUE, CLR_WHITE, CLR_BLACK, CLR_DARK_TIFFANY_BLUE, CLR_RED,
} from '../../../../utility/constants';
import { getPhoneExtOptions, getCountryOptions, getStateOptions, getAreaOptions,
} from '../../../../utility/networking/MBonusUnAuthServices';

class RegisterComponent extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            selected: undefined,
            phone_ext_list: [],
            country_options_list: [],
            state_options_list: [],
            area_options_list: [],
            username: '',
            checked: false,
            checkedForTnc: false,
            introducerTextFieldDisableHolder: false
        });
    }

    // Re-render
    componentWillMount() {
        // Running Async Task
        // Getting Phone Ext
        // this.getPhoneExtOptionList();
        this.getCountryOptionList();
    }

    componentDidUpdate() {
        if(this.props.successMsg) {
            this.refs.toast.show(this.props.successMsg, DURATION.LENGTH_LONG);
            setTimeout(() => {
                this.props.navigation.navigate('Login_Route')
            }, 1000);

        }
        if (this.props.errorMsg) {
            this.refs.toast.show(this.props.errorMsg, DURATION.LENGTH_LONG);
        }
    }

    getPhoneExtOptionList = () => {
        getPhoneExtOptions()
            .then((countries) => {
                console.log('from mbonus');
                this.setState({
                    phone_ext_list: countries.data.model
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    phone_ext_list: []
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
                    phone_ext_list: [],
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
    // Phone Ext
    onSelectedPhoneExt(value) {
        this.props.phoneExtOptionSelected(value);
        // console.log(`selected phone ext id ${value}`);
    }

    // Country Options
    onSelectedCountry(value) {
        this.props.countryOptionSelected(value);
        console.log(`selected country ext id ${value}`);
        this.setState({
            state_options_list: [],
            area_options_list: [],
        });
        this.getStateOptionList(value);
    }

    // State Options
    onSelectedState(value) {
        this.props.stateOptionSelected(value);
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
        this.props.areaOptionSelected(value);
        console.log(`selected area id ${value}`);
    }

    // no introducer
    checkedForNoIntroducer() {
        this.setState({
            checked: !this.state.checked,
        });
        this.props.userRegisterFormUpdate({
            props: 'introducer',
            value: '',
        });
    }

    checkedForReadTNC() {
        this.setState({
            checkedForTnc: !this.state.checkedForTnc,
        });
    }

    // submit Register request
    onSubmitRegisterRequest() {
        console.log(`country_id: ${this.props.selected_country_id}
            state_id: ${this.props.selected_state_id} &&
            area_id: ${this.props.selected_area_id}
            `);
        const getNoReferralCheckValue = this.state.checked ? 1 : 0;
        const submitParams = {
            referral: this.props.introducer,
            no_referrer: getNoReferralCheckValue,
            name: this.props.full_name,
            national_id: this.props.ic_num,
            contact_number: this.props.contact_number,
            email: this.props.email,
            country_id: this.props.selected_country_id,
            contact_country_id: this.props.selected_country_id ,
            country_location_id: this.props.selected_state_id,
            country_location_id_2: this.props.selected_area_id,
            username: this.props.username,
            password: this.props.login_password,
            password_confirmation: this.props.login_password_confirmation,
            password2: this.props.wallet_password,
            password2_confirmation: this.props.wallet_password_confirmation,
            agree: 1
        };
        console.log(getNoReferralCheckValue);
        if (!this.state.checkedForTnc) {
            this.refs.toast.show(strings('tnc.please_read_tnc'), DURATION.LENGTH_LONG);
        }
        else if (!this.state.checked && (this.props.introducer).trim() < 0) {
            this.refs.toast.show('Please added introducer or select no introducer', DURATION.LENGTH_LONG);
        }
        else {
            this.props.userRegisterSubmit(submitParams);
        }
    }

    // onUserNameTypingChangedText
    onUserNameTypingChangedText(value) {
        const onlyLettersAndNumbers = /(^[a-zA-Z0-9]+$)/;
        if(onlyLettersAndNumbers.test(value) === true) {
            this.setState({
                username: value
            });
            console.log('MATCH FOUND');
        }
    }


    renderPhoneExtItems() {
        if(this.props.phone_ext_lists.length > 0) {
            console.log(this.props.phone_ext_lists.length);
            this.props.phone_ext_lists.map((member, key) => {
                console.log(member);
                console.log(member['name']);
                console.log(member['model']['ext']);
                return (
                         <Picker.Item label='TEST' value={member['id']} key={member['model']['ext']} />
                      );
                  });
        }
    }

    renderSpinner() {
        if (this.props.loading) {
            console.log('loading now ...');
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
        const { mainContentContainer, mainViewContentContainer, mainFormContainerStyle,
                inputTextFieldContainerStyle, inputTextFieldStyle, itemRowContainerStyle,
                reminderTextStyle, dontHaveReferralTextStyle, inputSpinnerTextFieldContainerStyle,
                contactFieldLeftStyle, contactFieldRightStyle, contactInputTextFieldLeftStyle,
                contactInputTextFieldRightStyle, reminderTextBlackStyle, reminderTextRedStyle,
                itemLocationPickerContainerStyle, inputTextFieldLargeContainerStyle,
                registerBtnContainerStyle, registerBtnStyle, alreadyHaveAccountTextContainerStyle,
                loginTextContainerStyle, alreadyHaveAccountTextStyle, alreadyHaveAccountLoginTextStyle,
                countryLocationPickerStyle
        } = styles;

        return (
            <Container style={mainContentContainer}>
                <GoBackHeader
                    headerTitle={strings('register.register')}
                    goBackAction={() => this.props.navigation.goBack()}
                />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                <ScrollView>
                    <View style={mainViewContentContainer}>
                        <Form style={mainFormContainerStyle} >
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.introducer')}
                                    style={inputTextFieldStyle}
                                    editable={!this.state.checked}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'introducer',
                                        value: text,
                                    })}
                                    value={this.props.introducer}
                                />
                            </Item>
                            <Text style={reminderTextStyle}>
                                {strings('register.please_ensure_introducer_is_correct')}
                            </Text>
                            <Item style={itemRowContainerStyle}>
                                <CheckBox
                                checked={this.state.checked}
                                onPress={this.checkedForNoIntroducer.bind(this)}
                                />
                                <Text style={dontHaveReferralTextStyle}>
                                    {strings('register.please_ensure_introducer_is_correct')}
                                </Text>
                            </Item>
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.full_name_as_per_ic')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'full_name',
                                        value: text,
                                    })}
                                    value={this.props.full_name}
                                />
                            </Item>
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.ic_number_passport_number')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'ic_num',
                                        value: text,
                                    })}
                                    value={this.props.ic_num}
                                />
                            </Item>
                            <View style={inputSpinnerTextFieldContainerStyle}>
                                <View style={contactFieldLeftStyle}>
                                    <Item rounded style={contactInputTextFieldLeftStyle}>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                                            placeholder="+60"
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
                                <View style={contactFieldRightStyle}>
                                    <Item rounded style={contactInputTextFieldRightStyle}>
                                        <Input
                                            keyboardType={'numeric'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            placeholder={strings('register.contact_number')}
                                            style={inputTextFieldStyle}
                                            onChangeText={text => this.props.userRegisterFormUpdate({
                                                props: 'contact_number',
                                                value: text,
                                            })}
                                            value={this.props.contact_number}
                                        />
                                    </Item>
                                </View>
                            </View>
                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.email')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'email',
                                        value: text,
                                    })}
                                    value={this.props.email}
                                />
                            </Item>
                            <Text style={reminderTextBlackStyle}>
                                {strings('register.register_nationalID_reminder')}
                            </Text>
                            <MBonusHorizontalLine />

                            <Item rounded style={itemLocationPickerContainerStyle}>
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
                                      textStyle={{ color: "#5cb85c" }}
                                      itemStyle={{
                                        backgroundColor: "#d3d3d3",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                      }}
                                      itemTextStyle={{ color: '#788ad2' }}
                                      style={countryLocationPickerStyle}
                                      selectedValue={this.props.selected_country_id}
                                      onValueChange={this.onSelectedCountry.bind(this)}
                                    >
                                    {this.state.country_options_list.map((member, key) => {

                                        return (
                                             <Picker.Item label={member.name} value={member.id} key={member.name} />
                                        );
                                    })}

                                    </Picker>
                                </View>
                            </Item>

                            <Text style={reminderTextRedStyle}>
                                {strings('picker.country_reminder')}
                            </Text>

                            <Item rounded style={itemLocationPickerContainerStyle}>
                                <View style={{ flex: 0.3, marginLeft: 10 }}>
                                    <Text>{strings('picker.state')}</Text>
                                </View>
                                <View style={{ flex: 0.7 }}>
                                    <Picker
                                      mode="dropdown"
                                      placeholder="Select State"
                                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                                      placeholder={strings('picker.please_select')}
                                      textStyle={{ color: "#5cb85c" }}
                                      itemStyle={{
                                        backgroundColor: "#d3d3d3",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                      }}
                                      itemTextStyle={{ color: '#788ad2' }}
                                      style={countryLocationPickerStyle}
                                      selectedValue={this.props.selected_state_id}
                                      onValueChange={this.onSelectedState.bind(this)}
                                    >
                                    {this.state.state_options_list.map((member, key) => {

                                        return (
                                             <Picker.Item label={member.name} value={member.id} key={member.name} />
                                        );
                                    })}
                                    </Picker>
                                </View>
                            </Item>

                            <Item rounded style={itemLocationPickerContainerStyle}>
                                <View style={{ flex: 0.3, marginLeft: 10 }}>
                                    <Text>{strings('picker.area')}</Text>
                                </View>
                                <View style={{ flex: 0.7 }}>
                                    <Picker
                                      mode="dropdown"
                                      placeholder="Select Area"
                                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                                      placeholder={strings('picker.please_select')}
                                      textStyle={{ color: "#5cb85c" }}
                                      itemStyle={{
                                        backgroundColor: "#d3d3d3",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                      }}
                                      itemTextStyle={{ color: '#788ad2' }}
                                      style={countryLocationPickerStyle}
                                      selectedValue={this.props.selected_area_id}
                                      onValueChange={this.onSelectedArea.bind(this)}
                                    >
                                    {this.state.area_options_list.map((member, key) => {

                                        return (
                                             <Picker.Item label={member.name} value={member.id} key={member.name} />
                                        );
                                    })}
                                    </Picker>
                                </View>
                            </Item>

                            <MBonusHorizontalLine />

                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('login.username')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'username',
                                        value: text,
                                    })}
                                    value={this.props.username}
                                />
                            </Item>

                            <Text style={reminderTextBlackStyle}>
                                {strings('register.register_username_reminder')}
                            </Text>

                            <Item rounded style={inputTextFieldLargeContainerStyle}>
                                <Input
                                    secureTextEntry
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.login_password')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'login_password',
                                        value: text,
                                    })}
                                    value={this.props.login_password}
                                />
                            </Item>

                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    secureTextEntry
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.login_password_confirmation')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'login_password_confirmation',
                                        value: text,
                                    })}
                                    value={this.props.login_password_confirmation}
                                />
                            </Item>

                            <Item rounded style={inputTextFieldLargeContainerStyle}>
                                <Input
                                    secureTextEntry
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.wallet_password')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'wallet_password',
                                        value: text,
                                    })}
                                    value={this.props.wallet_password}
                                />
                            </Item>

                            <Item rounded style={inputTextFieldContainerStyle}>
                                <Input
                                    secureTextEntry
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={strings('register.wallet_password_confirmation')}
                                    style={inputTextFieldStyle}
                                    onChangeText={text => this.props.userRegisterFormUpdate({
                                        props: 'wallet_password_confirmation',
                                        value: text,
                                    })}
                                    value={this.props.wallet_password_confirmation}
                                />
                            </Item>

                            <Item style={itemRowContainerStyle}>
                                <CheckBox
                                checked={this.state.checkedForTnc}
                                onPress={this.checkedForReadTNC.bind(this)}
                                />
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('TNC_Route')}
                                >
                                    <Text style={dontHaveReferralTextStyle}>
                                        {strings('tnc.read_accept_tnc')}
                                    </Text>
                                </TouchableOpacity>
                            </Item>

                            <Item style={registerBtnContainerStyle}>
                                <Button
                                    rounded
                                    style={registerBtnStyle}
                                    onPress={this.onSubmitRegisterRequest.bind(this)}
                                >
                                    <Text>{strings('register.register')}</Text>
                                </Button>
                            </Item>

                            <Item style={alreadyHaveAccountTextContainerStyle}>
                                <View style={loginTextContainerStyle}>
                                    <Text
                                        style={alreadyHaveAccountTextStyle}
                                    >
                                        {strings('register.already_have_account')}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        <Text style={alreadyHaveAccountLoginTextStyle}>
                                            {strings('login.login')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Item>

                        </Form>

                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
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
    mainContentContainer: {
        flex: 1,
        backgroundColor: CLR_TIFFANY_BLUE
    },
    mainViewContentContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    mainFormContainerStyle: {
        flex: 1,
    },
    inputTextFieldContainerStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: CLR_WHITE,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
    },
    inputTextFieldLargeContainerStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: CLR_WHITE,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
    },
    inputSpinnerTextFieldContainerStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        flexDirection: 'row',
    },
    inputTextFieldStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    itemRowContainerStyle: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    reminderTextStyle: {
        paddingTop: 3,
        textAlign: 'center',
        fontSize: 12,
        color: 'red',
    },
    dontHaveReferralTextStyle: {
        fontSize: 13,
        marginLeft: 5,
    },
    contactFieldLeftStyle: {
        flex: 3
    },
    contactFieldRightStyle: {
        flex: 5
    },
    contactInputTextFieldLeftStyle: {
        backgroundColor: CLR_WHITE,
        height: 35,
    },
    contactInputTextFieldRightStyle: {
        backgroundColor: CLR_WHITE,
        height: 35,
        marginLeft: 10
    },
    reminderTextBlackStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 12,
        color: CLR_BLACK,
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
    itemLocationPickerContainerStyle: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0,
        backgroundColor: CLR_WHITE,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    registerBtnContainerStyle: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 40,
        marginRight: 40,
        borderBottomWidth: 0,
    },
    registerBtnStyle: {
        flex: 1,
        backgroundColor: CLR_DARK_TIFFANY_BLUE,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 35,
    },
    alreadyHaveAccountTextContainerStyle: {
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 30,
        borderBottomWidth: 0,
    },
    loginTextContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    alreadyHaveAccountTextStyle: {
        fontSize: 14,
    },
    alreadyHaveAccountLoginTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    countryLocationPickerStyle: {
        width: 350,
    }

};

const mapStateToProps = state => {
    const {
        introducer,
        i_don_have_introducer,
        full_name,
        ic_num,
        contact_number,
        email,
        username,
        login_password,
        login_password_confirmation,
        wallet_password,
        wallet_password_confirmation,
        i_have_read_tnc,
        loading,
        errorMsg,
        successMsg,
    } = state.auth_register;

    return {
        phone_ext_id: state.country.selected_phone_ext_id,
        selected_country_id: state.country.selected_country_id,
        selected_state_id: state.country.selected_state_id,
        selected_area_id: state.country.selected_area_id,
        introducer,
        i_don_have_introducer,
        full_name,
        ic_num,
        contact_number,
        email,
        username,
        login_password,
        login_password_confirmation,
        wallet_password,
        wallet_password_confirmation,
        i_have_read_tnc,
        loading,
        errorMsg,
        successMsg,
    };
};

export default connect(mapStateToProps, {
    phoneExtOptionSelected,
    getPhoneExtOptionSubmit,
    countryOptionSelected,
    stateOptionSelected,
    areaOptionSelected,
    userRegisterFormUpdate,
    userRegisterSubmit
 })(RegisterComponent);
