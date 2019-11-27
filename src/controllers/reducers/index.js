import { combineReducers } from 'redux';
import AuthLoginReducer from './AuthReducer/AuthLoginReducer';
import AuthRegisterReducer from './AuthReducer/AuthRegisterReducer';
import LocaleReducer from './LocaleReducer';
import CountryLocationReducer from './CountryLocationReducer/CountryStateAreaReducer';
import MerchantFilterLocationsReducer from './CountryLocationReducer/MerchantFilterLocationsReducer';
import UserUpdateReducer from './UserUpdateReducer/UserUpdateReducer';
import GlobalFormsReducer from './GlobalFormsReducer/GlobalFormsReducer';

export default combineReducers({
    // Property and state
    auth_login: AuthLoginReducer,
    auth_register: AuthRegisterReducer,
    locale: LocaleReducer,
    country: CountryLocationReducer,
    merchant_filter: MerchantFilterLocationsReducer,
    user_update: UserUpdateReducer,
    global_forms: GlobalFormsReducer,
});
