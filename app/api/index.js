import axios from 'axios';
import {getToken, generateRandomNumber} from './getToken';
import {checkConnectivity} from "../screen/functions";
import {Alert} from "react-native";
import {EventRegister} from "react-native-event-listeners";
const setUnauthorizedUser = async message => {
  return Alert.alert(
      'Not Authorized',
      "Opps!May be you are not authorized with app...can you please login again?..",
      [
        {
          text: 'Okay',
          onPress: () => {
            EventRegister.emit('forceLogoutEvent');
          },
        },
      ],
      {
        cancelable: false,
      }
  );
};

export const Api = async (endpoint, method, data = null) => {
  let token = await getToken();
  let randomNumber = (await new Date().getTime().toString()) + generateRandomNumber();
  endpoint =
    endpoint.indexOf('?') > -1
      ? endpoint + '&randomKey=' + randomNumber
      : endpoint + '?randomKey=' + randomNumber;

  // let baseurl = 'https://voter-app-testing-purpose.herokuapp.com/';//apk-1
  // let baseurl = 'https://voter-app-for-apk1.herokuapp.com/';//apk-2
  // let baseurl = 'https://testing-app-for-apk3.herokuapp.com/';//apk-3
  // let baseurl = 'http://192.168.0.2:3000/';
  let baseurl = 'http://139.59.1.188:3000/';//--digitalOcean URL
  // let baseurl = 'http://192.168.0.2:3000/';

  let url = baseurl + endpoint;
  // checkConnectivity().then((res)=>{
  //   console.log(res)
  // })

  let header = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  header = (token === '' && header) || Object.assign(header, {token: token});
  return checkConnectivity().then(isNetworkAvailabe => {
    if (isNetworkAvailabe) {
      switch (method) {
        case 'get':
          return axios
            .get(url,{headers: header})
            .then(res => {
              console.log("--res--",res)
              if (res.status === 200) {
                if (
                  res.data.errCode &&
                  res.data.errCode === 401
                ) {
                  return setUnauthorizedUser(res?.data?.message)
                }  else {
                  return res;
                }
              } else {
                return res;
              }
            })
            .catch(err => {
              alert('Oops! May be Server Issue');
              return err;
            });
        case 'post':
          return axios
            .post(url, data,{headers: header})
            .then(res => {
              if (res.status === 200) {
                if (
                    res.data.errCode &&
                    res.data.errCode === 401
                ) {
                  return setUnauthorizedUser(res?.data?.message)
                }  else {
                  return res;
                }
              } else {
                // alert(res.data.data);
                return res;
              }
            })
            .catch(err => {
              alert('Oops! May be Server Issue');
              return err;
            });
      }
    } else {
      return Alert.alert(
        'No Internet',
        'Oops! May be your internet is off',
        [
          {
            text: 'Try Again',
            onPress: () => {
              Api(endpoint, method, data);
            },
          },
          {
            text: 'Okay',
            onPress: () => {},
          },
        ],
        {
          cancelable: false,
        }
      );
    }
  });
};
