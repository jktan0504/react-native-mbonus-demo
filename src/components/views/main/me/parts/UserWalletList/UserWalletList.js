import React, {Component} from 'react';
import { Image, View, Alert, FlatList } from 'react-native';
import UserWalletListItem from './UserWalletListItem/UserWalletListItem';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import { CLR_MAIN_HEADER_BAR, DOMAIN_URL } from '../../../../../../utility/constants';

class UserWalletList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { transactionList, handleRefresh, handlePagination,
            isRefreshing,
        } = this.props;
        const { navigate } = this.props.navigation;

        return (

            <FlatList
                data={transactionList.reverse()}
                renderItem={({ item }) => (
                    <UserWalletListItem
                            walletSingleItem={item}
                            goToMerchantDetails={() => console.log('presss')}
                    />
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


export default UserWalletList;
