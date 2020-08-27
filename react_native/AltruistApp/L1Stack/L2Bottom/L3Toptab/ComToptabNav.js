import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';

import {TopBarTune} from '../../../components/TopBarTune'
import {TopTab} from '../../../components/TopTab'

import {AlbaScreen} from './AlbaScreen'
import {CommunityScreen} from './CommunityScreen'
import {GominScreen} from './GominScreen'
import {JauScreen} from './JauScreen'
import {MarketScreen} from './MarketScreen'
const { Navigator, Screen } = createMaterialTopTabNavigator();


const TopTabBar = ({ navigation, state }) => (
  <TabBar
      selectedIndex={state.index}
      onSelect={index => {navigation.navigate(state.routeNames[index]);console.log(state.index)}}
    >
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h2" abovetext="COMM" belowtext="UNITY" selected={state.index+1} thisindex ={1}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="자유" belowtext="게시판" selected={state.index+1} thisindex ={2}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="고민" belowtext="있어요" selected={state.index+1} thisindex ={3}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h2" abovetext="수수" belowtext="마켓"   selected={state.index+1} thisindex ={4}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="알바" belowtext="천일국" selected={state.index+1} thisindex ={5}/> }/>
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
    {/* <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/> */}
    <TopBarTune text="COMMUNITY" func={()=>navigation.navigate('Meet')} />

    <TabNavigator/>
  </>
);