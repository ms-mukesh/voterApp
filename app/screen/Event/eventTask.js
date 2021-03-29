import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert,Image} from 'react-native';
import {GoBackHeader} from "../common";
import {color, hp, isANDROID, normalize, wp} from "../../helper/themeHelper";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchAllVolunteer,
    fetchEventInformationForTask,
    updateEventInformation
} from "../../redux/actions/eventActions";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
    complete_task_icon,
    mail_icon,
    mobile_icon,
    organiser_icon,
    pending_task_icon,
    task_desc_icon,
    task_name_icon
} from "../../assets/images";
import moment from "./allocateTask";



const EventTask = props => {
    const {TaskDataIndex} = props.route.params
    const [volunteerListFlag,setVolunteerFlag] = useState(false)
    const [volunteer,setVolunteer] = useState([])
    const dispatch = useDispatch()
    const [currentTaskId,setCurrentTaskId] = useState(1)
    const EventInformation = useSelector(state => state.eventInformationReducer.events);
    // console.log(TaskData.eventTask)
    useEffect(()=>{
       dispatch(fetchAllVolunteer()).then(async (res)=>{
           if(res){
               await setVolunteer(res)
               console.log(volunteer)
           }
       })
    },[])

    const renderTaskList = ({item, index}) => {
        return (
            <TouchableOpacity onPress={async ()=>{
                item?.Status === 'Pending' &&await setVolunteerFlag(true)
                item?.Status === 'Pending' && await setCurrentTaskId(item.TaskId)
            }}>
                <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(2)}}>
                    <View style={{padding:hp(1),borderRadius:hp(1),alignSelf:'center',backgroundColor:item.VolunteerId!==null?color.lightGreen:'orange',flex:1,width:wp(95)}}>
                        <Image source={item?.Status ==='Pending'?pending_task_icon:complete_task_icon} style={[styles.taskEventIcon,{alignSelf:'flex-end'}]}/>
                        {item?.Status ==='Pending' &&<Text style={[styles.eventValue,{alignSelf:'flex-end'}]}>{'PENDING'}</Text>}
                        <View style={{flexDirection:'row'}}>
                            <Image source={task_name_icon} style={styles.taskEventIcon}/>
                            <Text style={styles.eventValue}>{item?.TaskName}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={task_desc_icon} style={styles.taskEventIcon}/>
                            <Text style={styles.eventValue}>{item?.Description}</Text>
                        </View>
                        {
                            item.VolunteerId!==null &&
                                <View style={{flex:1}}>
                            <View style={{flexDirection:'row'}}>
                                <Image source={organiser_icon} style={styles.taskEventIcon}/>
                                <Text style={styles.eventValue}>{item?.VolunteerName}</Text>
                            </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={mobile_icon} style={styles.taskEventIcon}/>
                                        <Text style={styles.eventValue}>{item?.VolunteerMobile}</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={mail_icon} style={styles.taskEventIcon}/>
                                        <Text style={styles.eventValue}>{item?.VolunteerEmail}</Text>
                                    </View>
                                </View>
                        }
                        {
                            item.VolunteerId === null &&
                            <View style={{marginTop:hp(1),alignItems:'center',justifyContent:'center'}}>
                                <View style={{height:hp(3),width:wp(25),backgroundColor:color.themePurple,borderRadius:hp(2),alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontWeight:'700',fontSize:normalize(12),color:color.white}}>ALLOCATE</Text>
                                </View>
                            </View>

                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const allocateTaskAndToDb = (data) =>{
        Alert.alert(
            '',
            'Are you sure you want to assign task',
            [
                {
                    text: 'No',
                    onPress: () => {
                        console.log('ok');
                    },
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        let obj = {
                            taskId:currentTaskId,
                            volunteerId:data.VoterId
                        }
                        dispatch(updateEventInformation(obj)).then((res)=>{
                            if(res){
                                dispatch(fetchEventInformationForTask()).then((res)=>{})
                                setVolunteerFlag(false)
                            }
                        })

                    },
                },
            ],
            {
                cancelable: false,
            }
        );
    }
    const renderVolunteerList = ({item, index}) => {
        console.log(item)
        return (
            <TouchableOpacity onPress={()=>{
                setVolunteerFlag(true)
                // props.navigation.navigate('TaskView',{TaskData:eventData[index]})
            }}>
                <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(2)}}>
                    <View style={{padding:hp(1),borderRadius:hp(1),alignSelf:'center',backgroundColor:item.VolunteerId!==null?color.lightGreen:'orange',flex:1,width:wp(95)}}>
                        <View style={{flexDirection:'row'}}>
                            <Image source={organiser_icon} style={styles.taskEventIcon}/>
                            <Text style={styles.eventValue}>{item?.FirstName + " " + item?.MiddleName}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={mobile_icon} style={styles.taskEventIcon}/>
                            <Text style={styles.eventValue}>{item?.Mobile}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={mail_icon} style={styles.taskEventIcon}/>
                            <Text style={styles.eventValue}>{item?.Email}</Text>
                        </View>

                        <View style={{marginTop:hp(1),alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                allocateTaskAndToDb(item)
                            }}>
                            <View style={{height:hp(3),width:wp(25),backgroundColor:color.themePurple,borderRadius:hp(2),alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontWeight:'700',fontSize:normalize(12),color:color.white}}>ASSIGN</Text>
                            </View>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>
            </TouchableOpacity>
        );
    };
        return (
        <View style={{flex: 1}}>
            <GoBackHeader title={EventInformation[TaskDataIndex]?.eventData?.EventName} onMenuPress={() => props.navigation.goBack()} />
            <Text style={{marginTop:hp(1),fontSize:normalize(18),fontWeight:'700',alignSelf:'center',}}>TASK LIST</Text>
            <FlatList
                numColumns={1}
                // data={[...data.imgPath, ...data.docPath]}
                data={EventInformation[TaskDataIndex].eventTask.length>0 && EventInformation[TaskDataIndex].eventTask}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderTaskList}
                keyExtractor={(item, index) => index.toString()}
            />
            {volunteerListFlag && volunteer.length > 0 &&
            <Modal
                onRequestClose={() => {
                   setVolunteerFlag(false)
                }}
                visible={true}
                animated={true}
                transparent={true}>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <View style={{height:hp(100),width:wp(100),backgroundColor: 'rgba(1,17,20,0.89)'}}>
                    <View style={{height:hp(5)}}/>
                    <Text onPress={()=>{
                        setVolunteerFlag(false)
                    }} style={{fontSize:normalize(15),fontWeight:'700',color:color.white,alignSelf:'flex-end',marginRight:wp(5)}}>Close</Text>
                    <FlatList
                        numColumns={1}
                        // data={[...data.imgPath, ...data.docPath]}
                        data={volunteer.length>0 && volunteer}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={true}
                        renderItem={renderVolunteerList}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                </View>
            </Modal>
            }
            <View style={{height:hp(3)}}/>
        </View>
    );
};
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerMain: {
        height: hp(52),
        width: wp(82),
        backgroundColor: color.white,
        borderRadius: wp(2),
    },
    closeIcon: {
        flexDirection: 'row-reverse',
        marginTop: wp(2),
        marginLeft: wp(2),
    },
    logoStyle: {
        height: hp(10),
        width: hp(10),
        position: 'absolute',
        top: hp(-5),
    },
    center: {alignItems: 'center', justifyContent: 'center'},
    heading: {
        fontSize: normalize(18),
        color: color.blue,
        // fontFamily: font.robotoRegular,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        width: wp(82),
        backgroundColor: color.gray,
        marginTop: hp(1),
    },
    listMainView: {
        // marginVertical: hp(0.5),
        // marginHorizontal: hp(0.5),
        // borderRadius: hp(0.5),
        padding: hp(0.8),
        flexDirection: 'row',
        height: hp(8),
        borderBottomWidth: wp(0.2),
        borderBottomColor: color.lightBlue,
    },
    nameText: {
        fontSize: normalize(14),
        color: color.blue,
        // fontFamily: font.robotoRegular,
        marginTop: hp(1.7),
        fontWeight: 'bold',
    },
    btnLayout: {
        backgroundColor: color.blue,
        width: wp(60),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1.5),
        alignSelf: 'center',
    },
    btnText: {
        fontSize: normalize(16),
        // fontFamily: font.robotoBold,
        color: color.white,
    },
    imageView: {
        height: hp(5),
        width: hp(5),
        borderRadius: hp(2.5),
        alignSelf: 'center',
        marginLeft: wp(1.5),
    },
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
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
        marginHorizontal: wp(1),
        flex: 1,
    },
    taskEventIcon:{
        height:hp(2),
        width:hp(2)
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
    eventHeading:{fontSize:normalize(15),fontWeight:'500'},
    eventValue:{marginLeft:wp(2),fontSize:normalize(15),fontWeight:'400'},
    validationStart: {position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5)},
    radioButtonOutterCircle:{alignItems:'center',justifyContent:'center',height:hp(3),width:hp(3),borderRadius:hp(1.5),borderWidth:hp(0.2)},
    radioButtonInnerCircle:{height:hp(1.6),width:hp(1.6),borderRadius:hp(0.8),backgroundColor: color.themePurple}
});

export default EventTask;
