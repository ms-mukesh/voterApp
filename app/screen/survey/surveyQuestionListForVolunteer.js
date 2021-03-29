import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet,Modal, TouchableHighlight, Image,Linking,FlatList} from 'react-native';
import {AppButton, AppHeader, FloatingLabel, GoBackHeader, LabelInputText, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllVolunteer} from "../../redux/actions/eventActions";
import {color, hp, isANDROID, normalize, wp} from "../../helper/themeHelper";
import {SwipeListView} from "react-native-swipe-list-view";
import {shadowStyle} from "../../helper/styles";
import moment from 'moment'
import {
    addNewSurveyQuestion,
    addVoterAnswerForSurvey,
    fetchSurveyList,
    getSurveyQuestionList, getVoterListWhoHasNotParticipate
} from "../../redux/actions/surveyAction";
import {cross_black_icon} from "../../assets/images";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";



const SurveyQuestionList = props => {
    const dispatch = useDispatch();
    const {data,surveyId,defaultObj,voterId,boothId} = props.route.params;
    let defaultObjKeyArray = []
    let name = '';
    for(name in defaultObj){
        defaultObjKeyArray.push(name)
    }
    // useEffect(()=>{
    //     let name = '';
    //     for(name in defaultObj){
    //       defaultObjKeyArray.push(name)
    //     }
    //     console.log(defaultObjKeyArray)
    // },[])

    const [surveyQuestionList,setSurveyQuestionList]=useState([]);
    const [answerObj,setAnswerObj] = useState({...defaultObj})
    const [newQuestion,setNewQuestion] = useState('');
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);

    const [currentMemberId, setCurrentMemberId] = useState({currentMember: 0});
    let tempCurrent = 0;
    let openRowRef = null;
    const flatlistRef = useRef(null);
    useEffect(()=>{
       setSurveyQuestionList([...data])
    },[])
    const renderNameFloatingTextInput = (
        lable,
        value,
        key,
        extraLabel = null,
        keyType = null,
        isMultiLine = false
    ) => {
        return (
            <View
                style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                }}
            >
                {isMultiLine ? (
                    <LabelInputText
                        multiline={true}
                        numberOfLines={10}
                        inputStyle={style.floatingInputStyle}
                        style={[style.floatingStyle]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        keyboardType={keyType !== null ? keyType : 'default'}
                        returnKeyType={'done'}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={(text) => {
                            setAnswerObj({...answerObj,[key]:text})
                        }}
                    />
                ) : (
                    <FloatingLabel
                        numberOfLines={1}
                        inputStyle={style.floatingInputStyle}
                        style={[style.floatingStyle]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        keyboardType={keyType !== null ? keyType : 'default'}
                        returnKeyType={'done'}
                        onChangeText={(text) => {
                            setAnswerObj({...answerObj,[key]:text})
                        }}
                    />
                )}
            </View>
        );
    };
    const displayDetailPage = index => {
        let tempData = null;
        openRowRef && openRowRef?.closeRow();
        // tempData = surveyList[index];
        // dispatch(getSurveyQuestionList({surveyId:tempData.SurveyId})).then((res)=>{
        //     if(res){
        //         props.navigation.navigate('SurveyQuestionList',{data:res})
        //     } else {
        //
        //     }
        // })
    };
    const _RenderItem = (item, index) => {
        console.log(defaultObjKeyArray)
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={style.mainView}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {item?.Question}
                                </Text>

                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                {renderNameFloatingTextInput('Answer '+parseInt(index+1)+':',answerObj[defaultObjKeyArray[index]],defaultObjKeyArray[index],true)}
                            </View>
                        </View>

                    </View>

                </View>
            </TouchableWithoutFeedback>
        );
    };
    const addVoterAnswerToDb = () =>{
        if(Object.keys(answerObj).every(key => answerObj[key] !== '')){
            let name ='';
            let answerObjArray = [];
            let tempObj = null
                for(name in answerObj){
                     tempObj = {
                        Answer:answerObj[name],
                        VoterId:voterId,
                        QuestionId:name,
                         SurveyId:surveyId
                    }
                    answerObjArray.push(tempObj)
                }
                if(answerObjArray.length>0){
                    dispatch(addVoterAnswerForSurvey({dataArray:answerObjArray})).then((res)=>{
                        if(res){
                            alert("Answer is Added succefully");
                            dispatch(getVoterListWhoHasNotParticipate({boothId,surveyId})).then((res)=>{
                                if(res){
                                    props.navigation.goBack()
                                }
                            })

                        }
                    })
                }
        } else {
            alert("please fill all answer field...all answers are mandotary")
        }
    }
    return (
        <View style={{flex: 1,}}>
            <GoBackHeader
                title={'back'}
                onMenuPress={() => {
                    props.navigation.goBack()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                extraScrollHeight={hp(8)}>
            <FlatList
                data={surveyQuestionList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => _RenderItem(item, index)}
                contentContainerStyle={{
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(1),
                }}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
            />
            <AppButton onPress={()=>{addVoterAnswerToDb()}} title={'Submit'}/>
            <View style={{height:hp(1)}}/>
            </KeyboardAwareScrollView>
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
    subText: {
        fontSize: normalize(12),
    },
    common: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontStyle: {
        color: color.blue,
        fontSize: normalize(13),
        // fontFamily: font.robotoRegular,
        marginLeft: wp(2),
        fontWeight: 'bold',
    },
    mainView: {

        backgroundColor: color.white,
        // backgroundColor: 'red',
        borderRadius: wp(2),
        // alignSelf: 'center',
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
export default SurveyQuestionList;
