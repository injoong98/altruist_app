import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';

import {AlbaScreen} from './AlbaScreen'
import {CommunityScreen} from './CommunityScreen'
import {GominScreen} from './GominScreen'
import {JauScreen} from './JauScreen'
import {MarketScreen} from './MarketScreen'
const { Navigator, Screen } = createMaterialTopTabNavigator();


const TopTabBar = ({ navigation, state }) => (
  <TabBar
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <Tab title='메인'/>
    <Tab title='일반'/>
    <Tab title='고민'/>
    <Tab title='수수마켓'/>
    <Tab title='알바천일국'/>
  </TabBar>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <TopTabBar {...props} />}>
    <Screen name='Main' component={CommunityScreen}/>
    <Screen name='Jau' component={JauScreen}/>
    <Screen name='Gomin' component={GominScreen}/>
    <Screen name='Market' component={MarketScreen}/>
    <Screen name='Alba' component={AlbaScreen}/>
  </Navigator>
);

export const ComToptabNav= () => (
  <>
    <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/>
    <TabNavigator/>
  </>
);