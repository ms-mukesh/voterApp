import {Api} from '../../api/index';
import {LOADING, RESET_STORE, USER_DETAIL} from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isWEB} from "../../helper/themeHelper";

export const changeUserPassword = data => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userAuthentication/changePassword', 'post', data)
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if (!res) {
                    console.log('unauthorized Acess');
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
export const memberLogin = data => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userAuthentication/memberLogin', 'post',data)
            .then(async res => {
                console.log("login api res---",res)
                if(res.status === 200){
                    await AsyncStorage.setItem('userLoginDetail',JSON.stringify(res.data.data))
                    dispatch({
                        type: USER_DETAIL,
                        payload: res.data.data,
                    });
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(true)

                } else{
                    dispatch({type: LOADING, payload: false});
                    alert(res.data.data)
                    return Promise.resolve(false)
                }
            })
            .catch(err => {
                alert(err)
                dispatch({type: LOADING, payload: false});
                return Promise.resolve(false)
                // dispatch({type: LOADING, payload: false});
            });
    };
};
export const memberLogut = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userAuthentication/logout', 'get')
            .then(async res => {
                dispatch({type: LOADING, payload: false});
                if(res.status === 200){
                    await AsyncStorage.removeItem('userLoginDetail')
                    // setTimeout(()=>{
                    //     dispatch({type: RESET_STORE, payload: true});
                    // },500)

                    return Promise.resolve(true)
                } else{
                    alert(res.data.data)
                    return Promise.resolve(false)
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
                return Promise.resolve(false)
                // dispatch({type: LOADING, payload: false});
            });
    };
};
