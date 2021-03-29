import React from 'react';
import {View,Text} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppHeader, Loading} from "../common";
import {GoBackHeader} from "../common";


const SurveyVoterList = props => {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.appDefaultSettingReducer.isLoading);
    return (
        <View style={{flex: 1,}}>
            <GoBackHeader
                title={'Back'}
                onMenuPress={() => {
                    props.navigation.goBack()
                }}
            />
            {isLoading && <Loading isLoading={isLoading} />}
        </View>
    );
};

export default SurveyVoterList;
