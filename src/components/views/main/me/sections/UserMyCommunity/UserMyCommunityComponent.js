import React, { Component, PropTypes } from 'react';
import { AsyncStorage, Alert, View, Dimensions, Image, ImageBackground,
    TouchableOpacity,
} from 'react-native';
import TreeView from '@zaguini/react-native-tree-view';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer, Picker, Input,
    FooterTab, Button, Left, Right, Body, Icon, Text, Item } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN, CLR_DARK_TIFFANY_BLUE, DOMAIN_URL,
    CLR_PURPLE, CLR_PRIMARY_DARK, CLR_WHITE, CLR_BLACK,
} from '../../../../../../utility/constants';
import { GoBackHeader } from '../../../../../commons';
import { MBonusSpinner } from '../../../../../commons/Spinner';
import { changeSettingsLocalization
} from '../../../../../../controllers/actions';
import { getAuthUserMyCommunityData
} from '../../../../../../utility/networking/MBonusAuthServices';
import { getMBonusAppLanguageSetting,
} from '../../../../../../utility/realm/app/AppSettingsRealmServices';

// localize
import { strings } from '../../../../../../../locales/i18n';

class UserMyCommunityComponent extends Component {

    constructor(props) {
        super(props);

        // AsyncStorage.clear();
        this.state = {
            user_pref_language: '',
            page_loading: 1,
            start_items: 0,
            fetch_length: 20,
            isLoading: true,
            isRefreshing: false,
            myCommunityTreeData: [],
            myCommunityDrawTreeData: [],
            sponsor_sonList: [],
        };
    }

    forceUpdateHandler() {
        this.forceUpdate();
    }


    componentDidMount() {
        this.getUserPrefLanguage();
        console.log(this.treeView.getRawData());
        this.getMyCommunityTreeData();
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

    getMyCommunityTreeData = () => {
        getAuthUserMyCommunityData()
            .then((allCommunityTreeData) => {
                this.setState({
                  myCommunityTreeData: allCommunityTreeData.data.users,
                  sponsor_sonList: allCommunityTreeData.data.users.sponsor_son,
                  isRefreshing: false,
                  isLoading: false,
                });
                console.log(this.state.myCommunityTreeData); // object
                console.log(this.state.myCommunityTreeData.sponsor_son); // array
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    transactionLists: []
                });
            });
    }

    renderSpinner() {
        if (this.state.isLoading) {
            return (
                <MBonusSpinner
                    size={35}
                    type='Wave'
                    color='CLR_TIFFANY_BLUE'
                />
            );
        }
    }

    getEachOfChildren(childrenData) {
        let full_childrenTree = [];
        let totalSizeOfChildrenData = Object.keys(childrenData).length;
        if (totalSizeOfChildrenData > 0) {
            childrenData.map((member, key) => {
                let singleChildren = [];
                let children_sponsor = member.sponsor_son;

                console.log(key);
                console.log(children_sponsor);
                singleChildren =
                    {
                        id: member.id,
                        name: member.name,
                        total_children_size: children_sponsor.length,
                        children: this.getEachOfChildren(children_sponsor)
                    }
                ;
                full_childrenTree.push(singleChildren);
            });
            return full_childrenTree;
        }

    }

    getAndSetMyCommunityTreeData(myFullTreeData) {
        let myCommunityTreeFullDrawData = [];
            myCommunityTreeFullDrawData = [
            {
                id: myFullTreeData.id,
                name: myFullTreeData.name,
                total_children_size: this.state.sponsor_sonList.length,
                children: this.getEachOfChildren(this.state.sponsor_sonList)
            }
        ];
        return myCommunityTreeFullDrawData;
    }

    getCollapseImg(collapsed) {
        let img_source = '';
        collapsed ? img_source='../../../../../../assets/images/me/open_arrow.png'
            : img_source='../../../../../../assets/images/me/close_arrow.png';
        return img_source;
    }

    renderTreeView() {
        const { myCommunityTreeData } = this.state;

        if(myCommunityTreeData) {
            return (
                <TreeView
                    ref={ref => this.treeView = ref}
                    data={this.getAndSetMyCommunityTreeData(myCommunityTreeData)}
                    idKey='id'
                    childrenKey='children'
                    collapsedItemHeight={40}
                    renderItem={(item, level) => (
                        <View>
                            <View
                                style={{
                                    marginLeft: 25 * level,
                                    marginTop: 10,
                                    flexDirection: 'row'
                                    }}
                            >
                                <View style={{ paddingRight: 10 }}>
                                {
                                    item.collapsed !== null ?
                                    <Image
                                        source={
                                            item.collapsed ?
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
                                <Text style={{ width: 5 }}></Text>
                                <Text
                                    style={{ fontSize: 20,
                                    fontWeight: 'bold', }}
                                >
                                    {item.name} ({item.total_children_size})
                                </Text>


                            </View>
                        </View>

                    )}
                />
            );
        }
    }

    goBackNClear() {
        // this.props.merchantClearFilterOptionSelected();
        this.props.navigation.goBack();
    }


    render() {

        const { merchantMainContainer
        } = styles;
        return (
            <Container style={merchantMainContainer}>
                <GoBackHeader
                    headerTitle={strings('me.btn_my_community')}
                    goBackAction={() => this.goBackNClear()}
                />
                <Content>
                    <View
                        style={{ flex: 1, padding: 20 }}
                    >
                        {this.renderTreeView()}
                    </View>
                </Content>

                { this.renderSpinner() }

            </Container>
        );
    }
}

const styles = {
    merchantMainContainer: {
        backgroundColor: 'white'
    },
    mainTreeViewStyle: {
        flex: 1,
        padding: 10,
    }


};

const mapStateToProps = state => {
    return {
        user_pref_language: state.locale.user_pref_language,
    };
};

export default connect(mapStateToProps, {
    changeSettingsLocalization,
})(UserMyCommunityComponent);
