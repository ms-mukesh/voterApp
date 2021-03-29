import {Dimensions, PixelRatio, Platform} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const isIOS = Platform.OS === 'ios';
const isANDROID = Platform.OS === 'android';
const isWEB = Platform.OS === 'web';

const isiPAD = SCREEN_HEIGHT / SCREEN_WIDTH < 1.6;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const widthPercentageToDP = wp => {
  const widthPercent = wp;
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = hp => {
  const heightPercent = hp;
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

// based on iphone 5s's scale
const scale = isWEB?SCREEN_HEIGHT/375:SCREEN_WIDTH / 375;

const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const font = {
  // robotoRegular: (isIOS && 'Roboto-Regular') || 'Roboto_Regular',
  // robotoBold: (isIOS && 'Roboto-Bold') || 'Roboto_Bold',
};

const color = {
  black: '#02152a',
  white: '#ffffff',
  blue: '#002f7f',
  red: '#D12A2F',
  yellow: '#EAD836',
  purple: '#46477D',
  green: '#228C44',
  lightBlue: '#5578C4',
  lightGray: '#DCDCDC',
  gray: '#B6C2DA',
  darkGray: '#BFBFC0',
  creamGray: '#F5F5F5',
  creamDarkGray: '#F3F3F3',
  lightPurple: '#B0BFEC',
  lightPink: 'rgb(247,193,211)',
  lightOrange: '#EBA09A',
  lightGreen: '#8FCBA5',
  darkOrange: '#F3534A',
  themePurple:'#403c77'
};

const headerColorArray = ['#cb2927', '#E7D819', '#403c77', '#258838', '#403c77'];

export {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  normalize,
  isIOS,
  isANDROID,
  isiPAD,
  color,
  font,
  headerColorArray,
    isWEB
};
