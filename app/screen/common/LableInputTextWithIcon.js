import React from 'react';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import {StyleSheet, Text, TextInput, TouchableWithoutFeedback, View,Image} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
export const LableInputTextWithIcon = props => {
  const {
    containerStyle = null,
    label = '',
    labelStyle = null,
    inputViewStyle = null,
    inputStyle = null,
    onChangeText = null,
    onPress = null,
    value = '',
    Icon = '',
    iconName = '',
    iconStyle = null,
    editable = true,
    iconSize = wp(5),
  } = props;
  return (
    <View style={[{marginTop: hp(1), flex: 1}, containerStyle]}>
      {label !== '' && (
        <Text
            allowFontScaling={false}
          style={{
            fontSize: normalize(13),
            ...labelStyle,
          }}>
          {label}
        </Text>
      )}
      <View style={[style.inputTextView, inputViewStyle]}>
        <TextInput
            allowFontScaling={false}
          style={[style.inputTextStyle, inputStyle]}
          onChangeText={text => onChangeText(text)}
          value={value}
          editable={editable}
        />
        <TouchableWithoutFeedback onPress={onPress}>
            <Image source={iconName} style={{marginHorizontal:wp(2),height:hp(3),width:hp(3)}}/>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  inputTextStyle: {
    flex: 1,
    fontSize: normalize(13),
    // fontFamily: font.robotoRegular,
    height: hp(5),
    color: color.black,
    paddingHorizontal: wp(1),
  },
  inputTextView: {
    borderWidth: 1,
    height: hp(5),
    marginTop: hp(0.5),
    borderRadius: 5,
    borderColor: color.darkGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
