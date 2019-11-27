import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid
} from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right, ListItem, Thumbnail, Item
} from 'native-base';
import HTML from 'react-native-render-html';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CLR_MAIN_HEADER_BAR, API_DOMAIN_URL, CLR_PRIMARY_DARK, CLR_DARK_TIFFANY_BLUE,
    CLR_BLACK, CLR_DARK_BLUE, CLR_WHITE, CLR_RED, CLR_MORE_DARK_GREY, CLR_AMBER,
} from '../../../../../../../../../utility/constants';
import { AnnouncementsCard, AnnouncementsCardSection } from '../../../../../../../../commons';
import { getMBonusAppLanguageSetting,
} from '../../../../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../../../../locales/i18n';

class SingleChatRoomListSender extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_pref_language: '',
            announcementTitle: '<html></html>',
            announcementContent: '<html></html>',
        }
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

    render() {
        const { chatRoomSingleMsgItem, goToSingleChatRoom
        } = this.props;
        const { merchantCardContainerStyle, blueBorderContainerViewStyle,
            announcementTopSectionViewStyle, announcementBtmSectionViewStyle,


        } = styles;
        console.log(`${API_DOMAIN_URL}/${chatRoomSingleMsgItem.user.avatar}`);
        return (
            <ListItem avatar noBorder style={{ flex: 1, borderBottomWidth: 0 }}>

                <Body>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text
                            style={{ textAlign: 'right', fontSize: 14, padding: 5 }}
                        >
                            {chatRoomSingleMsgItem.user.username}
                        </Text>
                        <Item rounded style={{ backgroundColor: CLR_AMBER, padding: 15 }}>
                            <Text
                                note
                                multiline
                                style={{ textAlign: 'right', fontSize: 16, fontWeight: 'bold', color: CLR_WHITE
                                }}
                            >
                                {chatRoomSingleMsgItem.message}
                            </Text>
                        </Item>
                        <Text
                            note
                            style={{
                                fontSize: 12,
                                textAlign: 'right',
                                paddingTop: 10,
                                color: CLR_DARK_TIFFANY_BLUE
                            }}
                        >
                            {chatRoomSingleMsgItem.created_at}
                        </Text>
                    </View>

                </Body>
                <Right>
                    <Thumbnail
                        source={{ uri: `${API_DOMAIN_URL}/${chatRoomSingleMsgItem.user.avatar}` }}
                        style={{ width: 40, height: 40 }}
                    />
                </Right>
            </ListItem>

        );
    }
}

const styles = {
    merchantCardContainerStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    blueBorderContainerViewStyle: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        marginTop: 10,
        marginLeft: 5,
        borderColor: CLR_DARK_BLUE,
        borderWidth: 3,
    },
    announcementTopSectionViewStyle: {
        flex: 1,
        marginTop: 20,
        marginLeft: -15,
        backgroundColor: CLR_WHITE,
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingTop: 20,
        paddingBottom: 20,
    },
    announcementBtmSectionViewStyle: {
        flex: 1,
        padding: 5
    },
};


export default SingleChatRoomListSender;
