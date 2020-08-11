import React from'react';
import {createBottomTabNavigator}from '@react-navigation/bottom-tabs'
import {ComToptanNav} from './L3Toptab/ComToptabNav'

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,BottomNavigationTab,BottomNavigation} from '@ui-kitten/components'

const {Navigator,Screen} = createBottomTabNavigator();

const SpareScreen =({navigation}) =>(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="스페어" alignment="center" /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>스페어</Text>
            <Button onPress={()=>{navigation.goBack()}}>뒤로가기</Button>
            <Button onPress = {()=>{navigation.navigate('Write')}}>글작성</Button>
        </Layout>   
    </SafeAreaView>
)

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='홈'/>
      <BottomNavigationTab title='잍자'/>
      <BottomNavigationTab title='커뮤니티'/>
      <BottomNavigationTab title='알림?'/>  
      <BottomNavigationTab title='프로필'/>
    </BottomNavigation>
  );


export const ComBottomNav = () =>(
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name = "Home" component={SpareScreen}/>
        <Screen name = "Alt" component={SpareScreen}/>
        <Screen name = "Commu" component={ComToptanNav}/>
        <Screen name = "Meet" component={SpareScreen}/>
        <Screen name = "Prof" component={SpareScreen}/>
    </Navigator>
)
