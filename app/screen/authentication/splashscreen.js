import React,{useEffect,useState} from 'react';
import {AsyncStorage, StyleSheet, Text, View,Image} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {hp, isWEB} from "../../helper/themeHelper";
import {EventRegister} from "react-native-event-listeners";
import {setUserDetails} from "../../redux/actions/userActions";
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from "react-redux";
import LoginScreen from "./login";
import {splash_screen_icon} from "../../assets/images";

const ReactNativeSplashScreen = (props)=>{
    const [appIsReady,setIsAppReady] = useState(false)
    const dispatch = useDispatch()
    useEffect(()=>{
        try {
            const preventSplashScreen = async ()=> {
                await SplashScreen.preventAutoHideAsync();
            }
            preventSplashScreen()


        } catch (e) {
            console.warn(e);
        }
        prepareResources();
    },[]);
    const prepareResources = async () => {
        try {
            // await performAPICalls();
            // await downloadAssets();
        } catch (e) {
            console.warn(e);
        } finally {
            await setIsAppReady(true)
            await SplashScreen.hideAsync();
            // this.setState({ appIsReady: true }, async () => {
            //     await SplashScreen.hideAsync();
            // });
        }
    };
    if (appIsReady) {
        return(
            <View style={styles.container}>
                <Image source={splash_screen_icon} style={{height:hp(45),width:hp(45)}}/>
            </View>
        )
    } else {
        if(!isWEB){
            SplashScreen.hideAsync();
            AsyncStorage.getItem('userLoginDetail').then((res)=>{
                if(res){
                    // alert(JSON.stringify(res))
                    EventRegister.addEventListener('forceLogoutEvent', () => {
                        AsyncStorage.removeItem('userLoginDetail')
                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                            })
                        );
                    });
                    dispatch(setUserDetails(JSON.parse(res)));
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Drawer'}],
                        })
                    );
                } else {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                        })
                    );
                }
            })
        } else {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                })
            );
        }
    }
    return(
        <View style={styles.container}>
            <Image source={splash_screen_icon} style={{height:hp(40),width:hp(40)}}/>
        </View>
    )
}
export default ReactNativeSplashScreen;

// export default class App extends React.Component {
//
//     state = {
//         appIsReady: false,
//     };
//
//
//     async componentDidMount() {
//         // Prevent native splash screen from autohiding
//         try {
//             await SplashScreen.preventAutoHideAsync();
//         } catch (e) {
//             console.warn(e);
//         }
//         this.prepareResources();
//     }
//
//     /**
//      * Method that serves to load resources and make API calls
//      */
//     prepareResources = async () => {
//         try {
//             // await performAPICalls();
//             // await downloadAssets();
//         } catch (e) {
//             console.warn(e);
//         } finally {
//             this.setState({ appIsReady: true }, async () => {
//                 await SplashScreen.hideAsync();
//             });
//         }
//     };
//
//     render() {
//         if (!this.state.appIsReady) {
//             return null;
//         } else {
//             if(!isWEB){
//                 AsyncStorage.getItem('userLoginDetail').then((res)=>{
//                     if(res){
//                         // alert(JSON.stringify(res))
//                         EventRegister.addEventListener('forceLogoutEvent', () => {
//                             AsyncStorage.removeItem('userLoginDetail')
//                             this.props.navigation.dispatch(
//                                 CommonActions.reset({
//                                     index: 0,
//                                     routes: [{name: 'Login'}],
//                                 })
//                             );
//                         });
//                         dispatch(setUserDetails(JSON.parse(res)));
//                         this.props.navigation.dispatch(
//                             CommonActions.reset({
//                                 index: 0,
//                                 routes: [{name: 'Drawer'}],
//                             })
//                         );
//                     } else {
//                         this.props.navigation.dispatch(
//                             CommonActions.reset({
//                                 index: 0,
//                                 routes: [{name: 'Login'}],
//                             })
//                         );
//                     }
//                 })
//             }
//         }
//
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.text}>Please wait we are loading content for you..Thank you</Text>
//             </View>
//         );
//     }
// }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});
