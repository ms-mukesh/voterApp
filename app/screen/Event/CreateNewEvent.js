import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet, Keyboard,SafeAreaView,TextInput,TouchableOpacity} from 'react-native';
import {AppButton, AppHeader, FloatingLabel, LabelInputText, Loading} from "../common";
import {color, hp, isANDROID, isIOS, normalize, wp} from "../../helper/themeHelper";
import DatePickerModel from "../common/DatePickerModel";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useDispatch, useSelector} from "react-redux";
import {addNewEvent} from "../../redux/actions/eventActions";
import {CommonActions} from '@react-navigation/native';


const defaultEvent = {
    eventName : '',
    eventDate : new Date(),
    address:'',
    guest:'',
    organizer:'',
    description : '',
    taskList : [],
    taskArray : []
}
const CreateNewEventScreen = props => {
    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [taskData,setTaskData] = useState([])
    const [taskDataFlagForDate,setTaskDataFlagForDate] = useState(false)
    const [isDateChanged,setIsDateChange] = useState(false)
    const [eventData,setEventData] = useState({...defaultEvent})
    const [datePickerFlag ,setDatePickerDialog] = useState(false)
    const [dateForDatePicker, setDateForDatePicker] = useState({});
    const [isAllTaskEntered,setIsAllTaskEntered] = useState(false)
    const [currentKey, setCurrentKey] = useState();
    const _setIsShowDatePicker = value => {
        setDatePickerDialog(value);
    };
    const _setDateForDatePicker = key => {
        setDateForDatePicker(eventData[key]);
        setCurrentKey(key);
    };
    useEffect(()=>{
        setEventData({...defaultEvent});
        setEventData({...eventData,taskList:[]})
        setTaskData([]);
    },[])
    const _setDateFromKey = async (value, timeFlag = true) => {
        _setIsShowDatePicker(false);
        if(taskDataFlagForDate){
            let tempArray = taskData;
            tempArray[currentKey].taskDate = value
            await setTaskData(tempArray)
        }else{
           await setIsDateChange(true)
            await setEventData({...eventData,'eventDate' : value});
        }

    };
    const removeTask = async (index) =>{
        let tempArray = eventData.taskList;
        let tempTaskArray = taskData;
        if (index > -1) {
            tempArray.splice(index, 1);
            tempTaskArray.splice(index,1);
            await setTaskData(tempTaskArray)
            await setEventData({...eventData,taskList:tempArray})
        }
    }
    const addTaskTextInput = async (key) => {
        let tempArrayForTaskList = taskData;
        let tempObj = {
            taskTitle:'',
            taskDescription : '',
            taskDate : new Date()
        }
        tempArrayForTaskList.push(tempObj);
        await setTaskData(tempArrayForTaskList)
        let textInput = eventData.taskList;
        textInput.push(eventTaskView(key));
        setEventData({...eventData,taskList: textInput})
    }


    const eventTaskView = (key) =>{
        return(
            <View key={key} style={{flex:1}}>
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
                        'TASK TITLE',
                        taskData[key]['taskTitle'],
                        key,
                        true,
                        'taskTitle',
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
                            'DESCRIPTION',
                            taskData[key]['taskDescription'],
                            key,
                            true,
                            'taskDescription',
                            true
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{removeTask(key)}}>
                <View style={{width:wp(25),marginTop:hp(1),borderRadius:100,alignSelf:'center',height:hp(3),alignItems:'center',justifyContent:'center',backgroundColor:'orange'}}>
                    <Text style={{fontSize:normalize(14),fontWeight: '500'}}>REMOVE</Text>
                </View>
                </TouchableOpacity>
                <View style={{marginTop:hp(1),height:hp(0.3),width:wp(100),alignSelf:'center',backgroundColor:color.gray}}/>
            </View>
        )
    }
    const setTaskDataArray = async (index,value,key) =>{
        let tempArray = [...taskData];
        tempArray[index][key] = value
        await setTaskData([...tempArray])
    }
    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null,taskKeyValue = null,isForTask = false) => {
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
                        isForTask?setTaskDataArray(key,text,taskKeyValue):
                        setEventData({...eventData, [key]: isIOS?text.toUpperCase():text});
                    }}
                />
            </View>
        );
    };
    const renderMultilineFloatingTextInput = (lable, value, key, extraLabel = null,taskKeyValue = null,isForTask = false) => {
        return (
            <View
                style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                }}>
                <LabelInputText
                    multiline={true}
                    numberOfLines={4}
                    inputStyle={style.floatingInputStyle}
                    style={[style.floatingStyle, {width: wp(30)}]}
                    label={lable + '  '}
                    editable={true}
                    value={value}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onChangeText={text => {
                        isForTask?setTaskDataArray(key,text,taskKeyValue):
                            setEventData({...eventData, [key]: isIOS ? text.toUpperCase() : text});
                }}
                />
            </View>
        );
    };
    const renderNameFloatingTextForDob = (lable, value, key, extraLabel = null,isForTask = false) => {
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
                    onFocus={async ()=>{
                        Keyboard.dismiss()
                        await setCurrentKey(key)
                        await setDatePickerDialog(true)
                        await setTaskDataFlagForDate(isForTask)
                    }}
                />
            </View>
        );
    };
    const saveEventToDb = ()=>{
       if(eventData.eventName === ''){
           alert("please enter event name")
           return;
       } else if(eventData.organizer === ''){
           alert("please enter organiser name")
           return;
       } else if(!isDateChanged){
           alert("please select event date")
       }
       else if(eventData.description === ''){
            alert("please enter description")
           return;
       }
       else if(eventData.address === ''){
           alert("please enter event full address")
           return;
       }
        else {
           if(taskData.length > 0){
               taskData.map((task,index)=>{
                   if(task.taskTitle === ''){
                       alert("please enter Task "+parseInt(index+1)+" title");
                       setIsAllTaskEntered(false)
                       return;
                   } else if(task.taskDescription === ''){
                       alert("please add description for "+parseInt(index+1)+" task")
                       setIsAllTaskEntered(false)
                       return;
                   } else {
                       setIsAllTaskEntered(true)
                   }
                   if(taskData.length -1 === index && isAllTaskEntered){
                       let taskInsertObj = {
                           eventName : eventData.eventName,
                           eventDate : new Date(eventData.eventDate).getTime(),
                           eventOrgainser : eventData.organizer,
                           eventGuest : eventData.guest,
                           eventAddress : eventData.address,
                           eventDescription : eventData.description,
                           eventTask : taskData
                       }
                       dispatch(addNewEvent(taskInsertObj)).then((res)=>{
                           if(res){
                               // setEventData(defaultEvent);
                               // setTaskData([]);
                               // setEventData({...eventData,taskList:[]})
                               alert("event addedd sucessfully..!")
                               props.navigation.dispatch(
                                   CommonActions.reset({
                                       index: 0,
                                       routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                                   })
                               );
                           }
                       })


                   }
               })
           } else {
               let taskInsertObj = {
                   eventName : eventData.eventName,
                   eventDate : new Date(eventData.eventDate).getTime(),
                   eventOrgainser : eventData.organizer,
                   eventGuest : eventData.guest,
                   eventAddress : eventData.address,
                   eventDescription : eventData.description,
                   eventTask : taskData
               }
               dispatch(addNewEvent(taskInsertObj)).then((res)=>{
                   if(res){
                       // setEventData(defaultEvent);
                       // setTaskData([]);
                       // setEventData({...eventData,taskList:[]})
                       alert("event addedd sucessfully")
                       props.navigation.dispatch(
                           CommonActions.reset({
                               index: 0,
                               routes: [{name: 'Drawer', params: {setfromLogin: true}}],
                           })
                       );
                   }
               })
           }

       }

    }
    const renderCreateNewEventForm = () =>{
        return(
            <SafeAreaView style={{flex:1}}>
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
                            'EVENT NAME',
                            eventData.eventName,
                            'eventName',
                            true
                        )}

                    </View>



                </View>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={hp(8)}>
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
                                'ORGAINSER NAME',
                                eventData.organizer,
                                'organizer',
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
                                'CHIEF GUEST',
                                eventData.guest,
                                'guest',
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
                            {renderNameFloatingTextForDob(
                                'EVENT DATE',
                                isDateChanged? eventData.eventDate.toLocaleString():eventData.eventDate,
                                'eventDate',
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
                            {renderMultilineFloatingTextInput(
                                'DESCRIPTION',
                                eventData.description,
                                'description',
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
                            {renderMultilineFloatingTextInput(
                                'ADDRESS',
                                eventData.address,
                                'address',
                                true
                            )}
                        </View>
                    </View>

                <Text style={{textAlign:'center',fontSize:normalize(16),fontWeight: '700'}}>EVENT TASK</Text>
                    {eventData.taskList.map((value, index) => {
                    return value
                })}
                <AppButton containerStyle={{marginTop:hp(1)}} title={taskData.length ===0?'Click here to add task':'add more task'} onPress={()=>{addTaskTextInput(eventData.taskList.length)}} />
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
    return (
        <View style={{flex:1}}>
            {isLoading && <Loading isLoading={isLoading} />}
        <AppHeader
            title={'Create New Event'}
            onMenuPress={() => {
                props.navigation.openDrawer()
            }}
            displayIcon = {false}
            rightTitleFlag = {true}
            rightTitle = {'Create'}
            onRightTitlePress={()=>{
                saveEventToDb()
            }}
        />
            {datePickerFlag && (
                <DatePickerModel
                    _setIsShowDatePicker={_setIsShowDatePicker}
                    dateForDatePicker={eventData.eventDate}
                    isShow={datePickerFlag}
                    _setDateFromKey={_setDateFromKey}
                    mode={'datetime'}
                />
            )}
            {
                renderCreateNewEventForm()
            }
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


export default CreateNewEventScreen;
