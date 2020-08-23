/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from "react";
import {StatusBar} from "react-native";
import * as eva from '@eva-design/eva';
import { NavigationContainer } from "@react-navigation/native";
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {StackNav} from "./L1Stack/StackNav";
import { AppIconsPack } from './app-icons-pack';
import { default as customtheme } from './custom-theme.json';
import { default as mapping } from './mapping.json';

const App = () => {
  StatusBar.setBackgroundColor('#B09BDE')
  return (
  <>
    <IconRegistry icons={[EvaIconsPack,AppIconsPack]} />
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