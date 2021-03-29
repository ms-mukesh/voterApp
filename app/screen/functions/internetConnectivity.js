import NetInfo from '@react-native-community/netinfo';
import {AsyncStorage} from 'react-native';

export const checkConnectivity = () => {
  return new Promise(resolve => {
    NetInfo.fetch().then(state => {
      return resolve(state.isConnected);
    }).catch((err)=>{
      console.log(err)
    });
  });
};
export const canCallApi = () => {
  return new Promise(resolve => {
    AsyncStorage.getItem('canCallApi').then(res => {
      if (res === null) {
        return resolve(true);
      } else {
        let tempRes = JSON.parse(res);
        if (tempRes.isYes) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      }
    });
  });
};
