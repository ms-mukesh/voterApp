import React,{useState,useRef,useEffect} from 'react';
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
    BackHandler, AsyncStorage, Platform,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {AppButton, AppHeader, FloatingLabel, GoBackHeader, Loading, SelectFamilyModal} from "../common";
import {color, normalize, hp, wp, isANDROID, isIOS, IsIOSOS, IsAndroidOS} from "../../helper/themeHelper";
import {useSafeArea} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

import _ from 'lodash';
import SafeAreaView from "react-native-safe-area-view";
import userImage from '../../assets/images/user_male.png'
import {EventRegister} from "react-native-event-listeners";
import {getAutoCompleteData, getFamilyWiseMembers, insertNewVoter} from "../../redux/actions/userActions";
import {FamilyListModel} from '../common/'
import {is18orOlder, isAlpha, isNumeric, validateEmail} from "../../helper/validation";
import DatePickerModel from "../common/DatePickerModelForEdit";
import {ADMIN, ALIVE_CHECK, IS_OUR_ENFLUENCER_FOR_INSERT, TRUST_FACTOR} from "../../helper/constant";
import moment from "moment";
import {cross_black_icon} from "../../assets/images";
import {getBoothWiseVoterList, insertVoterDataChangeRequest} from "../../redux/actions/volunteerAction";
import {uploadImageOnFirebase} from "../../helper/firebaseUploadFunctions";
import {getVoterList, setLoaderStatus} from "../../redux/actions/dashboardAction";

const VoterDetail = props => {
    const insets = useSafeArea();
    const {data} = props.route.params;

    const userDetails = useSelector(state => state.user.userDetail);

    const userDefaultObj = {
        profileImage:data?.ProfileImage??"",
        firstName:data?.FirstName??"",
        lastName:data?.MiddleName??"",
        middleName:"",
        age:data?.Age??"",
        email:data?.Email??"",
        mobile:data?.Mobile??"",
        gender:data?.Gender??"",
        familyId:"",
        isNewFamily:false,
        isAlive:ALIVE_CHECK,
        DOB:new Date(),
        voterId:data?.VoterVotingId.toString()??"",
        influencer:data?.IsInfluencer??"",
        trustFactor:data?.TrustFactor?.TrustFactorId??"",
        trustName:data?.TrustFactor?.Name??"",
        volunteer:data?.IsOurVolunteer??"",
    }
    const [isDobChange,setIsDobChange] = useState(false);
    const [User, setUser] = useState({...userDefaultObj});
    const [dateForDatePicker, setDateForDatePicker] = useState({});
    const [isShowDatePicker, setIsShowDatePicker] = useState(false);
    const [currentKey, setCurrentKey] = useState();
    const [setValues, setSelectedValues] = useState('');
    const [isAutoCompleteModel, setIsAutoCompleteModel] = useState(false);
    const [selectField, setSelectedField] = useState('');
    const [userName, setUserName] = useState();
    const [updateObj, setUpdateObj] = useState({MemberName: {}});
    const [appLoader, setAppLoader] = useState(false);
    const [datePickerFlag ,setDatePickerDialog] = useState(false)
    const [scrollY, setscrollY] = useState(new Animated.Value(0));
    const [createNewFamilyFlag,setCreateFamilyFlag] = useState(false)
    const [backArrowFlag, setBackArrowFlag] = useState(true);
    const [familyModalFlag,setFamilyModalFlag] = useState(false);
    const [autoCompleteData,setAutoCompleteData] = useState({})
    const [voterFamilyId,setVoterFamily] = useState(data?.FamilyMaster?.FamilyId??"")
    const [isFamilyOptionSelected,setIsFamilyOptionSelected] = useState(false)
    const [familListModelFlag,setFamilyListModelFlag] = useState(false)
    const [familyList,setFamilyList] = useState([])
    const [isAlive,setIsAlive] = useState(true)
    const [genderCheck,setGenderCheck] = useState(User?.gender.toLowerCase()==="female"?false:true??true)
    const [influencerCheck,setInfluencerCheck] = useState(User?.influencer.toString()==="1"?true:false??false)
    const [isUserProfileChange ,setISProfileImage] = useState(false)
    const [isOurVolunteer,setIsOurVolunteer] = useState(User?.volunteer==='1'?true:false)
    let defaultTrustCheck = {
        ourSupport:false,
        against:false,
        convencable:false,
        doubtFull:false,
        canNotSay:false,
    }
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need Gallary permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(()=>{
       if(User?.trustFactor!=="" && User?.trustName!==""){
           if(User?.trustName==="SUPPORT"){
               defaultTrustCheck = {
                   ...defaultTrustCheck,
                   ourSupport:true
               }
           } else if(User?.trustName==="AGAINST"){
               defaultTrustCheck = {
                   ...defaultTrustCheck,
                   against:true
               }
           }else if(User?.trustName==="COVENCIABLE"){
               defaultTrustCheck = {
                   ...defaultTrustCheck,
                   convencable:true
               }
           }else if(User?.trustName==="DOUBT"){
               defaultTrustCheck = {
                   ...defaultTrustCheck,
                   doubtFull:true
               }
           }else if(User?.trustName==="UNPREDICTABLE"){
               defaultTrustCheck = {
                   ...defaultTrustCheck,
                   canNotSay:true
               }
           }
           setTrustFactorCheck(defaultTrustCheck)

       }
    },[])
    const [trustFactorCheck,setTrustFactorCheck] = useState({
        ourSupport:true,
        against:false,
        convencable:false,
        doubtFull:false,
        canNotSay:false,
    })
    const [voterTrustFactor,setVoterTrustFactor] = useState(TRUST_FACTOR.ourSupport)
    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);

    const _setIsShowDatePicker = value => {
        setDatePickerDialog(value);
    };
    const _setDateForDatePicker = key => {
        setDateForDatePicker(User[key]);
        setCurrentKey(key);
    };
    const _setDateFromKey = (value, timeFlag = true) => {
        _setIsShowDatePicker(false);
        setIsDobChange(true)
        setUser({...User, DOB: value});
    };

    const updateVoterFamilyId = async (value) =>{
        await setVoterFamily(value)
    }
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
                    style={[style.floatingStyle, {width: wp(80)}]}
                    label={lable + '  '}
                    editable={true}
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onChangeText={text => {
                        setUser({...User, [key]: isIOS?text.toUpperCase():text});
                    }}
                />
            </View>
        );
    };
    const renderNameFloatingTextInputForSelection = (lable, value, key, extraLabel = null) => {
        return (
            <View
                style={{
                    flex:  1,
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
                    onFocus={()=>{
                        Keyboard.dismiss()
                        setCreateFamilyFlag(false)
                        dispatch(getFamilyWiseMembers()).then(async (res)=>{
                            if(res){
                                await setFamilyList(res)
                                setFamilyListModelFlag(true)
                            }
                        })
                        // Alert.alert(
                        //     "Family",
                        //     "Select Family",
                        //     [
                        //         {
                        //             text: 'Create new family',
                        //             onPress: () => {
                        //                 setCreateFamilyFlag(true)
                        //                 props.navigation.navigate('AddNewFamily', {
                        //                     autoCompleteData: autoCompleteData,
                        //                     createNewFamilyFlag:createNewFamilyFlag,
                        //                     updateVoterFamilyId:updateVoterFamilyId
                        //                 });
                        //             },
                        //         },
                        //         {
                        //             text: 'Select existing family',
                        //             onPress: () => {
                        //                 setCreateFamilyFlag(false)
                        //                 dispatch(getFamilyWiseMembers()).then(async (res)=>{
                        //                     if(res){
                        //                         await setFamilyList(res)
                        //                         setFamilyListModelFlag(true)
                        //                     }
                        //                 })
                        //
                        //             },
                        //         },
                        //     ],
                        //     {
                        //         cancelable: true,
                        //     }
                        // );
                    }}
                />
            </View>
        );
    };
    const renderRadioButtonForAlive = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(12),alignSelf:'center',color:color.themePurple}}>{title}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setIsAlive(true)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {isAlive &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setIsAlive(false)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(4)}]}>
                            {!isAlive &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderNameFloatingTextForDob = (lable, value, key, extraLabel = null) => {
        return (
            <View
                style={{
                    flex:  1,
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
                    value={isDobChange && value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onFocus={()=>{
                        Keyboard.dismiss()
                        setDatePickerDialog(true)
                    }}
                />
                {isDobChange &&
                <TouchableOpacity
                    style={{height: hp(2), width: hp(2), position: 'absolute', marginTop: hp(3), alignSelf: 'flex-end'}}
                    onPress={() => {
                        setIsDobChange(false)
                    }}>
                    <Image source={cross_black_icon} style={{height: hp(2), width: hp(2),}}/>
                </TouchableOpacity>
                }
            </View>
        );
    };

    const renderRadioButtonForGender = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(12),alignSelf:'center',color:color.themePurple}}>{title}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setGenderCheck(true)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {genderCheck &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setGenderCheck(false)}}>

                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {!genderCheck &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForInfluencer = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(12),alignSelf:'center',color:color.themePurple}}>{title}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setInfluencerCheck(true)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {influencerCheck &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setInfluencerCheck(false)}}>

                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(4)}]}>
                            {!influencerCheck &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForTrustFactor = (title,firstValue,secondValue,thirdValue,fourthValue,fifthValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1,flexDirection:'column'}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(12),alignSelf:'center',color:color.themePurple}}>{title}</Text>
                <View style={style.trustFactorRow}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setVoterTrustFactor(TRUST_FACTOR.ourSupport)
                        setTrustFactorCheck({...defaultTrustCheck,ourSupport:true})
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {trustFactorCheck.ourSupport &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={style.trustFactorRow}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setVoterTrustFactor(TRUST_FACTOR.against)
                        setTrustFactorCheck({...defaultTrustCheck,against:true})
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {trustFactorCheck.against &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{secondValue}</Text>
                </View>
                <View style={style.trustFactorRow}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setVoterTrustFactor(TRUST_FACTOR.convencable)
                        setTrustFactorCheck({...defaultTrustCheck,convencable:true})
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {trustFactorCheck.convencable &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{thirdValue}</Text>
                </View>
                <View style={style.trustFactorRow}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setVoterTrustFactor(TRUST_FACTOR.doubtFull)
                        setTrustFactorCheck({...defaultTrustCheck,doubtFull:true})
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {trustFactorCheck.doubtFull &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{fourthValue}</Text>
                </View>
                <View style={style.trustFactorRow}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setVoterTrustFactor(TRUST_FACTOR.canNotSay)
                        setTrustFactorCheck({...defaultTrustCheck,canNotSay:true})
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {trustFactorCheck.canNotSay &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{fifthValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForVolunteer = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(12),alignSelf:'center',color:color.themePurple}}>{title}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setIsOurVolunteer(true)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(2)}]}>
                            {isOurVolunteer &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setIsOurVolunteer(false)
                    }}>
                        <View style={[style.radioButtonOutterCircle,{marginLeft:wp(4)}]}>
                            {!isOurVolunteer &&
                            <View style={style.radioButtonInnerCircle}/>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{marginLeft:wp(0.5),fontSize:normalize(10),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };

    const closeFamilyModal=()=>{
        setFamilyListModelFlag(false)
    }
    useEffect(()=>{
        dispatch(getAutoCompleteData()).then((res)=>{
            if(res){
                setAutoCompleteData(res)
            }
        })
    },[])
    const insertChangeVoterRequestToDb = () =>{
        if(User.firstName==="" || User.firstName===null || User.firstName.length===0){
            alert("please enter correct first name!")
            return;

        }
        else if(User.lastName==="" || User.lastName===null || User.lastName.length===0){
            alert("please enter correct last name!")
            return;
        }
        else if(User.email.length>0 &&!validateEmail(User.email)){
            alert("please enter correct email address!")
            return;
        }
        else if(isDobChange && !is18orOlder(User.DOB)){
            alert("please select valid age for voter should be 18 or greater than 18");
            return;
        }
        else if(User.mobile.length>0 && isNaN(User.mobile)){
            alert("plase add correct phone number")
            return;
        }
        else if(isNaN(User.age) || parseInt(User.age)<18 || parseInt(User.age)>150){
            alert("plase add correct voter age")
            return;
        }
        else if(voterFamilyId === ""){
            alert("please select family!")
            return;
        }
        if(User.voterId==="" || User.voterId===null || User.voterId.length===0){
            alert("please enter correct Voter Id!")
            return;

        }
        else {
            if(isUserProfileChange){
                dispatch(setLoaderStatus(true))
                uploadImageOnFirebase(User.profileImage).then(async (isImgaeUploaded)=>{
                    dispatch(setLoaderStatus(false))
                  if(isImgaeUploaded){
                      let inserVoterObj = {
                          "role":userDetails?.role??'Volunteer',
                          "profileImage":isImgaeUploaded,
                          "updatingVoterId":data?.VoterId,
                          "firstName":User.firstName,
                          "lastName":User.lastName,
                          "gender":genderCheck?"MALE":"FEMALE",
                          "familyId":voterFamilyId,
                          "voterId":User.voterId,
                          "influencer":influencerCheck?1:0,
                          "trustFactorId":voterTrustFactor,
                          "isAlive":isAlive?1:0,
                          "boothId":data?.BoothId,
                          "dob":null,
                          "email":null,
                          "mobile":null,
                          "age":User.age,
                          "volunteer":isOurVolunteer?'1':null
                      }
                      if(isDobChange){
                          inserVoterObj = {
                              ...inserVoterObj,dob:User.DOB
                          }
                      }
                      if(User.mobile.length>0){
                          inserVoterObj ={
                              ...inserVoterObj,mobile:User.mobile
                          }
                      }
                      if(User.email.length>0){
                          inserVoterObj = {
                              ...inserVoterObj,email:User.email
                          }
                      }
                      dispatch(insertVoterDataChangeRequest(inserVoterObj)).then((res)=>{
                          if(res){
                              if(userDetails?.role === ADMIN){
                                  alert("You changes is saved")
                                  dispatch(getVoterList()).then((res)=>{
                                      props.navigation.dispatch(
                                          CommonActions.reset({
                                              index: 0,
                                              routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                          })
                                      );
                                  }).catch(()=>{
                                      props.navigation.dispatch(
                                          CommonActions.reset({
                                              index: 0,
                                              routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                          })
                                      );
                                  })
                              } else {
                                  alert("You Request is saved")
                                  dispatch(getBoothWiseVoterList({boothId:data?.BoothId})).then((res)=>{
                                      props.navigation.goBack()
                                  }).catch((err)=>{
                                      props.navigation.goBack()
                                  })
                              }
                          } else {
                              alert("Failed to update records")
                          }
                      }).catch((err)=>{
                          alert("Failed to update records")
                      })
                  }  else {
                      alert("Failed to update profile Image")
                  }
                }).catch((err)=>{
                    dispatch(setLoaderStatus(false))
                })
            } else {
                let inserVoterObj = {
                    "role":userDetails?.role??'Volunteer',
                    "updatingVoterId":data?.VoterId,
                    "firstName":User.firstName,
                    "lastName":User.lastName,
                    "gender":genderCheck?"MALE":"FEMALE",
                    "familyId":voterFamilyId,
                    "voterId":User.voterId,
                    "influencer":influencerCheck?1:0,
                    "trustFactorId":voterTrustFactor,
                    "isAlive":isAlive?1:0,
                    "boothId":data?.BoothId,
                    "dob":null,
                    "email":null,
                    "mobile":null,
                    "age":User.age,
                    "volunteer":isOurVolunteer?'1':null
                }
                if(isDobChange){
                    inserVoterObj = {
                        ...inserVoterObj,dob:User.DOB
                    }
                }
                if(User.mobile.length>0){
                    inserVoterObj ={
                        ...inserVoterObj,mobile:User.mobile
                    }
                }
                if(User.email.length>0){
                    inserVoterObj = {
                        ...inserVoterObj,email:User.email
                    }
                }
                dispatch(insertVoterDataChangeRequest(inserVoterObj)).then((res)=>{
                    if(res){
                        if(userDetails?.role === ADMIN){
                            alert("You changes is saved")
                            dispatch(getVoterList()).then((res)=>{
                                props.navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                    })
                                );
                            }).catch(()=>{
                                props.navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                    })
                                );
                            })
                        } else {
                            alert("You Request is saved")
                            dispatch(getBoothWiseVoterList({boothId:data?.BoothId})).then((res)=>{
                                props.navigation.goBack()
                            }).catch((err)=>{
                                props.navigation.goBack()
                            })
                        }
                    }
                    else {
                        alert("Failed to update records")
                    }
                }).catch((err)=>{
                    alert("Failed to update records")
                })
            }
        }
    }
    const openImagePicker = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: isANDROID?false:true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            await setUser({...User,profileImage: result.uri})
            await setISProfileImage(true)
        }
    }

    const editDetailFormForWeb = () =>{
        return(
            <View style={{flex: 1, }}>
                <GoBackHeader
                    title={'back'}
                    onMenuPress={() => {
                        props.navigation.goBack();
                    }}
                />
                {isLoading && <Loading isLoading={isLoading} />}
                {familListModelFlag &&
                <FamilyListModel closeFamilyModal={closeFamilyModal} updateVoterFamilyId={updateVoterFamilyId} familyList={familyList}/>}
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    // contentContainerStyle={{flex: 1}}
                    enableAutomaticScroll={isIOS}
                    scrollEnabled={true}
                    extraScrollHeight={hp(-1)}
                    showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1}}>
                        <View style={{height:hp(20),alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={{height:hp(20),width:hp(20),borderRadius:hp(10)}} onPress={()=>{
                                openImagePicker()
                            }}>
                                {User.profileImage!==null && User.profileImage!=="" ?
                                    <Image resizeMode={'cover'} source={{uri:User?.profileImage}} style={{height:hp(20),width:hp(20),borderRadius:hp(10)}}/>:
                                    <Image resizeMode={'cover'} source={userImage} style={{height:hp(20),width:hp(20),borderRadius:hp(10)}}/>
                                }
                            </TouchableOpacity>
                        </View>
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
                                    'FIRST NAME',
                                    User.firstName,
                                    'firstName',
                                    true
                                )}
                                {renderNameFloatingTextInput(
                                    'LAST NAME',
                                    User.lastName,
                                    'lastName',
                                    true
                                )}
                                {User && renderNameFloatingTextInput( 'EMAIL', User.email, "email", true)}
                            </View>



                        </View>

                        {/*<View style={[style.groupView]}>*/}
                        {/*    <View style={[style.innerView]}>*/}
                        {/*        <View*/}
                        {/*            style={{*/}
                        {/*                ...style.iconContainer,*/}
                        {/*                marginBottom: 0,*/}
                        {/*                borderBottomWidth: 1,*/}
                        {/*                borderBottomColor: color.gray,*/}
                        {/*                paddingVertical: hp(1),*/}
                        {/*            }}>*/}
                        {/*            /!*<EvilIconsIcon name={'user'} size={hp(3.3)} color={color.blue} />*!/*/}
                        {/*        </View>*/}
                        {/*        {User && renderNameFloatingTextForDob( 'DOB', moment(User.DOB).format("DD-MM-YYYY"), "DOB", true)}*/}
                        {/*    </View>*/}



                        {/*</View>*/}

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
                                {User && renderNameFloatingTextInput( 'MOBILE', User?.mobile.toString(), "mobile", true)}
                                {User && renderNameFloatingTextInput( 'AGE', User?.age.toString(), "age", true)}
                                { renderNameFloatingTextInputForSelection( 'SELECT FAMILY', voterFamilyId?.toString(), "familyId", true,)}
                                {User && renderNameFloatingTextInput( 'VOTER ID', User?.voterId.toString(), "voterId", true)}
                            </View>
                        </View>
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
                                { renderRadioButtonForGender("GENDER","MALE","FEMALE")}
                            </View>
                        </View>
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
                                { renderRadioButtonForAlive("ALIVE     ","YES","NO")}
                            </View>
                        </View>
                        {userDetails?.role === ADMIN &&
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
                                {renderRadioButtonForVolunteer("OUR VOLUNTEER", "YES", "NO")}
                            </View>
                        </View>
                        }
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
                                { renderRadioButtonForInfluencer("OUR INFLUNCER","YES","NO")}
                            </View>

                        </View>

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
                                { renderRadioButtonForTrustFactor("TRUST FACTOR","IN OUR SUPPORT","NOT IN OUR SUPPORT","CAN BE COVENCE","DOUBT FULL","CAN NOT SAY")}
                            </View>
                        </View>
                        {datePickerFlag && (
                            <DatePickerModel
                                _setIsShowDatePicker={_setIsShowDatePicker}
                                dateForDatePicker={User.DOB}
                                isShow={datePickerFlag}
                                _setDateFromKey={_setDateFromKey}
                                mode={'date'}
                            />
                        )}
                        <AppButton
                            containerStyle={{marginTop:hp(2),width:wp(30)}}
                            title={userDetails?.role===ADMIN?'SAVE CHANGES':'REQUEST TO CHANGE'}
                            onPress={() => {
                                insertChangeVoterRequestToDb()
                            }}
                        />
                        <View style={{height:hp(5)}}/>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
    const editDetailFormForWebForMobile = () =>{
        return(
            <View style={{flex: 1, }}>
                <GoBackHeader
                    title={'back'}
                    onMenuPress={() => {
                        props.navigation.goBack();
                    }}
                />
                {isLoading && <Loading isLoading={isLoading} />}
                {familListModelFlag &&
                <FamilyListModel closeFamilyModal={closeFamilyModal} updateVoterFamilyId={updateVoterFamilyId} familyList={familyList}/>}
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    // contentContainerStyle={{flex: 1}}
                    enableAutomaticScroll={isIOS}
                    scrollEnabled={true}
                    extraScrollHeight={hp(-1)}
                    showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1}}>
                        <View style={{height:hp(20),alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity style={{height:hp(20),width:hp(20),borderRadius:hp(10)}} onPress={()=>{
                                openImagePicker()
                            }}>
                                {User.profileImage!==null && User.profileImage!=="" ?
                                    <Image resizeMode={'cover'} source={{uri:User?.profileImage}} style={{height:hp(20),width:hp(20),borderRadius:hp(10)}}/>:
                                    <Image resizeMode={'cover'} source={userImage} style={{height:hp(20),width:hp(20),borderRadius:hp(10)}}/>
                                }
                            </TouchableOpacity>
                        </View>
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
                                    'FIRST NAME',
                                    User.firstName,
                                    'firstName',
                                    true
                                )}
                                {renderNameFloatingTextInput(
                                    'LAST NAME',
                                    User.lastName,
                                    'lastName',
                                    true
                                )}
                            </View>



                        </View>
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
                                {User && renderNameFloatingTextInput( 'EMAIL', User.email, "email", true)}
                            </View>



                        </View>


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
                                {User && renderNameFloatingTextInput( 'MOBILE', User?.mobile.toString(), "mobile", true)}
                            </View>
                        </View>
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
                                {User && renderNameFloatingTextInput( 'AGE', User?.age.toString(), "age", true)}
                            </View>
                        </View>
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
                                {User && renderNameFloatingTextInput( 'VOTER ID', User?.voterId.toString(), "voterId", true)}
                            </View>



                        </View>
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
                                { renderRadioButtonForGender("GENDER","MALE","FEMALE")}
                            </View>
                        </View>
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
                                { renderRadioButtonForAlive("ALIVE     ","YES","NO")}
                            </View>
                        </View>
                        {userDetails?.role === ADMIN &&
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
                                {renderRadioButtonForVolunteer("OUR VOLUNTEER", "YES", "NO")}
                            </View>
                        </View>
                        }
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
                                { renderRadioButtonForInfluencer("OUR INFLUNCER","YES","NO")}
                            </View>

                        </View>

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
                                { renderRadioButtonForTrustFactor("TRUST FACTOR","IN OUR SUPPORT","NOT IN OUR SUPPORT","CAN BE COVENCE","DOUBT FULL","CAN NOT SAY")}
                            </View>
                        </View>
                        {datePickerFlag && (
                            <DatePickerModel
                                _setIsShowDatePicker={_setIsShowDatePicker}
                                dateForDatePicker={User.DOB}
                                isShow={datePickerFlag}
                                _setDateFromKey={_setDateFromKey}
                                mode={'date'}
                            />
                        )}
                        <AppButton
                            containerStyle={{marginTop:hp(2)}}
                            title={userDetails?.role===ADMIN?'SAVE CHANGES':'REQUEST TO CHANGE'}
                            onPress={() => {
                                insertChangeVoterRequestToDb()
                            }}
                        />
                        <View style={{height:hp(5)}}/>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }

    return(
        (IsIOSOS || IsAndroidOS)?editDetailFormForWebForMobile():editDetailFormForWeb()
    )
    // (IsIOSOS || IsAndroidOS)?editDetailFormForWebForMobile():editDetailFormForWeb()
};
const style = StyleSheet.create({
    textStyle: {
        // fontFamily: font.robotoRegular,
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
        // fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    floatingAddressInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        // fontFamily: font.robotoRegular,
        color: color.black,
        justifyContent: 'center',
        padding: hp(1),
        maxHeight: 200,
        marginHorizontal: wp(1),
    },
    floatingLableStyle: {
        // fontFamily: font.robotoRegular,
    },
    trustFactorRow:{flexDirection:'row',alignItems:'center',marginTop:hp(1)},
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
        // fontFamily: font.robotoBold,
        textAlign: 'center',
        // marginTop: hp(8),
    },
    subfontStyle: {
        fontSize: normalize(14),
        // fontFamily: font.robotoBold,
        textAlign: 'center',
        marginLeft: wp(1),
        color: color.blue,
        marginTop: wp(2),
    },
    validationStart: {position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5)},
    radioButtonOutterCircle:{alignItems:'center',justifyContent:'center',height:hp(3),width:hp(3),borderRadius:hp(1.5),borderWidth:hp(0.2)},
    radioButtonInnerCircle:{height:hp(1.6),width:hp(1.6),borderRadius:hp(0.8),backgroundColor: color.themePurple}
});

export default VoterDetail;
