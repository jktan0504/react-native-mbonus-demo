import React, {Component} from 'react';
import { Image, View, Alert } from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, CLR_WHITE, CLR_BLACK } from '../../../utility/constants';


class MainHeader extends Component {

    constructor(props) {
        super(props);
    }

    onOpenMBonusQRCode() {
        // Works on both iOS and Android
        /*
        Alert.alert(
          'QR Code',
          'Here is your QR Code',
          [
            { text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            { text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
      )*/


    }

    onOpenLanguageChanged() {
        Alert('Open Notification List');
    }

    onOpenNotificationLists() {
        Alert('Open Notification List');
    }

    onOpenCountryLocationSearch() {
        Alert('Open Location Search');
    }

    render() {
        const { navigate } = this.props.navigation;
        const { headerMainViewContainer, headerItemButtonStyle, headerIconImgStyle,
            headerBGStyles,
        } = styles;

        return (
            <Header style={headerBGStyles}>
                <Body>
                    <View style={headerMainViewContainer}>
                        <Button
                            transparent
                            style={headerItemButtonStyle}
                            onPress={() => navigate('My_QRCode')}
                        >
                            <Image
                                source={require('../../../assets/images/topBar/top_qr_icon.png')}
                                style={headerIconImgStyle}
                            />
                        </Button>
                        <Button
                            transparent
                            style={headerItemButtonStyle}
                            onPress={() => navigate('Localization')}
                        >
                            <Image
                                source={require('../../../assets/images/topBar/top_lang_icon.png')}
                                style={headerIconImgStyle}
                            />
                        </Button>
                        <Button
                            transparent
                            style={headerItemButtonStyle}
                            onPress={() => navigate('Notifications')}
                            // onPress={this.onOpenMBonusQRCode.bind(this)}
                        >
                            <Image
                                source={require('../../../assets/images/topBar/top_notification_icon.png')}
                                style={headerIconImgStyle}
                            />
                        </Button>
                    </View>
                </Body>
                <Right>
                    <Button
                        transparent
                        style={{ flex: 1 }}
                        onPress={() => navigate('Merchant_sub_Search_By_Location')}
                    >
                        <Image
                            source={require('../../../assets/images/topBar/top_search_icon.png')}
                            style={{ flex: 1,
                            width: null,
                            height: 100,
                            resizeMode: 'contain' }}
                        />
                    </Button>
                </Right>
            </Header>
        );
    }
}

const styles = {
    headerBGStyles: {
        backgroundColor: CLR_MAIN_HEADER_BAR,
    },
    headerMainViewContainer: {
         flex: 1,
         flexDirection: 'row',

    },
    headerItemButtonStyle: {
        flex: 1,
    },
    headerIconImgStyle: {
        flex: 1,
        width: null,
        height: 31,
        resizeMode: 'contain',
    },
};


export default MainHeader;
