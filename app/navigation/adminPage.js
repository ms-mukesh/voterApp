import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import VolunteerListForChangeVoterDetail from '../screen/admin/volunteerList'
import VolunteerChanges from '../screen/admin/volunteerChanges'
import VoterDetailPreview from '../screen/admin/VoterDetailPreview'



const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="VolunteerListForChangeVoterDetail" screenOptions={{headerShown: false}}>
            <Stack.Screen name="VolunteerListForChangeVoterDetail" component={VolunteerListForChangeVoterDetail} />
            <Stack.Screen name="VolunteerChanges" component={VolunteerChanges} />
            <Stack.Screen name="VoterDetailPreview" component={VoterDetailPreview} />
        </Stack.Navigator>
    );
};

export default App;
