import React, {useState} from 'react';


import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import gradientLogo from '../../assets/images/bg.png';
import imageBackLogo from '../../assets/images/Vector-Smart-Object.png';
import { Ionicons } from '@expo/vector-icons';

import {ImageFullScreenPreview} from '../common/ImageFullScreenPreview';
import {
  hp,
  normalize,
  wp,
  color,
  font,
  headerColorArray,
  isANDROID,
  screenWidth,
  isIOS,
} from '../../helper/themeHelper';
import {center} from '../../helper/styles';
import SafeAreaView from 'react-native-safe-area-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AppButton} from './AppButton';
import {CustomText} from '../common';
import {useSafeArea} from 'react-native-safe-area-context';
import {ADMIN, GENDER} from '../../helper/constant';
import menu_icon from '../../assets/images/menu.png'
import {add_file_icon, add_user_icon, app_icon, back_arrow_icon} from '../../assets/images'
import {useSelector} from "react-redux";

const InitialHeader = props => {
  const insets = useSafeArea();
  const [imagePreviewFlag, setImagePreviewFlag] = useState(false);
  const {
    scrollY = new Animated.Value(0),
    LeftComponent = null,
    isAnimated = false,
    marginTop = 0,
    imageBackground = null,
    isButton = false,
    isUrl = null,
    canViewFullScreenImage = false,
    showAppIcon=false
  } = props;
  const closeImagePreview = () => {
    setImagePreviewFlag(false);
  };

  //artist profile image position from top
  const _getImageTopPosition = () => {
    return scrollY.interpolate({
      inputRange: [0, 100, 200, 300],
      outputRange: [hp(-1), -hp(2), -hp(4), -hp(4)],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist profile image width
  const _getImageWidth = () => {
    return scrollY.interpolate({
      inputRange: [0, 100, 200, 300],
      outputRange: [hp(20), hp(16), hp(12), hp(8)],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  //artist profile image height
  const _getImageHeight = () => {
    return scrollY.interpolate({
      inputRange: [0, 100, 200, 300],
      outputRange: [hp(20), hp(16), hp(12), hp(8)],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist header height
  const _getHeaderHeight = () => {
    return scrollY.interpolate({
      inputRange: [0, 100, 200, 300],
      outputRange: [hp(20), hp(15), hp(10), hp(5)],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  //artist header height
  const _getBorderWidth = () => {
    return scrollY.interpolate({
      inputRange: [0, 100, 200, 300],
      outputRange: [hp(1.6), hp(1.3), hp(1.0), hp(0.7)],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };

  const imageBorderWidth = _getBorderWidth();
  const profileImageTop = _getImageTopPosition();
  const profileImageWidth = _getImageWidth();
  const profileImageHeight = _getImageHeight();
  const headerHeight = _getHeaderHeight();

  return (
    <SafeAreaView
      style={{backgroundColor: color.themePurple}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <Animated.View
        style={{
          height: isAnimated ? headerHeight : hp(25),
          backgroundColor: color.themePurple,
          flexDirection:'row'
        }}>
        {props.cancelButton && (
          <TouchableOpacity style={[style.cancelButton,{flex:1}]} onPress={props.cancelPress}>
            {/*<AntDesign name={'arrowleft'} size={hp(4)} color={color.white} />*/}
            <Image source={back_arrow_icon} style={{height:hp(4),width:hp(4)}} />
          </TouchableOpacity>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItem: 'center',
            marginHorizontal: wp(5),
            marginTop: hp(1),
          }}>
          {props.LeftComponent && (
            <View style={{}} onPress={props.RightPress}>
              {LeftComponent()}
            </View>
          )}
          {props.RightTitle && (
            <TouchableOpacity onPress={props.RightPress}>
              <Text
                allowFontScaling={false}
                style={{marginLeft:wp(85),alignSelf:'flex-end',fontSize: normalize(20), color: color.white, textAlign: 'center'}}>
                {props?.RightTitle??'Save'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {imageBackground && (
        <Image
          source={imageBackLogo}
          resizeMode={'contain'}
          style={{position: 'absolute', height: isANDROID ? hp(10) : hp(15), width: wp(100)}}
        />
      )}

      <View style={{height: hp(1.5), flexDirection: 'row',backgroundColor:'#666477'}}>
        {/*{headerColorArray.map((item, index) => (*/}
        {/*  <View style={{width: index === 2 ? '40%' : '15%', backgroundColor: item}} key={index} />*/}
        {/*))}*/}
      </View>
      {isANDROID ? (
        <TouchableNativeFeedback
          style={{zIndex: 1}}
          onPress={() => {
            setImagePreviewFlag(true);
          }}>
          <Animated.View
            style={[
              style.logoView,
              {
                borderWidth: imageBorderWidth,
                height: profileImageHeight,
                width: profileImageWidth,

                transform: [{translateY: profileImageTop}],
                zIndex: 1,
              },
            ]}>
            {showAppIcon &&
            <Image
                resizeMode="contain"
                source={app_icon}
                style={{height: '80%', width: '80%',marginTop:hp(15)}}
            />
            }
            {isUrl === null || !isUrl ? (
              <Image
                resizeMode="cover"
                source={props.imgPath}
                style={{height: '103%', width: '103%'}}
              />
            ) : (
              <Image
                style={{height: '103%', width: '103%'}}
                resizeMode={'cover'}
                source={{
                  ...props.imgPath,
                  // headers: {Authorization: '9876543210'},
                  // priority: FastImage.priority.normal,
                  // cache: FastImage.cacheControl.immutable,
                }}
              />
            )}
          </Animated.View>
        </TouchableNativeFeedback>
      ) : (
        <TouchableOpacity
          style={{zIndex: 1, flex: 1}}
          onPressIn={() => {
            setImagePreviewFlag(true);
          }}>
          <Animated.View
            style={[
              style.logoView,
              {
                borderWidth: imageBorderWidth,
                height: profileImageHeight,
                width: profileImageWidth,
                zIndex: 1,
                flex: 1,

                transform: [{translateY: profileImageTop}],
              },
            ]}>
            {showAppIcon &&
            <Image
                resizeMode="cover"
                source={app_icon}
                style={{height: '80%', width: '80%',marginTop:hp(15)}}
            />
            }
            {isUrl === null || !isUrl ? (
              <Image
                resizeMode="cover"
                source={props.imgPath}
                style={{height: '103%', width: '103%'}}
              />
            ) : (
              <Image
                style={{height: '103%', width: '103%'}}
                resizeMode={'cover'}
                source={{
                  ...props.imgPath,
                  // headers: {Authorization: '9876543210'},
                  // priority: FastImage.priority.normal,
                  // cache: FastImage.cacheControl.immutable,
                }}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      )}

      {imagePreviewFlag && canViewFullScreenImage && (
        <ImageFullScreenPreview
          imgPath={props.imgPath}
          fromAppHeader={true}
          setPreviewClose={closeImagePreview}
          // userGender={userGender}
        />
      )}
    </SafeAreaView>
  );
};

const AppHeader = props => {
  const {
    title,
    onMenuPress,
    onFilterIconPress,
    onExportPress,
    onSortIconPress,
    sortIconFlag = true,
    userGender = 'FEMALE',
    rightTitleFlag = false,
    rightTitle = '',
    onRightTitlePress=null,
    displayIcon = true
  } = props;
  const userDetails = useSelector(state => state.user.userDetail);
  const {container, textStyle} = style;
  return (
    <SafeAreaView
      style={{backgroundColor: color.themePurple}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View style={container}>
        <TouchableOpacity onPress={onMenuPress}>
          <Image source={menu_icon} style={{height:hp(6),width:hp(6),color:'white'}}/>
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          style={[
            textStyle,
            {
              fontWeight: '700',
              lineHeight: normalize(20) * 1.2,
              width: wp(120),
              marginLeft: typeof onExportPress !== 'undefined' ? wp(13) : 0,
            },
          ]}>
          {title + '  '}
        </Text>
        {onRightTitlePress !== null && displayIcon && userDetails?.role === ADMIN &&
        <TouchableOpacity onPress={onRightTitlePress}>
          <Image style={{height: hp(3.5), width: hp(3.5)}} source={add_file_icon}/>
        </TouchableOpacity>
        }
        {rightTitleFlag &&
        <Text onPress={onRightTitlePress}
              style={{fontSize: normalize(15), fontWeight: '700', color: color.white}}>{rightTitle}</Text>
        }
        {onExportPress && typeof onExportPress !== 'undefined' && (
          <TouchableOpacity onPress={onExportPress}>
            <Fontisto name={'export'} size={hp(3.5)} color={color.white} />
          </TouchableOpacity>
        )}
        {onFilterIconPress && typeof onFilterIconPress !== 'undefined' && (
          <TouchableOpacity onPress={onFilterIconPress}>
            <Feather name={'filter'} size={hp(4)} color={color.white} />
          </TouchableOpacity>
        )}
        {onSortIconPress && typeof onSortIconPress !== 'undefined' && (
          <FontAwesome5
            name={sortIconFlag ? 'sort-amount-down-alt' : 'sort-amount-up-alt'}
            size={hp(4)}
            color={color.white}
            onPress={onSortIconPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const NotificationHeaderStyle = props => {
  const {
    title,
    onBackPress,
    rightTitle,
    rightPress,
    countFound,
    shareButton,
    shareButtonPress,
  } = props;
  const {container, backHeaderTextStyle} = style;
  return (
    <SafeAreaView
      style={{backgroundColor: color.themePurple}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View style={container}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={back_arrow_icon} style={{height:wp(2),width:wp(2)}}/>
          {/*<AntDesign name={'arrowleft'} size={wp(8)} color={color.white} />*/}
        </TouchableOpacity>
        <View
          style={{
            flex: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomText
            style={[
              backHeaderTextStyle,
              {
                marginLeft: countFound && typeof countFound !== 'undefined' ? wp(7) : 0,
                alignSelf: 'stretch',
                textAlign: 'center',
              },
            ]}>
            {title + ' '}
          </CustomText>
          {countFound && typeof countFound !== 'undefined' && (
            <CustomText
              style={{
                fontSize: normalize(14),
                color: color.white,
                fontWeight: 'bold',
                marginLeft: isIOS ? wp(7) : wp(4),
                alignSelf: 'stretch',
                textAlign: 'center',
              }}>
              {countFound + ' '}
            </CustomText>
          )}
        </View>

        {rightTitle && typeof rightTitle !== 'undefined' && (
          <CustomText
            onPress={rightPress}
            style={{fontSize: normalize(18), color: color.white, fontWeight: 'bold'}}>
            {rightTitle}
          </CustomText>
        )}
        {shareButton && typeof shareButton !== 'undefined' && (
          <TouchableOpacity onPress={shareButtonPress}>
            <AntDesign name={'sharealt'} size={wp(8)} color={color.white} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
const GoBackHeader = props => {
  const {
    title,
    onMenuPress,
    onFilterIconPress,
    onExportPress,
    onSortIconPress,
    sortIconFlag = true,
    userGender = 'FEMALE',
  } = props;
  const {container, textStyle} = style;
  return (
      <SafeAreaView
          style={{backgroundColor: color.white}}
          forceInset={{top: 'always', bottom: 'never'}}>
        <View
            style={[container,{backgroundColor:'white'}]}>

          <TouchableOpacity onPress={onMenuPress}>
            <Image source={back_arrow_icon} style={{height:hp(4),width:hp(4),color:'white'}}/>
          </TouchableOpacity>
          <Text style={{fontSize:normalize(15),marginLeft:wp(5),fontWeight:'700'}}>{title}</Text>
          <Text
              allowFontScaling={false}
              style={[
                textStyle,
                {
                  fontWeight: '700',
                  lineHeight: normalize(20) * 1.2,
                  width: wp(120),
                  marginLeft: typeof onExportPress !== 'undefined' ? wp(13) : 0,
                },
              ]}>
            {'jkhjkhkh'}
          </Text>
          {onExportPress && typeof onExportPress !== 'undefined' && (
              <TouchableOpacity onPress={onExportPress}>
                <Fontisto name={'export'} size={hp(3.5)} color={color.white} />
              </TouchableOpacity>
          )}
          {onFilterIconPress && typeof onFilterIconPress !== 'undefined' && (
              <TouchableOpacity onPress={onFilterIconPress}>
                <Feather name={'filter'} size={hp(4)} color={color.white} />
              </TouchableOpacity>
          )}
          {onSortIconPress && typeof onSortIconPress !== 'undefined' && (
              <FontAwesome5
                  name={sortIconFlag ? 'sort-amount-down-alt' : 'sort-amount-up-alt'}
                  size={hp(4)}
                  color={color.white}
                  onPress={onSortIconPress}
              />
          )}
        </View>
      </SafeAreaView>
  );
};

// const NotificationHeaderWithGradient = props => {
//   const {
//     title,
//     onBackPress,
//     rightTitle,
//     rightPress,
//     countFound,
//     shareButton,
//     shareButtonPress,
//     gradientColors,
//   } = props;
//   const {containerGradient, backHeaderTextStyle} = style;
//   return (
//     <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={gradientColors}>
//       <LinearGradient
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         colors={gradientColors}
//         style={containerGradient}>
//         <TouchableOpacity style={{marginTop: isANDROID ? hp(-3) : 0}} onPress={onBackPress}>
//           <AntDesign name={'arrowleft'} size={wp(8)} color={color.white} />
//         </TouchableOpacity>
//         <View
//           style={{
//             flex: 1.5,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <CustomText
//             style={[
//               backHeaderTextStyle,
//               {
//                 marginTop: isANDROID ? hp(-3) : 0,
//                 marginLeft: wp(0),
//               },
//             ]}>
//             {title + ' '}
//           </CustomText>
//           {countFound && typeof countFound !== 'undefined' && (
//             <CustomText
//               style={{
//                 fontSize: normalize(14),
//                 color: color.white,
//                 fontWeight: 'bold',
//                 marginLeft: wp(7.5),
//               }}>
//               {countFound + ' '}
//             </CustomText>
//           )}
//         </View>
//
//         {rightTitle && typeof rightTitle !== 'undefined' && (
//           <CustomText
//             onPress={rightPress}
//             style={{fontSize: normalize(18), color: color.white, fontWeight: 'bold'}}>
//             {rightTitle}
//           </CustomText>
//         )}
//         {shareButton && typeof shareButton !== 'undefined' && (
//           <TouchableOpacity onPress={shareButtonPress}>
//             <AntDesign name={'sharealt'} size={wp(8)} color={color.white} />
//           </TouchableOpacity>
//         )}
//       </LinearGradient>
//       <Image
//         source={gradientLogo}
//         style={{
//           opacity: 0.3,
//           height: hp(15),
//           width: wp(85),
//           position: 'absolute',
//           alignSelf: 'flex-end',
//         }}
//       />
//     </LinearGradient>
//   );
// };

const style = StyleSheet.create({
  container: {
    height: hp(12),
    backgroundColor: color.themePurple,
    ...center,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
  },
  containerGradient: {
    height: hp(8),
    // backgroundColor: color.blue,
    ...center,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginTop: hp(7),
  },
  textStyle: {
    color: color.white,
    fontFamily: font.robotoBold,
    flex: 1,
    textAlign: 'center',
    marginRight: hp(5),
    fontSize: normalize(22),
    marginLeft: wp(0.4),
  },
  backHeaderTextStyle: {
    color: color.white,
    fontFamily: font.robotoBold,
    fontSize: normalize(22),
  },
  logoView: {
    position: 'absolute',
    height: hp(40),
    width: hp(40),
    borderRadius: hp(12.5),
    borderWidth: hp(1.7),
    borderColor: color.lightBlue,
    backgroundColor: color.white,
    overflow: 'hidden',
    resizeMode: 'stretch',
    bottom: isANDROID ? hp(-7) : hp(-6),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    alignSelf: 'flex-start',
    marginTop: hp(1),
    marginLeft: wp(4),
  },
});

export {GoBackHeader,AppHeader, InitialHeader, NotificationHeaderStyle};
