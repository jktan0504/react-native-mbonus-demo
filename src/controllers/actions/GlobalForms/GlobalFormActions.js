import { FORM_GLOBAL_ACTION_UPDATE, STATUS_LOADING,
        FORM_GLOBAL_ACTION_CLEAR,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        SELECT_GLOBAL_FORMS_COUNTRY_OPTIONS,
        SELECT_GLOBAL_FORMS_STATE_OPTIONS,
        SELECT_GLOBAL_FORMS_AREA_OPTIONS,
        SELECT_GLOBAL_FORMS_PHONE_EXT_OPTIONS,
        SELECT_GLOBAL_FORMS_NOB_OPTIONS,
        SELECT_GLOBAL_FORMS_MERCHANT_GROUP_OPTIONS,
        SELECT_GLOBAL_FORMS_BANK_OPTIONS,
        SELECT_GLOBAL_FORMS_COMP_BANK_OPTIONS,
        FORM_GLOBAL_ACTION_USERNAME_SUCCESS_CLEAR
} from '../../actions/types';
import { postUserUpdateLanguage, postUserUpdateProfile
} from '../../../utility/networking/MBonusAuthServices';

// GLOBAL FORMS UPDATE
export const globalActionsFormUpdate = ({ props, value }) => {
    console.log(`globalActions Prop: ${props} and value ${value}`);
    return {
        type: FORM_GLOBAL_ACTION_UPDATE,
        payload: { props, value }
    };
};

// Select Phone Ext
export const globalFormsUpdatephoneExtOptionSelected = (phone_ext_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_PHONE_EXT_OPTIONS,
        payload: phone_ext_id
    };
};

// Select Country Option
export const globalFormUpdateCountryOptionSelected = (selected_country_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_COUNTRY_OPTIONS,
        payload: selected_country_id
    };
};

// Select State Option
export const globalFormUpdateStateOptionSelected = (selected_state_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_STATE_OPTIONS,
        payload: selected_state_id
    };
};

// Select Area Option
export const globalFormUpdateAreaOptionSelected = (selected_area_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_AREA_OPTIONS,
        payload: selected_area_id
    };
};

// Select NOB Option
export const globalFormUpdateNOBOptionSelected = (selected_nob_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_NOB_OPTIONS,
        payload: selected_nob_id
    };
};

// Select Merchant Group Option
export const globalFormUpdateMerchantGroupOptionSelected = (selected_mg_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_MERCHANT_GROUP_OPTIONS,
        payload: selected_mg_id
    };
};

// Select Bank Option
export const globalFormUpdateBankOptionSelected = (selected_bank_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_BANK_OPTIONS,
        payload: selected_bank_id
    };
};

// Select Comp Bank Option
export const globalFormUpdateCompBankOptionSelected = (selected_comp_bank_id) => {
    return {
        type: SELECT_GLOBAL_FORMS_COMP_BANK_OPTIONS,
        payload: selected_comp_bank_id
    };
};


// CLEAR Option
export const globalFormsClearAll = () => {
    return {
        type: FORM_GLOBAL_ACTION_CLEAR,
        payload: ''
    };
};

// CLEAR Option
export const globalFormsClear_UsernameSuccess= () => {
    return {
        type: FORM_GLOBAL_ACTION_USERNAME_SUCCESS_CLEAR,
        payload: ''
    };
};

// Global Response Success
const globalResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// Global Response Failed
const globalResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};
