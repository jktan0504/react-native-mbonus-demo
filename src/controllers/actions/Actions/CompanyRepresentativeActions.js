import { FORM_GLOBAL_ACTION_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        FORM_GLOBAL_ACTION_REFRESH, FORM_GLOBAL_ACTION_CLEAR,
        SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        SELECT_USER_PROFILE_STATE_OPTIONS,
        SELECT_USER_PROFILE_AREA_OPTIONS,
        SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        FORM_USER_CLEAR_ALL,
        FORM_USER_ISREFRESHING,
        FORM_GLOBAL_ACTION_TARGET_USERNAME_VERIFIED,
        FORM_GLOBAL_ACTION_TARGET_USERNAME_UNVERIFIED,
} from '../../actions/types';
import { postCompRepRef, checkCompRepUsername, postCompRepBecome,
} from '../../../utility/networking/MBonusAuthServices';

// customerService Response Success
const compRepServiceUsernameResponse_Success = (dispatch, response) => {
    dispatch({
        type: FORM_GLOBAL_ACTION_TARGET_USERNAME_VERIFIED,
        payload: response
    });
};

// customerService Response Failed
const compRepServiceUsernameResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index, full_error_msg_length);

    dispatch({
        type: FORM_GLOBAL_ACTION_TARGET_USERNAME_UNVERIFIED,
        payload: filter_error_msg
    });
};


// customerService Response Success
const compRepServiceResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// customerService Response Failed
const compRepServiceResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

export const compRepServiceIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_GLOBAL_ACTION_REFRESH,
        payload: isRefreshing
    };
};

export const userCompRepRefCheckUsernameSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        checkCompRepUsername(submitParams)
            .then((response) => {
                console.log('from action');
                console.log(response);
                if(response.status === 'success')
                {
                    compRepServiceUsernameResponse_Success(dispatch, response);
                }
                else
                {
                    compRepServiceUsernameResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => compRepServiceUsernameResponse_Failed(dispatch));
    };
};

export const userCompRepRefSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postCompRepRef(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    compRepServiceResponse_Success(dispatch, response);
                }
                else
                {
                    compRepServiceResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => compRepServiceResponse_Failed(dispatch));
    };
};

export const userCompRepBecomeSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postCompRepBecome(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    compRepServiceResponse_Success(dispatch, response);
                }
                else
                {
                    compRepServiceResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => compRepServiceResponse_Failed(dispatch));
    };
};
