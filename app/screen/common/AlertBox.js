import {Alert} from 'react-native';

const AppAlertBox = props => {
  const {onPressOk, onPressCancel, titleForOk, titleForCancel} = props;
  return Alert.alert(
    'Navgam',
    'No Internet',
    [
      {
        text: titleForOk,
        onPress: () => {
          onPressOk;
        },
      },
      {
        text: titleForCancel,
        onPress: () => {
          onPressCancel;
        },
      },
    ],
    {
      cancelable: false,
    }
  );
};

export {AppAlertBox};
