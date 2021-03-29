import React from 'react';
import {Image, PermissionsAndroid, Text, TouchableWithoutFeedback, View} from 'react-native';
import {color, hp, isANDROID, normalize, wp} from '../../../../helper/themeHelper';
import {Attatchments} from './Attatchments';
import DocumentPicker from 'react-native-document-picker';

import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {removeDuplicates} from '../../../functions';

export const ImageDocUpload = props => {
  const {
    containerStyle = null,
    lable = 'Attachments',
    lableStyle = null,
    _setDocUrl = null,
    _setDocs = null,
    docImg = require('../../../../assets/images/addDoc.png'),
    cameraImg = require('../../../../assets/images/addCam.png'),
    libraryImg = require('../../../../assets/images/addGallery.png'),
    imgStyle = null,
    _setImageUrls = null,
    _setImageData = null,
    docData = [],
    _setDocData = null,
    imageData = [],
    // handleCameraImage = null,
    imageUrls = [],
    // _renderImage = null,
    // _renderDoc = null,
    docUrl = [],
    docs = [],

    flatListContainerStyle = null,
  } = props;

  // const handleChoosePhoto = async () => {
  //   try {
  //     const results = await DocumentPicker.pickMultiple({
  //       type: [DocumentPicker.types.images],
  //     });
  //     let temp = docUrl;
  //     let docsTemp = docs;
  //     for (const res of results) {
  //       temp.push(res.name);
  //       docsTemp.push(res.uri);
  //     }
  //     _setDocUrl(temp);
  //     _setDocs(docsTemp);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // this.setState({modalVisible:false});
  //       // alert("Hello")
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //     } else {
  //       throw err;
  //     }
  //   }
  // };
  const handleChoosePhoto = () => {
    // ImageCropPicker.openPicker({
    //   multiple: true,
    //   mime: 'image/jpeg',
    //   mediaType: 'photo',
    //   compressImageQuality: 0.4,
    //   storageOptions: {cameraRoll: true},
    // }).then(async images => {
    //   let temp = imageUrls;
    //   let tempData = [];
    //   if (imageData.length === 0) {
    //     tempData = [];
    //   } else {
    //     tempData = imageData;
    //   }
    //   images.map(img => {
    //     tempData.push({...img, cameraImage: false});
    //   });
    //   // let tempCameraImage = [];
    //   // let tempGallaryImage = [];
    //   // tempData.map(img => {
    //   //   if (img.cameraImage) {
    //   //     tempCameraImage.push(img);
    //   //   } else {
    //   //     tempGallaryImage.push(img);
    //   //   }
    //   // });
    //   if (tempData.length > 1) {
    //     tempData = await removeDuplicates(tempData, 'size');
    //   }
    //
    //   // tempGallaryImage = removeDuplicates(tempGallaryImage, 'height');
    //   // tempGallaryImage = removeDuplicates(tempGallaryImage, 'width');
    //   // tempData = [];
    //   // tempGallaryImage.map(img => {
    //   //   tempData.push(img);
    //   // });
    //   // tempCameraImage.map(img => {
    //   //   tempData.push(img);
    //   // });
    //
    //   temp = [];
    //   tempData.map(img => {
    //     temp.push(img.path);
    //   });
    //   _setImageData(tempData);
    //   _setImageUrls(temp);
    // });
  };
  const handleCameraImage = async () => {
    // if (isANDROID) {
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       {
    //         title: 'Navgam app',
    //         message: 'Navgam app need a permission for Camera',
    //         buttonPositive: 'OK',
    //       }
    //     );
    //     // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     //   console.log('You can use');
    //     // } else {
    //     //   console.log('Camera permission denied');
    //     // }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        let temp = imageUrls;
        let tempData = [];
        if (imageData.length === 0) {
          tempData = [];
        } else {
          tempData = imageData;
        }
        temp = [];
        tempData.push({...image, cameraImage: true});
        // tempData = removeDuplicates(tempData, 'modificationDate');
        tempData.map(img => {
          temp.push(img.path);
        });
        _setImageData(tempData);
        _setImageUrls(temp);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeImage = index => {
    let img = imageUrls;
    img.splice(index, 1);
    let tempImgData = imageData;
    tempImgData.splice(index, 1);
    _setImageData(tempImgData);
    _setImageUrls(imageUrls);
  };
  const removePdf = index => {
    let doc = docUrl;
    doc.splice(index, 1);
    // setDocUrl([...docUrl]);
    _setDocUrl(docUrl);
    let docData = docs;
    docData.splice(index, 1);
    // setDocUrl([...docUrl]);
    _setDocs(docs);
  };
  const _renderImage = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          marginHorizontal: wp(1),
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: color.white,
            zIndex: 1,
            alignSelf: 'flex-end',
            marginHorizontal: wp(-2),
            marginVertical: hp(0.5),
          }}>
          <Fontisto
            onPress={() => removeImage(index)}
            name={'close'}
            size={wp(5)}
            color={color.blue}
          />
        </View>
        <Image
          key={index}
          source={{uri: item}}
          style={{
            width: hp(19),
            height: hp(15.5),
            marginVertical: hp(-1.5),
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  const _renderDoc = ({item, index}) => {
    return (
      <View key={index} style={{flexDirection: 'row', marginHorizontal: wp(1), marginTop: hp(0.5)}}>
        <View style={{flex: 3, flexDirection: 'row'}}>
          <AntDesign name={'pdffile1'} color={color.red} size={wp(5)} />
          <Text allowFontScaling={false} style={{fontSize: normalize(14)}}>
            {item}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 15,
            backgroundColor: color.white,
            zIndex: 1,
            alignSelf: 'flex-end',
          }}>
          <AntDesign
            onPress={() => removePdf(index)}
            name={'close'}
            size={wp(5)}
            color={color.blue}
          />
        </View>
        {/*<Image key={index} source={{uri: item}} style={{width: 150, height: 100,flex:1,alignSelf:'center'}} />*/}
      </View>
    );
  };
  const openDocPicker = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });
      let temp = docUrl;
      let docsTemp = docs;
      for (const res of results) {
        if (docsTemp.indexOf(res.uri) < 0) {
          temp.push(res.name);
          docsTemp.push(res.uri);
        }
      }
      _setDocUrl(temp);
      _setDocs(docsTemp);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // this.setState({modalVisible:false});
        // alert("Hello")
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <View>
      <View style={[{flexDirection: 'row', flex: 1, marginTop: hp(1)}, containerStyle]}>
        {lable != '' && (
          <Text
            allowFontScaling={false}
            style={[
              {
                fontSize: normalize(15),
                flex: 3,
              },
              lableStyle,
            ]}>
            {lable}
          </Text>
        )}
        <View style={{flex: 0.5}}>
          <TouchableWithoutFeedback onPress={openDocPicker}>
            <Image source={docImg} style={[{height: wp(6), width: wp(6)}, imgStyle]} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex: 0.5}}>
          <TouchableWithoutFeedback onPress={handleChoosePhoto}>
            <Image source={libraryImg} style={[{height: wp(6), width: wp(6)}, imgStyle]} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex: 0.5}}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleCameraImage();
            }}>
            <Image source={cameraImg} style={[{height: wp(6), width: wp(6)}, imgStyle]} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View
        style={[
          {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          },
          flatListContainerStyle,
        ]}>
        {imageUrls.length != 0 && (
          <Attatchments renderData={_renderImage} urls={imageUrls} columns={2} />
        )}
      </View>
      <View style={{flex: 1, marginTop: hp(0.8)}}>
        {docUrl.length > 0 && <Attatchments renderData={_renderDoc} urls={docUrl} />}
      </View>
    </View>
  );
};
