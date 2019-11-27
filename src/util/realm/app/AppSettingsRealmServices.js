/* APP SETTINGS SERVICE LOCAL DB*/

import Realm from 'realm';
import I18n from 'react-native-i18n';
import { AsyncStorage } from 'react-native';
// ASYNCTORAGE_USER_TOKEN
import { ASYNCTORAGE_USER_DETAILS } from '../../constants';

// TABLE NAME
// APP SETTINGS
const APP_SETTINGS_SCHEMA = 'APP_SETTINGS_SCHEMA';

// DEFINE APP SETTINGS MODEL AND PROPTERTIES
const  AppSettingsSchema = {
    name: APP_SETTINGS_SCHEMA,
    primaryKey: 'id', // index but not auto-increment value
    properties: {
        id: 'int', // primary key
        setting_name: {
            type: 'string',
            indexed: true,
        },
        setting_value: {
            type: 'string',
        }
    }
};

// DATABASE OPTIONS
const databaseOptions = {
    path: 'MBONUSAPP.realm',
    schema: [AppSettingsSchema],
    schemaVersion: 0,
};


// LANGUAGE SETTINGS
export const getMBonusAppSetting = () => {
    Realm.open(databaseOptions).then(realm => {
        const setting = realm.objects(APP_SETTINGS_SCHEMA);

        if (setting.length < 1) {
            let locale = 'en';
            let userDetails = [];
            AsyncStorage.getItem(ASYNCTORAGE_USER_DETAILS)
                .then(localStorageData => {
                    // console.log(`res: ${res}`);
                    if (localStorageData !== null) {
                        userDetails = JSON.parse(localStorageData);
                        if(userDetails) {
                            locale = userDetails.lang;
                            switch (locale) {
                                case 'cn':
                                    setUserLocale('zh');
                                    I18n.locale = 'zh';
                                    locale = 'zh';
                                    break;
                                case 'en':
                                    setUserLocale('en');
                                    I18n.locale = 'en';
                                    locale = 'en';
                                    break;
                                default:
                                    setUserLocale('en');
                                    I18n.locale = 'en';
                                    locale = 'en';
                                    break;
                            }
                        }
                    }
                    else
                    {
                        locale = 'en';
                    }
                })
                .catch(err => reject(err));

            realm.write(() => {
                realm.create(APP_SETTINGS_SCHEMA, {
                    id: 1,
                    setting_name: 'User_Language',
                    setting_value: locale,
                })
            })
        }
        console.log(`found language: ${setting[0]}`);
        console.log(setting[0].setting_value);
        return setting[0];
    }).catch((error) => console.log(error));
};

export const getMBonusAppLanguageSetting = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const setting = realm.objects(APP_SETTINGS_SCHEMA);
        if (setting.length < 1) {
            console.log('smaller than 1');
            const locale = 'en';
            realm.write(() => {
                realm.create(APP_SETTINGS_SCHEMA, {
                    id: 1,
                    setting_name: 'User_Language',
                    setting_value: locale,
                })
            })
        }
        resolve(setting[0].setting_value);
    }).catch((error) => reject(error));
});

export const setUserLocale = (newLocale) => {
    Realm.open(databaseOptions).then(realm => {
        const setting = realm.objects(APP_SETTINGS_SCHEMA);
        realm.write(() => {
            console.log(`running the setUserLocale ${newLocale} `);
            setting[0].setting_value = newLocale;
        })
    }).catch((error) => console.log(error));
};

// NOTIFICATION SETTINGS
export const getMBonusNotificaitonSettings = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        const setting = realm.objects(APP_SETTINGS_SCHEMA);
        if (setting.length <= 1) {
            console.log('smaller and equal than 1');
            const isNotificationOn = 'true';
            realm.write(() => {
                realm.create(APP_SETTINGS_SCHEMA, {
                    id: 2,
                    setting_name: 'User_Notification',
                    setting_value: isNotificationOn,
                })
            })
        }
        resolve(setting[1].setting_value);
    }).catch((error) => reject(error));
});

export const setUserNotificationConfiguration = (isNotificationOn) => {
    Realm.open(databaseOptions).then(realm => {
        const setting = realm.objects(APP_SETTINGS_SCHEMA);
        console.log(`running change notification: ${isNotificationOn}`);
        let result = '';
        switch (isNotificationOn) {
            case true:
                result = 'true';
                break;
            case false:
                result = 'false';
                break;
        }
        realm.write(() => {
            setting[1].setting_value = result;
        })
    }).catch((error) => console.log(error));
};
