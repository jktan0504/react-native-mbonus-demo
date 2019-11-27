import React, {Component} from 'react';
import { Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';


class MainScreen extends Component {
    render() {
        return (
            <Container>
                <Header>
                  <Left>
                    <Button transparent>
                      <Icon name='menu' />
                    </Button>
                  </Left>
                  <Body>
                    <Title>Main</Title>
                  </Body>
                  <Right />
                </Header>
                <Content>
                  <Text>
                    Home
                  </Text>
                </Content>
                <Footer>
                  <FooterTab>
                    <Button full>
                      <Text>Footer</Text>
                    </Button>
                  </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default MainScreen;
