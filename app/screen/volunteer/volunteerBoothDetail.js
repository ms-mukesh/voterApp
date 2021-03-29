import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppButton, AppHeader, GoBackHeader, LabelInputText, Loading} from "../common";
import {color, hp, normalize, wp} from "../../helper/themeHelper";
import {
    address_location_pin, city_icon,
    complete_task_icon,
    location_pin_icon,
    pending_task_icon, state_icon,
    task_desc_icon,
    task_name_icon,
    ward_icon
} from "../../assets/images";
import {shadowStyle} from "../../helper/styles";
import {getVolunteerBoothDetails, updateVolunteerBothStatus} from "../../redux/actions/volunteerAction";



const VolunteerBoothDetail = props => {
    const {data} = props.route.params
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const volunteerBooth = useSelector(state => state.volunteerReducer.boothOfVolunteer);
    const volunteerNonBooth = useSelector(state => state.volunteerReducer.boothWithOutVolunteer);
    const updateVolunteerStatusToDb = (data)=>{
        let obj = {
            volunteerId : data?.volunteerId,
            wardId : data?.boothId
        }
        dispatch(updateVolunteerBothStatus(obj)).then((res)=>{
            if(res){
                dispatch(getVolunteerBoothDetails({volunteerId:data?.volunteerId})).then((res)=>{})
            }
        })
    }
    const renderVolunteerBooth = ({item, index}) => {
        return (
            <View key={Math.random() + 'DE'} style={{paddingVertical:hp(0.5),flex: 1,marginTop:hp(2),flexDirection:'row',backgroundColor: color.lightGreen,borderRadius: hp(2)}}>
                <View style={{flex:7,padding:hp(1)}}>
                    <View style={{flexDirection:'row'}}>
                    <Image source={ward_icon} style={style.listIcon}/>
                    <Text style={style.listText}>{item?.WardMaster?.WardCode}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Image source={address_location_pin} style={[style.listIcon,]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardMaster?.WardAddress}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Image source={state_icon} style={[style.listIcon,]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardMaster?.WardState}</Text>
                        <Image source={city_icon} style={[style.listIcon,{marginLeft: wp(2)}]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardMaster?.WardCity}</Text>
                    </View>
                </View>
                <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        updateVolunteerStatusToDb({volunteerId: item?.VolunteerId,boothId:item?.BoothId})
                    }}>
                        <View style={style.listBtn}>
                            <Text style={style.listBtnText}>TAKE ACCESS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const renderNonVolunteerBooth = ({item, index}) => {
        return (
            <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(2),flexDirection:'row',backgroundColor: color.gray,borderRadius: hp(2),paddingVertical:hp(0.5)}}>
                <View style={{flex:7,padding:hp(1)}}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={ward_icon} style={style.listIcon}/>
                        <Text style={style.listText}>{item?.WardCode}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Image source={address_location_pin} style={[style.listIcon,]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardAddress}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Image source={state_icon} style={[style.listIcon,]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardState}</Text>
                        <Image source={city_icon} style={[style.listIcon,{marginLeft: wp(2)}]}/>
                        <Text numberOfLines={2} style={style.listText}>{item?.WardCity}</Text>
                    </View>
                </View>
                <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        updateVolunteerStatusToDb({volunteerId:data.VoterId,boothId:item?.WardId})
                    }}>
                        <View style={[style.listBtn,{backgroundColor:color.lightPink}]}>
                            <Text style={style.listBtnText}>GIVE ACCESS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <View style={{flex: 1}}>
            <GoBackHeader
                title={data?.FirstName}
                onMenuPress={() => {
                    props.navigation.goBack()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            <View style={{height:hp(40)}}>
                <View style={{paddingLeft:wp(2)}}>
                    <Text style={style.listHeader}>Volunteer Current Booths</Text>
                </View>
                {volunteerBooth.length ===0 ?
                    <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                    <Text style={style.listText}>No Both are allocated to this volunteer</Text>
                    </View>
                    :
                    <FlatList
                        numColumns={1}
                        data={volunteerBooth}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={true}
                        renderItem={renderVolunteerBooth}
                        keyExtractor={(item, index) => index.toString()}
                    />

                }

            </View>
            <View style={{height:hp(40)}}>
                <View style={{paddingLeft:wp(2)}}>
                    <Text style={style.listHeader}>Volunteer Not have Following Booths</Text>
                </View>
                <FlatList
                    numColumns={1}
                    data={volunteerNonBooth}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={true}
                    renderItem={renderNonVolunteerBooth}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

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
     height:hp(6),
        width:wp(15),
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
export default VolunteerBoothDetail;
