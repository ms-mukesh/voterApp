import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import {up_arrow,down_arrow} from "../../assets/images";

import React from 'react';

export const ListHeader = props => {
  const {img, title, onPress, selected, color} = props;
  return (
    <TouchableOpacity
      style={[style.headerView, {backgroundColor: color}]}
      onPress={onPress}
      activeOpacity={5}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={style.mainImgView}>
          <Image source={img} style={style.mainImg} resizeMode="stretch" />
        </View>
        <Text allowFontScaling={false} style={style.mainText}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={style.mainImgView}>
          {selected?<Image source={up_arrow} style={{height:wp(2),width:wp(2)}}/>
          :<Image source={down_arrow} style={{height:wp(2),width:wp(2)}}/>}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopRightRadius: hp(1),
    borderTopLeftRadius: hp(1),
  },
  mainImgView: {
    padding: hp(1),
    backgroundColor: color.white,
    borderRadius: wp(12),
  },
  mainText: {
    color: color.white,
    fontFamily: font.robotoRegular,
    fontSize: normalize(20),
    marginLeft: wp(3),
  },
  mainImg: {
    width: hp(5),
    height: hp(5),
  },
});
