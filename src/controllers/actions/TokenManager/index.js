import { AsyncStorage } from 'react-native';
import {
    TOKEN_MANAGER_CHECK_LOGIN
} from '../types';
import { ASYNCTORAGE_USER_TOKEN  } from '../../../utility/constants';

// Token Manager Checking Login Status => Bool
export const tokenManagerCheckLogin = () => new Promise((resolve, reject) => {

    AsyncStorage.getItem(ASYNCTORAGE_USER_TOKEN)
        .then(res => {
            // console.log(`res: ${res}`);
            if (res !== null) {
                resolve(true);
            }
            else
            {
                resolve(false);
            }
        })
        .catch(err => reject(err));
 });

 // Token Manager GET Access Token => String
 export const tokenManagerGetAccessToken = () => new Promise((resolve, reject) => {

     AsyncStorage.getItem(ASYNCTORAGE_USER_TOKEN)
         .then(res => {
             if (res !== null) {
                 resolve(res);
             }
             else
             {
                 resolve(false);
             }
         })
         .catch(err => reject(err));
  });
