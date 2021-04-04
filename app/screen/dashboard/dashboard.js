import React,{useEffect} from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity,Image} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppHeader, Loading} from "../common";
import {hp, wp, normalize, color, isWEB, IsIOSOS, IsAndroidOS} from "../../helper/themeHelper";
import {
    allocate_task_color,
    broadcast_notifiction_icon_color, change_pwd_icon_color,
    election_icon_color, event_calender_color, family_tree_color, influencer_color_icon, notifiction_icon_color,
    survey_list_icon_color,
    volunteer_icon,
    volunteer_list_icon_color, volunteer_request_color,
    voter_list_icon,
    voter_list_icon_color
} from "../../assets/images";
import {ADMIN} from "../../helper/constant";
import {setLoaderStatus} from "../../redux/actions/dashboardAction";
const HomeScreenItems =
    [
    {"name":"Voter List","pageUrl":"VoterList","iconUrl":voter_list_icon_color},
    {"name":"Volunteer List","pageUrl":"Volunteer","iconUrl":volunteer_list_icon_color},
    {"name":"Survey List","pageUrl":"SurveyList","iconUrl":survey_list_icon_color},
    {"name":"Election List","pageUrl":"Election","iconUrl":election_icon_color},
    {"name":"Broadcast Notification","pageUrl":"BroadcastNotification","iconUrl":broadcast_notifiction_icon_color},
    {"name":"My Notifications","pageUrl":"Notification","iconUrl":notifiction_icon_color},
    {"name":"Change Password","pageUrl":"ChangePassword","iconUrl":change_pwd_icon_color},

]
const HomeScreenItemsForAdmin =
    [
        {"name":"Voter List","pageUrl":"VoterList","iconUrl":voter_list_icon_color},
        {"name":"Volunteer List","pageUrl":"Volunteer","iconUrl":volunteer_list_icon_color},
        {"name":"Survey List","pageUrl":"SurveyList","iconUrl":survey_list_icon_color},
        {"name":"Election List","pageUrl":"Election","iconUrl":election_icon_color},
        {"name":"Broadcast Notification","pageUrl":"BroadcastNotification","iconUrl":broadcast_notifiction_icon_color},
        {"name":"My Notifications","pageUrl":"Notification","iconUrl":notifiction_icon_color},
        {"name":"Family Tree","pageUrl":"FamilyTreeScreen","iconUrl":family_tree_color},
        {"name":"Event Calender","pageUrl":"EventCalender","iconUrl":event_calender_color},
        {"name":"Allocate Task","pageUrl":"AllocateTask","iconUrl":allocate_task_color},
        {"name":"My Incluencers","pageUrl":"IncluencerList","iconUrl":influencer_color_icon},
        {"name":"Change Password","pageUrl":"ChangePassword","iconUrl":change_pwd_icon_color},

    ]
const HomeScreenItemsForVolunteer =
    [
        {"name":"Voter List","pageUrl":"VoterList","iconUrl":voter_list_icon_color},
        {"name":"Survey List","pageUrl":"SurveyList","iconUrl":survey_list_icon_color},
        {"name":"Election List","pageUrl":"Election","iconUrl":election_icon_color},
        {"name":"My Notifications","pageUrl":"Notification","iconUrl":notifiction_icon_color},
        {"name":"Change Password","pageUrl":"ChangePassword","iconUrl":change_pwd_icon_color},
    ]


const Dashboard = props => {
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.user.userDetail);
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);

    useEffect(()=>{
        dispatch(setLoaderStatus(false))
    },[])
    const renderHomeScreenItems = ({ item, index }) => {
        return (
            <View key={Math.random() + 'DE'} style={style.mainView}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate(item?.pageUrl,{fromDashBoard:true})
                    }}
                >
                    <Image resizeMode={'contain'} style={style.iconImage} source={item?.iconUrl} />
                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={[style.bottomTextStyle, { width: wp(30), textAlign: 'center' }]}
                >
                    {item?.name}
                </Text>
            </View>
        );
    };
    return (
        <View style={{flex: 1,}}>
            <AppHeader
                title={'Home'}
                onMenuPress={() => {
                    props.navigation.openDrawer()
                }}
            />
            <FlatList
                numColumns={(IsIOSOS || IsAndroidOS)?3:3}
                horizontal={false}
                data={userDetails.role===ADMIN ? HomeScreenItemsForAdmin:HomeScreenItemsForVolunteer}
                // data={HomeScreenItemsForAdmin}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderHomeScreenItems}
                keyExtractor={(item, index) => index.toString()}
            />
            {isLoading && <Loading isLoading={isLoading} />}
        </View>
    );
};
const style = StyleSheet.create({
    iconImage: {
        height: hp(18),
        width: wp(18),
        borderRadius: hp(2),
    },
    mainView: {
        flex: 1,
        marginTop: hp(2),
        // marginLeft: wp(3),
        marginHorizontal:wp(1),
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: color.white,
        borderRadius: hp(2),
        paddingTop: hp(1),
        paddingLeft: wp(2),
        paddingRight: wp(2),
        paddingBottom: hp(1),
    },
    bottomTextStyle: {
        marginTop: hp(1),
        fontSize: normalize(10),
        fontWeight: '700',
        color: color.themePurple,
    },
})

export default Dashboard;
