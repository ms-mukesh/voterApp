import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, TouchableHighlight, Image,Linking,FlatList} from 'react-native';
import {AppHeader, GoBackHeader, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllVolunteer} from "../../redux/actions/eventActions";
import {color, hp, isANDROID, normalize, wp} from "../../helper/themeHelper";
import {SwipeListView} from "react-native-swipe-list-view";
import {shadowStyle} from "../../helper/styles";
import {IS_OUR_ENFLUENCER} from "../../helper/constant";
import DefaultMaleIcon from "../../assets/images/user_male.png";
import {
    getAllVolunteerChanges,
    getVolunteerBoothDetails,
    getVolunteerChanges
} from "../../redux/actions/volunteerAction";
import {ImageFullScreenPreview} from "../common/ImageFullScreenPreview";


const VolunteerRequestChangesStatus = props => {
    const dispatch = useDispatch()
    // const {volunteerId} = props.route.params;
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [volunteerChanges,setVolunterChanges] = useState([]);
    const [volunteerList,setVolunteerList] = useState([])
    const [currentMemberId, setCurrentMemberId] = useState({currentMember: 0});
    const [currentImage, setCurrentImage] = useState('');
    const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
    let tempCurrent = 0;
    let openRowRef = null;
    const flatlistRef = useRef(null);
    useEffect(()=>{
        dispatch(getAllVolunteerChanges()).then(async (res)=>{
            if(res){
                await setVolunterChanges(res)
            }
        })
    },[])

    const displayDetailPage = index => {
        openRowRef && openRowRef?.closeRow();
        let tempData = volunteerChanges[index];
        props.navigation.navigate('VolunteerRequestsPreivew', {
            data: tempData,
        });
    };
    const returnNameFromFields = (firstName, middleName, lastName) => {
        let tempName = null;
        if (firstName !== '' && firstName !== '-' && firstName !== null) {
            tempName = firstName;
        }
        if (middleName !== '' && middleName !== '-' && middleName !== null) {
            tempName = tempName + ' ' + middleName?.replace(/\((.*)\)/, '');
        }
        if (lastName !== '' && lastName !== '-' && lastName !== null) {
            tempName = tempName + ' ' + lastName?.replace(/\((.*)\)/, '');
        }
        return tempName;
    };
    const _RenderItem = (item, index) => {

        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
            <View style={{flex: 1, marginBottom: hp(1)}}>
                <View style={[style.mainView,{width:wp(40)}]}>
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
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        <View style={{flex: 1, justifyContent: 'space-between'}}>
                            {/*<Text allowFontScaling={false} style={style.fontStyle}>*/}
                            {/*    /!*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*!/*/}
                            {/*    {returnNameFromFields(item?.FirstName, item?.MiddleName, item?.LastName)}*/}
                            {/*</Text>*/}
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                {item?.FirstName}
                            </Text>
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {item?.FatherEntry!==null ?"Father Name":item?.SpouseEntry!==null?item?.Gender==="male"?"Wife Name ":"Husband Name":"Father Name "}
                            </Text>
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {item?.MiddleName}
                            </Text>
                            <View style={{flexDirection:'row',flex:1,justifyContent: 'space-between'}}>
                                <View style={{flex:1}}>
                                    {(item?.VoterVotingId !== "" && item?.VoterVotingId !== null) &&
                                    <Text style={style.fontStyle}>{item?.VoterVotingId}</Text>
                                    }
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',height:hp(5),width:wp(15),borderRadius:hp(1.5),backgroundColor:item?.IsApproved===1?'green':'red'}}>
                                    <Text style={{fontSize:normalize(10),fontWeight:'700'}}>{item?.IsApproved===1?'ACCEPTED':'PENDING'}</Text>
                                </View>
                            </View>

                            {item.Email !== '' &&
                            item.Email !== '-' &&
                            item.Email !== null &&
                            typeof item.Email !== 'undefined' && (
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <Image
                                        source={require('../../assets/images/mail.png')}
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
                                            Linking.openURL(`mailto:${item?.Email}`).then((res)=>{}).catch((err)=>{
                                                alert("Fail to send email")
                                            });
                                        }}>
                                        {item?.Email.toLowerCase()}
                                    </Text>
                                </View>
                            )}

                            <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                {item?.Mobile &&
                                <View style={[style.common, {flex: 1}]}>
                                    <Image
                                        source={require('../../assets/images/phone.png')}
                                        style={style.iconStyle}
                                    />
                                    <Text
                                        allowFontScaling={false}
                                        onPress={() => {
                                            Linking.openURL(
                                                `tel:${
                                                    item?.Mobile
                                                    }`
                                            ).then((res)=>{}).catch((err)=>{
                                                alert("Fail to make Call")
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
                                        {item?.Mobile}
                                    </Text>
                                </View>
                                }
                                {item?.Age &&

                                <View style={[style.birthdayView, {flex: 1}]}>
                                    <Text style={style.subText}>Age:</Text>
                                    <Text allowFontScaling={false} style={{...style.subText, marginLeft: wp(1)}}>
                                        {item?.Age}
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
    const _renderHiddenComponent = (data, rowMap) => {
        // if (isLoading) {
        //     return null;
        // } else if (!renderFlag) {
        //     return null;
        // }

        return (
            <View style={style.rowBack}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        // rowMap[data.item.key].closeRow();
                        displayDetailPage(currentMemberId.currentMember);

                    }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: normalize(15),
                                color: color.white,
                                // fontFamily: font.robotoBold,
                            }}>
                            Details
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
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
    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={'My Requests'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            {imagePreviewFlag && (
                <ImageFullScreenPreview imgPath={currentImage} setPreviewClose={closeImagePreview} />
            )}
            {volunteerChanges.length === 0 ?
                <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                    <Text>NO changes found for this volunteer</Text>
                </View>
                :
                <FlatList
                    directionalDistanceChangeThreshold={10}
                    numColumns={2}
                    useFlatList={true}
                    listViewRef={flatlistRef}
                    data={volunteerChanges}
                    keyExtractor={(item, index) => index.toString()}
                    recalculateHiddenLayout={true}
                    renderItem={({item, index}) => _RenderItem(item, index)}
                    renderHiddenItem={(data, rowMap) => _renderHiddenComponent(data, rowMap)}
                    closeOnScroll={true}
                    rightOpenValue={-wp(18)}
                    rightActivationValue={isANDROID ? -1104545 : -wp(35)}
                    disableRightSwipe={true}
                    onRightActionStatusChange={() => {
                        setTimeout(() => {
                            displayDetailPage(tempCurrent);
                            // displayDetailPage(currentMemberId.currentMember);
                            openRowRef && openRowRef.closeRow();
                        }, 50);
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: wp(3),
                        paddingVertical: hp(1),
                    }}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    extraData={{...props}}
                    onEndReachedThreshold={0.01}
                    onRowOpen={(rowKey, rowMap) => {
                        openRowRef = rowMap[rowKey];
                        tempCurrent = rowKey;
                        currentMemberId.currentMember = rowKey;
                        if (isANDROID) {
                            openRowRef = rowMap[rowKey];
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    bounces={isANDROID ? false : true}
                    onSwipeValueChange={swipeData => {
                        if (isANDROID) {
                            if (
                                swipeData.direction === 'left' &&
                                !swipeData.isOpen &&
                                swipeData.value <= -150
                            ) {
                                // setTimeout(() => {
                                // alert("called")
                                openRowRef && openRowRef.closeRow();
                                displayDetailPage(swipeData.key);

                                // }, 100);
                            }
                        }
                    }}
                />
            }
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
export default VolunteerRequestChangesStatus;
