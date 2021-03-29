import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import VolunteerBoothList from '../screen/volunteer/volunteerBoothList'
import BoothWiseVolunteerList from '../screen/volunteer/boothWiseVoterList'
import VoterDetails from '../screen/volunteer/voterDetail'

const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;
    return (
        <Stack.Navigator initialRouteName="VolunteerBoothList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="VolunteerBoothList" component={VolunteerBoothList} />
            <Stack.Screen name="BoothWiseVolunteerList" component={BoothWiseVolunteerList} />
            <Stack.Screen name="VoterDetails" component={VoterDetails} />
        </Stack.Navigator>
    );
};

export default App;
