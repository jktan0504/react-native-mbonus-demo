import React from 'react';
import { View, Text } from 'react-native';
import {
        Header, Left, Button, Icon, Body, Title, Right, Item
} from 'native-base';
import { CLR_DARK_BLUE, CLR_WHITE, CLR_BLACK } from '../../../utility/constants';


const MBonusHorizontalLine = ({
    headerTitle, goBackAction
 }) => {

    const { itemRowContainerStyle, hairlineStyle, hairLineTextStyle } = styles;

    return (
        <Item style={itemRowContainerStyle}>
            <View style={hairlineStyle} />
            <Text style={hairLineTextStyle} />
            <View style={hairlineStyle} />
        </Item>
    );
};

const styles = {
    itemRowContainerStyle: {
        marginTop: 25,
        marginBottom: 25,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 0,
        justifyContent: 'space-around',
    },
    hairlineStyle: {
        backgroundColor: CLR_BLACK,
        height: 2,
        width: 120
    },

    hairLineTextStyle: {
      fontFamily: 'AvenirNext-Bold',
      fontSize: 14,
      paddingHorizontal: 5,
      alignSelf: 'center',
      color: CLR_BLACK
    },
};


export { MBonusHorizontalLine };
