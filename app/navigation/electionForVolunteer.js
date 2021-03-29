import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import ElectionListForVolunteer from '../screen/Election/ElectionListForVolunteer';
import VotersTabs from '../navigation/voterTab/'
import VoterTabsScreen from '../navigation/voterTab/index';
import BoothList from '../screen/Election/boothListForVolunteer'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;
    return (
            <Stack.Navigator initialRouteName="ElectionListForVolunteer" screenOptions={{headerShown: false}}>
                <Stack.Screen name="ElectionListForVolunteer" component={ElectionListForVolunteer} />
                <Stack.Screen name="VoterTabsScreen" component={VoterTabsScreen} />
                <Stack.Screen name="BoothList" component={BoothList} />
            </Stack.Navigator>
    );
};

export default App;
