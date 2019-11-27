// Import Type
import {
    SELECT_MERCHANT_FILTER_COUNTRY_OPTIONS, SELECT_MERCHANT_FILTER_STATE_OPTIONS,
    SELECT_MERCHANT_FILTER_AREA_OPTIONS, SELECT_APPLICATION_CLEAR_OPTIONS,
    SELECT_MERCHANT_FILTER_NOB_OPTIONS, FORM_MERCHANT_FILTER
} from '../../actions/types';


// Const Initial state
const INITIAL_STATE = {
    selected_phone_ext_id: '',
    selected_country_id: '',
    selected_state_id: '',
    selected_area_id: '',
    selected_nob_id: '',
    merchant_filter_text: '',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FORM_MERCHANT_FILTER:
            return { ...state,
                    [action.payload.props]: action.payload.value,
                    };
        case SELECT_APPLICATION_CLEAR_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return {
                ...state,
                selected_phone_ext_id: '',
                selected_country_id: '',
                selected_state_id: '',
                selected_area_id: '',
                selected_nob_id: '',
                merchant_filter_text: '',
            };
        case SELECT_MERCHANT_FILTER_NOB_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_nob_id: action.payload };
        case SELECT_MERCHANT_FILTER_COUNTRY_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_country_id: action.payload };
        case SELECT_MERCHANT_FILTER_STATE_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_state_id: action.payload };
        case SELECT_MERCHANT_FILTER_AREA_OPTIONS:
            // console.log(`user is typing ${action.payload}`);
            return { ...state, selected_area_id: action.payload };
        default:
            return state;
    }
};
