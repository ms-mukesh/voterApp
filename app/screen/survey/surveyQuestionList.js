import React,{useEffect,useState,useRef} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet,Modal, TouchableHighlight, Image,Linking,FlatList} from 'react-native';
import {AppButton, AppHeader, FloatingLabel, GoBackHeader, LabelInputText, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {color, hp, isANDROID, normalize, wp} from "../../helper/themeHelper";
import {shadowStyle} from "../../helper/styles";
import moment from 'moment'
import {addNewSurveyQuestion, fetchSurveyList, getSurveyQuestionList} from "../../redux/actions/surveyAction";
import {cross_black_icon} from "../../assets/images";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";



const SurveyQuestionList = props => {
    const dispatch = useDispatch();
    const {data,surveyId,startDate} = props.route.params;
    const [surveyQuestionList,setSurveyQuestionList]=useState([]);
    const [newQuestion,setNewQuestion] = useState('');
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [addNewQuestionflag,setAddNewQuestionFlag] = useState(false)
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
                            setNewQuestion(text)
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
                            setNewQuestion(text)
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
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={style.mainView}>
                        <View style={{flex: 1, flexDirection: 'row'}}>

                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {item?.Question}
                                </Text>

                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    const addNewQuestionToDb = () =>{
        if(newQuestion===''){
            alert("please enter question");
            return;
        } else if(typeof surveyId ==='undefined' && surveyId!==''){
            alert("fail to add question");
            return;
        }
        else {
            setAddNewQuestionFlag(false)
            let obj = {
                surveyId:surveyId,
                question:newQuestion
            };
            dispatch(addNewSurveyQuestion(obj)).then((res)=>{
                if(res){
                    dispatch(getSurveyQuestionList({surveyId})).then(async (res)=>{
                        if(res){
                            await setSurveyQuestionList([...res]);
                            await setNewQuestion('')
                        }
                    })
                }
            })
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
            {addNewQuestionflag &&
            <Modal
                onRequestClose={() => setAddNewQuestionFlag(false)}
                animated={false}
                transparent={true}
                visible={true}>
                <View style={{
                    flex: 1,
                    // alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(14,14,14,0.85)'
                }}>
                    <TouchableWithoutFeedback onPress={()=>{
                        // let dateDiff = moment(electionDateforDiff).diff(todayDate, 'days');
                        setAddNewQuestionFlag(false)
                    }}>
                        <Image source={cross_black_icon} style={[{height: wp(6),width:wp(6)}]}/>
                    </TouchableWithoutFeedback>
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
                                'What is Question',
                                newQuestion,
                                'surveyName',
                                true,
                                null,
                                true
                            )}
                        </View>
                    </View>
                    <AppButton onPress={()=>{addNewQuestionToDb()}} containerStyle={{marginTop:hp(2)}} title={'Add New Question'}/>

                </View>
            </Modal>

            }
            <AppButton onPress={()=>{
                let surveyDate = moment(startDate).format("MM/DD/YYYY");
                let todayDate = moment(new Date().getTime()).format("MM/DD/YYYY");
                let dateDiff = moment(startDate).diff(todayDate, 'days');
                if(dateDiff <= 0){
                    alert("survey has been started already you can not add new question now..!")
                } else {
                    setAddNewQuestionFlag(true)
                }
            }} containerStyle={{marginTop:hp(2),backgroundColor:'#ff6d5e'}} title={'Add New Question'}/>
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
