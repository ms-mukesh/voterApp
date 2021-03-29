import {ImageBackground} from 'react-native';
import React from 'react';

const Background = props => {
  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={{flex: 1, ...props.style}}>
      {props.children}
    </ImageBackground>
  );
};

export {Background};
