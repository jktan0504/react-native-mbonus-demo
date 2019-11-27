import React, {Component} from 'react';
import { Image, View, Linking, Text, TouchableOpacity, Platform, PermissionsAndroid,
} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../utility/constants';

class CountryStateIcons extends Component {

    constructor(props) {
        super(props);
        console.log('From CountryStateIcons');
        console.log(this.props.countryFlag);
    }

    renderCountryFlag() {
        if (this.props.countryFlag === 'India') {
            return (
                <Image
                    source={require('../../../assets/images/locations/flag_indonesia.png')}
                    style={styles.flagIconStyle}
                />
            );
        }
        else if (this.props.countryFlag === 'Indonesia') {
            return (
                <Image
                    source={require('../../../assets/images/locations/flag_indonesia.png')}
                    style={styles.flagIconStyle}
                />
            );
        }
        else if (this.props.countryFlag === 'Malaysia') {
            return (
                <Image
                    source={require('../../../assets/images/locations/flag_malaysia.png')}
                    style={styles.flagIconStyle}
                />
            );
        }
        else {
            return (
                <Image
                    source={require('../../../assets/images/locations/flag_malaysia.png')}
                    style={styles.flagIconStyle}
                />
            );
        }
    }

    renderStateFlag() {
        switch (this.props.stateFlag) {
            case 'JOHOR':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_johor.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'KEDAH':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_kedah.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'KELANTAN':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_kelantan.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'MELAKA':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_melaka.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'NEGERI SEMBILAN':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_negeri_9.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'PAHANG':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_pahang.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'PENANG':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_penang.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'PERLIS':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_perlis.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'SABAH':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_sabah.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'SARAWAK':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_sarawak.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'SELANGOR':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_selangor.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'TERENGANU':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_terenganu.png')}
                        style={styles.flagIconStyle}
                    />
                );
            case 'KUALA LUMPUR':
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_wilayah_persekutuan.png')}
                        style={styles.flagIconStyle}
                    />
                );
            default:
                return (
                    <Image
                        source={require('../../../assets/images/locations/flag_wilayah_persekutuan.png')}
                        style={styles.flagIconStyle}
                    />
                );
        }
    }

    render() {
        const { mainContainerStyle } = styles;
        return (

            <View
                style={mainContainerStyle}
            >
                <View
                    style={{ paddingRight: 10 }}
                >
                    {this.renderCountryFlag()}
                </View>
                <View
                    style={{ paddingRight: 10 }}
                >
                    {this.renderStateFlag()}
                </View>
            </View>
        );
    }
}

const styles = {
    mainContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 5,
    },
    flagIconStyle: {
        width: 35,
        height: 25,
        paddingRight: 10,
    },
};


export { CountryStateIcons };
