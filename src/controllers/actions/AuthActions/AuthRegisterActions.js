import { FORM_USER_REGISTER, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED
} from '../../actions/types';
import { userUnAuthRegister } from '../../../utility/networking/MBonusUnAuthServices';

export const userRegisterFormUpdate = ({ props, value }) => {
    console.log(`Prop: ${props} and value ${value}`);
    return {
        type: FORM_USER_REGISTER,
        payload: { props, value }
    };
};

export const userRegisterSubmit = (submitParams) => {
    console.log(`Username: ${submitParams.username} Password: ${submitParams.password}`);

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        userUnAuthRegister(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    userRegisterResponse_Success(dispatch, response);
                }
                else
                {
                    userRegisterResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => userRegisterResponse_Failed(dispatch));
    };
};

// Forget Password Response Success
const userRegisterResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// Forget Password Response Failed
const userRegisterResponse_Failed = (dispatch, errorMsg) => {

    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};
