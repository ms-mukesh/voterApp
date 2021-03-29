import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import VolunteerRequest from '../screen/volunteer/volunteerRequestsStatus'
import VolunteerRequestsPreivew from '../screen/volunteer/VoterDetailPreviewforVolunteer'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (

        <Stack.Navigator initialRouteName="VolunteerRequest" screenOptions={{headerShown: false}}>
            <Stack.Screen name="VolunteerRequest" component={VolunteerRequest} />
            <Stack.Screen name="VolunteerRequestsPreivew" component={VolunteerRequestsPreivew} />
        </Stack.Navigator>
    );
};

export default App;
