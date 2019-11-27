/*
 * Realm Local DB
 *
 */
import Realm from 'realm';

// TABLE NAME
// APP SETTINGS
export const APP_SETTINGS_SCHEMA = 'APP_SETTINGS_SCHEMA';

// DATABASE OPTIONS
const databaseOptions = {
    path: 'MBONUSAPP.realm',
    schema: [AppSettingsSchema],
    schemaVersion: 0,
};

// DEFINE APP SETTINGS MODEL AND PROPTERTIES
export const  AppSettingsSchema = {
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
