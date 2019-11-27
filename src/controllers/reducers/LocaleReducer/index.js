import I18n from 'react-native-i18n';
// Import Type
import {
    CHANGE_SETTINGS_LOCALIZATION, CHANGE_SETTINGS_LOCALIZATION_IS_ALLOWED
} from '../../actions/types';
import { setUserLocale
} from '../../../utility/realm/app/AppSettingsRealmServices';

// Const Initial state
const INITIAL_STATE = {
    user_pref_language: '',
    languageIsChanged: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_SETTINGS_LOCALIZATION:
            if(action.payload === 'en') {
                // console.log("change to en from reducer");
                setUserLocale('en');
                I18n.locale = 'en';
            }
            if(action.payload === 'zh') {
                // console.log("change to zh from reducer");
                setUserLocale('zh');
                I18n.locale = 'zh';
            }
            return { ...state, user_pref_language: action.payload, languageIsChanged: true };
        case CHANGE_SETTINGS_LOCALIZATION_IS_ALLOWED:
            return { ...state, languageIsChanged: action.payload };
        default:
            return state;
    }
};
