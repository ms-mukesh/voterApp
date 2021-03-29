import React,{useEffect,useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppHeader, Loading} from "../common";
import {fetchAllTemplates} from "../../redux/actions/eventActions";
import {color, hp, normalize, wp} from "../../helper/themeHelper";
import {mail_icon, mobile_icon, organiser_icon} from "../../assets/images";
import {fetchVolunteerTask, updateTaskInformation} from "../../redux/actions/volunteerAction";


const TemplateListScreen = props => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const templateList = useSelector(state => state.eventInformationReducer.templateList);
    useEffect(()=>{
       dispatch(fetchAllTemplates()).then((res)=>{
            console.log(templateList)
       })
    },[])
    const navigateToTemplateDetail = (message,templateName,templateImage,categoryId) =>{
        Alert.alert(
            message,
            'We hope you are available with these contents!',
            [
                {
                    text: 'NO',
                    onPress: () => {
                        console.log('ok');
                    },
                },
                {
                text: 'Yes',
                onPress: async () => {
                    props.navigation.navigate('TemplateDetailScreen',{templateTitle:templateName,templateImage:templateImage,categoryId:categoryId})
                },
            },
            ],
            {
                cancelable: false,
            }
        );
    }
    const renderTemplateList = ({item, index}) => {
        console.log(item)
        return (
            <TouchableOpacity onPress={()=>{
                navigateToTemplateDetail(item?.TemplateRequirement !==null?item?.TemplateRequirement:'',item?.TemplateName,item?.TemplateImage,item?.CategoryId)
            }}>
                <Image style={styles.templateImage} source={{uri:item?.TemplateImage}}/>
                <View style={{padding:hp(1),flex:1,borderBottomLeftRadius:hp(1.5),borderBottomRightRadius:hp(1.5),width:wp(90),alignSelf: 'center',backgroundColor: color.themePurple}}>
                    <Text style={styles.templateText}>{item?.TemplateName}</Text>
                    <Text style={styles.templateText}>{item?.Description}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{flex: 1}}>
            {isLoading && <Loading isLoading={isLoading} />}
            <AppHeader
                title={'Digital Printer'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            {templateList.length === 0 ?
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text>No Template Found</Text>
                </View>
                :
                <FlatList
                    numColumns={1}
                    // data={[...data.imgPath, ...data.docPath]}
                    data={templateList && templateList}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={true}
                    renderItem={renderTemplateList}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            <View style={{height: hp(5)}}/>
        </View>
    );
};
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    templateImage:{
        height:hp(30),
        width:wp(90),
        alignSelf:'center',
        marginTop:hp(2),
        borderTopLeftRadius:hp(1.5),
        borderTopRightRadius:hp(1.5)
    },
    templateText:{
        fontSize:normalize(13),
        color:color.white,
        fontWeight: '500'
    }
})

export default TemplateListScreen;
