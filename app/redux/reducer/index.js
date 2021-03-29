import {combineReducers} from 'redux';
import {RESET_STORE} from '../types';
import {appDefaultReducer} from './defaultReducer';
import user from './user';
import dashboardReducer from './dashboardReducer'
import eventInformationReducer from './eventReducer'
import appDefaultSettingReducer from './appReducer'
import notificationReducer from './notificationReducer'
import volunteerReducer from './volunteerReducer';
import electionReducer from './electionReducer';
import surveyReducer from './surveyReducer';
import appDrawer from './appDrawer'
const appReducer = combineReducers({
    user,
    dashboardReducer,
    appDefaultSettingReducer,
    notificationReducer,
    eventInformationReducer,
    volunteerReducer,
    electionReducer,
    surveyReducer,
    appDrawer
});

export default function rootReducer(state, action) {
    let finalState = appReducer(state, action);
    if (action.type === RESET_STORE) {
        finalState = appDefaultReducer; //resetReducer(finalState, action);
    }
    return finalState;
}
