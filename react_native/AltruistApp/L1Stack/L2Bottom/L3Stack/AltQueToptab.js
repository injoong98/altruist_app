import React from 'react';
import {StyleSheet,SafeAreaView} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';

import {TopBarTune} from '../../../components/TopBarTune'
import {TopTab} from '../../../components/TopTab'

import {AltQueList} from './Question'

const { Navigator, Screen } = createMaterialTopTabNavigator();
const AltQueListSend = (props) => (
            <SafeAreaView>
               <AltQueList {...props} type='indi' scndType='send'/>
            </SafeAreaView>
)
const AltQueListRecieve = (props) => (
            <SafeAreaView>
               <AltQueList {...props} type='indi' scndType='recieve'/>
            </SafeAreaView>
)
const TopTabBar = ({ navigation, state }) => (
    <TabBar
      selectedIndex={state.index}
      onSelect={index => {navigation.navigate(state.routeNames[index]);console.log(state.index)}}
      style={{paddingVertical:15}}
    >
    <Tab title={evaProps => <Text category='h1'>보낸 질문</Text>}/>
    <Tab title={evaProps => <Text category='h1'>받은 질문</Text>}/>
  </TabBar>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <TopTabBar {...props} />}>
    <Screen name='Send' component={AltQueListSend}/>
    <Screen name='Recieve' component={AltQueListRecieve}/>
  </Navigator>
);

export const AltQueToptab= ({navigation}) => (
  <>
    {/* <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/> */}
    <TopBarTune text="나의 질문" func={()=>navigation.navigate('Meet')} gbckuse={true} gbckfunc={()=>navigation.goBack()}/>
    <TabNavigator/>
  </>
);

const styles = StyleSheet.create({
})