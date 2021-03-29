import {Text, View, TextInput, StyleSheet} from 'react-native';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import React from 'react';

export const LabelInputText = props => {
  const {
    label = '',
    value = '',
    multiline = false,
    inputStyle = null,
    onChangeText = null,
    containerStyle = null,
    labelStyle = null,
  } = props;
  return (
    <View style={containerStyle}>
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
      <TextInput
          allowFontScaling={false}
        style={[
          style.floatingInputStyle,
          multiline && {height: hp(12), justifyContent: 'flex-start', textAlignVertical: 'top'},
          inputStyle,
        ]}
        onChangeText={text => onChangeText(text)}
        value={value}
        multiline={multiline}
      />
    </View>
  );
};
const style = StyleSheet.create({
  floatingInputStyle: {
    borderWidth: 1,
    fontSize: normalize(13),
    fontFamily: font.robotoRegular,
    height: hp(5),
    color: color.black,
    marginTop: hp(0.5),
    borderRadius: 5,
    borderColor: color.darkGray,
    paddingHorizontal: wp(1),
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
