import React from 'react';
import {StyleSheet,SafeAreaView,View,TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';

import {TopBarTune} from '../../../components/TopBarTune'
import {MyTabBar} from '../../../components/TopTab'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import {AltQueList} from './Question'
import Animated from 'react-native-reanimated';
const { Navigator, Screen } = createMaterialTopTabNavigator();
const AltQueListSend = (props) => (
            <SafeAreaView style={{flex:1}}>
               <AltQueList {...props} type='indi' scndType='send'/>
            </SafeAreaView>
)
const AltQueListRecieve = (props) => (
            <SafeAreaView style={{flex:1}}>
               <AltQueList {...props} type='indi' scndType='recieve'/>
            </SafeAreaView>
)



const TabNavigator = () => (
  <Navigator tabBar={props => <MyTabBar {...props} />}>
    <Screen name='Send' component={AltQueListSend} options={ {title:'보낸 질문'}}/>
    <Screen name='Recieve' component={AltQueListRecieve}  options={{title:'받은 질문'}}/>
  </Navigator>
);

export const AltQueToptab= ({navigation}) => (
  <SafeAreaView style={{flex:1}}>
    {/* <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/> */}
      <WriteContentToptab
          text='1대1 질문'
          gbckfunc={() => {
              navigation.goBack();
          }}
          gbckuse={true}
          style={{backgroundColor:'#f4f4f4'}}
      />
      <TabNavigator/>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  indicatorStyle:{
    height:0
  },
  tabtext:{
    fontSize:15
  }
})