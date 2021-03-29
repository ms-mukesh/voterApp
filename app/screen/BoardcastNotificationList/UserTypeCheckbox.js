import {FlatList, Text, View,Image,TouchableWithoutFeedback} from 'react-native';
import {font, hp, normalize, wp} from '../../helper/themeHelper';
import React from 'react';
import check from '../../assets/images/check.png'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoticationData = [
  {
    id: 0,
    title: 'All Admins',
  },
  {
    id: 1,
    title: 'All Volunteer',
  },
  {
    id: 2,
    title: 'All Voters',
  },
  {
    id: 3,
    title: 'All Male Members',
  },
  {
    id: 4,
    title: "All Female Members",
  },
];
export const UserTypeCheckBox = props => {
  const {selectedData = [], toggleCheckbox = null} = props;
  const renderCheckBox = ({item}) => {
    return (
      <View style={{marginTop: hp(1),flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: wp(1)}}>
        {/*<MaterialCommunityIcons*/}
        {/*  onPress={() => toggleCheckbox(item.id)}*/}
        {/*  name={selectedData.includes(item.id) ? 'check-box-outline' : 'checkbox-blank-outline'}*/}
        {/*  size={wp(7)}*/}
        {/*  color={'gray'}*/}
        {/*/>*/}
        <TouchableWithoutFeedback onPress={()=>{
            toggleCheckbox(item.id)
        }}>
        <View style={{alignItems:'center',justifyContent:'center',height:wp(2),width:wp(2),borderWidth:wp(0.3)}}>
            {selectedData.includes(item.id) && <Image source={check} style={{height:wp(1),width:wp(1)}}/>}
        </View>
        </TouchableWithoutFeedback>
        <Text allowFontScaling={false}
          style={{
            flex: 1,
            marginLeft: wp(1),
            fontFamily: font.robotoRegular,
            fontSize: normalize(13),
          }}>
          {item.title}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1, marginTop: hp(1.5)}}>
      <FlatList
        horizontal={false}
        data={NoticationData}
        showsHorizontalScrollIndicator={false}
        extraData={[selectedData]}
        renderItem={renderCheckBox}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
