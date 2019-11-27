import { FORM_USER_REGISTER, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED
} from '../../actions/types';

const INITIAL_STATE = {
    introducer: '',
    i_don_have_introducer: false,
    full_name: '',
    ic_num: '',
    contact_number: '',
    email: '',
    username: '',
    login_password: '',
    login_password_confirmation: '',
    wallet_password: '',
    wallet_password_confirmation: '',
    i_have_read_tnc: false,
    loading: false,
    errorMsg: '',
    successMsg: '',
};

export default ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case FORM_USER_REGISTER:
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
        default:
            return state;
    }
};
