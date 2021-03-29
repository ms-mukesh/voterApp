import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';

import EventView from '../screen/Event/allocateTask'
import TaskView from '../screen/Event/eventTask'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="EventView" screenOptions={{headerShown: false}}>
            <Stack.Screen name="EventView" component={EventView} />
            <Stack.Screen name="TaskView" component={TaskView} />
        </Stack.Navigator>
    );
};

export default App;
