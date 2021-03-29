import React,{useState,useEffect} from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Image,
    TouchableOpacity,
    Keyboard,
    FlatList
} from 'react-native';
import {hp, wp, normalize, color, isANDROID, isIOS} from "../../helper/themeHelper";
import {FloatingLabel} from "./FloatingLabel";
import userImage from "../../assets/images/user_male.png";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import SafeAreaView from "react-native-safe-area-view";
import {LoadingWithLabel} from "./Loading";
import {LabelInputText} from "./LabelInputText";
import {AppButton, AutoCompleteModel} from '../common/'
import {SwipeListView} from "react-native-swipe-list-view";
import moment from "../home/dashboard";
import {autoCapitalString} from "../../helper/validation";
import {address_location_pin, city_icon, state_icon, ward_icon} from "../../assets/images";

const BoothListModel = props => {
    let tempFamilyMemberName = ""
    const {
        createNewFamilyFlag = false,
        closeModal=null,
        autoCompleteData=[],
        familyList = [],
        updateVoterFamilyId = null,
        closeFamilyModal=null,
        onNewBoothPress=null,
        showNewBoothButton=true
    } = props;

    const _RenderItem = (item, index) => {
         return (
            <View key={Math.random() + 'DE'} style={{paddingVertical:hp(0.5),flex: 1,marginTop:hp(2),flexDirection:'row',backgroundColor: color.lightGreen,borderRadius: hp(2)}}>
                <View style={{flex:7,padding:hp(1)}}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={ward_icon} style={style.listIcon}/>
                        <Text style={style.listText}>{item?.WardName}</Text>
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
                        updateVoterFamilyId(item?.WardId)
                        closeFamilyModal()
                    }}>
                        <View style={style.listBtn}>
                            <Text style={style.listBtnText}>SELECT</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
     return (
        <Modal onRequestClose={() => closeModal!==null &&closeModal()} visible={true} animated={true} transparent={false}>
            <SafeAreaView style={{flex:1,padding:hp(1),backgroundColor:'white'}}>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Text style={{marginLeft:wp(30),textAlign:'center',width:wp(80),fontSize:normalize(20),fontWeight:'800',color:color.themePurple}}>SELECT BOOTH</Text>
                <Text onPress={()=>{
                    closeFamilyModal()
                }} style={{paddingRight:wp(20),alignSelf:'center',justifySelf:'center',fontSize:normalize(10),fontWeight:'500',color:color.black}}>CLOSE</Text>
                </View>
                <FlatList
                    data={
                        familyList
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => _RenderItem(item, index)}
                    horizontal={false}
                    bounces={isANDROID ? false : true}
                />
                {showNewBoothButton &&
                <AppButton onPress={() => {
                    onNewBoothPress()
                }} title={'Create New Booth'}/>
                }


            </SafeAreaView>
            {/*</TouchableWithoutFeedback>*/}
        </Modal>
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
export {BoothListModel}
