import React,{useState,useEffect,useCallback,useRef} from 'react';
import {
    Keyboard,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Image,
    Alert,
    Modal, ActivityIndicator, FlatList,Linking,
    SafeAreaView
} from 'react-native';
import {AppButton, AppHeader, BoothListModel, FamilyListModel, FloatingLabel, LabelInputText, Loading} from "../common";
import CloseButton from "../common/ClearButton";
import {color, font, hp, isANDROID, isIOS, isWEB, normalize, wp} from "../../helper/themeHelper";
import {shadowStyle} from "../../helper/styles";
import {SwipeListView} from "react-native-swipe-list-view";
import moment from "moment";
import {autoCapitalString, isAlpha} from "../../helper/validation";
import {FAB} from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import {sort_icon, filter_icon, export_icon, filled_start, empty_star} from "../../assets/images";
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";


import {useDispatch,useSelector} from "react-redux";
import {
    getVoterList,
    getSearchMember,
    fetchFilterCrieteria,
    defaultFilterObject,
    setLoaderStatus, getAllBoothList, addNewBoothToDb
} from "../../redux/actions/dashboardAction";
import DefaultMaleIcon from "../../assets/images/user_male.png";
import {ImageFullScreenPreview} from "../common/ImageFullScreenPreview";
import {search_icon,cross_black_icon} from "../../assets/images";
import {getToken} from "../../api/getToken";
import {ADMIN, IS_OUR_ENFLUENCER} from "../../helper/constant";
import {exportFile, isDefined} from "../functions";
import * as Permissions from 'expo-permissions';
import {usePermissions} from "expo-permissions";
import * as Print from "expo-print";
import {getAllInfluencers, insertBulkData} from "../../redux/actions/userActions";
import {fetchVolunteerTask, updateTaskInformation} from "../../redux/actions/volunteerAction";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


const InflunecerMemberScreen = props => {

    const defaultBoothDetail = {
        name:'',
        state:'',
        city:'',
        district:'',
        address:'',
        code:''
    }
    const [bootListFlag,setBoothListFlag] = useState(false);
    const [influencerList,setInfluencerList] = useState([])
    const [createNewBoothFlag,setCreateNewBoothFlag] = useState(false);
    const [dataForAutoComplete, setDataForAutoComplete] = useState({data: {}});
    const [permission, askForPermission] = usePermissions(Permissions.MEDIA_LIBRARY, { ask: true });
    const [currentFilter, setCurrentFilter] = useState({
        ...defaultFilterObject,
    });
    const [currentBoothId,setCuurentBoothId] = useState(1)
    const [excelData,setExcelData] = useState([])
    const [excelItemPreviewFlag,setExcelItemPreviewFlag] = useState(false)
    const [filterFlag, setFilterFlag] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [boothList,setBoothList] = useState([]);
    const [wardDetail,setWardDetail] = useState(defaultBoothDetail)
    const setFilter = value => {
        setCurrentFilter(value);
    };
    const setFlagForFilter = value => {
        setSearchField('');
        setsearchData([]);
        if (!value) {
            flatlistRef &&
            flatlistRef !== null &&
            flatlistRef.current.scrollToOffset({animated: true, offset: 0});
        }
        setFilterFlag(value);
    };
    const setDataForFilter = value => {
        setTimeout(() => {
            flatlistRef &&
            flatlistRef !== null &&
            flatlistRef.current.scrollToOffset({animated: true, offset: 0});
            setRenderFlag(true);
        }, 100);
        setFilterData(value);
    };
    const renderNameFloatingTextInput = (lable, value, key, extraLabel = null,isMultiLine=false,) => {
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
                        inputStyle={style.floatingInputStyle}
                        style={[{width: wp(30)}]}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={text => {
                            setWardDetail({...wardDetail, [key]: isIOS ? text.toUpperCase() : text});
                    }}
                    />:
                    <FloatingLabel
                        numberOfLines={1}
                        inputStyle={style.floatingInputStyle}
                        style={{width: wp(30)}}
                        label={lable + '  '}
                        editable={true}
                        value={value}
                        autoCapitalize="characters"
                        extraLabel={extraLabel}
                        onChangeText={text => {
                            setWardDetail({...wardDetail, [key]: isIOS ? text.toUpperCase() : text});
                        }}
                    />}

            </View>
        );
    };
    const moveToExcelPreviewPage = (headerArray, dataArray, filePath) => {
        props.navigation.navigate('ExcelPreview', {
            headerArray: headerArray,
            dataArray: dataArray,
            filePath: filePath,
            fileDate: new Date().toDateString(),
            fileTime: new Date().toLocaleTimeString(),
        });
    };

    const exportDataToExcel = () => {
        return new Promise(resolve => {
            // dispatch(setLoaderTrue());
            if (filterFlag && filterData.length > 0) {
                exportFile(filterData).then(res => {
                    // dispatch(setLoaderFalse());
                    if (res) {
                        // moveToExcelPreviewPage(Object.keys(res.data[0]), res.data, res.filePath);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }  else if (searchFlag === 1 && searchData.length > 0) {
                exportFile(searchData).then(res => {
                    // dispatch(setLoaderFalse());
                    if (res) {
                        // moveToExcelPreviewPage(Object.keys(res.data[0]), res.data, res.filePath);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                // setDownloadFlag(true);
                dispatch(getDirectoryMemberForExport('?page=-1')).then(res => {
                    if (res && res.length > 0) {
                        exportFile(res).then(res => {
                            // setDownloadFlag(false);
                            // dispatch(setLoaderFalse());
                            if (res) {
                                // moveToExcelPreviewPage(Object.keys(res.data[0]), res.data, res.filePath);
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        resolve(false);
                    }
                });
            }
        });
    };
    const exportData = () => {
        let mytable = "<table style=\"border-collapse: collapse; width: 100%; height: 27px;\" border=\"0\">\n" +
            "<tbody>\n" +
            "<tr style=\"height: 27px;\">\n" +
            "<td style=\"width: 100%; height: 27px; text-align: center;\">Rajya nirvachan Aayog</td>\n" +
            "</tr>\n" +
            "</tbody>\n" +
            "</table>\n" +
            "<table style=\"border-collapse: collapse; width: 100%; height: 27px;\" border=\"0\">\n" +
            "<tbody>\n" +
            "<tr style=\"height: 27px;\">\n" +
            "<td style=\"width: 100%; height: 27px; text-align: center;\">Panchayat Election</td>\n" +
            "</tr>\n" +
            "</tbody>\n" +
            "</table>\n" +
            "<table style=\"border-collapse: collapse; width: 100%; height: 54px;\" border=\"1\">\n" +
            "<tbody>\n" +
            "<tr style=\"height: 18px;\">\n" +
            "<td style=\"width: 50%; height: 18px;\">Vidhansabha :&nbsp;</td>\n" +
            "<td style=\"width: 50%; height: 18px;\">D.Member :&nbsp;</td>\n" +
            "</tr>\n" +
            "<tr style=\"height: 18px;\">\n" +
            "<td style=\"width: 50%; height: 18px;\">Panchayat Samiti :</td>\n" +
            "<td style=\"width: 50%; height: 18px;\">Nirvachan :</td>\n" +
            "</tr>\n" +
            "<tr style=\"height: 18px;\">\n" +
            "<td style=\"width: 50%; height: 18px;\">Gram Panchayat :</td>\n" +
            "<td style=\"width: 50%; height: 18px;\">Number</td>\n" +
            "</tr>\n" +
            "</tbody>\n" +
            "</table>\n" +
            "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\">\n" +
            "<tbody>\n" +
            "<tr>\n" +
            "<td style=\"width: 100%;\">Vidhansabha Name and Counts :</td>\n" +
            "</tr>\n" +
            "</tbody>\n" +
            "</table>" +
            "<table border=\"1\" cellpadding=\"0\" cellspacing=\"0\"><tbody>";
        let tempData = null;
        if (searchFlag === 1) {
            tempData = searchData;
        } else if(filterFlag){
            tempData = filterData;
        }
        else {
            tempData = voterListData.data;
        }
        exportFile((tempData)).then((exportData)=>{
            if(exportData){
                exportData.map((item,index)=>{
                    if (index % 3 == 0 && index != 1) {
                        mytable += "</tr><tr>";
                    }
                    mytable += "<td><div style='height: 160px;width: 320px;background-color: #f2f2f2'><table style=\"height: 98px;\">\n" +
                        "<tbody>\n" +
                        "<tr style=\"height: 18px;\">\n" +
                        "<td style=\"height: 18px; width: 204px;\">\n" +
                        "<div style=\"height: 18px;text-align: center;vertical-align: middle; width: 50px; background-color: gray;\"><span style=\"font-size: xx-medium;\">"+(parseInt(index)+1)+"</span></div>\n" +
                        "</td>\n" +
                        "<td style=\"height: 18px; width: 100px;\"><span style=\"font-size: xx-medium;\">"+item.VoterId+"</span></td>\n" +
                        "</tr>\n" +
                        "<tr style=\"height: 124px;\">\n" +
                        "<td style=\"width: 204px;\">\n" +
                        "<table style=\"height: 99px;\">\n" +
                        "<tbody>\n" +
                        "<tr style=\"height: 30px;\">\n" +
                        "<td style=\"height: 30px; width: 191px;\">Name: "+item.FirstName+"</td>\n" +
                        "</tr>\n" +
                        "<tr style=\"height: 18px;\">\n" +
                        "<td style=\"height: 12px; width: 191px;\">H/F:"+item.MiddleName+"</td>\n" +
                        "</tr>\n" +
                        "<tr style=\"height: 18px;\">\n" +
                        "<td style=\"height: 32px; width: 191px;\">Address:"+item.HomeAddress+", "+item.HomeCity+"</td>\n" +
                        "</tr>\n" +
                        "<tr style=\"height: 18px;\">\n" +
                        "<td style=\"height: 25px; width: 191px;\">Age:"+item.DOB+" Gender:"+item.Gender+"</td>\n" +
                        "</tr>\n" +
                        "</tbody>\n" +
                        "</table>\n" +
                        "</td>\n" +
                        "<td style=\"width: 100px;\"><img src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi3gjBvxBFwkGtNT10HL5B4c4V-2UGoBui4w&amp;usqp=CAU\" alt=\"Voter image\" width=\"100px\" height=\"100px\" /></td>\n" +
                        "</tr>\n" +
                        "</tbody>\n" +
                        "</table>" +
                        "</div></td>"
                })
                mytable += "</tr></tbody></table>";
                Alert.alert(
                    'Hello',
                    'Are You Sure to Export Data To Excel File?',
                    [
                        {
                            text: 'No',
                            onPress: () => {
                                console.log('ok');
                            },
                        },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                askForPermission
                                dispatch(setLoaderStatus(true))
                                const item = searchData.map((data)=>{
                                    return <tr><td>{data.FirstName}</td></tr>
                                })
                                const filePath = await Print.printToFileAsync({
                                    html: '<html><head><style>@page { margin: 20px; height: 90%} html,body {height: 90%;} </style></head><body><table border="1">'+mytable +
                                        '</body></html>',
                                    // html: JSON.stringify(item),
                                    base64: false
                                }).catch((err)=>{
                                    dispatch(setLoaderStatus(false))
                                    alert("fail to export file")
                                })
                                // console.log(filePath)
                                const options = {
                                    mimeType: 'application/pdf',
                                    dialogTitle: 'Open file',
                                    UTI: 'com.adobe.pdf',
                                };
                                dispatch(setLoaderStatus(false))
                                Sharing.shareAsync(filePath.uri, options);
                                // alert(JSON.stringify(filePath))
                                // exportDataToExcel().then(res => {
                                //     if (res) {
                                //         // alert('Exporting and Downloading file successful');
                                //     } else {
                                //         alert('Failed To Export Data');
                                //     }
                                // });
                            },
                        },
                    ],
                    {
                        cancelable: false,
                    }
                );
            } else {
                alert("failed to export data...")
                dispatch(setLoaderStatus(false))
            }
        })

    };
    const openFilterPage = async () => {
        if (typeof dataForAutoComplete.data.State !== 'undefined') {
            props.navigation.navigate('FilterPage', {
                currentFilter: currentFilter,
                setFilter: setFilter,
                setFlagForFilter: setFlagForFilter,
                setDataForFilter: setDataForFilter,
                searchData: dataForAutoComplete.data,
                filterDataLength: dataForAutoComplete.data.TotalRecords,
                // sortingCrieteria: sortCriteria,
            });
        } else {
            await dispatch(fetchFilterCrieteria()).then(res => {
                if (res) {
                    dataForAutoComplete.data = res;
                    props.navigation.navigate('FilterPage', {
                        currentFilter: currentFilter,
                        setFilter: setFilter,
                        setFlagForFilter: setFlagForFilter,
                        setDataForFilter: setDataForFilter,
                        searchData: dataForAutoComplete.data,
                        // sortingCrieteria: sortCriteria,
                        filterDataLength: dataForAutoComplete.data.TotalRecords,
                        // filterIntroScreenFlag: filterIntroScreenFlag,
                    });
                }
            });
        }
    };
    const actions = [];
    actions.push(
        {
            icon: filter_icon,
            label: 'Filter',
            onPress: async () => {
                Keyboard.dismiss();
                openFilterPage();
            },
        },

        {
            icon: export_icon,
            label: 'Export',
            onPress: () => {
                Keyboard.dismiss();
                exportData();
            },
        },
    )
    const [SearchField, setSearchField] = useState('');
    const [refreshPage, setRefreshPage] = useState(false);
    const voterListData = useSelector(state => state.dashboardReducer.memberDetail);
    const [currentMemberId, setCurrentMemberId] = useState({currentMember: 0});
    const [renderFlag, setRenderFlag] = useState(true);
    const [searchData, setsearchData] = useState([]);
    const [searchFlag, setSearchFlag] = useState(0);
    const [bgFlag, setBgFlag] = useState(false);
    const [state, setState] = React.useState({open: false});
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    let openRowRef = null;
    const flatlistRef = useRef(null);
    let tempCurrent = 0;
    const [currentImage, setCurrentImage] = useState('');
    const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);
    const onTextChange = useCallback(value => {
        setSearchField(value);
        if (value === '') {
            setsearchData([]);
            setSearchFlag(0);
        }
    });
    const dispatch = useDispatch()
    const onCancel = () => {
        Keyboard.dismiss();
        setSearchField('');
    };
    const openDrawer = () => {
        props.navigation.openDrawer();
    };
    const closeImagePreview = () => {
        setImagePreviewFlag(false);
    };
    const displayImageInFullScreen = (image = null) => {
        if (image !== null) {
            setCurrentImage(image);
            setImagePreviewFlag(true);
        } else {
            setCurrentImage(null);
            setImagePreviewFlag(true);
        }
    };
    const displayDetailPage = index => {
        let tempData = null;
        openRowRef && openRowRef.closeRow();
        // if (sortFlag) {
        //     tempData = sortData[index];
        // } else if (filterFlag) {
        //     tempData = filterData[index];
        // }
        if (searchFlag === 1) {
            tempData = searchData[index];
        } else if(filterFlag){
            // alert("filter")
            tempData = filterData[index];
        }
            else {
            tempData = voterListData.data[index];
        }
        // tempData = voterListData.data[index]
        props.navigation.navigate('MemberDetails', {
            data: tempData,
        });

        // props.navigation.navigate('DirectoryDetail', {
        //     data: tempData,
        // });
    };
    const returnNameFromFields = (firstName, middleName, lastName) => {
        let tempName = null;
        if (firstName !== '' && firstName !== '-' && firstName !== null) {
            tempName = firstName;
        }
        if (middleName !== '' && middleName !== '-' && middleName !== null) {
            tempName = tempName + ' ' + middleName.replace(/\((.*)\)/, '');
        }
        if (lastName !== '' && lastName !== '-' && lastName !== null) {
            tempName = tempName + ' ' + lastName.replace(/\((.*)\)/, '');
        }
        return tempName;
    };
    const onStateChange = ({open}) => {
        Keyboard.dismiss();
        openRowRef && openRowRef.closeRow();
        setState({open});
    };

    const {open} = state;
    const getData = useCallback((endpoint = '', isPull = false) => {
        isPull && setRefreshPage(true);
        if (endpoint !== null || endpoint !== 'null' || endpoint.indexOf('null') < 0) {
            dispatch(getVoterList(endpoint, isPull)).then(res => {
                isPull && setRefreshPage(false);
                if (!res /*&& temp === 0*/) {
                    setOnEndReachedCalledDuringMomentum(false);
                    // alert('Something Went Wrong');
                }
            });
        }
    });
    useEffect(()=>{
       dispatch(getAllInfluencers()).then((res)=>{
           if(res){
               setInfluencerList(res.Data[0])
           }
       })
    },[])



    const _renderHiddenComponent = (data, rowMap) => {
        if(isWEB){
            return null
        }
        return (
            <View style={style.rowBack}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        rowMap[data.item.key].closeRow();
                        displayDetailPage(currentMemberId.currentMember);

                    }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}>
                        <Text
                            allowFontScaling={false}
                            style={{
                                fontSize: normalize(15),
                                color: color.white,
                                // fontFamily: font.robotoBold,
                            }}>
                            Details
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    const _RenderItemForWeb = (item, index) => {
        let date = item.DOB;
        const dob = moment(date).format('Do MMM YYYY');
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={[style.mainView,{width:wp(30),marginLeft:index%3!==0?wp(3):0}]}>
                        <View
                            style={{
                                position: 'absolute',
                                top: hp(1),
                                right: 10,
                                borderBottomLeftRadius: wp(2),
                                borderTopRightRadius: wp(2),
                                zIndex: 1000,
                            }}>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                {typeof item.ProfileImage === 'undefined' ||
                                item.ProfileImage === '-' ||
                                item.ProfileImage === null ||
                                item.ProfileImage === '' ? (
                                    <TouchableWithoutFeedback onPress={() => displayImageInFullScreen()}>
                                        <Image style={{height: wp(7), width: wp(7), borderRadius: wp(5)}} source={DefaultMaleIcon} />
                                    </TouchableWithoutFeedback>
                                ) : (
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            displayImageInFullScreen(item.ProfileImage);
                                        }}>
                                        <Image
                                            style={{height: wp(7), width: wp(7), borderRadius: wp(3.5)}}
                                            resizeMode={'cover'}
                                            onLoad={e => {}}
                                            source={{
                                                uri: item.ProfileImage,
                                            }}
                                        />
                                    </TouchableWithoutFeedback>
                                )}
                            </View>
                            <View style={{flex: 1, justifyContent: 'space-between'}}>
                                <Text numberOfLines={1} allowFontScaling={false} style={[style.fontStyle,{width:wp(65)}]}>
                                    {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                    {item?.VoterHindiName !== null ?
                                        item?.FirstName + " / " + item?.VoterHindiName :item?.FirstName
                                    }
                                </Text>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {item?.FatherEntry!==null ?"Father Name":item?.SpouseEntry!==null?item?.Gender==="male"?"Wife Name ":"Husband Name":"Father Name "}
                                </Text>
                                <Text allowFontScaling={false} style={style.fontStyle}>
                                    {item?.MiddleName}
                                </Text>
                                <View style={{flexDirection:'row',flex:1,justifyContent: 'space-between'}}>
                                    <View style={{flex:1}}>
                                        {(item?.VoterVotingId !== "" && item?.VoterVotingId !== null) &&
                                        <Text style={style.fontStyle}>{item?.VoterVotingId}</Text>
                                        }
                                    </View>
                                    <View style={{alignItems:'center',justifyContent:'center',height:hp(4),width:wp(10),borderRadius:hp(1.5),backgroundColor:item?.TrustFactor?.Color??'transparent'}}>
                                        <Text style={{fontSize:normalize(7),fontWeight:'700'}}>{item?.TrustFactor?.Name}</Text>
                                    </View>
                                </View>

                                {item.Email !== '' &&
                                item.Email !== '-' &&
                                item.Email !== null &&
                                typeof item.Email !== 'undefined' && (
                                    <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                        <Image
                                            source={require('../../assets/images/mail.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text
                                            allowFontScaling={false}
                                            style={[
                                                style.subText,
                                                {
                                                    marginLeft: wp(1),
                                                    flex: 1,
                                                    textDecorationLine: 'underline',
                                                    color: color.blue,
                                                    textDecorationColor: color.blue,
                                                },
                                            ]}
                                            onPress={() => {
                                                Linking.openURL(`mailto:${item.Email}`).then((res)=>{}).catch((err)=>{
                                                    alert("Fail to send mail")
                                                });;
                                            }}>
                                            {item.Email.toLowerCase()}
                                        </Text>
                                    </View>
                                )}
                                {item?.Mobile &&
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <View style={[style.common, {flex: 1}]}>
                                        <Image
                                            source={require('../../assets/images/phone.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text
                                            allowFontScaling={false}
                                            onPress={() => {
                                                Linking.openURL(
                                                    `tel:${
                                                        item.Mobile
                                                        }`
                                                ).then((res)=>{}).catch((err)=>{
                                                    alert("Fail to make call")
                                                });
                                            }}
                                            style={[
                                                style.subText,
                                                {
                                                    marginLeft: wp(1),
                                                    textDecorationLine: 'underline',
                                                    color: color.blue,
                                                    textDecorationColor: color.blue,
                                                },
                                            ]}>
                                            {item.Mobile}
                                        </Text>
                                    </View>

                                    <View style={[style.birthdayView, {flex: 1}]}>
                                        {item?.DOB &&
                                        <View style={{flexDirection: 'row'}}>
                                            <Image source={require('../../assets/images/cake.png')}
                                                   style={style.iconStyle}/>
                                            <Text allowFontScaling={false} style={{...style.subText, marginLeft: wp(1)}}>
                                                {dob}
                                            </Text>
                                        </View>
                                        }
                                    </View>
                                </View>
                                }
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <View style={[style.common, {flex: 2}]}>
                                        <Image
                                            source={require('../../assets/images/gender.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item.Gender !== '' &&
                                            item.Gender !== '-' &&
                                            item.Gender !== null &&
                                            autoCapitalString(item.Gender)}
                                        </Text>
                                    </View>
                                    <View style={[style.common, {flex: 2}]}>
                                        <Text style={style.subText}>AGE:</Text>
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item?.Age}
                                        </Text>
                                    </View>
                                    {item?.MaritalStatus &&
                                    <View style={[style.common, {flex: 1.5}]}>
                                        <Image
                                            source={require('../../assets/images/marital_status.png')}
                                            style={style.iconStyle}
                                        />
                                        <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                            {item.MaritalStatus !== '' &&
                                            item.MaritalStatus !== '-' &&
                                            item.MaritalStatus !== null &&
                                            autoCapitalString(item.MaritalStatus)}
                                        </Text>
                                    </View>
                                    }

                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const _RenderItem = (item, index) => {
        let date = item.DOB;
        const dob = moment(date).format('Do MMM YYYY');
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
            <View style={{flex: 1, marginBottom: hp(1)}}>
                <View style={style.mainView}>
                    {item?.IsInfluencer === IS_OUR_ENFLUENCER &&
                    <View
                        style={{
                            position: 'absolute',
                            // backgroundColor: color.green,
                            top: 10,
                            right: 10,
                            borderBottomLeftRadius: wp(2),
                            borderTopRightRadius: wp(2),
                            zIndex: 1000,
                        }}>
                        <TouchableHighlight
                            onPress={() => {
                                // displayDetailPage(index);
                            }}>
                            <Text style={{fontSize: normalize(20)}}>*</Text>
                        </TouchableHighlight>
                    </View>
                    }
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            {typeof item.ProfileImage === 'undefined' ||
                            item.ProfileImage === '-' ||
                            item.ProfileImage === null ||
                            item.ProfileImage === '' ? (
                                <TouchableWithoutFeedback onPress={() => displayImageInFullScreen()}>
                                    <Image style={{height: wp(20), width: wp(20), borderRadius: wp(10)}} source={DefaultMaleIcon} />
                                </TouchableWithoutFeedback>
                            ) : (
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        displayImageInFullScreen(item.ProfileImage);
                                    }}>
                                    <Image
                                        style={{height: wp(20), width: wp(20), borderRadius: wp(10)}}
                                        resizeMode={'cover'}
                                        onLoad={e => {}}
                                        source={{
                                            uri: item.ProfileImage,
                                        }}
                                    />
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        <View style={{flex: 1, justifyContent: 'space-between'}}>
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {/*{item.FirstName + ' ' + item.MiddleName + ' ' + item.LastName}*/}
                                {item?.FirstName}
                            </Text>
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {item?.FatherEntry!==null ?"Father Name":item?.SpouseEntry!==null?item?.Gender==="male"?"Wife Name ":"Husband Name":"Father Name "}
                            </Text>
                            <Text allowFontScaling={false} style={style.fontStyle}>
                                {item?.MiddleName}
                            </Text>
                            <View style={{flexDirection:'row',flex:1,justifyContent: 'space-between'}}>
                                <View style={{flex:1}}>
                            {(item?.VoterVotingId !== "" && item?.VoterVotingId !== null) &&
                                <Text style={style.fontStyle}>{item?.VoterVotingId}</Text>
                            }
                                </View>
                            <View style={{alignItems:'center',justifyContent:'center',height:hp(2.5),width:wp(25),borderRadius:hp(1.5),backgroundColor:item?.TrustFactor?.Color??'transparent'}}>
                                <Text style={{fontSize:normalize(8),fontWeight:'700'}}>{item?.TrustFactor?.Name}</Text>
                            </View>
                            </View>

                            {item.Email !== '' &&
                            item.Email !== '-' &&
                            item.Email !== null &&
                            typeof item.Email !== 'undefined' && (
                                <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                    <Image
                                        source={require('../../assets/images/mail.png')}
                                        style={style.iconStyle}
                                    />
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            style.subText,
                                            {
                                                marginLeft: wp(1),
                                                flex: 1,
                                                textDecorationLine: 'underline',
                                                color: color.blue,
                                                textDecorationColor: color.blue,
                                            },
                                        ]}
                                        onPress={() => {
                                            Linking.openURL(`mailto:${item.Email}`).then((res)=>{}).catch((err)=>{
                                                alert("Fail to send mail")
                                            });;
                                        }}>
                                        {item.Email.toLowerCase()}
                                    </Text>
                                </View>
                            )}
                            {item?.Mobile &&
                            <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                <View style={[style.common, {flex: 1}]}>
                                    <Image
                                        source={require('../../assets/images/phone.png')}
                                        style={style.iconStyle}
                                    />
                                    <Text
                                        allowFontScaling={false}
                                        onPress={() => {
                                            Linking.openURL(
                                                `tel:${
                                                    item.Mobile
                                                    }`
                                            ).then((res)=>{}).catch((err)=>{
                                                alert("Fail to make call")
                                            });
                                        }}
                                        style={[
                                            style.subText,
                                            {
                                                marginLeft: wp(1),
                                                textDecorationLine: 'underline',
                                                color: color.blue,
                                                textDecorationColor: color.blue,
                                            },
                                        ]}>
                                        {item.Mobile}
                                    </Text>
                                </View>

                                <View style={[style.birthdayView, {flex: 1}]}>
                                    {item?.DOB &&
                                    <View style={{flexDirection: 'row'}}>
                                        <Image source={require('../../assets/images/cake.png')}
                                               style={style.iconStyle}/>
                                        <Text allowFontScaling={false} style={{...style.subText, marginLeft: wp(1)}}>
                                            {dob}
                                        </Text>
                                    </View>
                                    }
                                </View>
                            </View>
                            }
                            <View style={[style.common, {marginLeft: wp(2), marginTop: hp(0.8)}]}>
                                <View style={[style.common, {flex: 2}]}>
                                    <Image
                                        source={require('../../assets/images/gender.png')}
                                        style={style.iconStyle}
                                    />
                                    <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                        {item.Gender !== '' &&
                                        item.Gender !== '-' &&
                                        item.Gender !== null &&
                                        autoCapitalString(item.Gender)}
                                    </Text>
                                </View>
                                <View style={[style.common, {flex: 2}]}>
                                    <Text style={style.subText}>AGE:</Text>
                                    <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                        {item?.Age}
                                    </Text>
                                </View>
                                {item?.MaritalStatus &&
                                <View style={[style.common, {flex: 1.5}]}>
                                    <Image
                                        source={require('../../assets/images/marital_status.png')}
                                        style={style.iconStyle}
                                    />
                                    <Text allowFontScaling={false} style={[style.subText, {marginLeft: wp(1)}]}>
                                        {item.MaritalStatus !== '' &&
                                        item.MaritalStatus !== '-' &&
                                        item.MaritalStatus !== null &&
                                        autoCapitalString(item.MaritalStatus)}
                                    </Text>
                                </View>
                                }

                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <View style={{flex: 1 }}>
            <AppHeader
                title={'Influencers'}
                onMenuPress={() => {
                    openDrawer();
                }}
            />


            <SwipeListView
                directionalDistanceChangeThreshold={10}
                useFlatList={true}
                listViewRef={flatlistRef}
                data={influencerList}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                recalculateHiddenLayout={true}
                renderItem={({item, index}) => isWEB?_RenderItemForWeb(item, index):_RenderItem(item, index)}
                renderHiddenItem={(data, rowMap) => _renderHiddenComponent(data, rowMap)}
                closeOnScroll={true}
                rightOpenValue={-wp(18)}
                rightActivationValue={isANDROID ? -1104545 : -wp(35)}
                disableRightSwipe={true}
                onRightActionStatusChange={() => {
                    setTimeout(() => {
                        displayDetailPage(tempCurrent);
                        // displayDetailPage(currentMemberId.currentMember);
                        openRowRef && openRowRef.closeRow();
                    }, 50);
                }}
                contentContainerStyle={{
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(1),
                }}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                extraData={{...props}}
                refreshing={refreshPage}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => {
                    setOnEndReachedCalledDuringMomentum(false);
                }}
                onRowOpen={(rowKey, rowMap) => {
                    openRowRef = rowMap[rowKey];
                    tempCurrent = rowKey;
                    currentMemberId.currentMember = rowKey;
                    if (isANDROID) {
                      openRowRef = rowMap[rowKey];
                    }
                }}
                onEndReachedThreshold={0.5}
                bounces={isANDROID ? false : true}
                onSwipeValueChange={swipeData => {
                    if (isANDROID) {
                        if (
                            swipeData.direction === 'left' &&
                            !swipeData.isOpen &&
                            swipeData.value <= -150
                        ) {
                            openRowRef && openRowRef.closeRow();
                            displayDetailPage(swipeData.key);
                        }
                    }
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
            {imagePreviewFlag && (
                <ImageFullScreenPreview imgPath={currentImage} setPreviewClose={closeImagePreview} />
            )}
        </View>
    );
};
const style = StyleSheet.create({
    searchTextinput: {
        flexDirection: 'row',
        marginHorizontal: wp(3),
        marginVertical: hp(1),
        paddingHorizontal: hp(2),
        backgroundColor: color.creamGray,
        borderRadius: wp(2),
        ...shadowStyle,
        elevation: 10,
    },
    subText: {
        fontSize: normalize(8),
    },
    common: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontStyle: {
        color: color.blue,
        fontSize: normalize(8),
        // fontFamily: font.robotoRegular,
        marginLeft: wp(2),
        fontWeight: 'bold',
    },
    mainView: {
        flexDirection: 'row',
        backgroundColor: color.white,
        // backgroundColor: 'red',
        borderRadius: wp(2),
        alignSelf: 'center',
        ...shadowStyle,
        paddingRight: wp(2),
        paddingLeft: wp(3),
        paddingVertical: hp(1),
        elevation: 10,
    },
    birthdayView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        // justifyContent: 'flex-end',
    },
    searchContainer: {
        fontSize: normalize(14),
        marginLeft: wp(2),
        paddingVertical: hp(1.5),
        flex: 1,
        color: color.black,
    },
    rowBack: {
        marginBottom: hp(1),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(2.5),
        backgroundColor: color.themePurple,
        borderRadius: wp(2),
    },
    iconStyle: {
        width: hp(2),
        height:hp(2)
    },
    sortLabel: {
        fontSize: normalize(15),
        color: '#414141',
        fontWeight: 'bold',
    },
    sortListItem: {
        fontSize: normalize(16),
        // fontWeight: 'bold',
        color: color.blue,
    },
    sortViewHeader: {
        height: hp(5.5),
        backgroundColor: color.blue,
    },
    sortViewHeaderText: {
        fontWeight: 'bold',
        fontSize: normalize(15),
        color: color.white,
        // color: color.white,
    },
    sortViewButton: {
        height: hp(4),
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: hp(0.5),
    },
    sortButtonText: {
        fontSize: normalize(14),
        fontWeight: 'bold',
    },
    sortMainView: {
        flex: 1,
        marginTop: hp(1),
        flexDirection: 'row',
        padding: hp(0.5),
        alignItems: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    dividerView: {
        height: hp(0.05),
        backgroundColor: color.gray,
        width: wp(75),
        alignSelf: 'center',
    },
    sortModalMainView: {
        flex: 0,
        width: wp(84),
        backgroundColor: color.white,
    },
    sortModalTopRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: wp(10),
    },
    groupView: {
        backgroundColor: color.creamDarkGray,
        padding: wp(2),
        borderRadius: wp(5),
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: hp(0.5),
        borderBottomColor: color.gray,
    },
    floatingInputStyle: {
        borderWidth: 0,
        fontSize: normalize(12),
        // fontFamily: font.robotoRegular,
        height: isANDROID ? hp(6) : hp(5),
        marginTop: isANDROID ? hp(3) : hp(2),
    },
    excelTextStyle:{fontSize:normalize(15),flex:1,marginLeft:wp(1)},
    sortModalBottomRow: {height: hp(10), alignItems: 'center', justifyContent: 'center'},
});

export default InflunecerMemberScreen;
