import { FORM_USER_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        SELECT_USER_PROFILE_STATE_OPTIONS,
        SELECT_USER_PROFILE_AREA_OPTIONS,
        SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        FORM_USER_CLEAR_ALL,
        FORM_USER_ISREFRESHING
} from '../../actions/types';
import { postUserUpdateLanguage, postUserUpdateProfile
} from '../../../utility/networking/MBonusAuthServices';

export const userProfileFormUpdate = ({ props, value }) => {
    console.log(`userProfileFormUpdate Prop: ${props} and value ${value}`);
    return {
        type: FORM_USER_UPDATE,
        payload: { props, value }
    };
};

// Select Phone Ext
export const userProfileUpdateIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_USER_ISREFRESHING,
        payload: isRefreshing
    };
};

// Select Phone Ext
export const userProfileUpdatephoneExtOptionSelected = (country_id) => {
    return {
        type: SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        payload: country_id
    };
};

// Select Country Option
export const userProfileUpdateCountryOptionSelected = (selected_country_id) => {
    return {
        type: SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        payload: selected_country_id
    };
};

// Select State Option
export const userProfileUpdateStateOptionSelected = (selected_state_id) => {
    return {
        type: SELECT_USER_PROFILE_STATE_OPTIONS,
        payload: selected_state_id
    };
};

// Select Area Option
export const userProfileUpdateAreaOptionSelected = (selected_area_id) => {
    return {
        type: SELECT_USER_PROFILE_AREA_OPTIONS,
        payload: selected_area_id
    };
};


export const userUpdateLanguageAction = (submitParams) => {

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postUserUpdateLanguage(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    userUpdateLanguageResponse_Success(dispatch, response);
                }
                else
                {
                    userUpdateLanguageResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => userUpdateLanguageResponse_Failed(dispatch));
    };
};

// Forget Password Response Success
const userUpdateLanguageResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// Forget Password Response Failed
const userUpdateLanguageResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

// CLEAR Option
export const userUpdateClearAll = () => {
    return {
        type: FORM_USER_CLEAR_ALL,
        payload: ''
    };
};

export const userProfleUpdateSubmit = (submitParams) => {

    const data = new FormData();
    data.append('email', submitParams.email);
    data.append('name', submitParams.name);
    data.append('current_password2', submitParams.current_password2);
    data.append('country_id', submitParams.country_id);
    data.append('contact_number', submitParams.contact_number);
    data.append('contact_country_id', submitParams.country_id);
    data.append('country_location_id', submitParams.country_location_id);
    data.append('country_location_id_2', submitParams.country_location_id_2);
    // data.append('gender', submitParams.gender);
    data.append('address', submitParams.address);
    data.append('date_of_birth', submitParams.date_of_birth);
    data.append('new_password', submitParams.new_password);
    data.append('new_password_confirmation', submitParams.new_password_confirmation);
    data.append('new_wallet_password', submitParams.new_wallet_password);
    data.append('new_wallet_password_confirmation', submitParams.new_wallet_password_confirmation);
    if (submitParams.avatar) {
        data.append('avatar', {
            uri: submitParams.avatar,
            type: submitParams.mime, // or photo.type
            name: submitParams.filename
        });
        console.log('From Actions: found avatar');
    }
    console.log('From Actions');
    console.log(data);
    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postUserUpdateProfile(data)
            .then((response) => {

                if(response.status === 'success')
                {
                    userUpdateLanguageResponse_Success(dispatch, response);
                }
                else
                {
                    userUpdateLanguageResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => userUpdateLanguageResponse_Failed(dispatch));
    };
};
