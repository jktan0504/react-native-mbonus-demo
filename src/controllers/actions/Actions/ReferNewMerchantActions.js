import { FORM_GLOBAL_ACTION_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        FORM_GLOBAL_ACTION_REFRESH, FORM_GLOBAL_ACTION_CLEAR,
        SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        SELECT_USER_PROFILE_STATE_OPTIONS,
        SELECT_USER_PROFILE_AREA_OPTIONS,
        SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        FORM_USER_CLEAR_ALL,
        FORM_USER_ISREFRESHING,
} from '../../actions/types';
import { postReferNewMerchant
} from '../../../utility/networking/MBonusAuthServices';



// referNewMerchant Response Success
const referNewMerchantResponse_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// referNewMerchant Response Failed
const referNewMerchantResponse_Failed = (dispatch, errorMsg) => {
    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};

export const referNewMerchantIsRefreshing = (isRefreshing) => {
    return {
        type: FORM_GLOBAL_ACTION_REFRESH,
        payload: isRefreshing
    };
};

export const referNewMerchantSubmit = (submitParams) => {
    console.log(submitParams);
    const data = new FormData();
    data.append('name', submitParams.name);
    data.append('email', submitParams.email);
    data.append('nature_of_business_1', submitParams.nature_of_business_1);
    data.append('nature_of_business_2', submitParams.nature_of_business_2);
    data.append('nature_of_business_3', submitParams.nature_of_business_3);
    data.append('rebate_to_offer', submitParams.rebate_to_offer);
    data.append('pic_name', submitParams.pic_name);
    data.append('pic_contact_number', submitParams.pic_contact_number);
    data.append('group_id', submitParams.group_id);
    data.append('i_confirm', submitParams.i_confirm);
    data.append('bank_reference_number', submitParams.bank_reference_number);
    data.append('current_password2', submitParams.current_password2);
    data.append('country_id', submitParams.country_id);
    data.append('contact_country_id', submitParams.contact_country_id);
    data.append('country_location_id', submitParams.country_location_id);
    data.append('country_location_id_2', submitParams.country_location_id_2);
    data.append('company_bank', submitParams.company_bank);
    data.append('remark', submitParams.remark);
    data.append('country_location_id', submitParams.country_location_id);
    data.append('company_logo_attachment', {
        uri: submitParams.company_logo_attachment,
        type: submitParams.comp_mime, // or photo.type
        name: submitParams.comp_filename
    });
    data.append('name_card_attachment', {
        uri: submitParams.name_card_attachment,
        type: submitParams.namecard_mime, // or photo.type
        name: submitParams.namecard_filename
    });
    data.append('receipt', {
        uri: submitParams.receipt,
        type: submitParams.receipt_mime, // or photo.type
        name: submitParams.receipt_filename
    });
    data.append('ssm_attachment', {
        uri: submitParams.ssm_attachment,
        type: submitParams.ssm_mime, // or photo.type
        name: submitParams.ssm_filename
    });
    if (submitParams.invoice) {
        data.append('invoice', {
        uri: submitParams.invoice,
        type: submitParams.invoice_mime, // or photo.type
        name: submitParams.invoice_filename
    });
        console.log('From Actions: found Invoice');
    }


    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        postReferNewMerchant(data)
            .then((response) => {

                if(response.status === 'success')
                {
                    referNewMerchantResponse_Success(dispatch, response);
                }
                else
                {
                    referNewMerchantResponse_Failed(dispatch, response.msg);
                }
            })
            .catch(() => referNewMerchantResponse_Failed(dispatch));
    };
};
