import {GET_SURVEY_LIST, LOADING, SURVEY_VOTER_LIST} from "../types";
import {Api} from "../../api";

export const fetchSurveyList = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/getSurveyList', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type:GET_SURVEY_LIST, payload: res.data.data});
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
export const addNewSurvey = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/addNewSurvey', 'post',data)
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

export const getSurveyQuestionList = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/getSurveyQuestions', 'post',data)
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
export const addNewSurveyQuestion = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/addNewSurveyQuestion', 'post',data)
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
export const getVoterListWhoHasNotParticipate = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/getAllVoterWhoDoesNotParticipate', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});

                if (res.status === 200) {
                    dispatch({type: SURVEY_VOTER_LIST, payload: res?.data?.data});
                    return Promise.resolve(true);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: SURVEY_VOTER_LIST, payload: []});
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const addVoterAnswerForSurvey = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/AddVoterAnswerForSurvey', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    // dispatch({type: SURVEY_VOTER_LIST, payload: res?.data?.data});
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
export const getSurveyReport = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('survey/getSurveyReport', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    // dispatch({type: SURVEY_VOTER_LIST, payload: res?.data?.data});
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
