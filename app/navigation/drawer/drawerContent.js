import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
const defaultUserMaleImage = require('../../assets/images/user_male.png');
import {SafeAreaView, Alert, Image, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    add_user_icon,
    dashboard_icon,
    notification_icon,
    broadcast_notification_icon,
    help_icon,
    printer_icon,
    password_icon,
    logut_icon,
    up_arrow,
    down_arrow,
    event_icon,
    calender_icon,
    task_name_icon,
    task_desc_icon,
    create_event_icon,
    pencil_icon,
    template_icon,
    volunteer_icon,
    volunteer_request_icon,
    my_request_icon,
    my_booth_icon,
    family_tree_icon,
    election_duty_icon, election_list_icon, voter_list_icon, survey_list_drawer, influnecer_icon
} from '../../assets/images'
import {
    color,
    font,
    hp,
    isANDROID,
    normalize,
    wp,

} from '../../helper/themeHelper';
import {center} from '../../helper/styles';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';
import {ADMIN, VOLUNTEER} from "../../helper/constant";
import {setCurrentDrawerIndex} from "../../redux/actions/userActions";
let temp = 0;

export const DrawerContent = props => {
    const {headerText} = style;
    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.user.userDetail);
    console.log("user details---",userDetails)
    const currentIndex = useSelector(state => state.appDrawer.currentDrawerIndex)
    const [eventExpanded,setEventExpanded] = useState(false)
    const [printerExpanded,setPrinterExpanded] = useState(false)
    const DrawerItemsForNormalUsers = [
        {
            iconSource: voter_list_icon,
            title: 'Voter List',
            urlToPage: 'DashBoard',
        },
        {
            iconSource: family_tree_icon,
            title: 'Family Tree',
            urlToPage: 'FamilyTreeScreen',
        },
        {
            iconSource: notification_icon,
            icon: 'notifications-none',
            title: 'All Notifications',
            urlToPage: 'Notification',
        },
        {
            iconSource: event_icon,
            icon: 'notifications-none',
            title: 'Event',
            urlToPage: 'EventCalender',
            rightIconSource : eventExpanded?up_arrow:down_arrow,
            expandedValueSource :[{
                iconSource: calender_icon,
                icon: 'notifications-none',
                title: 'Event Calender',
                urlToPage: 'EventCalender',
            },
            ]
        },
        {
            iconSource: password_icon,
            icon: 'security',
            title: 'Change Password',
            urlToPage: 'ChangePassword',
        },
        {
            iconSource: printer_icon,
            icon: 'security',
            title: 'Digital printer',
            urlToPage: 'DigitalPrinter',
            rightIconSourceForPrinter : printerExpanded?up_arrow:down_arrow,
            expandedValueSource :[
                {
                    iconSource: calender_icon,
                    icon: 'notifications-none',
                    title: 'Create Template',
                    urlToPage: 'DigitalPrinter',
                },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'My Template',
                    urlToPage: 'UserTemplateList',
                }
            ]
        },
        {
            iconSource: help_icon,
            icon: 'help',
            title: 'Help',
            urlToPage: 'TutorialToUseApp',
        },
        {
            iconSource: logut_icon,
            icon: 'logout',
            title: 'Logout',
            urlToPage: 'Login',
        },
    ];
    const DrawerItemsForVolunteerUsers = [
        {
            iconSource: dashboard_icon,
            title: 'Home',
            urlToPage: 'DashboardScreen',
        },
        {
            iconSource: voter_list_icon,
            title: 'Voter List',
            urlToPage: 'DashBoard',
        },
        {
            iconSource: family_tree_icon,
            title: 'Family Tree',
            urlToPage: 'FamilyTreeScreen',
        },
        // {
        //     iconSource: add_user_icon,
        //     title: 'Add new Voter',
        //     urlToPage: 'AddVoter',
        // },
        {
            iconSource: election_duty_icon,
            title: 'My Election Duty',
            urlToPage: 'ElectionList',
        },
        {
            iconSource: survey_list_drawer,
            title: 'Survey List',
            urlToPage: 'SurveyList',
        },
        {
            iconSource: notification_icon,
            icon: 'notifications-none',
            title: 'All Notifications',
            urlToPage: 'Notification',
        },
        {
            iconSource: event_icon,
            icon: 'notifications-none',
            title: 'Event',
            urlToPage: 'EventCalender',
            rightIconSource : eventExpanded?up_arrow:down_arrow,
            expandedValueSource :[{
                iconSource: calender_icon,
                icon: 'notifications-none',
                title: 'Event Calender',
                urlToPage: 'EventCalender',
            },
                {
                    iconSource: task_desc_icon,
                    icon: 'notifications-none',
                    title: 'My Task',
                    urlToPage: 'Volunteer',
                },]
        },
        {
            iconSource: my_request_icon,
            icon: 'security',
            title: 'My Requests',
            urlToPage: 'VolunteerRequestStatus',
        },
        {
            iconSource: my_booth_icon,
            icon: 'security',
            title: 'My Booths',
            urlToPage: 'VolunteerBoothList',
        },

        {
            iconSource: password_icon,
            icon: 'security',
            title: 'Change Password',
            urlToPage: 'ChangePassword',
        },
        {
            iconSource: printer_icon,
            icon: 'security',
            title: 'Digital printer',
            urlToPage: 'DigitalPrinter',
            rightIconSourceForPrinter : printerExpanded?up_arrow:down_arrow,
            expandedValueSource :[
                {
                    iconSource: calender_icon,
                    icon: 'notifications-none',
                    title: 'Create Template',
                    urlToPage: 'DigitalPrinter',
                },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'My Template',
                    urlToPage: 'UserTemplateList',
                }
            ]
        },
        {
            iconSource: help_icon,
            icon: 'help',
            title: 'Help',
            urlToPage: 'TutorialToUseApp',
        },
        {
            iconSource: logut_icon,
            icon: 'logout',
            title: 'Logout',
            urlToPage: 'Login',
        },
    ];
    const DrawerItemsForAdmin = [
        {
            iconSource: dashboard_icon,
            title: 'Home',
            urlToPage: 'DashboardScreen',
        },
        {
            iconSource: voter_list_icon,
            title: 'Voter List',
            urlToPage: 'DashBoard',
        },
        {
            iconSource: family_tree_icon,
            title: 'Family Tree',
            urlToPage: 'FamilyTreeScreen',
        },
        // {
        //     iconSource: add_user_icon,
        //     title: 'Add new Voter',
        //     urlToPage: 'AddVoter',
        // },
        {
            iconSource: influnecer_icon,
            title: 'My Influencers',
            urlToPage: 'InfluencerListScreen',
        },
        {
            iconSource: survey_list_drawer,
            title: 'Survey List',
            urlToPage: 'SurveyList',
        },
        {
            iconSource: election_duty_icon,
            icon: 'notifications-none',
            title: 'Election Duty',
            urlToPage: 'Election',
        },
        {
            iconSource: election_list_icon,
            title: 'Election List',
            urlToPage: 'ElectionList',
        },
        {
            iconSource: notification_icon,
            icon: 'notifications-none',
            title: 'All Notifications',
            urlToPage: 'Notification',
        },
        // {
        //     iconSource: template_icon,
        //     icon: 'notifications-none',
        //     title: 'Add New Template',
        //     urlToPage: 'AddNewTemplateForDigitalPrinter',
        // },
        {
            iconSource: broadcast_notification_icon,
            icon: 'notifications-none',
            title: 'Broadcast Notifications',
            urlToPage: 'BroadcastNotification',
        },
        {
            iconSource: event_icon,
            icon: 'notifications-none',
            title: 'Event',
            urlToPage: 'EventCalender',
            rightIconSource : eventExpanded?up_arrow:down_arrow,
            expandedValueSource :[{
                iconSource: calender_icon,
                icon: 'notifications-none',
                title: 'Event Calender',
                urlToPage: 'EventCalender',
            },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'Create Event',
                    urlToPage: 'CreateNewEventScreen',
                }, {
                    iconSource: task_name_icon,
                    icon: 'notifications-none',
                    title: 'Allocate Task',
                    urlToPage: 'AllocateTaskForEvent',
                },
               ]
        },
        {
            iconSource: volunteer_icon,
            icon: 'security',
            title: 'My Volunteers',
            urlToPage: 'AssignBoothToVounteer',
        },

        {
            iconSource: volunteer_request_icon,
            icon: 'security',
            title: 'Volunteer Requests',
            urlToPage: 'VolunteerListToChangeVoterDetails',
        },
        {
            iconSource: password_icon,
            icon: 'security',
            title: 'Change Password',
            urlToPage: 'ChangePassword',
        },
        {
            iconSource: printer_icon,
            icon: 'security',
            title: 'Digital printer',
            urlToPage: 'DigitalPrinter',
            rightIconSourceForPrinter : printerExpanded?up_arrow:down_arrow,
            expandedValueSource :[
                {
                    iconSource: calender_icon,
                    icon: 'notifications-none',
                    title: 'Create Template',
                    urlToPage: 'DigitalPrinter',
                },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'My Template',
                    urlToPage: 'UserTemplateList',
                }
            ]
        },
        {
            iconSource: help_icon,
            icon: 'help',
            title: 'Help',
            urlToPage: 'TutorialToUseApp',
        },
        {
            iconSource: logut_icon,
            icon: 'logout',
            title: 'Logout',
            urlToPage: 'Login',
        },
    ];
    const DrawerItems = [
        {
            iconSource: dashboard_icon,
            title: 'Dashboard',
            urlToPage: 'DashBoard',
        },
        {
            iconSource: family_tree_icon,
            title: 'Family Tree',
            urlToPage: 'FamilyTreeScreen',
        },
        {
            iconSource: add_user_icon,
            title: 'Add new Voter',
            urlToPage: 'AddVoter',
        },
        {
            iconSource: notification_icon,
            icon: 'notifications-none',
            title: 'All Notifications',
            urlToPage: 'Notification',
        },
        {
            iconSource: template_icon,
            icon: 'notifications-none',
            title: 'Add New Template',
            urlToPage: 'AddNewTemplateForDigitalPrinter',
        },
        {
            iconSource: broadcast_notification_icon,
            icon: 'notifications-none',
            title: 'Broadcast Notifications',
            urlToPage: 'BroadcastNotification',
        },
        {
            iconSource: event_icon,
            icon: 'notifications-none',
            title: 'Event',
            urlToPage: 'EventCalender',
            rightIconSource : eventExpanded?up_arrow:down_arrow,
            expandedValueSource :[{
                iconSource: calender_icon,
                icon: 'notifications-none',
                title: 'Event Calender',
                urlToPage: 'EventCalender',
            },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'Create Event',
                    urlToPage: 'CreateNewEventScreen',
                }, {
                    iconSource: task_name_icon,
                    icon: 'notifications-none',
                    title: 'Allocate Task',
                    urlToPage: 'AllocateTaskForEvent',
                },
                {
                    iconSource: task_desc_icon,
                    icon: 'notifications-none',
                    title: 'My Task',
                    urlToPage: 'Volunteer',
                },]
        },
        {
            iconSource: volunteer_icon,
            icon: 'security',
            title: 'My Volunteers',
            urlToPage: 'AssignBoothToVounteer',
        },

        {
            iconSource: volunteer_request_icon,
            icon: 'security',
            title: 'Volunteer Requests',
            urlToPage: 'VolunteerListToChangeVoterDetails',
        },
        {
            iconSource: my_request_icon,
            icon: 'security',
            title: 'My Requests',
            urlToPage: 'VolunteerRequestStatus',
        },
        {
            iconSource: my_booth_icon,
            icon: 'security',
            title: 'My Booths',
            urlToPage: 'VolunteerBoothList',
        },

        {
            iconSource: password_icon,
            icon: 'security',
            title: 'Change Password',
            urlToPage: 'ChangePassword',
        },
        {
            iconSource: printer_icon,
            icon: 'security',
            title: 'Digital printer',
            urlToPage: 'DigitalPrinter',
            rightIconSourceForPrinter : printerExpanded?up_arrow:down_arrow,
            expandedValueSource :[
                {
                    iconSource: calender_icon,
                    icon: 'notifications-none',
                     title: 'Create Template',
                     urlToPage: 'DigitalPrinter',
                 },
                {
                    iconSource: create_event_icon,
                    icon: 'notifications-none',
                    title: 'My Template',
                    urlToPage: 'UserTemplateList',
                }
            ]
        },
        {
            iconSource: help_icon,
            icon: 'help',
            title: 'Help',
            urlToPage: 'TutorialToUseApp',
        },
        {
            iconSource: logut_icon,
            icon: 'logout',
            title: 'Logout',
            urlToPage: 'Login',
        },
    ];
    const isDrawerOpen = useIsDrawerOpen();
    let tempPreviousIndex = 0;
    useEffect(() => {
        // dispatch({type: LOADING, payload: false});
        if (props?.state?.index === 0) {
            temp = 0;
            // dispatch(setCurrentPageIndex(0));
        }
    }, []);
    const renderExpandableRow = (props, index) => {
        const {drawerRow, rowText} = style;
        const {title, urlToPage,iconSource,rightIconSource=false,expandedValueSource=null} = props;
        const onRowPress = async () => {
            props.navigation.navigate(urlToPage);
        };
        return (
            <View key={index}>
                <TouchableOpacity key={index} style={[drawerRow,{backgroundColor:color.lightGray,paddingLeft: wp(6)}]} onPress={onRowPress}>
                    <View
                        style={[
                            style.drawerContainer,
                        ]}>
                        <Image source={iconSource} style={{height:hp(3),width:hp(3)}}/>
                    </View>
                    <Text allowFontScaling={false} style={rowText}>
                        {title}
                    </Text>
                </TouchableOpacity>
                {index === DrawerItems.length && <View style={{flex: 1}} />}
            </View>
        );
    };

    const renderRow =  (data, index) => {
        const {drawerRow, rowText} = style;
        const {IconTag, icon, title, urlToPage,iconSource,rightIconSource=false,expandedValueSource=null,rightIconSourceForPrinter = null} = data.item;
        const onRowPress =  () => {
            if (rightIconSource) {
                setEventExpanded(!eventExpanded)
            } else if (rightIconSourceForPrinter) {
                setPrinterExpanded(!printerExpanded)
            }
            else {
                if (urlToPage === 'Login') {
                     AsyncStorage.removeItem('userLoginDetail')
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                        })
                    );
                } else if (urlToPage === 'NotificationList') {
                    props.navigation.navigate(urlToPage, {
                        notificationTitle: 'All Notifications',
                        notificationType: ALL,
                    });
                } else {
                    dispatch(setCurrentDrawerIndex(data?.index))
                    props.navigation.navigate(urlToPage);
                }
            }

            if (title === 'Logout') {
            }
            temp = index;
        };
        // console.log(data?.index,"---",currentIndex)
        return (
            <View key={index}>
                <TouchableOpacity key={index} style={[drawerRow,{backgroundColor:(rightIconSource || rightIconSourceForPrinter)?color.lightGray:color.white}]} onPress={onRowPress}>
                    <View
                        style={[
                            style.drawerContainer,
                            {backgroundColor:data?.index === currentIndex?color.gray:'transparent'}
                        ]}>
                        <Image source={iconSource} style={{height:hp(3),width:hp(3)}}/>
                    </View>
                    <Text allowFontScaling={false} style={rowText}>
                        {title}
                    </Text>
                    {rightIconSource &&
                    <TouchableOpacity onPress={()=>{
                        setEventExpanded(!eventExpanded)
                    }}>
                        <Image source={rightIconSource} style={{height: hp(2.5), width: hp(2.5),marginLeft: wp(24)}}/>
                    </TouchableOpacity>
                    }

                    {rightIconSourceForPrinter &&
                    <TouchableOpacity onPress={()=>{
                        setPrinterExpanded(!printerExpanded)
                    }}>
                        <Image source={rightIconSourceForPrinter} style={{height: hp(2.5), width: hp(2.5),marginLeft: wp(10)}}/>
                    </TouchableOpacity>
                    }
                </TouchableOpacity>

                {rightIconSource && expandedValueSource !==null && eventExpanded &&
                expandedValueSource.map((item, index) =>
                    renderExpandableRow({...props, ...item}, index)
                )}

                {rightIconSourceForPrinter && expandedValueSource !== null && printerExpanded &&
                expandedValueSource.map((item, index) =>
                    renderExpandableRow({...props, ...item}, index)
                )}
                {index === DrawerItems.length && <View style={{flex: 1}} />}
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{flex: 1, overflow: 'hidden', backgroundColor: color.themePurple}}
            forceInset={{top: 'always', bottom: 'never'}}>
            <View
                style={{
                    ...center,
                    paddingVertical: wp(2),
                    paddingHorizontal: wp(2),
                    backgroundColor: color.themePurple,
                }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        props.navigation.navigate('EditProfilePage');
                    }}>
                    <View style={{marginTop:isANDROID?hp(5):0}}>
                        {userDetails !== null && userDetails?.profileImage !== null ? (
                            <Image
                                style={style.drawerImage}
                                resizeMode={'cover'}
                                source={{
                                    uri: userDetails?.profileImage,
                                }}
                            />
                        ) : (
                            <Image
                                style={style.drawerImage}
                                source={
                                    defaultUserMaleImage
                                }
                            />
                        )}
                        {/*<View style={style.editIcon}>*/}
                        {/*    <Image source={pencil_icon} style={{height:wp(4),width:wp(4)}}/>*/}
                        {/*</View>*/}
                    </View>
                </TouchableOpacity>

                <Text allowFontScaling={false} style={headerText} adjustsFontSizeToFit numberOfLines={1}>
                    {userDetails?.name}
                </Text>
            </View>
            <View style={{flex: 1, backgroundColor: color.white, paddingVertical: hp(2)}}>
                <FlatList
                    numColumns={1}
                    data={userDetails?.role === ADMIN ?DrawerItemsForAdmin:
                        userDetails?.role === VOLUNTEER?DrawerItemsForVolunteerUsers:
                        DrawerItemsForNormalUsers}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={true}
                    renderItem={renderRow}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    headerText: {
        fontSize: normalize(16),
        fontFamily: font.robotoBold,
        marginTop: hp(2),
        color: color.white,
    },
    drawerRow: {
        backgroundColor: color.white,
        flexDirection: 'row',
        marginTop: hp(0.5),
        ...center,
        justifyContent: 'flex-start',
    },
    rowText: {
        color: color.blue,
        fontSize: normalize(14),
        fontFamily: font.robotoRegular,
        marginLeft: wp(5),
    },
    editIcon: {
        position: 'absolute',
        bottom: -8,
        right: -5,
        backgroundColor: color.lightBlue,
        padding: wp(2.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(12.5),
    },
    drawerContainer: {
        paddingLeft: wp(6),
        paddingRight: wp(3),
        marginVertical: hp(0.3),
        paddingVertical: hp(0.8),
        borderBottomRightRadius: wp(5),
        borderTopRightRadius: wp(5),
    },
    drawerImage: {
        height: wp(10),
        width: wp(10),
        borderRadius: wp(5),
        borderWidth: hp(1.5),
        backgroundColor: color.lightGray,
        borderColor: color.lightBlue,
    },
});
