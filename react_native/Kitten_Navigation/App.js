
import React from "react";
import * as eva from '@eva-design/eva';
import { NavigationContainer } from "@react-navigation/native";
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import BottomTabNavigator from "./navigator/TabNavigator";

 const App = () => {
  return (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </ApplicationProvider>
</>

  );
}
export default App