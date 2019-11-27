import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid
} from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';

import Toast, { DURATION } from 'react-native-easy-toast';
import ImageLoad from 'react-native-image-placeholder';

import { CLR_MAIN_HEADER_BAR, DOMAIN_URL, CLR_PRIMARY_DARK, CLR_DARK_TIFFANY_BLUE,
    CLR_BLACK, CLR_DARK_BLUE, CLR_WHITE, CLR_RED, CLR_MORE_DARK_GREY,
} from '../../../../../../utility/constants';
import { AnnouncementsCard, AnnouncementsCardSection } from '../../../../../commons';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class TreeItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_pref_language: '',
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
        const { child_item, level } = this.props;
        const { mainTreeItemViewStyle,

        } = styles;

        return (
            <View>
                <Text
                    style={{
                        marginLeft: 25 * level,
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 10,
                        color: level === 0 ? CLR_PRIMARY_DARK : CLR_BLACK
                        }}
                >
                    <View style={{ paddingRight: 10 }}>
                    {
                        child_item.collapsed !== null ?
                        <Image
                            source={
                                child_item.collapsed ?
                                require('../../../../../../assets/images/me/close_arrow.png')
                                :
                                require('../../../../../../assets/images/me/open_arrow.png')
                            }
                            style={{ width: 25, height: 25 }}
                        />
                        :
                        <Image
                            source={require('../../../../../../assets/images/me/open_arrow.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    }
                    </View>

                    {child_item.name} ({child_item.total_children_size})


                </Text>
            </View>
        );
    }
}

const styles = {
    mainTreeItemViewStyle: {
        padding: 10,
    },

};


export default TreeItem;
