import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import TemplateScreen from '../screen/dummy';




const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="TemplateScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
        </Stack.Navigator>
    );
};

export default App;
