import React, {useEffect, useState, useRef} from 'react';
import {color, font, hp, isANDROID, isIOS, normalize, wp} from '../../helper/themeHelper';
import {
    StyleSheet,
    Alert,
    View,
    Text,
    TextInput,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Image,
    AppState,
    BackHandler,
    SafeAreaView
} from 'react-native';

import {Background, InitialHeader, Loading, AnimatedTitle, CustomText} from '../common';
import {connect, useSelector} from 'react-redux';
import {validateAdhaarNo, validateEmail, checkNamesIsEmpty} from '../../helper/validation';
// import {fetchDataForEdit, updateUserProfile, setUserDetails} from '../../actions/UserAction';
import {FloatingLabel} from '../common';
// import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import Foundation from 'react-native-vector-icons/Foundation';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePickerModel from '../common/DatePickerModelForEdit';
import AutoCompleteModal from '../common/AutoCompleteBox';
import {useSafeArea} from 'react-native-safe-area-context';
import {CommonActions} from '@react-navigation/native';
// import ImagePicker from 'react-native-image-picker';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import {isDefined, uploadImageOnFirebase} from '../functions';
import {LOADING} from "../../redux/types";
import {useDispatch} from 'react-redux';
import _ from 'lodash';

const defaultUserMaleImage = require('../../assets/images/user_male.png');
const defaultUserFemaleImage = require('../../assets/images/user_female.png');
const cameraImage = require('../../assets/images/camera.png');
import {setLoaderStatus} from '../../redux/actions/dashboardAction'
import {fetchMemberDetail, setUserDetails, updateUserProfile} from "../../redux/actions/userActions";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import {uploadImageOnFirebase} from "../../helper/firebaseUploadFunctions";
import {back_arrow_icon} from "../../assets/images";

const EditProfile = props => {
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const insets = useSafeArea();
    const [User, setUser] = useState({});
    const [searchData,setSearchData] = useState([])
    const [dateForDatePicker, setDateForDatePicker] = useState({});
    const [isShowDatePicker, setIsShowDatePicker] = useState(false);
    const [currentKey, setCurrentKey] = useState();
    const [setValues, setSelectedValues] = useState('');
    const [isAutoCompleteModel, setIsAutoCompleteModel] = useState(false);
    const [selectField, setSelectedField] = useState('');
    const [userName, setUserName] = useState();
    const [updateObj, setUpdateObj] = useState({MemberName: {}});
    const [appLoader, setAppLoader] = useState(false);
    const [scrollY, setscrollY] = useState(new Animated.Value(0));
    const [backArrowFlag, setBackArrowFlag] = useState(true);
    // const userDetails = useSelector(state => state.user);
    const userDetails = useSelector(state => state.user.userDetail);
    const dispatch = useDispatch();
    let userReduxObj = userDetails;
    console.log("data--",User)
    const textInputRefForOfficeCity = useRef(null);
    const textInputRef = useRef(null);
    const [isUserDobChanged,setIsDobChanged] = useState(false);
    // const [userDob,setUserDob] = useState(User?.DOB === '-'?new Date().getTime:User?.DOB??new Date().getTime)

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
        setUser({...User,DOB:output.join('').substr(0, 14) })
    };
    useEffect(() => {
        setBackArrowFlag(true);
        dispatch(fetchMemberDetail()).then(async (res)=>{
            console.log("res--",res)
            if(res){
                await setUser(res?.UserData?.Data[0])
                await setSearchData(res?.SearchData)
            }
        })
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, []);

    useEffect(() => {
        if (User && User.Name) {
            let temp = User.Name.split(' ');
            setUserName({
                FirstName: temp[0],
                MiddleName: temp[1],
                LastName: temp[2],
            });
        }
    }, [User && User.Name]);

    const _setIsAutoCompleteModel = value => {
        setIsAutoCompleteModel(value);
    };

    const _setValuesForAutoCompelete = (Value, keyName, Label) => {
        setSelectedValues(Value);
        _setCurrentKey(keyName);
        setSelectedField(Label);
        setIsAutoCompleteModel(true);
        _setCurrentKey(keyName);
    };
    const handleBackPress = () => {
        goBack();
        return true;
    };
    const getMemberPhoneNumber = () => {
        let tempPhoneNumber = '';
        // if (
        //     typeof searchData.CountryCode !== 'undefined' &&
        //     searchData.CountryCode &&
        //     typeof User.homeCountry !== 'undefined' &&
        //     User.homeCountry !== '-' &&
        //     User.homeCountry !== ''
        // ) {
        //     tempPhoneNumber = tempPhoneNumber + searchData.CountryCode[User.homeCountry.toUpperCase()];
        // }

        if (
            typeof User.Mobile !== 'undefined' &&
            User.Mobile &&
            User.Mobile !== null &&
            User.Mobile !== '-'
        ) {
            tempPhoneNumber = tempPhoneNumber + ' ' + User.Mobile;
        }
        return tempPhoneNumber;
    };
    const renderFloatTextInput = (
        IconTag,
        IconName,
        Label,
        Value,
        keyName,
        flag,
        keyType,
        isHead,
        extraLabel = null,
        currentCountryORState = null,
        reference = null,
    ) => {
        Value = Value != '-' ? Value : '';
        if (Value && Value.includes('#')) {
            Value = Value.split('#');
            Value = Value[1];
        }
        if (flag) {
            return (
                <View style={[style.textInputContainer]}>
                    <View style={style.iconContainer}>
                        {IconTag !== null &&
                        <IconTag name={IconName} size={hp(2.5)} color={color.blue}/>
                        }
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (!isHead) {
                                // _setValuesForAutoCompelete(Value, keyName, Label);
                                if (
                                    keyName === 'homeCity' ||
                                    keyName === 'homeState' ||
                                    keyName === 'officeCity' ||
                                    keyName === 'officeState'
                                ) {
                                    if (keyName === 'homeCity') {
                                        if (
                                            User.homeState === '-' ||
                                            User.homeState === null ||
                                            User.homeState === '' ||
                                            User.homeState.length === 0
                                        ) {
                                            alert('Please select state first');
                                            Keyboard.dismiss();

                                            return;
                                        } else {
                                            _setValuesForAutoCompelete(Value, keyName, Label);
                                        }
                                    }
                                    if (keyName === 'homeState') {
                                        if (
                                            User.homeCountry === '-' ||
                                            User.homeCountry === null ||
                                            User.homeCountry === '' ||
                                            User.homeCountry.length === 0
                                        ) {
                                            alert('Please select country first');
                                            Keyboard.dismiss();
                                            return;
                                        } else {
                                            _setValuesForAutoCompelete(Value, keyName, Label);
                                        }
                                    }
                                    if (keyName === 'officeCity') {
                                        if (
                                            User.officeState === '-' ||
                                            User.officeState === null ||
                                            User.officeState === '' ||
                                            User.officeState.length === 0
                                        ) {
                                            alert('Please select office state first');
                                            Keyboard.dismiss();
                                            // console.log(reference.current);
                                            // reference !== null && reference.current.blur()
                                            return;
                                        } else {
                                            _setValuesForAutoCompelete(Value, keyName, Label);
                                        }
                                    }
                                    if (keyName === 'officeState') {
                                        if (
                                            User.officeCountry === '-' ||
                                            User.officeCountry === null ||
                                            User.officeCountry === '' ||
                                            User.officeCountry.length === 0
                                        ) {
                                            alert('Please select office country first');
                                            Keyboard.dismiss();
                                        } else {
                                            _setValuesForAutoCompelete(Value, keyName, Label);
                                        }
                                    }
                                } else {
                                    _setValuesForAutoCompelete(Value, keyName, Label);
                                }
                            }
                        }}>
                        <View style={{flex: 1}}>
                            {/*{extraLabel !== null && extraLabel && (*/}
                            {/* */}
                            {/*)}*/}
                            {keyName == 'officeAddress' ? (
                                <TextInput
                                    allowFontScaling={false}
                                    // inputStyle={[style.floatingInputStyle, {maxHeight: 200}]}
                                    style={[style.floatingAddressInputStyle]}
                                    label={Label + '  '}
                                    editable={true}
                                    value={Value}
                                    multiline={true}
                                    placeholder={Label + ' '}
                                    autoCapitalize="characters"
                                    onChangeText={text => {
                                        setUser({...User, [keyName]: isIOS ? text.toUpperCase() : text});
                                        setUpdateObj({...updateObj, [keyName]: text.toUpperCase()});
                                    }}
                                    // onFocus={() => {
                                    //   if (!isHead) {
                                    //     _setValuesForAutoCompelete(Value, keyName, Label);
                                    //   }
                                    // }}
                                    keyboardType={keyType != '' ? keyType : 'default'}
                                    returnKeyType={'done'}
                                />
                            ) : (
                                <FloatingLabel
                                    ref={reference === null ? textInputRef : reference}
                                    inputStyle={style.floatingInputStyle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[style.floatingStyle, {width: keyName === 'ocupation' ? wp(60) : wp(100)}]}
                                    label={Label + '  '}
                                    editable={true}
                                    autoCapitalize="characters"
                                    onFocus={() => {
                                            if (
                                                keyName === 'homeCity' ||
                                                keyName === 'homeState' ||
                                                keyName === 'officeCity' ||
                                                keyName === 'officeState'
                                            ) {
                                                if (keyName === 'homeCity') {
                                                    if (
                                                        User.homeState === '-' ||
                                                        User.homeState === null ||
                                                        User.homeState === '' ||
                                                        User.homeState.length === 0
                                                    ) {
                                                        alert('Please select state first');
                                                        Keyboard.dismiss();

                                                        return;
                                                    } else {
                                                        _setValuesForAutoCompelete(Value, keyName, Label);
                                                    }
                                                }
                                                if (keyName === 'homeState') {
                                                    if (
                                                        User.homeCountry === '-' ||
                                                        User.homeCountry === null ||
                                                        User.homeCountry === '' ||
                                                        User.homeCountry.length === 0
                                                    ) {
                                                        alert('Please select country first');
                                                        Keyboard.dismiss();
                                                        return;
                                                    } else {
                                                        _setValuesForAutoCompelete(Value, keyName, Label);
                                                    }
                                                }
                                                if (keyName === 'officeCity') {
                                                    if (
                                                        User.officeState === '-' ||
                                                        User.officeState === null ||
                                                        User.officeState === '' ||
                                                        User.officeState.length === 0
                                                    ) {
                                                        alert('Please select office state first');
                                                        Keyboard.dismiss();
                                                        // console.log(reference.current);
                                                        // reference !== null && reference.current.blur()
                                                        return;
                                                    } else {
                                                        _setValuesForAutoCompelete(Value, keyName, Label);
                                                    }
                                                }
                                                if (keyName === 'officeState') {
                                                    if (
                                                        User.officeCountry === '-' ||
                                                        User.officeCountry === null ||
                                                        User.officeCountry === '' ||
                                                        User.officeCountry.length === 0
                                                    ) {
                                                        alert('Please select office country first');
                                                        Keyboard.dismiss();
                                                    } else {
                                                        _setValuesForAutoCompelete(Value, keyName, Label);
                                                    }
                                                }
                                            } else {
                                                _setValuesForAutoCompelete(Value, keyName, Label);
                                            }

                                    }}
                                    value={Value}
                                    extraLabel={extraLabel}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        }
        let isEdit = true;
        if (keyName == 'Email') {
            isEdit = false;
        }
        return (
            <View style={[style.textInputContainer, {borderBottomColor: color.gray}]}>
                <View style={style.iconContainer}>
                    {IconTag !== null &&
                    <IconTag name={IconName} size={hp(2.5)} color={color.blue}/>
                    }
                </View>

                <View style={{flex: 1}}>
                    {keyName == 'homeAddress' ? (
                        <TextInput
                            allowFontScaling={false}
                            style={[style.floatingAddressInputStyle]}
                            label={Label + '  '}
                            placeholder={Label + '  '}
                            editable={true}
                            autoCapitalize="characters"
                            value={Value}
                            multiline={true}
                            onChangeText={text => {
                                setUser({...User, [keyName]: isIOS ? text.toUpperCase() : text});
                                setUpdateObj({...updateObj, [keyName]: text.toUpperCase()});
                            }}
                            keyboardType={keyType != '' ? keyType : 'default'}
                            returnKeyType={'done'}
                            extraLabel={extraLabel}
                        />
                    ) : (
                        <FloatingLabel
                            inputStyle={[style.floatingInputStyle]}
                            style={[style.floatingStyle]}
                            label={Label + '  '}
                            editable={!isHead && isEdit}
                            value={Value}
                            autoCapitalize="none"
                            // autoCapitalize="characters"
                            onChangeText={text => {
                                setUser({
                                    ...User,
                                    [keyName]: isIOS ? text.trim().toUpperCase() : text,
                                    // [keyName]: text,
                                    // [keyName]: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
                                });
                                setUpdateObj({
                                    ...updateObj,
                                    [keyName]: text.trim().toUpperCase(),
                                    // [keyName]: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
                                });
                            }}
                            keyboardType={keyType != '' ? keyType : 'default'}
                            returnKeyType={'done'}
                            extraLabel={extraLabel}
                        />
                    )}
                </View>
            </View>
        );
    };

    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null) => {
        return (
            <View
                style={{
                    flex: lable === 'Middle Name' ? 1.2 : 1,
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                }}>
                <FloatingLabel
                    numberOfLines={1}
                    inputStyle={style.floatingInputStyle}
                    style={[style.floatingStyle, {width: wp(30)}]}
                    label={lable + '  '}
                    editable={true}
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onChangeText={text => {
                        setUserName({...userName, [key]: text.toUpperCase()});
                        setUpdateObj({
                            ...updateObj,
                            MemberName: {
                                ...updateObj.MemberName,
                                [key]: text,
                            },
                        });
                    }}
                />
            </View>
        );
    };

    const renderRadioButton = value => {
        return (
            <View style={[style.alignRow, style.center, {flex: 1}]}>
                <TouchableOpacity onPress={() => _setGender(value)}>
                    <View style={style.radioButtonOutterCircle}>
                        {User && User.Gender && User.Gender.toUpperCase() === value.toUpperCase() &&
                        <View style={style.radioButtonInnerCircle}/>
                        }
                    </View>
                </TouchableOpacity>
                <Text allowFontScaling={false} style={[style.textStyle,{marginLeft:wp(1)}]}>
                    {value}
                </Text>
            </View>
        );
    };
    const _setGender = value => {
        setUser({...User, Gender: value});
        setUpdateObj({...updateObj, Gender: value});
    };

    const _setIsShowDatePicker = value => {
        setIsShowDatePicker(value);
    };

    const _setDateForDatePicker = key => {

        if(key==='MarriageDate'){
            setDateForDatePicker(User && User?.MarriageDate!=='-' ?User?.MarriageDate : moment(new Date().toDateString()).format("YYYY-MM-DD"))
        }
        else if(key === 'DOB'){
            setDateForDatePicker(User && User?.DOB!=='-' ?User?.DOB : moment(new Date().toDateString()).format("YYYY-MM-DD"))
        }
        else {
            setDateForDatePicker(User[key]);
        }

        setCurrentKey(key);
    };

    const _setCurrentKey = key => {
        setCurrentKey(key);
    };

    const _setDateFromKey = value => {
        _setIsShowDatePicker(false);
        setUser({...User, [currentKey]: value});
        setUpdateObj({...updateObj, [currentKey]: value});
    };

    const _setSelectedValues = value => {
        setSelectedValues(value);
    };

    const changeValue = () => {
        if (currentKey === 'homeState') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.homeCity = '';
            }
        }

        if (currentKey === 'homeCountry') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.homeCity = '';
                User.homeState = '';
            }
        }

        if (currentKey === 'officeState') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.officeCity = '';
            }
        }

        if (currentKey === 'officeCountry') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.officeCity = '';
                User.officeState = '';
            }
        }

        User[currentKey] = setValues.toUpperCase();
        setUpdateObj({...updateObj, [currentKey]: removeHash(setValues)});
    };

    const addresObj = key => {
        if (updateObj.hasOwnProperty(key)) {
            updateObj.homeAddressObj[key] = updateObj[key].toUpperCase();
            delete updateObj[key];
        }
    };
    const officeObj = key => {
        if (updateObj.hasOwnProperty(key)) {
            updateObj.officeAddressObj[key] = updateObj[key].toUpperCase();
            delete updateObj[key];
        }
    };
    const removeHash = Value => {
        if (Value && Value.includes('#')) {
            Value = Value.split('#');
            Value = Value[0];
        }
        return Value;
    };
    const getCountryCode = () => {
        let countryCode = '-';
        if (
            typeof searchData.CountryCode !== 'undefined' &&
            searchData.CountryCode &&
            typeof User.homeCountry !== 'undefined' &&
            User.homeCountry !== '-' &&
            User.homeCountry !== ''
        ) {
            countryCode = searchData.CountryCode[User.homeCountry.toUpperCase()];
        }
        return countryCode;
    };
    const setObj = () => {
        var str = User.DOB;
        let darr = str.split("/");    // ["25", "09", "2019"]
        var ISOFormat = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0])+1);
        let tempStartDate = ISOFormat.toISOString().toString().substring(0,ISOFormat.toISOString().toString().indexOf('T'))

        updateObj.MemberName.FirstName = userName.FirstName.toUpperCase();
        updateObj.MemberName.MiddleName = userName.MiddleName.toUpperCase();
        updateObj.MemberName.LastName = userName.LastName.toUpperCase();
        updateObj.DOB = tempStartDate;
        updateObj.AadhaarNo = User.AadhaarNo;
        updateObj.BloodGroup = User.BloodGroup.toUpperCase();
        updateObj.Zodiac = User.Zodiac.toUpperCase();
        updateObj.Gender = User.Gender.toUpperCase();
        updateObj.Email = User.Email.toUpperCase();
        updateObj.Mobile = User.Mobile;
        // updateObj.countryCode = getCountryCode();
        updateObj.MaritalStatus = User.MaritalStatuses.toUpperCase();
        updateObj.Studies = User.Studies.toUpperCase();
        updateObj.homeAddressObj = {};
        updateObj.officeAddressObj = {};
    };

    const setNameInAsync = async response => {
        if (User.fatherName && User.fatherName.includes('#')) {
            let fatherName = User.fatherName.split('#');
            let midName = fatherName[1].split(' ');
            userName.MiddleName = midName[0];
        }

        let editName = userName.FirstName + ' ' + userName.MiddleName + ' ' + userName.LastName;
        userReduxObj.memberData[0].FirstName = userName.FirstName;
        userReduxObj.memberData[0].LastName = userName.LastName;
        userReduxObj.memberData[0].ProfileImage = userName.LastName;
        userReduxObj.Role = response.role;
        userReduxObj.Gender = updateObj.Gender.toUpperCase();
        await dispatch(setUserDetails(userReduxObj)).then(res => {});
    };
    const _setSelectedField = value => {};

    const finalObject = async () => {
        // getCountryCode();
        Keyboard.dismiss();
        let updateValueForRedux = {}
        setBackArrowFlag(false);
        if (
            checkNamesIsEmpty(userName.FirstName) ||
            checkNamesIsEmpty(userName.MiddleName)
        ) {
            alert('Please fill up name fields');
            setBackArrowFlag(true);
            return;
        }
        if (User.Email && User.Email.length > 0 && User.Email !== '-') {
            if (User.Email && !validateEmail(User.Email)) {
                alert('Please Fill Proper Email ');
                setBackArrowFlag(true);
                return;
            }
        }

        if (User.AadhaarNo != '-' && User.AadhaarNo.length > 0 && !validateAdhaarNo(User.AadhaarNo)) {
            alert('Please Fill Valid Aadhaar number.');
            setBackArrowFlag(true);
            return;
        }
        setObj();
        addresObj('Address');
        addresObj('City');
        addresObj('homePincode');
        addresObj('State');
        addresObj('Country');
        if (
            updateObj &&
            updateObj.hasOwnProperty('homeAddressObj') &&
            Object.keys(updateObj.homeAddressObj).length == 0
        ) {
            delete updateObj.homeAddressObj;
        }

        if (updateObj.hasOwnProperty('ProfileImage') && updateObj.ProfileImage) {
            dispatch(setLoaderStatus(true));
            await uploadImageOnFirebase(updateObj.ProfileImage, '/UserProfileImages/')
                .then(res => {
                    dispatch(setLoaderStatus(false));

                    if (res) {
                        // setUser({...User, ProfileImage: res});
                        updateValueForRedux = {...updateValueForRedux,profileImage:res}
                        updateObj.ProfileImage = res;
                        dispatch(setLoaderStatus(false));
                    }
                })
                .catch(error => {
                    console.log(error);
                    dispatch(setLoaderStatus(false));
                });
        }
        dispatch(updateUserProfile({userDataObj: updateObj})).then(async (res)=>{
            let editName = updateObj.FirstName + ' ' + updateObj.MiddleName + ' ' + updateObj.LastName;
            updateValueForRedux = {
                ...userDetails,
                ...updateValueForRedux,
                name:userName.FirstName+" " + userName.MiddleName,
                gender:updateObj.Gender
            }
            await dispatch(setUserDetails(updateValueForRedux)).then(upd => {});
            props.navigation.goBack()

        })
    };
    const goBack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Drawer', params: {setfromLogin: true}}],
            })
        );
    };

    const renderHeader = () => {
        return (
            <View style={{  zIndex: 100,
                width:wp(100),
                position: 'absolute',
                backgroundColor: color.creamDarkGray,
                borderBottomWidth: 20,
                borderBottomColor: '#fff',}}>
                <View>
                    <InitialHeader
                        isAnimated={true}
                        scrollY={scrollY}
                        canViewFullScreenImage={true}
                        userGender={
                            userDetails && userDetails.gender && typeof userDetails.gender !== 'undefined'
                                ? userDetails.gender
                                : 'FEMALE'
                        }
                        isUrl={
                            User &&
                            typeof User.ProfileImage !== 'undefined' &&
                            User.ProfileImage !== '-' &&
                            User.ProfileImage !== null &&
                            User.ProfileImage !== ''
                                ? true
                                : false
                        }
                        imgPath={
                            User &&
                            typeof User.ProfileImage !== 'undefined' &&
                            User.ProfileImage !== '-' &&
                            User.ProfileImage !== null &&
                            User.ProfileImage !== ''
                                ? {uri: User.ProfileImage}
                                : userDetails &&
                                userDetails.Gender &&
                                typeof userDetails.Gender !== 'undefined' &&
                                userDetails.Gender === 'MALE'
                                ? defaultUserMaleImage
                                : defaultUserFemaleImage
                        }
                        RightTitle={'Save'}
                        RightPress={() => finalObject()}
                        LeftComponent={() => {
                            if (props.route.params == undefined) {
                                return (
                                    <TouchableOpacity onPress={goBack}>
                                        <Image source={back_arrow_icon} style={{height:wp(3),width:wp(3)}}/>
                                    </TouchableOpacity>
                                );
                            } else {
                                return null;
                            }
                        }}
                    />

                    {/*{renderCameraIcon()}*/}
                </View>
                <AnimatedTitle scrollY={scrollY}>
                    <Text allowFontScaling={false} style={style.fontStyle}>
                        Edit Profile{' '}
                    </Text>
                </AnimatedTitle>
            </View>
        );
    };
    const chooseImage =async () =>{
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: isANDROID?false:true,
                aspect: [4, 3],
                quality: 1,
            });
            console.log("data--",result)
            if (!result.cancelled) {
                setUser({...User, ProfileImage: result.uri});
                setUpdateObj({...updateObj, ProfileImage: result.uri});
            }
        } catch (e) {
            console.log("err--",e)
        }

    }

    const renderCameraIcon = () => {
        const _getIconWidth = scrollY.interpolate({
            inputRange: [0, 100, 200, 300],
            outputRange: [hp(6.5), hp(5.5), hp(4.5), hp(2.5)],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
        const iconRightPosition = scrollY.interpolate({
            inputRange: [0, 100, 200, 300],
            outputRange: [wp(30), wp(34), wp(38), wp(42)],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
        const iconTopPosition = scrollY.interpolate({
            inputRange: [0, 100, 200, 300],
            outputRange: [-hp(5.4), -hp(4.4), -hp(3.4), -hp(2.4)],
            extrapolate: 'clamp',
            useNativeDriver: true,
        });
        return (
            <Animated.View
                style={{
                    right: iconRightPosition,
                    bottom: iconTopPosition,
                    borderRadius: _getIconWidth,
                    backgroundColor: color.lightBlue,
                    height: _getIconWidth,
                    width: _getIconWidth,
                    alignSelf: 'center',
                    position: 'absolute',
                }}>
                <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => {chooseImage()}}>
                    <Animated.Image source={cameraImage} style={{height: '65%', width: '65%'}} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={{flex: 1}}>
            {(isLoading || appLoader) && <Loading isLoading={isLoading} />}
            {isShowDatePicker && (
                <DatePickerModel
                    _setIsShowDatePicker={_setIsShowDatePicker}
                    dateForDatePicker={dateForDatePicker}
                    isShow={isShowDatePicker}
                    _setDateFromKey={_setDateFromKey}
                />
            )}
            {isAutoCompleteModel && (
                <AutoCompleteModal
                    allSearchData={searchData && searchData}
                    _setIsAutoCompleteModel={_setIsAutoCompleteModel}
                    SearchField={setValues}
                    changeValue={changeValue}
                    selectField={selectField}
                    _setSelectedField={_setSelectedField}
                    _setSelectedValues={_setSelectedValues}
                    currentKey={currentKey}
                    selectedValue={User[currentKey]}
                    currentStateForHome={User.homeState}
                    currentStateForOffice={User.officeState}
                    currentCountryForHome={User.homeCountry}
                    currentCountryForOffice={User.officeCountry}
                />
            )}
            <SafeAreaView forceInset={{top: 'never', bottom: 'always'}} style={{flex: 1, backgroundColor: color.white}}>

                    {renderHeader()}
                    <Animated.ScrollView
                        style={{flex: 1, zIndex: 10}}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {contentOffset: {y: scrollY}},
                            },
                        ])}>
                        <View style={{flex: 1, marginHorizontal: wp(5), marginTop: insets.top + hp(32)}}>
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{flex: 1}}
                                enableAutomaticScroll={isIOS}
                                extraScrollHeight={hp(-1)}
                                showsVerticalScrollIndicator={false}>
                                <View style={{flex: 1}}>
                                    <View style={[style.groupView]}>
                                        <View style={[style.innerView]}>
                                            <View
                                                style={{
                                                    ...style.iconContainer,
                                                    marginBottom: 0,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: color.gray,
                                                    paddingVertical: hp(1),
                                                }}>
                                                {/*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*/}
                                            </View>
                                            {renderNameFloatingTextInput(
                                                'First Name',
                                                userName && userName.FirstName,
                                                'FirstName',
                                                true
                                            )}
                                            {renderNameFloatingTextInput(
                                                'Middle Name',
                                                userName && userName.MiddleName,
                                                'MiddleName',
                                                true
                                            )}
                                        </View>
                                        {User && renderFloatTextInput(null, 'email', 'Email', User.Email, 'Email')}
                                        {User &&
                                        renderFloatTextInput(
                                            null,
                                            'mobile1',
                                            'Mobile Number' + ' ',
                                            typeof User.Mobile === 'undefined' ? '' : getMemberPhoneNumber() + '',
                                            'Mobile',
                                            false,
                                            '',
                                            false,
                                            true
                                        )}

                                        <View style={[style.innerView, {alignItems: 'center'}]}>
                                            <View
                                                style={{
                                                    marginHorizontal: wp(2),
                                                }}>
                                                <Image
                                                    source={require('../../assets/images/gender.png')}
                                                    style={{width: wp(2), height: wp(2)}}
                                                />
                                            </View>
                                            <Text allowFontScaling={false} style={[style.textStyle, {flex: 1}]}>
                                                Gender
                                            </Text>
                                            {renderRadioButton('Male')}
                                            {renderRadioButton('Female')}
                                        </View>

                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'user',*/}
                                        {/*    "Father's Name",*/}
                                        {/*    User.fatherName,*/}
                                        {/*    'fatherName',*/}
                                        {/*    true,*/}
                                        {/*    '',*/}
                                        {/*    false*/}
                                        {/*)}*/}

                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'user-female',*/}
                                        {/*    "Mother's Name",*/}
                                        {/*    User.MotherName,*/}
                                        {/*    'MotherName',*/}
                                        {/*    true,*/}
                                        {/*    '',*/}
                                        {/*    false*/}
                                        {/*)}*/}
                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'torsos-all-female',*/}
                                        {/*    "Family's Head Name",*/}
                                        {/*    User.FamilyHeadName,*/}
                                        {/*    'FamilyHeadName',*/}
                                        {/*    true,*/}
                                        {/*    '',*/}
                                        {/*    true,*/}
                                        {/*    true*/}
                                        {/*)}*/}
                                        <View style={{flexDirection: 'row'}}>
                                            <View
                                                style={[
                                                    style.textInputContainer,
                                                    {
                                                        borderBottomColor: color.gray,
                                                        flex: 1,
                                                    },
                                                ]}>
                                                <View style={style.iconContainer}>
                                                    {/*<FontAwesome name={'birthday-cake'} size={hp(2)} color={color.blue} />*/}
                                                </View>

                                                <View style={{flex: 1}}>
                                                    <TextInput
                                                        keyboardType="number-pad"
                                                        style={{
                                                            width: wp(80),
                                                            backgroundColor: 'transparent',
                                                            padding: 10,
                                                            borderBottomWidth: 1,
                                                            borderColor: color.gray,
                                                            paddingHorizontal: 30,
                                                        }}
                                                        maxLength={10}
                                                        placeholder="DOB DD/MM/YYYY"
                                                        onChangeText={(e) => dateTimeInputChangeHandler(e)}
                                                        value={User && User.DOB}
                                                    />
                                                    {/*<TouchableOpacity*/}
                                                    {/*    onPress={() => {*/}
                                                    {/*        _setDateForDatePicker('DOB');*/}
                                                    {/*        setIsShowDatePicker(true);*/}
                                                    {/*    }}*/}
                                                    {/*    style={{flex: 1}}>*/}
                                                    {/*    <FloatingLabel*/}
                                                    {/*        onFocus={() => {*/}
                                                    {/*            _setDateForDatePicker('DOB');*/}
                                                    {/*            setIsShowDatePicker(true);*/}
                                                    {/*            Keyboard.dismiss();*/}
                                                    {/*        }}*/}
                                                    {/*        inputStyle={style.floatingInputStyle}*/}
                                                    {/*        style={style.floatingStyle}*/}
                                                    {/*        label={'DOB' + ' '}*/}
                                                    {/*        value={User && moment(User.DOB).format("YYYY-MM-DD")}*/}
                                                    {/*        editable={isANDROID ? false : true}*/}
                                                    {/*    />*/}
                                                    {/*</TouchableOpacity>*/}
                                                </View>
                                            </View>
                                            <View style={{flex: 1}}>
                                                {User &&
                                                renderFloatTextInput(
                                                    null,
                                                    'graduation',
                                                    'Studies',
                                                    User.Studies,
                                                    'Studies',
                                                    false,
                                                    '',
                                                    false
                                                )}
                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            {console.log("occupation--",User?.Occupations)}
                                            {User &&
                                            renderFloatTextInput(
                                                null,
                                                'work',
                                                'Occupations' + ' ',
                                                User.Occupations,
                                                'Occupations',
                                                true,
                                                '',
                                                false
                                            )}
                                            {User &&
                                            renderFloatTextInput(
                                                null,
                                                'holiday-village',
                                                'Native Place',
                                                User.NativePlace,
                                                'NativePlace',
                                                true,
                                                '',
                                                true
                                            )}
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            {User &&
                                            renderFloatTextInput(
                                                null,
                                                'male-female',
                                                'Marital status',
                                                User.MaritalStatuses,
                                                'MaritalStatuses',
                                                true,
                                                '',
                                                false
                                            )}
                                            {
                                                User?.MaritalStatuses?.toString()?.toLowerCase()==='married' &&
                                                <View style={[style.textInputContainer, {borderBottomColor: color.gray}]}>
                                                    <View style={style.iconContainer}>
                                                        {/*<MaterialIcons name={'date-range'} size={hp(2)} color={color.blue} />*/}
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                _setDateForDatePicker('MarriageDate');
                                                                setIsShowDatePicker(true);
                                                            }}
                                                            style={{flex: 1}}>
                                                            <FloatingLabel
                                                                onFocus={() => {
                                                                    _setDateForDatePicker('MarriageDate');
                                                                    Keyboard.dismiss();
                                                                    setIsShowDatePicker(true);
                                                                }}
                                                                inputStyle={style.floatingInputStyle}
                                                                style={style.floatingStyle}
                                                                label={'Marriage Date' + ' '}
                                                                value={User && User?.MarriageDate!=='-' ?moment(User?.MarriageDate).format("YYYY-MM-DD") : moment(new Date().toDateString()).format("YYYY-MM-DD")}
                                                                editable={isANDROID ? false : true}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }

                                            {
                                                User?.MaritalStatuses?.toString()?.toLowerCase()==='widow' &&
                                                <View style={[style.textInputContainer, {borderBottomColor: color.gray}]}>
                                                    <View style={style.iconContainer}>
                                                        {/*<MaterialIcons name={'date-range'} size={hp(2)} color={color.blue} />*/}
                                                    </View>

                                                    <View style={{flex: 1}}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                _setDateForDatePicker('MarriageDate');
                                                                setIsShowDatePicker(true);
                                                            }}
                                                            style={{flex: 1}}>
                                                            <FloatingLabel
                                                                onFocus={() => {
                                                                    _setDateForDatePicker('MarriageDate');
                                                                    Keyboard.dismiss();
                                                                    setIsShowDatePicker(true);
                                                                }}
                                                                inputStyle={style.floatingInputStyle}
                                                                style={style.floatingStyle}
                                                                label={'Marriage Date' + ' '}
                                                                value={User && User.MarriageDate}
                                                                editable={isANDROID ? false : true}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }

                                        </View>
                                    </View>
                                    {/*<Text allowFontScaling={false} style={style.subfontStyle}>*/}
                                    {/*    Home Details*/}
                                    {/*</Text>*/}

                                    {/*<View style={style.groupView}>*/}
                                    {/*    {User &&*/}
                                    {/*    renderFloatTextInput(*/}
                                    {/*        null,*/}
                                    {/*        'home',*/}
                                    {/*        'Home Address',*/}
                                    {/*        User.homeAddress,*/}
                                    {/*        'homeAddress',*/}
                                    {/*        false,*/}
                                    {/*        '',*/}
                                    {/*        true*/}
                                    {/*    )}*/}

                                    {/*    <View style={{flexDirection: 'row'}}>*/}
                                    {/*        {User &&*/}
                                    {/*        renderFloatTextInput(*/}
                                    {/*            null,*/}
                                    {/*            'map-marked-alt',*/}
                                    {/*            'Country',*/}
                                    {/*            User.Country,*/}
                                    {/*            'Country',*/}
                                    {/*            true,*/}
                                    {/*            '',*/}
                                    {/*            true,*/}
                                    {/*            true*/}
                                    {/*        )}*/}
                                    {/*        {User &&*/}
                                    {/*        renderFloatTextInput(*/}
                                    {/*            null,*/}
                                    {/*            'map',*/}
                                    {/*            'State',*/}
                                    {/*            User.State,*/}
                                    {/*            'State',*/}
                                    {/*            true,*/}
                                    {/*            '',*/}
                                    {/*            true,*/}
                                    {/*            true,*/}
                                    {/*            User.homeCountry*/}
                                    {/*        )}*/}
                                    {/*    </View>*/}
                                    {/*    <View style={{flexDirection: 'row'}}>*/}
                                    {/*        {User &&*/}
                                    {/*        renderFloatTextInput(*/}
                                    {/*            null,*/}
                                    {/*            'home-city-outline',*/}
                                    {/*            'City',*/}
                                    {/*            User.City,*/}
                                    {/*            'City',*/}
                                    {/*            true,*/}

                                    {/*            '',*/}
                                    {/*            true,*/}
                                    {/*            true,*/}
                                    {/*            User.homeState*/}
                                    {/*        )}*/}
                                    {/*        {User &&*/}
                                    {/*        renderFloatTextInput(*/}
                                    {/*            null,*/}
                                    {/*            'map-pin',*/}
                                    {/*            'Pin Code',*/}
                                    {/*            User.homePincode,*/}
                                    {/*            'homePincode',*/}
                                    {/*            '',*/}
                                    {/*            'numeric',*/}
                                    {/*            true*/}
                                    {/*        )}*/}
                                    {/*    </View>*/}
                                    {/*</View>*/}


                                    <Text allowFontScaling={false} style={style.subfontStyle}>
                                        Other Details
                                    </Text>
                                    <View style={style.groupView}>
                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'id-card-o',*/}
                                        {/*    'Aadhaar Number',*/}
                                        {/*    User.AadhaarNo,*/}
                                        {/*    'AadhaarNo',*/}
                                        {/*    '',*/}
                                        {/*    'numeric'*/}
                                        {/*)}*/}

                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'human-male-female',*/}
                                        {/*    'Spouse Name',*/}
                                        {/*    User.SpouseId,*/}
                                        {/*    'SpouseId',*/}
                                        {/*    true*/}
                                        {/*)}*/}
                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'human-male-boy',*/}
                                        {/*    'Father-in-Law',*/}
                                        {/*    User.FatherInLawId,*/}
                                        {/*    'FatherInLawId',*/}
                                        {/*    true*/}
                                        {/*)}*/}
                                        {/*{User &&*/}
                                        {/*renderFloatTextInput(*/}
                                        {/*    null,*/}
                                        {/*    'human-female-boy',*/}
                                        {/*    'Mother-in-Law',*/}
                                        {/*    User.MotherInLawId,*/}
                                        {/*    'MotherInLawId',*/}
                                        {/*    true*/}
                                        {/*)}*/}

                                        <View style={{flexDirection: 'row'}}>
                                            {User &&
                                            renderFloatTextInput(
                                                null,
                                                'blood-drop',
                                                'Blood Group',
                                                User.BloodGroup,
                                                'BloodGroup',
                                                true
                                            )}
                                            {User &&
                                            renderFloatTextInput(
                                                null,
                                                'zodiac-virgo',
                                                'Zodiac',
                                                User.Zodiac,
                                                'Zodiac',
                                                true
                                            )}
                                            <View style={{height: hp(2)}} />
                                        </View>
                                    </View>
                                    {/*<View style={{height: hp(3)}} />*/}
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                    </Animated.ScrollView>

            </SafeAreaView>
        </View>
    );
};

const style = StyleSheet.create({
    textStyle: {
        fontFamily: font.robotoRegular,
        color: color.blue,
        fontSize: normalize(13),
    },
    radioButton: {
        marginHorizontal: wp(2),
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
    },
    noteTextStyle: {
        fontSize: normalize(10),
        color: 'red',
        textAlign: 'center',
    },
    alignRow: {
        flexDirection: 'row',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    editProfileView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArraow: {
        position: 'absolute',
        top: isANDROID ? 5 : 30,
        zIndex: 10,
        margin: hp(1),
        paddingHorizontal: wp(1),
    },
    groupView: {
        backgroundColor: color.creamDarkGray,
        padding: wp(2),
        borderRadius: wp(5),
    },
    iconContainer: {
        marginBottom: isANDROID ? hp(1.5) : hp(1.2),
        marginHorizontal: wp(1),
    },
    floatingStyle: {},
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    floatingAddressInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        fontFamily: font.robotoRegular,
        color: color.black,
        justifyContent: 'center',
        padding: hp(1),
        maxHeight: 200,
        marginHorizontal: wp(1),
    },
    floatingLableStyle: {
        fontFamily: font.robotoRegular,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
        marginHorizontal: wp(1),
        flex: 1,
    },
    fontStyle: {
        color: color.blue,
        fontSize: normalize(17),
        fontFamily: font.robotoBold,
        textAlign: 'center',
        // marginTop: hp(8),
    },
    subfontStyle: {
        fontSize: normalize(14),
        fontFamily: font.robotoBold,
        textAlign: 'center',
        marginLeft: wp(1),
        color: color.blue,
        marginTop: wp(2),
    },
        radioButtonOutterCircle:{alignItems:'center',justifyContent:'center',height:hp(3),width:hp(3),borderRadius:hp(1.5),borderWidth:hp(0.2)},
        radioButtonInnerCircle:{height:hp(1.6),width:hp(1.6),borderRadius:hp(0.8),backgroundColor: color.themePurple},
    validationStart: {position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5)},
});

export default EditProfile
