
import React from 'react';
// import API
import {
    API_USER_LOGIN, API_USER_FORGET_PASSWORD, API_USER_REGISTER,
    API_APP_GET_PHONE_EXT_OPTIONS, API_APP_GET_COUNTRY_OPTIONS,
    API_APP_GET_STATE_OPTIONS, API_APP_GET_AREA_OPTIONS, API_APP_GET_TNC,
    API_APP_GET_SETTINGS, API_APP_GET_NOB_OPTIONS,
    API_APP_GET_BANK_OPTIONS, API_APP_GET_COMPANY_BANK_OPTIONS,
    API_APP_GET_MERCHANT_GROUP_OPTIONS,
} from './API';

// UnAuth Header for MBonus Networking Service
const unAuthHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json', // ** MUST **
    'secret': 'tHCeMANTx91zt1E16p',
};

// USER UNAUTH LOGIN
async function userUnAuthLogin(params) {
    // using FB Fetch Method
    try {
        console.log("Async userUnAuthLogin is running");
        let response = await fetch((API_USER_LOGIN), {
            method: 'POST',
            headers: unAuthHeader,
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in userUnAuthLogin: ${e}`);
    }
}

// USER UNAUTH FORGET PASSWORD
async function userUnAuthForgetPassword(params) {
    // using FB Fetch Method
    try {
        console.log("Async userUnAuthForgetPassword is running");
        let response = await fetch((API_USER_FORGET_PASSWORD), {
            method: 'POST',
            headers: unAuthHeader,
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in userUnAuthForgetPassword: ${e}`);
    }
}

// USER UNAUTH REGISTEr
async function userUnAuthRegister(params) {
    // using FB Fetch Method
    try {
        console.log("Async User Register is running");
        let response = await fetch((API_USER_REGISTER), {
            method: 'POST',
            headers: unAuthHeader,
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in userUnAuthRegister: ${e}`);
    }
}

// GETTING PHONE EXT OPTIONS
async function getPhoneExtOptions() {
    // using FB Fetch Method
    try {
        console.log("Async userUnAuthForgetPassword is running");
        let response = await fetch((API_APP_GET_COUNTRY_OPTIONS), {
            method: 'GET',
            headers: unAuthHeader,
        });

        // convert to json
        let responseJSON = await response.json();
        //await console.log(`From UnAuthService: ${responseJSON}`);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getPhoneExt: ${e}`);
    }
}

// GETTING COUNTRY OPTIONS
async function getCountryOptions() {
    // using FB Fetch Method
    try {
        console.log("Async getCountry is running");
        let response = await fetch((API_APP_GET_COUNTRY_OPTIONS), {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getCountry: ${e}`);
    }
}

// GETTING STATE OPTIONS
async function getStateOptions(params) {
    // using FB Fetch Method
    try {
        console.log(`Async getState is running at`);
        console.log(`with params ${params.country_id}`);
        let response = await fetch((`${API_APP_GET_STATE_OPTIONS}?country_id=${params.country_id}`), {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getState: ${e}`);
    }
}

// GETTING STATE OPTIONS
async function getAreaOptions(params) {
    // using FB Fetch Method
    try {
        console.log("Async getArea is running");
        let response = await fetch((API_APP_GET_AREA_OPTIONS+'?country_id='+
                        params.country_id+'&country_location_id='+params.country_location_id),
        {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getArea: ${e}`);
    }
}

// GETTING NOB OPTIONS
async function getNOBOptions() {
    // using FB Fetch Method
    try {
        console.log("Async getArea is running");
        let response = await fetch((API_APP_GET_NOB_OPTIONS),
        {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getArea: ${e}`);
    }
}

// GETTING APP TNC
async function getTNC() {
    // using FB Fetch Method
    try {
        console.log("Async getTNC is running");
        let response = await fetch((API_APP_GET_TNC),
        {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getTNC: ${e}`);
    }
}

// GETTING BANK OPTIONS
async function getBankOptions() {
    // using FB Fetch Method
    try {
        console.log("Async getBankOptions is running");
        let response = await fetch((API_APP_GET_BANK_OPTIONS), {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getBankOptions: ${e}`);
    }
}

// GETTING COMAPANY BANK OPTIONS
async function getCompanyBankOptions() {
    // using FB Fetch Method
    try {
        console.log("Async getCompanyBankOptions is running");
        let response = await fetch((API_APP_GET_COMPANY_BANK_OPTIONS), {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getCompanyBankOptions: ${e}`);
    }
}

// GETTING MERCHANT GROUP OPTIONS
async function getMerchantGroupOptions() {
    // using FB Fetch Method
    try {
        console.log("Async getMerchantGroupOptions is running");
        let response = await fetch((API_APP_GET_MERCHANT_GROUP_OPTIONS), {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getMerchantGroupOptions: ${e}`);
    }
}

// GETTING APP TNC
async function getAppSettings() {
    // using FB Fetch Method
    try {
        console.log("Async getTNC is running");
        let response = await fetch((API_APP_GET_SETTINGS),
        {
            method: 'GET',
            headers: unAuthHeader,
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAppSettings: ${e}`);
    }
}


export { userUnAuthLogin, userUnAuthForgetPassword, userUnAuthRegister,
    getPhoneExtOptions, getCountryOptions, getStateOptions, getAreaOptions,
    getTNC, getAppSettings, getNOBOptions, getBankOptions, getCompanyBankOptions,
    getMerchantGroupOptions,
};
