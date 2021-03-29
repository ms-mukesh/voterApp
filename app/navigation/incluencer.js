import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import IncluencerList from '../screen/home/incluencerMembers'
import MemberDetails from '../screen/home/memberDetails'



const Stack = createStackNavigator();
const App = () => {
    return (
            <Stack.Navigator initialRouteName="IncluencerList" screenOptions={{headerShown: false}}>
                <Stack.Screen name="IncluencerList" component={IncluencerList} />
                <Stack.Screen name="MemberDetails" component={MemberDetails} />
            </Stack.Navigator>
    );
};

export default App;
