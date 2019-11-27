// Import Type
import {
    SELECT_APPLICATION_PHONE_EXT_OPTIONS,
    SELECT_APPLICATION_COUNTRY_OPTIONS, SELECT_APPLICATION_STATE_OPTIONS,
    SELECT_APPLICATION_AREA_OPTIONS, STATUS_GET_PHONE_EXT_SUCCESS, STATUS_GET_PHONE_EXT_FAILED
} from '../../actions/types';


// Const Initial state
const INITIAL_STATE = {
    selected_phone_ext_id: '',
    selected_country_id: '',
    selected_state_id: '',
    selected_area_id: '',
    phone_ext_lists: null,
    country_option_lists: null,
    state_option_lists: null,
    area_option_lists: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SELECT_APPLICATION_PHONE_EXT_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_phone_ext_id: action.payload };
        case SELECT_APPLICATION_COUNTRY_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_country_id: action.payload };
        case SELECT_APPLICATION_STATE_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_state_id: action.payload };
        case SELECT_APPLICATION_AREA_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_area_id: action.payload };
        case STATUS_GET_PHONE_EXT_SUCCESS:
            console.log(`phone ext from action ${action.payload}`);
            console.log(action.payload);
            return { ...state, phone_ext_lists: action.payload };
        default:
            return state;
    }
};
