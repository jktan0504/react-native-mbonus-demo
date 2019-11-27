import {
    CHANGE_SETTINGS_LOCALIZATION, CHANGE_SETTINGS_LOCALIZATION_IS_ALLOWED
} from '../types';

export const changeSettingsLocalization = (language) => {
    console.log('locale reducer is running');
    console.log(`language is ${language}`);
    return {
        type: CHANGE_SETTINGS_LOCALIZATION,
        payload: language
    };
};

export const changeSettingsLocalizationIsAllowed = (allowed) => {
    return {
        type: CHANGE_SETTINGS_LOCALIZATION_IS_ALLOWED,
        payload: allowed
    };
};
