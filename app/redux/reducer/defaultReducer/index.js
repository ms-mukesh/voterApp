import {user} from './user';
import {DirectoryDetails} from './dashboardReducer'
import {EventReducer} from './eventReducer'
import {AppDefaultSettings} from './appReducer'
import {NotificationDefault} from './notificationReducer'
import {VolunteerTask} from './volunteerTask';
import {ElectionReducer} from "./electionReducer";
import {SurveyReducer} from "./surveyReducer";
import {AppDrawerReducer} from "./drawerReducer";

export const appDefaultReducer = {
   user,
   DirectoryDetails,
   AppDefaultSettings,
   NotificationDefault,
   EventReducer,
   VolunteerTask,
   ElectionReducer,
   SurveyReducer,
   AppDrawerReducer
};
