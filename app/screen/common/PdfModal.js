import React, {useCallback, useEffect, useState} from 'react';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';

import {color, hp, wp} from '../../helper/themeHelper';
import {TouchableWithoutFeedback} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const PdfModal = props => {
  const {clearData, crossIconOpacity, padding} = props;
  return (
    <TouchableWithoutFeedback style={{justifyContent: 'center'}} onPress={clearData}>
      <EvilIconsIcon
        name="close"
        color={color.black}
        size={hp(3)}
        style={{padding: padding, marginTop: hp(1), opacity: crossIconOpacity}}
      />
    </TouchableWithoutFeedback>
  );
};
export default PdfModal;
