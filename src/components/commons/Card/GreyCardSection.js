import React from 'react';
import { View } from 'react-native';
import { CLR_LIGHT_GREY } from '../../../utility/constants';

const GreyCardSection = (props) => {
    const { containerStyle } = styles;

    return (
        <View style={containerStyle} >
            { props.children }
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: CLR_LIGHT_GREY,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    },
};

export { GreyCardSection };
