import React from 'react';
import { View, Dimensions } from 'react-native';
import Spinner from 'react-native-spinkit';
import { CLR_PRIMARY_DARK } from '../../../utility/constants';


const MBonusSpinner = ({
    spinnerSize,
    spinnerType,
    spinnerColor }) => {

    const { SpinnerViewContainerStyle, MBonusSpinnerStyle } = styles

    return (
        <View
            style={SpinnerViewContainerStyle}
        >
            <Spinner
                style={MBonusSpinnerStyle}
                    size={35}
                    type={'Circle'}
                    color={CLR_PRIMARY_DARK}
            />
        </View>
    );
};

const styles = {
    SpinnerViewContainerStyle: {
        position: 'absolute',
        marginTop: Dimensions.get('window').height / 2,
        marginLeft: Dimensions.get('window').width / 2.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    MBonusSpinnerStyle: {

    },
};

export { MBonusSpinner };
