import React, {Component} from 'react';
import { AsyncStorage, Alert, ImageBackground, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import QRCode from 'react-native-qrcode';
import { CLR_BLACK, ASYNCTORAGE_USER_DETAILS, DOMAIN_URL,
} from '../../../../utility/constants';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken, changeSettingsLocalization
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';
import { GoBackHeader } from '../../../commons';
import { getAppImgSliders,
} from '../../../../utility/networking/MBonusAuthServices';
// localize
import { strings } from '../../../../../locales/i18n';

class NotificationComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }


    render() {
        const { mainContentViewStyle, notificationTextStyle
        } = styles;
        return (
            <Container>
                <GoBackHeader
                    headerTitle={strings('notification.notification')}
                    goBackAction={() => this.goBackNClear()}
                />
                <View style={mainContentViewStyle}>
                    <Text style={notificationTextStyle}>
                        {strings('notification.empty_notification')}
                    </Text>
                </View>
            </Container>
        );
    }
}

const styles = {
    mainContentViewStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 10,
    },
    notificationTextStyle: {
        fontSize: 20,
        color: CLR_BLACK,
        textAlign: 'center',
    },


};


const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization
 })(NotificationComponent);
