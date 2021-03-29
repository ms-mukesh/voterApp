import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import Home from '../screen/home/dashboard'
import MemberDetails from '../screen/home/memberDetails'
import FilterPage from '../screen/home/FilterPage'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;
    return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="MemberDetails" component={MemberDetails} />
                <Stack.Screen name="FilterPage" component={FilterPage} />
            </Stack.Navigator>

    );
};

export default App;
