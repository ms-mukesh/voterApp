import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import IntroductionScreen from '../screen/dummy';
import Login from '../screen/authentication/login';
import Home from '../screen/home/dashboard'
import Drawer from '../navigation/drawer/'
import EditProfilePage from '../screen/home/editProfile';
import SplashScreen from '../screen/authentication/splashscreen'
import VoterEditPage from '../screen/volunteer/voterDetail'
import VoterList from "../screen/home/dashboard";
import MemberDetails from "../screen/home/memberDetails"
import Temp from "../screen/home/dashboard";
import AddnewVoter from '../screen/NewVoter/addNewVoter'
import AddNewFamily from '../screen/NewVoter/selectFamily'
import VolunteerListForChangeVoterDetail from "../screen/admin/volunteerList";
import VolunteerChanges from "../screen/admin/volunteerChanges";
import VoterDetailPreview from "../screen/admin/VoterDetailPreview";
import VolunteerListToAssignBooth from "../screen/volunteer/assignBoothToVolunteer";
import VolunteerBoothDetail from "../screen/volunteer/volunteerBoothDetail";
import Dashboard from "../screen/dashboard/dashboard";
import Notification from "./notification";
import Volunteer from "./assignBoothToVolunteer";
import BroadcastNotification from "../screen/BoardcastNotificationList";
import SurveyList from "./survey";
import Election from "./electionForVolunteer";
import ChangePassword from "../screen/authentication/changePassword";
import TemplateScreen from "../screen/digitalPrinter/templateList";
import TemplateDetailScreen from "../screen/digitalPrinter/templateDetail";
import ElectionListScreen from "../screen/Election/ElectionList";
import AssignElectionToVoterScreen from "../screen/Election/assignElectionToVolunteer";
import ElectionBoothDetailScreen from "../screen/Election/electionBoothWiseDetail";
import ElectionListForVolunteer from "../screen/Election/ElectionListForVolunteer";
import VoterTabsScreen from "./voterTab";
import BoothList from "../screen/Election/boothListForVolunteer";
import EventCalender from "../screen/Event/EventCalender";
import EventView from "../screen/Event/allocateTask";
import TaskView from "../screen/Event/eventTask";
import FilterPage from "../screen/home/FilterPage";
import IncluencerList from "../screen/home/incluencerMembers";
import NotificationPage from "../screen/notification/notificationList";
import NotificationDetailPage from "../screen/notification/NotificationDetail";
import CreateNewSurvey from "../screen/survey/createNewSurvey";
import SurveyQuestionList from "../screen/survey/surveyQuestionList";
import SurveyVoterList from "../screen/survey/surveyVoterList";
import SurveyVolunteerBoothList from "../screen/survey/volunteerBoothList";
import BoothWiseVoterListForSurvey from "../screen/survey/boothWiseVoterListForSuvey";
import SuverQuestionListForVolunteer from "../screen/survey/surveyQuestionListForVolunteer";
import VolunteerTask from "../screen/volunteer/volunteerTask";
import VolunteerEventTask from "../screen/volunteer/volunteerEventTask";
import VolunteerBoothList from "../screen/volunteer/volunteerBoothList";
import BoothWiseVolunteerList from "../screen/volunteer/boothWiseVoterList";
import VolunteerRequest from "../screen/volunteer/volunteerRequestsStatus";
import VolunteerRequestsPreivew from "../screen/volunteer/VoterDetailPreviewforVolunteer";
import VoterDetails from '../screen/volunteer/voterDetail'
const Stack = createStackNavigator();
const App = () => {
    // eslint-disable-next-line no-console
    // console.disableYellowBox = true;

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Temp" component={Temp} />
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Drawer" component={Drawer} />
                <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
                <Stack.Screen name="VoterEditPage" component={VoterEditPage} />
                <Stack.Screen name="VoterList" component={VoterList} />
                <Stack.Screen name="AddnewVoter" component={AddnewVoter} />
                <Stack.Screen name="AddNewFamily" component={AddNewFamily} />
                <Stack.Screen name="VolunteerListForChangeVoterDetail" component={VolunteerListForChangeVoterDetail} />
                <Stack.Screen name="VolunteerChanges" component={VolunteerChanges} />
                <Stack.Screen name="VoterDetailPreview" component={VoterDetailPreview} />
                <Stack.Screen name="VolunteerListToAssignBooth" component={VolunteerListToAssignBooth} />
                <Stack.Screen name="VolunteerBoothDetail" component={VolunteerBoothDetail} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="Volunteer" component={Volunteer} />
                <Stack.Screen name="BroadcastNotification" component={BroadcastNotification} />
                <Stack.Screen name="SurveyList" component={SurveyList} />
                <Stack.Screen name="Election" component={Election} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
                <Stack.Screen name="TemplateDetailScreen" component={TemplateDetailScreen} />
                <Stack.Screen name="ElectionListScreen" component={ElectionListScreen} />
                <Stack.Screen name="AssignElectionToVoterScreen" component={AssignElectionToVoterScreen} />
                <Stack.Screen name="ElectionBoothDetailScreen" component={ElectionBoothDetailScreen} />
                <Stack.Screen name="ElectionListForVolunteer" component={ElectionListForVolunteer} />
                <Stack.Screen name="VoterTabsScreen" component={VoterTabsScreen} />
                <Stack.Screen name="BoothList" component={BoothList} />
                <Stack.Screen name="EventCalender" component={EventCalender} />
                <Stack.Screen name="EventView" component={EventView} />
                <Stack.Screen name="TaskView" component={TaskView} />

                <Stack.Screen name="MemberDetails" component={MemberDetails} />
                <Stack.Screen name="FilterPage" component={FilterPage} />
                <Stack.Screen name="IncluencerList" component={IncluencerList} />
                <Stack.Screen name="NotificationPage" component={NotificationPage} />
                <Stack.Screen name="NotificationDetailPage" component={NotificationDetailPage} />
                <Stack.Screen name="CreateNewSurvey" component={CreateNewSurvey} />
                <Stack.Screen name="SurveyQuestionList" component={SurveyQuestionList} />
                <Stack.Screen name="SurveyVoterList" component={SurveyVoterList} />
                <Stack.Screen name="SurveyVolunteerBoothList" component={SurveyVolunteerBoothList} />
                <Stack.Screen name="BoothWiseVoterListForSurvey" component={BoothWiseVoterListForSurvey} />
                <Stack.Screen name="SuverQuestionListForVolunteer" component={SuverQuestionListForVolunteer} />
                <Stack.Screen name="VolunteerTask" component={VolunteerTask} />
                <Stack.Screen name="VolunteerEventTask" component={VolunteerEventTask} />
                <Stack.Screen name="VolunteerBoothList" component={VolunteerBoothList} />
                <Stack.Screen name="BoothWiseVolunteerList" component={BoothWiseVolunteerList} />
                <Stack.Screen name="VoterDetails" component={VoterDetails} />
                <Stack.Screen name="VolunteerRequest" component={VolunteerRequest} />
                <Stack.Screen name="VolunteerRequestsPreivew" component={VolunteerRequestsPreivew} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
