import React, {useCallback, useEffect, useState} from 'react';

import { EvilIcons } from '@expo/vector-icons';

import {color, hp, wp} from '../../helper/themeHelper';
import {TouchableWithoutFeedback,Image} from 'react-native';
import closeIcon from '../../assets/images/close.png'

const CloseButton = props => {
  const {clearData, crossIconOpacity, padding} = props;
  return (
    <TouchableWithoutFeedback style={{justifyContent: 'center'}} onPress={clearData}>
      <Image
          source={closeIcon}
        style={{marginBottom:hp(1),height:hp(1.5),width:hp(1.5), opacity: crossIconOpacity}}
      />
    </TouchableWithoutFeedback>
  );
};
export default CloseButton;
