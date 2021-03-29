import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProjectApp from './app/navigation/index'
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import MainReducer from './app/redux/reducer';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import { AsyncStorage } from 'react-native';
import * as Font from "expo-font";
import storage from 'redux-persist/lib/storage';
import {isANDROID,isWEB} from "./app/helper/themeHelper";
const PERSIST_CONFIG = {
  key: 'root',
  storage: isWEB?storage:AsyncStorage
};

const PERSIST_REDUCER = persistReducer(PERSIST_CONFIG, MainReducer);
const STORE = createStore(PERSIST_REDUCER, applyMiddleware(thunk));
let PERSIST_STORE = persistStore(STORE);
const App=  () => {
  return (
      <>
        <StatusBar style="auto" />
        {isWEB? <Provider store={STORE}>
              <View style={styles.container}>
                <ProjectApp/>
              </View>
            </Provider>
            :
            <Provider store={STORE}>
              <PersistGate loading={null} persistor={PERSIST_STORE}>
                <ProjectApp/>
              </PersistGate>
            </Provider>
        }

      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,


  },
});
export default App;
