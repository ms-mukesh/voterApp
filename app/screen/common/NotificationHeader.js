import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {hp, normalize, wp, color, font} from '../../helper/themeHelper';
import {center} from '../../helper/styles';
import SafeAreaView from 'react-native-safe-area-view';

const NotificationHeader = props => {
  const {title, onBackPress} = props;
  const {container, textStyle} = style;
  return (
    <SafeAreaView
      style={{backgroundColor: color.blue}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View style={container}>
        <TouchableOpacity onPress={onBackPress}>
          <Icon name={'arrowleft'} size={hp(3)} color={color.white} />
        </TouchableOpacity>
        <Text allowFontScaling={false} style={textStyle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    height: hp(8),
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

export {NotificationHeader};
