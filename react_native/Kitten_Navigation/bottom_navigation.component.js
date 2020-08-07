/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon, Layout, Text
} from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator, Screen } = createBottomTabNavigator();


import {AltruistScreens} from './altruists.component';
import {CoummunityScreens} from './coummunity.component';
import {MessagesScreens} from './messages.component';
import {MypageScreens} from './mypage.component';
 

//icon defines
const AltsIcon = (props) => <Icon {...props} name="star" />;
const ComuIcon = (props) => <Icon {...props} name="layout-outline" />;
const MesgIcon = (props) => <Icon {...props} name="flash-outline" />;
const MypgIcon = (props) => <Icon {...props} name="person-outline" />;


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


 const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='atruists' component={AltruistScreens}/>
     <Screen name='coummunity'  component={CoummunityScreens}/>
    <Screen name='messages' component={MessagesScreens}/>
    <Screen name='mypage' component={MypageScreens}/> 
  </Navigator>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});


export const TapNavigator = () => (
    <NavigationContainer>
      <TabNavigator/>
    </NavigationContainer>
  );