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
import { postWithdrawalService
} from '../../../utility/networking/MBonusAuthServices';


// WithdrawalResponse_Success Response Success
const WithdrawalResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// WithdrawalResponse_Success Response Failed
const WithdrawalResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

export const withdrawalIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_GLOBAL_ACTION_REFRESH,
        payload: isRefreshing
    };
};

export const WithdrawalSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postWithdrawalService(submitParams)
            .then((response) => {
                console.log('from action');
                console.log(response);
                if(response.status === 'success')
                {
                    WithdrawalResponse_Success(dispatch, response);
                }
                else
                {
                    WithdrawalResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => WithdrawalResponse_Failed(dispatch));
    };
};
