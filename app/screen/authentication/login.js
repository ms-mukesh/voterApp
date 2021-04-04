import React, {useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {memberLogin} from "../../redux/actions/userAuth";
import user_logo from '../../assets/images/user_icon.png'
import password_img from '../../assets/images/padlock.png'
import CloseButton from '../common/ClearButton';
import CheckImage from '../../assets/images/check.png'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    AppState,
    Modal,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {color, font, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, isWEB, normalize, wp} from '../../helper/themeHelper';
import {
    AppButton,
    Background,
    FloatingLabel,
    InitialHeader,
    InitialView,
    Loading,
    CustomText,
} from '../common';

import {EventRegister} from 'react-native-event-listeners';
import SplashScreen from 'react-native-splash-screen';
// import {Image} from "react-native-web";
import DefaultMaleIcon from "../../assets/images/user_male.png";
import {setUserDetails} from "../../redux/actions/userActions";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";
import {validateEmail} from "../../helper/validation";
import {TextInput} from "react-native-web";
import {fetchAllTemplates} from "../../redux/actions/eventActions";


const LoginScreen = props => {
    const {
        iconContainer,
        floatingStyle,
        floatingInputStyle,
        textInputContainer,
        checkBoxView,
    } = style;
    const [checkBoxState, setCheckBoxState] = useState(0);
    const temp = useSelector(state => state.user);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [userdata, setUserData] = useState({
        mobile:temp,
        password: '',
        dob: '',
        dobForState: '',
        token: '',
        name: '',
        fromLogin: false,
        memberId: 0,
        deviceId: '',
        email: '',
    });
    const [isValidUserName, setUsernameState] = useState(true);
    const [isValidPwd, setIsValidPwd] = useState(true);
    const clearInputForMobile_ID = () => {
        setUserData({...userdata,email: ''});
    };
    const clearInputForPassword = () => {
        setUserData({...userdata,password: ''});
    };
    useEffect(()=>{
        dispatch(setLoaderStatus(false))
        if(isWEB){
            AsyncStorage.getItem('userLoginDetail').then((res)=>{
                if(res){
                    // alert(JSON.stringify(res))
                    EventRegister.addEventListener('forceLogoutEvent', () => {
                        AsyncStorage.removeItem('userLoginDetail')
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                            })
                        );
                    });
                    dispatch(setUserDetails(JSON.parse(res)));
                    dispatch(fetchAllTemplates()).then((res)=>{
                    })
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Drawer'}],
                        })
                    );
                }
            })
            AsyncStorage.getItem('rememberMeData').then(res => {
                if (res) {
                    var obj = JSON.parse(res);
                    setUserData({...userdata, email: obj.email});
                    setCheckBoxState(1);
                }
            });
        }
    },[])
    const renderLoginView = () => {
        return (
            <View style={{padding: wp(8)}}>
                <CustomText style={style.titleText}>{'Login' + ' '}</CustomText>
                <View style={{marginTop: hp(2)}}>
                    <View
                        style={[
                            textInputContainer,
                            {borderBottomColor: isValidUserName ? color.gray : color.red},
                        ]}>
                        <View style={iconContainer}>
                            <Image style={{height:hp(2.5),width:hp(2.5)}} source={user_logo} />
                            {/*<Image source={user_logo} style={{height:hp(1),width:hp(1)}}/>*/}
                            {/*<AntDesign*/}
                            {/*    name={'user'}*/}
                            {/*    size={hp(2)}*/}
                            {/*    color={isValidUserName ? color.black : color.red}*/}
                            {/*/>*/}
                        </View>

                        <View style={{flex: 1}}>
                            <FloatingLabel
                                inputStyle={floatingInputStyle}
                                style={floatingStyle}
                                value={userdata.email}
                                returnKeyType={'done'}
                                onBlur={() => {
                                    if (
                                        userdata.mobile.length === 0
                                    ) {
                                        setUsernameState(false);
                                    } else {
                                        setUsernameState(true);
                                    }
                                }}
                                onChangeText={text => {
                                    setUserData({...userdata, email: text.toLowerCase()});
                                }}
                                label={'Email Id' + ' '}
                            />
                        </View>
                        {userdata.email.length > 0 && (
                            <CloseButton crossIconOpacity={1} padding={5} clearData={clearInputForMobile_ID} />
                        )}
                    </View>
                </View>
                <View style={{marginTop: hp(2)}}>
                    <View
                        style={[
                            textInputContainer,
                            {borderBottomColor: isValidPwd ? color.gray : color.red},
                        ]}>
                        <View style={iconContainer}>
                            <Image style={{height:hp(2.5),width:hp(2.5)}} source={password_img} />
                        </View>

                        <View style={{flex: 1}}>
                            <FloatingLabel
                                inputStyle={floatingInputStyle}
                                style={floatingStyle}
                                value={userdata.password}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                onBlur={() => {
                                    if (
                                        userdata.password.length === 0
                                    ) {
                                        setIsValidPwd(false);
                                    } else {
                                        setIsValidPwd(true);
                                    }
                                }}
                                onChangeText={text => {
                                    setUserData({...userdata, password: text});
                                }}
                                label={'Password' + ' '}
                            />
                        </View>
                        {userdata.password.length > 0 && (
                            <CloseButton crossIconOpacity={1} padding={5} clearData={clearInputForPassword} />
                        )}
                    </View>
                </View>
                <View
                    style={{
                        marginTop: hp(1),
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => (checkBoxState === 0 ? setCheckBoxState(1) : setCheckBoxState(0))}>
                        <View style={checkBoxView}>
                            {checkBoxState === 1 && <Image source={CheckImage}  style={{height:hp(1.7),width:hp(1.7)}} />}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <CustomText style={{marginLeft: hp(1)}}>{'Remember Me' + ' '}</CustomText>
                    </View>
                </View>
                <AppButton
                    title={'Login' + ' '}
                    onPress={()=>{
                        if (checkBoxState && !isWEB) {
                            AsyncStorage.setItem('rememberMeData', JSON.stringify(userdata));
                        } else {
                            if(!isWEB){
                                AsyncStorage.getItem('rememberMeData').then(res => {
                                    if (res) {
                                        AsyncStorage.removeItem('rememberMeData');
                                    }
                                });
                            }
                        }
                        if(!validateEmail(userdata.email)){
                            alert("please enter a valid email id..!");
                            return;
                        } else if(userdata.password === "" || userdata.password.length===0 || userdata.password=== null){
                            alert("please enter a valid password...!")
                            return;
                        } else {
                            dispatch(memberLogin(userdata)).then((res)=>{if(res){
                                EventRegister.addEventListener('forceLogoutEvent', () => {
                                    AsyncStorage.removeItem('userLoginDetail')
                                    props.navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{name: 'Login'}],
                                        })
                                    );
                                });
                                dispatch(fetchAllTemplates()).then((res)=>{
                                })
                                props.navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Drawer'}],
                                    })
                                );
                            }})
                        }

                    }}
                    containerStyle={{marginTop: hp(5)}}
                />
            </View>
        );
    };
    const renderLoginViewForWeb = () => {
        return (
            <View style={{paddingLeft: wp(30),paddingRight:wp(30)}}>
                <CustomText style={style.titleText}>{'Login' + ' '}</CustomText>
                <View style={{marginTop: hp(2)}}>
                    <View
                        style={[
                            textInputContainer,
                            {borderBottomColor: isValidUserName ? color.gray : color.red},
                        ]}>
                        <View style={iconContainer}>
                            <Image style={{height:hp(2.5),width:hp(2.5)}} source={user_logo} />
                            {/*<Image source={user_logo} style={{height:hp(1),width:hp(1)}}/>*/}
                            {/*<AntDesign*/}
                            {/*    name={'user'}*/}
                            {/*    size={hp(2)}*/}
                            {/*    color={isValidUserName ? color.black : color.red}*/}
                            {/*/>*/}
                        </View>

                        <View style={{flex: 1}}>
                            <TextInput
                                inputStyle={floatingInputStyle}
                                style={floatingInputStyle}
                                placeholder={'Email'}
                                value={userdata.email}
                                returnKeyType={'done'}
                                onBlur={() => {
                                    if (
                                        userdata.mobile.length === 0
                                    ) {
                                        setUsernameState(false);
                                    } else {
                                        setUsernameState(true);
                                    }
                                }}
                                onChangeText={text => {
                                    setUserData({...userdata, email: text});
                                }}
                                label={'Mobile Number / Email Id' + ' '}
                            />
                        </View>
                        {userdata.email.length > 0 && (
                            <CloseButton crossIconOpacity={1} padding={5} clearData={clearInputForMobile_ID} />
                        )}
                    </View>
                </View>
                <View style={{marginTop: hp(2)}}>
                    <View
                        style={[
                            textInputContainer,
                            {borderBottomColor: isValidPwd ? color.gray : color.red},
                        ]}>
                        <View style={iconContainer}>
                            <Image style={{height:hp(2.5),width:hp(2.5)}} source={password_img} />
                        </View>

                        <View style={{flex: 1}}>
                            <TextInput
                                inputStyle={floatingInputStyle}
                                style={floatingInputStyle}
                                placeholder={'Passsword'}
                                value={userdata.password}
                                returnKeyType={'done'}
                                secureTextEntry={true}
                                onBlur={() => {
                                    if (
                                        userdata.password.length === 0
                                    ) {
                                        setIsValidPwd(false);
                                    } else {
                                        setIsValidPwd(true);
                                    }
                                }}
                                onChangeText={text => {
                                    setUserData({...userdata, password: text});
                                }}
                                label={'Password' + ' '}
                            />
                        </View>
                        {userdata.password.length > 0 && (
                            <CloseButton crossIconOpacity={1} padding={5} clearData={clearInputForPassword} />
                        )}
                    </View>
                </View>

                <AppButton
                    title={'Login' + ' '}
                    onPress={()=>{
                        if(!validateEmail(userdata.email)){
                            alert("please enter a valid email id..!");
                            return;
                        } else if(userdata.password === "" || userdata.password.length===0 || userdata.password=== null){
                            alert("please enter a valid password...!")
                            return;
                        } else {
                            dispatch(memberLogin(userdata)).then((res)=>{if(res){
                                props.navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{name: 'Drawer'}],
                                    })
                                );
                            }})
                        }

                    }}
                    containerStyle={{marginTop: hp(5),width:wp(30)}}
                />
            </View>
        );
    };


    return (
        <View style={{flex: 1}}>
            {/*{isLoading && <Loading isLoading={isLoading} />}*/}
            <KeyboardAwareScrollView
                style={{backgroundColor: 'white'}}
                contentContainerStyle={{zIndex: 1}}
                keyboardShouldPersistTaps="handled"
                keyboardVerticalOffset={isANDROID ? -hp(35) : -hp(10)}
                behavior={'position'}
                enabled>
            <InitialHeader showAppIcon={true}/>
            {(isWEB && !IsIOSOS && !IsAndroidOS)?renderLoginViewForWeb():renderLoginView()}
            </KeyboardAwareScrollView>
        </View>

    );
};

const style = StyleSheet.create({
    titleText: {
        fontSize: normalize(18),
        color: color.blue,
        // fontFamily: font.robotoRegular,
        alignSelf: 'center',
        marginTop:hp(8)
    },
    initialLogoStyle: {
        height: hp(35),
        width: hp(35),
    },
    loginLogoStyle: {
        marginTop: hp(0),
        marginBottom: hp(5),
        height: hp(25),
        width: hp(25),
    },
    inputWrapper: {
        height: hp(4),
        flexDirection: 'row',
        justifyContent: 'center',
    },
    otpTextInputStyle: {
        height: wp(10),
        width: wp(10),
        borderColor: color.blue,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp(1.5),
        fontSize: normalize(16),
        textAlign: 'center',
    },
    iconContainer: {
        marginBottom: isANDROID ? hp(1.5) : hp(1.2),
        marginHorizontal: wp(2),
    },
    floatingStyle: {
        color: 'red',
        fontSize: normalize(20),
    },
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(14),
        // fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    floatingLableStyle: {
        // fontFamily: font.robotoRegular,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        marginVertical: hp(0.5),
    },
    checkBoxView: {
        height: hp(2),
        width: hp(2),
        borderWidth: hp(0.05),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    crossButton: {
        alignSelf: 'flex-end',
        padding: hp(2),
        marginTop: hp(3),
    },
});




export default LoginScreen;
