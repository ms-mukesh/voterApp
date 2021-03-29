import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {wp} from '../../helper/themeHelper';
const Drawer = createDrawerNavigator();
import DashBoard from '../homeScreen'
import AddVoter from '../../screen/NewVoter/addNewVoter'
import BroadcastNotification from '../../screen/BoardcastNotificationList/index'
import Notification from '../notification'
import ChangePassword from '../../screen/authentication/changePassword'
import EventCalender from '../Event'
import CreateNewEventScreen from '../../screen/Event/CreateNewEvent'
import AllocateTaskForEvent from '../eventTask'
import Volunteer from '../volunteer'
import DigitalPrinter from '../digitalPrinter'
import UserTemplateList from '../../screen/digitalPrinter/userTemplateList'
import FamilyTreeScreen from '../../screen/home/familyTree'
import AssignBoothToVounteer from '../assignBoothToVolunteer'
import VolunteerBoothList from '../volunteerBooth'
import VolunteerListToChangeVoterDetails from '../adminPage'
import VolunteerRequestStatus from '../volunteerRequestPreview'
import AddNewTemplateForDigitalPrinter from '../../screen/admin/addNewTemplate'
import {DrawerContent} from './drawerContent';
import Election from '../election';
import ElectionList from '../electionForVolunteer'
import SurveyList from '../survey';
import DashboardScreen from '../dashboard';
import DashboardScreenTemp from '../../screen/dashboard/dashboard';

import InfluencerListScreen from '../incluencer'
import DashoardIndex from '../../screen/dashboard/dashboard'
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import DummyNavigation from '../dummyNavigation'
const DrawerNavigation = props => {
    let params = props.route.params;
    const Stack = createStackNavigator();
    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} params={params} />}
            drawerStyle={{width: wp(40)}}
            backBehavior={'initialRoute'}
            initialRouteName={'DashboardScreen'}
            openByDefault={false}
        >
            {/*<Drawer.Screen name="DashboardScreen">*/}
            {/*    {()=>(*/}
            {/*        <Stack.Navigator initialRouteName='BroadcastNotification'>*/}
            {/*            <Stack.Screen name='BroadcastNotification' component={BroadcastNotification} options={{ header: () => null }} />*/}
            {/*        </Stack.Navigator>*/}
            {/*    )*/}
            {/*    }*/}
            {/*</Drawer.Screen>*/}
            <Drawer.Screen name="DashboardScreen" component={DashboardScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="DashBoard" component={DashBoard} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AddVoter" component={AddVoter} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="BroadcastNotification" component={BroadcastNotification} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="Notification" component={Notification} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ChangePassword" component={ChangePassword} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="EventCalender" component={EventCalender} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="CreateNewEventScreen" component={CreateNewEventScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AllocateTaskForEvent" component={AllocateTaskForEvent} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="Volunteer" component={Volunteer} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="DigitalPrinter" component={DigitalPrinter} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="UserTemplateList" component={UserTemplateList} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="FamilyTreeScreen" component={FamilyTreeScreen} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AssignBoothToVounteer" component={AssignBoothToVounteer} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="VolunteerBoothList" component={VolunteerBoothList} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="VolunteerListToChangeVoterDetails" component={VolunteerListToChangeVoterDetails} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="VolunteerRequestStatus" component={VolunteerRequestStatus} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="AddNewTemplateForDigitalPrinter" component={AddNewTemplateForDigitalPrinter} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="Election" component={Election} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="ElectionList" component={ElectionList} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="SurveyList" component={SurveyList} options={{unmountOnBlur: true}} />
            <Drawer.Screen name="InfluencerListScreen" component={InfluencerListScreen} options={{unmountOnBlur: true}} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigation;
