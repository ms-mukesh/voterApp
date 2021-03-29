import React,{useEffect,useState,useRef} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    Keyboard,
    SafeAreaView,
    TextInput,
    Alert, Modal,
    ImageBackground

} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppButton, AppHeader, FloatingLabel, GoBackHeader, LabelInputText, Loading} from "../common";
import {addMemberTemplateToDb, fetchAllTemplates} from "../../redux/actions/eventActions";
import {color, hp, isANDROID, isIOS, normalize, wp} from "../../helper/themeHelper";
import {mail_icon, mobile_icon, organiser_icon} from "../../assets/images";
import * as ImagePicker from 'expo-image-picker';
import {uploadImageOnFirebase} from "../../helper/firebaseUploadFunctions";
import * as Print from "expo-print";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";
import * as Sharing from "expo-sharing";

import { captureRef } from 'react-native-view-shot';

import {memberLogut} from "../../redux/actions/userAuth";

const defaultObj = {firstLabel:'',
    secondLabel:'',
    thirdLabel:'',
    firstImage:null,
    firstImageLinkUrl : null,
    secondImage:null,
    secondImageLinkUrl : null,
    thirdImage:null,
    thirdImageLinkUrl : null,
    fourthImage:null,
    fourthImageLinkUrl : null,
    fifthImage:null,
    fifthImageLinkUrl : null}

const TemplateDetailScreen = props => {
    const dispatch = useDispatch();
    const {templateTitle = '',templateImage = null,categoryId = 1} = props.route.params
    const [image, setImage] = useState(null);
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [isImageUploaded,setIsImageUploaded] = useState(false)
    const [templateDetail,setTemplateDetail] = useState(defaultObj)
    const [fullScreenFlag,setFullScreenFlag] = useState(false)
    const viewRef = useRef(null);
    const templateList = useSelector(state => state.eventInformationReducer.templateList);
    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null,isMultiLine=false,isPressable = false,characterLength = 20) => {
        return (
            <View
                style={{
                    width:wp(90),
                    alignSelf:'center',
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                }}>
                {isMultiLine?<LabelInputText
                        multiline={true}
                        numberOfLines={4}
                        inputStyle={styles.floatingInputStyle}
                        style={[styles.floatingStyle, {width: wp(30)}]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={text => {
                            templateDetail[key].toString().length>characterLength ?alert("not allowed more than"+characterLength+"charatcers"):
                            setTemplateDetail({...templateDetail, [key]: isIOS ? text.toUpperCase() : text});
                    }}
                    />:
                    <FloatingLabel
                        numberOfLines={1}
                        inputStyle={styles.floatingInputStyle}
                        style={[styles.floatingStyle]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={text => {
                            text.toString().length>characterLength ?alert("not allowed more than"+characterLength+"charatcers"):
                            setTemplateDetail({...templateDetail, [key]: isIOS ? text.toUpperCase() : text});
                        }}
                    />}

            </View>
        );
    };
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: isANDROID?false:true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            await setImage(result.uri);
            await setTemplateDetail({...templateDetail,firstImage: result.uri})
            // uploadImageOnFirebase(result.uri).then((res)=>{
            //     console.log("upload res--",res)
            // })
        }
    };
    const pickSecondImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: isANDROID?false:true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            await setTemplateDetail({...templateDetail,secondImage: result.uri})
            // uploadImageOnFirebase(result.uri).then((res)=>{
            //     console.log("upload res--",res)
            // })
        }
    };
    const createTemplateAndUploadToFirebase = () =>{
        return new Promise(async (resolve)=>{
            try {
                dispatch(setLoaderStatus(true))

                let result = await captureRef(viewRef, {
                    format: 'png',
                })
                if(result){
                    // setTimeout(()=>{
                        setFullScreenFlag(false)
                    // },100)
                    uploadImageOnFirebase(result).then((imgUrl)=>{
                        if(imgUrl){
                            let obj = {
                                templateImage:imgUrl
                            };
                            dispatch(addMemberTemplateToDb(obj)).then((isAdded)=>{
                                dispatch(setLoaderStatus(false))
                                if(isAdded){
                                    return resolve(true)
                                } else{
                                    return resolve(false)
                                }
                            }).catch((err)=>{
                                return resolve(false)
                            })
                        } else {
                            dispatch(setLoaderStatus(false))
                            return resolve(false)
                        }
                    }).catch((err)=>{
                        dispatch(setLoaderStatus(false))
                        return resolve(false)
                    })
                }

                // let saveResult = await CameraRoll.save(result, {type: 'photo'});
            }
            catch(snapshotError) {
                console.error(snapshotError);
                dispatch(setLoaderStatus(false))
                return  resolve(false)
            }
        })
    }
    const createImage = async () =>{
        Alert.alert(
            'Done!',
            'Are you sure you want to create Image',
            [
                {
                    text: 'Need to edit again',
                    onPress: () => {
                        setFullScreenFlag(false)
                    },
                },
                {
                    text: 'Yes',
                    onPress: () => {
                      createTemplateAndUploadToFirebase().then((res)=>{
                          if(res){
                              alert("Created Succesfully....!")
                              props.navigation.goBack()
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
    // const createTwoImage = async () =>{
    //     // dispatch(setLoaderStatus(true))
    //     let html = `<div style="position:relative;text-align: center; color: white;">`;
    //     html += '<img src="'+templateImage+'" alt="Snow" style="width:100%;">'
    //     // html += '<div style="position: absolute;bottom: 8px;left: 20px;"><img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png" alt="Snow" style="width:18%;height:15%;border-radius:100%"></div>'
    //     // html += '<div style="position: absolute;top: 8px;right: 16px;"><font color="black" size="15px"><b> '+templateDetail.firstLabel+' </b></font></div>'
    //     // html += '<div style="position: absolute;bottom: 8px;right: -10%;"><img src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png" alt="Snow" style="width:18%;height:15%;border-radius:100%"></div>'
    //     // html +='</div>'
    //     // const templateImageOutput = await Print.printToFileAsync({ html,base64: false });
    //     dispatch(setLoaderStatus(true))
    //     await uploadImageOnFirebase(templateDetail.firstImage).then(async (customFirstImage)=>{
    //         if(customFirstImage){
    //             html += '<div style="position: absolute;bottom: 8px;left: 20px;"><img src='+customFirstImage+' alt="Snow" style="width:180px;height:180px;border-radius:100%"></div>'
    //             html += '<div style="position: absolute;top: 8px;right: 16px;"><font color="black" size="15px"><b> '+templateDetail.firstLabel+' </b></font></div>'
    //             html += '<div style="position: absolute;top: 8px;left: 16px;"><font color="black" size="10px"><b> '+templateDetail.secondLabel+' </b></div>'
    //         } else {
    //             dispatch(setLoaderStatus(false))
    //             alert("failed to create")
    //             return;
    //         }
    //     }).catch((err)=>{
    //         dispatch(setLoaderStatus(false))
    //     })
    //     await uploadImageOnFirebase(templateDetail.secondImage).then(async (customSecondImage)=>{
    //         if(customSecondImage){
    //             html += '<div style="position: absolute;bottom: 8px;right: 0%;"><img src='+customSecondImage+' alt="Snow" style="width:180px;height:180px;border-radius:100%"></div>'
    //             html +='</div>'
    //         } else {
    //             dispatch(setLoaderStatus(false))
    //             alert("failed to create")
    //             return;
    //         }
    //     }).catch((err)=>{
    //         dispatch(setLoaderStatus(false))
    //     })
    //
    //     const templateImageOutput = await Print.printToFileAsync({ html,base64: false });
    //     const options = {
    //         mimeType: 'application/pdf',
    //         dialogTitle: 'Open file',
    //         UTI: 'com.adobe.pdf',
    //     };
    //
    //     uploadPdfOnFirebase(templateImageOutput.uri).then((wholeCustomImage)=>{
    //         if(wholeCustomImage){
    //             let obj = {
    //                 templateImage:wholeCustomImage
    //             }
    //             dispatch(addMemberTemplateToDb(obj)).then(async (isAdded)=>{
    //                 if(isAdded){
    //                     await setTemplateDetail(defaultObj)
    //                     Alert.alert(
    //                         '',
    //                         'Want to share?',
    //                         [
    //                             {
    //                                 text: 'No',
    //                                 onPress: () => {
    //                                     props.navigation.goBack()
    //                                 },
    //                             },
    //                             {
    //                                 text: 'Yes',
    //                                 onPress: async () => {
    //                                     Sharing.shareAsync(templateImageOutput.uri, options).then((res)=>{
    //                                         props.navigation.goBack()
    //                                     }).catch((err)=>{
    //                                         props.navigation.goBack()
    //                                     })
    //                                 },
    //                             },
    //                         ],
    //                         {
    //                             cancelable: false,
    //                         }
    //                     );
    //
    //                 } else {
    //                     alert("failed to create image")
    //                     dispatch(setLoaderStatus(false))
    //                 }
    //             })
    //         } else {
    //             dispatch(setLoaderStatus(false))
    //             alert("fail to create image")
    //         }
    //
    //     }).catch((err)=>{
    //         dispatch(setLoaderStatus(false))
    //         alert("fail to create image")
    //     })
    // }
    // const uploadImage = (imageUrl) =>{
    //     dispatch(setLoaderStatus(true))
    //     uploadImageOnFirebase(imageUrl).then((res)=>{
    //         dispatch(setLoaderStatus(false))
    //         if(res){
    //             setTemplateDetail({...templateDetail,firstImageLinkUrl: res})
    //             setIsImageUploaded(true)
    //         } else{
    //             alert("fail to upload images...please try again")
    //         }
    //     }).catch((err)=>{
    //         dispatch(setLoaderStatus(false))
    //     })
    // }
    const checkImagePreiview = () =>{
        setFullScreenFlag(true)
        setTimeout(()=>{
            alert("Touch any where To create your Template")
        },1000)
        // alert("Touch any where To create your Template")
    }

    const renderSingleImageForm = () =>{
        return(
            <View>
                {templateDetail.firstImage===null ? <TouchableOpacity onPress={()=>{pickImage()}}><View style={[styles.selectImageView,{backgroundColor: 'gray'}]}>
                        <Text style={[styles.templateText,{fontWeight: '700'}]}>SELECT IMAGE</Text>
                    </View></TouchableOpacity>:
                    <TouchableOpacity onPress={()=>{pickImage()}}><Image style={styles.selectImageView} source={{ uri: templateDetail.firstImage }}/></TouchableOpacity>
                }
                <View style={{flex:1}}>
                    {renderNameFloatingTextInput("enter a message...",templateDetail.firstLabel,'firstLabel',true)}
                </View>
                {categoryId === 3 &&
                <View style={{flex:1}}>
                    {renderNameFloatingTextInput("enter message...",templateDetail.secondLabel,'secondLabel',true)}
                </View>
                }
                <View style={{height:hp(2)}}/>
                <AppButton disabled={isImageUploaded} title={'SAVE'} onPress={()=>checkImagePreiview()}/>
            </View>
        )
    }

    const renderTwoImageForm = () =>{
        return(
            <View>
                {templateDetail.firstImage===null ? <TouchableOpacity onPress={()=>{pickImage()}}><View style={[styles.selectImageView,{backgroundColor: 'gray'}]}>
                        <Text style={[styles.templateText,{fontWeight: '700'}]}>SELECT IMAGE</Text>
                    </View></TouchableOpacity>:
                    <TouchableOpacity onPress={()=>{pickImage()}}><Image style={styles.selectImageView} source={{ uri: templateDetail.firstImage }}/></TouchableOpacity>
                }
                <View style={{height:hp(2)}}/>
                {templateDetail.secondImage===null ? <TouchableOpacity onPress={()=>{pickSecondImage()}}><View style={[styles.selectImageView,{backgroundColor: 'gray'}]}>
                        <Text style={[styles.templateText,{fontWeight: '700'}]}>SELECT IMAGE</Text>
                    </View></TouchableOpacity>:
                    <TouchableOpacity onPress={()=>{pickImage()}}><Image style={styles.selectImageView} source={{ uri: templateDetail.secondImage }}/></TouchableOpacity>
                }
                <View style={{flex:1}}>
                    {renderNameFloatingTextInput("enter a message...",templateDetail.firstLabel,'firstLabel',true)}
                </View>
                {categoryId === 4 &&
                <View style={{flex:1}}>
                    {renderNameFloatingTextInput("enter a message...",templateDetail.secondLabel,'secondLabel',true)}
                </View>
                }
                <View style={{height:hp(2)}}/>
                <AppButton disabled={isImageUploaded} title={'SAVE'} onPress={()=>checkImagePreiview()}/>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            {isLoading && <Loading isLoading={isLoading} />}
            {fullScreenFlag &&
            <Modal onRequestClose={() => setFullScreenFlag(false)} visible={true} animated={true}
                   transparent={false}>
                <SafeAreaView style={{flex:1}}>
                    <TouchableOpacity onPress={()=>{
                        createImage()
                    }}>
                    <ImageBackground ref={viewRef} style={{height:hp(100),width:wp(100),backgroundColor:color.lightGray}} source={{uri:templateImage}} resizeMode={'cover'}>
                        {/*<Text style={styles.textStyleFullScreen}>{templateDetail.firstLabel}</Text>*/}
                        {/*<Image style={styles.templateSmallCircleImageFullScreen} source={{uri:templateDetail.firstImage}} />*/}
                        {/*<Image style={[styles.templateSmallCircleImageFullScreen,{marginLeft:wp(0),marginTop:0}]} source={{uri:templateDetail.secondImage}} />*/}
                        {/*<Text style={styles.textStyleFullScreen}>{templateDetail.secondLabel}</Text>*/}
                        <View style={{flex:1}}>
                            <View style={{flex:1,flexDirection: 'row',marginTop:hp(1.5)}}>
                                <Text style={[styles.textStyleFullScreen,{flex:1.2,}]}>{templateDetail.secondLabel}</Text>
                                <Text style={[styles.textStyleFullScreen,{flex:1}]}>{templateDetail.firstLabel}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',marginBottom:hp(5)}}>
                                <View style={{flex:1}}>
                                <Image style={styles.templateSmallCircleImageFullScreen} source={{uri:templateDetail.secondImage}} />
                                </View>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                <Image style={[styles.templateSmallCircleImageFullScreen]} source={{uri:templateDetail.firstImage}} />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
            }
            <GoBackHeader
                title={templateTitle}
                onMenuPress={() => {
                    props.navigation.goBack()
                }}
            />

            {templateImage!==null &&
                <View style={{flex:1}}>
                    <View style={{flex:1}}>
                <Image style={styles.templateImage} source={{uri:templateImage}}/>
                    <Text style={{position:'absolute',width:wp(42),fontSize: normalize(16),marginTop: hp(3),marginLeft:wp(50),color:'red'}}>{templateDetail.firstLabel}</Text>
                    <Image style={styles.templateSmallCircleImage} source={{uri:templateDetail.firstImage}} />
                    <Image style={[styles.templateSmallCircleImage,{marginLeft:wp(10)}]} source={{uri:templateDetail.secondImage}} />
                    <Text style={{color:'red',position:'absolute',fontSize: normalize(16),marginTop: hp(3),marginLeft:wp(7)}}>{templateDetail.secondLabel}</Text>
                    </View>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        extraScrollHeight={hp(0)}>

                    <View style={{height:hp(2),marginTop:hp(25)}}/>
                        {(categoryId === 1 || categoryId === 3) && renderSingleImageForm()}
                        {(categoryId === 2 || categoryId === 4) && renderTwoImageForm()}

                    </KeyboardAwareScrollView>
                </View>
            }
        </View>

    );
};
const styles = StyleSheet.create({
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        // fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
        width:wp(90),
        alignSelf:'center'
    },
    mainView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    templateSmallCircleImage:{height:hp(10),width:hp(10),borderRadius:hp(5),position: 'absolute',marginTop:hp(20),marginLeft: wp(70)},
    templateSmallCircleImageFullScreen:{height:hp(18),width:hp(18),borderRadius:hp(9)},
    selectImageView:{height:hp(15),width:wp(85),alignItems:'center',justifyContent: 'center',borderRadius: hp(2),alignSelf: 'center',},
    innerView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
    },
    templateImage:{
        height:hp(30),
        width:wp(90),
        alignSelf:'center',
        marginTop:hp(2),
        borderRadius:hp(1.5),

    },
    templateText:{
        fontSize:normalize(13),
        color:color.white,
        fontWeight: '500'
    },
    groupView: {
        backgroundColor: color.creamDarkGray,
        padding: wp(2),
        borderRadius: wp(5),
    },
    textStyleFullScreen:{fontSize:normalize(20),fontWeight:'700',color:color.red}
})

export default TemplateDetailScreen;
