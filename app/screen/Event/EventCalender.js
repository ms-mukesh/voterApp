import _ from 'lodash';
import React, {useEffect,useState} from 'react';
import {Platform, Alert, StyleSheet, View, Text, TouchableOpacity, Button} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import {AppButton, AppHeader} from "../common";
import {useDispatch, useSelector} from "react-redux";
import {fetchEventInformation} from "../../redux/actions/eventActions";
import {hp, wp,normalize,color} from "../../helper/themeHelper";
import moment from "moment";

// const testIDs = require('../testIDs');

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3);
const futureDates = getFutureDates(9);
const dates = [fastDate, today].concat(futureDates);
const themeColor = '#00AAAF';
const lightThemeColor = '#EBF9F9';

function getFutureDates(days) {
    const array = [];
    for (let index = 1; index <= days; index++) {
        const date = new Date(Date.now() + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
        const dateString = date.toISOString().split('T')[0];
        array.push(dateString);
    }
    return array;
}

function getPastDate(days) {
    return new Date(Date.now() - 864e5 * days).toISOString().split('T')[0];
}

const ITEMS = [
    {title: dates[0], data: [{hour: '12am', duration: '1h', title: 'First Yoga'}]},
    {
        title: dates[1],
        data: [
            {hour: '4pm', duration: '1h', title: 'Pilates ABC'},
            {hour: '5pm', duration: '1h', title: 'Vinyasa Yoga'}
        ]
    },
    {
        title: dates[2],
        data: [
            {hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'},
            {hour: '2pm', duration: '1h', title: 'Deep Streches'},
            {hour: '3pm', duration: '1h', title: 'Private Yoga'}
        ]
    },
    {title: dates[3], data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
    {title: dates[4], data: [{}]},
    {
        title: dates[5],
        data: [
            {hour: '9pm', duration: '1h', title: 'Middle Yoga'},
            {hour: '10pm', duration: '1h', title: 'Ashtanga'},
            {hour: '11pm', duration: '1h', title: 'TRX'},
            {hour: '12pm', duration: '1h', title: 'Running Group'}
        ]
    },
    {title: dates[6], data: [{hour: '12am', duration: '1h', title: 'Ashtanga Yoga'}]},
    {title: dates[7], data: [{}]},
    {
        title: dates[8],
        data: [
            {hour: '9pm', duration: '1h', title: 'Pilates Reformer'},
            {hour: '10pm', duration: '1h', title: 'Ashtanga'},
            {hour: '11pm', duration: '1h', title: 'TRX'},
            {hour: '12pm', duration: '1h', title: 'Running Group'}
        ]
    },
    {
        title: dates[9],
        data: [
            {hour: '1pm', duration: '1h', title: 'Ashtanga Yoga'},
            {hour: '2pm', duration: '1h', title: 'Deep Streches'},
            {hour: '3pm', duration: '1h', title: 'Private Yoga'}
        ]
    },
    {title: dates[10], data: [{hour: '12am', duration: '1h', title: 'Last Yoga'}]}
];

const EventCalender = (props)=> {
    const dispatch = useDispatch()
    let tempMarkDate = {}
    let tempCalenderItem = []
    const [markedDates , setMarkedDate] = useState({})
    const [calenderItem,setCalenderItem] = useState([])
    // const []
    const EventInformation = useSelector(state => state.eventInformationReducer.eventsOfNotification);
    useEffect(()=>{
        dispatch(fetchEventInformation()).then((res)=>{
        })
    },[])

    useEffect(()=>{
        EventInformation.length > 0 &&
            EventInformation.map((eventData)=>{
                console.log(eventData?.EventDate)
                tempMarkDate = {...tempMarkDate,[moment(new Date(parseInt(eventData?.EventDate)).toDateString()).format("YYYY-MM-DD").toString()]:{
                        selected: true, endingDay: true,dotColor: 'red', color: color.themePurple, textColor: 'gray'
                    }}
                    tempCalenderItem.push({title: moment(new Date(parseInt(eventData?.EventDate)).toDateString()).format("YYYY-MM-DD"), data: [{hour: moment(new Date(parseInt(eventData?.EventDate))).format('hh:mm A'), title: eventData?.EventName,description : eventData?.Description}]})
            })
        setMarkedDate(tempMarkDate)
        setCalenderItem(tempCalenderItem)
    },[EventInformation])

    const onDateChanged = (/* date, updateSource */) => {
        // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
        // fetch and set data for date + week ahead
    };

    const onMonthChange = (/* month, updateSource */) => {
        // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    };

    const buttonPressed = () => {
        Alert.alert('show more');
    }

    const itemPressed = (id)=> {
        Alert.alert(id);
    }

    const renderEmptyItem = () => {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned</Text>
            </View>
        );
    }

    const renderItem = ({item}) => {
        if (_.isEmpty(item)) {
            return renderEmptyItem();
        }

        return (
            <TouchableOpacity onPress={() => itemPressed(item.title)} style={styles.item} >
                <View>
                    <Text style={styles.itemHourText}>{item.hour}</Text>
                    <Text style={styles.itemDurationText}>{item.duration}</Text>
                </View>
                <View style={{flexDirection:'column'}}>
                <Text style={styles.itemTitleText}>{item.title}</Text>
                <Text style={[styles.itemTitleText,{fontWeight: '200',width:wp(70)}]}>{item.description}</Text>
                </View>

                {/*<View style={styles.itemButtonContainer}>*/}
                {/*    <Text style={[styles.itemTitleText,{marginRight:wp(10),fontSize:normalize(10),marginTop:hp(-1.5)}]}>Ends On</Text>*/}
                {/*    <AppButton title={item.endDate + ' '} containerStyle={{marginLeft:wp(25),height: hp(5),width:wp(30)}} onPress={buttonPressed} />*/}

                {/*</View>*/}
            </TouchableOpacity>
        );
    };

    const getMarkedDates = () => {
        const marked = {};
        calenderItem.length > 0 && calenderItem.forEach(item => {
            // NOTE: only mark dates with data
            if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
                marked[item.title] = {marked: true};
            } else {
                marked[item.title] = {disabled: true};
            }
        });
        return marked;
    };

    const getTheme = () => {
        const disabledColor = 'grey';

        return {
            // arrows
            arrowColor: 'black',
            arrowStyle: {padding: 0},
            // month
            monthTextColor: 'black',
            textMonthFontSize: 16,
            textMonthFontFamily: 'HelveticaNeue',
            textMonthFontWeight: 'bold',
            // day names
            textSectionTitleColor: 'black',
            textDayHeaderFontSize: 12,
            textDayHeaderFontFamily: 'HelveticaNeue',
            textDayHeaderFontWeight: 'normal',
            // dates
            dayTextColor: themeColor,
            textDayFontSize: 18,
            textDayFontFamily: 'HelveticaNeue',
            textDayFontWeight: '500',
            textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
            // selected date
            selectedDayBackgroundColor: themeColor,
            selectedDayTextColor: 'white',
            // disabled date
            textDisabledColor: disabledColor,
            // dot (marked date)
            dotColor: themeColor,
            selectedDotColor: 'white',
            disabledDotColor: disabledColor,
            dotStyle: {marginTop: -2}
        };
    };

        return (
            <View style={{flex:1}}>
                <AppHeader
                    title={'Event Calender'}
                    onMenuPress={() => {
                        props.navigation.openDrawer()
                    }}
                />
            <CalendarProvider
                date={calenderItem.length>0 && calenderItem[0].title}
                onDateChanged={onDateChanged}
                onMonthChange={onMonthChange}
                showTodayButton
                disabledOpacity={0.6}
                // theme={{
                //   todayButtonTextColor: themeColor
                // }}
                // todayBottomMargin={16}
            >
                {props.weekView ? (
                    <WeekCalendar  firstDay={1} markedDates={getMarkedDates()} />
                ) : (
                    <ExpandableCalendar

                        // horizontal={false}
                        // hideArrows
                        // disablePan
                        // hideKnob
                        // initialPosition={ExpandableCalendar.positions.OPEN}
                        // calendarStyle={styles.calendar}
                        // headerStyle={styles.calendar} // for horizontal only
                        // disableWeekScroll
                        // theme={this.getTheme()}
                        disableAllTouchEventsForDisabledDays
                        firstDay={1}
                        markedDates={markedDates} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
                        // leftArrowImageSource={require('../img/previous.png')}
                        // rightArrowImageSource={require('../img/next.png')}
                    />
                )}
                <AgendaList
                    sections={calenderItem.length>0 && calenderItem}
                    // extraData={state}
                    renderItem={renderItem}
                    // sectionStyle={styles.section}
                />
            </CalendarProvider>
            </View>
        );

}

const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize'
    },
    item: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        flexDirection: 'row'
    },
    itemHourText: {
        color: 'black'
    },
    itemDurationText: {
        color: 'grey',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4
    },
    itemTitleText: {
        color: 'black',
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 16
    },
    itemButtonContainer: {
        flex: 1,
        alignItems: 'flex-end'
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    }
});
export default EventCalender
