import React from 'react';
import {ActivityIndicator, StyleSheet, View,TouchableOpacity,Text,Image} from 'react-native';
import {color as colors, normalize,isANDROID,wp,hp} from '../../helper/themeHelper';
import {CustomText} from './CustomText';
import { LinearGradient } from 'expo-linear-gradient';
import gradientLogo from '../../assets/images/bg.png'
import {back_arrow_icon} from '../../assets/images/'
const NotificationHeaderWithGradient = props => {
  const {
    title,
    onBackPress,
    rightTitle,
    rightPress,
    countFound,
    shareButton,
    shareButtonPress,
    gradientColors,
  } = props;
  const {containerGradient, backHeaderTextStyle} = style;
  return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={gradientColors}>
        <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={gradientColors}
            style={containerGradient}>
          <TouchableOpacity style={{marginTop: isANDROID ? hp(-3) : 0}} onPress={onBackPress}>
            {/*<AntDesign name={'arrowleft'} size={wp(8)} color={color.white} />*/}
            {/*<Text>Back</Text>*/}
            <Image style={{height:wp(3),marginTop:hp(5),width:wp(3)}} source={back_arrow_icon}/>
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
                    marginTop: isANDROID ? hp(-3) : 0,
                    marginLeft: wp(0),
                      fontSize:normalize(15)
                  },
                ]}>
              {title }
            </CustomText>
            {countFound && typeof countFound !== 'undefined' && (
                <CustomText
                    style={{
                      fontSize: normalize(14),
                      color: color.white,
                      fontWeight: 'bold',
                      marginLeft: wp(7.5),
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
                  <Text>share</Text>
                {/*<AntDesign name={'sharealt'} size={wp(8)} color={color.white} />*/}
              </TouchableOpacity>
          )}
        </LinearGradient>
        <Image
            source={gradientLogo}
            style={{
              opacity: 0.3,
              height: hp(15),
              width: wp(85),
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
        />
      </LinearGradient>
  );
};

const Loading = props => {
  const {size = 'large', color = colors.blue, isLoading, labelFlag, labelText} = props;
  if (isLoading) {
    return (
      <View style={[style.container]}>
        <ActivityIndicator size={size} color={color} animating={isLoading} />
        {labelFlag && typeof labelFlag !== 'undefined' && labelFlag && (
          <CustomText style={style.label}>{labelText}</CustomText>
        )}
      </View>
    );
  } else {
    return null;
  }
};

const LoadingWithLabel = props => {
  const {size = 'large', color = colors.blue, isLoading} = props;
  if (isLoading) {
    return (
      <View style={style.container}>
        <ActivityIndicator size={size} color={color} animating={isLoading} />
      </View>
    );
  } else {
    return null;
  }
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: hp(50),
    right: 0,
    left: 0,
    zIndex: 1000,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: colors.blue,
  },
});

export {Loading, LoadingWithLabel,NotificationHeaderWithGradient};
