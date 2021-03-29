import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import TemplateScreen from '../screen/digitalPrinter/templateList';
import TemplateDetailScreen from '../screen/digitalPrinter/templateDetail';



const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <Stack.Navigator initialRouteName="TemplateScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
            <Stack.Screen name="TemplateDetailScreen" component={TemplateDetailScreen} />
        </Stack.Navigator>
    );
};

export default App;
