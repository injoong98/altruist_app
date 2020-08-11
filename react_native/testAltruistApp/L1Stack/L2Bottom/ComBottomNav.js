import React from'react';
import {createBottomTabNavigator}from '@react-navigation/bottom-tabs'
import {ComToptanNav} from './L3Toptab/ComToptabNav'

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,BottomNavigationTab,BottomNavigation} from '@ui-kitten/components'

const {Navigator,Screen} = createBottomTabNavigator();

const spareScreen =({navigation}) =>(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="스페어" alignment="center" /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>스페어</Text>
            <Button onPress={()=>{navigation.goBack()}}>뒤로가기</Button>
            <Button onPress = {()=>{navigation.navigate('Alt')}}>글작성</Button>
        </Layout>   
    </SafeAreaView>
)

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='HOME'/>
      <BottomNavigationTab title='ALTRUISTS'/>
      <BottomNavigationTab title='COUMMUNITY'/>
      <BottomNavigationTab title='Meet'/>  
      <BottomNavigationTab title='MYPAGE'/>
    </BottomNavigation>
  );


export const ComBottomNav = () =>(
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name = "Home" component={spareScreen}/>
        <Screen name = "Alt" component={spareScreen}/>
        <Screen name = "Commu" component={ComToptanNav}/>
        <Screen name = "Meet" component={spareScreen}/>
        <Screen name = "Prof" component={spareScreen}/>
    </Navigator>
)
