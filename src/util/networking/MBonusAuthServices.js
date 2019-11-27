
import React, {Component} from 'react';
import { AsyncStorage } from 'react-native';
// ASYNCTORAGE_USER_TOKEN
import { ASYNCTORAGE_USER_TOKEN } from '../constants';
// import API
import {
    API_USER_DETAILS, API_APP_GET_IMG_SLIDERS, API_MERCHANT_GET_ALL_MERCHANT,
    API_MERCHANT_GET_MERCHANT_BY_ID, API_MERCHANT_GET_NEARBY_MERCHANT,
    API_WALLET_GET_ALL_TRANS_1, API_WALLET_GET_ALL_TRANS_2,
    API_WALLET_GET_ALL_TRANS_3, API_WALLET_GET_ALL_TRANS_4,
    API_WALLET_GET_WITHDRAWAL, API_ANNOUNCEMENT_GET_ALL,
    API_WALLET_GET_PENDING_REBATE, API_USER_MY_COMMUNITY,
    API_USER_UPDATE_LANGUAGE, API_USER_UPDATE_PROFILE,
    API_CUSTOMER_SERVICES_GET_ALL_CHAT_ROOMS,
    API_CUSTOMER_SERVICES_GET_SINGLE_CHAT_ROOM,
    API_CUSTOMER_SERVICES_POST_REPLY_SINGLE_CHAT_MSG,
    API_CUSTOMER_SERVICES_CREATE_NEW_CHAT_ROOM,
    API_COMP_REP_REFER, API_COMP_REP_REFER_CHECK_USERNAME,
    API_COMP_REP_BECOME, API_REFER_NEW_MERCHANT,
    API_TRANSFER_M_WALLET, API_TRANSFER_R_WALLET,
    API_TRANSFER_R_WALLET_CHECK_USERNAME, API_WITHDRAWAL_SUBMIT,
    API_UPGRADE_TO_AGENT, API_UPGRADE_TO_AGENT_CHECK_USERNAME,
    API_REGISTER_NEW_MEMBER, API_REGISTER_CHECK_USERNAME,
} from './API';

const getMBonusUserAccessToken = () => new Promise((resolve, reject) => {
    console.log('getting token is running');
    AsyncStorage.getItem(ASYNCTORAGE_USER_TOKEN)
        .then(res => {
            if (res !== null) {
                resolve(res);
                return res;
            }
            else
            {
                resolve(false);
            }
        })
        .catch(err => reject(err));
 });

generateAuthHeader = (myAccessToken) => {
    const MyMainMBonusAuthHeader = {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // ** MUST **
        'secret': 'tHCeMANTx91zt1E16p',
        'Authorization': `Bearer ${myAccessToken}`,
    }
    return MyMainMBonusAuthHeader;
}

generateTestAuthHeader = (myAccessToken) => {
    const MyMainMBonusAuthHeader = {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // ** MUST **
        'secret': 'tHCeMANTx91zt1E16p',
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNmN2Q5NDIzYTU2NTI2NmY2N2FkN2ViOTViYjMzN2UzNDlhMDI1YmI0YmQ4OWJhNTc5MmVmMGNkNzJkYjVjMTQyZWViNzdhNWMzZjg1MDA3In0`,
    }
    return MyMainMBonusAuthHeader;
}

generateMultiPartAuthHeader = (myAccessToken) => {
    const MyMainMBonusAuthHeader = {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // ** MUST **
        'Content-Type': 'multipart/form-data',
        'secret': 'tHCeMANTx91zt1E16p',
        'Authorization': `Bearer ${myAccessToken}`,
    }
    return MyMainMBonusAuthHeader;
}


// GETTING USER DETAILS
async function getAuthUserDetails() {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getUserDetails is running");
        let response = await fetch((API_USER_DETAILS),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getUserDetails: ${e}`);
    }
}

// GETTING USER MY COMMUNITY
async function getAuthUserMyCommunityData() {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getUserDetails is running");
        let response = await fetch((API_USER_MY_COMMUNITY),
        {
            method: 'GET',
            // headers: generateAuthHeader(myAccessToken),
            headers: generateAuthHeader(myAccessToken),

            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getUserDetails: ${e}`);
    }
}

// POSTING => UPDATE USER LANGUAGE
async function postUserUpdateLanguage(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postUserUpdateLanguage is running");
        let response = await fetch((API_USER_UPDATE_LANGUAGE), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postUserUpdateLanguage: ${e}`);
    }
}


// POSTING => UPDATE USER PROFILE
async function postUserUpdateProfile(multipartData) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postUserUpdateProfile is running");
        let response = await fetch((API_USER_UPDATE_PROFILE), {
            method: 'POST',
            headers: generateMultiPartAuthHeader(myAccessToken),
            body: multipartData
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postUserUpdateProfile: ${e}`);
    }
}



// GETTING IMG SLIDERS
async function getAppImgSliders() {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAppImgSliders is running");
        let response = await fetch((API_APP_GET_IMG_SLIDERS),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAppImgSliders: ${e}`);
    }
}

// GETTING MERCHANT LIST BY START ITEM, PAGE, TOTAL
async function getAllMerchantList(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAppImgSliders is running");
        let response = await fetch((API_MERCHANT_GET_ALL_MERCHANT+'?start='+
                        params.start_item+'&length='+params.fetch_length),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllMerchantList: ${e}`);
    }
}

// GETTING QUERIES MERCHANT LIST BY START ITEM, PAGE, TOTAL
async function getAllQueriesMerchantList(params) {

    let url_fetch = '';
    if (params.filter_name) {
        url_fetch = `${API_MERCHANT_GET_ALL_MERCHANT}?start=
            ${params.start_item}&length=${params.fetch_length}&filter_country_id=${params.filter_country_id}&filter_country_location_id=${params.filter_country_location_id}
            &filter_country_location_id_2=${params.filter_country_location_id_2}
            &filter_nature_of_business=${params.filter_nature_of_business}
            &filter_name=${params.filter_name}
        `;
    }
    else {
        url_fetch = `${API_MERCHANT_GET_ALL_MERCHANT}?start=
            ${params.start_item}&length=${params.fetch_length}&filter_country_id=${params.filter_country_id}&filter_country_location_id=${params.filter_country_location_id}
            &filter_country_location_id_2=${params.filter_country_location_id_2}
            &filter_nature_of_business=${params.filter_nature_of_business}
        `;
    }
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAppImgSliders is running");
        console.log(url_fetch);
        /*
        let response = await fetch((API_MERCHANT_GET_ALL_MERCHANT+'?start='+
                        params.start_item+'&length='+params.fetch_length+
                        '&filter_country_id='+133+
                        '&filter_country_location_id='+params.state_id+
                        '&filter_country_location_id_2='+params.area_id+
                        '&filter_nature_of_business='+params.nob_id+
                        '&filter_name='+params.merchant_name
                    ),*/
        let response = await fetch((url_fetch),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAppImgSliders: ${e}`);
    }
}


// GETTING MERCHANT DETAILS BY ID
async function getMerchantDetailsByID(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAppImgSliders is running");
        let response = await fetch((API_MERCHANT_GET_MERCHANT_BY_ID+'/'+
                        params.merchantID),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllQueriesMerchantList: ${e}`);
    }
}

// GETTING MERCHANt DETAILS BY ID
async function getAllNearbyMerchantByLocation(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAppImgSliders is running");
        let response = await fetch((API_MERCHANT_GET_NEARBY_MERCHANT+'?longitude='+
                        params.longitude+'&latitude='+params.latitude+
                        '&km='+params.km),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllNearbyMerchantByLocation: ${e}`);
    }
}

// GETTING WALLET TRANS 1
async function getAllTrans_MWallet_1(params) {
    let url_fetch = '';
    url_fetch =`${API_WALLET_GET_ALL_TRANS_1}?start=
        ${params.start_item}&length=${params.fetch_length}&filter_created_after_date=${params.filter_created_after_date}&filter_created_before_date=${params.filter_created_before_date}
    `;

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_MWallet_1 is running");
        console.log(url_fetch);
        let response = await fetch((url_fetch),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllTrans_MWallet_1: ${e}`);
    }
}

// GETTING WALLET TRANS 2
async function getAllTrans_RWallet_2(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_RWallet_2 is running");
        let response = await fetch((API_WALLET_GET_ALL_TRANS_2+'?start='+
                        params.start_item+'&length='+params.fetch_length+
                        '&filter_created_after_date='+params.filter_created_after_date+
                        '&filter_created_before_date='+params.filter_created_before_date
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllTrans_RWallet_2: ${e}`);
    }
}

// GETTING WALLET TRANS 3
async function getAllTrans_SWallet_3(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_SWallet_3 is running");
        let response = await fetch((API_WALLET_GET_ALL_TRANS_3+'?start='+
                        params.start_item+'&length='+params.fetch_length+
                        '&filter_created_after_date='+params.filter_created_after_date+
                        '&filter_created_before_date='+params.filter_created_before_date
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllTrans_SWallet_3: ${e}`);
    }
}


// GETTING WALLET TRANS 4
async function getAllTrans_BWallet_4(params) {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_BWallet_4 is running");
        let response = await fetch((API_WALLET_GET_ALL_TRANS_4+'?start='+
                        params.start_item+'&length='+params.fetch_length+
                        '&filter_created_after_date='+params.filter_created_after_date+
                        '&filter_created_before_date='+params.filter_created_before_date
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllTrans_BWallet_4: ${e}`);
    }
}

// GETTING WITHDRAWAL
async function getAllTrans_Withdrawal(params) {
    console.log('running getAllTrans_Withdrawal ');
    let url_fetch = '';
    url_fetch =`${API_WALLET_GET_WITHDRAWAL}?start=
        ${params.start_item}&length=${params.fetch_length}&filter_created_after_date=${params.filter_created_after_date}&filter_created_before_date=${params.filter_created_before_date}
    `;

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_Withdrawal is running");
        console.log(url_fetch);
        let response = await fetch((url_fetch),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllTrans_Withdrawal: ${e}`);
    }
}

// GETTING ALL ANNOUNCEMENTS
async function getAllAnnouncements() {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllAnnouncements is running");
        let response = await fetch((API_ANNOUNCEMENT_GET_ALL),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllAnnouncements: ${e}`);
    }
}

// GETTING ALL CHAT ROOM LIST
async function getALLChatRoomLists() {

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getALLChatRoomLists is running");
        let response = await fetch((API_CUSTOMER_SERVICES_GET_ALL_CHAT_ROOMS),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        // await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getALLChatRoomLists: ${e}`);
    }
}

// GETTING SINGLE CHAT ROOM LIST
async function getSingleChatRoomByID(params) {
    const url = `${API_CUSTOMER_SERVICES_GET_SINGLE_CHAT_ROOM}${params.chatroom_id}`;
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getSingleChatRoomByID is running");
        console.log(url);
        let response = await fetch((url),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getSingleChatRoomByID: ${e}`);
    }
}

// POSTING => CHAT REPLY
async function postChatReplyByChatRoomID(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        const url = `${API_CUSTOMER_SERVICES_POST_REPLY_SINGLE_CHAT_MSG}${params.chatroom_id}`;

        console.log("Async postUserUpdateLanguage is running");
        let response = await fetch((url), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postUserUpdateLanguage: ${e}`);
    }
}

// POSTING => CHAT REPLY
async function postCreateNewChatRoom(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postCreateNewChatRoom is running");
        let response = await fetch((API_CUSTOMER_SERVICES_CREATE_NEW_CHAT_ROOM), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postCreateNewChatRoom: ${e}`);
    }
}


// GETTING PENDING REBATE
async function getAllPendingRebates(params) {
    console.log('running getAllPendingRebates ');
    let url_fetch = '';
    url_fetch =`${API_WALLET_GET_PENDING_REBATE}?start=
        ${params.start_item}&length=${params.fetch_length}&filter_created_after_date=${params.filter_created_after_date}&filter_created_before_date=${params.filter_created_before_date}
    `;

    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async getAllTrans_Withdrawal is running");
        console.log(url_fetch);
        let response = await fetch((url_fetch),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in getAllPendingRebates: ${e}`);
    }
}

// POSTING => COMP REP = REF
async function postCompRepRef(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        const url = `${API_COMP_REP_REFER}${params.type_id}`;

        console.log("Async postCompRepRef is running");
        let response = await fetch((url), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postCompRepRef: ${e}`);
    }
}

async function checkCompRepUsername(params) {
    const url = `${API_COMP_REP_REFER_CHECK_USERNAME}?target_username=
                    ${params.target_username}`;
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log(url);
        console.log("Async checkCompRepUsername is running");
        let response = await fetch((url
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in checkCompRepUsername: ${e}`);
    }
}

// POSTING => COMP REP = BECOME
async function postCompRepBecome(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        const url = `${API_COMP_REP_BECOME}${params.type_id}`;
        console.log(url);
        console.log("Async postCompRepBecome is running");
        let response = await fetch((url), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postCompRepBecome: ${e}`);
    }
}

// POSTING => REFER NEW MERCHANT
async function postReferNewMerchant(multipartData) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postReferNewMerchant is running");
        let response = await fetch((API_REFER_NEW_MERCHANT), {
            method: 'POST',
            headers: generateMultiPartAuthHeader(myAccessToken),
            body: multipartData
        });
        console.log('from services');
        console.log(generateMultiPartAuthHeader(myAccessToken));
        console.log(multipartData);
        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postReferNewMerchant: ${e}`);
    }
}


// POSTING => TRANSFER M WALLET
async function postTransMWallet(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postTransMWallet is running");
        let response = await fetch((API_TRANSFER_M_WALLET), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postTransMWallet: ${e}`);
    }
}

// POSTING => TRANSFER M WALLET
async function postTransRWallet(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postTransRWallet is running");
        let response = await fetch((API_TRANSFER_R_WALLET), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postTransRWallet: ${e}`);
    }
}

// Check Transfer R Wallet Username
async function checkTransferRUsername(params) {
    const url = `${API_TRANSFER_R_WALLET_CHECK_USERNAME}?target_username=
                    ${params.target_username}`;
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log(url);
        console.log("Async checkTransferRUsername is running");
        let response = await fetch((url
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in checkTransferRUsername: ${e}`);
    }
}

// POSTING => TRANSFER M WALLET
async function postWithdrawalService(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postTransRWallet is running");
        let response = await fetch((API_WITHDRAWAL_SUBMIT), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postTransRWallet: ${e}`);
    }
}

// POSTING => UPGRADE TO AGENT
async function postUpgradeToAgent(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postUpgradeToAgent is running");
        let response = await fetch((API_UPGRADE_TO_AGENT), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postUpgradeToAgent: ${e}`);
    }
}

// Check Upgrade Username
async function checkUpgradeToAgentUsername(params) {
    const url = `${API_UPGRADE_TO_AGENT_CHECK_USERNAME}?target_username=
                    ${params.target_username}`;
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log(url);
        console.log("Async checkUpgradeToAgentUsername is running");
        let response = await fetch((url
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in checkUpgradeToAgentUsername: ${e}`);
    }
}

// POSTING => REGISTER NEW MEMBER
async function postRegisterNewMember(params) {
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log("Async postRegisterNewMember is running");
        let response = await fetch((API_REGISTER_NEW_MEMBER), {
            method: 'POST',
            headers: generateAuthHeader(myAccessToken),
            body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        await console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in postRegisterNewMember: ${e}`);
    }
}

// Check Upgrade Username
async function checkRegistertUsername(params) {
    const url = `${API_REGISTER_CHECK_USERNAME}?username=
                    ${params.target_username}`;
    // using FB Fetch Method
    try {
        const myAccessToken = await getMBonusUserAccessToken();
        console.log(url);
        console.log("Async checkRegistertUsername is running");
        let response = await fetch((url
                    ),
        {
            method: 'GET',
            headers: generateAuthHeader(myAccessToken),
            // body: JSON.stringify(params)
        });

        // convert to json
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (e) {
        console.log(`Error is occur in checkRegistertUsername: ${e}`);
    }
}



export { getAuthUserDetails, getAppImgSliders, getAllMerchantList,
    getMerchantDetailsByID, getAllNearbyMerchantByLocation, getAllQueriesMerchantList,
    getAllTrans_MWallet_1, getAllTrans_RWallet_2, getAllTrans_SWallet_3,
    getAllTrans_BWallet_4, getAllTrans_Withdrawal, getAllAnnouncements,
    getAllPendingRebates, getAuthUserMyCommunityData,
    postUserUpdateLanguage, postUserUpdateProfile, getALLChatRoomLists,
    getSingleChatRoomByID, postChatReplyByChatRoomID, postCreateNewChatRoom,
    postCompRepRef, checkCompRepUsername, postCompRepBecome, postReferNewMerchant,
    postTransMWallet, postTransRWallet, checkTransferRUsername, postWithdrawalService,
    postUpgradeToAgent, checkUpgradeToAgentUsername, postRegisterNewMember,
    checkRegistertUsername,
};
