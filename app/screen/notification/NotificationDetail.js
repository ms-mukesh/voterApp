import React, {useState, useEffect, useRef} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  BackHandler,
} from 'react-native';
// import Pdf from 'react-native-pdf';
import moment from 'moment';
import {color, hp, isANDROID, isIOS, normalize, screenWidth, wp} from '../../helper/themeHelper';
import {Background, CustomText, Loading, NotificationHeaderWithGradient} from '../common';
import {
  EVENT_TYPE,
  FUND_TYPE,
  NEWS_TYPE,
  NOTIFICATION_GRADIENT_COLORS,
} from '../../helper/constant';
import {useDispatch, useSelector} from 'react-redux';
import docLogo from '../../assets/images/pdf.png';
import gradientBackground from '../../assets/images/bg.png';
// const RNFS = require('react-native-fs');

// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {setLoaderTrue, setLoaderFalse} from '../../actions/notificationAction';
// import {setCurrentPageIndex} from '../../actions/UserAction';
// import Share from 'react-native-share';
// import {askForPermission} from '../functions';
const NotificationDetail = props => {
  const {
    memberNotificationDetail = {},
    notificationTitle = '',
    notificationDetails,
    fromPageIndex,
    notificationTypeName,
  } = props.route.params;
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const scrollRefForPreview = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageIndexPreview, setCurrentImageIndexPreview] = useState(0);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const [pdfPreviewFlag, setPdfPreviewFlag] = useState(false);
  const [moreButtonFlag, setMoreButtonFlag] = useState(false);
  const [readMoreFlag, setReadMoreFlag] = useState(false);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const handleBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    if (parseInt(fromPageIndex) === 1) {
      dispatch(setCurrentPageIndex(5));
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const loading = useSelector(state => state.appDefaultSettingReducer.isLoading);
  const renderDotsBelowSlider = ({item, index}) => {
    return (
      <View key={Math.random() + 'DE'} style={{flex: 1, alignItems: 'center', padding: wp(1)}}>
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => {
            // setCurrentImageIndex(index);
            // scrollRef.current.scrollTo({x: index * wp(100)});
          }}>
          <View
            style={[
              style.belowOutterDots,
              {borderWidth: index === currentScrollIndex ? hp(0.2) : 0},
            ]}>
            <View
              style={[
                style.belowInnerDots,
                {backgroundColor: index === currentScrollIndex ? color.blue : color.gray},
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // const onPDFDownloadForSharing = async url => {
  //   return new Promise(resolve => {
  //     const baseDir = isANDROID ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
  //     const fileName = 'Navgam_attachment_' + moment().unix();
  //     const path = `${baseDir}/Navgam/${fileName}.pdf`;
  //
  //     RNFetchBlob.config({
  //       fileCache: true,
  //       addAndroidDownloads: {
  //         useDownloadManager: true,
  //         fileCache: true,
  //         appendExt: 'pdf',
  //         // notification: false,
  //         title: 'Navgam Attachments',
  //         // description: 'File downloaded by Navgam App.',
  //         mime: 'application/pdf',
  //         mediaScannable: true,
  //         overwrite: true,
  //         path: path,
  //       },
  //       path: path,
  //     })
  //       .fetch('GET', url, {
  //         'Cache-Control': 'no-store',
  //       })
  //       .then(resp => {
  //         if (resp.path()) {
  //           resolve(resp.path());
  //         } else {
  //           resolve(false);
  //         }
  //       })
  //       .catch(e => {
  //         console.log(e);
  //         resolve(false);
  //       });
  //   });
  // };
  // const onImageDownloadForSharing = (filePath, flag = false) => {
  //   return new Promise(resolve => {
  //     const baseDir = isANDROID ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
  //     const fileName = 'Navgam_image_' + moment().unix();
  //     const path = `${baseDir}/Navgam/${fileName}.jpeg`;
  //     RNFetchBlob.config({
  //       fileCache: false,
  //       addAndroidDownloads: {
  //         appendExt: 'jpeg',
  //         useDownloadManager: true,
  //         path: path,
  //         mime: 'image/jpeg',
  //         fileCache: false,
  //       },
  //       path: path,
  //     })
  //
  //       .fetch('GET', filePath, {
  //         'Cache-Control': 'no-store',
  //       })
  //       .then(resp => {
  //         if (resp.path()) {
  //           if (flag) {
  //             if (isIOS) {
  //               RNFetchBlob.ios.previewDocument(resp.path());
  //             } else {
  //               RNFetchBlob.android.actionViewIntent(resp.path(), 'image/jpeg');
  //             }
  //           }
  //           resolve(resp.path());
  //         } else {
  //           alert('Failed Downloaded!');
  //           resolve(false);
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         dispatch(setLoaderFalse());
  //         resolve(false);
  //       });
  //   });
  // };
  //
  // const onImageFileDownload = filePath => {
  //   return new Promise(resolve => {
  //     const baseDir = isANDROID ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
  //     const fileName = 'Navgam_image_' + moment().unix();
  //     const path = `${baseDir}/Navgam/${fileName}.jpeg`;
  //     if (isANDROID) {
  //       RNFetchBlob.config({
  //         fileCache: false,
  //         addAndroidDownloads: {
  //           appendExt: 'jpeg',
  //           useDownloadManager: true,
  //           notification: true,
  //           title: 'Navgam Attachments',
  //           description: 'File downloaded by navgam',
  //           path: path,
  //           mime: 'image/jpeg',
  //           fileCache: false,
  //         },
  //         path: path,
  //       })
  //
  //         .fetch('GET', filePath, {
  //           'Cache-Control': 'no-store',
  //         })
  //         .then(resp => {
  //           if (resp.path()) {
  //             // alert('Downloaded successfully!');
  //             // RNFetchBlob.android.actionViewIntent(resp.path(), 'image/jpeg');
  //             resolve(true);
  //           } else {
  //             alert('Failed Downloaded!');
  //             resolve(false);
  //           }
  //         })
  //         .catch(error => {
  //           resolve(false);
  //         });
  //     } else {
  //       CameraRoll.save(filePath, {type: 'photo'});
  //       resolve(true);
  //     }
  //   });
  // };
  //
  // const onPdfFileDownload = filePath => {
  //   return new Promise(resolve => {
  //     const baseDir = isANDROID ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir;
  //     const fileName = 'Navgam_attachment_' + moment().unix();
  //     const path = `${baseDir}/Navgam/${fileName}.pdf`;
  //
  //     RNFetchBlob.config({
  //       fileCache: true,
  //       addAndroidDownloads: {
  //         useDownloadManager: true,
  //         fileCache: true,
  //         appendExt: 'pdf',
  //         notification: true,
  //         title: 'Navgam Attachments',
  //         description: 'File downloaded by Navgam App.',
  //         mime: 'application/pdf',
  //         mediaScannable: true,
  //         overwrite: true,
  //         path: path,
  //       },
  //       path: path,
  //     })
  //       .fetch('GET', filePath, {
  //         'Cache-Control': 'no-store',
  //       })
  //       .then(resp => {
  //         dispatch(setLoaderFalse());
  //         resolve(true);
  //
  //         if (!isANDROID) {
  //           RNFetchBlob.ios.previewDocument(resp.path());
  //         } else {
  //           RNFetchBlob.android.actionViewIntent(resp.path(), 'application/pdf');
  //         }
  //       })
  //       .catch(e => {
  //         console.log(e);
  //         resolve(false);
  //       });
  //   });
  // };

  const shareButtonPress = async (url, typeOfFile) => {
    dispatch(setLoaderTrue());
    if (typeOfFile === 'image') {
      onImageDownloadForSharing(url).then(async res => {
        dispatch(setLoaderFalse());
        if (res) {
          const sharingPath = isIOS ? res : 'file://' + res;
          await Share.open({type: 'application/image', url: sharingPath, title: 'share'})
            .then(res => {
              if (isANDROID) {
                console.log(res);
                setTimeout(() => {
                  RNFS.unlink(sharingPath)
                    .then(() => {})
                    .catch(err => {
                      console.log(err);
                    });
                }, 1000);
              }
            })
            .catch(err => {
              dispatch(setLoaderFalse());
              err && console.log(err);
              if (isANDROID) {
                setTimeout(() => {
                  RNFS.unlink(sharingPath)
                    .then(() => {})
                    .catch(err => {
                      console.log(err);
                    });
                }, 1000);
              }
            });
        }
      });
    } else if (typeOfFile === 'pdf') {
      onPDFDownloadForSharing(url).then(res => {
        dispatch(setLoaderFalse());
        if (res) {
          const sharingPath = isIOS ? res : 'file://' + res;
          Share.open({type: 'application/pdf', url: sharingPath, title: 'share'})
            .then(res => {
              if (isANDROID) {
                setTimeout(() => {
                  RNFS.unlink(sharingPath)
                    .then(() => {})
                    .catch(err => {
                      console.log(err);
                    });
                }, 1000);
              }
            })
            .catch(err => {
              dispatch(setLoaderFalse());
              err && console.log(err);
              if (isANDROID) {
                setTimeout(() => {
                  RNFS.unlink(sharingPath)
                    .then(() => {})
                    .catch(err => {
                      console.log(err);
                    });
                }, 1000);
              }
            });
        }
      });
    }
  };

  const downloadButtonPress = async (url, typeOfFile) => {
    dispatch(setLoaderTrue());
    if (typeOfFile === 'image') {
      onImageFileDownload(url).then(res => {
        dispatch(setLoaderFalse());
        if (res) {
          alert('Download file successfully');
        } else {
          alert('Failed to download image');
        }
      });
    } else if (typeOfFile === 'pdf') {
      if (isIOS) {
        onPDFDownloadForSharing(url)
          .then(res => {
            dispatch(setLoaderFalse());
            if (res) {
              const sharingPath = isIOS ? res : 'file://' + res;
              Share.open({type: 'application/pdf', url: sharingPath, title: 'share'})
                .then(res => {})
                .catch(err => {
                  dispatch(setLoaderFalse());
                  err && console.log(err);
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        onPdfFileDownload(url)
          .then(res => {
            dispatch(setLoaderFalse());
            if (!res) {
              alert('failed to download PDF');
            }
          })
          .catch(() => {
            alert('failed to download PDF');
          });
      }
    }
  };

  const returnBelowDotsData = () => {
    const data = notificationDetails;
    if (
      data.hasOwnProperty('imgPath') &&
      typeof data.imgPath !== 'undefined' &&
      data.imgPath !== [] &&
      data.hasOwnProperty('docPath') &&
      typeof data.docPath !== 'undefined' &&
      data.docPath !== []
    ) {
      return [...data.imgPath, ...data.docPath];
    } else if (
      data.hasOwnProperty('imgPath') &&
      typeof data.imgPath !== 'undefined' &&
      data.imgPath !== []
    ) {
      return [...data.imgPath];
    } else if (
      data.hasOwnProperty('docPath') &&
      typeof data.docPath !== 'undefined' &&
      data.docPath !== []
    ) {
      return [...data.docPath];
    }
  };
  const renderNotificationDetail = () => {
    const data = notificationDetails;
    return (
      <Background style={{flex: 1}}>
        <NotificationHeaderWithGradient
          // gradientColors={NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]}
          gradientColors={
            notificationDetails.notificationType !== 4
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]
              : notificationDetails.newsType.toLowerCase() === 'information'
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][0]
              : notificationDetails.newsType.toLowerCase() === 'bad news'
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][1]
              : NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][2]
          }
          title={notificationTypeName + ' ' + 'Notification'}
          onBackPress={() => props.navigation.goBack()}
        />
        <ScrollView style={{flex: 1, marginBottom: hp(4)}}>
          {/*<View style={{flex: 1, marginBottom: hp(4)}}>*/}
          <View style={style.mainContainer}>
            <View style={{flex: 1}}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={
                  // NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]
                  notificationDetails.notificationType !== 4
                    ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]
                    : notificationDetails.newsType.toLowerCase() === 'information'
                    ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][0]
                    : notificationDetails.newsType.toLowerCase() === 'bad news'
                    ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][1]
                    : NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][2]
                }
                style={[
                  style.notificationDetailView,
                  {
                    padding: hp(2),
                  },
                ]}>
                <View />
                {/*{typeof data?.fromDate === 'undefined' && (*/}
                <View
                  style={[
                    style.containerView,
                    {marginTop: 0, marginLeft: wp(-1), flex: 1, alignSelf: 'flex-end'},
                  ]}>
                  <View style={{flex: 1, marginTop: hp(0.5)}}>
                    <CustomText
                      style={[style.textValue, {fontSize: normalize(13), fontWeight: 'bold'}]}>
                      {new Date(parseInt(data.notificationDateTime)).toDateString() +
                        ' | ' +
                        new Date(parseInt(data.notificationDateTime)).toLocaleTimeString()}
                    </CustomText>
                  </View>
                </View>
                {/*)}*/}
                <Text allowFontScaling={false} style={style.notificationTitle}>
                  {data?.title}
                </Text>
                {!readMoreFlag && (
                  <Text
                    allowFontScaling={false}
                    numberOfLines={5}
                    ellipsizeMode="tail"
                    onTextLayout={({nativeEvent: {lines}}) => {
                      lines.length >= 5 ? setMoreButtonFlag(true) : setMoreButtonFlag(false);
                    }}
                    style={[style.notificationContent]}>
                    {data?.content.trim()
                    // .split('.')
                    // .join('\n')
                    // .trim()
                    }
                  </Text>
                )}
                {readMoreFlag && (
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: normalize(16),
                      textAlign: 'justify',
                      marginTop: hp(1),
                      color: color.white,
                    }}>
                    {data?.content.trim()
                    // .split('.')
                    // .join('\n')
                    // .trim()
                    }
                  </Text>
                )}
                {moreButtonFlag && (
                  <Text
                    allowFontScaling={false}
                    onPress={() => {
                      setReadMoreFlag(!readMoreFlag);
                    }}
                    style={style.readMoreText}>
                    {!readMoreFlag ? 'Read More...' : 'Show less...'}
                  </Text>
                )}

                {data?.cause && typeof data?.cause !== 'undefined' && (
                  <View style={[style.containerView]}>
                    <View style={style.dividerView} />
                    <View style={{flex: 1}}>
                      <CustomText style={style.titleLabel}>{'CAUSE' + ' '}</CustomText>
                    </View>
                    <View style={style.innerContainerView}>
                      <CustomText style={style.textValue}>{data.cause}</CustomText>
                    </View>
                    <View style={[style.dividerView, {marginTop: hp(1), marginBottom: hp(0)}]} />
                  </View>
                )}
                <View style={{flex: 1}}>
                  {(notificationDetails.notificationType === EVENT_TYPE ||
                    notificationDetails.notificationType === NEWS_TYPE) && (
                    <View style={[style.dividerView, {marginTop: hp(1)}]} />
                  )}
                  <View style={{flexDirection: 'row', flex: 1}}>
                    {data?.fromDate && typeof data?.fromDate !== 'undefined' && (
                      <View style={[style.containerView, {marginLeft: wp(-1), flex: 1}]}>
                        <View style={{flex: 1}}>
                          <CustomText style={style.titleLabel}>
                            {' '}
                            {data?.newsType && typeof data.newsType !== 'undefined'
                              ? 'DATE'
                              : 'FROM DATE & TIME'}
                          </CustomText>
                        </View>

                        <View style={style.innerContainerView}>
                          <CustomText style={[style.textValue]}>
                            {data?.newsType && typeof data.newsType !== 'undefined'
                              ? moment(new Date(parseInt(data.fromDate))).format('DD/MM/YYYY')
                              : moment(new Date(parseInt(data.fromDate))).format('DD/MM/YYYY') +
                                ' | ' +
                                new Date(parseInt(data.fromDate)).toLocaleTimeString()}
                          </CustomText>
                        </View>
                      </View>
                    )}

                    {data?.toDate && typeof data?.toDate !== 'undefined' && (
                      <View style={[style.containerView, {marginLeft: wp(3), flex: 1}]}>
                        <View style={{flex: 1}}>
                          <CustomText style={style.titleLabel}>TO DATE & TIME</CustomText>
                        </View>
                        <View style={{flex: 1}}>
                          <CustomText style={[style.textValue]}>
                            {moment(new Date(parseInt(data.toDate))).format('DD/MM/YYYY') +
                              ' | ' +
                              new Date(parseInt(data.toDate)).toLocaleTimeString()}
                          </CustomText>
                        </View>
                      </View>
                    )}

                    {data?.closeDate && typeof data?.closeDate !== 'undefined' && (
                      <View style={[style.containerView, {flex: 1, marginLeft: wp(3)}]}>
                        <View style={{flex: 1}}>
                          <CustomText style={style.titleLabel}>CLOSE DATE & TIME</CustomText>
                        </View>
                        <View style={style.innerContainerView}>
                          <CustomText style={style.textValue}>
                            {moment(new Date(parseInt(data.closeDate))).format('DD/MM/YYYY') +
                              ' | ' +
                              new Date(parseInt(data.closeDate)).toLocaleTimeString()}
                          </CustomText>
                        </View>
                      </View>
                    )}
                  </View>
                  {(notificationDetails.notificationType === EVENT_TYPE ||
                    notificationDetails.notificationType === NEWS_TYPE ||
                    notificationDetails.notificationType === FUND_TYPE) && (
                    <View style={[style.dividerView, {marginTop: hp(1)}]} />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    {data?.organizer && typeof data?.organizer !== 'undefined' && (
                      <View style={[style.containerView, {flex: 1}]}>
                        <View style={{flex: 1}}>
                          <CustomText style={style.titleLabel}>ORGANIZER NAME</CustomText>
                        </View>
                        <View style={style.innerContainerView}>
                          <CustomText style={[style.textValue]}>{data.organizer}</CustomText>
                        </View>
                      </View>
                    )}
                    {data?.location && typeof data?.location !== 'undefined' && (
                      <View
                        style={[
                          style.containerView,
                          {
                            marginLeft:
                              data?.organizer && typeof data?.organizer !== 'undefined' ? wp(3) : 0,
                            flex: 1,
                          },
                        ]}>
                        <View style={{flex: 1}}>
                          <CustomText style={style.titleLabel}>LOCATION</CustomText>
                        </View>
                        <View style={{flex: 1}}>
                          <CustomText style={style.textValue}>{data.location}</CustomText>
                        </View>
                      </View>
                    )}
                  </View>
                  {notificationDetails.notificationType === NEWS_TYPE && (
                    <View style={[style.dividerView, {marginTop: hp(1)}]} />
                  )}
                </View>
                {data?.newsType && typeof data?.newsType !== 'undefined' && (
                  <View style={[style.containerView]}>
                    <View style={{flex: 1}}>
                      <CustomText style={style.titleLabel}>NEWS TYPE</CustomText>
                    </View>
                    <View style={style.innerContainerView}>
                      <CustomText style={style.textValue}>{data.newsType}</CustomText>
                    </View>
                  </View>
                )}
                <View style={{flexDirection: 'row', flex: 1}}>
                  {data?.minLimit && typeof data?.minLimit !== 'undefined' && (
                    <View style={[style.containerView, {flex: 1}]}>
                      <View style={{flex: 1}}>
                        <CustomText style={style.titleLabel}>MINIMUM LIMIT</CustomText>
                      </View>
                      <View style={style.innerContainerView}>
                        <CustomText style={style.textValue}>{data.minLimit}</CustomText>
                      </View>
                    </View>
                  )}
                  {data?.maxLimit && typeof data?.maxLimit !== 'undefined' && (
                    <View style={[style.containerView, {flex: 1, marginLeft: wp(3)}]}>
                      <View style={{flex: 1}}>
                        <CustomText style={style.titleLabel}>MAXIMUM LIMIT</CustomText>
                      </View>
                      <View style={style.innerContainerView}>
                        <CustomText style={style.textValue}>{data.maxLimit}</CustomText>
                      </View>
                    </View>
                  )}
                </View>

                {data?.newsEvent && typeof data?.newsEvent !== 'undefined' && (
                  <View style={[style.containerView]}>
                    <View style={{flex: 1}}>
                      <CustomText style={style.titleLabel}>EVENT/NEWS</CustomText>
                    </View>
                    <View style={style.innerContainerView}>
                      <CustomText style={style.textValue}>{data.newsEvent}</CustomText>
                    </View>
                  </View>
                )}
              </LinearGradient>
              <Image source={gradientBackground} style={style.rightCornerImage} />
            </View>
            <View style={{height: hp(1.5)}} />
          </View>
          {/*</View>*/}
        </ScrollView>
      </Background>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: color.white}}>
      {memberNotificationDetail ? (
        renderNotificationDetail()
      ) : (
        <NotificationHeaderWithGradient
          // gradientColor={NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]}
          gradientColor={
            notificationDetails.notificationType !== 4
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1]
              : notificationDetails.newsType.toLowerCase() === 'information'
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][0]
              : notificationDetails.newsType.toLowerCase() === 'bad'
              ? NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][1]
              : NOTIFICATION_GRADIENT_COLORS[notificationDetails.notificationType - 1][2]
          }
          title={notificationTitle}
          onBackPress={() => props.navigation.goBack()}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  containerView: {
    padding: hp(0.5),
    marginTop: hp(1),
  },
  titleLabel: {
    fontWeight: 'bold',
    fontSize: normalize(13),
    color: color.white,
  },
  textValue: {
    // fontWeight: 'bold',
    fontSize: normalize(13),
    color: color.white,
  },
  mainContainer: {
    flex: 1,
  },
  attachmentTitle: {
    flex: 1,
    flexDirection: 'row',
    marginTop: hp(2),
    marginHorizontal: hp(-2.4),
    backgroundColor: color.lightGray,
    padding: hp(0.8),
  },
  attachmentContainer: {
    height: wp(25),
    backgroundColor: color.gray,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: wp(1),
    borderTopRightRadius: wp(1),
  },
  downloadBtn: {
    height: wp(10),
    backgroundColor: color.lightGray,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: wp(1),
    borderBottomRightRadius: wp(1),
  },
  notificationDetailView: {
    flex: 1,
    borderBottomLeftRadius: hp(5),
    padding: hp(1),
  },
  attachedTextHeading: {
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  attachmentImage: {
    height: hp('20%'),
    width: wp('90%'),
    borderRadius: hp(2),
    // borderTopLeftRadius: hp(2),
    // borderTopRightRadius: hp(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  belowOutterDots: {
    height: hp(2),
    width: hp(2),
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: color.blue,
    borderRadius: hp(1),
  },
  belowInnerDots: {
    height: hp(1),
    width: hp(1),

    borderRadius: hp(0.5),
  },
  notificationContent: {
    fontSize: normalize(16),
    textAlign: 'justify',
    marginTop: hp(1),
    color: color.white,
  },
  notificationTitle: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: color.white,
  },
  readMoreText: {
    fontSize: normalize(12),
    // alignSelf: 'flex-end',
    marginTop: hp(0.3),
    color: color.white,
    fontWeight: 'bold',
  },
  innerContainerView: {flex: 1, marginTop: hp(0.5)},
  rightCornerImage: {
    height: hp(40),
    width: wp(40),
    alignSelf: 'flex-end',
    position: 'absolute',
    opacity: 0.4,
  },
  previewModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(1,17,20,0.89)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImageMainView: {
    height: hp(60),
    width: wp(90),
    // backgroundColor: 'white',
    borderRadius: hp(0.5),
  },
  previewHeaderTopRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
    marginTop: hp(1),
  },
  previewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  imagePreviewBottomRow: {
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  previewBottomRowButtonView: {
    height: hp(5),
    marginLeft: wp(50),
    width: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: '#5a5a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfPreviewCloseButton: {
    alignSelf: 'flex-end',
    marginRight: wp(5),
    fontSize: normalize(18),
    color: color.blue,
    fontWeight: 'bold',
  },
  pdfPreviewTopRow: {
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfPreviewBottomRow: {
    height: hp(10),
    marginTop: hp(2),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dividerView: {
    height: hp(0.08),
    backgroundColor: color.white,
    width: wp(95),
    alignSelf: 'center',
    marginBottom: hp(1),
  },
  imgPreviewMainView: {height: hp(80), width: wp(100)},
  imgPreviewFirstRow: {
    height: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgPreviewPageNumberText: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: wp(45),
  },
  imgPreviewImageMainView: {width: wp(100), alignItems: 'center', justifyContent: 'center'},
  imgPreviewImage: {flex: 1, width: wp(90), height: hp(55)},
  imgPreviewBottomRow: {
    height: hp(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgPreviewBottomSubRow: {
    height: hp(10),
    width: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgPreviewDivider: {height: hp(0.1), width: wp(90), backgroundColor: 'gray'},
  imgPreviewBottomView: {height: hp(5), marginTop: hp(1), flexDirection: 'row'},
  imgPreviewDownloadView: {flex: 1, flexDirection: 'row', paddingLeft: wp(5), marginTop: hp(0.5)},
  imgPreviewDownloadText: {fontSize: normalize(12), color: color.white, marginLeft: wp(1)},
  imgPreviewShareView: {flex: 1, flexDirection: 'row', marginLeft: wp(2)},
  imgPreviewShareText: {fontSize: normalize(12), color: color.white, marginLeft: wp(1)},
});

export default NotificationDetail;
