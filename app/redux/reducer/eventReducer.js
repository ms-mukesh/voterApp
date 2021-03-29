import {EVENT_INFORMATION, EVENT_INFORMATION_FOR_NOTIFICATION, GET_TEMPLATE_LIST,GET_USER_TEMPLATE_LIST} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.EventReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EVENT_INFORMATION: {
            return {
                ...state,
                events: action.payload,
            };
        }
        case EVENT_INFORMATION_FOR_NOTIFICATION: {
            return {
                ...state,
                eventsOfNotification: action.payload,
            };
        }
        case GET_TEMPLATE_LIST: {
            return {
                ...state,
                templateList: action.payload,
            };
        }
        case GET_USER_TEMPLATE_LIST: {
                    return {
                        ...state,
                        userTemplateList: action.payload,
                    };
                }
        default:
            return state;
    }
};
