// COUNTRYLOCATION_ACTIONS
import { GET_APP_PHONE_EXT_OPTIONS, GET_APP_COUNTRY_OPTIONS,
    GET_APP_STATE_OPTIONS, GET_APP_AREA_OPTOPNS, SELECT_APPLICATION_PHONE_EXT_OPTIONS,
    SELECT_APPLICATION_COUNTRY_OPTIONS, SELECT_APPLICATION_STATE_OPTIONS,
    SELECT_APPLICATION_AREA_OPTIONS, STATUS_GET_PHONE_EXT_SUCCESS, STATUS_GET_PHONE_EXT_FAILED
} from '../types';

import { getPhoneExtOptions, getCountryOptions, getStateOptions, getAreaOptions
} from '../../../utility/networking/MBonusUnAuthServices';

// Select Phone Ext
export const phoneExtOptionSelected = (country_id) => {
    return {
        type: SELECT_APPLICATION_PHONE_EXT_OPTIONS,
        payload: country_id
    };
};

export const getPhoneExtOptionSubmit = () => {
    console.log(`GETTING PHONE EXT IS RUNNING`);

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: GET_APP_PHONE_EXT_OPTIONS,
        });

        getPhoneExtOptions()
            .then((response) => {

                if(response.status === 'success')
                {
                    console.log(`From Actions: ${response.data.model}`);
                    console.log(response.data.model);
                    getPhoneExtStatus_Success(dispatch, response.data.model);
                }
                else
                {
                    getPhoneExtStatus_FAILED(dispatch, response.msg);
                }
            })
            .catch(() => getPhoneExtStatus_FAILED(dispatch));
    };
};

// Get Phone Ext Response Success
const getPhoneExtStatus_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GET_PHONE_EXT_SUCCESS,
        payload: response
    });
};

// Get C Ext Response FAILED
const getPhoneExtStatus_FAILED = (dispatch, response) => {
    dispatch({
        type: STATUS_GET_PHONE_EXT_FAILED,
        payload: response
    });
};


// Select Country Option
export const countryOptionSelected = (selected_country_id) => {
    return {
        type: SELECT_APPLICATION_COUNTRY_OPTIONS,
        payload: selected_country_id
    };
};

// Select State Option
export const stateOptionSelected = (selected_state_id) => {
    return {
        type: SELECT_APPLICATION_STATE_OPTIONS,
        payload: selected_state_id
    };
};

// Select Area Option
export const areaOptionSelected = (selected_area_id) => {
    return {
        type: SELECT_APPLICATION_AREA_OPTIONS,
        payload: selected_area_id
    };
};
