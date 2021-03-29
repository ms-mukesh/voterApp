
import {appDefaultReducer} from './defaultReducer';
import {
    GET_BOOTH_WISE_VOTER_LIST,
    GET_NOT_VOLUNTEER_BOTH,
    GET_VOLUNTEER_BOOTH,
    GET_VOLUNTEER_CHANGES,
    GET_VOLUNTEER_TASK
} from '../types/'

const INITIAL_STATE = appDefaultReducer.VolunteerTask;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_VOLUNTEER_TASK: {
            return {
                ...state,
                tasks: action.payload,
            };
        }
        case GET_VOLUNTEER_BOOTH: {
            return {
                ...state,
                boothOfVolunteer: action.payload,
            };
        }
        case GET_NOT_VOLUNTEER_BOTH: {
            return {
                ...state,
                boothWithOutVolunteer: action.payload,
            };
        }
        case GET_BOOTH_WISE_VOTER_LIST: {
            return {
                ...state,
                boothWiseVoterList: action.payload,
            };
        }
        case GET_VOLUNTEER_CHANGES: {
            return {
                ...state,
                volunteerChanges: action.payload,
            };
        }
        default:
            return state;
    }
};
