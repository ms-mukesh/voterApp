import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import SurveyList from '../screen/survey/surveyList'
import CreateNewSurvey from '../screen/survey/createNewSurvey';
import SurveyQuestionList from '../screen/survey/surveyQuestionList';
import SurveyVoterList from '../screen/survey/surveyVoterList';
import SurveyVolunteerBoothList from '../screen/survey/volunteerBoothList';
import BoothWiseVoterListForSurvey from '../screen/survey/boothWiseVoterListForSuvey';
import SuverQuestionListForVolunteer from '../screen/survey/surveyQuestionListForVolunteer';
const Stack = createStackNavigator();
const App = () => {
     return (
        <Stack.Navigator initialRouteName="SurveyList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SurveyList" component={SurveyList} />
            <Stack.Screen name="CreateNewSurvey" component={CreateNewSurvey} />
            <Stack.Screen name="SurveyQuestionList" component={SurveyQuestionList} />
            <Stack.Screen name="SurveyVoterList" component={SurveyVoterList} />
            <Stack.Screen name="SurveyVolunteerBoothList" component={SurveyVolunteerBoothList} />
            <Stack.Screen name="BoothWiseVoterListForSurvey" component={BoothWiseVoterListForSurvey} />
            <Stack.Screen name="SuverQuestionListForVolunteer" component={SuverQuestionListForVolunteer} />
        </Stack.Navigator>
    );
};
export default App;
