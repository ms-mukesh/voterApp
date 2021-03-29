import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {View, Modal, Text} from 'react-native';
import {hp,color,isANDROID,isIOS,wp} from "../../helper/themeHelper";
import Moment from 'moment';
let tempCurrentDate = '';

const DatePickerModel = props => {
  const {isShow, _setIsShowDatePicker, dateForDatePicker, _setDateFromKey, mode} = props;
  const [date, setDate] = useState(new Date(dateForDatePicker));
  const [timepickerFlag, setTimePickerFlag] = useState(false);
  let pickerMode = 'date';
  if (typeof mode !== 'undefined') {
    pickerMode = mode;
  } else {
    pickerMode = 'date';
  }

  if (isANDROID && isShow && !timepickerFlag) {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={date => {
            if (date.type != 'dismissed') {
              if (pickerMode === 'datetime' && date.type === 'set') {
                tempCurrentDate = Moment(date.nativeEvent.timestamp);
                setTimePickerFlag(true);
              }
              pickerMode === 'date'
                ? _setDateFromKey(Moment(date.nativeEvent.timestamp).format('YYYY-MM-DD'))
                : _setDateFromKey(Moment(date.nativeEvent.timestamp), false);
              _setIsShowDatePicker(false);
            } else {
              _setIsShowDatePicker(false);
            }
          }}
          minimumDate={new Date()}
        />
      </View>
    );
  } else if (isANDROID && isShow && timepickerFlag) {
    return (
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'time'}
          is24Hour={false}
          display="clock"
          onChange={date => {
            if (date.type != 'dismissed') {
              if (pickerMode === 'datetime' && date.type === 'set') {
                let temp = Moment(date.nativeEvent.timestamp);
                let tempDate = new Date(tempCurrentDate);
                let tempTime = new Date(temp);
                tempDate = tempDate.toString().substring(0, 15);
                tempTime = tempTime.toString().substring(16, tempTime.toString().length);
                let tempFinalDate = tempDate + ' ' + tempTime;
                _setDateFromKey(Moment(new Date(tempFinalDate.toString()).getTime()), true);
              } else {
                _setDateFromKey(Moment(date.nativeEvent.timestamp), false);
              }
              _setIsShowDatePicker(false);
            } else {
              _setIsShowDatePicker(false);
            }
          }}
        />
      </View>
    );
  }

  if (isShow && isIOS) {
    return (
      <Modal
        transparent={'true'}
        style={{flex: 1, bottom: 0}}
        onRequestClose={() => this.setState({isDateTimePickerVisible: false})}>
        <View style={{backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-end'}}>
          <View style={{height: '30%', backgroundColor: '#FFF', borderTopWidth: 0.0025}}>
            <View style={{flexDirection: 'row-reverse'}}>
              <Text allowFontScaling={false}
                onPress={() => {
                  pickerMode === 'date'
                    ? _setDateFromKey(Moment(date).format('YYYY-MM-DD'))
                    : _setDateFromKey(date);
                  _setIsShowDatePicker(false);
                }}
                style={{
                  color: color.blue,
                  fontSize: 20,
                  marginHorizontal: 10,
                }}>
                Done
              </Text>
            </View>
            <DateTimePicker
              textColor={'#000'}
              testID="dateTimePicker"
              value={date}
              mode={pickerMode}
              is24Hour={true}
              onChange={(_, date) => {
                setDate(date);
              }}
              minimumDate={new Date()}
            />
          </View>
        </View>
      </Modal>
    );
  }
};

export default DatePickerModel;
