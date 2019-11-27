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
import { postUpgradeToAgent, checkUpgradeToAgentUsername,
} from '../../../utility/networking/MBonusAuthServices';

// upgrade Response Success
const upgradeToAgentUsernameResponse_Success = (dispatch, response) => {
    dispatch({
        type: FORM_GLOBAL_ACTION_TARGET_USERNAME_VERIFIED,
        payload: response
    });
};

// upgrade Response Failed
const upgradeToAgentUsernameResponse_Failed = (dispatch, errorMsg) => {
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
const upgradeToAgentResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// upgradeToAgent Response Failed
const upgradeToAgentResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

export const upgradeToAgentIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_GLOBAL_ACTION_REFRESH,
        payload: isRefreshing
    };
};

export const upgradeToAgentCheckUsernameSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        checkUpgradeToAgentUsername(submitParams)
            .then((response) => {
                console.log('from action');
                console.log(response);
                if(response.status === 'success')
                {
                    upgradeToAgentUsernameResponse_Success(dispatch, response);
                }
                else
                {
                    upgradeToAgentUsernameResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => upgradeToAgentUsernameResponse_Failed(dispatch));
    };
};

export const upgradeToAgentSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postUpgradeToAgent(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    upgradeToAgentResponse_Success(dispatch, response);
                }
                else
                {
                    upgradeToAgentResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => upgradeToAgentResponse_Failed(dispatch));
    };
};
