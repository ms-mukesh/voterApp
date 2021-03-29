import {GET_SURVEY_LIST, SURVEY_VOTER_LIST} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.SurveyReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_SURVEY_LIST: {
            return {
                ...state,
                surveyList: action.payload,
            };
        }
        case SURVEY_VOTER_LIST: {
            return {
                ...state,
                voterList: action.payload,
            };
        }
        default:
            return state;
    }
};
