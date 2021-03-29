import {
    MEMBER_DETAIL,
    MEMBER_DATA,
    FILTER_DATA,
    SEARCH_DATA,
    CAN_CALL_DIRECTOY_API,
    SET_CURRENT_DRAWER_INDEX
} from '../types/';
import {appDefaultReducer} from './defaultReducer';
import {GET_FAMILY_LIST_ARRAY} from "../types";

const INITIAL_STATE = appDefaultReducer.DirectoryDetails;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MEMBER_DETAIL: {
            return {
                ...state,
                memberDetail: action.payload,
            };
        }
        case MEMBER_DATA: {
            return {
                ...state,
                memberData: action.payload,
            };
        }
        case FILTER_DATA: {
            return {
                filterData: action.payload,
            };
        }
        case SEARCH_DATA: {
            return {
                searchData: action.payload,
            };
        }
        case CAN_CALL_DIRECTOY_API: {
            return {
                searchData: action.payload,
            };
        }
        case GET_FAMILY_LIST_ARRAY: {
            return {
                familyListArray: action.payload,
            };
        }
        default:
            return state;
    }
};
