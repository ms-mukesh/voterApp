import React, {useState} from 'react';
import {StyleSheet, View, ActivityIndicator, Modal, Keyboard, TextInput} from 'react-native';
import {
  wp,
  hp,
  normalize,
  font,
  color,
  color as colors,
  isANDROID,
  isIOS,
} from '../../helper/themeHelper';
import {AppButton, CustomText, LabelInputText, LableInputTextWithIcon} from '../common/';

import DatePickerModel from '../common/DatePickerModel';
import {EVENT} from '../../helper/constant';
import {ListHeader} from './ListHeader';
import {UserTypeCheckBox} from './UserTypeCheckbox';
import {useDispatch, useSelector} from 'react-redux';
import {calender_icon, location_pin_icon} from "../../assets/images";
import {broadCastNotification} from "../../redux/actions/broadCastNotificationAction";
import {checkCommonValue, isDefined} from "../functions";

const EventNotify = props => {
  const {_setOpenItemIndex, openItemIndex, index, limitList} = props;
  const [checkBoxArr, setCheckboxArr] = useState([]);
  const [dateForDatePicker, setDateForDatePicker] = useState({});
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [currentKey, setCurrentKey] = useState();
  const [invalidMsgLength, setInvalidMsgLength] = useState(false);
  const [invalidTitleLength, setInvalidTitleLength] = useState(false);
  const [invalidOrganizerLength, setInvalidOrganizerLength] = useState(false);
  const [invalidLocationLength, setInvalidLocationLength] = useState(false);
  const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
  const [userdata, setUserData] = useState({
    type: [],
    notificationTitle: '',
    msg: '',
    image: '',
    fromDate: '',
    toDate: '',
    imageUrl: '',
    organizer: '',
    docUrl: '',
    typeName: EVENT,
  });
  const dispatch = useDispatch();
  const [fromDateFlag, setFromDateFlag] = useState(0);
  const [toDateFlag, setToDateFlag] = useState(0);
  const [docUrl, setDocUrl] = useState([]);
  const [docs, setDocs] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [appLoader, setAppLoader] = useState(false);
  const [successMsgflag, setSuccesMsgFlag] = useState(false);
  const [successMsg, setSuccesMsg] = useState('');
  const [imgData, setImgData] = useState([]);
  const checkValue = (str, max) => {
    if (str.charAt(0) !== '0' || str == '00') {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
          num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
              ? '0' + num
              : num.toString();
    }
    return str;
  }
  const dateTimeInputChangeHandler = (e) => {
    // this.type = 'text';
    var input = e;
    var expr = new RegExp(/\D\/$/);
    if (expr.test(input)) input = input.substr(0, input.length - 3);
    var values = input.split('/').map(function (v) {
      return v.replace(/\D/g, '');
    });
    if (values[1]) values[1] = checkValue(values[1], 12);
    if (values[0]) values[0] = checkValue(values[0], 31);
    let output = values.map(function (v, i) {
      return v.length == 2 && i < 2 ? v + '/' : v;
    });
    setUserData({...userdata,fromDate:output.join('').substr(0, 14) })
  };
  const dateTimeInputChangeHandlerForEndDate = (e) => {
    // this.type = 'text';
    var input = e;
    var expr = new RegExp(/\D\/$/);
    if (expr.test(input)) input = input.substr(0, input.length - 3);
    var values = input.split('/').map(function (v) {
      return v.replace(/\D/g, '');
    });
    if (values[1]) values[1] = checkValue(values[1], 12);
    if (values[0]) values[0] = checkValue(values[0], 31);
    let output = values.map(function (v, i) {
      return v.length == 2 && i < 2 ? v + '/' : v;
    });
    setUserData({...userdata,toDate:output.join('').substr(0, 14) })
    // this.setState({
    //     registrationDate: output.join('').substr(0, 14),
    // });
  };
  const setToDefaultValue = () => {
    setUserData({
      type: [],
      notificationTitle: '',
      msg: '',
      image: '',
      fromDate: '',
      toDate: '',
      imageUrl: '',
      docUrl: '',
      typeName: EVENT,
      organizer: '',
    });
    setImageUrls([]);
    setDocs([]);
    setDocUrl([]);
    setCheckboxArr([]);
    setFromDateFlag(0);
    setToDateFlag(0);
    setImgData([]);
  };
  const sendNotification = data => {
    checkCommonValue(data.notificationTitle, data.msg).then(async isValid => {
      data.notificationTitle = data.notificationTitle.replace(/\s+/g, ' ').trim();
      // data.msg = data.msg.replace(/\s+/g, ' ').trim();
      if (isValid) {
        setInvalidMsgLength(false);
        setInvalidTitleLength(false);
        setInvalidOrganizerLength(false);
        setInvalidLocationLength(false);
        if (
          !isDefined(data.organizer) ||
          data.organizer === '' ||
          data.organizer === null ||
          data.organizer.trim().length === 0 ||
          data.organizer.trim().length > 255
        ) {
          alert('Please enter an proper organizer detail');
        } else if (
          data.fromDate === '' || data.fromDate.length<10
        ) {
          alert('Please Select a From Event Date');
        } else if (
            data.toDate === '' || data.toDate.length<10
        ) {
          alert('Please Select a From Event Close Date');
        } else if (
          !isDefined(data.location) ||
          data.location === '' ||
          data.location === null ||
          data.location.trim().length === 0 ||
          data.location.trim().length > 255
        ) {
          alert('Please Select Proper Location Detail');
        } else if (!isDefined(data.type) || data.type.length === 0 || data.type === []) {
          alert('Please Select a Atleast one Member Category');
        } else {
          // if (docs || imageUrls) {
          //   countTotalUploads =
          //     parseInt(docs.length ? docs.length : 0) +
          //     parseInt(imageUrls.length ? imageUrls.length : 0);
          // }
          //
          // if (countTotalUploads > limitList.event) {
          //   alert('You can upload maximum ' + limitList.event + ' attachments');
          //   setToDefaultValue();
          // } else {
          var str = data.fromDate;
          let darr = str.split("/");    // ["25", "09", "2019"]
          var ISOFormat = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0])+1);
          data.fromDate = new Date(ISOFormat).getTime();

          var str = data.toDate;
          let darr1 = str.split("/");    // ["25", "09", "2019"]
          var ISOFormat = new Date(parseInt(darr1[2]),parseInt(darr1[1])-1,parseInt(darr1[0])+1);
          data.toDate = new Date(ISOFormat).getTime();
          data.location = data.location.replace(/\s+/g, ' ').trim();
            dispatch(broadCastNotification(data)).then((res)=>{
              setToDefaultValue()
              if(res){
                alert(res)
                setToDefaultValue()
              }
            })

            // setAppLoader(true);
            // let tempUpdatedDocs = [];
            // if (docs) {
            //   setAppLoader(true);
            //   for (let i = 0; i < docs.length; i++) {
            //     // setAppLoader(true);
            //     await uploadPdfOnFirebase(docs[i], docUrl[i])
            //       .then(res => {
            //         if (res) {
            //           tempUpdatedDocs.push(res);
            //         }
            //       })
            //       .catch(error => {
            //         setAppLoader(false);
            //       });
            //   }
            //   setUserData({...userdata, docUrl: tempUpdatedDocs});
            // }
            // if (imageUrls) {
            //   for (let k = 0; k < imageUrls.length; k++) {
            //     await uploadImageOnFirebase(imageUrls[k])
            //       .then(res => {
            //         if (res) {
            //           arrayImage.push(res);
            //         }
            //         setUserData({...userdata, imageUrl: arrayImage});
            //       })
            //       .catch(error => {
            //         console.log(error);
            //         setAppLoader(false);
            //       });
            //   }
            // }
            // if (arrayImage.length > 0) {
            //   data.imageUrl = arrayImage;
            // }
            // if (tempUpdatedDocs.length > 0) {
            //   data.docUrl = tempUpdatedDocs;
            // }
            // data.fromDate = new Date(data.fromDate).getTime();
            // data.toDate = new Date(data.toDate).getTime();
            // // data.organizer = data.organizer.replace(/\s+/g, ' ').trim();
            // data.location = data.location.replace(/\s+/g, ' ').trim();
            //
            // setAppLoader(false);
            // setAppLoader(true);
            // await dispatch(boardcastNotification(data)).then(res => {
            //   setAppLoader(false);
            //   setToDefaultValue();
            //   if (res) {
            //     Keyboard.dismiss();
            //     setSuccesMsgFlag(true);
            //     setSuccesMsg(res);
            //     setTimeout(() => {
            //       setSuccesMsgFlag(false);
            //     }, 3000);
            //   }
            // });
            // setAppLoader(false);

        }
      }
    });
  };

  const _setIsShowDatePicker = value => {
    setIsShowDatePicker(value);
  };
  const _setDateForDatePicker = key => {
    setDateForDatePicker(userdata[key]);
    setCurrentKey(key);
  };
  const _setDateFromKey = (value, timeFlag = true) => {
    _setIsShowDatePicker(false);
    if (currentKey === 'fromDate' && timeFlag && isANDROID) {
      setFromDateFlag(1);
    } else if (currentKey === 'toDate' && timeFlag && isANDROID) {
      setToDateFlag(1);
    }
    setUserData({...userdata, [currentKey]: value});
  };

  return (
    <View style={style.mainView}>
      {isShowDatePicker && (
        <DatePickerModel
          _setIsShowDatePicker={_setIsShowDatePicker}
          dateForDatePicker={dateForDatePicker}
          isShow={isShowDatePicker}
          _setDateFromKey={_setDateFromKey}
          mode={'datetime'}
        />
      )}

      <ListHeader
        img={require('../../assets/images/Event.png')}
        title={'Event'}
        onPress={() => {
          openItemIndex == 'Event' ? _setOpenItemIndex('', 0) : _setOpenItemIndex('Event', index);
        }}
        selected={openItemIndex === 'Event'}
        color={color.lightOrange}
      />
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
        <LabelInputText
            label={'Organizer'}
            containerStyle={{marginTop: hp(1)}}
            onChangeText={text => {
              if (text.length < 256) {
                setUserData({...userdata, organizer: text});
                setInvalidOrganizerLength(false);
              } else {
                setUserData({...userdata, organizer: text.substring(0, 255)});
                setInvalidOrganizerLength(true);
              }
            }}
            multiline={true}
            value={userdata.organizer}
        />
        {invalidOrganizerLength && (
            <CustomText style={style.invalidData}>
              {'Maximum charater allowed upto 255 character only'}
            </CustomText>
        )}

        {appLoader && (
            <Modal transparent={true} style={{flex: 1}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={colors.blue} animating={true} />
              </View>
            </Modal>
        )}

        <View>
          <TextInput
              keyboardType="number-pad"
              style={{
                width: wp(80),
                backgroundColor: 'transparent',
                padding: 10,
                borderWidth: 1,
                borderColor: color.gray,
                paddingHorizontal: 30,
                marginTop:hp(3)
              }}
              maxLength={10}
              placeholder="Event Start Date DD/MM/YYYY"
              onChangeText={(e) => dateTimeInputChangeHandler(e)}
              value={userdata.fromDate}
          />
          <TextInput
              keyboardType="number-pad"
              style={{
                width: wp(80),
                backgroundColor: 'transparent',
                padding: 10,
                borderWidth: 1,
                borderColor: color.gray,
                paddingHorizontal: 30,
                marginTop:hp(3)
              }}
              maxLength={10}
              placeholder="Event End Date DD/MM/YYYY"
              onChangeText={(e) => dateTimeInputChangeHandlerForEndDate(e)}
              value={userdata.toDate}
          />
          {/*<LableInputTextWithIcon*/}
          {/*    label={'From Date'}*/}
          {/*    onPress={() => {*/}
          {/*      _setDateForDatePicker('fromDate');*/}
          {/*      setIsShowDatePicker(true);*/}
          {/*      isIOS && setFromDateFlag(1);*/}
          {/*    }}*/}
          {/*    value={userdata && fromDateFlag !== 0 && userdata.fromDate.toLocaleString()}*/}
          {/*    // Icon={Fontisto}*/}
          {/*    iconName={calender_icon}*/}
          {/*    editable={false}*/}
          {/*/>*/}
          {/*<LableInputTextWithIcon*/}
          {/*    label={'To Date'}*/}
          {/*    onPress={() => {*/}
          {/*      // setToDateFlag(1);*/}

          {/*      _setDateForDatePicker('toDate');*/}
          {/*      setIsShowDatePicker(true);*/}
          {/*      isIOS && setToDateFlag(1);*/}
          {/*    }}*/}
          {/*    value={userdata && toDateFlag !== 0 && userdata.toDate.toLocaleString()}*/}
          {/*    // Icon={Fontisto}*/}
          {/*    iconName={calender_icon}*/}
          {/*    editable={false}*/}
          {/*/>*/}
        </View>
        <LableInputTextWithIcon
            label={'Location'}
            value={userdata && userdata.location}
            // Icon={Entypo}
            iconName={location_pin_icon}
            editable={true}
            onChangeText={text => {
              if (text.length < 256) {
                setUserData({...userdata, location: text});
                setInvalidLocationLength(false);
              } else {
                setUserData({...userdata, location: text.substring(0, 255)});
                setInvalidLocationLength(true);
              }
            }}
            iconSize={wp(7)}
        />
        {invalidLocationLength && (
            <CustomText style={style.invalidData}>
              {'Maximum charater allowed upto 255 character only'}
            </CustomText>
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
      {/*{openItemIndex == 'Event' && (*/}
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
      {/*    <LabelInputText*/}
      {/*      label={'Organizer'}*/}
      {/*      containerStyle={{marginTop: hp(1)}}*/}
      {/*      onChangeText={text => {*/}
      {/*        if (text.length < 256) {*/}
      {/*          setUserData({...userdata, organizer: text});*/}
      {/*          setInvalidOrganizerLength(false);*/}
      {/*        } else {*/}
      {/*          setUserData({...userdata, organizer: text.substring(0, 255)});*/}
      {/*          setInvalidOrganizerLength(true);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*      multiline={true}*/}
      {/*      value={userdata.organizer}*/}
      {/*    />*/}
      {/*    {invalidOrganizerLength && (*/}
      {/*      <CustomText style={style.invalidData}>*/}
      {/*        {'Maximum charater allowed upto 255 character only'}*/}
      {/*      </CustomText>*/}
      {/*    )}*/}

      {/*    {appLoader && (*/}
      {/*      <Modal transparent={true} style={{flex: 1}}>*/}
      {/*        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
      {/*          <ActivityIndicator size={'large'} color={colors.blue} animating={true} />*/}
      {/*        </View>*/}
      {/*      </Modal>*/}
      {/*    )}*/}

      {/*    <View>*/}
      {/*      <LableInputTextWithIcon*/}
      {/*        label={'From Date'}*/}
      {/*        onPress={() => {*/}
      {/*          _setDateForDatePicker('fromDate');*/}
      {/*          setIsShowDatePicker(true);*/}
      {/*          isIOS && setFromDateFlag(1);*/}
      {/*        }}*/}
      {/*        value={userdata && fromDateFlag !== 0 && userdata.fromDate.toLocaleString()}*/}
      {/*        // Icon={Fontisto}*/}
      {/*        iconName={calender_icon}*/}
      {/*        editable={false}*/}
      {/*      />*/}
      {/*      <LableInputTextWithIcon*/}
      {/*        label={'To Date'}*/}
      {/*        onPress={() => {*/}
      {/*          // setToDateFlag(1);*/}

      {/*          _setDateForDatePicker('toDate');*/}
      {/*          setIsShowDatePicker(true);*/}
      {/*          isIOS && setToDateFlag(1);*/}
      {/*        }}*/}
      {/*        value={userdata && toDateFlag !== 0 && userdata.toDate.toLocaleString()}*/}
      {/*        // Icon={Fontisto}*/}
      {/*        iconName={calender_icon}*/}
      {/*        editable={false}*/}
      {/*      />*/}
      {/*    </View>*/}
      {/*    <LableInputTextWithIcon*/}
      {/*      label={'Location'}*/}
      {/*      value={userdata && userdata.location}*/}
      {/*      // Icon={Entypo}*/}
      {/*      iconName={location_pin_icon}*/}
      {/*      editable={true}*/}
      {/*      onChangeText={text => {*/}
      {/*        if (text.length < 256) {*/}
      {/*          setUserData({...userdata, location: text});*/}
      {/*          setInvalidLocationLength(false);*/}
      {/*        } else {*/}
      {/*          setUserData({...userdata, location: text.substring(0, 255)});*/}
      {/*          setInvalidLocationLength(true);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*      iconSize={wp(7)}*/}
      {/*    />*/}
      {/*    {invalidLocationLength && (*/}
      {/*      <CustomText style={style.invalidData}>*/}
      {/*        {'Maximum charater allowed upto 255 character only'}*/}
      {/*      </CustomText>*/}
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
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    borderWidth: wp(0.3),
    borderColor: color.lightOrange,
    borderRadius: hp(1),
    marginVertical: hp(1),
  },
  headerView: {
    flexDirection: 'row',
    backgroundColor: color.lightOrange,
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
export default EventNotify;
