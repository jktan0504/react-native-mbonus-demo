import { FORM_GLOBAL_ACTION_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        FORM_GLOBAL_ACTION_REFRESH, FORM_GLOBAL_ACTION_CLEAR,
        SELECT_GLOBAL_FORMS_COUNTRY_OPTIONS,
        SELECT_GLOBAL_FORMS_STATE_OPTIONS,
        SELECT_GLOBAL_FORMS_AREA_OPTIONS,
        SELECT_GLOBAL_FORMS_PHONE_EXT_OPTIONS,
        SELECT_GLOBAL_FORMS_NOB_OPTIONS,
        SELECT_GLOBAL_FORMS_MERCHANT_GROUP_OPTIONS,
        SELECT_GLOBAL_FORMS_BANK_OPTIONS,
        SELECT_GLOBAL_FORMS_COMP_BANK_OPTIONS,
        FORM_GLOBAL_ACTION_TARGET_USERNAME_VERIFIED,
        FORM_GLOBAL_ACTION_TARGET_USERNAME_UNVERIFIED,
        FORM_GLOBAL_ACTION_USERNAME_SUCCESS_CLEAR,
} from '../../actions/types';

const INITIAL_STATE = {
    loading: false,
    isRefreshing: false,
    errorMsg: '',
    successMsg: '',
    targetUsernameSuccessMsg: '',
    targetUsernameFailedMsg: '',
    customer_service_msg: '',
    customer_service_chat_room_title: '',
    customer_service_chat_room_descp: '',
    selected_phone_ext_id: '',
    selected_country_id: '',
    selected_state_id: '',
    selected_area_id: '',
    selected_nob_id: '',
    selected_mg_id: '',
    selected_bank_id: '',
    selected_comp_bank_id: '',

    target_username: '',
    current_password2: '',
    name: '',
    email: '',
    rebate_to_offer: '',
    pic_name: '',
    pic_contact_number: '',
    bank_reference_number: '',
    remark: '',
    trans_m_amount: '',
    trans_m_remark: '',
    trans_m_currentpasword2: '',
    trans_r_amount: '',
    trans_r_remark: '',
    trans_r_currentpasword2: '',
    national_id: '',
};

export default ( state = INITIAL_STATE, action ) => {
    console.log(action.type);
    switch (action.type) {

        case FORM_GLOBAL_ACTION_CLEAR:
            // console.log(`user is typing ${action.payload}`);
            return {
                ...state,
                loading: false,
                isRefreshing: false,
                errorMsg: '',
                successMsg: '',
                targetUsernameSuccessMsg: '',
                targetUsernameFailedMsg: '',
                customer_service_msg: '',
                customer_service_chat_room_title: '',
                customer_service_chat_room_descp: '',
                selected_phone_ext_id: '',
                selected_country_id: '',
                selected_state_id: '',
                selected_area_id: '',
                selected_nob_id: '',
                selected_mg_id: '',
                selected_bank_id: '',
                selected_comp_bank_id: '',

                target_username: '',
                current_password2: '',
                name: '',
                email: '',
                rebate_to_offer: '',
                pic_name: '',
                pic_contact_number: '',
                bank_reference_number: '',
                remark: '',
                trans_m_amount: '',
                trans_m_remark: '',
                trans_m_currentpasword2: '',
                trans_r_amount: '',
                trans_r_remark: '',
                trans_r_currentpasword2: '',
                national_id: '',
                username: '',
                contact_number_plain: '',
                address: '',
                date_of_birth: '',
                new_password: '',
                new_password_confirmation: '',
                new_wallet_password: '',
                new_wallet_password_confirmation: '',
            };
        case FORM_GLOBAL_ACTION_USERNAME_SUCCESS_CLEAR:
            // console.log(`user is typing ${action.payload}`);
            return {
                ...state,
                loading: false,
                isRefreshing: false,
                errorMsg: '',
                successMsg: '',
                targetUsernameSuccessMsg: '',
                targetUsernameFailedMsg: '',
                customer_service_msg: '',
                customer_service_chat_room_title: '',
                customer_service_chat_room_descp: '',
                selected_phone_ext_id: '',
                selected_country_id: '',
                selected_state_id: '',
                selected_area_id: '',
                selected_nob_id: '',
                selected_mg_id: '',
                selected_bank_id: '',
                selected_comp_bank_id: '',

                current_password2: '',
                name: '',
                email: '',
                rebate_to_offer: '',
                pic_name: '',
                pic_contact_number: '',
                bank_reference_number: '',
                remark: '',
                trans_m_amount: '',
                trans_m_remark: '',
                trans_m_currentpasword2: '',
                trans_r_amount: '',
                trans_r_remark: '',
                trans_r_currentpasword2: '',
                national_id: '',

                username: '',
                contact_number_plain: '',
                address: '',
                date_of_birth: '',
                new_password: '',
                new_password_confirmation: '',
                new_wallet_password: '',
                new_wallet_password_confirmation: '',
            };
        case FORM_GLOBAL_ACTION_UPDATE:
            // console.log(action.payload);
            return { ...state,
                    [action.payload.props]: action.payload.value,
                    loading: false,
                    errorMsg: '',
                    successMsg: '',
                    };
        case FORM_GLOBAL_ACTION_TARGET_USERNAME_VERIFIED:
            console.log(action.type);
            console.log(action.payload);
            return {    ...state,
                        loading: false,
                        targetUsernameFailedMsg: '',
                        targetUsernameSuccessMsg: action.payload.msg,
                        customer_service_msg: '',
                        customer_service_chat_room_title: '',
                        customer_service_chat_room_descp: '',

                    };
        case FORM_GLOBAL_ACTION_TARGET_USERNAME_UNVERIFIED:
            console.log(action.type);
            console.log(action.payload);
            return  { ...state,
                        loading: false,
                        targetUsernameFailedMsg: action.payload,
                        targetUsernameSuccessMsg: '',
                    };
        case STATUS_GLOABL_RESPONSE_SUCCESS:
            return { ...state,
                        loading: false,
                        errorMsg: '',
                        successMsg: action.payload.msg,
                        customer_service_msg: '',
                        customer_service_chat_room_title: '',
                        customer_service_chat_room_descp: '',

                    };
        case STATUS_GLOABL_RESPONSE_FAILED:
            return { ...state,
                        loading: false,
                        errorMsg: action.payload,
                        successMsg: '',
                        customer_service_msg: '',
                        customer_service_chat_room_title: '',
                        customer_service_chat_room_descp: '',
                    };
        case FORM_GLOBAL_ACTION_REFRESH:
            // console.log(`user is typing ${action.payload}`);
            return {
                        ...state,
                        isRefreshing: action.payload,
                    };

        case STATUS_LOADING:
            console.log('loading is true');
            return { ...state,
                        loading: true,
                        errorMsg: '',
                        successMsg: '',
                    };
        case SELECT_GLOBAL_FORMS_PHONE_EXT_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_phone_ext_id: action.payload };
        case SELECT_GLOBAL_FORMS_COUNTRY_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_country_id: action.payload };
        case SELECT_GLOBAL_FORMS_STATE_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_state_id: action.payload };
        case SELECT_GLOBAL_FORMS_AREA_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_area_id: action.payload };
        case SELECT_GLOBAL_FORMS_NOB_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_nob_id: action.payload };
        case SELECT_GLOBAL_FORMS_MERCHANT_GROUP_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_mg_id: action.payload };
        case SELECT_GLOBAL_FORMS_BANK_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_bank_id: action.payload };
        case SELECT_GLOBAL_FORMS_COMP_BANK_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_comp_bank_id: action.payload };
        default:
            return state;
    }
};
