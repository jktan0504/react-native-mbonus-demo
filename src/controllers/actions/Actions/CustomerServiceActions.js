import { FORM_GLOBAL_ACTION_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        FORM_GLOBAL_ACTION_REFRESH, FORM_GLOBAL_ACTION_CLEAR,
        SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        SELECT_USER_PROFILE_STATE_OPTIONS,
        SELECT_USER_PROFILE_AREA_OPTIONS,
        SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        FORM_USER_CLEAR_ALL,
        FORM_USER_ISREFRESHING
} from '../../actions/types';
import { postChatReplyByChatRoomID, postCreateNewChatRoom,
} from '../../../utility/networking/MBonusAuthServices';


// customerService Response Success
const customerServiceResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// customerService Response Failed
const customerServiceResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

export const customerServiceIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_GLOBAL_ACTION_REFRESH,
        payload: isRefreshing
    };
};


export const userCustomerServiceMsgSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postChatReplyByChatRoomID(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    customerServiceResponse_Success(dispatch, response);
                }
                else
                {
                    customerServiceResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => customerServiceResponse_Failed(dispatch));
    };
};

export const userCustomerServiceCreateNewChatRoomSubmit = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postCreateNewChatRoom(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    customerServiceResponse_Success(dispatch, response);
                }
                else
                {
                    customerServiceResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => customerServiceResponse_Failed(dispatch));
    };
};
