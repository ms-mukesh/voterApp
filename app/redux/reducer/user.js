import {REMEMBER_ME, USER_DETAIL, AUTH_TOKEN} from '../types';
import {appDefaultReducer} from './defaultReducer';

const initialState = appDefaultReducer.user;



export default (state = initialState, action) => {
    // alert("--calledd",JSON.stringify(action.payload))
    switch (action.type) {
        case USER_DETAIL: {
            console.log("reached here----",action.payload)
            return {
                ...state,
                userDetail: action.payload,
            };
        }
        case REMEMBER_ME: {
            return {
                ...state,
                rememberData: action.payload,
            };
        }
        case AUTH_TOKEN: {

            return {
                ...state,
                authToken: action.payload,
            };
        }
        default:
            return state;
    }
};
