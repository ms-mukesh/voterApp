import {
  LOADING, SET_CURRENT_DRAWER_INDEX,
} from '../types/index';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.AppDefaultSettings;


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    default:
      return state;
  }
};
