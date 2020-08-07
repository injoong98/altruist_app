/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './home.component';
import {DetailsScreen} from './details.component';

const {Navigator, Screen} = createStackNavigator();

const HomeNavigator = () => (
  <Navigator headerMode="none">
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Details" component={DetailsScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);

/*
With the code above we used createStackNavigator function to create stack navigation between Home and Details screens. 
We also used NavigationContainer component to create AppNavigator - the root component of your app.

Now, the one thing we have to do is to render AppNavigator.
*/