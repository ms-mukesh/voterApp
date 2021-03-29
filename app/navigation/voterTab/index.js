import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
import GaveVoteScreen from '../../screen/Election/voterTab/gaveVote'
import NotGaveVoteScreen from '../../screen/Election/voterTab/notGaveVote'
import React from "react";
import {SafeAreaView,View} from 'react-native'
import {StatusBar} from "expo-status-bar";
import {hp,normalize} from "../../helper/themeHelper";
import {GoBackHeader} from "../../screen/common";
const MyTabs = (props) => {
    const {ElectionId} = props.route.params;
    return (
        <View style={{flex:1}}>
            <GoBackHeader   onMenuPress={() => {
                props.navigation.goBack()
            }} title={'back'}/>
        <Tab.Navigator>
            <Tab.Screen labelStyle={{fontSize:normalize(15),backgroundColor:'red'}} name="Give Vote" children={()=><GaveVoteScreen electionId={ElectionId}/>} ElectionId={ElectionId} />
            <Tab.Screen name="Pending To Give Vote" children={()=><NotGaveVoteScreen electionId={ElectionId}/>} ElectionId={ElectionId} />
        </Tab.Navigator>

        </View>
    );
}
export default MyTabs;
