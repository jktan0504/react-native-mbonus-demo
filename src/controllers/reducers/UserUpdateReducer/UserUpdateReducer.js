import { FORM_USER_UPDATE, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED,
        SELECT_USER_PROFILE_COUNTRY_OPTIONS,
        SELECT_USER_PROFILE_STATE_OPTIONS,
        SELECT_USER_PROFILE_AREA_OPTIONS,
        SELECT_USER_PROFILE_PHONE_EXT_OPTIONS,
        FORM_USER_CLEAR_ALL,
        FORM_USER_ISREFRESHING,
} from '../../actions/types';

const INITIAL_STATE = {
    introducer: '',
    i_don_have_introducer: false,
    ic_num: '',
    contact_number: '',
    login_password: '',
    login_password_confirmation: '',
    wallet_password: '',
    wallet_password_confirmation: '',
    i_have_read_tnc: false,
    loading: false,
    isRefreshing: false,
    errorMsg: '',
    successMsg: '',
    selected_country_id: '',
    selected_state_id: '',
    selected_area_id: '',
    selected_phone_ext_id: '',
    name: '',
    email: '',
    username: '',
    contact_number_plain: '',
    address: '',
    date_of_birth: '',
    current_password2: '',
    new_password: '',
    new_password_confirmation: '',
    new_wallet_password: '',
    new_wallet_password_confirmation: '',
};

export default ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case FORM_USER_ISREFRESHING:
            // console.log(`user is typing ${action.payload}`);
            return {
                ...state,
                isRefreshing: action.payload,
            };
        case FORM_USER_CLEAR_ALL:
            // console.log(`user is typing ${action.payload}`);
            return {
                ...state,
                errorMsg: '',
                successMsg: '',
                selected_country_id: '',
                selected_state_id: '',
                selected_area_id: '',
                selected_phone_ext_id: '',
                name: '',
                email: '',
                username: '',
                contact_number_plain: '',
                address: '',
                date_of_birth: '',
                current_password2: '',
                new_password: '',
                new_password_confirmation: '',
                new_wallet_password: '',
                new_wallet_password_confirmation: '',
            };
        case FORM_USER_UPDATE:
            console.log(action.payload);
            return { ...state,
                    [action.payload.props]: action.payload.value,
                    loading: false,
                    errorMsg: '',
                    successMsg: '',
                    };
        case STATUS_GLOABL_RESPONSE_SUCCESS:
            return { ...state,
                        loading: false,
                        errorMsg: '',
                        successMsg: action.payload.msg,
                    };
        case STATUS_GLOABL_RESPONSE_FAILED:
            return { ...state,
                        loading: false,
                        errorMsg: action.payload,
                        successMsg: '',
                    };
        case STATUS_LOADING:
            return { ...state,
                        loading: true,
                        errorMsg: '',
                        successMsg: '',
                    };
        case SELECT_USER_PROFILE_PHONE_EXT_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_phone_ext_id: action.payload };
        case SELECT_USER_PROFILE_COUNTRY_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_country_id: action.payload };
        case SELECT_USER_PROFILE_STATE_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_state_id: action.payload };
        case SELECT_USER_PROFILE_AREA_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_area_id: action.payload };
        default:
            return state;
    }
};
