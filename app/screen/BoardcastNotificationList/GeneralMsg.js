import React, {useState} from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, Alert, Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  wp,
  hp,
  normalize,
  font,
  color,
  color as colors,
  isANDROID,
} from '../../helper/themeHelper';
import {AppButton, LabelInputText, CustomText, Loading} from '../common/';

import {UserTypeCheckBox} from './UserTypeCheckbox';
import {ListHeader} from './ListHeader';


import {GENERAL} from '../../helper/constant';
import {checkCommonValue, isDefined} from "../functions";
import {broadCastNotification} from "../../redux/actions/broadCastNotificationAction";

const TITLE = 'General Message';
const GeneralMsg = props => {
  const {_setOpenItemIndex, openItemIndex, index, limitList} = props;
  const [checkBoxArr, setCheckboxArr] = useState([]);
  const [appLoader, setAppLoader] = useState(false);
  const [successMsgflag, setSuccesMsgFlag] = useState(false);
  const [successMsg, setSuccesMsg] = useState('');
  const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
  const [invalidMsgLength, setInvalidMsgLength] = useState(false);
  const [invalidTitleLength, setInvalidTitleLength] = useState(false);
  const [userdata, setUserData] = useState({
    type: [],
    notificationTitle: '',
    msg: '',
    image: '',
    imageUrl: '',
    docUrl: '',
    typeName: GENERAL,
  });
  const dispatch = useDispatch();
  const [docUrl, setDocUrl] = useState([]);
  const [docs, setDocs] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgData, setImgData] = useState([]);

  // useEffect(() => {
  //   setAlertBox(false);
  //   return () => {
  //     setAlertBox(false);
  //   };
  // }, []);

  const setToDefaultValue = () => {
    setUserData({
      type: [],
      notificationTitle: '',
      msg: '',
      image: '',
      imageUrl: '',
      docUrl: '',
      typeName: GENERAL,
    });
    setImageUrls([]);
    setDocs([]);
    setDocUrl([]);
    setCheckboxArr([]);
    setImgData([]);
  };
  const sendNotification = data => {
    checkCommonValue(data.notificationTitle, data.msg).then(async isValid => {
      if (isValid) {
        setInvalidMsgLength(false);
        setInvalidTitleLength(false);
        data.notificationTitle = data.notificationTitle.replace(/\s+/g, ' ');
        // data.msg = data.msg.replace(/\s+/g, ' ');
        if (!isDefined(data.type) || data.type.length === 0 || data.type === []) {
          alert('Please Select a Atleast one Member Category');
        } else {
          dispatch(broadCastNotification(data)).then((res)=>{
            setToDefaultValue()
            if(res){
              alert(res)
              setToDefaultValue()
            }
          })

          // if (docs || imageUrls) {
          //   countTotalUploads =
          //       parseInt(docs.length ? docs.length : 0) +
          //       parseInt(imageUrls.length ? imageUrls.length : 0);
          // }
          // await dispatch(boardcastNotification(data)).then(res => {
          //   if (isANDROID) {
          //     setTimeout(() => {
          //       setToDefaultValue();
          //       setAppLoader(false);
          //     }, 100);
          //   } else {
          //     setToDefaultValue();
          //     setAppLoader(false);
          //   }
          //   if (res) {
          //     Keyboard.dismiss();
          //     setSuccesMsgFlag(true);
          //     setSuccesMsg(res);
          //     setTimeout(() => {
          //       setSuccesMsgFlag(false);
          //     }, 3000);
          //   }
          // });

          // if (countTotalUploads > limitList.general) {
          //   alert('You can upload maximum ' + limitList.general + 'attachments');
          //   setToDefaultValue();
          // } else {
          //   setAppLoader(true);
          //   let tempUpdatedDocs = [];
          //   if (docs) {
          //     for (let i = 0; i < docs.length; i++) {
          //       // setAppLoader(true);
          //       await uploadPdfOnFirebase(docs[i], docUrl[i])
          //           .then(res => {
          //             if (res) {
          //               tempUpdatedDocs.push(res);
          //             }
          //           })
          //           .catch(error => {
          //             console.log(error);
          //             setAppLoader(false);
          //             // setAppLoader(false);
          //           });
          //     }
          //     setUserData({...userdata, docUrl: tempUpdatedDocs});
          //   }
          //   if (imageUrls) {
          //     for (let k = 0; k < imageUrls.length; k++) {
          //       await uploadImageOnFirebase(imageUrls[k])
          //           .then(res => {
          //             if (res) {
          //               arrayImage.push(res);
          //               // setUserData({...userdata, imageUrl: (userdata.imageUrl).push(res)});
          //               // setAppLoader(false);
          //             }
          //             setUserData({...userdata, imageUrl: arrayImage});
          //           })
          //           .catch(error => {
          //             console.log(error);
          //             setAppLoader(false);
          //             // setAppLoader(false);
          //           });
          //     }
          //   }
          //   if (arrayImage.length > 0) {
          //     data.imageUrl = arrayImage;
          //   }
          //   if (tempUpdatedDocs.length > 0) {
          //     data.docUrl = tempUpdatedDocs;
          //   }
          //   setAppLoader(false);
          //   setAppLoader(true);
          //
          //   await dispatch(boardcastNotification(data)).then(res => {
          //     if (isANDROID) {
          //       setTimeout(() => {
          //         setToDefaultValue();
          //         setAppLoader(false);
          //       }, 100);
          //     } else {
          //       setToDefaultValue();
          //       setAppLoader(false);
          //     }
          //     if (res) {
          //       Keyboard.dismiss();
          //       setSuccesMsgFlag(true);
          //       setSuccesMsg(res);
          //       setTimeout(() => {
          //         setSuccesMsgFlag(false);
          //       }, 3000);
          //     }
          //   });
          //   // setAppLoader(false);
          // }
        }
      }
    });
  };

  return (
    <View style={style.mainView}>
      {isLoading && <Loading isLoading={isLoading} />}

      <ListHeader
        img={require('../../assets/images/gender.png')}
        title={TITLE}
        onPress={() => {
          openItemIndex == TITLE ? _setOpenItemIndex('', 0) : _setOpenItemIndex(TITLE, index);
        }}
        selected={openItemIndex === TITLE}
        color={color.lightPurple}
      />
      {/*{openItemIndex == TITLE && (*/}
      {/*  <View style={{paddingHorizontal: wp(4), paddingVertical: hp(2)}}>*/}
      {/*    <LabelInputText*/}
      {/*      label={'Title'}*/}
      {/*      onChangeText={text => {*/}
      {/*        if (text.length < 256) {*/}
      {/*          setUserData({...userdata, notificationTitle: text});*/}
      {/*          setInvalidTitleLength(false);*/}
      {/*        } else {*/}
      {/*          setUserData({...userdata, notificationTitle: text.substring(0, 255)});*/}
      {/*          setInvalidTitleLength(true);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*      value={userdata.notificationTitle}*/}
      {/*    />*/}
      {/*    {invalidTitleLength && (*/}
      {/*      <CustomText style={style.invalidData}>*/}
      {/*        {'Maximum charater allowed upto 255 character only'}*/}
      {/*      </CustomText>*/}
      {/*    )}*/}
      {/*    <LabelInputText*/}
      {/*      label={'Message'}*/}
      {/*      onChangeText={text => {*/}
      {/*        if (text.length < 2501) {*/}
      {/*          setUserData({...userdata, msg: text});*/}
      {/*          setInvalidMsgLength(false);*/}
      {/*        } else {*/}
      {/*          setUserData({...userdata, msg: text.substring(0, 2500)});*/}
      {/*          setInvalidMsgLength(true);*/}
      {/*        }*/}
      {/*        // text.length < 10 ? setUserData({...userdata, msg: text}) : setInvalidMsgLength(true);*/}
      {/*      }}*/}
      {/*      value={userdata.msg}*/}
      {/*      multiline={true}*/}
      {/*      containerStyle={{marginTop: hp(1)}}*/}
      {/*    />*/}
      {/*    {invalidMsgLength && (*/}
      {/*      <CustomText style={style.invalidData}>*/}
      {/*        {'Maximum charater allowed upto 2500 character only'}*/}
      {/*      </CustomText>*/}
      {/*    )}*/}
      {/*    {appLoader && (*/}
      {/*      <Modal transparent={true} style={{flex: 1}}>*/}
      {/*        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
      {/*          <ActivityIndicator size={'large'} color={colors.blue} animating={true} />*/}
      {/*        </View>*/}
      {/*      </Modal>*/}
      {/*    )}*/}

      {/*    <UserTypeCheckBox*/}
      {/*      selectedData={checkBoxArr}*/}
      {/*      toggleCheckbox={id => {*/}
      {/*        if (checkBoxArr.includes(id)) {*/}
      {/*          let index = checkBoxArr.findIndex(x => x === id);*/}
      {/*          checkBoxArr.splice(index, 1);*/}
      {/*        } else {*/}
      {/*          checkBoxArr.push(id);*/}
      {/*        }*/}
      {/*        setCheckboxArr([...checkBoxArr]);*/}
      {/*        setUserData({...userdata, type: checkBoxArr});*/}
      {/*      }}*/}
      {/*    />*/}
      {/*    <View>*/}
      {/*      {successMsgflag && (*/}
      {/*        <View style={{flex: 0, alignItems: 'center', marginTop: hp(1)}}>*/}
      {/*          <CustomText*/}
      {/*            style={{*/}
      {/*              color: successMsg.status ? 'green' : 'red',*/}
      {/*              fontSize: normalize(18),*/}
      {/*            }}>*/}
      {/*            {successMsg.message}*/}
      {/*          </CustomText>*/}
      {/*        </View>*/}
      {/*      )}*/}
      {/*      <AppButton*/}
      {/*        onPress={() => !isLoading && sendNotification(userdata)}*/}
      {/*        style={{width: wp(35), marginTop: hp(2), paddingVertical: hp(1)}}*/}
      {/*        title={'Send'}*/}
      {/*      />*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*)}*/}
      <View style={{paddingHorizontal: wp(4), paddingVertical: hp(2)}}>
        <LabelInputText
            label={'Title'}
            onChangeText={text => {
              if (text.length < 256) {
                setUserData({...userdata, notificationTitle: text});
                setInvalidTitleLength(false);
              } else {
                setUserData({...userdata, notificationTitle: text.substring(0, 255)});
                setInvalidTitleLength(true);
              }
            }}
            value={userdata.notificationTitle}
        />
        {invalidTitleLength && (
            <CustomText style={style.invalidData}>
              {'Maximum charater allowed upto 255 character only'}
            </CustomText>
        )}
        <LabelInputText
            label={'Message'}
            onChangeText={text => {
              if (text.length < 2501) {
                setUserData({...userdata, msg: text});
                setInvalidMsgLength(false);
              } else {
                setUserData({...userdata, msg: text.substring(0, 2500)});
                setInvalidMsgLength(true);
              }
              // text.length < 10 ? setUserData({...userdata, msg: text}) : setInvalidMsgLength(true);
            }}
            value={userdata.msg}
            multiline={true}
            containerStyle={{marginTop: hp(1)}}
        />
        {invalidMsgLength && (
            <CustomText style={style.invalidData}>
              {'Maximum charater allowed upto 2500 character only'}
            </CustomText>
        )}
        {appLoader && (
            <Modal transparent={true} style={{flex: 1}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={colors.blue} animating={true} />
              </View>
            </Modal>
        )}

        <UserTypeCheckBox
            selectedData={checkBoxArr}
            toggleCheckbox={id => {
              if (checkBoxArr.includes(id)) {
                let index = checkBoxArr.findIndex(x => x === id);
                checkBoxArr.splice(index, 1);
              } else {
                checkBoxArr.push(id);
              }
              setCheckboxArr([...checkBoxArr]);
              setUserData({...userdata, type: checkBoxArr});
            }}
        />
        <View>
          {successMsgflag && (
              <View style={{flex: 0, alignItems: 'center', marginTop: hp(1)}}>
                <CustomText
                    style={{
                      color: successMsg.status ? 'green' : 'red',
                      fontSize: normalize(18),
                    }}>
                  {successMsg.message}
                </CustomText>
              </View>
          )}
          <AppButton
              onPress={() => !isLoading && sendNotification(userdata)}
              style={{width: wp(35), marginTop: hp(2), paddingVertical: hp(1)}}
              title={'Send'}
          />
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    borderWidth: wp(0.3),
    borderColor: '#B0BFEC',
    borderRadius: hp(1),
    marginVertical: hp(1),
  },
  headerView: {
    flexDirection: 'row',
    backgroundColor: '#B0BFEC',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopRightRadius: hp(1),
    borderTopLeftRadius: hp(1),
  },
  mainImgView: {
    padding: hp(2),
    backgroundColor: color.white,
    borderRadius: hp(12.5),
  },
  mainText: {
    color: color.white,
    fontFamily: font.robotoRegular,
    fontSize: wp(6),
    marginLeft: wp(3),
  },
  mainImg: {
    width: hp(4),
    height: hp(4),
  },
  floatingInputStyle: {
    borderWidth: 1,
    fontSize: normalize(14),
    fontFamily: font.robotoRegular,
    height: hp(5),
    // marginTop: hp(1),
    // marginLeft: wp(5),
    // marginRight: wp(5),
  },
  uploadImg: {
    borderWidth: 0.5,
    marginTop: hp(2),
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
  },
  invalidData: {marginTop: hp(0.7), color: color.red},
});
export default GeneralMsg;
