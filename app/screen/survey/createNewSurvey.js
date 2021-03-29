import React,{useEffect,useState} from 'react';
import {View, Text, StyleSheet, Keyboard,TextInput} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppButton, AppHeader, FloatingLabel, GoBackHeader, LabelInputText, Loading} from "../common";
import {color, hp, isANDROID, isIOS, normalize, wp} from "../../helper/themeHelper";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import DatePickerModel from "../common/DatePickerModel";
import {addNewSurvey, fetchSurveyList} from "../../redux/actions/surveyAction";
import moment from 'moment';
const defaultSurveyData = {
    surveyName:'',
    startDate:'',
    endDate:'',
    description:''
}

const CreateNewSurveyScreen = props => {
    const dispatch = useDispatch();
    const [surveyData,setSurveyData] = useState({...defaultSurveyData});
    const [datePickerFlag ,setDatePickerDialog] = useState(false)
    const [dateForDatePicker, setDateForDatePicker] = useState({});
    const [currentKey, setCurrentKey] = useState();
    const [isStartDateChange,setIsStartDateChange] = useState(false);
    const [isEndDateChange,setISEndDateChange] = useState(false);

    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    const checkValue = (str, max) => {
        if (str.charAt(0) !== '0' || str == '00') {
            var num = parseInt(str);
            if (isNaN(num) || num <= 0 || num > max) num = 1;
            str =
                num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
                    ? '0' + num
                    : num.toString();
        }
        return str;
    }
    const dateTimeInputChangeHandler = (e) => {
        // this.type = 'text';
        var input = e;
        var expr = new RegExp(/\D\/$/);
        if (expr.test(input)) input = input.substr(0, input.length - 3);
        var values = input.split('/').map(function (v) {
            return v.replace(/\D/g, '');
        });
        if (values[1]) values[1] = checkValue(values[1], 12);
        if (values[0]) values[0] = checkValue(values[0], 31);
        let output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + '/' : v;
        });
        setSurveyData({...surveyData,startDate:output.join('').substr(0, 14) })
    };
    const dateTimeInputChangeHandlerForEndDate = (e) => {
        // this.type = 'text';
        var input = e;
        var expr = new RegExp(/\D\/$/);
        if (expr.test(input)) input = input.substr(0, input.length - 3);
        var values = input.split('/').map(function (v) {
            return v.replace(/\D/g, '');
        });
        if (values[1]) values[1] = checkValue(values[1], 12);
        if (values[0]) values[0] = checkValue(values[0], 31);
        let output = values.map(function (v, i) {
            return v.length == 2 && i < 2 ? v + '/' : v;
        });
        setSurveyData({...surveyData,endDate:output.join('').substr(0, 14) })
        // this.setState({
        //     registrationDate: output.join('').substr(0, 14),
        // });
    };
    const renderNameFloatingTextInput = (
        lable,
        value,
        key,
        extraLabel = null,
        keyType = null,
        isMultiLine = false
    ) => {
        return (
            <View
                style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                    marginHorizontal: wp(0.5),
                }}
            >
                {isMultiLine ? (
                    <LabelInputText
                        multiline={true}
                        numberOfLines={10}
                        inputStyle={style.floatingInputStyle}
                        style={[style.floatingStyle]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        keyboardType={keyType !== null ? keyType : 'default'}
                        returnKeyType={'done'}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={(text) => {
                            setSurveyData({ ...surveyData, [key]:text });
                        }}
                    />
                ) : (
                    <FloatingLabel
                        numberOfLines={1}
                        inputStyle={style.floatingInputStyle}
                        style={[style.floatingStyle]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        keyboardType={keyType !== null ? keyType : 'default'}
                        returnKeyType={'done'}
                        onChangeText={(text) => {
                            setSurveyData({ ...surveyData, [key]: text });
                        }}
                    />
                )}
            </View>
        );
    };
    const renderNameFloatingTextForDate = (lable, value, key, extraLabel = null,isValueChange=false) => {
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
                    style={[style.floatingStyle,]}
                    label={lable + '  '}
                    editable={true}
                    value={isValueChange?value:''}
                    autoCapitalize="characters"
                    extraLabel={extraLabel}
                    onFocus={async ()=>{
                        Keyboard.dismiss();
                        await setCurrentKey(key)
                        await _setDateForDatePicker(key);
                        await setDatePickerDialog(true)
                    }}
                />
            </View>
        );
    };
    const _setIsShowDatePicker = value => {
        setDatePickerDialog(value);
    };
    const _setDateForDatePicker = key => {
        setDateForDatePicker(surveyData[key]);
        setCurrentKey(key);
    };
    const _setDateFromKey = (value, timeFlag = true) => {
        _setIsShowDatePicker(false);
        setSurveyData({...surveyData, [currentKey]: value});
        if(currentKey ==='startDate'){
            setIsStartDateChange(true)
        } else if(currentKey === 'endDate'){
            setISEndDateChange(true)
        }
    };
    const saveSurveyToDb = () =>{
        const dateFormat = 'DD-MM-YYYY';
        const toDateFormat = moment(new Date(surveyData.startDate).getTime()).format(dateFormat);
        if(surveyData.surveyName ===''){
            alert("please enter survey name")
            return;
        }else if (
            surveyData.startDate.length < 10
        ) {
            alert('please enter correct suvey start date');
            return;
        }
        else if (
            surveyData.endDate.length < 10
        ) {
            alert('please enter correct suvey end date');
            return;
        }
        else if(surveyData.description === ''){
            alert("please enter survey description")
            return;
        } else if(surveyData.endDate<surveyData.startDate){
            alert("please select valid end date...it should be greater than start date")
            return;

        } else {
            var str = surveyData.startDate;
            let darr = str.split("/");    // ["25", "09", "2019"]
            var ISOFormat = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0])+1);
            let tempStartDate = ISOFormat.toISOString().toString().substring(0,ISOFormat.toISOString().toString().indexOf('T'))


            var str = surveyData.endDate;
            let darr1 = str.split("/");    // ["25", "09", "2019"]
            var ISOFormat = new Date(parseInt(darr1[2]),parseInt(darr1[1])-1,parseInt(darr1[0])+1);
            let tempEndDate = ISOFormat.toISOString().toString().substring(0,ISOFormat.toISOString().toString().indexOf('T'))
            let insObj = {
                SurvayName:surveyData.surveyName,
                SurveyStartDate:tempStartDate,
                SurveyEndDate:tempEndDate,
                SurveyDescription:surveyData.description
            }
            dispatch(addNewSurvey(insObj)).then((res)=>{
                if(res){
                    alert("survey create successfully...!");
                    setSurveyData({...defaultSurveyData})
                    props.navigation.goBack();
                    dispatch(fetchSurveyList()).then((res)=>{})
                }
            })
        }
    }

    const createNewSurveyForm = () =>{
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                enableAutomaticScroll={isIOS}
                scrollEnabled={true}
                extraScrollHeight={hp(-1)}
                showsVerticalScrollIndicator={false}>
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
                        {renderNameFloatingTextInput(
                            'Survey Title',
                            surveyData.surveyName,
                            'surveyName',
                            true
                        )}
                    </View>
                </View>
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
                        <TextInput
                            keyboardType="number-pad"
                            style={{
                                width: wp(80),
                                backgroundColor: 'transparent',
                                padding: 10,
                                borderBottomWidth: 1,
                                borderColor: color.gray,
                                paddingHorizontal: 30,
                            }}
                            maxLength={10}
                            placeholder="Survey Start Date DD/MM/YYYY"
                            onChangeText={(e) => dateTimeInputChangeHandler(e)}
                            value={surveyData.startDate}
                        />
                    </View>
                </View>
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
                        <TextInput
                            keyboardType="number-pad"
                            style={{
                                width: wp(80),
                                backgroundColor: 'transparent',
                                padding: 10,
                                borderBottomWidth: 1,
                                borderColor: color.gray,
                                paddingHorizontal: 30,
                            }}
                            maxLength={10}
                            placeholder="Survey End Date DD/MM/YYYY"
                            onChangeText={(e) => dateTimeInputChangeHandlerForEndDate(e)}
                            value={surveyData.endDate}
                        />
                    </View>
                </View>
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
                        {renderNameFloatingTextInput(
                            'Survey Description',
                            surveyData.description,
                            'description',
                            true,
                            null,
                            true

                        )}
                    </View>
                </View>
                <AppButton onPress={()=>{
                    saveSurveyToDb()
                }} containerStyle={{marginTop:hp(2)}} title={'Add'}/>
            </KeyboardAwareScrollView>
        )
    }
    {/*<AppButton onPress={()=>{props.navigation.navigate('CreateNewSurvey')}} containerStyle={{marginTop:hp(2),backgroundColor:'#ff6d5e'}} title={'Create New Survey'}/>*/}

    return (
        <View style={{flex: 1,}}>
            <GoBackHeader
                title={'Back'}
                onMenuPress={() => {
                    props.navigation.goBack()
                }}
            />
            {createNewSurveyForm()}
            {datePickerFlag && (
                <DatePickerModel
                    _setIsShowDatePicker={_setIsShowDatePicker}
                    dateForDatePicker={surveyData[currentKey]}
                    isShow={datePickerFlag}
                    _setDateFromKey={_setDateFromKey}
                    mode={'date'}
                />
            )}
            {isLoading && <Loading isLoading={isLoading} />}

        </View>
    );
};
const style = StyleSheet.create({
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

export default CreateNewSurveyScreen;
