import { API_DOMAIN_URL } from '../constants';

// USER
// LOGIN => GET AUTH TOKEN
export const API_USER_LOGIN = `${API_DOMAIN_URL}/oauth/token`;
// FORGET PASSWORD
export const API_USER_FORGET_PASSWORD = `${API_DOMAIN_URL}/password/forget`;
// REGISTER
export const API_USER_REGISTER = `${API_DOMAIN_URL}/register/post`;
// USER DETAILS
export const API_USER_DETAILS = `${API_DOMAIN_URL}/user/me`;
// USER MY COMMUNITY
export const API_USER_MY_COMMUNITY = `${API_DOMAIN_URL}/user/my_community`;
// USER UPDATE LANGUAGE
export const API_USER_UPDATE_LANGUAGE = `${API_DOMAIN_URL}/user/change_language`;
// USER UPDATE PROFILE
export const API_USER_UPDATE_PROFILE = `${API_DOMAIN_URL}/myprofile/save`;

// APPLICATION
// GET TNC
export const API_APP_GET_TNC = `${API_DOMAIN_URL}/terms_and_conditions`;
// GET APP SETTINGS
export const API_APP_GET_SETTINGS = `${API_DOMAIN_URL}/setting`;
// GET APP SLIDERS
export const API_APP_GET_IMG_SLIDERS = `${API_DOMAIN_URL}/slider`;
// GET PHONE EXTENSION
export const API_APP_GET_PHONE_EXT_OPTIONS = `${API_DOMAIN_URL}/get_phone_ext_option`;
// GET COUNTRY NAME LIST
export const API_APP_GET_COUNTRY_OPTIONS = `${API_DOMAIN_URL}/get_country_option`;
// GET STATE NAME LIST
export const API_APP_GET_STATE_OPTIONS = `${API_DOMAIN_URL}/get_state_option`;
// GET AREA NAME LIST
export const API_APP_GET_AREA_OPTIONS = `${API_DOMAIN_URL}/get_area_option`;
// GET NOB
export const API_APP_GET_NOB_OPTIONS = `${API_DOMAIN_URL}/nature_of_business`;
// GET BANK LIST
export const API_APP_GET_BANK_OPTIONS = `${API_DOMAIN_URL}/bank`;
// GET COMPANY BANK LIST
export const API_APP_GET_COMPANY_BANK_OPTIONS = `${API_DOMAIN_URL}/company_bank`;
// GET MERCHANT GROUP
export const API_APP_GET_MERCHANT_GROUP_OPTIONS = `${API_DOMAIN_URL}/merchant_group`;

// MERCHANT
// GET ALL MERCHANT LIST
export const API_MERCHANT_GET_ALL_MERCHANT = `${API_DOMAIN_URL}/user/merchant/dt`;
// GET ALL MERCHANT DETAILS BY ID
export const API_MERCHANT_GET_MERCHANT_BY_ID = `${API_DOMAIN_URL}/user/merchant/details`;
// GET ALL NEARBY MERCHANT
export const API_MERCHANT_GET_NEARBY_MERCHANT = `${API_DOMAIN_URL}/user/nearby_merchant`;


// WALLET
// GET TRANSACTION 1 : M WALLET
export const API_WALLET_GET_ALL_TRANS_1 = `${API_DOMAIN_URL}/transaction/1/dt`;
// GET TRANSACTION 2 : R WALLET
export const API_WALLET_GET_ALL_TRANS_2 = `${API_DOMAIN_URL}/transaction/2/dt`;
// GET TRANSACTION 3 : S WALLET
export const API_WALLET_GET_ALL_TRANS_3 = `${API_DOMAIN_URL}/transaction/3/dt`;
// GET TRANSACTION 4 : B WALLET
export const API_WALLET_GET_ALL_TRANS_4 = `${API_DOMAIN_URL}/transaction/4/dt`;
// GET WITHDRAWAL
export const API_WALLET_GET_WITHDRAWAL = `${API_DOMAIN_URL}/withdrawal/dt`;
// GET PENDING REBATE
export const API_WALLET_GET_PENDING_REBATE = `${API_DOMAIN_URL}/pending_rebate/dt`;

// ANNOUNCEMENT
// GET ANNOUNCEMENT LIST
export const API_ANNOUNCEMENT_GET_ALL = `${API_DOMAIN_URL}/announcement/dt`;

// CUSTOMER SERVICES
// GET ALL CHAT ROOM LIST
export const API_CUSTOMER_SERVICES_GET_ALL_CHAT_ROOMS = `${API_DOMAIN_URL}/customer_service/dt`;
// GET SINGLE CHAT ROOM LIST
export const API_CUSTOMER_SERVICES_GET_SINGLE_CHAT_ROOM = `${API_DOMAIN_URL}/customer_service/view/`;
// POST SINGLE REPLY TO CHAT ROOM
export const API_CUSTOMER_SERVICES_POST_REPLY_SINGLE_CHAT_MSG = `${API_DOMAIN_URL}/customer_service/reply/`;
// POST CREATE NEW CHAT ROOM
export const API_CUSTOMER_SERVICES_CREATE_NEW_CHAT_ROOM = `${API_DOMAIN_URL}/customer_service/create/post`;

// COMP REPRESENTATIVE
// POST REPRESENTATIVE - REFER WITH USERNAME
export const API_COMP_REP_REFER = `${API_DOMAIN_URL}/refer_area_representative/buy/`;
export const API_COMP_REP_REFER_CHECK_USERNAME = `${API_DOMAIN_URL}/refer_area_representative/check_username`;

// POST REPRESENTATIVE - BECOME
export const API_COMP_REP_BECOME = `${API_DOMAIN_URL}/area_representative/buy/`;

// REFER NEW MERCHANT
export const API_REFER_NEW_MERCHANT = `${API_DOMAIN_URL}/refer_new_merchant/post`;

// TRANSFER WALLET
export const API_TRANSFER_M_WALLET = `${API_DOMAIN_URL}/transaction/1/transfer/post`;
export const API_TRANSFER_R_WALLET = `${API_DOMAIN_URL}/transaction/2/transfer/post`;
export const API_TRANSFER_R_WALLET_CHECK_USERNAME = `${API_DOMAIN_URL}/transaction/transfer/check/username/post`;

// WITHDRAWAL
export const API_WITHDRAWAL_SUBMIT = `${API_DOMAIN_URL}/withdrawal/submit`;

// UPGRADE TO AGENT
export const API_UPGRADE_TO_AGENT = `${API_DOMAIN_URL}/upgrade/post`;
// UPGRADE TO AGENT CHECK USERNAME
export const API_UPGRADE_TO_AGENT_CHECK_USERNAME = `${API_DOMAIN_URL}/upgrade/check/username`;


// UPGRADE TO AGENT CHECK USERNAME
export const API_REGISTER_NEW_MEMBER = `${API_DOMAIN_URL}/refer_new_member/post`;
// UPGRADE TO AGENT CHECK USERNAME
export const API_REGISTER_CHECK_USERNAME = `${API_DOMAIN_URL}/username_check_available`;
