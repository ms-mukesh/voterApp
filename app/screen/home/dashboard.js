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
import {
    AppButton,
    AppHeader,
    BoothListModel,
    FamilyListModel,
    FloatingLabel,
    GoBackHeader,
    LabelInputText,
    Loading
} from "../common";
import CloseButton from "../common/ClearButton";
import {color, font, hp, isANDROID, IsAndroidOS, isIOS, IsIOSOS, isWEB, normalize, wp} from "../../helper/themeHelper";
import {center, shadowStyle} from "../../helper/styles";
import {SwipeListView} from "react-native-swipe-list-view";
import moment from "moment";
import {autoCapitalString, isAlpha} from "../../helper/validation";
import {FAB} from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import {sort_icon, filter_icon, export_icon, empty_star, filled_start} from "../../assets/images";
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
// import DocumentPicker from 'react-native-document-picker';



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
import {insertBulkData, insertBulkDataFromWeb} from "../../redux/actions/userActions";
import {
    fetchVolunteerTask,
    insertVoterDataChangeRequest,
    updateTaskInformation
} from "../../redux/actions/volunteerAction";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {uploadExcelOnFirebase, uploadPdfOnFirebase, uriToBlob} from "../../helper/firebaseUploadFunctions";


const Dashboard = props => {
    let currentBoothIdFoVoters = 1;
    const {fromDashBoard = false} = props?.route?.params
    console.log("params--",props?.route?.params)
    const defaultBoothDetail = {
        name:'',
        state:'',
        city:'',
        district:'',
        address:'',
        code:''
    }
    const userDetails = useSelector(state => state.user.userDetail);
    const [bootListFlag,setBoothListFlag] = useState(false);
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
        setExcelItemPreviewFlag(false)
        getData('', true)
    },[])
    // useEffect(()=>{
    //    dispatch(getAllBoothList()).then(async (res)=>{
    //        if(res){
    //            await setBoothList(res)
    //        }
    //    })
    // },[])
    const insertNewWardInDb = () =>{
        if(wardDetail.address ===""){
            alert("please enter address !")
            return;
        }
        if(wardDetail.code === ""){
            alert("please enter ward code !")
            return;
        }
        else {
            let insNewWardObj = {
                WardName:wardDetail.name,
                WardAddress:wardDetail.address,
                WardCity:wardDetail.city,
                WardState:wardDetail.state,
                DistrictName:wardDetail.district,
                WardCode:wardDetail.code,
            }
            setCreateNewBoothFlag(false);
            dispatch(addNewBoothToDb(insNewWardObj)).then(async (res)=>{
                if(res){
                    currentBoothIdFoVoters = res;
                    setWardDetail(defaultBoothDetail)
                    setTimeout(()=>{
                        openDocPicker();
                    },100)
                }
            })
        }
    }
    const renderNewWardForm=()=>{
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
                            <Text style={{fontSize:normalize(20),fontWeight:'700',color:color.themePurple}}>CREATE NEW BOOTH</Text>
                        </View>
                        {renderNameFloatingTextInput("ADDRESS",wardDetail.address,"address",true,true)}
                        <View style={{height:hp(3)}}/>
                        <View style={{flexDirection:'row'}}>
                            {renderNameFloatingTextInput("BOOTH NAME",wardDetail.name,"name",false)}
                            {renderNameFloatingTextInput("BOOTH NUMBER",wardDetail.code,"code",true)}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            {renderNameFloatingTextInput("CITY / VILLAGE",wardDetail.city,"city",false)}
                            {renderNameFloatingTextInput("STATE",wardDetail.state,"state",false)}
                        </View>
                        <View style={{flexDirection:'row',marginTop:hp(2)}}>
                            {renderNameFloatingTextInput("DISTRICT",wardDetail.district,"district",false)}
                        </View>
                        <View style={{marginTop:hp(5)}}>
                            <AppButton
                                title={'ADD BOOTH'}
                                onPress={() => {
                                    insertNewWardInDb()
                                }}
                            />
                        </View>
                    </View>


                </KeyboardAwareScrollView>
            </View>
        )


    }
    const searchText = useCallback(value => {
        if (SearchField.length > 0) {
            Keyboard.dismiss();
            if (SearchField !== null) {
                let obj = {
                    nameTxt: SearchField,
                };
                setBgFlag(true);
                dispatch(getSearchMember(obj)).then(res => {
                    if (res.length === 0) {
                        setBgFlag(false);
                        Alert.alert(
                            '',
                            'No member found with this search!',
                            [
                                {
                                    text: 'Okay',
                                    onPress: () => {
                                        setRenderFlag(false);
                                        setTimeout(() => {
                                            flatlistRef &&
                                            flatlistRef !== null &&
                                            flatlistRef.current.scrollToOffset({animated: true, offset: 0});
                                            setRenderFlag(true);
                                        }, 100);
                                        setSearchField('');
                                        setsearchData([]);
                                        // dispatch(setSearchData([]));
                                    },
                                },
                            ],
                            {
                                cancelable: false,
                            }
                        );
                    } else {
                        // setFilterFlag(false);
                        // setSortFlag(false);
                        // setFilterData([]);
                        setBgFlag(false);
                        // setSortData([]);
                        setFilterFlag(false);
                        setsearchData(res);
                        // setCurrentFilter({...defaultFilterObject});
                        setSearchFlag(1);
                        // setAvailableSort([...defaultAvailableSort]);
                        // setSortCreteria([]);
                        flatlistRef &&
                        flatlistRef !== null &&
                        flatlistRef.current.scrollToOffset({animated: true, offset: 0});
                        setRenderFlag(false);
                        setTimeout(() => {
                            flatlistRef &&
                            flatlistRef !== null &&
                            flatlistRef.current.scrollToOffset({animated: true, offset: 0});
                            setRenderFlag(true);
                        }, 100);
                    }
                });
            }
        }
    });
    const _renderHiddenComponent = (data, rowMap) => {
        // if (isLoading) {
        //     return null;
        // } else if (!renderFlag) {
        //     return null;
        // }
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
    const convertToJson = (csv) =>{
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }

        //return result; //JavaScript object
        console.log("data--",result)
        return JSON.stringify(result); //JSON
    }
    const readFile = (file) => {
        var f = file;
        var name = f.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            console.log("Data>>>" + data);// shows that excel data is read
            console.log(this.convertToJson(data)); // shows data in json format
        };
        reader.readAsBinaryString(f);
    }
    const renderExcelSheet = ({item,index}) =>{
        return(
            <View style={{flex:1}}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <Text style={[style.excelTextStyle,{flex:2}]}>{item?.name}</Text>
                    <Text style={style.excelTextStyle}>{item?.middleName}</Text>
                    <Text style={style.excelTextStyle}>{item?.age}</Text>
                    <Text style={style.excelTextStyle}>{item?.gender}</Text>
                    <Text style={style.excelTextStyle}>{item?.address}</Text>
                    <Text style={style.excelTextStyle}>{item?.roomno}</Text>
                </View>
            </View>
        )
    }

    const openDocPicker =async () =>{
        // let result = await DocumentPicker.pick({
        //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // });
        // result-- {"fileCopyUri": "content://com.android.externalstorage.documents/document/primary%3AWhatsApp%2FMedia%2FWhatsApp%20Documents%2FAPi.xlsx", "name": "APi.xlsx", "size": 11621, "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "uri": "content://com.android.externalstorage.documents/document/primary%3AWhatsApp%2FMedia%2FWhatsApp%20Documents%2FAPi.xlsx"}
        // res-- {"name": "APi.xlsx", "size": 11621, "type": "success", "uri": "file:///data/user/0/com.frontendtask/cache/DocumentPicker/d46c151e-a38f-4cad-970e-b4da7b128401.xlsx"}

        dispatch(setLoaderStatus(true))
        let result = await DocumentPicker.getDocumentAsync({
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // all files
            // type: "image/*" // all images files
            // type: "audio/*" // all audio files
            // type: "application/*" // for pdf, doc and docx
            // type: "application/pdf" // .pdf
            // type: "application/msword" // .doc
            // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
            // type: "vnd.ms-excel" // .xls
            // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
            // type: "text/csv" // .csv
        });
        console.log("result--",result)
        dispatch(setLoaderStatus(true))
        alert("please wait for a while....we are adding your data....thank you")
        uploadExcelOnFirebase(result?.uri).then((res)=>{
            console.log(res)
            if(res){
                dispatch(insertBulkDataFromWeb({
                    fileUrl:res
                })).then((isDataInserted)=>{
                        if(isDataInserted){
                            alert("Data is Added...!")
                        } else {
                            alert("Failed To Add Data...!")
                        }
                })
            }
            dispatch(setLoaderStatus(false))
        }).catch((err)=>{
            dispatch(setLoaderStatus(false))
        })
        let csvData = []
        // if(result){
        //     await FileSystem.readAsStringAsync(result?.uri,{encoding:'base64'}).then(b64 => XLSX.read(b64, {type: "base64"})).then(wb => { csvData = XLSX.utils.sheet_to_json(wb?.Sheets.Sheet1) });
        //     // await FileSystem.readAsStringAsync(result?.uri,{encoding:'base64',length:30540745,position: 2147483648}).then((data)=>{
        //     //     console.log("data---",data)
        //     // })
        //     console.log("csv data--",csvData)
        //     if(csvData.length>0){
        //         console.log("csv data--",csvData)
        //         if(isDefined(csvData[0].AcNameEn) && isDefined(csvData[0].PollingAddressEn) && isDefined(csvData[0].Age) && isDefined(csvData[0].SectionNameEn) &&
        //             isDefined(csvData[0].PartNameEn) && isDefined(csvData[0].RelationName)  && isDefined(csvData[0].RelayionType) && isDefined(csvData[0].Sex)
        //             && isDefined(csvData[0].SectionNo) && isDefined(csvData[0].VoterId) && isDefined(csvData[0].VoterNameEn) && isDefined(csvData[0].VoterName)
        //         ){
        //             await setExcelData([...csvData])
        //             dispatch(insertBulkData({csvData:csvData.slice(0,50)})).then((res)=>{
        //                 getData()
        //                 if(res){
        //                     Alert.alert(
        //                         '',
        //                         'Voter Added to List',
        //                         [
        //                             {
        //                                 text: 'OK',
        //                                 onPress: () => {
        //                                     console.log('ok');
        //                                 },
        //                             },
        //
        //                         ],
        //                         {
        //                             cancelable: true,
        //                         }
        //                     );
        //                 }
        //             }).catch((err)=>{
        //                 console.log(err)
        //
        //             })
        //             // setExcelItemPreviewFlag(true)
        //             // await setExcelData([...csvData])
        //             // dispatch(insertBulkData({csvData:csvData})).then((res)=>{
        //             //     if(res){
        //             //         alert("added data")
        //             //     }
        //             // })
        //         } else {
        //             alert("invalid excel file ")
        //             dispatch(setLoaderStatus(false))
        //         }
        //     } else {
        //         alert("not able to fetch data from excel file")
        //         dispatch(setLoaderStatus(false))
        //     }
        //
        // } else {
        //     alert("Fail to upload file's data")
        //     dispatch(setLoaderStatus(false))
        // }
    }
    const changeUserInfluncerStatus = (voterId,status) =>{
        if(isDefined(voterId) && isDefined(status)){
            let obj = {
                updatingVoterId:voterId,
                influencer:status,
                role:ADMIN
            }
            dispatch(insertVoterDataChangeRequest(obj)).then((res)=>{
                if(res){
                    getData('', false)
                }
            })
        }
    }
    const _RenderItem = (item, index) => {
        let date = item.DOB;
        const dob = moment(date).format('Do MMM YYYY');
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
            <View style={{flex: 1, marginBottom: hp(1)}}>
                <View style={style.mainView}>
                    <View
                        style={{
                            position: 'absolute',
                            top: hp(1),
                            right: 10,
                            borderBottomLeftRadius: wp(2),
                            borderTopRightRadius: wp(2),
                            zIndex: 1000,
                        }}>
                        <TouchableWithoutFeedback onPress={()=>{userDetails?.role === ADMIN ?changeUserInfluncerStatus(item?.VoterId,item?.IsInfluencer === IS_OUR_ENFLUENCER?'0':'1'):console.log("no right to change")}}>
                            {/*<View style={{height:hp(3),width:hp(3),borderRadius:hp(1.5),backgroundColor:item?.IsInfluencer === IS_OUR_ENFLUENCER?color.themePurple:color.gray}}>*/}
                            {/*</View>*/}
                            <Image style={{height:hp(3),width:hp(3)}} source={item?.IsInfluencer === IS_OUR_ENFLUENCER?filled_start:empty_star} />
                            {/*<Text>fdfdf</Text>*/}
                        </TouchableWithoutFeedback>
                    </View>
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
                            <View style={{alignItems:'center',justifyContent:'center',height:hp(2.5),width:wp(25),borderRadius:hp(1.5),backgroundColor:item?.TrustFactor?.Color??'transparent'}}>
                                <Text style={{fontSize:normalize(10),fontWeight:'700'}}>{item?.TrustFactor?.Name}</Text>
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
    const _RenderItemForWeb = (item, index) => {
        let date = item.DOB;
        const dob = moment(date).format('Do MMM YYYY');
        return (
            <TouchableWithoutFeedback onPress={()=>{
                displayDetailPage(index)
            }}>
                <View style={{flex: 1, marginBottom: hp(1)}}>
                    <View style={[style.mainView,{width:(IsIOSOS || IsAndroidOS)?wp(90):wp(30)}]}>
                        <View
                            style={{
                                position: 'absolute',
                                top: hp(1),
                                right: 10,
                                borderBottomLeftRadius: wp(2),
                                borderTopRightRadius: wp(2),
                                zIndex: 1000,
                            }}>
                            <TouchableWithoutFeedback onPress={()=>{userDetails?.role === ADMIN ?changeUserInfluncerStatus(item?.VoterId,item?.IsInfluencer === IS_OUR_ENFLUENCER?'0':'1'):console.log("no right to change")}}>
                                {/*<View style={{height:hp(3),width:hp(3),borderRadius:hp(1.5),backgroundColor:item?.IsInfluencer === IS_OUR_ENFLUENCER?color.themePurple:color.gray}}>*/}
                                {/*</View>*/}
                                <Image style={{height:hp(3),width:hp(3)}} source={item?.IsInfluencer === IS_OUR_ENFLUENCER?filled_start:empty_star} />
                                {/*<Text>fdfdf</Text>*/}
                            </TouchableWithoutFeedback>
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
                                <Text numberOfLines={2} allowFontScaling={false} style={[style.fontStyle,{width:wp(25)}]}>
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
                                    <View style={{alignItems:'center',justifyContent:'center',height:hp(4),width:(IsIOSOS || IsAndroidOS)?wp(20):wp(10),borderRadius:hp(1.5),backgroundColor:item?.TrustFactor?.Color??'transparent'}}>
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
    const addNewVoters = () =>{
        // dispatch(getAllBoothList()).then(async (res)=>{
        //     if(res){
        //         await setBoothList(res);
        //         await setBoothListFlag(true)
        //     }
        // })

        openDocPicker()
    }
    const closeBoothListModal=()=>{
        setBoothListFlag(false)
    }
    const updateBoothId = async (value) =>{
        currentBoothIdFoVoters = value;
        await setCuurentBoothId(value);
        await setBoothListFlag(false);
        setTimeout(()=>{
            openDocPicker();
        },100)

    }
    const onNewBoothPress = async () =>{
        setBoothListFlag(false)
        await setCreateNewBoothFlag(true)
    }
    return (
        <View style={{flex: 1 }}>
            {/*<AppHeader*/}
            {/*    title={'Dashboard'}*/}
            {/*    onMenuPress={() => {*/}
            {/*        openDrawer();*/}
            {/*    }}*/}
            {/*    onRightTitlePress={()=>{*/}
            {/*        addNewVoters()*/}
            {/*    }}*/}
            {/*    onFilterIconPress={()=>{*/}
            {/*        openFilterPage();*/}
            {/*    }}*/}

            {/*/>*/}
            {!fromDashBoard ? <AppHeader
                    title={'Dashboard'}
                    onMenuPress={() => {
                        openDrawer();
                    }}
                    onRightTitlePress={()=>{
                        addNewVoters()
                    }}
                    onFilterIconPress={()=>{
                        openFilterPage();
                    }}

                />:
                <GoBackHeader title={'Dashboard'} onMenuPress={()=>{
                    props.navigation.goBack()
                }} />
            }
            {isLoading && <Loading isLoading={isLoading} />}
            <View style={style.searchTextinput}>
                    <TextInput
                        allowFontScaling={false}
                        style={[style.searchContainer, {justifyContent: 'center'}]}
                        placeholder={'Search Voter...' + ' '}
                        placeholderTextColor={color.black}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        value={SearchField}
                        onChangeText={onTextChange}
                        onSubmitEditing={searchText}
                    />
                {SearchField.length > 0 &&
                <TouchableWithoutFeedback onPress={()=>{
                    Keyboard.dismiss()
                    onCancel()
                }}>
                <Image source={cross_black_icon} style={{marginRight:wp(5),alignSelf: 'center', height: hp(1.5), width: hp(1.5)}}/>
                </TouchableWithoutFeedback>
                }
                {SearchField.length > 0 &&
                    <TouchableWithoutFeedback onPress={()=>{
                        Keyboard.dismiss()
                        searchText()
                    }}>
                <Image source={search_icon} style={{alignSelf: 'center', height: hp(2), width: hp(2)}}/>
                    </TouchableWithoutFeedback>
                }


            </View>

            {imagePreviewFlag && (
                <ImageFullScreenPreview imgPath={currentImage} setPreviewClose={closeImagePreview} />
            )}

            <SwipeListView
                directionalDistanceChangeThreshold={10}
                useFlatList={true}
                listViewRef={flatlistRef}
                data={
                    filterFlag && filterData.length > 0
                        ? filterData.map((x, index) => {
                            return {...x, key: index};
                        }):
                    searchFlag === 1 && SearchField.length > 0 && searchData.length > 0
                        ? searchData.map((x, index) => {
                            return {...x, key: index};
                        })
                        :
                        voterListData?.data?.map((x, index) => {
                        return {...x, key: index};
                    })
                }
                numColumns={(IsIOSOS || IsAndroidOS)?1:3}
                keyExtractor={(item, index) => index.toString()}
                recalculateHiddenLayout={true}
                renderItem={({item, index}) => _RenderItemForWeb(item, index)}
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
                onRefresh={() => getData('', true)}
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
                onEndReached={distanceFromEnd => {
                    if (!onEndReachedCalledDuringMomentum) {
                        if (
                            voterListData.next_endpoint !== 'null' &&
                            voterListData.next_endpoint !== null && searchFlag === 0
                        ) {
                            getData(voterListData.next_endpoint); // LOAD MORE DATA
                            setOnEndReachedCalledDuringMomentum(true);
                        }
                    }
                }}
                bounces={isANDROID ? false : true}
                onSwipeValueChange={swipeData => {
                    if (isANDROID) {
                        if (
                            swipeData.direction === 'left' &&
                            !swipeData.isOpen &&
                            swipeData.value <= -150
                        ) {
                            // setTimeout(() => {
                            // alert("called")
                            openRowRef && openRowRef.closeRow();
                            displayDetailPage(swipeData.key);

                            // }, 100);
                        }
                    }
                }}
            />
            <FAB.Group
                color={color.white}
                fabStyle={{...center,backgroundColor: color.blue,height:wp(3),width:wp(3),borderRadius:wp(1.5)}}
                open={open}
                // icon={'menu'}
                // icon={!open ? fabIconOpen : fabIconClose}
                // icon={fabIconOpen}
                icon={require('../../assets/images/more.png')}
                actions={actions}
                onStateChange={onStateChange}
            />

            {bootListFlag &&
            <BoothListModel onNewBoothPress={onNewBoothPress} closeFamilyModal={closeBoothListModal} updateVoterFamilyId={updateBoothId} familyList={boothList}/>}

            {excelItemPreviewFlag &&
            <Modal
                onRequestClose={() => setExcelItemPreviewFlag(false)}
                animated={true}
                transparent={true}
                visible={true}>
                <View style={{
                    flex: 1,
                    backgroundColor: color.white,
                }}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setExcelItemPreviewFlag(false)
                    }}>
                        <Image source={cross_black_icon} style={[{height: wp(6),width:wp(6)}]}/>

                    </TouchableWithoutFeedback>
                    <FlatList
                        ListHeaderComponent={
                            <View style={{flex:1,flexDirection:'row'}}>
                                <Text style={[style.excelTextStyle,{flex:2}]}>NAME</Text>
                                <Text style={style.excelTextStyle}>MIDDLENAMe</Text>
                                <Text style={style.excelTextStyle}>AGE</Text>
                                <Text style={style.excelTextStyle}>GENDER</Text>
                                <Text style={style.excelTextStyle}>ADDRESS</Text>
                                <Text style={style.excelTextStyle}>ROOM NO</Text>
                            </View>
                        }
                        numColumns={1}
                        // data={[...data.imgPath, ...data.docPath]}
                        data={excelData}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={true}
                        renderItem={renderExcelSheet}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <AppButton
                        title={'SAVE'}
                        onPress={() => {
                            setExcelItemPreviewFlag(false)
                            dispatch(insertBulkData({csvData:excelData,boothId:currentBoothIdFoVoters})).then((res)=>{
                                if(res){
                                    Alert.alert(
                                        '',
                                        'Voter Added to List',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    console.log('ok');
                                                },
                                            },

                                        ],
                                        {
                                            cancelable: true,
                                        }
                                    );
                                }
                            }).catch((err)=>{
                                console.log(err)

                            })
                        }}
                    />
                </View>
            </Modal>
            }

            {createNewBoothFlag &&
            <Modal
                onRequestClose={() => setCreateNewBoothFlag(false)}
                animated={true}
                transparent={true}
                visible={true}>
                <SafeAreaView style={{
                    flex: 1,
                    backgroundColor: color.white,
                }}>
                    <TouchableWithoutFeedback onPress={()=>{
                        setCreateNewBoothFlag(false);
                        setWardDetail(defaultBoothDetail)
                    }}>
                        <Text source={cross_black_icon} style={[{fontSize:normalize(15),marginRight: wp(2),fontWeight:'700',alignSelf:'flex-end'}]}>close</Text>
                    </TouchableWithoutFeedback>
                    {renderNewWardForm()}


                </SafeAreaView>
            </Modal>
            }
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

export default Dashboard;
