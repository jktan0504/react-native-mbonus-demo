import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid
} from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import HTML from 'react-native-render-html';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL, CLR_PRIMARY_DARK, CLR_DARK_TIFFANY_BLUE,
    CLR_BLACK, CLR_DARK_BLUE, CLR_WHITE, CLR_RED, CLR_MORE_DARK_GREY,
} from '../../../../../../../utility/constants';
import { AnnouncementsCard, AnnouncementsCardSection } from '../../../../../../commons';
import { getMBonusAppLanguageSetting,
} from '../../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../../locales/i18n';

class AnnouncementListItem extends Component {

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

    renderAnnouncementContent() {
        const { announcementSingleItem } = this.props;
        let content_announcement = '';
        switch (this.state.user_pref_language) {
            case 'zh':
                let content_zh = announcementSingleItem.content_cn;
                content_announcement =
                    content_zh.replace('/uploads', `${DOMAIN_URL}/uploads`);
                break;
            case 'en':
                let content_en = announcementSingleItem.content_en;
                content_announcement =
                    content_en.replace('/uploads', `${DOMAIN_URL}/uploads`);
                break;
            default:
                let content_eng = announcementSingleItem.content_en;
                content_announcement =
                    content_eng.replace('/uploads', `${DOMAIN_URL}/uploads`);
                break;
        }

        content_announcement = content_announcement.replace(/&lt;/g, '<');
        content_announcement = content_announcement.replace(/&gt;/g, '>');
        content_announcement = content_announcement.replace(/&quot;/g, '"');
        content_announcement = content_announcement.replace(/&amp;/g, '&');
        content_announcement = content_announcement.replace(/&nbsp;/g, ' ');

        console.log(content_announcement);
        /*
        return `<html>
                    <style>
                        img{
                            display: inline;
                            width: 10px;
                            height: 10px;
                        }
                    </style>
                    ${content_announcement}
                </html>`;
                */
        return content_announcement;
    }

    render() {
        const { announcementSingleItem, goToMerchantDetails
        } = this.props;
        const { merchantCardContainerStyle, blueBorderContainerViewStyle,
            announcementTopSectionViewStyle, announcementBtmSectionViewStyle,


        } = styles;

        return (
            <View>
            <View style={merchantCardContainerStyle}>
                <AnnouncementsCard>
                    <AnnouncementsCardSection>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 0.1, alignItems: 'flex-start' }}>
                                <Image
                                    source={require('../../../../../../../assets/images/me/top_card.png')}
                                    style={{ width: Dimensions.get('window').width, height: 35 }}
                                />
                            </View>
                            <View style={blueBorderContainerViewStyle}>
                                <View style={announcementTopSectionViewStyle}>
                                    <View
                                        style={{ flex: 1, paddingBottom: 10, }}
                                    >
                                        <HTML
                                            html={
                                                this.state.user_pref_language === 'zh' ?
                                                    announcementSingleItem.title_cn :
                                                    announcementSingleItem.title_en
                                            }
                                            imagesMaxWidth={Dimensions.get('window').width}
                                            baseFontStyle={{
                                                fontSize: 22,
                                                color: CLR_BLACK,
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1, backgroundColor: CLR_RED, padding: 10 }}>
                                        <Text style={{ color: CLR_WHITE }}>
                                            {announcementSingleItem.created_at}
                                        </Text>
                                    </View>
                                </View>
                                <View style={announcementBtmSectionViewStyle}>
                                    <HTML
                                        html={this.renderAnnouncementContent()}
                                        imagesMaxWidth={Dimensions.get('window').width/1.4}
                                        baseFontStyle={{
                                            fontSize: 17,
                                            color: CLR_MORE_DARK_GREY,
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 0.1, alignItems: 'flex-end', marginTop: 5, }}>
                                <Image
                                    source={require('../../../../../../../assets/images/me/btm_card.png')}
                                    style={{ width: Dimensions.get('window').width, height: 35 }}
                                />
                            </View>
                        </View>
                    </AnnouncementsCardSection>
                </AnnouncementsCard>
            </View>
            <Toast
                ref="toast"
                style={{backgroundColor:'black'}}
                position='bottom'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}

            />
            </View>
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


export default AnnouncementListItem;
