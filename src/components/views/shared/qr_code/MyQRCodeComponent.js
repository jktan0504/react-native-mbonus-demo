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
import { strings, changeToZH, changeToEN } from '../../../../../locales/i18n';

class MyQRCodeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            qrCodeLink: '',
            userDetails: [],
            loading: true,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getInitialUserDataFromLocalDB();
    }

    getInitialUserDataFromLocalDB = async () => new Promise((resolve, reject) => {

        AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
            .then(localStorageData => {
                // console.log(`res: ${res}`);
                if (localStorageData !== null) {
                    this.setState({
                        userDetails: JSON.parse(localStorageData),
                        loading: false,
                    });
                    this.getUserQRCodeShare();

                }
                else
                {
                    this.getUserQRCodeShare();
                }
            })
            .catch(err => reject(err));
     });

    getUserQRCodeShare() {
        const qrCodeLinkURL = `${DOMAIN_URL}/user/qrcode/${this.state.userDetails.id}`;
        this.setState({
            qrCodeLink: qrCodeLinkURL,
        });
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }


    render() {
        const { mainContentViewStyle, btmContentViewStyle
        } = styles;
        return (
            <Container>
                <GoBackHeader
                    headerTitle={strings('qr.my_qrcode')}
                    goBackAction={() => this.goBackNClear()}
                />
                <View style={mainContentViewStyle}>
                    <QRCode
                        value={this.state.qrCodeLink}
                        size={Dimensions.get('window').width / 1.3}
                        bgColor='#000'
                        fgColor='#fff'
                    />
                </View>
                <View style={btmContentViewStyle}>
                    <Text>
                        {strings('qr.qr_description')}
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
        padding: 5,
    },
    btmContentViewStyle: {
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 0.2,
        padding: 20,
    },
    qrDescriptionTextStyle: {
        fontSize: 20,
        color: CLR_BLACK,
    },


};


const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization
 })(MyQRCodeComponent);
