import {Api} from "../../api";
import {LOADING, SET_CURRENT_DRAWER_INDEX, USER_DETAIL} from "../types";

export const getAutoCompleteData = (data) => {
        return dispatch => {
            dispatch({type: LOADING, payload: true});
            return Api('userActions/getAutoCompleteBoxData', 'get')
                .then(res => {
                    dispatch({type: LOADING, payload: false});
                    if (!res) {
                        console.log('Unauthorized Access');
                    } else if (res.status === 200) {
                        // dispatch({type: SEARCH_DATA, payload: res.data});
                        return Promise.resolve(res.data.data);
                    } else {
                        return Promise.resolve(false);
                    }
                })
                .catch(() => {
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                });
        };

};

export const addNewFamily = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/addNewFamily', 'post',data)
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

export const getFamilyWiseMembers = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getFamilyDetailList', 'get')
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
export const insertNewVoter = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/addNewVoter', 'post',data)
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
export const fetchMemberDetail = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getSpecificMemberDetail', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acess');
                } else if (res.status === 200) {
                    // dispatch({
                    //     type: USER_DATA_FOR_EDIT,
                    //     payload: res.data.data,
                    // });
                    return Promise.resolve(res.data.data);
                } else {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const setUserDetails = data => {
    return dispatch => {
        dispatch({type: USER_DETAIL, payload: data});
        return Promise.resolve(true);
    };
};
export const updateUserProfile = data => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/updateUserProfile', 'post', data)
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acesss');
                } else if (res.status === 200) {
                    return Promise.resolve(res.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                console.log(err);
            });
    };
};
export const insertBulkData = data => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/addBulkData', 'post', data)
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acesss');
                } else if (res.status === 200) {
                    return Promise.resolve(true);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                console.log(err);
            });
    };
};

export const fetchTemplateCategory = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getTemplateCategory', 'get')
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acesss');
                } else if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                console.log(err);
            });
    };
};

export const addNewTemplateToDb = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/addNewTemplate', 'post',data)
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acesss');
                } else if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                console.log(err);
            });
    };
};
export const getAllInfluencers = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getAllInfluneceMembers', 'get')
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acesss');
                } else if (res.status === 200) {
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                console.log(err);
            });
    };
};

export const setCurrentDrawerIndex = data => {
    return dispatch => {
        dispatch({type: SET_CURRENT_DRAWER_INDEX, payload: data});
        return Promise.resolve(true);
    };
};



