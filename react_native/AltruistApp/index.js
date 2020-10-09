/**
 * @format
 */

import {AppRegistry,Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';


async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}
Platform.OS==='ios' ? 
requestUserPermission()
:
null  
messaging().setBackgroundMessageHandler(async remoteMessage => {
    
    console.log('Message handled in the background!', remoteMessage);
  });


AppRegistry.registerComponent(appName, () => App);
