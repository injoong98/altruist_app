/* eslint-disable prettier/prettier */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

/* import Home from "../screens/Home";
import About from "../screens/About";
import Contact from "../screens/Contact"; */

import {HomeScreen} from '../home.component';
import {DetailsScreen} from '../details.component';
import {Contact} from '../details.component';

//altruists sub menu
import {AltruistHomeScreen} from '../screens/altruists/home.altruists';
import {AltruistApplicationScreen} from '../screens/altruists/application.altruists';
import {AltruistSearchScreen} from '../screens/altruists/search.altruists';
import {AltruistQuestionScreen} from '../screens/altruists/question.altruists';
import {AltruistAnswerScreen} from '../screens/altruists/answer.altruists';
import {AltruistReviewScreen} from '../screens/altruists/review.altruists';
 
const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const AltruistsNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={AltruistHomeScreen} />
      <Stack.Screen name="application" component={AltruistApplicationScreen} />
      <Stack.Screen name="search" component={AltruistSearchScreen} />
      <Stack.Screen name="question" component={AltruistQuestionScreen} />
      <Stack.Screen name="answer" component={AltruistAnswerScreen} />
      <Stack.Screen name="review" component={AltruistReviewScreen} />
    </Stack.Navigator>
  );
}

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home1" component={HomeScreen} />
      <Stack.Screen name="About" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator, ContactStackNavigator,AltruistsNavigator };

