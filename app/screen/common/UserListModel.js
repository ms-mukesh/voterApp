import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import {GENDER} from '../../helper/constant';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import DefaultFemaleIcon from '../../assets/images/user_femal_default.jpeg';
import DefaultMaleIcon from '../../assets/images/user_male_default.jpeg';

const UserListModel = props => {
  const {
    _getLoginUsingId,
    memberList,
    _setMemberListModel,
    _setMemberForLogin,
    memberSelection,
  } = props;
  const {
    nameText,
    mainView,
    innerMain,
    closeIcon,
    logoStyle,
    center,
    heading,
    divider,
    listMainView,
    btnText,
    btnLayout,
  } = styles;
  return (
    <Modal visible={true} animated={true} transparent={true}>
      <View style={mainView}>
        <View style={innerMain}>
          <View style={center}>
            <Image style={logoStyle} source={require('../../assets/images/logo.png')} />
          </View>
          <View style={closeIcon}>
            <EvilIconsIcon
              name="close"
              size={wp(8)}
              color={color.gray}
              onPress={() => _setMemberListModel(false)}
            />
          </View>
          <View style={[center, {marginTop: hp(2)}]}>
            <Text allowFontScaling={false} style={heading}>
              Users List
            </Text>
          </View>
          <View style={[divider, {backgroundColor: color.gray}]} />
          <View style={{height: hp(30), marginTop: hp(1.5)}}>
            <ScrollView>
              {memberList.map((member, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={() => _setMemberForLogin(index)}>
                    <View
                      style={[
                        listMainView,
                        {
                          backgroundColor: memberSelection[index]
                            ? color.blue
                            : 'rgba(19,46,134,0.16)',
                        },
                      ]}>
                      {/*<Image*/}
                      {/*  style={styles.imageView}*/}
                      {/*  onError={*/}
                      {/*    member.Gender === GENDER.male ? DefaultMaleIcon : DefaultFemaleIcon*/}
                      {/*  }*/}
                      {/*  source={{uri: member.ProfileImage}}*/}
                      {/*/>*/}
                      <>
                        {member.ProfileImage !== null ? (
                          <Image
                            style={styles.imageView}
                            resizeMode={'contain'}
                            source={{
                              uri: member.ProfileImage,
                              // headers: {Authorization: '9876543210'},
                              // priority: FastImage.priority.normal,
                              // cache: FastImage.cacheControl.immutable,
                            }}
                          />
                        ) : member.Gender === GENDER.male ? (
                          <Image source={DefaultMaleIcon} style={styles.imageView} />
                        ) : (
                          <Image source={DefaultFemaleIcon} style={styles.imageView} />
                        )}
                      </>
                      <View style={{marginLeft: wp(4)}}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            nameText,
                            {
                              color: memberSelection[index] ? color.white : color.blue,
                              width: wp(55),
                              fontFamily: font.robotoRegular,
                            },
                          ]}>
                          {member.FirstName + ' ' + member.MiddleName + ' ' + member.LastName}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>
          </View>
          <View style={{marginTop: hp(-2)}}>
            <TouchableOpacity onPress={() => _getLoginUsingId()} style={[btnLayout]}>
              <Text allowFontScaling={false} style={btnText}>
                SELECT USER
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerMain: {
    height: hp(52),
    width: wp(82),
    backgroundColor: color.white,
    borderRadius: wp(2),
  },
  closeIcon: {
    flexDirection: 'row-reverse',
    marginTop: wp(2),
    marginLeft: wp(2),
  },
  logoStyle: {
    height: hp(10),
    width: hp(10),
    position: 'absolute',
    top: hp(-5),
  },
  center: {alignItems: 'center', justifyContent: 'center'},
  heading: {
    fontSize: normalize(18),
    color: color.blue,
    fontFamily: font.robotoRegular,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: wp(82),
    backgroundColor: color.gray,
    marginTop: hp(1),
  },
  listMainView: {
    // marginVertical: hp(0.5),
    // marginHorizontal: hp(0.5),
    // borderRadius: hp(0.5),
    padding: hp(0.8),
    flexDirection: 'row',
    height: hp(8),
    borderBottomWidth: wp(0.2),
    borderBottomColor: color.lightBlue,
  },
  nameText: {
    fontSize: normalize(14),
    color: color.blue,
    fontFamily: font.robotoRegular,
    marginTop: hp(1.7),
    fontWeight: 'bold',
  },
  btnLayout: {
    backgroundColor: color.blue,
    width: wp(60),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    alignSelf: 'center',
  },
  btnText: {
    fontSize: normalize(16),
    fontFamily: font.robotoBold,
    color: color.white,
  },
  imageView: {
    height: hp(5),
    width: hp(5),
    borderRadius: hp(2.5),
    alignSelf: 'center',
    marginLeft: wp(1.5),
  },
});
export {UserListModel};
