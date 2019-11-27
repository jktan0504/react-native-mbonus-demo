import React, {Component} from 'react';
import { Image, View, Alert, FlatList } from 'react-native';
import SingleChatRoomListSender from './SingleChatRoomListItem/SingleChatRoomListSender';
import SingleChatRoomListReceiver from './SingleChatRoomListItem/SingleChatRoomListReceiver';
import {
        Header, Left, Button, Icon, Body, Title, Right, List,
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../../../../../../utility/constants';

class SingleChatRoomList extends Component {

    constructor(props) {
        super(props);
    }

    renderMsgList = (SINGLE_MSG_ITEM) => {
        if (SINGLE_MSG_ITEM.user) {
            return (
                <SingleChatRoomListSender
                        chatRoomSingleMsgItem={SINGLE_MSG_ITEM}
                        goToSingleChatRoom={() => console.log('test')}
                />
            );
        }
        else {
            return (
                <SingleChatRoomListReceiver
                        chatRoomSingleMsgItem={SINGLE_MSG_ITEM}
                        goToSingleChatRoom={() => console.log('test')}
                />
            );
        }
    }

    render() {
        const { singleChatRoomList, handleRefresh, handlePagination,
            isRefreshing,
        } = this.props;
        const { navigate } = this.props.navigation;

        return (

            <FlatList
                inverted
                data={singleChatRoomList.reverse()}
                renderItem={({ item }) => this.renderMsgList(item)}
                keyExtractor={i => `${i.id}`}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                onEndReached={handlePagination}
                onEndThreshold={0}
            />
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


export default SingleChatRoomList;
