// Import Type
import {
    TYPING_USERNAME_CHANGED, TYPING_PASSWORD_CHANGED,
    STATUS_LOGIN_SUCCESS, STATUS_LOGIN_FAILED, STATUS_LOADING,
    STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED
} from '../../actions/types';


// Const Initial state
const INITIAL_STATE = {
    username: '',
    password: '',
    user_access_token: '',
    user: null,
    loading: false,
    errorMsg: '',
    successMsg: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TYPING_USERNAME_CHANGED:
            // console.log(`user is typing ${action.payload}`);
            const pattern = new RegExp(/^([0-9a-zA-Z])/);

            if ((action.payload).match(pattern))
            {
                console.log(action.payload);
                return { ...state,
                        username: action.payload,
                        errorMsg: '',
                        user_access_token: ''
                        };
            }
            else
            {
                return { ...state,
                        username: '',
                        errorMsg: '',
                        user_access_token: ''
                        };
            }

        case TYPING_PASSWORD_CHANGED:
            // console.log(`user typing password ${action.payload}`);
            return { ...state, password: action.payload,
                                errorMsg: '',
                                user_access_token: ''
                    };
        case STATUS_LOGIN_SUCCESS:
            // console.log('Login Success from AuthLoginReducer');
            //console.log(`User Access Token: ${action.payload.access_token}`);
            return { ...state,
                user_access_token: action.payload.access_token,
                user: action.payload,
                loading: false,
                errorMsg: '',
            };
        case STATUS_LOGIN_FAILED:
            // console.log('Login Failed from AuthLoginReducer');
            return { ...state,
                    loading: false,
                    errorMsg: action.payload,
                    password: '',
                };
        case STATUS_GLOABL_RESPONSE_SUCCESS:
            console.log('Forget Password Response from AuthLoginReducer');
            return { ...state,
                        loading: false,
                        errorMsg: '',
                        successMsg: action.payload.msg,
                    };
        case STATUS_GLOABL_RESPONSE_FAILED:
            console.log('Forget Password Response Failed from AuthLoginReducer');
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
