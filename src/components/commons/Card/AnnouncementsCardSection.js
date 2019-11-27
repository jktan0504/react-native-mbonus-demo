import React from 'react';
import { View } from 'react-native';

const AnnouncementsCardSection = (props) => {
    const { containerStyle } = styles;

    return (
        <View style={containerStyle} >
            { props.children }
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 0,
        padding: 10,
//        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
    },
};

export { AnnouncementsCardSection };
