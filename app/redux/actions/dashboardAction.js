import {Api} from '../../api';
import {MEMBER_DETAIL,LOADING} from "../types";
let pageArray = [];
let flag = false;
export const defaultFilterObject = {
    city: [],
    state: [],
    country: [],
    district:[],
    cast:[],
    nativePlace: [],
    maritalStatus: [],
    familyDaughter: [],
    familyHead: [],
    gender: [],
    minDateFlag: false,
    maxDateFlag: false,
    minDate: new Date(),
    maxDate: new Date(),
    foundResult: 0,
    MaxAge: 100,
    MinAge: 0,
    trust : [],
    booth:[],
};
export const setLoaderStatus = (status) => {
    return dispatch => {
        dispatch({type: LOADING, payload: status});
    };
};
export const getVoterList = (endpoint = '', isPull = false) => {
    let URL = 'userActions/getAllMemberInfo' + endpoint;

    return (dispatch, getState) => {
        let paLength = pageArray.length;
        if (!isPull) {
            dispatch({type: LOADING, payload: true});
        } else {
            dispatch({type: LOADING, payload: false});
        }
        if (endpoint === '') {
            pageArray = [];
            pageArray.push('?page=1');
        } else {
            let isExist = pageArray.includes(endpoint);
            !isExist && pageArray.push(endpoint);
        }
        if (endpoint !== null || endpoint !== 'null' || URL.indexOf('null') < 0) {
            if (endpoint === '' || paLength !== pageArray.length) {
                return Api(URL, 'get')
                    .then(res => {
                        dispatch({type: LOADING, payload: false});
                        if (!res) {
                            console.log('Unauthorized Access');
                        } else if (res.status === 200) {
                            if (endpoint !== '') {
                                let data = [...getState().dashboardReducer.memberDetail.data, ...res.data.data];
                                dispatch({type: MEMBER_DETAIL, payload: {...res.data, data}});
                            } else {
                                dispatch({type: MEMBER_DETAIL, payload: res.data});
                            }
                            return Promise.resolve(true);
                        } else {
                            alert(res.data.data);
                            return Promise.resolve(false);
                        }
                    })
                    .catch(err => {
                        dispatch({type: LOADING, payload: false});
                        console.log("err1--",err)
                        return Promise.resolve(false);
                    });
            } else {
                dispatch({type: LOADING, payload: false});
                console.log("err2--")
                return Promise.resolve(false);
            }
        } else {
            console.log("err3--")
            return Promise.resolve(false);
        }
    };
};
export const filterMembers = data => {
    return dispatch => {
        // dispatch({type: LOADING, payload: true});
        return Api('userActions/filterData', 'post', data)
            .then(async res => {
                if (!res) {
                    console.log('Unauthorized Access');
                    // dispatch({type: LOADING, payload: false});
                } else if (res.status == 200) {
                    // dispatch({type: FILTER_DATA, payload: res.data});
                    // dispatch({type: LOADING, payload: false});
                    return Promise.resolve(res.data);
                } else {
                    // dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
export const fetchFilterCrieteria = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getRegionArray', 'get')
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
export const getSearchMember = data => {
    if (!flag) {
        flag = true;
    }
    if (flag) {
        return dispatch => {
            dispatch({type: LOADING, payload: true});
            return Api('userActions/searchMember', 'post', data)
                .then(res => {
                    dispatch({type: LOADING, payload: false});
                    if (!res) {
                        console.log('Unauthorized Access');
                    } else if (res.status == 200) {
                        flag = true;
                        // dispatch({type: SEARCH_DATA, payload: res.data});
                        return Promise.resolve(res.data);
                    } else {
                        return Promise.resolve(false);
                    }
                })
                .catch(() => {
                    dispatch({type: LOADING, payload: false});
                });
        };
    }
};

export const getFamilyTreeInformation = data => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getFamilyTreeInformation', 'post', data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status == 200) {
                    flag = true;
                    // dispatch({type: SEARCH_DATA, payload: res.data});
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const getAllBoothList = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getAllBoothList', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status == 200) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

export const addNewBoothToDb = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/insertNewBooth', 'post',data)
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('Unauthorized Access');
                } else if (res.status == 200) {
                    console.log("data==",res.data.data)
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.resolve(false);
                }
            })
            .catch(() => {
                dispatch({type: LOADING, payload: false});
            });
    };
};

