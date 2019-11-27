import { AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
import { TYPING_USERNAME_CHANGED, TYPING_PASSWORD_CHANGED,
        STATUS_LOGIN_SUCCESS, STATUS_LOGIN_FAILED, STATUS_LOADING,
        STATUS_GLOABL_RESPONSE_SUCCESS, STATUS_GLOABL_RESPONSE_FAILED
} from '../types';
import { GRANT_TYPE, CLIENT_ID, CLIENT_SECRET, ASYNCTORAGE_USER_TOKEN,
    ASYNCTORAGE_USER_LAST_LOGIN, ASYNCTORAGE_USER_DETAILS,
} from '../../../utility/constants';
import { userUnAuthLogin, userUnAuthForgetPassword } from '../../../utility/networking/MBonusUnAuthServices';
import { getAuthUserDetails } from '../../../utility/networking/MBonusAuthServices';
import { AsyncStorage_SetItem } from '../AsyncStorage/MBonusAsyncStorage';
import { onlyLettersAndNumbers } from '../../../utility/helpers/validations';
import { setUserLocale } from '../../../utility/realm/app/AppSettingsRealmServices';

export const usernameTypingChanged = (text) => {
    /*
    const validatedUsername = onlyLettersAndNumbers.exec(text);
    if (validatedUsername) {
        return {
            type: TYPING_USERNAME_CHANGED,
            payload: text
        };
    } else {
        return {
            type: TYPING_USERNAME_CHANGED,
            payload: ''
        };
    } */

    return {
        type: TYPING_USERNAME_CHANGED,
        payload: text
    };
};

export const passwordTypingChanged = (text) => {
    return {
        type: TYPING_PASSWORD_CHANGED,
        payload: text
    };
};

export const userLoginSubmit = ({ username, password }) => {
    console.log(`Username: ${username} Password: ${password}`);
    const submitParams = {
        grant_type: GRANT_TYPE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username,
        password,
        scope: '*',
    };

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        userUnAuthLogin(submitParams)
            .then((response) => {

                if(response.access_token)
                {
                    userLoginStatus_Success(dispatch, response);
                }
                else if (response.error)
                {
                    userLoginStatus_Failed(dispatch, response.message);
                }
                else
                {
                    userLoginStatus_Failed(dispatch, response.message);
                }
            })
            .catch(() => userLoginStatus_Failed(dispatch));
    };
};

// Login Success
const userLoginStatus_Success = (dispatch, userTokenResponse) => {
    // AsyncStorage.setItem(ASYNCTORAGE_USER_TOKEN,  c);
    const current_date_time = new Date().toString();
    const formatted_date = new Date().toString().slice(0, 24);
    const singaporeTimeZone = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore' });
    const accessTOKEN = userTokenResponse.access_token;
    AsyncStorage_SetItem(ASYNCTORAGE_USER_TOKEN, accessTOKEN);
    AsyncStorage_SetItem(ASYNCTORAGE_USER_LAST_LOGIN, singaporeTimeZone);
    dispatch({
        type: STATUS_LOGIN_SUCCESS,
        payload: userTokenResponse
    });

    getAuthUserDetails()
        .then((UserFullDetails) => {
            console.log(UserFullDetails);
            const USER_FULL_DETAILS = UserFullDetails.data.user;
            AsyncStorage_SetItem(ASYNCTORAGE_USER_DETAILS, JSON.stringify(USER_FULL_DETAILS));
            switch (USER_FULL_DETAILS.lang) {
                case 'cn':
                    setUserLocale('zh');
                    I18n.locale = 'zh';
                    break;
                case 'en':
                    setUserLocale('en');
                    I18n.locale = 'en';
                    break;
                default:
                    setUserLocale('en');
                    I18n.locale = 'en';
                    break;
            }
        })
        .catch((error) => {
            console.log(error);
        });
};


// Login Failed
const userLoginStatus_Failed = (dispatch, errorMsg) => {
    dispatch({
        type: STATUS_LOGIN_FAILED,
        payload: errorMsg
    });
};

// User Forget Password
export const userForgetPasswordSubmit = ({ username }) => {
    console.log(`Username: ${username}`);
    const submitParams = {
        username,
    };

    return (dispatch) => {
        // LOADING_STATUS
        dispatch({
            type: STATUS_LOADING,
        });

        userUnAuthForgetPassword(submitParams)
            .then((response) => {

                if(response.status === 'success')
                {
                    userForgetPasswordStatus_Success(dispatch, response);
                }
                else
                {
                    userForgetPasswordStatus_Failed(dispatch, response.msg);
                }
            })
            .catch(() => userForgetPasswordStatus_Failed(dispatch));
    };
};

// Forget Password Response Success
const userForgetPasswordStatus_Success = (dispatch, response) => {
    dispatch({
        type: STATUS_GLOABL_RESPONSE_SUCCESS,
        payload: response
    });
};

// Forget Password Response Failed
const userForgetPasswordStatus_Failed = (dispatch, errorMsg) => {

    let full_error_msg = errorMsg;
    let filter_msg_index = full_error_msg.indexOf(' . ');
    let full_error_msg_length = full_error_msg.length;
    let filter_error_msg = full_error_msg.substring(filter_msg_index + 3, full_error_msg_length);

    dispatch({
        type: STATUS_GLOABL_RESPONSE_FAILED,
        payload: filter_error_msg
    });
};
