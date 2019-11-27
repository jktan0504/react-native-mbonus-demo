import React, {Component} from 'react';
import { Image, View, Alert, FlatList } from 'react-native';
import ChatRoomListItem from './ChatRoomListItem/ChatRoomListItem';
import {
        Header, Left, Button, Icon, Body, Title, Right, List,
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../../../../../../utility/constants';

class ChatRoomList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { chatRoomLists, handleRefresh, handlePagination,
            isRefreshing,
        } = this.props;
        const { navigate } = this.props.navigation;

        return (

            <FlatList
                    data={chatRoomLists.reverse()}
                    renderItem={({ item }) => (
                        <List>
                            <ChatRoomListItem
                                    chatRoomSingleItem={item}
                                    goToSingleChatRoom={() => navigate('Actions_Sub_CompanyService_SingleChatReply', {
                                        chatroom_id: item.id,
                                        chatroom_title: item.title
                                    })}
                            />
                        </List>
                      )}
                    keyExtractor={i => i.id}
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


export default ChatRoomList;
