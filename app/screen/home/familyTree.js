import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {AppButton, AppHeader, FamilyListModel, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {getFamilyWiseMembers} from "../../redux/actions/userActions";
import {color, hp, isANDROID, isWEB, normalize, wp} from "../../helper/themeHelper";
import {getFamilyTreeInformation} from "../../redux/actions/dashboardAction";
const FamilyTreeScreen = props => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const familyListArray = useSelector(state => state.dashboardReducer.familyListArray);
    const [familListModelFlag,setFamilyListModelFlag] = useState(false)
    const [familyList,setFamilyList] = useState([])
    const [voterFamilyId,setVoterFamily] = useState("")
    const [currentFamilyTreeInformation,setCurrentFamilyInformation] = useState([])
    const closeFamilyModal=()=>{
        setFamilyListModelFlag(false)
    }
    const updateVoterFamilyId = async (value) =>{
        await setVoterFamily(value)
        dispatch(getFamilyTreeInformation({familyId:value})).then(async (res)=>{
            if(res){
                await setCurrentFamilyInformation(res)
                await setFamilyListModelFlag(true)
            }
        })
    }
    useEffect(()=>{
        dispatch(getFamilyWiseMembers()).then(async (res)=>{
            if(res){
                await setFamilyList(res)

            }
        })
    },[])

    const renderFamilyTree = ({item, index}) => {
        return (
            <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(2),alignItems:'center',padding:hp(1),backgroundColor:color.lightGreen,borderRadius:hp(2),marginLeft:wp(3),marginRight:wp(3)}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.familyTreeText}>{item?.FirstName.toUpperCase()}<Text>{item?.Gender==="male"?" (male) ":" (female) "}</Text></Text>
                    {item?.FatherEntry &&
                    <Text style={styles.familyTreeText}>{item?.Gender==="male"?" Son of "+item?.FatherEntry?.FirstName.toUpperCase():" Daughter of "+item?.FatherEntry?.FirstName.toUpperCase()}</Text>
                    }
                    {item?.SpouseEntry &&
                    <Text style={styles.familyTreeText}>{" Married to "+item?.SpouseEntry?.FirstName.toUpperCase()}</Text>
                    }
                </View>
                <View style={{flexDirection:'row',}}>
                    <Text style={styles.familyTreeText}>{"AGE:-"+item?.Age}</Text>
                    <Text style={styles.familyTreeText}>{" VOTER ID:-"+item?.VoterVotingId}</Text>
                </View>
            </View>
        );
    };
    const _RenderItem = (item, index) => {
        let tempFamilyMemberName = ""
        return (
            <View style={{flex: 1,}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:8}}>
                        <View style={{flexDirection:'row',padding:hp(1)}}>
                            <Text style={styles.ListHeader}>FAMILY ID:</Text>
                            <Text style={styles.ListItems}>{item[0]}</Text>
                        </View>
                        <View style={{flexDirection:'row',paddingLeft:hp(1)}}>
                            <Text style={styles.ListHeader}>MEMBERS:</Text>
                            {item[1].map((name,index)=>{
                                tempFamilyMemberName = tempFamilyMemberName+name.Name+","
                            })}
                            <Text multiLine={true} numberOfLines={10} style={styles.ListItems}>{tempFamilyMemberName.substring(0,tempFamilyMemberName.length-1)}</Text>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>{
                        updateVoterFamilyId(item[0])
                        // closeFamilyModal()
                    }} style={{flex:2,alignItems:'center',justifyContent:'center'}}>
                        <View style={{alignItems:'center',justifyContent:'center',backgroundColor:color.themePurple,borderRadius:wp(1.5),height:isWEB?hp(5):hp(3),width:isWEB?wp(10):wp(18),alignSelf:'center',justifySelf:'center'}}>
                            <Text style={{fontSize:normalize(12),fontWeight:'500',color:color.white}}>SELECT</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <View style={{marginTop:hp(1),height:hp(0.1),width:wp(95),alignSelf:'center',backgroundColor:color.themePurple}}/>
            </View>
        );
    };

    return (
        <View style={{flex: 1}}>

            {/*{familListModelFlag &&*/}
            {/*<FamilyListModel closeFamilyModal={closeFamilyModal} updateVoterFamilyId={updateVoterFamilyId} familyList={familyList}/>}*/}
            <AppHeader title={'Family Tree'} onMenuPress={()=>{
                props.navigation.openDrawer()
            }} />
            <View style={{height:hp(2)}}/>
            {familListModelFlag &&
            <AppButton title={'Select Another Family'} onPress={() => {
                setFamilyListModelFlag(false)
            }}/>
            }
            {familListModelFlag ?
                <FlatList
                numColumns={1}
                data={currentFamilyTreeInformation}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderFamilyTree}
                keyExtractor={(item, index) => index.toString()}
            />:
                <FlatList
                    data={
                        familyList
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => _RenderItem(item, index)}
                    horizontal={false}
                    bounces={isANDROID ? false : true}
                />
            }
            {isLoading && <Loading isLoading={isLoading} />}

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
    fontStyle: {
        color: color.blue,
        fontSize: normalize(17),
        // fontFamily: font.robotoBold,
        textAlign: 'center',
        // marginTop: hp(8),
    },
    ListHeader:{fontWeight:'600',fontSize:normalize(12),color:color.themePurple},
    ListItems:{marginLeft:wp(2),width:wp(58),fontWeight:'400',fontSize:normalize(10),color:color.black},
    subfontStyle: {
        fontSize: normalize(10),
        // fontFamily: font.robotoBold,
        textAlign: 'center',
        marginLeft: wp(1),
        color: color.blue,
        marginTop: wp(2),
    },
    familyTreeText:{
      fontSize:normalize(13)
    },
    validationStart: {position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5)},
    radioButtonOutterCircle:{alignItems:'center',justifyContent:'center',height:hp(3),width:hp(3),borderRadius:hp(1.5),borderWidth:hp(0.2)},
    radioButtonInnerCircle:{height:hp(1.6),width:hp(1.6),borderRadius:hp(0.8),backgroundColor: color.themePurple}
});


export default FamilyTreeScreen;
