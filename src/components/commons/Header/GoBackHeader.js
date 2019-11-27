import React from 'react';
import {
        Header, Left, Button, Icon, Body, Title, Right
} from 'native-base';
import { CLR_DARK_BLUE, CLR_WHITE, CLR_BLACK } from '../../../utility/constants';


const GoBackHeader = ({
    headerTitle, goBackAction
 }) => {

    const { MBonusGoBackHeaderStyle, MBonusGoBackTitleTextStyle, MBonusGoBackIconTextStyle } = styles;

    return (
        <Header
            style={MBonusGoBackHeaderStyle}
            androidStatusBarColor={CLR_DARK_BLUE}
        >
            <Left>
                <Button
                    transparent
                    onPress={goBackAction}
                >
                <Icon style={MBonusGoBackIconTextStyle} name='arrow-back' />
              </Button>
            </Left>
            <Body>
                <Title style={MBonusGoBackTitleTextStyle}>{ headerTitle }</Title>
            </Body>
            <Right />
        </Header>
    );
};

const styles = {
    MBonusGoBackHeaderStyle: {
        backgroundColor: CLR_WHITE
    },
    MBonusGoBackTitleTextStyle: {
        color: CLR_BLACK
    },
    MBonusGoBackIconTextStyle: {
        color: CLR_DARK_BLUE
    },
};


export { GoBackHeader };
