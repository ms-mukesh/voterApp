import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, TouchableHighlight, Image,Linking} from 'react-native';
import {AppButton, AppHeader, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllVolunteer} from "../../redux/actions/eventActions";
import {color, hp, isANDROID, isWEB, normalize, wp} from "../../helper/themeHelper";
import {SwipeListView} from "react-native-swipe-list-view";
import {shadowStyle} from "../../helper/styles";
import moment from 'moment'
import XLSX from 'xlsx';
import {fetchSurveyList, getSurveyQuestionList, getSurveyReport} from "../../redux/actions/surveyAction";
import {ADMIN, VOLUNTEER} from "../../helper/constant";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";


const SurveyList = props => {
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.user.userDetail);
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const surveyList = useSelector(state => state.surveyReducer.surveyList);
    const [currentMemberId, setCurrentMemberId] = useState({currentMember: 0});
    let tempCurrent = 0;
    let openRowRef = null;
    const flatlistRef = useRef(null);
    const displayDetailPage = index => {
        if(userDetails?.role===ADMIN){
            let tempData = null;
            openRowRef && openRowRef?.closeRow();
            tempData = surveyList[index];
            dispatch(getSurveyQuestionList({surveyId:tempData.SurveyId})).then((res)=>{
                if(res){
                    props.navigation.navigate('SurveyQuestionList',{data:res,surveyId:tempData.SurveyId,startDate:tempData.SurveyStartDate})
                } else {

                }
            })
        } else if(userDetails?.role === VOLUNTEER){
            let tempData = null;
            openRowRef && openRowRef?.closeRow();
            tempData = surveyList[index];
            let electionDateforDiff = moment(tempData.SurveyStartDate).format("MM/DD/YYYY");
            let todayDate = moment(new Date().getTime()).format("MM/DD/YYYY");
            let dateDiffForStartDate = moment(electionDateforDiff).diff(todayDate, 'days');

            let electionDateforDiffforEndDate = moment(tempData.SurveyEndDate).format("MM/DD/YYYY");
            let dateDiffForStartDateForEndDate = moment(todayDate).diff(electionDateforDiffforEndDate, 'days');
            // console.log(dateDiffForStartDateForEndDate)
            console.log(index)
            if(dateDiffForStartDate>0){
                alert("survey has not been started yet")
                return;
            } else if(dateDiffForStartDateForEndDate >=0){
                alert("survey has been ended")
                return;
            } else {
                props.navigation.navigate('SurveyVolunteerBoothList',{surveyId:surveyList[index].SurveyId})
            }
            //
        }

    };
    const _RenderItem = (item, index) => {
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={[style.mainView,{width:wp(40)}]}>
                        <View style={{flex: 1, flexDirection: 'row'}}>

                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {item?.SurvayName}
                                </Text>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {"Start Date: "+moment(item?.SurveyStartDate).format("dddd DD-MM-yyyy")}
                                </Text>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {"End Date: "+moment(item?.SurveyEndDate).format("dddd DD-MM-yyyy")}
                                </Text>
                                <Text numberOfLines={4} allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {item?.SurveyDescription}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    const createExcelFile =async (data) =>{
        let excelOutputArray = [];
        let obj = null
        if(data.length ===0){
            alert("No data is thier for this survey yet");
            return ;
        }
        const headerTitle = "survey Name is "+data[0]?.SurveyMaster?.SurvayName+" From date"+moment(data[0]?.SurveyMaster?.SurveyStartDate).format('DD-MM-yyyy')+"To Date"+moment(data[0]?.SurveyMaster?.SurveyEndDate).format('DD-MM-yyyy');
        await data.map((item,index)=>{
            obj = {
                SrNo:parseInt(index)+1,
                VoterId:item?.VoterMaster?.VoterVotingId,
                VoterName:item?.VoterMaster?.FirstName+" "+item?.VoterMaster?.MiddleName,
                Question:item?.SurveyQuestionMaster?.Question,
                Answer:item?.Answer,
                // SurveyName:item?.SurveyMaster?.SurvayName,
                // SurveyDescription:item?.SurveyMaster?.SurveyDescription,
                // SurveyStartDate:moment(item?.SurveyMaster?.SurveyStartDate).format('DD-MM-yyyy'),
                // SurveyEndDate:moment(item?.SurveyMaster?.SurveyEndDate).format('DD-MM-yyyy'),
                VolunteerName:item?.VolunteerDetail?.FirstName+" "+item?.VolunteerDetail?.MiddleName,

            }
            excelOutputArray.push(obj)
        })

        var wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet([{}], {
            header: [headerTitle],
        });

        XLSX.utils.sheet_add_json(ws, excelOutputArray, {origin: 'A3'});
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});
        const uri = FileSystem.documentDirectory + 'survey_report_'+data[0]?.SurveyMaster?.SurvayName+new Date().getTime()+'.xlsx'
        console.log(`Writing to ${JSON.stringify(uri)}`);
        await FileSystem.writeAsStringAsync(uri, wbout, {
            encoding: FileSystem.EncodingType.Base64
        });
        await Sharing.shareAsync(uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'MyWater data',
            UTI: 'com.microsoft.excel.xlsx'
        });
    }
    const _renderHiddenComponent = (data, rowMap) => {
            return null;
    };
    useEffect(()=>{
       dispatch(fetchSurveyList()).then((res)=>{})
    },[])

    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={'Survey List'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />


            {userDetails.role === ADMIN &&
            <AppButton onPress={() => {
                props.navigation.navigate('CreateNewSurvey')
            }} containerStyle={{marginTop: hp(2), backgroundColor: '#ff6d5e'}} title={'Create New Survey'}/>
            }
            <SwipeListView
                directionalDistanceChangeThreshold={10}
                useFlatList={true}
                listViewRef={flatlistRef}
                data={surveyList}
                numColumns={2}
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

            {isLoading && <Loading isLoading={isLoading} />}
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
        fontSize: normalize(12),
    },
    common: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontStyle: {
        color: color.blue,
        fontSize: normalize(10),
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
        width: wp(4.0),
        height: wp(4.0),
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
    excelTextStyle:{fontSize:normalize(15),flex:1,marginLeft:wp(1)},
    sortModalBottomRow: {height: hp(10), alignItems: 'center', justifyContent: 'center'},
});
export default SurveyList;
