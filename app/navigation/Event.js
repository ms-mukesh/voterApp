import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import EventCalender from '../screen/Event/EventCalender'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (

        <Stack.Navigator initialRouteName="EventCalender" screenOptions={{headerShown: false}}>
            <Stack.Screen name="EventCalender" component={EventCalender} />
        </Stack.Navigator>
    );
};

export default App;
