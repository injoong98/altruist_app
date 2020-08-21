import React from 'react';
import {createBottomTabNavigator}from '@react-navigation/bottom-tabs';
import {ComToptabNav} from './L3Toptab/ComToptabNav';
import {AltStackNav} from './L3Stack/AltStackNav';

import {SafeAreaView,View} from 'react-native';
import {Layout,Text,TopNavigation,Button,BottomNavigationTab,BottomNavigation} from '@ui-kitten/components';

import ToggleTune from './ToggleTune';
import LoginScreen from './Login'

const {Navigator,Screen} = createBottomTabNavigator();

const ToggleScreen=()=>(
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <ToggleTune />
    </View>

)

const FontScreen =() =>(
    <SafeAreaView style={{flex:1,backgroundColor : ""}}>
        <TopNavigation title="스페어" alignment="center"/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text category="h1">Heading1 더불어 사는 이타주의자</Text>
            <Text category="h2">Heading2 더불어 사는 이타주의자</Text>
            <Text category="h3">Heading3 더불어 사는 이타주의자</Text>
            <Text category="h4">Heading4 더불어 사는 이타주의자</Text>
            <Text category="h5">Heading5 더불어 사는 이타주의자</Text>
            <Text category="h6">Heading6 더불어 사는 이타주의자</Text>
            <Text category="s1">Subtitle1 더불어 사는 이타주의자</Text>
            <Text category="s2">Subtitle2 더불어 사는 이타주의자</Text>
            <Text category="p1">Paragraph1 더불어 사는 이타주의자</Text>
            <Text category="p2">Paragraph2 더불어 사는 이타주의자</Text>
            <Text category="c1">Caption1 더불어 사는 이타주의자</Text>
            <Text category="c2">Caption2 더불어 사는 이타주의자</Text>
        </Layout>   
    </SafeAreaView>
)
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
        <Screen name = "Home" component={FontScreen}/>
        <Screen name = "Alt" component={AltStackNav}/>
        <Screen name = "Commu" component={ComToptabNav}/>
        <Screen name = "Meet" component={ToggleScreen}/>
        <Screen name = "Prof" component={LoginScreen}/>
    </Navigator>
)
