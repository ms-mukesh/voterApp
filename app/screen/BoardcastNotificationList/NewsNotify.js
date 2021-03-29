import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard, TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NEWS} from '../../helper/constant';
import {
  wp,
  hp,
  normalize,
  isIOS,
  font,
  color,
  color as colors,
} from '../../helper/themeHelper';
import {AppButton, CustomText, LabelInputText, LableInputTextWithIcon} from '../common/';

import DatePickerModel from '../common/DatePickerModel';
import {ListHeader} from './ListHeader';
import {UserTypeCheckBox} from './UserTypeCheckbox';
import {calender_icon, location_pin_icon} from "../../assets/images";
import {broadCastNotification} from "../../redux/actions/broadCastNotificationAction";
import {checkCommonValue, isDefined} from "../functions";

const NewsNotify = props => {
  const {_setOpenItemIndex, openItemIndex, index, limitList} = props;
  const [checkBoxArr, setCheckboxArr] = useState([]);
  const [isShow, setIshow] = useState(false);
  const [dateForDatePicker, setDateForDatePicker] = useState({});
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [selectDate, setDate] = useState(new Date());
  const [appLoader, setAppLoader] = useState(false);
  const [currentKey, setCurrentKey] = useState();
  const [fromDateFlag, setFromDateFlag] = useState(0);
  const [docUrl, setDocUrl] = useState([]);
  const [docs, setDocs] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgData, setImgData] = useState([]);
  const [successMsgflag, setSuccesMsgFlag] = useState(false);
  const [successMsg, setSuccesMsg] = useState('');
  const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
  const [invalidMsgLength, setInvalidMsgLength] = useState(false);
  const [invalidTitleLength, setInvalidTitleLength] = useState(false);
  const [invalidLocationLength, setInvalidLocationLength] = useState(false);
  const [userdata, setUserData] = useState({
    type: [],
    notificationTitle: '',
    msg: '',
    image: '',
    imageUrl: '',
    fromDate: '',
    docUrl: '',
    location: '',
    typeName: NEWS,
  });
  const dispatch = useDispatch();
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
  const setToDefaultValue = () => {
    setUserData({
      type: [],
      notificationTitle: '',
      msg: '',
      image: '',
      imageUrl: '',
      fromDate:'',
      docUrl: '',
      typeName: NEWS,
    });
    setImageUrls([]);
    setDocs([]);
    setDocUrl([]);
    setCheckboxArr([]);
    setImgData([]);
  };
  const _setType = value => {
    setUserData({...userdata, newsType: value});
  };
  const _setIsShowDatePicker = value => {
    setIsShowDatePicker(value);
  };
  const _setDateForDatePicker = key => {
    setDateForDatePicker(userdata[key]);
    setCurrentKey(key);
  };
  const _setDateFromKey = value => {
    _setIsShowDatePicker(false);
    setFromDateFlag(1);
    setDate(value);
    setUserData({...userdata, [currentKey]: value});
    // setUpdateObj({...updateObj, [currentKey]: value});
  };
  const renderRadioButton = value => {
    return (
      <View style={[style.alignRow]}>
        <TouchableOpacity onPress={() => _setType(value)}>
          <View style={{alignItems:'center',borderRadius: hp(1),justifyContent: 'center',height:hp(2),width:hp(2),borderWidth: hp(0.1)}}>
            {userdata && userdata.newsType === value && <View style={{height:hp(1.3),borderRadius:100,width:hp(1.3),backgroundColor:color.themePurple}}/>}
          </View>
        </TouchableOpacity>
        <Text allowFontScaling={false} style={[style.textStyle]}>
          {value}
        </Text>
      </View>
    );
  };
  const sendNotification = data => {
    let arrayImage = [];
    let countTotalUploads = 0;
    checkCommonValue(data.notificationTitle, data.msg).then(async isValid => {
      if (isValid) {
        setInvalidMsgLength(false);
        setInvalidTitleLength(false);
        setInvalidLocationLength(false);
        data.notificationTitle = data.notificationTitle.replace(/\s+/g, ' ').trim();
        // data.msg = data.msg.replace(/\s+/g, ' ').trim();
        if (!isDefined(data.newsType) || data.newsType === '' || data.newsType === null) {
          alert('Please Select a News type ');
        } else if (
          data.fromDate.length<10||
          data.fromDate === ''
        ) {
          alert('Please Select a News Date');
        } else if (
          !isDefined(data.location) ||
          data.location === '' ||
          data.location === null ||
          data.location.trim().length === 0
        ) {
          alert('Please Select Location');
        } else if (!isDefined(data.type) || data.type.length === 0 || data.type === []) {
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
          //     parseInt(docs.length ? docs.length : 0) +
          //     parseInt(imageUrls.length ? imageUrls.length : 0);
          // }
          //
          // if (countTotalUploads > limitList.news) {
          //   alert('You can upload maximum ' + limitList.news + 'attachments');
          //   setToDefaultValue();
          // } else {
          //   setAppLoader(true);
          //   let tempUpdatedDocs = [];
          //   if (docs) {
          //     setAppLoader(true);
          //     for (let i = 0; i < docs.length; i++) {
          //       // setAppLoader(true);
          //       await uploadPdfOnFirebase(docs[i], docUrl[i])
          //         .then(res => {
          //           if (res) {
          //             tempUpdatedDocs.push(res);
          //           }
          //         })
          //         .catch(error => {
          //           console.log(error);
          //         });
          //     }
          //
          //     setUserData({...userdata, docUrl: tempUpdatedDocs});
          //   }
          //   if (imageUrls) {
          //     for (let k = 0; k < imageUrls.length; k++) {
          //       await uploadImageOnFirebase(imageUrls[k])
          //         .then(res => {
          //           if (res) {
          //             arrayImage.push(res);
          //           }
          //
          //           setUserData({...userdata, imageUrl: arrayImage});
          //         })
          //         .catch(error => {
          //           setAppLoader(false);
          //           // setAppLoader(false);
          //         });
          //     }
          //   }
          //   if (arrayImage.length > 0) {
          //     data.imageUrl = arrayImage;
          //   }
          //   if (tempUpdatedDocs.length > 0) {
          //     data.docUrl = tempUpdatedDocs;
          //   }
          //   data.fromDate = new Date(data.fromDate).getTime();
          //   data.location = data.location.replace(/\s+/g, ' ').trim();
          //
          //   if (userdata.newsType === 'GOOD NEWS') data.newsType = 1;
          //   else if (userdata.newsType === 'BAD NEWS') data.newsType = 0;
          //   else data.newsType = 2;
          //   setAppLoader(false);
          //   setAppLoader(true);
          //   await dispatch(boardcastNotification(data)).then(res => {
          //     setAppLoader(false);
          //     setToDefaultValue();
          //     if (res) {
          //       Keyboard.dismiss();
          //       setSuccesMsgFlag(true);
          //       setSuccesMsg(res);
          //       setTimeout(() => {
          //         setSuccesMsgFlag(false);
          //       }, 3000);
          //     }
          //   });
          //   setAppLoader(false);
          // }
        }
      }
    });
  };
  return (
    <View style={style.mainView}>
      {isShowDatePicker && (
        <DatePickerModel
          _setIsShowDatePicker={_setIsShowDatePicker}
          dateForDatePicker={dateForDatePicker}
          isShow={isShowDatePicker}
          _setDateFromKey={_setDateFromKey}
        />
      )}
      <ListHeader
        img={require('../../assets/images/News.png')}
        title={'News'}
        onPress={() => {
          openItemIndex == 'News' ? _setOpenItemIndex('', 0) : _setOpenItemIndex('News', index);
        }}
        selected={openItemIndex === 'News'}
        color={color.lightGreen}
      />
      <View style={{paddingHorizontal: wp(4), paddingVertical: hp(2)}}>
        <View style={{flexDirection: 'row', flex: 1, marginVertical: hp(2)}}>
          {renderRadioButton('GOOD NEWS')}
          {renderRadioButton('BAD NEWS')}
          {renderRadioButton('INFORMATION')}
        </View>
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
        {/*<LabelInputText*/}
        {/*  label={'Title'}*/}
        {/*  onChangeText={text => {*/}
        {/*    setUserData({...userdata, notificationTitle: text});*/}
        {/*  }}*/}
        {/*  value={userdata.notificationTitle}*/}
        {/*/>*/}
        {/*<LabelInputText*/}
        {/*  label={'Message'}*/}
        {/*  onChangeText={text => {*/}
        {/*    setUserData({...userdata, msg: text});*/}
        {/*  }}*/}
        {/*  value={userdata.msg}*/}
        {/*  multiline={true}*/}
        {/*  containerStyle={{marginTop: hp(1)}}*/}
        {/*/>*/}
        {appLoader && (
            <Modal transparent={true} style={{flex: 1}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={colors.blue} animating={true} />
              </View>
            </Modal>
        )}

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
            placeholder="News Date DD/MM/YYYY"
            onChangeText={(e) => dateTimeInputChangeHandler(e)}
            value={userdata.fromDate}
        />
        <LableInputTextWithIcon
            label={'Location'}
            value={userdata && userdata.location}
            // Icon={Entypo}
            iconName={location_pin_icon}
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
            multiline={true}
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

    </View>
  );
};

const style = StyleSheet.create({
  textStyle: {
    // fontFamily: font.robotoRegular,
    color: color.black,
    fontSize: normalize(13),
    marginHorizontal: wp(1),
  },
  mainView: {
    flex: 1,
    borderWidth: wp(0.3),
    borderColor: color.lightGreen,
    borderRadius: hp(1),
    marginVertical: hp(1),
  },
  alignRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  invalidData: {marginTop: hp(0.7), color: color.red},
});
export default NewsNotify;
