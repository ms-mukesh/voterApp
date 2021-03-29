import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {font} from '../../helper/themeHelper';

const CustomText = props => {
  return (
    <Text allowFontScaling={false} {...props} style={[styles.textStyle, props.style]}>
      {props.children}
      {typeof props.children === 'string' && <Text> </Text>}
    </Text>
  );
};

export {CustomText};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: font.robotoRegular,
  },
});
