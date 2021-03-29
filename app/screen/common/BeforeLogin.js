import React from 'react';
import {Text, View} from 'react-native';
import {color, font, hp, normalize} from '../../helper/themeHelper';
import {AppButton} from './AppButton';

const InitialView = props => {
  const {onLoginBtn} = props;
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text
          allowFontScaling={false}
        style={{
          fontSize: normalize(18),
          color: color.blue,
          fontFamily: font.robotoRegular,
        }}>
        WELCOME TO SOCIETY
      </Text>
      <AppButton
        title={'SIGN UP'}
        containerStyle={{marginTop: hp(5), marginBottom: hp(2)}}
        disabled={true}
      />
      <AppButton title={'LOGIN'} onPress={onLoginBtn} />
    </View>
  );
};

export {InitialView};
