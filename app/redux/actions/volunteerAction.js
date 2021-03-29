import {
    LOADING,
    EVENT_INFORMATION,
    EVENT_INFORMATION_FOR_NOTIFICATION,
    GET_VOLUNTEER_TASK,
    GET_VOLUNTEER_BOOTH, GET_NOT_VOLUNTEER_BOTH, GET_BOOTH_WISE_VOTER_LIST, GET_VOLUNTEER_CHANGES
} from "../types";
import {Api} from "../../api";

export const fetchVolunteerTask = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getVolunteerTask', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_VOLUNTEER_TASK, payload: res.data.data});
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

export const updateTaskInformation = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/updateTaskInformation', 'post',data)
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

export const getVolunteerBoothDetails = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getVolunteerBooths', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_VOLUNTEER_BOOTH, payload: res?.data?.data?.volunteerBoth});
                    dispatch({type: GET_NOT_VOLUNTEER_BOTH, payload: res?.data?.data?.boothWithOutVolunteer});
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


export const getVolunteerBoothDetailsUsingToken = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getVolunteerBoothsUsingToken', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_VOLUNTEER_BOOTH, payload: res?.data?.data?.volunteerBoth});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: GET_VOLUNTEER_BOOTH, payload: []});
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const updateVolunteerBothStatus = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/updateVolunteerBoothStatus', 'post',data)
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

export const getBoothWiseVoterList = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getBoothWiseVoterList', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: GET_BOOTH_WISE_VOTER_LIST, payload: res?.data?.data});
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
export const insertVoterDataChangeRequest = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/makeRequestToChangeVoterDetail', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status === 200) {
                    // dispatch({type: SEARCH_DATA, payload: res.data});
                    return Promise.resolve(res.data.data);
                } else {
                    alert(res.data.data)
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
                alert(res.data.data)
                return Promise.resolve(false);

            });
    };
};

export const getVolunteerChanges = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getVolunteerChanges', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status === 200) {
                    dispatch({type: GET_VOLUNTEER_CHANGES, payload: res.data.data});
                    return Promise.resolve(true);
                } else {
                    alert(res.data.data)
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
                alert(res.data.data)
                return Promise.resolve(false);

            });
    };
};

export const getAllVolunteerChanges = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/getVolunteerAllRequests', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else {
                    alert(res.data.data)
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
                alert(res.data.data)
                return Promise.resolve(false);

            });
    };
};

export const applyVolunteerChangesToDb = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/applyChangeToRealData', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status === 200) {
                    return Promise.resolve(true);
                } else {
                    alert(res.data.data)
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
                alert(res.data.data)
                return Promise.resolve(false);

            });
    };
};

export const applyAllVolunteerChangesToDb = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('volunteer/acceptAllChangesOfVolunteer', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status === 200) {
                    return Promise.resolve(true);
                } else {
                    alert(res.data.data)
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
                alert(res.data.data)
                return Promise.resolve(false);

            });
    };
};
