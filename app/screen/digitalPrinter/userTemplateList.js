import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {AppHeader, Loading} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserTemplates} from "../../redux/actions/eventActions";
import {color, hp, isWEB, normalize, wp} from "../../helper/themeHelper";
import {
    complete_task_icon,
    download_icon,
    pending_task_icon,
    share_icon,
    task_desc_icon,
    task_name_icon
} from "../../assets/images";
import { WebView } from 'react-native-webview';
import * as FileSystem from "expo-file-system";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from 'expo-media-library';
// import CameraRoll from "@react-native-community/cameraroll";



const UserTemplateScreen = props => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const userTemplateList = useSelector(state => state.eventInformationReducer.userTemplateList);
    useEffect(()=>{
        dispatch(fetchUserTemplates()).then((res)=>{
            console.log("---res",userTemplateList)
        })
    },[])
    const downloadTemplate = (fileRoute,needAlert = true) =>{
        return new Promise(async (resolve)=>{
            dispatch(setLoaderStatus(true))
            const fileUri = FileSystem.documentDirectory + new Date().getTime()+".jpg";
            const url = fileRoute;
            // FileSystem.downloadAsync(url,)

            let downloadObject = FileSystem.createDownloadResumable(
                url,
                fileUri
            );
            let response = await downloadObject.downloadAsync();
            // isIOS ? res : 'file://' + res;
            console.log("data----",response.uri)
            dispatch(setLoaderStatus(false))
            console.log("data-",response)
            if(response.status === 200 && needAlert){
                alert("file downloaded succefully..")
                // if(!isWEB){
                //     CameraRoll.save( response.uri, 'photo').then((res)=>{
                //     }).catch((err)=>{
                //         console.log("err-",err)
                //     });
                // }

                // MediaLibrary.saveToLibraryAsync(response.uri).then((res)=>{}).catch((err)=>{
                //     console.log("err--",err)
                // })
                resolve(response.uri)
            } else if(response.status === 200){
                resolve(response.uri)
            }
            else {
                alert("failed to  downloaded")
                resolve(false)
            }
        })
    }
    const shareFile = (fileUrl) =>{
        dispatch(setLoaderStatus(true))
        downloadTemplate(fileUrl,false).then((res)=>{

            dispatch(setLoaderStatus(false))
            if(res){
                const options = {
                    mimeType: 'image/jpeg',
                    dialogTitle: 'Open file',
                    UTI: 'image/jpeg',
                };
                Sharing.shareAsync(res, options);
            }
        }).catch((err)=>{
            dispatch(setLoaderStatus(false))
        })
    }


    // const renderUserTemplate = ({item, index}) => {
    //     return (
    //         <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(2),backgroundColor:color.gray}}>
    //             <Image resizeMode={'contain'} style={{height:hp(35),width:wp(90),alignSelf:'center',}} source={{uri:item.TemplateUrl}}/>
    //             <View style={{flexDirection:'row',height:hp(4),paddingRight:wp(5),borderBottomRightRadius:hp(5),borderBottomLeftRadius:hp(5),width:wp(87),alignSelf:'center',backgroundColor:color.themePurple,alignItems:'center',justifyContent:'flex-end'}}>
    //                 <TouchableOpacity onPress={()=>{
    //                     downloadTemplate(item.TemplateUrl).then((res)=>{})
    //                 }}>
    //                     <Image resizeMode={'contain'} style={{marginRight:wp(3),height:hp(2.5),width:hp(2.5),}} source={download_icon}/>
    //                 </TouchableOpacity>
    //
    //                 <TouchableOpacity onPress={()=>{
    //                     shareFile(item.TemplateUrl)
    //                 }}>
    //                     <Image style={{height:hp(2.5),width:hp(2.5)}} source={share_icon}/>
    //                 </TouchableOpacity>
    //
    //
    //             </View>
    //         </View>
    //     );
    // };

    const renderUserTemplate = ({item, index}) => {
        return (
            <View style={{flex:1,padding:hp(1)}}>
            <View key={Math.random() + 'DE'} style={{flex: 1,backgroundColor:color.gray,alignItems:'center',borderTopRightRadius:hp(2),borderTopLeftRadius:hp(2),padding:hp(1)}}>
                <Image resizeMode={'contain'} style={{height:hp(30),width:wp(85)}} source={{uri:item?.TemplateUrl}}/>
            </View>
                <View style={{backgroundColor:color.lightGreen,flexDirection:'row',padding:hp(1.5),justifyContent:'flex-end',borderBottomLeftRadius:hp(2),borderBottomRightRadius:hp(2)}}>
                    <TouchableOpacity onPress={()=>{
                        downloadTemplate(item.TemplateUrl).then((res)=>{})
                    }}>
                        <Image resizeMode={'contain'} style={{marginRight:wp(3),height:hp(2.5),width:hp(2.5),}} source={download_icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        shareFile(item.TemplateUrl)
                    }}>
                        <Image style={{height:hp(2.5),width:hp(2.5)}} source={share_icon}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{flex:1}}>
            {isLoading && <Loading isLoading={isLoading} />}
        <AppHeader title={'My Templates'} onMenuPress={()=>{
            props.navigation.openDrawer()
        }}/>
            <FlatList
                numColumns={1}
                data={userTemplateList}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderUserTemplate}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};
export default UserTemplateScreen;
