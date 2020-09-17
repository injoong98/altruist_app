/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React,{useEffect} from "react";
import {StatusBar,Alert} from "react-native";
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
const App = () => {
  StatusBar.setBackgroundColor('#B09BDE');
  useEffect(() => {
    messaging()
    .subscribeToTopic('weather')
    .then(() => console.log('Subscribed to topic!'));
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
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