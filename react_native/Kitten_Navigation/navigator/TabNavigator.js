import React from "react";
import {StyleSheet} from 'react-native';
import {BottomNavigation,  BottomNavigationTab,  Icon, Layout, Text} from '@ui-kitten/components';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Stack Navigation screens 
import {  AltruistsNavigator } from "./StackNavigator";

//seperate pages
import {CoummunityScreens} from '../screens/coummnity/coummunity.component';
import {MessagesScreens} from '../screens/messages/messages.component';
import {MypageScreens} from '../screens/mypage/mypage.component';

//icon defines
const AltsIcon = (props) => <Icon {...props} name="star" />;
const ComuIcon = (props) => <Icon {...props} name="layout-outline" />;
const MesgIcon = (props) => <Icon {...props} name="flash-outline" />;
const MypgIcon = (props) => <Icon {...props} name="person-outline" />;

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab icon={AltsIcon} title='ALTRUISTS'/>
  <BottomNavigationTab icon={ComuIcon} title='COUMMUNITY'/>
    <BottomNavigationTab icon={MesgIcon} title='MESSAGES'/>
    <BottomNavigationTab icon={MypgIcon} title='MYPAGE'/>  
  </BottomNavigation>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="atruists" component={AltruistsNavigator} />
      <Tab.Screen name='coummunity'  component={CoummunityScreens}/>
      <Tab.Screen name='messages' component={MessagesScreens}/>
      <Tab.Screen name='mypage' component={MypageScreens}/>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

export default BottomTabNavigator;