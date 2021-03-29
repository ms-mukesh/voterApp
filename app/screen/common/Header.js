import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {hp, normalize, wp, color, font} from '../../helper/themeHelper';
import {center} from '../../helper/styles';
import SafeAreaView from 'react-native-safe-area-view';

const Header = props => {
  const {title, onMenuPress} = props;
  const {container, textStyle} = style;
  return (
    <SafeAreaView
      style={{backgroundColor: color.blue}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View style={container}>
        <TouchableOpacity onPress={onMenuPress}>
          <Icon name={'menu'} size={hp(5)} color={color.white} />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={textStyle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    height: hp(7),
    backgroundColor: color.blue,
    ...center,
    flexDirection: 'row',
    paddingHorizontal: wp(5),
  },
  textStyle: {
    color: color.white,
    fontFamily: font.robotoBold,
    flex: 1,
    textAlign: 'center',
    marginRight: hp(5),
    fontSize: normalize(24),
  },
});

export {Header};
