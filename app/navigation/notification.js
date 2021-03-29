import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import IntroductionScreen from '../screen/dummy';
import NotificationPage from '../screen/notification/notificationList'
import NotificationDetailPage from '../screen/notification/NotificationDetail'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;
    return (
            <Stack.Navigator initialRouteName="NotificationPage" screenOptions={{headerShown: false}}>
                <Stack.Screen name="NotificationPage" component={NotificationPage} />
                <Stack.Screen name="NotificationDetailPage" component={NotificationDetailPage} />
            </Stack.Navigator>
    );
};

export default App;
