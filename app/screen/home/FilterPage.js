import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {cross_black_icon} from "../../assets/images";
// import RangeSlider from 'rn-range-slider';
import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import {color, font, hp, isANDROID, normalize, wp} from '../../helper/themeHelper';
import DatePickerModel from '../common/DatePickerModelForEdit';
// import {createSortingObject} from '../../functions';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
  BackHandler,
  Modal,
  ActivityIndicator,
  Alert,
    Image
} from 'react-native';
import {Background, NotificationHeaderStyle, CustomText, Loading} from '../../screen/common';
import {
  // filterMembers,
  // filterMembersForCount,
  defaultFilterObject, filterMembers,
} from '../../redux/actions/dashboardAction';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {defaultAvailableSort} from '../../helper/constant';

const defaultFilterObj = {
  ...defaultFilterObject,
  // foundResult:
};
let tempCityArray = [];
let tempTrustArray = [];
let tempDistrcitArray = [];
let tempStateArray = [];
let tempCountryArray = [];
let tempNativePlace = [];
let tempMaritalStatus = [];
let tempCastArray = [];
let tempDaughterStatus = [];
let tempHeadStatus = [];
let tempGender = [];
let tempCallAsynStack = [];
let tempIndex = 0;
let callAsynFunctionStack = [];
let tempCallingApiArray = [];
let tempBoothName = []

Array.prototype.remove = function() {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};
const FilterPage = props => {
  const loading = useSelector(state => state.appDefaultSettingReducer.isLoading);

  const {
    setFilter,
    currentFilter,
    setFlagForFilter,
    setDataForFilter,
    searchData,
    filterDataLength,
    sortingCrieteria,
    filterIntroScreenFlag,
  } = props.route.params;

  const dispatch = useDispatch();
  const [filterObj, setFilterObj] = useState({...defaultFilterObj});
  const [maxAge, setMaxAge] = useState(100);
  const [minAge, setMinAge] = useState(0);
  const [loader, setLoader] = useState(false);
  const [currentIndexToCallApi, setCurrentIndexToCallApi] = useState(0);
  const [initialIndexFlag, setInitialIndexFlag] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [resultItem, setResultItem] = useState({});
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(100);
  const [value, setValue] = useState(0);
  const [scrollEnabledFlag, setSrollEnabledFlag] = useState(true);
    const handleBackPress = () => {
    setDataForFilter([]);
    setFlagForFilter(false);
    setFilter({...defaultFilterObj});
    setDefaultTempArray();
    props.navigation.goBack();
    return true;
  };
  let rangeSlider = useRef(null);
  useEffect(() => {
    if (_.isEqual(currentFilter, defaultFilterObj)) {
      tempDistrcitArray = [];
      tempTrustArray = [];
      tempCityArray = [];
      tempStateArray = [];
      tempCastArray = [];
      tempCountryArray = [];
      tempNativePlace = [];
      tempBoothName = [];
      tempMaritalStatus = [];
      tempDaughterStatus = [];
      tempHeadStatus = [];
      tempGender = [];
      tempCallAsynStack = [];
      tempIndex = 0;
      callAsynFunctionStack = [];
      tempCallingApiArray = [];
    }
    setSrollEnabledFlag(true);
  }, [currentIndexToCallApi, setCurrentIndexToCallApi]);

  const callAsyncronusApi = async () => {
    setSrollEnabledFlag(true);
    let tempObj = {};
    setCurrentIndexToCallApi(tempIndex);
    tempObj = await createFilterObject(arrayData);
    // Promise.all(tempObj);
    // Promise.all([
    //   dispatch(filterMembersForCount({filterFields: tempObj})).then(res => {
    //     if (res > 0 && !_.isEmpty(tempObj)) {
    //       setArrayData({...arrayData, foundResult: res});
    //     } else {
    //       setArrayData({...arrayData, foundResult: 0});
    //     }
    //   }),
    // ]);
  };

  useEffect(() => {
    setArrayData(currentFilter);
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [arrayData, setArrayData] = useState({
    ...defaultFilterObj,
    foundResult: filterDataLength,
  });
  const keyBoardViewRef = useRef(null);
  const flatListRef = useRef(null);
  const flatListRefCity = useRef(null);
  const flatListRefCast = useRef(null);
  const flatListRefTrustFactor = useRef(null);
  const flatListRefDistrict = useRef(null);
  const flatListRefState = useRef(null);
  const flatListRefCountry = useRef(null);
  const flatListRefNative = useRef(null);
  const flatListRefMarital = useRef(null);
  const flatListRefDaughter = useRef(null);

  const [dateForDatePicker, setDateForDatePicker] = useState({});
  const [currentKey, setCurrentKey] = useState();

  const {
    mainView,
    buttonStyle,
    buttonTextStyle,
    filterButton,
    filterText,
    headerText,
    backLine,
    closeIcon,
  } = style;

  // const _setIsAutoCompleteModel = value => {
  //   setIsAutoCompleteModel(value);
  // };
  // const _setValuesForAutoCompelete = (Value, keyName, Label) => {
  //   setSelectedValues(Value);
  //   _setCurrentKey(keyName);
  //   setSelectedField(Label);
  //   setIsAutoCompleteModel(true);
  //   _setCurrentKey(keyName);
  // };
  // const _setCurrentKey = key => {
  //   setCurrentKey(key);
  // };
  const _setIsShowDatePicker = value => {
    setIsShowDatePicker(value);
  };
  const _setDateForDatePicker = key => {
    setDateForDatePicker(arrayData[key]);
    setCurrentKey(key);
  };
  // const changeValue = () => {
  //   // User[currentKey] = setValues.toUpperCase();
  //   setFilterObj({...filterObj, [currentKey]: setValues});
  // };
  // const _setSelectedField = value => {};
  // const _setSelectedValues = value => {
  //   setSelectedValues(value);
  // };
  const _setDateFromKey = value => {
    _setIsShowDatePicker(false);
    if (currentKey === 'maxDate') {
      // setArrayData({...arrayData, maxDateFlag: true});
      arrayData.maxDateFlag = true;
    }
    if (currentKey === 'minDate') {
      // setArrayData({...arrayData, minDateFlag: true});
      arrayData.minDateFlag = true;
    }
    setArrayData({...arrayData, [currentKey]: value});
    arrayData[currentKey] = value;
    callAsyncronusApi();
  };
  const setToDefaultValue = () => {
    setDataForFilter([]);
    setFlagForFilter(false);
    setFilter({...defaultFilterObj});
  };

  const fetchFilterData = async filterObject => {
    // setLoaderTrue();
    setLoader(true);
    let filterFields = {};
    filterFields = {...filterFields, MinAge: fromValue,MaxAge:toValue};
    if (filterObject.maritalStatus != null && filterObject.maritalStatus.length > 0) {
      filterFields = {...filterFields, MaritalStatus: filterObject.maritalStatus};
    }
    if (filterObject.familyDaughter != null && filterObject.familyDaughter.length > 0) {
      filterFields = {...filterFields, IsDaughter: filterObject.familyDaughter};
    }
    if (filterObject.gender != null && filterObject.gender.length > 0) {
      filterFields = {...filterFields, Gender: filterObject.gender};
    }
    if (filterObject.state != null && filterObject.state.length > 0) {
      filterFields = {...filterFields, State: filterObject.state};
    }
    if (filterObject.cast != null && filterObject.cast.length > 0) {
      filterFields = {...filterFields, Cast: filterObject.cast};
    }
    if (filterObject.booth != null && filterObject.booth.length > 0) {
      filterFields = {...filterFields, BoothName: filterObject.booth};
    }
    if (filterObject.trust != null && filterObject.trust.length > 0) {
      filterFields = {...filterFields, TrustFactor: filterObject.trust};
    }
    if (filterObject.district != null && filterObject.district.length > 0) {
      filterFields = {...filterFields, District: filterObject.district};
    }
    if (filterObject.country != null && filterObject.country.length > 0) {
      filterFields = {...filterFields, Country: filterObject.country};
    }

    if (filterObject.nativePlace != null && filterObject.nativePlace.length > 0) {
      filterFields = {...filterFields, NativePlace: filterObject.nativePlace};
    }
    if (filterObject.city != null && filterObject.city.length > 0) {
      filterFields = {...filterFields, City: filterObject.city};
    }
    if (filterObject.familyHead != null && filterObject.familyHead.length > 0) {
      filterFields = {...filterFields, FamilyHead: filterObject.familyHead};
    }
    if (filterObject.minDateFlag) {
      filterFields = {...filterFields, MinDate: filterObject.minDate};
    }
    if (filterObject.maxDateFlag) {
      filterFields = {...filterFields, MaxDate: filterObject.maxDate};
    }
    // if (filterObject.MinAge !== 0) {
    //   filterFields = {...filterFields, MinAge: filterObject.MinAge};
    // }
    // if (filterObject.MaxAge !== 100) {
    //   filterFields = {...filterFields, MaxAge: filterObject.MaxAge};
    // }
    filterFields = {filterFields};
    dispatch(filterMembers(filterFields))
        .then(res => {
          if (res.length === 0) {
            Alert.alert(
                'Sorry!',
                'Sorry! No Match Found With This Filter',
                [
                  {
                    text: 'Okay',
                    onPress: () => {
                      setLoader(false);
                    },
                  },
                ],
                {
                  cancelable: false,
                }
            );

            setToDefaultValue();
          } else {
            setFilter(arrayData);
            setFlagForFilter(true);
            setDataForFilter(res);
            if (res && typeof res !== 'undefined') {
              setArrayData({...arrayData, foundResult: res.length});
            }
            arrayData.foundResult = res.length;
            setLoader(false);
            setTimeout(() => {
              props.navigation.goBack();
            }, 200);
          }
        })
        .catch(err => {
          console.log(err);
        });
    // if (sortingCrieteria.length > 0) {
    //   createSortingObject(sortingCrieteria).then(res => {
    //     if (res) {
    //       dispatch(filterMembers({...filterFields, sortingCreteria: res.sortingCrieteria}))
    //         .then(res => {
    //           if (res.length === 0) {
    //             Alert.alert(
    //               'Navgam',
    //               'Sorry! No Match Found With This Filter',
    //               [
    //                 {
    //                   text: 'Okay',
    //                   onPress: () => {
    //                     setLoader(false);
    //                   },
    //                 },
    //               ],
    //               {
    //                 cancelable: false,
    //               }
    //             );
    //
    //             setToDefaultValue();
    //           } else {
    //             setFilter(arrayData);
    //             setFlagForFilter(true);
    //             setDataForFilter(res);
    //             if (res && typeof res !== 'undefined') {
    //               setArrayData({...arrayData, foundResult: res.length});
    //             }
    //             arrayData.foundResult = res.length;
    //             setLoader(false);
    //             setTimeout(() => {
    //               props.navigation.goBack();
    //             }, 200);
    //           }
    //         })
    //         .catch(err => {
    //           console.log(err);
    //         });
    //     } else {
    //       dispatch(filterMembers(filterFields))
    //         .then(res => {
    //           if (res.length === 0) {
    //             Alert.alert(
    //               'Navgam',
    //               'Sorry! No Match Found With This Filter',
    //               [
    //                 {
    //                   text: 'Okay',
    //                   onPress: () => {
    //                     setLoader(false);
    //                   },
    //                 },
    //               ],
    //               {
    //                 cancelable: false,
    //               }
    //             );
    //
    //             setToDefaultValue();
    //           } else {
    //             setFilter(arrayData);
    //             setFlagForFilter(true);
    //             setDataForFilter(res);
    //             if (res && typeof res !== 'undefined') {
    //               setArrayData({...arrayData, foundResult: res.length});
    //             }
    //             arrayData.foundResult = res.length;
    //             setLoader(false);
    //             setTimeout(() => {
    //               props.navigation.goBack();
    //             }, 200);
    //           }
    //         })
    //         .catch(err => {
    //           console.log(err);
    //         });
    //     }
    //   });
    //
    // } else {
    //   dispatch(filterMembers(filterFields))
    //     .then(res => {
    //       if (res.length === 0) {
    //         Alert.alert(
    //           'Navgam',
    //           'Sorry! No Match Found With This Filter',
    //           [
    //             {
    //               text: 'Okay',
    //               onPress: () => {
    //                 setLoader(false);
    //               },
    //             },
    //           ],
    //           {
    //             cancelable: false,
    //           }
    //         );
    //
    //         setToDefaultValue();
    //       } else {
    //         setFilter(arrayData);
    //         setFlagForFilter(true);
    //         setDataForFilter(res);
    //         if (res && typeof res !== 'undefined') {
    //           setArrayData({...arrayData, foundResult: res.length});
    //         }
    //         arrayData.foundResult = res.length;
    //         setLoader(false);
    //         setTimeout(() => {
    //           props.navigation.goBack();
    //         }, 200);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  };

  const createFilterObject = filterObject => {
    let filterFields = {};
    if (filterObject.maritalStatus != null && filterObject.maritalStatus.length > 0) {
      filterFields = {...filterFields, MaritalStatus: filterObject.maritalStatus};
    }
    if (filterObject.familyDaughter != null && filterObject.familyDaughter.length > 0) {
      filterFields = {...filterFields, IsDaughter: filterObject.familyDaughter};

    }
    if (filterObject.gender != null && filterObject.gender.length > 0) {
      filterFields = {...filterFields, Gender: filterObject.gender};
    }

    if (filterObject.state != null && filterObject.state.length > 0) {
      filterFields = {...filterFields, State: filterObject.state};
    }

    if (filterObject.country != null && filterObject.country.length > 0) {
      filterFields = {...filterFields, Country: filterObject.country};
    }

    if (filterObject.nativePlace != null && filterObject.nativePlace.length > 0) {
      filterFields = {...filterFields, NativePlace: filterObject.nativePlace};
    }
    if (filterObject.city != null && filterObject.city.length > 0) {
      filterFields = {...filterFields, City: filterObject.city};
    }
    if (filterObject.familyHead != null && filterObject.familyHead.length > 0) {
      filterFields = {...filterFields, FamilyHead: filterObject.familyHead};
    }
    if (filterObject.minDateFlag) {
      filterFields = {...filterFields, MinDate: filterObject.minDate};
    }
    if (filterObject.maxDateFlag) {
      filterFields = {...filterFields, MaxDate: filterObject.maxDate};
    }
    if (filterObject.MinAge !== 0) {
      filterFields = {...filterFields, MinAge: filterObject.MinAge};
    }
    if (filterObject.MaxAge !== 100 && filterObject.MaxAge > 0) {
      filterFields = {...filterFields, MaxAge: filterObject.MaxAge};
    }
    return filterFields;
  };
  const callMethod = async () => {
    callAsynFunctionStack[currentIndexToCallApi]().then(res => {
      if (res) {
        setCurrentIndexToCallApi(currentIndexToCallApi + 1);
      }
    });
  };
  const getItemLayout = (data, index) => {
    return {
      length: wp(30),
      offset: wp(30) * index,
      index,
    };
  };

  const renderRow = (
    dataArray,
    tempArray,
    key,
    label,
    selectedIndex = 0,
    firstRow = false,
    reference = null
  ) => {
    return (
      <View style={{flex: 1, marginTop: firstRow ? hp(0) : hp(3)}}>
        <View>
          {/*<View style={backLine} />*/}
          <CustomText style={headerText}>{'  ' + label + '  '}</CustomText>
        </View>
        <View style={{height:hp(2)}}/>
        <FlatList
          ref={reference === null ? flatListRef : reference}
          horizontal={true}
          data={dataArray}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
          getItemLayout={(data, index) => getItemLayout(data, index)}
          renderItem={({item, index}) => (
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => {
                if (arrayData[key].indexOf(item) < 0) {
                  tempArray.push(item);
                } else {
                  tempArray.remove(item);
                }
                setArrayData({...arrayData, [key]: tempArray});
                arrayData[key] = tempArray;

                // let tempObj = createFilterObject(arrayData);
                // tempCallingApiArray.push(tempObj);
                // setSelectedItem(item);
                // callAsyncronusApi();
              }}>
              <View
                style={[
                  buttonStyle,
                  {
                    backgroundColor: tempArray.indexOf(item) > -1 ? color.themePurple : color.lightGray,
                    width: dataArray.length < 3 ? wp(20) : wp(15),
                    marginLeft: index !== 0 ? wp(1) : 0,
                  },
                ]}>
                <CustomText
                  style={[
                    buttonTextStyle,
                    {
                      color: tempArray.indexOf(item) > -1 ? color.white : color.black,
                    },
                  ]}>
                  {item}
                </CustomText>
              </View>
            </TouchableWithoutFeedback>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const setDefaultTempArray = () => {
    tempTrustArray = []
    tempCityArray = [];
    tempDistrcitArray = []
    tempStateArray = [];
    tempCastArray = [];
    tempCountryArray = [];
    tempNativePlace = [];
    tempMaritalStatus = [];
    tempDaughterStatus = [];
    tempHeadStatus = [];
    tempGender = [];
    tempCallAsynStack = [];
    tempBoothName = [];
  };
  const onRightPress = () => {
    // rangeSlider.setLowValue(0);
    // rangeSlider.setHighValue(100);
    setDefaultTempArray();
    setFilterObj({...defaultFilterObj});
    setArrayData({...defaultFilterObj});
    arrayData['MaxAge'] = 100;
    arrayData['MinAge'] = 0;
    arrayData['city'] = [];
    arrayData['state'] = [];
    arrayData['country'] = [];
    arrayData['familyDaughter'] = [];
    arrayData['familyHead'] = [];
    arrayData['gender'] = [];
    arrayData['maritalStatus'] = [];
    arrayData['maxDate'] = new Date();
    arrayData['minDate'] = new Date();
    arrayData['maxDateFlag'] = false;
    arrayData['minDateFlag'] = false;
    arrayData['nativePlace'] = [];
    setSrollEnabledFlag(true);
    setInitialIndexFlag(true);

    flatListRef &&
      flatListRef !== null &&
      flatListRef.current !== null &&
      flatListRef.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefCountry &&
      flatListRefCountry !== null &&
      flatListRefCountry.current !== null &&
      flatListRefCountry.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefMarital &&
      flatListRefMarital !== null &&
      flatListRefMarital.current !== null &&
      flatListRefMarital.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefNative &&
      flatListRefNative !== null &&
      flatListRefNative.current !== null &&
      flatListRefNative.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefState &&
      flatListRefState !== null &&
      flatListRefState.current !== null &&
      flatListRefState.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefCity &&
      flatListRefCity !== null &&
      flatListRefCity.current !== null &&
      flatListRefCity.current.scrollToOffset({x: 0, y: 0, animated: false});
    flatListRefCast &&
    flatListRefCast !== null &&
    flatListRefCast.current !== null &&
    flatListRefCast.current.scrollToOffset({x: 0, y: 0, animated: false});

    flatListRefTrustFactor &&
    flatListRefTrustFactor !== null &&
    flatListRefTrustFactor.current !== null &&
    flatListRefTrustFactor.current.scrollToOffset({x: 0, y: 0, animated: false});


    flatListRefDistrict &&
    flatListRefDistrict !== null &&
    flatListRefDistrict.current !== null &&
    flatListRefDistrict.current.scrollToOffset({x: 0, y: 0, animated: false});

    setResultItem({});
  };
  const getSelectedIndex = (key, dataArray) => {
    let tempIndex = 0;
    if (arrayData[key].length > 0) {
      let selectedValue = arrayData[key][0];
      tempIndex = dataArray.indexOf(selectedValue);
    }
    return tempIndex;
  };
  const getFoundResult = () => {
    let res = 0;
    // console.log("value="+Object.values(resultItem[selectedItem]));
    Object.keys(resultItem).forEach(data => {
      if (data === selectedItem) {
        res = resultItem[selectedItem];
      }
    });
    return res;
  };
  return (
      <View style={{flex:1,}}>
      {loading && <Loading isLoading={loading} />}
      {loader && (
        <Modal animated={false} style={{flex: 1}} visible={true} transparent={true}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator animating={loader} size={'large'} color={'gray'} />
          </View>
        </Modal>
      )}
      <NotificationHeaderStyle
        title={'Filter' + '  '}
        onBackPress={() => {
          setDataForFilter([]);
          setFlagForFilter(false);
          setFilter({...defaultFilterObj});
          setArrayData({...defaultFilterObject, foundResult: 0});
          setDefaultTempArray();
          props.navigation.goBack();
        }}
        // countFound={
        //   arrayData.foundResult > 0 && typeof arrayData.foundResult !== 'undefined'
        //     ? 'Found ' + arrayData.foundResult
        //     : _.isEqual(arrayData, defaultFilterObject)
        //     ? 'Found ' + filterDataLength
        //     : 'Found ' + arrayData.foundResult
        // }
        rightTitle={'Clear' + ' '}
        rightPress={onRightPress}
      />
      <View style={{padding: wp(5), flex: 1}}>
        <View style={[mainView]}>
          <ScrollView
            ref={keyBoardViewRef}
            scrollEnabled={scrollEnabledFlag}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}>
            {renderRow(
              searchData.City,
              tempCityArray,
              'city',
              'CITY',
              getSelectedIndex('city', searchData.City),
              true,
              flatListRefCity
            )}
            {renderRow(
                searchData.District,
                tempDistrcitArray,
                'district',
                'DISTRICT',
                getSelectedIndex('city', searchData.District),
                false,
                flatListRefDistrict
            )}

            {renderRow(
              searchData.State,
              tempStateArray,
              'state',
              'STATE',
              getSelectedIndex('state', searchData.State),
              false,
              flatListRefState
            )}
            {renderRow(
                searchData.CastName,
                tempCastArray,
                'cast',
                'CAST',
                getSelectedIndex('cast', searchData.CastName),
                false,
                flatListRefCast
            )}
            {renderRow(
                searchData?.BoothName,
                tempBoothName,
                'booth',
                'BOOTH',
                getSelectedIndex('booth', searchData?.BoothName),
                false,
                flatListRefCast
            )}

            {renderRow(
                searchData.TrustFactor,
                tempTrustArray,
                'trust',
                'TRUST FACTOR',
                getSelectedIndex('cast', searchData.TrustFactor),
                false,
                flatListRefTrustFactor
            )}


            {/*{renderRow(*/}
            {/*  searchData.Country,*/}
            {/*  tempCountryArray,*/}
            {/*  'country',*/}
            {/*  'COUNTRY',*/}
            {/*  getSelectedIndex('country', searchData.Country),*/}
            {/*  false,*/}
            {/*  flatListRefCountry*/}
            {/*)}*/}
            {renderRow(
              searchData.NativePlace,
              tempNativePlace,
              'nativePlace',
              'NATIVE PLACE',
              getSelectedIndex('nativePlace', searchData.NativePlace),
              false,
              flatListRefNative
            )}


            {renderRow(
              searchData.MaritalStatuses,
              tempMaritalStatus,
              'maritalStatus',
              'MARITAL STATUS',
              getSelectedIndex('maritalStatus', searchData.MaritalStatuses),
              false,
              flatListRefMarital
            )}
            {/*{renderRow(*/}
            {/*  searchData.daughterStatus,*/}
            {/*  tempDaughterStatus,*/}
            {/*  'familyDaughter',*/}
            {/*  'CHECK DAUGHTER'*/}
            {/*)}*/}
            {/*{renderRow(searchData.headStatus, tempHeadStatus, 'familyHead', 'FAMILY HEAD')}*/}
            {renderRow(searchData.gender, tempGender, 'gender', 'GENDER')}


            <View style={{flex: 1, marginTop: hp(1.3)}}>
              <View style={{flex: 1}}>
                <View style={backLine} />
                <CustomText style={headerText}>{'  SELECT AGE  '}</CustomText>
              </View>

              <View style={{flex: 1,paddingHorizontal:wp(1), justifyContent: 'center', marginTop: hp(1)}}>
                <RangeSlider min={1} max={100}
                             fromValueOnChange={value => setFromValue(value)}
                             toValueOnChange={value => setToValue(value)}
                             initialFromValue={1}
                             fromKnobColor={color.themePurple}
                             toKnobColor={color.themePurple}
                             valueLabelsBackgroundColor={color.themePurple}
                             inRangeBarColor={color.themePurple}
                             outOfRangeBarColor={color.lightGray}
                />
                <CustomText style={style.textStyle}>AGE FROM {fromValue} TO {toValue} </CustomText>
                {/*<RangeSlider*/}
                {/*  ref={component => (rangeSlider = component)}*/}
                {/*  style={{width: wp(75), alignSelf: 'center', height: hp(15), marginTop: hp(-3)}}*/}
                {/*  gravity={'center'}*/}
                {/*  min={0}*/}
                {/*  max={100}*/}
                {/*  step={1}*/}
                {/*  selectionColor={color.blue}*/}
                {/*  blankColor={color.lightGray}*/}
                {/*  lineWidth={wp(0.5)}*/}
                {/*  thumbRadius={hp(1.4)}*/}
                {/*  textSize={normalize(10)}*/}
                {/*  thumbColor={color.blue}*/}
                {/*  thumbBorderColor={color.lightGray}*/}
                {/*  labelBackgroundColor={color.blue}*/}
                {/*  labelBorderColor={color.blue}*/}
                {/*  labelTextColor={color.white}*/}
                {/*  rangeEnabled={true}*/}
                {/*  labelStyle={'bubble'}*/}
                {/*  onValueChanged={(low, high) => {*/}
                {/*    setMaxAge(high);*/}
                {/*    setMinAge(low);*/}
                {/*    setSrollEnabledFlag(false);*/}
                {/*    setTimeout(() => {*/}
                {/*      setSrollEnabledFlag(true);*/}
                {/*    }, 1000);*/}
                {/*  }}*/}
                {/*  onTouchEnd={() => {*/}
                {/*    setSrollEnabledFlag(true);*/}
                {/*    arrayData.MaxAge = maxAge;*/}
                {/*    arrayData.MinAge = minAge;*/}
                {/*    tempCallAsynStack.push({*/}
                {/*      ...tempCallAsynStack[tempCallAsynStack.length - 1],*/}
                {/*      MaxAge: arrayData.MaxAge,*/}
                {/*      MinAge: arrayData.MinAge,*/}
                {/*    });*/}

                {/*    callAsyncronusApi();*/}
                {/*  }}*/}
                {/*/>*/}
              </View>
            </View>
            {isShowDatePicker && (
              <DatePickerModel
                _setIsShowDatePicker={_setIsShowDatePicker}
                dateForDatePicker={dateForDatePicker}
                isShow={isShowDatePicker}
                _setDateFromKey={_setDateFromKey}
                mode={'date'}
              />
            )}
            <View style={{flex: 0.1, padding: wp(1), marginTop: hp(4)}}>
              <TouchableOpacity onPress={() => fetchFilterData(arrayData)}>
                <View style={filterButton}>
                  <CustomText style={filterText}>FILTER</CustomText>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>

      </View>

      </View>

  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1.52,
    marginTop: hp(-1.5),

    padding: wp(1),
    // paddingBottom:hp(1)
  },
  floatingInputStyle: {
    borderWidth: 0,
    fontSize: normalize(12),
    fontFamily: font.robotoRegular,
    height: isANDROID ? hp(6) : hp(4),
    marginTop: isANDROID ? hp(3) : hp(2),
  },
  textStyle: {
    fontSize: normalize(14),
    color: color.blue,
    fontWeight: 'bold',
  },
  radioButton: {
    height: hp(3),
    width: hp(3),
    borderWidth: hp(0.2),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonForHead: {
    height: hp(2),
    width: hp(2),
    borderWidth: hp(0.2),
    borderRadius: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: hp(1.7),
    width: hp(1.7),
    borderRadius: hp(0.85),
    backgroundColor: color.blue,
  },
  checkBoxStyle: {
    height: hp(2.5),
    width: hp(2.5),
    borderWidth: hp(0.2),
    borderColor: color.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height: hp(6),
    width: wp(15),
    backgroundColor: color.blue,
    marginTop: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextStyle: {
    fontSize: normalize(9),
    color: color.white,
    fontWeight: 'bold',
  },
  filterButton: {
    height: hp(8),
    backgroundColor: color.themePurple,
    alignItems: 'center',
    justifyContent: 'center',
    width:wp(35),
    alignSelf:'center'
  },
  filterText: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: color.white,
  },
  backLine: {
    alignSelf: 'center',
    position: 'absolute',
    borderBottomColor: color.lightGray,
    borderBottomWidth: 1,
    height: '50%',
    width: '100%',
  },
  headerText: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    backgroundColor: color.white,
    fontSize: normalize(13),
    color: color.blue,
    fontWeight: 'bold',
  },
  sliderThumb: {
    height: hp(1),
    width: hp(1),
    borderRadius: hp(0.5),
    backgroundColor: color.blue,
  },
  closeIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: hp(0.5),
    padding: hp(1.2),
  },
});
export default FilterPage;
