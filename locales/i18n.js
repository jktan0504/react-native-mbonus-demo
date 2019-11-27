import React, { Component } from 'react';
import ReactNative, { AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
import { getMBonusAppLanguageSetting,
            setUserLocale
} from '../src/utility/realm/app/AppSettingsRealmServices';
// Import all locales
import en from './en.json';
import zh from './zh.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
    en,
    zh
};

// Start Running
console.log('Language is running');
// const currentLocale = getCurrentSelectedLanguage();
// const currentLocale = AppSettingsRealmServices.getAppSetting().locale;
// currentLocale = 'en';
// currentLocale = 'zh';
// Checking User Preference
// I18n.locale = getMBonusAppLanguageSetting();
getMBonusAppLanguageSetting().then((locale) => {
    // console.log(`success with locale : ${locale}`);
    I18n.locale = locale;
}).catch((error) => {
    // console.log(`failed with locale : ${error}`);
    I18n.locale = 'en';
})

// Is it a RTL language?
// export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
// ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
    // console.log(`current selected language : ${currentLocale}`);
  return I18n.t(name, params);
};

export function changeToEN() {
    // console.log('change to EN from Locale');
    // AsyncStorage.setItem(ASYNCTORAGE_USER_PREF_LANGUAGE, 'en');
    setUserLocale('en');
    // I18n.locale = 'en';
}

export function changeToZH() {
    // console.log('change to ZH from Locale');
    //AsyncStorage.setItem(ASYNCTORAGE_USER_PREF_LANGUAGE, 'zh');
    setUserLocale('zh');
    // I18n.locale = 'zh';
}


export default I18n;
