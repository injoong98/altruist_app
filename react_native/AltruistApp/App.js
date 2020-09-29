/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React,{useEffect} from "react";
import {StatusBar,Alert,} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import * as eva from '@eva-design/eva';
import { NavigationContainer } from "@react-navigation/native";
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {StackNav} from "./L1Stack/StackNav";
import { AppIconsPack } from './app-icons-pack';
import { default as customtheme } from './custom-theme.json';
import { default as mapping } from './mapping.json';
import {AltIconsPack} from './alt-icons';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
const App = () => {
  StatusBar.setBackgroundColor('#B09BDE');

  useEffect(() => {
    messaging().onTokenRefresh(async(token)=>{
      var formdata = new FormData();
      var mem_id =await AsyncStorage.getItem('currentMemId');
        formdata.append('token',token);
        formdata.append('mem_id',mem_id);
        console.log(mem_id)
        await axios.post('http://dev.unyict.org/api/login/sync_push_token',formdata)
        .then(res=>{
            console.log('token refresh success!')
        })
        .catch(err=>{
            console.log('token refresh failure!')
        })
    })
    
  }, []);


  return (
  <>
    <IconRegistry icons={[EvaIconsPack,AltIconsPack]} />
    <ApplicationProvider 
      {...eva} 
      theme={{...eva.light,...customtheme}}
      customMapping={mapping}>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </ApplicationProvider>
</>

  );
}
export default App