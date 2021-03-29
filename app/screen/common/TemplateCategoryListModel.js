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
import {AutoCompleteModel} from '../common/'
import {SwipeListView} from "react-native-swipe-list-view";
import moment from "../home/dashboard";
import {autoCapitalString} from "../../helper/validation";

const TemplateCategory = props => {
    let tempFamilyMemberName = ""
    const {
        closeModal=null,
        familyList = [],
        updateVoterFamilyId = null,
        closeFamilyModal=null,
        updateCurrentCategorIndex = null
    } = props;

    const _RenderItem = (item, index) => {
        tempFamilyMemberName = ""
        return (
            <View style={{flex: 1,}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:8}}>
                        <View style={{flexDirection:'row',padding:hp(1)}}>
                    <Text style={styles.ListHeader}>Category ID:</Text>
                    <Text style={styles.ListItems}>{item?.CategoryId}</Text>
                </View>
                        <View style={{flexDirection:'row',padding:hp(1)}}>
                            <Text style={styles.ListHeader}>TITLE:</Text>
                            <Text style={styles.ListItems}>{item?.CategoryName}</Text>
                        </View>

                          <View style={{flexDirection:'row',paddingLeft:hp(1)}}>
                    <Text style={styles.ListHeader}>DESCRIPTION:</Text>
                    <Text style={styles.ListItems}>{item?.Description}</Text>

                </View>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{
                        updateVoterFamilyId(item?.CategoryId)
                        updateCurrentCategorIndex(index)
                        closeFamilyModal()
                    }} style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                       <View style={{alignItems:'center',justifyContent:'center',backgroundColor:color.themePurple,borderRadius:wp(1.5),height:hp(3),width:wp(18),alignSelf:'center',justifySelf:'center'}}>
                           <Text style={{fontSize:normalize(13),fontWeight:'500',color:color.white}}>SELECT</Text>
                       </View>
                    </TouchableWithoutFeedback>
                </View>

                <View style={{marginTop:hp(1),height:hp(0.1),width:wp(95),alignSelf:'center',backgroundColor:color.themePurple}}/>
            </View>
        );
    };
     return (
        <Modal onRequestClose={() => closeModal!==null &&closeModal()} visible={true} animated={true} transparent={false}>
            <SafeAreaView style={{flex:1,padding:hp(1),backgroundColor:'white'}}>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                <Text style={{marginLeft:wp(30),textAlign:'center',width:wp(80),fontSize:normalize(20),fontWeight:'800',color:color.themePurple}}>SELECT FAMILY</Text>
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

            </SafeAreaView>
            {/*</TouchableWithoutFeedback>*/}
        </Modal>
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
    fontStyle: {
        color: color.blue,
        fontSize: normalize(17),
        // fontFamily: font.robotoBold,
        textAlign: 'center',
        // marginTop: hp(8),
    },
    ListHeader:{fontWeight:'600',fontSize:normalize(16),color:color.themePurple},
    ListItems:{marginLeft:wp(2),width:wp(58),fontWeight:'400',fontSize:normalize(16),color:color.black},
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
export {TemplateCategory}
