import {
    GET_VOLUNTEER_TASK,
    LOADING, SET_ALL_ELECTION_LIST,
    SET_ELECTION_LIST,
    SET_NOT_VOLUNTEER_ELECTION_LIST,
    SET_VOLUNTEER_ELECTION_LIST, SET_VOTER_WHO_DOES_NOT_VOTE, SET_VOTER_WHO_DOES_VOTE
} from "../types";
import {Api} from "../../api";

export const fetchElectionList = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getElectionList', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: SET_ELECTION_LIST, payload: res.data.data});
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

export const getVolunteerElection = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getVolunteerElection', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: SET_VOLUNTEER_ELECTION_LIST, payload: res?.data?.data?.volunteerElection});
                    dispatch({type: SET_NOT_VOLUNTEER_ELECTION_LIST, payload: res?.data?.data?.volunteerNotElection});
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
export const updateVolunteerElectionStatus = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/updateVolunteerElectionStatus', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    return Promise.resolve(true);
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

export const getVolunteerElectionUsingToken = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getVolunteerElectionUsingToken', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: SET_VOLUNTEER_ELECTION_LIST, payload: res?.data?.data});
                    return Promise.resolve(res?.data?.data);
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
export const getVolunteerElectionBoothUsingToken = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getVolunteerElectionBoothToken', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: SET_VOLUNTEER_ELECTION_LIST, payload: res?.data?.data});
                    return Promise.resolve(res?.data?.data);
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


export const getVoterForElection = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getVoterForElection', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: SET_VOTER_WHO_DOES_VOTE, payload: res?.data?.data?.voterWhoDoesVote});
                    dispatch({type: SET_VOTER_WHO_DOES_NOT_VOTE, payload: res?.data?.data?.voterWhoDoesNotVote});
                    return Promise.resolve(res?.data?.data);
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

export const updateVoterElectionStatus = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/updateVoterElectionStatus', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    alert("Updated....")
                    return Promise.resolve(res?.data?.data);
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
