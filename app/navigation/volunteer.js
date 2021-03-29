import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import VolunteerTask from '../screen/volunteer/volunteerTask'
import VolunteerEventTask from '../screen/volunteer/volunteerEventTask'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (

        <Stack.Navigator initialRouteName="VolunteerTask" screenOptions={{headerShown: false}}>
            <Stack.Screen name="VolunteerTask" component={VolunteerTask} />
            <Stack.Screen name="VolunteerEventTask" component={VolunteerEventTask} />
        </Stack.Navigator>
    );
};

export default App;
