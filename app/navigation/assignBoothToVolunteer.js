import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import VolunteerListToAssignBooth from '../screen/volunteer/assignBoothToVolunteer'
import VolunteerBoothDetail from '../screen/volunteer/volunteerBoothDetail'


const Stack = createStackNavigator();
const App = () => {
    return (
        <Stack.Navigator initialRouteName="VolunteerListToAssignBooth" screenOptions={{headerShown: false}}>
            <Stack.Screen name="VolunteerListToAssignBooth" component={VolunteerListToAssignBooth} />
            <Stack.Screen name="VolunteerBoothDetail" component={VolunteerBoothDetail} />
        </Stack.Navigator>
    );
};

export default App;
