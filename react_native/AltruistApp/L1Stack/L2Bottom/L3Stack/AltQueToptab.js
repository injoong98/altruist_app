import React from 'react';
import {StyleSheet,SafeAreaView,View,TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text,TopNavigation,Button } from '@ui-kitten/components';
import {TopBarTune} from '../../../components/TopBarTune'
import {MyTabBar,TopTab} from '../../../components/TopTab'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import {AltQueList,AltOpqQueList} from './Question'
import Animated from 'react-native-reanimated';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const AltQueListOpen = (props) => (
            <SafeAreaView style={{flex:1}}>
               <AltQueList {...props} type='opq'/>
            </SafeAreaView>
)
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

const TopTabBar = ({ navigation, state }) => (
  <TabBar
      selectedIndex={state.index}
      onSelect={index => {navigation.navigate(state.routeNames[index]);console.log(state.index)}}
      indicatorStyle={styles.indicatorStyle}
    >
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="오픈" belowtext="질   문" selected={state.index} thisindex ={0}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="보낸" belowtext="질   문" selected={state.index} thisindex ={1}/> }/>
    <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="받은" belowtext="질   문"   selected={state.index} thisindex ={2}/> }/>
  </TabBar>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <TopTabBar {...props} />}>
    <Screen name='Open' component={AltQueListOpen} options={ {title:'오픈 질문'}}/>
    <Screen name='Send' component={AltQueListSend} options={ {title:'보낸 질문'}}/>
    <Screen name='Recieve' component={AltQueListRecieve}  options={{title:'받은 질문'}}/>
  </Navigator>
);

export const AltQueToptab= ({navigation}) => (
  <SafeAreaView style={{flex:1}}>
    {/* <TopNavigation title ="Community" alignment ='center' style={{backgroundColor : '#B09BDE'}}/> */}
      {/* <WriteContentToptab
          text='1대1 질문'
          gbckfunc={() => {
              navigation.goBack();
          }}
          gbckuse={true}
          style={{backgroundColor:'#f4f4f4'}}
      /> */}
    <TopBarTune text="질문" func={()=>navigation.navigate('Meet')} />

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