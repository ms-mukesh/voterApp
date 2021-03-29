import {
  LOADING, SET_CURRENT_DRAWER_INDEX,
} from '../types/index';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.AppDrawerReducer;


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_DRAWER_INDEX: {
      return {
        ...state,
        currentDrawerIndex: action.payload,
      };
    }

    default:
      return state;
  }
};
