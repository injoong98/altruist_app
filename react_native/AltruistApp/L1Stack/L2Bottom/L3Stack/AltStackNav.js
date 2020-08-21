import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components'
import AltMainScreen from './Main'

const {Navigator,Screen} = createStackNavigator();

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const SpareScreen =({navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
        )
 
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>이타주의자</Text>
        </Layout>   
    </SafeAreaView>
    )
}

export const AltStackNav = () =>(
    <Navigator headerMode="none">
        <Screen name = "AltMain" component={AltMainScreen}/>
        <Screen name = "AltApply" component={SpareScreen}/>
        <Screen name = "AltList" component={SpareScreen}/>
        <Screen name = "AltProfile" component={SpareScreen}/>
        <Screen name = "AltQuestion" component={SpareScreen}/>
    </Navigator>
)
