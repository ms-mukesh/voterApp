import React, {useState, useEffect} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
    color,
    font,
    hp,
    isANDROID,
    isIOS, isWEB,
    normalize,
    screenWidth,
    wp,
} from '../../helper/themeHelper';
import _ from 'lodash';
import {StyleSheet, View, Text, Image, Linking, Animated, BackHandler, Modal} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {AnimatedTitle, CustomText, InitialHeader} from '../common/';
import moment from 'moment';
const defaultUserMaleImage = require('../../assets/images/user_male.png');
const defaultUserFemaleImage = require('../../assets/images/user_female.png');
import {useSafeArea} from 'react-native-safe-area-context';
import {ADMIN, VOLUNTEER} from "../../helper/constant";
import {useSelector} from "react-redux";
const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

const DirectoryDetail = props => {
    const insets = useSafeArea();
    const {data} = props.route.params;
    console.log("--data",data)
    const userDetail = useSelector(state => state.user.userDetail);
    const [scrollY] = useState(new Animated.Value(5));
    const [dividerView, setDividerView] = useState(false);
    const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
    const [headerDetailHeight, SetHeaderDetailHeight] = useState(hp(0));
    const handleBackPress = () => {
        props.navigation.goBack();
        return true;
    };
    const returnNameFromFields = (firstName, middleName, lastName) => {
        let tempName = null;
        if (firstName !== '' && firstName !== '-' && firstName !== null) {
            tempName = firstName;
        }
        // if (middleName !== '' && middleName !== '-' && middleName !== null) {
        //     tempName = tempName + ' ' + middleName.replace(/\((.*)\)/, '');
        // }
        // if (lastName !== '' && lastName !== '-' && lastName !== null) {
        //     tempName = tempName + ' ' + lastName.replace(/\((.*)\)/, '');
        // }
        return tempName;
    };

    useEffect(() => {
        ReactNativeHapticFeedback.trigger('impactMedium', options);
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, []);
    const editMemberDetail = () =>{
            if(userDetail.role===ADMIN){
                props.navigation.navigate('VoterEditPage',{data:data})
            } else if(userDetail.role === VOLUNTEER){
                props.navigation.navigate('VoterEditPage',{data:data})
            }
    }
    const renderHeader = () => {
        return (
            <View style={style.headerMain}>
                <InitialHeader
                    isAnimated={true}
                    cancelButton={true}
                    canViewFullScreenImage={true}
                    isButton={true}
                    RightTitle={userDetail?.role === ADMIN?'Edit':userDetail?.role===VOLUNTEER?'Edit':''}
                    RightPress={editMemberDetail}
                    isUrl={
                        data &&
                        typeof data?.ProfileImage !== 'undefined' &&
                        data?.ProfileImage !== '-' &&
                        data?.ProfileImage !== null &&
                        data?.ProfileImage !== ''
                            ? true
                            : false
                    }
                    cancelPress={() => props.navigation.goBack()}
                    imgPath={
                        data &&
                        typeof data?.ProfileImage !== 'undefined' &&
                        data?.ProfileImage !== '-' &&
                        data?.ProfileImage !== null &&
                        data?.ProfileImage !== ''
                            ? {uri: data?.ProfileImage}
                            : defaultUserMaleImage
                    }
                    scrollY={scrollY}
                />
                <AnimatedTitle scrollY={scrollY}>
                    <View
                        style={[
                            style.nameView,
                            {
                                backgroundColor: color.creamDarkGray,
                            },
                        ]}
                        onLayout={event => {
                            SetHeaderDetailHeight(event.nativeEvent.layout.height);
                        }}>
                        <View style={{flexDirection: 'row'}}>
                            <View>
                                <Image
                                    source={
                                        (data?.Gender?.toUpperCase() === 'MALE' &&
                                            require('../../assets/images/father_icon.png')) ||
                                        require('../../assets/images/mother_icon.png')
                                    }
                                    style={style.iconStyle}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems: 'flex-start',
                                    // fontFamily: font.robotoBold,

                                }}>
                                <Text
                                    style={[
                                        style.fontStyle,
                                        {
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            // fontFamily: font.robotoRegular,
                                        },
                                    ]}>
                                    {data?.VoterHindiName!==null ?returnNameFromFields(data?.FirstName, data?.MiddleName, data?.LastName)+"/"+data?.VoterHindiName:
                                        returnNameFromFields(data?.FirstName, data?.MiddleName, data?.LastName)
                                    }
                                </Text>
                                <Text
                                    style={[
                                        style.fontStyle,
                                        {
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            // fontFamily: font.robotoRegular,
                                        },
                                    ]}>
                                    {data?.FatherEntry!==null ?"Father Name":data?.SpouseEntry!==null?data?.Gender==="male"?"Wife Name ":"Husband Name":"Father Name "}
                                </Text>
                                <Text
                                    style={[
                                        style.fontStyle,
                                        {
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            // fontFamily: font.robotoRegular,
                                        },
                                    ]}>
                                    {data?.MiddleName}
                                </Text>
                            </View>
                        </View>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                           <View style={{alignItems:'center',justifyContent:'center',marginTop:hp(1),height:isWEB?hp(6):hp(3),borderRadius:wp(5),width:isWEB?wp(20):wp(40),backgroundColor:data?.TrustFactor?.Color??'red'}}>
                               <Text style={{fontSize:normalize(10),fontWeight:'700'}}>{data?.TrustFactor?.Name??'AGAINST'}</Text>
                           </View>
                            <Text style={{marginTop:hp(1),fontSize:normalize(8),fontWeight:'500'}}>{data?.TrustFactor?.ExtraMessage??'AGAINST'}</Text>
                        </View>
                        {/*<View style={{flexDirection: 'row'}}>*/}
                        {/*    {data?.FatherEntry !== null && (*/}
                        {/*        <View*/}
                        {/*            style={{*/}
                        {/*                ...style.mainRowView,*/}
                        {/*                flex: 1,*/}
                        {/*                marginLeft: 0,*/}
                        {/*                // alignItems: 'center',*/}
                        {/*            }}>*/}
                        {/*            <Image*/}
                        {/*                source={require('../../assets/images/father_icon.png')}*/}
                        {/*                style={style.iconStyle}*/}
                        {/*            />*/}
                        {/*            <View style={{flex: 1}}>*/}
                        {/*                <CustomText*/}
                        {/*                    style={[*/}
                        {/*                        style.subfontStyle,*/}
                        {/*                        {marginLeft: wp(1.2)},*/}
                        {/*                    ]}>*/}
                        {/*                    {returnNameFromFields(*/}
                        {/*                        data?.FatherEntry?.FirstName,*/}
                        {/*                        data?.FatherEntry?.MiddleName,*/}
                        {/*                        data?.FatherEntry?.LastName*/}
                        {/*                    )}*/}
                        {/*                </CustomText>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    )}*/}

                        {/*    {data?.MotherEntry !== null && (*/}
                        {/*        <View*/}
                        {/*            style={[*/}
                        {/*                style.mainRowView,*/}
                        {/*                {flex: 1, marginLeft: data.FatherEntry !== null ? 0 : wp(-0.6)},*/}
                        {/*            ]}>*/}
                        {/*            <Image*/}
                        {/*                source={require('../../assets/images/mother_icon.png')}*/}
                        {/*                style={style.iconStyle}*/}
                        {/*            />*/}

                        {/*            <View style={{flex: 1}}>*/}
                        {/*                <CustomText style={[style.subfontStyle]}>*/}
                        {/*                    {returnNameFromFields(*/}
                        {/*                        data?.MotherEntry?.FirstName,*/}
                        {/*                        data?.MotherEntry?.MiddleName,*/}
                        {/*                        data?.MotherEntry?.LastName*/}
                        {/*                    )}*/}
                        {/*                </CustomText>*/}
                        {/*            </View>*/}
                        {/*        </View>*/}
                        {/*    )}*/}
                        {/*</View>*/}
                        {data?.Email !== '-' &&
                        data?.Email !== '' &&
                        data?.Email !== null &&
                        typeof data?.Email !== 'undefined' && (
                            <View style={{flexDirection: 'row'}}>
                                <View style={[style.mainRowView, {flex: 1, alignItems: 'center'}]}>
                                    {/*<EvilIconsIcon name="envelope" size={wp(6)} color={color.blue} />*/}
                                    <CustomText
                                        onPress={() => {
                                            Linking.openURL(`mailto:${data?.Email}`).then(()=>{}).catch((err)=>{});
                                        }}
                                        style={[
                                            style.subfontStyle,
                                            {
                                                textDecorationLine: 'underline',
                                                color: color.blue,
                                                textDecorationColor: color.blue,
                                            },
                                        ]}>
                                        {data?.Email}
                                    </CustomText>
                                </View>
                            </View>
                        )}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={[style.mainRowView, {flex: 1, marginLeft: wp(3), alignItems: 'center'}]}>
                                {/*<FeatherIcon name="phone-call" size={wp(4.5)} color={color.blue} />*/}
                                <CustomText
                                    onPress={() => {
                                        Linking.openURL(
                                            `tel:${data?.Mobile}`
                                        ).then(()=>{}).catch((err)=>{});;
                                    }}
                                    style={[
                                        style.subfontStyle,
                                        {
                                            marginLeft: wp(2),
                                            textDecorationLine: 'underline',
                                            color: color.blue,
                                            textDecorationColor: color.blue,
                                            // fontFamily: font.robotoRegular,
                                        },
                                    ]}>
                                    {/*{data.Mobile}*/}
                                    {data?.Mobile}
                                </CustomText>
                            </View>
                            {/*<View style={[style.mainRowView, {flex: 1, marginLeft: 0, alignItems: 'center'}]}>*/}
                            {/*    <Image*/}
                            {/*        source={require('../../assets/images/native_place_icon.png')}*/}
                            {/*        style={[style.iconStyle]}*/}
                            {/*    />*/}
                            {/*    <CustomText style={style.subfontStyle}>*/}
                            {/*        {data?.FamilyMaster?.NativePlaceMaster?.Name}*/}
                            {/*    </CustomText>*/}
                            {/*</View>*/}
                        </View>
                    </View>
                    {/*{dividerView && data.MaritalStatus !== MARITAL_STATUS.single && (*/}
                    {/*    <View style={{height: hp(0.3), width: wp(100), backgroundColor: color.white}} />*/}
                    {/*)}*/}
                </AnimatedTitle>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{flex: 1, backgroundColor: color.white, marginTop: hp(-1)}}
            forceInset={{top: 'never', bottom: 'always'}}>
            {renderHeader()}
            <Animated.ScrollView
                overScrollMode={'never'}
                bounces={false}
                style={{flex: 9, zIndex: 0}}
                scrollEventThrottle={16}
                onScrollBeginDrag={({nativeEvent}) => {
                    if (nativeEvent.contentOffset.y > 0) {
                        setDividerView(true);
                    } else {
                        setDividerView(false);
                    }
                }}
                onScrollEndDrag={({nativeEvent}) => {
                    if (nativeEvent.contentOffset.y > 0) {
                        setDividerView(true);
                    } else {
                        setDividerView(false);
                    }
                }}
                onScroll={Animated.event([
                    {
                        nativeEvent: {contentOffset: {y: scrollY}},
                    },
                ])}>
                <View
                    style={{
                        flex: 1,
                        marginTop: dividerView
                            ? headerDetailHeight + insets.top + hp(30.5)
                            : headerDetailHeight + insets.top + hp(30.5),
                    }}>
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'DOB' + ' '}</CustomText>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {data?.DOB ? moment(data?.DOB).format('Do MMMM YYYY') : '-'}
                                </CustomText>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={[style.subMainRowFontStyle, {marginLeft: 0}]}>
                                    {'STUDIES' + ' '}
                                </CustomText>
                                <CustomText style={[style.subMainRowDetailFont, {marginLeft: 0}]}>
                                    {data?.Studies ? data.Studies : '-'}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'MARITAL STATUS' + ' '}</CustomText>
                            </View>

                            <View>
                                <CustomText style={style.subMainRowDetailFont}>{data?.MaritalStatus}</CustomText>
                            </View>
                        </View>

                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={[style.subMainRowFontStyle, {marginLeft: 0}]}>
                                    {'MARRIAGE DATE' + ' '}
                                </CustomText>
                            </View>

                            <View>
                                <CustomText style={[style.subMainRowDetailFont, {marginLeft: 0}]}>
                                    {data?.MarriageDate !== null
                                        ? moment(data?.MarriageDate).format('Do MMMM , YYYY')
                                        : '-'}
                                </CustomText>
                            </View>
                        </View>
                    </View>

                    {data?.FamilyMaster?.AddressMaster !== null && (
                        <View style={{flex: 1}}>
                            <View style={{marginTop: hp(2), marginLeft: wp(3)}}>
                                <CustomText style={{color: color.red, fontSize: normalize(15)}}>
                                    {'HOME DETAILS' + ' '}
                                </CustomText>
                            </View>
                            <View style={style.subMainRowView}>
                                <View style={{flex: 1}}>
                                    <View>
                                        <CustomText style={style.subMainRowFontStyle}>
                                            {'HOME ADDRESS' + ' '}
                                        </CustomText>

                                        <View>
                                            <CustomText style={[style.subMainRowDetailFont]}>
                                                {data?.FamilyMaster?.AddressMaster?.Address}
                                            </CustomText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[style.subMainRowView]}>
                                <View style={style.topDetail}>
                                    <View style={style.centerDetail}>
                                        <CustomText style={style.subMainRowFontStyle}>{'CITY'}</CustomText>
                                        <CustomText style={style.subMainRowDetailFont}>
                                            {data?.FamilyMaster?.AddressMaster?.CityOrVillageName}
                                        </CustomText>
                                    </View>
                                </View>
                                <View style={[style.topDetail]}>
                                    <View style={style.centerDetail}>
                                        <CustomText style={style.subMainRowFontStyle}>{'STATE'}</CustomText>
                                        <CustomText style={[style.subMainRowDetailFont, {textAlign: 'center'}]}>
                                            {data?.FamilyMaster?.AddressMaster?.StateName}
                                        </CustomText>
                                    </View>
                                </View>
                                <View style={[style.topDetail, {marginLeft: wp(1.5)}]}>
                                    <View style={style.centerDetail}>
                                        <CustomText style={[style.subMainRowFontStyle]}>COUNTRY</CustomText>
                                        <CustomText style={[style.subMainRowDetailFont]}>
                                            {data?.FamilyMaster?.AddressMaster?.CountryName}
                                        </CustomText>
                                    </View>
                                </View>
                                <View style={[style.topDetail, {marginLeft: wp(7)}]}>
                                    <View style={style.centerDetail}>
                                        <CustomText style={style.subMainRowFontStyle}>PIN-CODE</CustomText>
                                        <CustomText style={[style.subMainRowDetailFont]}>
                                            {data?.FamilyMaster?.AddressMaster?.PinCode}
                                        </CustomText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    {/*{data?.OfficeAddressDetail !== null && (*/}
                    {/*    <View style={{flex: 1}}>*/}
                    {/*        <View style={{marginTop: hp(2), marginLeft: wp(3)}}>*/}
                    {/*            <CustomText style={{color: color.red, fontSize: normalize(15)}}>*/}
                    {/*                {'OFFICE DETAILS'}*/}
                    {/*            </CustomText>*/}
                    {/*        </View>*/}
                    {/*        <View style={style.subMainRowView}>*/}
                    {/*            <View style={{flex: 1}}>*/}
                    {/*                <View>*/}
                    {/*                    <CustomText style={style.subMainRowFontStyle}>OFFICE ADDRESS</CustomText>*/}
                    {/*                </View>*/}

                    {/*                <View>*/}
                    {/*                    <CustomText style={style.subMainRowDetailFont}>*/}
                    {/*                        {data?.OfficeAddressDetail?.Address}*/}
                    {/*                    </CustomText>*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*        </View>*/}
                    {/*        <View style={[style.subMainRowView]}>*/}
                    {/*            <View style={style.topDetail}>*/}
                    {/*                <View style={style.centerDetail}>*/}
                    {/*                    <CustomText style={style.subMainRowFontStyle}>{'CITY'}</CustomText>*/}
                    {/*                    <CustomText style={style.subMainRowDetailFont}>*/}
                    {/*                        {data?.OfficeAddressDetail?.CityName}*/}
                    {/*                    </CustomText>*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*            <View style={[style.topDetail]}>*/}
                    {/*                <View style={style.centerDetail}>*/}
                    {/*                    <CustomText style={style.subMainRowFontStyle}>{'STATE'}</CustomText>*/}
                    {/*                    <CustomText style={[style.subMainRowDetailFont, {textAlign: 'center'}]}>*/}
                    {/*                        {data?.OfficeAddressDetail?.StateName}*/}
                    {/*                    </CustomText>*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*            <View style={[style.topDetail, {marginLeft: wp(1.5)}]}>*/}
                    {/*                <View style={style.centerDetail}>*/}
                    {/*                    <CustomText style={[style.subMainRowFontStyle]}>COUNTRY</CustomText>*/}
                    {/*                    <CustomText style={[style.subMainRowDetailFont]}>*/}
                    {/*                        {data?.OfficeAddressDetail?.CountryName}*/}
                    {/*                    </CustomText>*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*            <View style={[style.topDetail, {marginLeft: wp(7)}]}>*/}
                    {/*                <View style={style.centerDetail}>*/}
                    {/*                    <CustomText style={style.subMainRowFontStyle}>PIN-CODE</CustomText>*/}
                    {/*                    <CustomText style={[style.subMainRowDetailFont]}>*/}
                    {/*                        {data?.OfficeAddressDetail?.PinCode}*/}
                    {/*                    </CustomText>*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}
                    {/*)}*/}

                    {data?.OccupationMaster !== null && (
                        <View style={style.subMainRowView}>
                            <View style={{flex: 1}}>
                                <View>
                                    <CustomText style={style.subMainRowFontStyle}>{'OCCUPATION' + ' '}</CustomText>
                                </View>

                                <View>
                                    <CustomText style={style.subMainRowDetailFont}>
                                        {data?.OccupationMaster?.Name}
                                    </CustomText>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <View>
                                    <CustomText style={style.subMainRowFontStyle}>{'PHONE NO.' + ' '}</CustomText>
                                </View>

                                <View>
                                    <CustomText style={style.subMainRowDetailFont}>
                                        {/*{_.get(data.OfficeAddressDetail, ['Phone1'])}*/}
                                    </CustomText>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={{marginTop: hp(2), marginLeft: wp(3)}}>
                        <CustomText style={{color: color.red, fontSize: normalize(15)}}>
                            {'OTHER DETAILS' + ' '}
                        </CustomText>
                    </View>
                    {data?.VidhanSabhaMaster!==null &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'VIDHAN SABHA NAME' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {data?.VidhanSabhaMaster?.VidhanSabhaName}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }
                    {data?.WardMaster!==null &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'BOOTH NUMBER' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {data?.WardMaster?.WardCode}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }
                    {data?.PollingBoothMaster!==null &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'POLLING BOOTH STATION' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {data?.PollingBoothMaster?.PollingBoothName}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'AADHAAR NO.' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {data?.AadhaarNo && data?.AadhaarNo.toString().length>8 && 'XXXX XXXX ' + data?.AadhaarNo.toString().substring(8, data?.AadhaarNo?.length)
                                    // &&
                                    // typeof data.AadhaarNo !== 'undefined' &&
                                    // data.AadhaarNo !== null &&
                                    // data.AadhaarNo.length > 0 &&
                                    // data.AadhaarNo.length > 8 &&
                                    // 'XXXX XXXX ' + data.AadhaarNo.substring(8, data.AadhaarNo.length)
                                    }
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    {data?.FatherInLawDetail &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'FATHER IN LAW' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {returnNameFromFields(data?.FatherInLawDetail?.FirstName,data?.FatherInLawDetail?.MiddleName,data?.FatherInLawDetail?.LastName)
                                    }
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }
                    {data?.MotherInLawDetail &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'MOTHER IN LAW' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {
                                        returnNameFromFields(data?.MotherInLawDetail?.FirstName,data?.MotherInLawDetail?.MiddleName,data?.MotherInLawDetail?.LastName)
                                    }
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }
                    {data?.SpouseEntry &&
                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'SPOUSE NAME' + ' '}</CustomText>
                            </View>
                            <View>
                                <CustomText style={style.subMainRowDetailFont}>
                                    {
                                        returnNameFromFields(data?.SpouseEntry?.FirstName,data?.SpouseEntry?.MiddleName,data?.SpouseEntry?.LastName)
                                    }
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    }

                    <View style={style.subMainRowView}>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={[style.subMainRowFontStyle, {marginLeft: 0}]}>
                                    {'BLOOD GROUP' + ' '}
                                </CustomText>
                            </View>

                            <View>
                                <CustomText style={[style.subMainRowDetailFont, {marginLeft: 0}]}>
                                    {data?.BloodGroup}
                                </CustomText>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <View>
                                <CustomText style={style.subMainRowFontStyle}>{'ZODIAC' + ' '}</CustomText>
                            </View>

                            <View>
                                <CustomText style={style.subMainRowDetailFont}>{data?.Zodiac}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>
            <View style={{height: hp(1)}} />
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    fontStyle: {
        color: color.blue,
        fontSize: normalize(12),
        textAlign: 'center',
        marginLeft: wp(1),
        fontWeight: 'bold',
    },
    subfontStyle: {
        fontSize: normalize(10),
        fontFamily: font.robotoRegular,
        textAlign: 'left',
        marginLeft: wp(1),
    },
    nameView: {
        alignItems: 'center',
        backgroundColor: color.creamDarkGray,
        marginHorizontal: wp(3),
        marginBottom: hp(1),
        borderRadius: 5,
    },
    iconStyle: {
        width: wp(5),
        height: wp(5),
        marginLeft: wp(3),
    },
    mainRowView: {
        flexDirection: 'row',
        marginTop: hp(2),
        marginLeft: wp(2),
    },
    detailFontStyle: {
        fontSize: normalize(10),
        fontFamily: font.robotoRegular,
        marginLeft: wp(1),
    },
    subMainRowView: {
        flex: 1,
        // backgroundColor: 'red',
        backgroundColor: color.creamGray,
        marginHorizontal: wp(3),
        marginTop: hp(1),
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
    },
    subMainRowFontStyle: {
        color: color.blue,
        fontSize: normalize(12),
        fontFamily: font.robotoRegular,
        // marginLeft: wp(4),
        // marginTop: hp(1),
    },
    subMainRowDetailFont: {
        fontSize: normalize(10),
        fontFamily: font.robotoRegular,
        // marginLeft: wp(4),
        marginTop: hp(0.7),
    },
    topDetail: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerDetail: {
        flex: 0,
        alignItems: 'center',
    },
    headerMain: {
        zIndex: 100,
        width:wp(100),
        position: 'absolute',
        backgroundColor: color.creamDarkGray,
        borderBottomWidth: 20,
        borderBottomColor: '#fff',
    },
});
export default DirectoryDetail;
