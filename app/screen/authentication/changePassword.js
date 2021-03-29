import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image,
    Alert,
    Keyboard,
} from 'react-native';
import {
    Background,
    InitialHeader,
    Loading,
    AnimatedTitle,
    FloatingLabel,
    AppButton,
} from '../common';
import {hp, wp, normalize, color, font, isANDROID} from '../../helper/themeHelper';
import logo from '../../assets/images/user_male.png';
import {AppHeader, CustomText} from '../common';
import {changeUserPassword} from '../../redux/actions/userAuth';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {password_hide, password_show} from "../../assets/images";

const ChangePassword = props => {
    const [isValidPassword, setPasswordState] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isValidCPassword, setCPasswordState] = useState(true);
    const [isValidOldPwd, setOldPasswordState] = useState(true);
    const [CmPw, setCmPw] = useState('');
    const [oldPwd, setOldPwd] = useState('');
    const dispatch = useDispatch();

    const pwdChecker = () => {
        if (oldPwd.length === 0 || !isValidOldPwd) {
            alert('Please enter  valid old Password First');
        } else if (password.length === 0 || !isValidPassword) {
            alert('Please enter  valid new password');
        } else if (CmPw.length === 0 || !isValidCPassword) {
            alert('Please enter  valid password to confirm');
        } else {
            dispatch(changeUserPassword({oldPwd: oldPwd, newPwd: password})).then(res => {
                if (res) {
                    Alert.alert('Navgam', res.data + ' ', [
                        {
                            text: 'OK',
                            onPress: () => {
                                if (res.status) {
                                    props.navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                        })
                                    );
                                }
                            },
                        },
                    ]);
                }
            });
        }
    };
    return (
        <View style={{flex: 1, backgroundColor: color.white}}>
            <AppHeader title={'Change Your Password'} onMenuPress={() => props.navigation.openDrawer()} />
            <Background>
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss();
                    }}
                    style={{flex: 1}}>
                    <View style={{flex: 1, padding: hp(3)}}>
                        <View style={style.mainView}>
                            <View style={{flex: 1}} />
                            <View style={{flex: 0.5}}>
                                <Image source={logo} style={{height: hp(15), width: hp(15), marginTop: hp(-10)}} />
                            </View>
                            <View style={{flex: 0.5}}>
                                <CustomText style={[style.titleText, {marginTop: hp(1)}]}>
                                    Set Your New Password
                                </CustomText>
                            </View>
                            <View style={{flex: 3}}>
                                <KeyboardAwareScrollView
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}>
                                    <View
                                        style={[
                                            style.textInputContainer,
                                            {borderBottomColor: isValidOldPwd ? color.gray : color.red},
                                        ]}>
                                        <View style={style.iconContainer}>
                                            {/*<FontAwesome5*/}
                                            {/*    name={'lock'}*/}
                                            {/*    size={hp(2)}*/}
                                            {/*    color={isValidOldPwd ? color.black : color.red}*/}
                                            {/*/>*/}
                                        </View>
                                        <View style={{flex: 1}}>
                                            <FloatingLabel
                                                inputStyle={style.floatingInputStyle}
                                                style={style.floatingStyle}
                                                secureTextEntry={!showOldPassword}
                                                value={oldPwd}
                                                onBlur={() => {
                                                    if (!oldPwd) {
                                                        setOldPasswordState(false);
                                                    } else {
                                                        setOldPasswordState(true);
                                                    }
                                                }}
                                                onChangeText={text => {
                                                    if (text.length > 0) {
                                                        setOldPasswordState(true);
                                                    } else {
                                                        setOldPasswordState(false);
                                                    }
                                                    setOldPwd(text);
                                                }}
                                                label={'Enter  Old Password' + ' '}
                                            />
                                        </View>
                                        {/*<TouchableOpacity*/}
                                        {/*    style={style.iconContainer}*/}
                                        {/*    // onPress={() => alert(!showPassword)}>*/}
                                        {/*    onPress={() => {*/}
                                        {/*        setShowOldPassword(!showOldPassword)}}*/}
                                        {/*>*/}
                                        {/*    <Image*/}
                                        {/*        source={showOldPassword ? password_show : password_hide}*/}
                                        {/*        style={style.iconStyle}*/}
                                        {/*    />*/}

                                        {/*</TouchableOpacity>*/}
                                    </View>
                                    <View
                                        style={[
                                            style.textInputContainer,
                                            {borderBottomColor: isValidPassword ? color.gray : color.red},
                                        ]}>
                                        <View style={style.iconContainer}>
                                            {/*<Image*/}
                                            {/*    source={showPassword ? password_show : password_hide}*/}
                                            {/*    style={style.iconStyle}*/}
                                            {/*/>*/}
                                        </View>
                                        <View style={{flex: 1}}>
                                            <FloatingLabel
                                                inputStyle={style.floatingInputStyle}
                                                style={style.floatingStyle}
                                                secureTextEntry={!showPassword}
                                                value={password}
                                                onBlur={() => {
                                                    if (!isValidPassword) {
                                                        setPasswordState(false);
                                                    } else {
                                                        setPasswordState(true);
                                                    }
                                                }}
                                                onChangeText={text => {
                                                    if (text.length < 5) {
                                                        setPasswordState(false);
                                                    } else {
                                                        setPasswordState(true);
                                                    }
                                                    setPassword(text);
                                                    if (CmPw.length > 0) {
                                                        if (CmPw !== text) {
                                                            setCPasswordState(false);
                                                        } else {
                                                            setCPasswordState(true);
                                                        }
                                                    }
                                                }}
                                                label={'Enter  New Password' + ' '}
                                            />
                                        </View>
                                        {/*<TouchableOpacity*/}
                                        {/*    style={style.iconContainer}*/}
                                        {/*    onPress={() => setShowPassword(!showPassword)}>*/}
                                        {/*    <Image*/}
                                        {/*        source={showPassword ? password_show : password_hide}*/}
                                        {/*        style={style.iconStyle}*/}
                                        {/*    />*/}
                                        {/*</TouchableOpacity>*/}
                                    </View>

                                    <View
                                        style={[
                                            style.textInputContainer,
                                            {borderBottomColor: isValidCPassword ? color.gray : color.red},
                                        ]}>
                                        <View style={style.iconContainer}>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <FloatingLabel
                                                inputStyle={style.floatingInputStyle}
                                                style={style.floatingStyle}
                                                secureTextEntry={!showCPassword}
                                                value={CmPw}
                                                onChangeText={text => {
                                                    if (text.length === 0 || text !== password) {
                                                        setCPasswordState(false);
                                                    } else {
                                                        setCPasswordState(true);
                                                    }
                                                    setCmPw(text);
                                                }}
                                                label={'Confirm Password' + ' '}
                                            />
                                        </View>
                                        {/*<TouchableOpacity*/}
                                        {/*    style={style.iconContainer}*/}
                                        {/*    onPress={() => {*/}
                                        {/*        setShowCPassword(!showCPassword);*/}
                                        {/*    }}>*/}
                                        {/*    <Image*/}
                                        {/*        source={showCPassword ? password_show : password_hide}*/}
                                        {/*        style={style.iconStyle}*/}
                                        {/*    />*/}
                                        {/*</TouchableOpacity>*/}
                                    </View>
                                    <View style={{marginTop: hp(5)}}>
                                        <AppButton
                                            title={'Set New Password' + ' '}
                                            style={{width: wp(60)}}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                pwdChecker();
                                            }}
                                        />
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Background>
        </View>
    );
};
const style = StyleSheet.create({
    mainView: {
        flex: 1,
        // borderWidth: hp(0.2),
        // borderRadius: hp(1),
        // borderColor: color.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: normalize(18),
        color: color.blue,
        fontFamily: font.robotoRegular,
        alignSelf: 'center',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        marginVertical: hp(0.5),
        width: wp(75),
    },
    iconContainer: {
        marginBottom: isANDROID ? hp(1.5) : hp(1.2),
        marginHorizontal: wp(2),
    },
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(14),
        fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    iconStyle:{
        height:hp(3),
        width:hp(3)
    },
    floatingStyle: {
        color: 'red',
        fontSize: normalize(15),
    },
});

export default ChangePassword;
