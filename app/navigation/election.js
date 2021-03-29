import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import ElectionListScreen from '../screen/Election/ElectionList';
import AssignElectionToVoterScreen from '../screen/Election/assignElectionToVolunteer'
import ElectionBoothDetailScreen from '../screen/Election/electionBoothWiseDetail'

const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;
    return (
            <Stack.Navigator initialRouteName="ElectionListScreen" screenOptions={{headerShown: false}}>
                <Stack.Screen name="ElectionListScreen" component={ElectionListScreen} />
                <Stack.Screen name="AssignElectionToVoterScreen" component={AssignElectionToVoterScreen} />
                <Stack.Screen name="ElectionBoothDetailScreen" component={ElectionBoothDetailScreen} />
            </Stack.Navigator>
    );
};

export default App;
