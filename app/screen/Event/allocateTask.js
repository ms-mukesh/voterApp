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
    Keyboard, FlatList
} from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';
import {hp,wp,color,normalize,isANDROID,isIOS} from "../../helper/themeHelper";
import {AppHeader, FloatingLabel, LabelInputText, Loading} from "../common/";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import SafeAreaView from "react-native-safe-area-view";

import AutoCompleteModel from '../common/AutoCompleteBox'
import {AppButton} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {addNewFamily} from "../../redux/actions/userActions";
import {isAlpha, isAlphaWithSpace, validateEmail} from "../../helper/validation";
import {fetchEventInformationForTask} from "../../redux/actions/eventActions";
import {event_icon, guest_icon, location_pin_icon, organiser_icon} from "../../assets/images";
import moment from "moment";
const AllocateTaskForEvent = props => {
    const dispatch = useDispatch()
    const [autoCompleteData,setAutoCompleteData] = useState([])
    const [eventData , setEventData] = useState([])
    const EventInformation = useSelector(state => state.eventInformationReducer.events);
    useEffect(()=>{
       dispatch(fetchEventInformationForTask()).then((res)=>{
           if(res){
               setEventData(res)
           }
       })
    },[])

    const {
        nameText,
        mainView,
        innerMain,
        closeIcon,
        logoStyle,
        center,
        heading,
        divider,
        listMainView,
        btnText,
        btnLayout,
    } = styles;
    const [currentKey, setCurrentKey] = useState();
    const [setValues, setSelectedValues] = useState('');
    const [isAutoCompleteModel, setIsAutoCompleteModel] = useState(false);
    const [selectField, setSelectedField] = useState('');
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const [User, setUser] = useState({address:'',city:'',state:'',country:'',pincode:'',nativePlace:'',cast:'',phone:'',district:''});
    const _setIsAutoCompleteModel = value => {
        setIsAutoCompleteModel(value);
    };
    const _setCurrentKey = key => {
        setCurrentKey(key);
    };
    const _setValuesForAutoCompelete = (Value, keyName, Label) => {
        setSelectedValues(Value);
        _setCurrentKey(keyName);
        setSelectedField(Label);
        setIsAutoCompleteModel(true);
        _setCurrentKey(keyName);
    };
    const changeValue = () => {
        if (currentKey === 'homeState') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.homeCity = '';
            }
        }

        if (currentKey === 'homeCountry') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.homeCity = '';
                User.homeState = '';
            }
        }

        if (currentKey === 'officeState') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.officeCity = '';
            }
        }

        if (currentKey === 'officeCountry') {
            if (User[currentKey].toLowerCase() === removeHash(setValues).toLowerCase()) {
                // console.log('same');
            } else {
                User.officeCity = '';
                User.officeState = '';
            }
        }

        User[currentKey] = setValues.toUpperCase();
        // setUpdateObj({...updateObj, [currentKey]: removeHash(setValues)});
    };

    const _setSelectedField = value => {};
    const _setSelectedValues = value => {
        setSelectedValues(value);
    };
    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null,isMultiLine=false,isPressable = false) => {
        return (
            <View
                style={{
                    flex: 1,
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
                        o onChangeText={text => {
                        setUser({...User, [key]: isIOS ? text.toUpperCase() : text});
                        }}
                    />:
                    <FloatingLabel
                        numberOfLines={1}
                        inputStyle={styles.floatingInputStyle}
                        style={[styles.floatingStyle, {width: wp(30)}]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={text => {
                            setUser({...User, [key]: isIOS ? text.toUpperCase() : text});
                        }}
                        onFocus={()=>{
                            if(isPressable){
                                Keyboard.dismiss()
                                _setValuesForAutoCompelete(value, key, lable);
                            }
                        }}
                    />}

            </View>
        );
    };
    const insertNewFamilyToDb = ()=>{

        if(User.address ===""){
            alert("please enter address !")
            return;
        }
        else if(!isAlpha(User.city)){
            alert("please enter correct city name!")
            return;

        }
        else if(!isAlpha(User.state)){
            alert("please enter correct state name!")
            return;
        }
        else if(!isAlpha(User.district)){
            alert("please enter correct district name!")
            return;
        }
        else if(!isAlpha(User.country)){
            alert("please enter correct country name!")
            return;
        }
        else if(isNaN(User.phone)){
            alert("please enter correct phone number!")
            return;
        }
        else if(User.pincode.toString().length ===0 || isNaN(User.pincode)){
            alert("plase add correct pincode")
            return;
        }
        else if(User.nativePlace === ""){
            alert("plase select native place")
            return;
        }
        else if(User.cast === ""){
            alert("please select cast!")
            return;
        }
        else {
            const familyInsertObj ={
                "address":User.address,
                "city":User.city,
                "district":User.district,
                "state":User.state,
                "country":User.country,
                "pincode":User.pincode,
                "phone":User.phone,
                "nativePlace":User.nativePlace,
                "cast":User.cast
            }

        }


        //
        // updateVoterFamilyId!==null &&
        // updateVoterFamilyId(4)
        // props.navigation.pop()

    }
    const renderAllocateTaskForm=()=>{
        return(
            <View style={{flex:1}}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    // contentContainerStyle={{flex: 1}}
                    enableAutomaticScroll={isIOS}
                    scrollEnabled={true}
                    extraScrollHeight={hp(-1)}
                    showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1,}}>
                        <View style={{height:hp(10),alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:normalize(20),fontWeight:'700',color:color.themePurple}}>CREATE NEW FAMILY</Text>
                        </View>
                        {renderNameFloatingTextInput("ADDRESS",User.address,"address",true,true)}
                        <View style={{height:hp(3)}}/>
                        <View style={{flexDirection:'row'}}>
                            {renderNameFloatingTextInput("CITY",User.city,"city",true)}
                            {renderNameFloatingTextInput("STATE",User.state,"state",true)}
                        </View>
                        <View style={{flexDirection:'row',marginTop:hp(2)}}>
                            {renderNameFloatingTextInput("DISTRICT",User.district,"district",true)}
                            {renderNameFloatingTextInput("COUNTRY",User.country,"country",true)}
                        </View>

                        <View style={{flexDirection:'row',marginTop:hp(2)}}>
                            {renderNameFloatingTextInput("MOBILE",User.phone,"phone",true)}
                            {renderNameFloatingTextInput("PINCODE",User.pincode,"pincode",true)}
                        </View>
                        <View style={{marginTop:hp(2)}}>
                            {renderNameFloatingTextInput("NATIVE PLACE",User.nativePlace,"nativePlace",true,false,true)}
                        </View>
                        <View style={{marginTop:hp(2)}}>
                            {renderNameFloatingTextInput("CAST",User.cast,"cast",true,false,true)}
                        </View>
                        <View style={{marginTop:hp(5)}}>
                        <AppButton
                            title={'Add Family'}
                            onPress={() => {
                                insertNewFamilyToDb()
                            }}
                        />
                        </View>
                    </View>


                </KeyboardAwareScrollView>
            </View>
        )
   }
    const renderEventList = ({item, index}) => {
        return (
            <TouchableOpacity onPress={()=>{
                props.navigation.navigate('TaskView',{TaskDataIndex:index})
            }}>
            <View key={Math.random() + 'DE'} style={{flex: 1,marginTop:hp(1.5)}}>
                <View style={{flex:1,padding:hp(1.5),width:wp(95),alignSelf:'center',justifyContent:'center',backgroundColor:color.gray,borderRadius:hp(1)}} >
                    <Text style={[{alignSelf:'flex-end'}]}>{moment(new Date(parseInt(item?.eventData?.EventDate))).format("DD-MM-yy hh:mm A")}</Text>

                    <View style={{flexDirection:'row',}}>
                        <Image style={styles.eventIcon} source={event_icon}/>
                        <Text  style={[styles.eventValue,{width:wp(31)}]}>{item?.eventData?.EventName}</Text>
                        <ProgressBar style={{width:wp(50),height:hp(1),borderRadius:hp(1),marginTop:hp(1)}} progress={item?.eventData?.TaskProgress} color={color.themePurple} />
                    </View>
                    <View style={{flexDirection:'row',marginTop:hp(1)}}>
                        <Image style={styles.eventIcon} source={organiser_icon}/>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.eventValue}>{item?.eventData?.Organiser}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:hp(1)}}>
                        <Image style={styles.eventIcon} source={location_pin_icon}/>
                        <Text  ellipsizeMode="tail" numberOfLines={3} style={[styles.eventValue,{width:wp(80)}]}>{item?.eventData?.Address}</Text>
                  </View>
                    {
                        item?.eventData?.Guest!=="" && item?.eventData?.Guest!==null &&
                        <View style={{flexDirection:'row',marginTop:hp(1)}}>
                            <Image style={styles.eventIcon} source={guest_icon}/>
                            <Text  ellipsizeMode="tail" numberOfLines={3} style={[styles.eventValue,{width:wp(80)}]}>{item?.eventData?.Guest}</Text>
                        </View>
                    }
                </View>
            </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{flex:1,}}>
            <AppHeader
                title={'Allocate Task'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            <Text style={{marginTop:hp(1),fontSize:normalize(18),fontWeight:'700',alignSelf:'center',}}>EVENT LIST</Text>
                {isLoading && <Loading isLoading={isLoading} />}
                {isAutoCompleteModel && (
                    <AutoCompleteModel
                        allSearchData={autoCompleteData && autoCompleteData}
                        _setIsAutoCompleteModel={_setIsAutoCompleteModel}
                        SearchField={setValues}
                        changeValue={changeValue}
                        selectField={selectField}
                        _setSelectedField={_setSelectedField}
                        _setSelectedValues={_setSelectedValues}
                        currentKey={currentKey}
                        // selectedValue={User[currentKey]}
                    />
                )}
            <FlatList
                numColumns={1}
                // data={[...data.imgPath, ...data.docPath]}
                data={EventInformation.length>0 && EventInformation}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={true}
                renderItem={renderEventList}
                keyExtractor={(item, index) => index.toString()}
            />
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
    eventIcon:{
      height:hp(2),
      width:hp(2)
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
    eventHeading:{fontSize:normalize(15),fontWeight:'500'},
    eventValue:{fontSize:normalize(14),fontWeight:'400',marginLeft:wp(2),width:wp(90)},
    validationStart: {position: 'absolute', color: 'red', marginLeft: wp(16), marginTop: hp(0.5)},
    radioButtonOutterCircle:{alignItems:'center',justifyContent:'center',height:hp(3),width:hp(3),borderRadius:hp(1.5),borderWidth:hp(0.2)},
    radioButtonInnerCircle:{height:hp(1.6),width:hp(1.6),borderRadius:hp(0.8),backgroundColor: color.themePurple}
});
export default AllocateTaskForEvent
