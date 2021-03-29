import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppHeader, Loading} from "../common";
import {getBoothWiseVoterList, getVolunteerBoothDetailsUsingToken} from "../../redux/actions/volunteerAction";
import {color, hp, normalize, wp} from "../../helper/themeHelper";
import {address_location_pin, city_icon, state_icon, ward_icon} from "../../assets/images";



const VolunteerBoothList = props => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const volunteerBooth = useSelector(state => state.volunteerReducer.boothOfVolunteer);
    const volunteerNonBooth = useSelector(state => state.volunteerReducer.boothWithOutVolunteer);
    useEffect(()=>{
        dispatch(getVolunteerBoothDetailsUsingToken()).then((res)=>{
            console.log("res--",res)
        })
    },[])
    const displayVoterList = (boothId,boothName) =>{
        dispatch(getBoothWiseVoterList({boothId})).then((res)=>{
           if(res){
               props.navigation.navigate('BoothWiseVolunteerList',{boothName,boothId})
           }
        })
    }
    const renderVolunteerBooth = ({item, index}) => {

        console.log("data--",item)
        return (
            <View key={Math.random() + 'DE'} style={{paddingVertical:hp(0.5),flex: 1,marginTop:hp(2),flexDirection:'row',backgroundColor: color.lightGreen,borderRadius: hp(2)}}>
                <View style={{flex:7,padding:hp(1)}}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={ward_icon} style={style.listIcon}/>
                        <Text style={style.listText}>{item?.WardMaster?.WardName}</Text>
                    </View>
                    <View style={{flexDirection:'row',}}>
                        <Image source={address_location_pin} style={[style.listIcon,]}/>
                        <Text style={style.listText}>{item?.WardMaster?.WardAddress}</Text>
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
                        displayVoterList(item?.BoothId,item?.WardMaster?.WardName)
                        // updateVolunteerStatusToDb({volunteerId: item?.VolunteerId,boothId:item?.BoothId})
                    }}>
                        <View style={style.listBtn}>
                            <Text style={style.listBtnText}>CHECK LIST</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={'My Booths'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            {volunteerBooth.length ===0 ?
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text>No both till now allocated to you..</Text>
            </View>:

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
export default VolunteerBoothList;
