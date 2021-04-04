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
import FamilyTreeScreen from "../screen/home/familyTree";
import VolunteerChanges from "../screen/admin/volunteerChanges";
import EventCalender from "../screen/Event/EventCalender";
import AllocateTask from "../screen/Event/allocateTask";
import IncluencerList from "../screen/home/incluencerMembers";


const Stack = createStackNavigator();
const App = (props) => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Dashboard"  component={Dashboard} />
            <Stack.Screen name="VoterList" component={VoterList} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Volunteer" component={Volunteer} />
            <Stack.Screen name="BroadcastNotification" component={BroadcastNotification} />
            <Stack.Screen name="SurveyList" component={SurveyList} />
            <Stack.Screen name="Election" component={Election} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="FamilyTreeScreen" component={FamilyTreeScreen} />
            <Stack.Screen name="VolunteerChanges" component={VolunteerChanges} />
            <Stack.Screen name="EventCalender" component={EventCalender} />
            <Stack.Screen name="AllocateTask" component={AllocateTask} />
            <Stack.Screen name="IncluencerList" component={IncluencerList} />
        </Stack.Navigator>

    );
};

export default App;
