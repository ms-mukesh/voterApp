import React,{useEffect,useState,useRef} from 'react';
import {View, Text, Keyboard, Alert, StyleSheet,TouchableOpacity,Image} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppButton, AppHeader, FamilyListModel, FloatingLabel, Loading} from "../common";
import {addNewTemplateToDb, fetchTemplateCategory, getFamilyWiseMembers} from "../../redux/actions/userActions";
import {color, hp, isANDROID, normalize, wp} from "../../helper/themeHelper";
import {TemplateCategory} from '../common/'
import * as ImagePicker from 'expo-image-picker';
import {uploadImageOnFirebase} from "../../helper/firebaseUploadFunctions";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";

const AddNewTemplateForDigitalPrinter = props => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [templateCategroyList,setTemplateCatergoryList] = useState([])
    const [categoryFlag,setCategoryFlag] = useState(false)
    const [currentCatergory,setCurrentCategory] = useState(null)
    const [currentCategoryIndex,setCurrentCategoryIndex] = useState(0)
    const [imgUrl,setImgUrl] = useState(null)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: isANDROID?false:true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            await setImgUrl(result.uri);
        }
    };
    const closeFamilyModal=()=>{
        setCategoryFlag(false)
    }
    const updateVoterFamilyId = async (value) =>{
        await setCurrentCategory(value.toString())
    }
    const updateCurrentCategorIndex = async (value) =>{
        await setCurrentCategoryIndex(value.toString())
    }

    const renderNameFloatingTextInputForSelection = (lable, value, key, extraLabel = null) => {
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
                    onFocus={()=>{
                        Keyboard.dismiss()
                        setCategoryFlag(true)
                    }}
                />
            </View>
        );
    };
    useEffect(()=>{
       dispatch(fetchTemplateCategory()).then(async (res)=>{
           await setTemplateCatergoryList(res)
       })
    },[])
    const saveTemplateToDb = () =>{
        if(imgUrl === null){
            alert("please select image")
            return;
        } else if(currentCatergory === null){
            alert("please select Category")
            return;
        } else {
            dispatch(setLoaderStatus(true))
            uploadImageOnFirebase(imgUrl).then((imageUri)=>{
                dispatch(setLoaderStatus(false))
                if(imageUri){
                    let insObj = {
                        TemplateName:templateCategroyList[currentCategoryIndex].CategoryName,
                        Description:templateCategroyList[currentCategoryIndex].Description,
                        TemplateRequirement:templateCategroyList[currentCategoryIndex].Description,
                        CategoryId:currentCatergory,
                        TemplateImage:imageUri,
                    }
                   dispatch(addNewTemplateToDb(insObj)).then((res)=>{
                       if(res){
                           alert("Added Succefully...")
                           setImgUrl(null);
                           setCurrentCategory(null);
                       } else {
                           alert("Fail to create Template")
                       }
                   }).catch((err)=>{
                       alert("Fail to create Template")
                   })
                } else {
                    alert("Fail to create Template")
                }
            }).catch((err)=>{
                dispatch(setLoaderStatus(false))
                alert("Fail to create Template")
            })
        }
    }
    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={'Add New Template'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />

            {categoryFlag &&
            <TemplateCategory updateCurrentCategorIndex={updateCurrentCategorIndex} closeFamilyModal={closeFamilyModal} updateVoterFamilyId={updateVoterFamilyId}
                              familyList={templateCategroyList}/>
            }
            <TouchableOpacity onPress={()=>{
                pickImage()
            }}>
                <View style={style.imgStyle}>
                    {imgUrl!==null ?
                    <Image resizeMode={'cover'} style={[style.imgStyle,{marginTop:0}]} source={{uri:imgUrl}}/>:
                        <Text>Please select Image</Text>
                    }
                </View>
            </TouchableOpacity>

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
                    { renderNameFloatingTextInputForSelection( 'CATEGORY', currentCatergory, "familyId", true,)}
                </View>
            </View>
            <AppButton
                title={'Create Template'}
                onPress={() => {
                    saveTemplateToDb()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
        </View>
    );
};
const style = StyleSheet.create({
    imgStyle:{
        height:hp(40),
        width:wp(95),
        borderRadius:hp(3),
        backgroundColor: color.gray,
        alignSelf:'center',
        marginTop:hp(2),
        alignItems:'center',
        justifyContent:'center'
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
export default AddNewTemplateForDigitalPrinter;
