import React, {Component} from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { ASYNCTORAGE_USER_TOKEN } from '../../../../utility/constants';
import { tokenManagerCheckLogin, tokenManagerGetAccessToken
} from '../../../../controllers/actions';
import { checkUserLogin, getUserAccessToken
} from '../../../../controllers/actions/AsyncStorage/MBonusAsyncStorage';

class WelcomeMainComponent extends Component {

    constructor(props) {
        super(props);
        // AsyncStorage.clear();
        this.state = { userLogin: false, user_access_token: '' };
    }

    componentDidMount() {
        tokenManagerCheckLogin()
            .then(res => this.setState({ userLogin: res }))
            .catch(err => alert("An error occurred"));
        tokenManagerGetAccessToken()
            .then(res => this.setState({ user_access_token: res }))
            .catch(err => alert("An error occurred"));
    }

    getToken = async () => {
        console.log(`GetToken is Running`);
        try {
            let storage_user_access_token = await AsyncStorage.getItem(ASYNCTORAGE_USER_TOKEN);
            this.setState({ user_access_token: storage_user_access_token });
            console.log(`From Haha HomeMainComponent ${this.state.user_access_token}`);
        } catch (e) {
            console.log(`error ${e}`);
            Alert(e);
        }
    }

    renderLogin() {
        if(this.state.userLogin) {
            return (
                <Text style={{ color: 'green'}}>
                    User login is Online
                </Text>
            );
        }
        return (
            <Text style={{ color: 'red'}} >
                User login is Offline
            </Text>
        );

    }

    render() {
        const { userLogin, user_access_token } = this.state;
        return (
            <Container>
                <Header>
                  <Left>
                    <Button transparent>
                      <Icon name='menu' />
                    </Button>
                  </Left>
                  <Body>
                    <Title>Welcome</Title>
                  </Body>
                  <Right />
                </Header>
                <Content>
                    <Button onPress={() => this.props.navigation.goBack()}>
                        <Text>Go Back</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}


const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, {
    tokenManagerCheckLogin
 })(WelcomeMainComponent);
