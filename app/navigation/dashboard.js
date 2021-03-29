import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import Dashboard from '../screen/dashboard/dashboard';
import VoterList from '../navigation/homeScreen'
import Volunteer from '../navigation/assignBoothToVolunteer'
import BroadcastNotification from '../screen/BoardcastNotificationList/index'
import Notification from '../navigation/notification'
import ChangePassword from '../screen/authentication/changePassword'
import SurveyList from '../navigation/survey';
import Election from '../navigation/electionForVolunteer';


const Stack = createStackNavigator();
const App = (props) => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="VoterList" component={VoterList} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Volunteer" component={Volunteer} />
            <Stack.Screen name="BroadcastNotification" component={BroadcastNotification} />
            <Stack.Screen name="SurveyList" component={SurveyList} />
            <Stack.Screen name="Election" component={Election} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>

    );
};

export default App;
