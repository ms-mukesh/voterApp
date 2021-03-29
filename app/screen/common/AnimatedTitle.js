import {hp} from '../../helper/themeHelper';
import {Animated, StyleSheet} from 'react-native';
import React from 'react';

export const AnimatedTitle = props => {
  const headingTopPosition = props.scrollY.interpolate({
    inputRange: [0, 100, 200, 300],
    outputRange: [hp(6), hp(5), hp(4), hp(3)],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });
  return (
    <Animated.View style={[style.editProfileView, {marginTop: headingTopPosition}]}>
      {props.children}
    </Animated.View>
  );
};
const style = StyleSheet.create({
  editProfileView: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
