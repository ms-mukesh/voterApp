import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import IntroductionScreen from '../screen/dummy';
import AddnewVoter from '../screen/NewVoter/addNewVoter'
import AddNewFamily from '../screen/NewVoter/selectFamily'


const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (

        <Stack.Navigator initialRouteName="AddnewVoter" screenOptions={{headerShown: false}}>
            <Stack.Screen name="AddnewVoter" component={AddnewVoter} />
            <Stack.Screen name="AddNewFamily" component={AddNewFamily} />
        </Stack.Navigator>

    );
};

export default App;
