// COUNTRYLOCATION_ACTIONS
import { SELECT_MERCHANT_FILTER_COUNTRY_OPTIONS, SELECT_MERCHANT_FILTER_STATE_OPTIONS,
    SELECT_MERCHANT_FILTER_AREA_OPTIONS, SELECT_APPLICATION_CLEAR_OPTIONS,
    SELECT_MERCHANT_FILTER_NOB_OPTIONS, FORM_MERCHANT_FILTER
} from '../types';

// CLEAR Option
export const merchantClearFilterOptionSelected = () => {
    return {
        type: SELECT_APPLICATION_CLEAR_OPTIONS,
        payload: ''
    };
};

// Select Nob Option
export const merchantFilterNobOptionSelected = (selected_nob_id) => {
    return {
        type: SELECT_MERCHANT_FILTER_NOB_OPTIONS,
        payload: selected_nob_id
    };
};

// Select Country Option
export const merchantFilterCountryOptionSelected = (selected_country_id) => {
    return {
        type: SELECT_MERCHANT_FILTER_COUNTRY_OPTIONS,
        payload: selected_country_id
    };
};

// Select State Option
export const merchantFilterStateOptionSelected = (selected_state_id) => {
    return {
        type: SELECT_MERCHANT_FILTER_STATE_OPTIONS,
        payload: selected_state_id
    };
};

// Select Area Option
export const merchantFilterAreaOptionSelected = (selected_area_id) => {
    return {
        type: SELECT_MERCHANT_FILTER_AREA_OPTIONS,
        payload: selected_area_id
    };
};

export const merchantFilterFormUpdate = ({ props, value }) => {
    console.log(`Prop: ${props} and value ${value}`);
    return {
        type: FORM_MERCHANT_FILTER,
        payload: { props, value }
    };
};
