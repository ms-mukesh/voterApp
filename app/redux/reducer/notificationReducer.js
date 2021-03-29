import {NOTIFICATION_DETAIL, NOTIFICATION_TYPE,NOTIFICATION_LISTENER_FLAG,NOTIFICATION_ARRAY_FOR_POP_UP} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.NotificationDefault;

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFICATION_DETAIL: {
      return {
        ...state,
        memberNotifications: action.payload,
      };
    }
    case NOTIFICATION_TYPE: {
      return {
        ...state,
        notificationType: action.payload,
      };
    }
    case NOTIFICATION_LISTENER_FLAG: {
      return {
        ...state,
        notificationListenerFlag: action.payload,
      };
    }
    case NOTIFICATION_ARRAY_FOR_POP_UP: {
      return {
        ...state,
        notificationArrayForPopUp: action.payload,
      };
    }
    default:
      return state;
  }
};
