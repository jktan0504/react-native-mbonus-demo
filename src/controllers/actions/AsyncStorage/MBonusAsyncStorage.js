import React from 'react';
import { AsyncStorage } from 'react-native';

export const AsyncStorage_SetItem = (key, data) => {
    AsyncStorage.setItem(key, data);
};

export const getUserAccessToken = async (key) => {
    try {
        let storage_user_access_token = await AsyncStorage.getItem(key);
        console.log(`work: ${storage_user_access_token}`);
        return storage_user_access_token;
    } catch (e) {
        return null;
    }
}

export const checkUserLogin = async (key) => {
    console.log(`checking`);
    let isLogin = false;
    try {
        let storage_user_access_token = await AsyncStorage.getItem(key);
        if(storage_user_access_token) {
            isLogin = true;
        }
    } catch (e) {
        isLogin = false;
    }
    console.log(`User is login = ${isLogin}`);
    return isLogin;
}
