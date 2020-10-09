/**
 * @format
 */

import {AppRegistry,Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';


const authStatus = Platform.OS=='ios'? await messaging().requestPermission() : null

messaging()
    .subscribeToTopic('weather')
    .then(() => console.log('Subscribed to topic!'));
  
messaging().setBackgroundMessageHandler(async remoteMessage => {
    
    console.log('Message handled in the background!', remoteMessage);
  });


AppRegistry.registerComponent(appName, () => App);
