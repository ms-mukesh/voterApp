
import {appDefaultReducer} from './defaultReducer';
import {
    GET_BOOTH_WISE_VOTER_LIST,
    GET_NOT_VOLUNTEER_BOTH,
    GET_VOLUNTEER_BOOTH,
    GET_VOLUNTEER_CHANGES,
    GET_VOLUNTEER_TASK, SET_ALL_ELECTION_LIST,
    SET_ELECTION_LIST,
    SET_NOT_VOLUNTEER_ELECTION_LIST,
    SET_VOLUNTEER_ELECTION_LIST, SET_VOTER_WHO_DOES_NOT_VOTE,
    SET_VOTER_WHO_DOES_VOTE
} from '../types/'

const INITIAL_STATE = appDefaultReducer.ElectionReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ELECTION_LIST: {
            return {
                ...state,
                electionList: action.payload,
            };
        }
        case SET_VOLUNTEER_ELECTION_LIST: {
            return {
                ...state,
                volunteerElection: action.payload,
            };
        }
        case SET_NOT_VOLUNTEER_ELECTION_LIST: {
            return {
                ...state,
                volunteerNotElection: action.payload,
            };
        }
        case SET_VOTER_WHO_DOES_VOTE: {
            return {
                ...state,
                votedVoter: action.payload,
            };
        }
        case SET_VOTER_WHO_DOES_NOT_VOTE: {
            return {
                ...state,
                doNotVotedVoted: action.payload,
            };
        }
        case SET_ALL_ELECTION_LIST: {
            return {
                ...state,
                allElectionList: action.payload,
            };
        }
        default:
            return state;
    }
};
