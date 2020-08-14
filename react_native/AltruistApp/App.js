/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from "react";
import * as eva from '@eva-design/eva';
import { NavigationContainer } from "@react-navigation/native";
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {StackNav} from "./L1Stack/StackNav";
import { AppIconsPack } from './app-icons-pack';

 const App = () => {
  return (
  <>
    <IconRegistry icons={[EvaIconsPack,AppIconsPack]} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </ApplicationProvider>
</>

  );
}
export default App