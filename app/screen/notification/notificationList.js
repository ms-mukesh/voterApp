import React, {useState, useEffect, useRef, useCallback} from 'react';
import {CustomText} from '../common/index';
import {CommonActions} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  FlatList,
  BackHandler,
    Text
} from 'react-native';
import {
  color,
  font,
  hp,
  isANDROID,
  isIOS,
  normalize,
  screenWidth,
  wp,
} from '../../helper/themeHelper';
import {AppHeader, Background, Loading, NotificationHeaderStyle} from '../common';
// import AntDesign from 'react-native-vector-icons/AntDesign';

import {useDispatch, useSelector} from 'react-redux';
import {
  UPCOMINGNOTIFICATION,
  COMPLETEDNOTIFICATION,
  OUTGOINGNOTIFICATION,
  GENERAL_TYPE,
  EVENT_TYPE,
  NEWS_TYPE,
  FUND_TYPE,
  NOTIFICATION_TAB_COLORS,
  NOTIFICATION_TYPES,
  ALL,
  NEWS_CATEGORY_TYPE,
} from '../../helper/constant';
// import Entypo from 'react-native-vector-icons/Entypo';
import {
  getMemberNotification,
  // removeUserNotification,
  // setLoaderFalse,
  // updateNotificationReadStatus,
} from '../../redux/actions/broadCastNotificationAction';
// import {setRedirectionFlag, setUserDetails} from '../../actions/UserAction';

import {SwipeListView} from 'react-native-swipe-list-view';
import {EventRegister} from 'react-native-event-listeners';
import {AppState} from 'react-native';
import moment from 'moment';

let currentIndex = 0;

const notificationTypes = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'];
let tempTimeStatus = null;
let tempTempCategory = UPCOMINGNOTIFICATION;
let temp = 0;

const NotificationList = props => {
  const notificationTabColor = [
    {
      backgroundColor: '#5F88F0',
      type: 'All',
      check: true,
      notificationType: 'ALL',
    },
    {
      backgroundColor: '#B2BFEE',
      type: 'General',
      check: false,
      notificationType: GENERAL_TYPE,
    },
    {
      backgroundColor: '#EAA196',
      type: 'Event',
      check: false,
      notificationType: EVENT_TYPE,
    },
    {
      backgroundColor: '#92CCA5',
      type: 'News',
      check: false,
      notificationType: NEWS_TYPE,
    },
    {
      backgroundColor: '#EDC8FF',
      type: 'Vote Campeign',
      check: false,
      notificationType: FUND_TYPE,
    },
  ];
  const notificationTypesTabColor = [
    {name: 'GENERAL', color: '#B2BFEE'},
    {name: 'EVENTS', color: '#EAA196'},
    {name: 'NEWS', color: '#92CCA5'},
    {name: 'Vote Campeign', color: '#EDC8FF'},
  ];

  // const {fromPopUp = null} = props.route.params;
  const typeId = null;
  const loading = useSelector(state => state.appDefaultSettingReducer.isLoading);
  const memberNotifications = useSelector(state => state.notificationReducer.memberNotifications);
  let openRowRef = null;
  const dispatch = useDispatch();
  const flatlistRef = useRef(null);
  const scrollRef = useRef(null);
  const [openFlag, setOpenFlag] = useState(false);
  const [bgFlag, setBgFlag] = useState(0);
  const [refreshPage, setRefreshPage] = useState(false);
  const [canCallApiFlag, setCanCallApiFlag] = useState(false);
  const userDetail = useSelector(state => state.user.userDetail);
  const [filterObj, setFilterObj] = useState({
    category: UPCOMINGNOTIFICATION,
    timeStatus: null,
  });

  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(null);
  const [notificationHeaderTabColor, setNotificationHeaderTabColor] = useState([
    ...notificationTabColor,
  ]);
  const [upcomingViewOpacity, setUpcomingViewOpactiy] = useState(0.5);
  const [activeCheckBoxes, setActiveCheckBoxes] = useState({activeBox: [0, 1, 2, 3, 4, 5]});
  const [canCallBackgroungApiFlag, setCanCallBackgroundApiFlag] = useState(false);
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);
  let currentNotificationId = 0;
  const handleAppStateChange = async nextAppState => {
    if (nextAppState !== 'active') {
      setCanCallBackgroundApiFlag(true);
    } else {
      EventRegister.emit('removeAllNotificationFromTray', 'remove');
      dispatch(getMemberNotification({typeId: ALL}, true, false)).then(res => {
        setCanCallBackgroundApiFlag(false);
      });
    }
  };
  // const getData = (notificationType, flag = true, showLoader = true, endpoint = '') => {
  //   dispatch(getMemberNotification(notificationType, flag, showLoader, endpoint)).then(res => {
  //     if (!res) {
  //       setOnEndReachedCalledDuringMomentum(false);
  //     } else {
  //       temp = temp + 1;
  //     }
  //   });
  // });

  const getData = (notificationType, flag = true, showLoader = true, endpoint = '') => {
    return new Promise(resolve => {
      dispatch(getMemberNotification(notificationType, flag, showLoader, endpoint)).then(res => {
        // setOnEndReachedCalledDuringMomentum(false);
      });
    });
  };

  useEffect(() => {
    // EventRegister.emit('removeAllNotificationFromTray', 'remove');
    activeCheckBoxes.activeBox = [0, 1, 2, 3, 4, 5];
    setBgFlag(0);
    dispatch(getMemberNotification({typeId: ALL}, true, true, ''));
    // getData({typeId: ALL});
    // AppState.addEventListener('change', handleAppStateChange);
    // BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      activeCheckBoxes.activeBox = [0, 1, 2, 3, 4, 5];
      setBgFlag(0);
      // AppState.removeEventListener('change', handleAppStateChange);
      // BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);
  const goBack = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Drawer', params: {setfromLogin: true}}],
      })
    );
  };
  const onRefresh = React.useCallback(() => {
    setRefreshPage(true);

    dispatch(getMemberNotification({typeId: ALL}, true, false, '')).then(res => {
      setRefreshPage(false);
    });
  }, []);
  const handleBackPress = () => {
    goBack();
    return true;
  };

  const deleteNotification = async rowIndex => {
    let index = -1;
    memberNotifications.notifications.map((data, i) => {
      if (parseInt(data.notificationId) === parseInt(rowIndex.item.notificationId)) {
        index = i;
      }
    });

    let obj = {
      notificationId: memberNotifications.notifications[index].notificationId,
      index: index,
    };
    if (index > -1) {
      await dispatch(removeUserNotification(obj));
      // dispatch(setLoaderFalse());
    } else {
      // dispatch(setLoaderFalse());
    }
  };

  const displayNotificationDetails = async (notificationId, index, flag = false, item) => {
    let rowIndex = -1;
    memberNotifications.notifications.map((data, i) => {
      if (parseInt(data.notificationId) === parseInt(item.notificationId)) {
        rowIndex = i;
      }
    });

    if (flag && rowIndex > -1) {
      let obj = {
        notificationId: notificationId,
        index: rowIndex,
      };
      // dispatch(updateNotificationReadStatus(obj));
    }
    props.navigation.navigate('NotificationDetailPage', {
      notificationDetails: memberNotifications.notifications[rowIndex],
      fromPageIndex: currentIndex,
      notificationTypeName:
        NOTIFICATION_TYPES[memberNotifications.notifications[rowIndex].notificationType - 1],
    });
  };

  const updateNotificationStatus = async (rowIndex, currentRowReference, currentNotification) => {
    let index = -1;
    memberNotifications.notifications.map((data, i) => {
      if (parseInt(data.notificationId) === parseInt(currentNotification.item.notificationId)) {
        index = i;
      }
    });
    let obj = {
      notificationId: memberNotifications.notifications[index].notificationId,
      index: index,
    };
    currentRowReference.closeRow();
    if (index > -1 && memberNotifications.notifications[index].UnReadFlag) {
      // await dispatch(updateNotificationReadStatus(obj));
    }
  };

  const toggleTabCheckBox = async index => {
    setBgFlag(0);
    flatlistRef &&
      flatlistRef !== null &&
      flatlistRef.current !== null &&
      flatlistRef.current.scrollToOffset({animated: true, offset: 0});

    let tempArray = [...notificationHeaderTabColor];
    let tempActiveBoxes = [];
    if (!tempArray[index].check) {
      tempArray[index].check = true;
      if (index === 0) {
        tempActiveBoxes = [0, 1, 2, 3, 4, 5];
        setUpcomingViewOpactiy(0.5);
      } else {
        if (
          tempArray[index].notificationType === EVENT_TYPE ||
          tempArray[index].notificationType === FUND_TYPE
        ) {
          setUpcomingViewOpactiy(1);
        } else {
          setUpcomingViewOpactiy(0.5);
        }
        tempActiveBoxes.push(tempArray[index].notificationType);
      }
      await tempArray.map((item, tempIndex) => {
        if (tempIndex !== index) {
          tempArray[tempIndex].check = false;
        }
      });
      activeCheckBoxes.activeBox = [...tempActiveBoxes];
      setNotificationHeaderTabColor([...tempArray]);
    } else {
    }
  };

  const _RenderItemForHeader = (item, index) => {
    return (
      <TouchableWithoutFeedback
        key={Math.random() + 'DG' + index.toString()}
        onPress={() => toggleTabCheckBox(index)}>
        <View key={Math.random() + 'DG' + index.toString()} style={style.headerMainView}>
          <View style={style.headerOutterCircle}>
            <View
              style={[
                style.headerInnerCircle,
                {backgroundColor: item.check ? color.white : 'transparent'},
              ]}
            />
          </View>

          <CustomText style={[style.headerTextStyle, {marginLeft: wp(1)}]}>
            {item.type + ' '}
          </CustomText>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const _renderHiddenComponent = (data, rowMap) => {
    if (currentNotificationIndex === data.index && openFlag) {
      return null;
    }
    if (loading) {
      return null;
    }

    return (
      <View key={Math.random() + 'DG'} style={style.swipeCard}>
        <View style={style.swipeMainView}>
          <View style={style.subSwipeView}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => {
                Alert.alert('Navgam', 'Are you sure to delete this notification?', [
                  {
                    text: 'NO',
                    onPress: () => rowMap[currentNotificationId].closeRow(),
                    style: 'cancel',
                  },
                  {text: 'YES', onPress: () => deleteNotification(data)},
                ]);
              }}>
              <View style={style.swipeButtonView}>
                <CustomText>Delete</CustomText>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() =>
                  alert("delete")
                // updateNotificationStatus(currentNotificationId, rowMap[currentNotificationId], data)
              }>
              <View style={style.swipeButtonView}>
               <Text>unread</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };

  const _RenderItem = ({item, index}) => {
    const {swipeCard, viewCard} = style;
    if (activeCheckBoxes.activeBox.includes(item.notificationType)) {
      return (
        <View key={Math.random() + item.key} style={[swipeCard]}>
          <TouchableOpacity
            key={item.key}
            activeOpacity={1}
            style={[
              viewCard,
              {
                borderRightColor: NOTIFICATION_TAB_COLORS[item.notificationType - 1],
              },
            ]}
            onPress={() => {
              openRowRef && openRowRef.closeRow();
              setCurrentNotificationIndex(index);
              if (index === currentNotificationIndex) {
                setOpenFlag(!openFlag);
              } else {
                setOpenFlag(true);
              }
              // EventRegister.emit('removeNotificationFromTray', item.uniqueNotificationId);
              displayNotificationDetails(item.notificationId, index, item.UnReadFlag, item);
            }}>
            <View style={{flex: 1, padding: hp(1)}}>
              <View style={style.cardTopRow}>
                {(item.notificationType === EVENT_TYPE || item.notificationType === FUND_TYPE) &&
                  bgFlag === 0 && (
                    <View style={{flex: 1}}>
                      <View
                        style={[
                          style.upcomingView,
                          {
                            backgroundColor:
                              parseInt(item.fromDate) >= parseInt(new Date().getTime())
                                ? 'orange'
                                : parseInt(new Date().getTime()) >= parseInt(item.fromDate) &&
                                  parseInt(new Date().getTime()) <= parseInt(item.closeDate)
                                ? 'green'
                                : parseInt(new Date().getTime()) >= parseInt(item.fromDate) &&
                                  parseInt(new Date().getTime()) <= parseInt(item.toDate)
                                ? 'green'
                                : '#8D93AC',
                          },
                        ]}>
                        <CustomText style={{fontSize: normalize(12), color: color.white}}>
                          {parseInt(item.fromDate) >= parseInt(new Date().getTime())
                            ? 'UPCOMING'
                            : parseInt(new Date().getTime()) >= parseInt(item.fromDate) &&
                              parseInt(new Date().getTime()) <= parseInt(item.closeDate)
                            ? 'ONGOING'
                            : parseInt(new Date().getTime()) >= parseInt(item.fromDate) &&
                              parseInt(new Date().getTime()) <= parseInt(item.toDate)
                            ? 'ONGOING'
                            : 'COMPLETED'}
                        </CustomText>
                      </View>
                    </View>
                  )}
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <CustomText style={[{fontWeight: 'bold', fontSize: normalize(12)}]}>
                    {new Date(parseInt(item.notificationDateTime)).toLocaleTimeString() +
                      ' | ' +
                      new Date(parseInt(item.notificationDateTime)).toDateString()}
                  </CustomText>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: hp(1)}}>
                <View style={{width: wp(65)}}>
                  <CustomText
                    numberOfLines={1}
                    style={[style.cardLabel, {fontSize: normalize(12), width: wp(80)}]}>
                    {item.title}
                  </CustomText>
                </View>
              </View>
              <CustomText style={{fontSize: normalize(12),marginTop: hp(0.5)}} numberOfLines={2} ellipsizeMode="tail">
                {item.content}
              </CustomText>
              <View style={{flex: 0, flexDirection: 'row'}}>
                {item?.organizer && typeof item?.organizer !== 'undefined' && (
                  <View style={style.cardSubView}>
                    <CustomText style={style.cardLabel}>ORGANIZER</CustomText>
                    <CustomText
                      style={[
                        style.cardValue,
                        {
                          color: color.themePurple,
                          fontSize: normalize(10),
                        },
                      ]}>
                      {item.organizer.toUpperCase()}
                    </CustomText>
                  </View>
                )}
                {item?.location &&
                  typeof item?.location !== 'undefined' &&
                  item?.notificationType !== NEWS_TYPE && (
                    <View style={[style.cardSubView, {marginLeft: wp(2.5)}]}>
                      <CustomText style={style.cardLabel}>LOCATION</CustomText>
                      <CustomText style={[style.cardValue]}>
                        {item.location.toUpperCase()}
                      </CustomText>
                    </View>
                  )}
              </View>
              {item?.newsType && typeof item?.newsType !== 'undefined' && (
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={style.cardSubView}>
                    <CustomText style={style.cardLabel}>TYPE</CustomText>
                    <CustomText
                      style={[
                        style.cardValue,
                        {
                          color:
                            item.newsType.toUpperCase() === NEWS_CATEGORY_TYPE.good.toUpperCase()
                              ? 'green'
                              : item.newsType.toUpperCase() === NEWS_CATEGORY_TYPE.bad.toUpperCase()
                              ? color.blue
                              : 'orange',
                        },
                      ]}>
                      {item.newsType.toUpperCase()}
                    </CustomText>
                  </View>
                  <View style={[style.cardSubView, {marginLeft: wp(2)}]}>
                    <CustomText style={style.cardLabel}>LOCATION</CustomText>
                    <CustomText style={[style.cardValue]}>{item.location.toUpperCase()}</CustomText>
                  </View>
                </View>
              )}
              {item?.cause && typeof item?.cause !== 'undefined' && (
                <View style={style.cardSubView}>
                  <CustomText style={style.cardLabel}>CAUSE</CustomText>
                  <CustomText style={style.cardValue}>{item.cause.toUpperCase()}</CustomText>
                </View>
              )}
              <View style={{flexDirection: 'row'}}>
                {item?.fromDate && typeof item?.fromDate !== 'undefined' && (
                  <View style={{flex: 1}}>
                    <View style={style.cardSubView}>
                      <CustomText style={style.cardLabel}>
                        {item?.newsType && typeof item.newsType !== 'undefined'
                          ? 'DATE'
                          : 'START DATE & TIME'}
                      </CustomText>
                    </View>
                    <View>
                      <CustomText style={[style.cardValue]}>
                        {item?.newsType && typeof item.newsType !== 'undefined'
                          ? moment(new Date(parseInt(item.fromDate))).format('DD/MM/YYYY')
                          : moment(new Date(parseInt(item.fromDate))).format('DD/MM/YYYY') +
                            ' | ' +
                            new Date(parseInt(item.fromDate)).toLocaleTimeString()}
                      </CustomText>
                    </View>
                  </View>
                )}
                {item?.toDate && typeof item?.toDate !== 'undefined' && (
                  <View style={{flex: 1, marginLeft: wp(3)}}>
                    <View style={style.cardSubView}>
                      <CustomText style={style.cardLabel}>
                        {item?.newsType && typeof item.newsType !== 'undefined'
                          ? 'DATE & TIME'
                          : 'END DATE & TIME'}
                      </CustomText>
                    </View>
                    <View>
                      <CustomText style={[style.cardValue]}>
                        {moment(new Date(parseInt(item.toDate))).format('DD/MM/YYYY') +
                          ' | ' +
                          new Date(parseInt(item.toDate)).toLocaleTimeString()}
                      </CustomText>
                    </View>
                  </View>
                )}
                {item?.closeDate && typeof item?.closeDate !== 'undefined' && (
                  <View style={{flex: 1, marginLeft: wp(3)}}>
                    <View style={style.cardSubView}>
                      <CustomText style={style.cardLabel}>
                        {item?.newsType && typeof item.newsType !== 'undefined'
                          ? 'DATE & TIME'
                          : 'END DATE & TIME'}
                      </CustomText>
                    </View>
                    <View>
                      <CustomText style={[style.cardValue]}>
                        {moment(new Date(parseInt(item.closeDate))).format('DD/MM/YYYY') +
                          ' | ' +
                          new Date(parseInt(item.closeDate)).toLocaleTimeString()}
                      </CustomText>
                    </View>
                  </View>
                )}
              </View>
              {item.maxLimit && (
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <View style={style.cardSubView}>
                      <CustomText style={style.cardLabel}>{'MINIMUM LIMIT'}</CustomText>
                    </View>
                    <View>
                      <CustomText style={style.cardValue}>{item.minLimit}</CustomText>
                    </View>
                  </View>

                  <View style={{flex: 1, marginLeft: wp(3)}}>
                    <View style={style.cardSubView}>
                      <CustomText style={style.cardLabel}>{'MAXIMUM LIMIT'}</CustomText>
                    </View>
                    <View>
                      <CustomText style={style.cardValue}>{item.maxLimit}</CustomText>
                    </View>
                  </View>
                </View>
              )}

              {/*{item.UnReadFlag && (*/}
              {/*  <View style={{flex: 1}}>*/}
              {/*    <View*/}
              {/*      style={[*/}
              {/*        style.readUnreadDot,*/}
              {/*        {*/}
              {/*          alignSelf: 'flex-end',*/}
              {/*          marginTop: hp(1),*/}
              {/*        },*/}
              {/*      ]}*/}
              {/*    />*/}
              {/*  </View>*/}
              {/*)}*/}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View key={Math.random() + item.key} />;
    }
  };
  const renderNotificationIndicatiors = () => {
    return (
      <View style={{flex: 0}}>
        <View
          style={[
            style.upcomingMainView,
            {
              marginTop: isANDROID ? hp(-8) : hp(-6),
            },
          ]}>
          <FlatList
            contentContainerStyle={{marginTop: hp(0)}}
            numColumns={1}
            horizontal={true}
            data={notificationTypesTabColor}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}
            renderItem={renderHeaderTabsType}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  const renderNotificationDetailView = (timeStatus = null, notificationCategory = null) => {
    tempTimeStatus = timeStatus;
    tempTempCategory = notificationCategory;
    filterObj.timeStatus = timeStatus;
    filterObj.category = notificationCategory;
    let notificationData = [];

    if (memberNotifications && memberNotifications.notifications) {
      notificationData = memberNotifications.notifications.filter(item => {
        if (timeStatus !== null) {
          let valueToBeMatch = item.fromDate;
          // if (typeId === 1 || typeId === 2) {
          //   valueToBeMatch = item.notificationDateTime;
          // }
          if (notificationCategory === UPCOMINGNOTIFICATION) {
            return parseInt(valueToBeMatch) >= parseInt(timeStatus);
          } else if (notificationCategory === OUTGOINGNOTIFICATION) {
            let tempToDate = null;
            if (typeof item.toDate !== 'undefined') {
              tempToDate = item.toDate;
            } else if (typeof item.closeDate !== 'undefined') {
              tempToDate = item.closeDate;
            } else if (typeof item.fromDate !== 'undefined') {
              tempToDate = item.fromDate;
            }
            if (tempToDate === null) {
              return parseInt(timeStatus) >= parseInt(valueToBeMatch);
            } else {
              return (
                parseInt(timeStatus) >= parseInt(valueToBeMatch) &&
                parseInt(timeStatus) <= parseInt(tempToDate)
              );
            }
          } else if (notificationCategory === COMPLETEDNOTIFICATION) {
            let tempToDate = null;
            if (typeof item.toDate !== 'undefined') {
              tempToDate = item.toDate;
            } else if (typeof item.closeDate !== 'undefined') {
              tempToDate = item.closeDate;
            } else if (typeof item.fromDate !== 'undefined') {
              tempToDate = item.fromDate;
            }
            return parseInt(timeStatus) >= parseInt(tempToDate);
          }
        } else {
          return item;
        }
      });
    }
    let tempNotificationData = [];
    if (notificationData.length > 0) {
      tempNotificationData = notificationData.filter(item => {
        return activeCheckBoxes.activeBox.includes(item.notificationType);
      });
    }

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          {/*{activeCheckBoxes.activeBox.length > 1 && isIOS && renderNotificationIndicatiors()}*/}
          {activeCheckBoxes.activeBox.length === 1 &&
            (activeCheckBoxes.activeBox.includes(EVENT_TYPE) ||
              activeCheckBoxes.activeBox.includes(FUND_TYPE)) && (
              <View style={{height: hp(0.05), marginTop: hp(1), backgroundColor: 'gray'}} />
            )}
          {activeCheckBoxes.activeBox.length > 1 && (
            <View style={{height: hp(0.05), marginTop: hp(1), backgroundColor: 'gray'}} />
          )}
          {(activeCheckBoxes.activeBox.includes(GENERAL_TYPE) ||
            activeCheckBoxes.activeBox.includes(NEWS_TYPE)) && (
            <View style={{height: hp(0.05), marginTop: hp(1)}} />
          )}

          <Background style={{flex: 1}}>
            {/*{activeCheckBoxes.activeBox.length > 1 && isANDROID && renderNotificationIndicatiors()}*/}
            {tempNotificationData.length > 0 ? (
              <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                  <FlatList
                      numColumns={2}
                    directionalDistanceChangeThreshold={10}
                    useFlatList={true}
                    listViewRef={flatlistRef}
                    data={tempNotificationData}
                    keyExtractor={(item, index) => index.toString()}
                    recalculateHiddenLayout={true}
                    renderItem={_RenderItem}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    extraData={{...memberNotifications.notifications}}
                  />
                </View>
                <View style={{hp: 5}} />
              </View>
            ) : (
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <CustomText style={style.noNotificationView}>No New Notifications</CustomText>
              </View>
            )}
          </Background>
        </SafeAreaView>
      </View>
    );
  };

  const renderHeaderTabsType = ({item, index}) => {
    return (
      <View style={{flex: 1, flexDirection: 'row', marginLeft: index !== 0 ? wp(0.8) : 0}}>
        <View
          style={[
            style.colorIndicatorMainView,
            {
              backgroundColor: item.color,
              marginLeft: index === 0 ? wp(2) : wp(1),
            },
          ]}
        />
        <CustomText style={style.colorIndicatorText}>{item.name}</CustomText>
      </View>
    );
  };
  const renderUpcomingView = () => {
    return (
      <View
        style={[
          style.upcomingMainView,
          {
            marginTop: isANDROID ? hp(-7) : hp(-6.5),
          },
        ]}>
        {notificationTypes.map((item, index) => {
          return (
            <View
              key={'DE' + index.toString()}
              style={[
                style.upcomingSubView,
                {
                  backgroundColor: bgFlag === index ? color.themePurple : 'transparent',
                },
              ]}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (parseInt(upcomingViewOpacity) === 1) {
                    scrollRef.current.scrollTo({x: index * wp(100)});
                    setBgFlag(index);
                  }
                }}>
                <CustomText
                  style={[
                    style.notificationTabText,
                    {
                      fontWeight: bgFlag === index ? 'bold' : 'normal',
                      opacity: bgFlag === index ? 1 : 0.7,
                      color: bgFlag === index ? color.white : color.themePurple,
                    },
                  ]}>
                  {index === 0 ? item : item}
                </CustomText>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      {loading && <Loading isLoading={loading} />}
      <View style={{height: hp(20), backgroundColor: 'transparent'}}>
        {/*<NotificationHeaderStyle*/}
        {/*    title={'All Notifications'}*/}
        {/*    onBackPress={() => {*/}
        {/*      // dispatch(setRedirectionFlag(false));*/}

        {/*      props.navigation.dispatch(*/}
        {/*          CommonActions.reset({*/}
        {/*            index: 0,*/}
        {/*            routes: [{name: 'Drawer'}],*/}
        {/*          })*/}
        {/*      );*/}
        {/*    }}*/}
        {/*/>*/}
        <AppHeader title={'Notifications'} onMenuPress={() => props.navigation.openDrawer()} />
        {/*{fromPopUp ? (*/}
        {/*  <NotificationHeaderStyle*/}
        {/*    title={'All Notifications'}*/}
        {/*    onBackPress={() => {*/}
        {/*      // dispatch(setRedirectionFlag(false));*/}

        {/*      props.navigation.dispatch(*/}
        {/*        CommonActions.reset({*/}
        {/*          index: 0,*/}
        {/*          routes: [{name: 'Drawer'}],*/}
        {/*        })*/}
        {/*      );*/}
        {/*    }}*/}
        {/*  />*/}
        {/*) : (*/}
        {/*  <AppHeader*/}
        {/*    title={'All Notifications'}*/}
        {/*    onMenuPress={() => {*/}
        {/*      props.navigation.openDrawer();*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}

        {/*<View style={{flex: 0, backgroundColor: color.themePurple, padding: wp(0.5)}}>*/}
        {/*  <View style={style.notificationTypeContainer}>*/}
        {/*    {notificationHeaderTabColor.map((item, index) => _RenderItemForHeader(item, index))}*/}
        {/*  </View>*/}
        {/*</View>*/}
        {/*<View style={style.headerIndicatorRow} />*/}
      </View>
      {/*{userDetail.IsVisitedApp === '0' && !userDetail.IsVisitNotificationPage && (*/}
      {/*  <IntroductionScreen*/}
      {/*    setShowAgainMethod={() => {*/}
      {/*      dispatch(setUserDetails({...userDetail, IsVisitNotificationPage: true})).then(*/}
      {/*        res => {}*/}
      {/*      );*/}
      {/*    }}*/}
      {/*    imageUrl={require('../../assets/images/notification_guide.jpg')}*/}
      {/*  />*/}
      {/*)}*/}
      {(activeCheckBoxes.activeBox.includes(EVENT_TYPE) ||
        activeCheckBoxes.activeBox.includes(FUND_TYPE)) &&
        activeCheckBoxes.activeBox.length === 1 &&
        renderUpcomingView()}

      {/*{activeCheckBoxes.activeBox.length > 1 && renderNotificationIndicatiors()}*/}

      {activeCheckBoxes.activeBox.length > 1 ||
      activeCheckBoxes.activeBox.includes(1) ||
      activeCheckBoxes.activeBox.includes(4) ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1, marginTop: hp(-2)}}>{renderNotificationDetailView()}</View>
        </View>
      ) : (
        <View style={{flex: 1, marginTop: hp(-2)}}>
          <View style={{flex: 9}}>
            <View style={{flex: 1}}>
              <ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                pagingEnabled={true}
                horizontal={true}
                scrollEnabled={false}
                nestedScrollEnabled={true}>
                <View style={{flex: 1, width: wp(100), height: null}}>
                  {bgFlag === 0 && renderNotificationDetailView()}
                </View>
                {parseInt(typeId) !== 1 && parseInt(typeId) !== 2 && (
                  <View style={{flex: 1, width: wp(100), height: null}}>
                    {bgFlag === 1 &&
                      renderNotificationDetailView(new Date().getTime(), UPCOMINGNOTIFICATION)}
                  </View>
                )}
                {parseInt(typeId) !== 1 && parseInt(typeId) !== 2 && (
                  <View style={{flex: 1, width: wp(100), height: null}}>
                    {bgFlag === 2 &&
                      renderNotificationDetailView(new Date().getTime(), OUTGOINGNOTIFICATION)}
                  </View>
                )}
                {parseInt(typeId) !== 1 && parseInt(typeId) !== 2 && (
                  <View style={{flex: 1, width: wp(100), height: null}}>
                    {bgFlag === 3 &&
                      renderNotificationDetailView(
                        new Date().getTime() - 3600,
                        COMPLETEDNOTIFICATION
                      )}
                  </View>
                )}
                {parseInt(typeId) === 1 && (
                  <View style={{flex: 1, width: wp(100), height: null}}>
                    {renderNotificationDetailView()}
                  </View>
                )}
                {parseInt(typeId) === 2 && (
                  <View style={{flex: 1, width: wp(100), height: null}}>
                    {renderNotificationDetailView()}
                  </View>
                )}
              </ScrollView>
            </View>
            <View style={{height: hp(3.5)}} />
          </View>
        </View>
      )}
    </View>
  );
};
const style = StyleSheet.create({
  fontStyle: {
    color: color.blue,
    fontSize: normalize(14),
    // fontFamily: font.robotoRegular,
  },
  swipeCard: {
    flex: 1,
    // paddingVertical: hp(0.8),
    marginTop: hp(1.5),
    backgroundColor: 'transparent',
    marginHorizontal: wp(5),
    borderRadius: 10,
  },
  viewCard: {
    flex: 1,
    width:wp(40),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1),
    borderRadius: wp(2),
    backgroundColor: '#eeeeee',
    // backgroundColor: 'green',
    borderWidth: 0.4,
    // borderColor: color.lightGray,

    borderBottomWidth: hp(0.2),
    borderBottomColor: '#7f878e',
    borderRightWidth: hp(1),
  },
  txtDate: {
    flex: 1,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    fontSize: normalize(15),
    color: '#6080CD',
  },
  txtTitle: {
    flex: 1.2,
    fontWeight: 'bold',
    fontSize: normalize(20),
    color: '#686E78',
    marginLeft: wp(4),
  },
  imgLogo: {
    marginLeft: wp(1),
    alignSelf: 'center',
    height: hp(5),
    width: hp(5),
    borderRadius: hp(3),
  },
  txtContent: {
    flex: 1,
    marginLeft: wp(1),
    fontSize: normalize(15),
    fontWeight: 'bold',
    marginTop: hp(0.5),
    color: '#878D92',
    paddingTop: hp(1),
  },
  txtTime: {
    flex: 1,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    fontSize: normalize(12),
    color: '#93989D',
  },
  mainView: {
    height: hp(15),
    flexDirection: 'row',
    width: screenWidth - 40,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: wp(5),
  },
  leftView: {
    width: wp(4),
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  rightView: {
    width: wp(86),
    padding: hp(1),
  },
  bellView: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNotificationTitle: {
    flex: 6,
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: color.white,
  },
  txtNotificationDetail: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: color.white,
  },
  contentView: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(1.5),
    marginBottom: hp(2),
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2.5),
    backgroundColor: color.white,
    borderRadius: wp(2),
  },
  notificationDetailView: {
    flex: 1,
    // borderTopWidth:wp(0.1),
    // marginTop:hp(-.2),
    borderBottomLeftRadius: wp(2.5),
    borderBottomRightRadius: wp(2.5),
    borderBottomWidth: wp(0.3),
    borderLeftWidth: wp(0.3),
    borderRightWidth: wp(0.3),
    padding: wp(3),
    borderColor: color.lightGray,
  },
  notificationDetailHeading: {
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  notificationsDetailSubView: {
    marginTop: hp(1.5),
  },
  notificationTabText: {
    fontSize: normalize(12),
    color: color.white,
    fontWeight: 'bold',
  },
  headerTextStyle: {fontSize: normalize(12), fontWeight: 'bold', color: color.white},
  headerOutterCircle: {
    height: hp(2.3),
    width: hp(2.3),
    borderRadius: hp(1.15),
    borderWidth: hp(0.2),
    borderColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerInnerCircle: {
    height: hp(1.2),
    width: hp(1.2),
    borderRadius: hp(0.6),
    backgroundColor: color.white,
  },
  cardLabel: {
    width: wp(50),
    fontWeight: 'bold',
    fontSize: normalize(12),
  },
  cardSubView: {
    flex: 1,
    // flexDirection: 'row',
    marginTop: hp(1),
  },
  cardValue: {
    marginTop: wp(1),
    fontSize: normalize(12),
  },
  headerMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  swipeMainView: {alignItems: 'center', flexDirection: 'row', flex: 1},
  subSwipeView: {flex: 1, alignItems: 'flex-end', marginRight: wp(1)},
  swipeButtonView: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#6080CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTopRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingView: {
    height: hp(4),
    width: wp(15),
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNotificationView: {fontSize: normalize(20), color: color.darkGray, fontWeight: 'bold'},
  readUnreadDot: {
    height: hp(1),
    width: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: 'gray',
  },
  colorIndicatorMainView: {
    height: hp(2),
    width: hp(2),

    borderRadius: hp(1),
  },
  colorIndicatorText: {marginLeft: wp(2), color: 'gray', fontSize: normalize(12)},
  upcomingMainView: {flex: 0, flexDirection: 'row', padding: hp(2), marginTop: hp(-6.5)},
  upcomingSubView: {
    flex: 1,
    height: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: hp(12),
  },
  headerIndicatorRow: {
    backgroundColor: color.white,
    width: wp(100),
    height: hp(12),
    borderTopLeftRadius: hp(6),
    borderTopRightRadius: hp(6),
    alignItems: 'center',
  },
});
export default NotificationList;
