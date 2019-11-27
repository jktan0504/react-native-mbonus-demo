import React from 'react';
import { View, Dimensions } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { CLR_PRIMARY_DARK } from '../../../utility/constants';


const MBonusToast = ({
    spinnerSize,
    spinnerType,
    spinnerColor }) => {

    const { ToastViewContainerStyle, MBonusSpinnerStyle } = styles

    return (
        <View
            style={ToastViewContainerStyle}
        >
            <Toast
                ref="toast"
                style={{backgroundColor:'red'}}
                position='top'
                positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{color:'red'}}
            />
        </View>
    );
};

const styles = {
    ToastViewContainerStyle: {
        position: 'absolute',
        marginTop: Dimensions.get('window').height / 3,
        marginLeft: Dimensions.get('window').width / 2.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    MBonusSpinnerStyle: {

    },
};

export { MBonusToast };
