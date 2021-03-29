import {
    LOADING,
    EVENT_INFORMATION,
    EVENT_INFORMATION_FOR_NOTIFICATION,
    GET_TEMPLATE_LIST,
    GET_USER_TEMPLATE_LIST
} from "../types";
import {Api} from "../../api";

export const fetchEventInformation = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/getEventInformationForDisplay', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: EVENT_INFORMATION_FOR_NOTIFICATION, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const addNewEvent = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/addNewEvent', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const fetchEventInformationForTask = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/getEventInformation', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: EVENT_INFORMATION, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const updateEventInformation = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/updateTaskInformation', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const fetchAllVolunteer = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/getAllVolunteer', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const fetchAllTemplates = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/getTemplateList', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_TEMPLATE_LIST, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const fetchUserTemplates = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/getMemberTemplates', 'get')
            .then(res => {
                console.log("res--",res)
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_USER_TEMPLATE_LIST, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const addMemberTemplateToDb = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('event/addMemberTemplateToDbNew', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    // dispatch({type: GET_TEMPLATE_LIST, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};


