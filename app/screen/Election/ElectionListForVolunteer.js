import React,{useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity,TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppHeader, GoBackHeader, Loading} from "../common";
import {getVolunteerBoothDetailsUsingToken} from "../../redux/actions/volunteerAction";
import {
    fetchElectionList,
    getVolunteerElection, getVolunteerElectionBoothUsingToken,
    getVolunteerElectionUsingToken,
    getVoterForElection
} from "../../redux/actions/election";
import {ADMIN, VOLUNTEER} from "../../helper/constant";
import {color, hp, normalize, wp} from "../../helper/themeHelper";
import {address_location_pin, state_icon, ward_icon} from "../../assets/images";
import moment from "moment";
import {isDefined} from "../functions";


const ElectionList = props => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const ElectionList = useSelector(state => state.electionReducer.electionList);
    useEffect(()=>{
        dispatch(fetchElectionList()).then((res)=>{
            console.log("data--",res)
        })
    },[])
    const displayBoothList = (electionId,electionDate) =>{
        if(isDefined(electionDate)) {
            let electionDateforDiff = moment(electionDate).format("MM/DD/YYYY");
            let todayDate = moment(new Date().getTime()).format("MM/DD/YYYY");
            let dateDiff = moment(electionDateforDiff).diff(todayDate, 'days');
            if(dateDiff<=0){
                dispatch(getVolunteerElectionBoothUsingToken({
                    electionId
                })).then((res)=>{
                    if(res){
                        props.navigation.navigate('BoothList',{
                            electionId:electionId
                        })
                    }
                })
            } else {
                alert("Election is not started yet...please wait")
            }
        } else {
            alert("There is not election date..so we can not move further..")
        }


    }

    const renderVolunteerElection = ({item, index}) => {
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayBoothList(item?.ElectionMasterId,item?.ElectionDate)
            }}>
                <View key={Math.random() + 'DE'} style={{paddingVertical:hp(0.5),flex: 1,marginTop:hp(2),flexDirection:'row',backgroundColor: color.gray,borderRadius: hp(2)}}>
                    <View style={{flex:7,padding:hp(1)}}>
                        <View style={{flexDirection:'row'}}>
                            <Image source={ward_icon} style={style.listIcon}/>
                            <Text style={style.listText}>{item?.ElectionName}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={address_location_pin} style={[style.listIcon,]}/>
                            <Text numberOfLines={2} style={style.listText}>{moment(item?.ElectionDate).format("DD-MM-YYYY")}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Image source={state_icon} style={[style.listIcon,]}/>
                            <Text numberOfLines={4} style={[style.listText,{width:wp(90)}]}>{item?.OtherInformation}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={"Election List"}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            {ElectionList.length ===0 ?
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text>No election found...</Text>
                </View>:
                <FlatList
                    numColumns={1}
                    data={ElectionList}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={true}
                    renderItem={renderVolunteerElection}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
        </View>
    );
};
const style = StyleSheet.create({
    listHeader:{
        fontSize:normalize(20),
        fontWeight: '700',
        color:color.themePurple
    },
    listIcon:{
        height:hp(2.5),
        width:hp(2.5)
    },
    listBtn:{
        height:hp(3.5),
        width:wp(23),
        borderRadius:hp(0.8),
        backgroundColor:'orange',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listBtnText:{
        fontSize:normalize(10),
        fontWeight:'700'
    },
    listText:{alignSelf:'center',fontSize:normalize(14),fontWeight: '500',marginLeft:wp(3)}
})

export default ElectionList;
