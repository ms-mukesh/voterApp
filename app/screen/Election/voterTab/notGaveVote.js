import React,{useState,useEffect,useCallback,useRef} from 'react';
import {
    Keyboard,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Image,
    Alert,
    Modal, ActivityIndicator, FlatList,Linking,
} from 'react-native';
import {AppButton, AppHeader, Loading} from "../../common";

import {color, font, hp, isANDROID, isIOS, normalize, wp} from "../../../helper/themeHelper";
import {shadowStyle} from "../../../helper/styles";
import {SwipeListView} from "react-native-swipe-list-view";
import moment from "moment";
import {autoCapitalString} from "../../../helper/validation";

import {useDispatch,useSelector} from "react-redux";

import DefaultMaleIcon from "../../../assets/images/user_male.png";
import {ImageFullScreenPreview} from "../../common/ImageFullScreenPreview";

import {IS_OUR_ENFLUENCER} from "../../../helper/constant";
import {exportFile, isDefined} from "../../functions";
import * as Permissions from 'expo-permissions';
import {usePermissions} from "expo-permissions";
import {getVoterForElection, updateVoterElectionStatus} from "../../../redux/actions/election";

const VoterWhoNotGaveVoteScreen = props => {
    const {electionId} = props;
    const voterWhoDoesNotVote = useSelector(state => state.electionReducer.doNotVotedVoted);
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    let openRowRef = null;
    const flatlistRef = useRef(null);
    let tempCurrent = 0;
    const [currentImage, setCurrentImage] = useState('');
    const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
    const dispatch = useDispatch()
    const closeImagePreview = () => {
        setImagePreviewFlag(false);
    };
    const displayImageInFullScreen = (image = null) => {
        if (image !== null) {
            setCurrentImage(image);
            setImagePreviewFlag(true);
        } else {
            setCurrentImage(null);
            setImagePreviewFlag(true);
        }
    };
    const displayDetailPage = index => {
        let tempData = null;
        openRowRef && openRowRef.closeRow();
        // if (sortFlag) {
        //     tempData = sortData[index];
        // } else if (filterFlag) {
        //     tempData = filterData[index];
        // }
        if (searchFlag === 1) {
            tempData = searchData[index];
        } else if(filterFlag){
            // alert("filter")
            tempData = filterData[index];
        }
        else {
            tempData = voterListData.data[index];
        }
        props.navigation.navigate('MemberDetails', {
            data: tempData,
        });
    };
    const _RenderItem = (item, index) => {
        let date = item.DOB;
        const dob = moment(date).format('Do MMM YYYY');
        return (
            <TouchableWithoutFeedback onPress={()=>{
                // displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={[style.mainView,{width:wp(45)}]}>
                        {item?.IsInfluencer === IS_OUR_ENFLUENCER &&
                        <View
                            style={{
                                position: 'absolute',
                                // backgroundColor: color.green,
                                top: 10,
                                right: 10,
                                borderBottomLeftRadius: wp(2),
                                borderTopRightRadius: wp(2),
                                zIndex: 1000,
                            }}>
                            <TouchableHighlight
                                onPress={() => {
                                    // displayDetailPage(index);
                                }}>
                                <Text style={{fontSize: normalize(20)}}>*</Text>
                            </TouchableHighlight>
                        </View>
                        }
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                {typeof item.ProfileImage === 'undefined' ||
                                item.ProfileImage === '-' ||
                                item.ProfileImage === null ||
                                item.ProfileImage === '' ? (
                                    <TouchableWithoutFeedback onPress={() => displayImageInFullScreen()}>
                                        <Image style={{height: wp(7), width: wp(7), borderRadius: wp(3.5)}} source={DefaultMaleIcon} />
                                    </TouchableWithoutFeedback>
                                ) : (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            displayImageInFullScreen(item.ProfileImage);
                                        }}>
                                        <Image
                                            style={{height: wp(7), width: wp(7), borderRadius: wp(3.5)}}
                                            resizeMode={'cover'}
                                            onLoad={e => {}}
                                            source={{
                                                uri: item.ProfileImage,
                                                // headers: {Authorization: '9876543210'},
                                                // priority: FastImage.priority.normal,
                                                // cache: FastImage.cacheControl.immutable,
                                                //cache: FastImage.cacheControl.web,
                                                //cache: FastImage.cacheControl.cacheOnly,
                                            }}
                                        />
                                    </TouchableWithoutFeedback>
                                )}
                            </View>
                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {item?.FirstName}
                                </Text>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {console.log(item)}
                                    {item?.FatherEntry!==null ?"S/O "+item?.MiddleName:item?.SpouseEntry!==null?item?.Gender==="male"?"H/O "+item?.MiddleName:"W/O "+item?.MiddleName:"S/O "+item?.MiddleName}
                                </Text>
                                <View style={{flexDirection:'row',flex:1,justifyContent: 'space-between'}}>
                                    <View style={{flex:1}}>
                                        {(item?.VoterVotingId !== "" && item?.VoterVotingId !== null) &&
                                        <Text style={style.fontStyle}>{item?.VoterVotingId}</Text>
                                        }
                                    </View>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        dispatch(updateVoterElectionStatus({
                                            voterId:item?.VoterId,
                                            electionId:electionId
                                        })).then((res)=>{
                                                if(res){
                                                    dispatch(getVoterForElection({electionId:electionId,boothId : item?.BoothId})).then((res)=>{
                                                        if(res){
                                                            // props.navigation.navigate('VoterTabsScreen',{ElectionId:item?.ElectionMaster?.ElectionMasterId})
                                                        }
                                                    })
                                                }
                                        })
                                    }}>
                                    <View style={{alignItems:'center',justifyContent:'center',height:hp(5),width:wp(20),borderRadius:hp(1.5),backgroundColor:color.lightGreen}}>
                                        <Text style={{fontSize:normalize(12),fontWeight:'700'}}>{'Mark as voted'}</Text>
                                    </View>
                                    </TouchableWithoutFeedback>
                                </View>


                                {item.Email !== '' &&
                                item.Email !== '-' &&
                                item.Email !== null &&
                                typeof item.Email !== 'undefined' && (
                                    <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                        <Image
                                            source={require('../../../assets/images/mail.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text
                                            allowFontScaling={false}
                                            style={[
                                                style.subText,
                                                {
                                                    marginLeft: wp(1),
                                                    flex: 1,
                                                    textDecorationLine: 'underline',
                                                    color: color.blue,
                                                    textDecorationColor: color.blue,
                                                },
                                            ]}
                                            onPress={() => {
                                                Linking.openURL(`mailto:${item.Email}`).then((res)=>{}).catch((err)=>{
                                                    alert("Fail to send mail")
                                                });;
                                            }}>
                                            {item.Email.toLowerCase()}
                                        </Text>
                                    </View>
                                )}
                                {item?.Mobile &&
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <View style={[style.common, {flex: 1}]}>
                                        <Image
                                            source={require('../../../assets/images/phone.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text
                                            allowFontScaling={false}
                                            onPress={() => {
                                                Linking.openURL(
                                                    `tel:${
                                                        item.Mobile
                                                        }`
                                                ).then((res)=>{}).catch((err)=>{
                                                    alert("Fail to make call")
                                                });
                                            }}
                                            style={[
                                                style.subText,
                                                {
                                                    marginLeft: wp(1),
                                                    textDecorationLine: 'underline',
                                                    color: color.blue,
                                                    textDecorationColor: color.blue,
                                                },
                                            ]}>
                                            {item.Mobile}
                                        </Text>
                                    </View>

                                    <View style={[style.birthdayView, {flex: 1}]}>
                                        {item?.DOB &&
                                        <View style={{flexDirection: 'row'}}>
                                            <Image source={require('../../../assets/images/cake.png')}
                                                   style={style.iconStyle}/>
                                            <Text allowFontScaling={false} style={{...style.subText, marginLeft: wp(1)}}>
                                                {dob}
                                            </Text>
                                        </View>
                                        }
                                    </View>
                                </View>
                                }
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <View style={[style.common, {flex: 2}]}>
                                        <Image
                                            source={require('../../../assets/images/gender.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item.Gender !== '' &&
                                            item.Gender !== '-' &&
                                            item.Gender !== null &&
                                            autoCapitalString(item.Gender)}
                                        </Text>
                                    </View>
                                    <View style={[style.common, {flex: 2}]}>
                                        <Text style={style.subText}>AGE:</Text>
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item?.Age}
                                        </Text>
                                    </View>
                                    {item?.MaritalStatus &&
                                    <View style={[style.common, {flex: 1.5}]}>
                                        <Image
                                            source={require('../../../assets/images/marital_status.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item.MaritalStatus !== '' &&
                                            item.MaritalStatus !== '-' &&
                                            item.MaritalStatus !== null &&
                                            autoCapitalString(item.MaritalStatus)}
                                        </Text>
                                    </View>
                                    }

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    return (
        <View style={{flex: 1 }}>
            {isLoading && <Loading isLoading={isLoading} />}
            <FlatList
                directionalDistanceChangeThreshold={10}
                listViewRef={flatlistRef}
                data={voterWhoDoesNotVote}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                recalculateHiddenLayout={true}
                renderItem={({item, index}) => _RenderItem(item, index)}
                contentContainerStyle={{
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(1),
                }}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
            />
            {imagePreviewFlag && (
                <ImageFullScreenPreview imgPath={currentImage} setPreviewClose={closeImagePreview} />
            )}
        </View>
    );
};
const style = StyleSheet.create({
    searchTextinput: {
        flexDirection: 'row',
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        paddingHorizontal: hp(2),
        backgroundColor: color.creamGray,
        borderRadius: wp(2),
        ...shadowStyle,
        elevation: 10,
    },
    subText: {
        fontSize: normalize(8),
    },
    common: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontStyle: {
        color: color.blue,
        fontSize: normalize(8),
        // fontFamily: font.robotoRegular,
        marginLeft: wp(2),
        fontWeight: 'bold',
    },
    mainView: {
        flexDirection: 'row',
        backgroundColor: color.white,
        // backgroundColor: 'red',
        borderRadius: wp(2),
        alignSelf: 'center',
        ...shadowStyle,
        paddingRight: wp(2),
        paddingLeft: wp(3),
        paddingVertical: hp(1),
        elevation: 10,
    },
    birthdayView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        // justifyContent: 'flex-end',
    },
    searchContainer: {
        fontSize: normalize(14),
        marginLeft: wp(2),
        paddingVertical: hp(1.5),
        flex: 1,
        color: color.black,
    },
    rowBack: {
        marginBottom: hp(1),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(2.5),
        backgroundColor: color.themePurple,
        borderRadius: wp(2),
    },
    iconStyle: {
        width: hp(2),
        height:hp(2)
    },
    sortLabel: {
        fontSize: normalize(15),
        color: '#414141',
        fontWeight: 'bold',
    },
    sortListItem: {
        fontSize: normalize(16),
        // fontWeight: 'bold',
        color: color.blue,
    },
    sortViewHeader: {
        height: hp(5.5),
        backgroundColor: color.blue,
    },
    sortViewHeaderText: {
        fontWeight: 'bold',
        fontSize: normalize(15),
        color: color.white,
        // color: color.white,
    },
    sortViewButton: {
        height: hp(4),
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: hp(0.5),
    },
    sortButtonText: {
        fontSize: normalize(14),
        fontWeight: 'bold',
    },
    sortMainView: {
        flex: 1,
        marginTop: hp(1),
        flexDirection: 'row',
        padding: hp(0.5),
        alignItems: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    dividerView: {
        height: hp(0.05),
        backgroundColor: color.gray,
        width: wp(75),
        alignSelf: 'center',
    },
    sortModalMainView: {
        flex: 0,
        width: wp(84),
        backgroundColor: color.white,
    },
    sortModalTopRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: wp(10),
    },
    groupView: {
        backgroundColor: color.creamDarkGray,
        padding: wp(2),
        borderRadius: wp(5),
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
    },
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        // fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    excelTextStyle:{fontSize:normalize(15),flex:1,marginLeft:wp(1)},
    sortModalBottomRow: {height: hp(10), alignItems: 'center', justifyContent: 'center'},
});

export default VoterWhoNotGaveVoteScreen;
