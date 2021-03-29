import React, { useState, useRef} from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import {AppHeader} from '../common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
    hp,
    wp
} from '../../helper/themeHelper';

import GeneralMsg from './GeneralMsg';
import Event from './EventNotify';
import News from './NewsNotify'
import VoteAppeal from './VoteAppeal'

const NotificationTypes = [GeneralMsg,Event,News,VoteAppeal];
const BroadcastNotification = props => {
    const [openItemIndex, setOpenItemIndex] = useState(0)
    const [limitList, setLimitList] = useState([]);
    const flatlistRef = useRef(null);
    const scrollToIndex = index => {
        setTimeout(() => {
            flatlistRef.current.scrollToIndex({
                animated: true,
                index: index,
                viewOffset: 0,
                viewPosition: 0,
            });
        }, 100);
    };
    const openDrawer = () => {
        props.navigation.openDrawer();
    };
    const _setOpenItemIndex = async (value, index) => {
        await setOpenItemIndex(value);
        scrollToIndex(index);
    };
    const _RenderItem = ({item, index}) => {
        let RenderComponent = item;
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                extraScrollHeight={hp(8)}>
                <View style={{flex: 1}}>
                    <RenderComponent
                        _setOpenItemIndex={_setOpenItemIndex}
                        openItemIndex={openItemIndex}
                        index={index}
                        limitList={limitList}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    };

    return (
        <View style={{flex: 1}}>
            <AppHeader title={'Broadcast Notifications'} onMenuPress={() => openDrawer()} />
            <View
                style={{
                    flex: 1,
                    marginHorizontal: wp(5),
                    marginTop: hp(1.5),
                }}>
                <FlatList
                    ref={flatlistRef}
                    horizontal={false}
                    data={NotificationTypes}
                    showsVerticalScrollIndicator={false}
                    renderItem={_RenderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};
export default BroadcastNotification
