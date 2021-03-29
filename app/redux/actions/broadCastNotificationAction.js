import {LOADING, NOTIFICATION_DETAIL} from "../types";
import {Api} from "../../api";
import {getMonthName, removeDuplicates, timeCoverter} from "../../screen/functions";

let pageArray = [];
export const notificationTabColor = [
    {
        backgroundColor: '#B0BFEC',
        headerBackground: '#5F88F0',
    },
    {
        backgroundColor: '#F2C1D4',
        headerBackground: '#F674AB',
    },
    {
        backgroundColor: '#EBA09A',
        headerBackground: '#F3534A',
    },
    {
        backgroundColor: '#91CBA3',
        headerBackground: '#45B869',
    },
    {
        backgroundColor: '#F3534A',
        headerBackground: '#EBA09A',
    },
];


export const broadCastNotification = (data) => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('notification/sendMultipleNotification', 'post',data)
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
export const getMemberNotification = (userdata, flag = true, showLoader = true, endpoint = '') => {
    let URL = '';
    let paLength = pageArray.length;
    if (flag) {
        URL = 'notification/getUserNotificationList' + endpoint;
        if (endpoint === '' || endpoint === null) {
            pageArray = [];
            pageArray.push('?page=1');
        } else {
            let isExist = pageArray.includes(endpoint);
            !isExist && pageArray.push(endpoint);
        }
    } else {
        URL = 'notification/getUserLastNotification';
    }

    return (dispatch, getState) => {
        if (showLoader) {
            dispatch({type: LOADING, payload: true});
        }
        if (endpoint != null && (endpoint === '' || paLength !== pageArray.length || !flag)) {
            return Api(URL, 'post', userdata)
                .then(async res => {
                    dispatch({type: LOADING, payload: false});
                    if (!res) {
                        console.log('Unauthorized Access');
                    } else if (res.status === 200) {
                        let tempmemberNotification = [];
                        res.data.data.map(async (memberNotificationData, index) => {
                            let date = new Date(parseInt(memberNotificationData.DateTime));
                            let tempObj = {
                                // key: index,
                                notificationId: memberNotificationData.NotificationId,
                                day: date.getDate(),
                                monthYear: getMonthName(date.getMonth()) + ', ' + date.getFullYear(),
                                content: memberNotificationData.Description,
                                title: memberNotificationData.Title,
                                imgPath: memberNotificationData.ImgPath,
                                docPath: memberNotificationData.DocPath,
                                notificationType: memberNotificationData.NotificationType,
                                time: timeCoverter(date),
                                UnReadFlag: memberNotificationData.UnReadFlag,
                                notificationDateTime: memberNotificationData.DateTime,
                                uniqueId: index,
                                uniqueNotificationId: memberNotificationData.UniqueNotificationId,
                            };
                            memberNotificationData &&
                            memberNotificationData.NewsEvent &&
                            Object.assign(tempObj, {newsEvent: memberNotificationData.NewsEvent});

                            memberNotificationData &&
                            memberNotificationData.Locations &&
                            Object.assign(tempObj, {location: memberNotificationData.Locations});

                            memberNotificationData &&
                            memberNotificationData.FromDate &&
                            Object.assign(tempObj, {fromDate: memberNotificationData.FromDate});

                            memberNotificationData &&
                            memberNotificationData.ToDate &&
                            Object.assign(tempObj, {toDate: memberNotificationData.ToDate});

                            memberNotificationData &&
                            memberNotificationData.Cause &&
                            Object.assign(tempObj, {cause: memberNotificationData.Cause});

                            memberNotificationData &&
                            memberNotificationData.MinLimit &&
                            Object.assign(tempObj, {minLimit: memberNotificationData.MinLimit});

                            memberNotificationData &&
                            memberNotificationData.MaxLimit &&
                            Object.assign(tempObj, {maxLimit: memberNotificationData.MaxLimit});

                            memberNotificationData &&
                            memberNotificationData.CloseDate &&
                            Object.assign(tempObj, {closeDate: memberNotificationData.CloseDate});

                            memberNotificationData &&
                            memberNotificationData.Organizer &&
                            Object.assign(tempObj, {organizer: memberNotificationData.Organizer});

                            memberNotificationData &&
                            memberNotificationData.NewsType &&
                            Object.assign(tempObj, {newsType: memberNotificationData.NewsType});

                            tempmemberNotification.push(tempObj);
                        });

                        if (!flag) {
                            let data = getState().NotificationReducer.memberNotifications.notifications;

                            data.unshift(tempmemberNotification[0]);
                            data = await removeDuplicates(data, 'notificationDateTime');

                            dispatch({
                                type: NOTIFICATION_DETAIL,
                                payload: {
                                    notifications: data,
                                    next_endpoint: getState().NotificationReducer.memberNotifications.next_endpoint,
                                },
                            });
                            return Promise.resolve(data);
                        } else {
                            tempmemberNotification = await removeDuplicates(
                                tempmemberNotification,
                                'notificationDateTime'
                            );
                            if ((endpoint === '' || endpoint === null) && showLoader) {
                                dispatch({
                                    type: NOTIFICATION_DETAIL,
                                    payload: {
                                        notifications: tempmemberNotification,
                                        next_endpoint: res.data.next_endpoint,
                                    },
                                });
                            } else {
                                let tempData = [
                                    ...getState().NotificationReducer.memberNotifications.notifications,
                                    ...tempmemberNotification,
                                ];
                                tempData = await removeDuplicates(tempData, 'notificationDateTime');

                                dispatch({
                                    type: NOTIFICATION_DETAIL,
                                    payload: {notifications: tempData, next_endpoint: res.data.next_endpoint},
                                });
                            }
                            // dispatch({
                            //   type: NOTIFICATION_DETAIL,
                            //   payload: {
                            //     notifications: tempmemberNotification,
                            //     next_endpoint: res.data.next_endpoint,
                            //   },
                            // });
                            return Promise.resolve(tempmemberNotification);
                        }
                    } else {
                        // alert(res.data.data);
                        return Promise.resolve(false);
                    }
                })
                .catch(err => {
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                });
        } else {
            dispatch({type: LOADING, payload: false});
            return Promise.resolve(false);
        }
    };
};
