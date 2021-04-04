import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {color, font, hp, normalize, wp} from '../../helper/themeHelper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GENDER} from '../../helper/constant';
import DefaultFemaleIcon from '../../assets/images/user_female.png';
import DefaultMaleIcon from '../../assets/images/user_male.png';
import {cross_black_icon} from "../../assets/images";

const ImageFullScreenPreview = props => {
  const {imgPath, setPreviewClose, fromAppHeader = null, userGender = 'FEMALE'} = props;
  const {mainView, closeButton, imgView} = styles;
  const [isLoader, setIsLoader] = useState(false);

  const renderFromDirectory = () => {
    return imgPath !== null ? (
      <Image
        style={imgView}
        resizeMode={'contain'}
        source={{
          uri: imgPath,
        }}
        onLoadStart={() => setIsLoader(true)}
        onProgress={e =>
          console.log('Loading Progress ' + e.nativeEvent.loaded / e.nativeEvent.total)
        }
        onLoad={e => console.log('Loading Loaded ' + e.nativeEvent.width, e.nativeEvent.height)}
        onLoadEnd={() => setIsLoader(false)}
      />
    ) : (
      <Image style={imgView} resizeMode={'contain'} source={require("../../assets/images/user_male.png")} />
    );
  };
  const renderFromAppHeader = () => {
      return typeof imgPath.uri !== 'undefined' ? (
      <Image
        style={imgView}
        resizeMode={'contain'}
        source={{
          ...imgPath,
          // headers: {Authorization: '9876543210'},
          // priority: FastImage.priority.normal,
          // cache: FastImage.cacheControl.immutable,
          //cache: FastImage.cacheControl.web,
          //cache: FastImage.cacheControl.cacheOnly,
        }}
        onLoadStart={() => setIsLoader(true)}
        onProgress={e =>
          console.log('Loading Progress ' + e.nativeEvent.loaded / e.nativeEvent.total)
        }
        onLoad={e => console.log('Loading Loaded ' + e.nativeEvent.width, e.nativeEvent.height)}
        onLoadEnd={() => setIsLoader(false)}
      />
    ) : (
      <Image style={imgView} source={DefaultMaleIcon} />
    )
  };
  return (
    <Modal
      onRequestClose={() => setPreviewClose()}
      animated={false}
      transparent={true}
      visible={true}>
      <View style={mainView}>
        <ActivityIndicator
          style={{marginTop: hp(20), position: 'absolute'}}
          animating={isLoader}
          size={'large'}
          color={'gray'}
        />

        <TouchableWithoutFeedback onPress={()=>{
            setPreviewClose()
        }}>
            <Image source={cross_black_icon} style={[closeButton,{height: wp(1),width:wp(1)}]}/>
        </TouchableWithoutFeedback>
        {/*<AntDesign*/}
        {/*  onPress={() => {*/}
        {/*    setPreviewClose();*/}
        {/*  }}*/}
        {/*  name={'close'}*/}
        {/*  size={wp(6)}*/}
        {/*  style={closeButton}*/}
        {/*/>*/}
        {/*<CustomText*/}
        {/*  onPress={() => {*/}
        {/*    setPreviewClose();*/}
        {/*  }}*/}
        {/*  style={closeButton}>*/}
        {/*  {'close  '}*/}
        {/*</CustomText>*/}
        {fromAppHeader === null ? renderFromDirectory() : renderFromAppHeader()}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,14,14,0.72)',
  },
  closeButton: {
    color: color.white,
    // fontSize: normalize(15),
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginRight: wp(1),
  },
  imgView: {
    height: hp(45),
    width: hp(40),
    marginTop: hp(1),
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
export {ImageFullScreenPreview};
