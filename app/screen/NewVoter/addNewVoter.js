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
    BackHandler, AsyncStorage,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {AppButton, AppHeader, BoothListModel, FloatingLabel, Loading, SelectFamilyModal} from "../common";
import {color, normalize, hp, wp, isANDROID, isIOS} from "../../helper/themeHelper";
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
import {ALIVE_CHECK, IS_OUR_ENFLUENCER_FOR_INSERT, TRUST_FACTOR} from "../../helper/constant";
import {uploadImageOnFirebase} from "../../helper/firebaseUploadFunctions";
import {getAllBoothList, setLoaderStatus} from "../../redux/actions/dashboardAction";
const userDefaultObj = {
    firstName:"",
    lastName:"",
    middleName:"",
    email:"",
    mobile:"",
    gender:"",
    familyId:"",
    age:"",
    isNewFamily:false,
    isAlive:ALIVE_CHECK,
    DOB:new Date(),
    voterId:"",
    influencer:IS_OUR_ENFLUENCER_FOR_INSERT,
    trustFactor:TRUST_FACTOR.ourSupport,
    profileImage:null
}



const AddNewVoter = props => {
    const insets = useSafeArea();
    const [currentBoothIdFoVoters,setCurrentBoothIsForVoter] =useState(1);
    const [User, setUser] = useState({...userDefaultObj});
    const [boothViewFlag,setBoothViewFlag] = useState(false)
    const [isUserProfileChange,setIsUserProfileChange] = useState(false)
    const [dateForDatePicker, setDateForDatePicker] = useState({});
    const [isShowDatePicker, setIsShowDatePicker] = useState(false);
    const [currentKey, setCurrentKey] = useState();
    const [boothList, setBoothList] = useState([]);
    const [datePickerFlag ,setDatePickerDialog] = useState(false)
    const [createNewFamilyFlag,setCreateFamilyFlag] = useState(false)
    const [backArrowFlag, setBackArrowFlag] = useState(true);
    const [familyModalFlag,setFamilyModalFlag] = useState(false);
    const [autoCompleteData,setAutoCompleteData] = useState({})
    const [voterFamilyId,setVoterFamily] = useState("")
    const [isFamilyOptionSelected,setIsFamilyOptionSelected] = useState(false)
    const [familListModelFlag,setFamilyListModelFlag] = useState(false)
    const [familyList,setFamilyList] = useState([])
    const [isAlive,setIsAlive] = useState(true)
    const [genderCheck,setGenderCheck] = useState(true)
    const [influencerCheck,setInfluencerCheck] = useState(true)
    const [isOurVolunteer,setIsOurVolunteer] = useState(true)
    const defaultTrustCheck = {
        ourSupport:false,
        against:false,
        convencable:false,
        doubtFull:false,
        canNotSay:false,
    }
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
        setUser({...User, DOB: value});
    };

    const updateVoterFamilyId = async (value) =>{
        await setVoterFamily(value)
    }
    const closeBoothListModal=()=>{
        setBoothViewFlag(false)
    }
    const updateBoothId = async (value) =>{
        setCurrentBoothIsForVoter(value)
        setBoothViewFlag(false)
    }
    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null) => {
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
    const renderNameFloatingTextInputForSelectionForBooth = (lable, value, key, extraLabel = null) => {
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
                    style={[style.floatingStyle]}
                    label={lable + '  '}
                    editable={true}
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onFocus={()=>{
                        Keyboard.dismiss()
                        setBoothViewFlag(true)
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
                    style={[style.floatingStyle]}
                    label={lable + '  '}
                    editable={true}
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onFocus={()=>{
                        // Keyboard.dismiss()

                        Alert.alert(
                            "Family",
                            "Select Family",
                            [
                                {
                                    text: 'Create new family',
                                    onPress: () => {
                                        setCreateFamilyFlag(true)
                                        props.navigation.navigate('AddNewFamily', {
                                            autoCompleteData: autoCompleteData,
                                            createNewFamilyFlag:createNewFamilyFlag,
                                            updateVoterFamilyId:updateVoterFamilyId
                                        });
                                    },
                                },
                                {
                                    text: 'Select existing family',
                                    onPress: () => {
                                        setCreateFamilyFlag(false)
                                        dispatch(getFamilyWiseMembers()).then(async (res)=>{
                                            if(res){
                                                await setFamilyList(res)
                                                setFamilyListModelFlag(true)
                                            }
                                        })

                                    },
                                },
                            ],
                            {
                                cancelable: true,
                            }
                        );
                    }}
                />
            </View>
        );
    };
    const renderRadioButtonForVolunteer = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(15),alignSelf:'center',color:color.themePurple}}>{title}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{firstValue}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForAlive = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(15),alignSelf:'center',color:color.themePurple}}>{title}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{firstValue}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{secondValue}</Text>
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
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onFocus={()=>{
                        Keyboard.dismiss()
                       setDatePickerDialog(true)
                    }}
                />
            </View>
        );
    };

    const renderRadioButtonForGender = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(15),alignSelf:'center',color:color.themePurple}}>{title}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{firstValue}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableWithoutFeedback onPress={()=>{
                    setGenderCheck(false)}}>

                    <View style={[style.radioButtonOutterCircle,{marginLeft:wp(4)}]}>
                        {!genderCheck &&
                        <View style={style.radioButtonInnerCircle}/>
                        }
                    </View>
                    </TouchableWithoutFeedback>

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForInfluencer = (title,firstValue,secondValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(15),alignSelf:'center',color:color.themePurple}}>{title}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{firstValue}</Text>
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

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{secondValue}</Text>
                </View>
            </View>
        );
    };
    const renderRadioButtonForTrustFactor = (title,firstValue,secondValue,thirdValue,fourthValue,fifthValue) => {
        return (
            <View style={[style.alignRow,  {flex: 1,flexDirection:'column'}]}>
                <Text style={{marginLeft:wp(2),fontSize:normalize(15),alignSelf:'center',color:color.themePurple}}>{title}</Text>
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
                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{firstValue}</Text>
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

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{secondValue}</Text>
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

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{thirdValue}</Text>
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

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{fourthValue}</Text>
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

                    <Text style={{marginLeft:wp(2),fontSize:normalize(15),color:color.themePurple}}>{fifthValue}</Text>
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
           dispatch(getAllBoothList()).then(async (res)=>{
               if(res){
                   await setBoothList(res)
               }
           })
    },[])
    const insertNewVoterToDb = () =>{
        if(User.firstName.length === 0){
             alert("please enter correct first name!")
            return;

        }
        else if(User.middleName.length === 0){
            alert("please enter correct middle name!")
            return;

        }
        else if(!is18orOlder(User.DOB)){
            alert("please select valid age for voter should be 18 or greater than 18");
            return;
        }
        else if(isNaN(User.mobile)){
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
        // else if(User.influencer.toString().length !== 10 ){
        //     alert("plase add correct Voter Id")
        //     return;
        // }
        else {
            let insertVoterObj = {
                "firstName":User.firstName,
                "lastName":User.lastName,
                "middleName":User.middleName,
                "email":User.email,
                "mobile":User.mobile,
                "gender":genderCheck?"MALE":"FEMALE",
                "familyId":voterFamilyId,
                "isNewFamily":createNewFamilyFlag,
                "isAlive":isAlive?1:0,
                "DOB":User.DOB,
                "voterId":User.voterId,
                "influencer":influencerCheck?1:0,
                "trustFactorId":voterTrustFactor,
                "age":User.age,
                "boothId":currentBoothIdFoVoters,
                "ourVolunteer":isOurVolunteer?'1':null
            }
            if(isUserProfileChange){
                // uploadImageOnFirebase(User.profileImage).then((imageUrl)=>{
                //
                // })
                dispatch(setLoaderStatus(true))
                uploadImageOnFirebase(User.profileImage).then((imageUrl)=>{
                    dispatch(setLoaderStatus(false))
                    if(imageUrl){
                        insertVoterObj = {...insertVoterObj,"profileImage":imageUrl}
                        dispatch(insertNewVoter(insertVoterObj)).then((res)=>{
                            if(res){
                                setUser({...userDefaultObj});
                                setVoterFamily("")
                                alert("Added")
                            }
                        })
                    } else {
                        dispatch(insertNewVoter(insertVoterObj)).then((res)=>{
                            if(res){
                                setUser({...userDefaultObj});
                                setVoterFamily("")
                                alert("Added")
                            }
                        })
                    }
                }).catch((err)=>{
                    dispatch(setLoaderStatus(false))
                    dispatch(insertNewVoter(insertVoterObj)).then((res)=>{
                        if(res){
                            setUser({...userDefaultObj});
                            setVoterFamily("")
                            alert("Added")
                        }
                    })
                })
            } else {
                dispatch(insertNewVoter(insertVoterObj)).then((res)=>{
                    if(res){
                        setUser({...userDefaultObj});
                        setVoterFamily("")
                        alert("Added")
                    }
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
            await setIsUserProfileChange(true)
        }
    }

    return (
        <View style={{flex: 1, }}>
            <AppHeader
                title={'Add New Voter'}
                onMenuPress={() => {
                    props.navigation.openDrawer();
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            {boothViewFlag &&
            <BoothListModel showNewBoothButton={false} closeFamilyModal={closeBoothListModal} updateVoterFamilyId={updateBoothId} familyList={boothList}/>}
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
                    <TouchableOpacity onPress={()=>{
                        openImagePicker()
                    }}>
                    <View style={{height:hp(20),alignItems:'center',justifyContent:'center',marginTop:hp(2)}}>
                        <Image resizeMode={'cover'} source={User.profileImage!==null?{uri:User.profileImage}:userImage} style={{height:hp(20),width:hp(20),borderRadius:hp(10)}}/>
                    </View>
                    </TouchableOpacity>
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
                            {renderNameFloatingTextInput(
                                'HUSBAND/FATHER NAME',
                                User.middleName,
                                'middleName',
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
                            {User && renderNameFloatingTextForDob( 'DOB', User.DOB, "DOB", true)}
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
                            {User && renderNameFloatingTextInput( 'MOBILE', User.mobile, "mobile", true)}
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
                            {User && renderNameFloatingTextInput( 'AGE', User.age, "age", true)}
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
                            { renderNameFloatingTextInputForSelection( 'SELECT FAMILY', voterFamilyId.toString(), "familyId", true,)}
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
                            { renderNameFloatingTextInputForSelectionForBooth( 'SELECT BOOTH', currentBoothIdFoVoters.toString(), "boothId", true,)}
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
                            {User && renderNameFloatingTextInput( 'VOTER ID', User.voterId, "voterId", true)}
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
                            { renderRadioButtonForVolunteer("OUR VOLUNTEER","YES","NO")}
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
                            { renderRadioButtonForInfluencer("OUR INFLUENCER","YES","NO")}
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
                        title={'Add Voter'}
                        onPress={() => {
                            insertNewVoterToDb()
                        }}
                    />
                    <View style={{height:hp(5)}}/>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
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

export default AddNewVoter;
