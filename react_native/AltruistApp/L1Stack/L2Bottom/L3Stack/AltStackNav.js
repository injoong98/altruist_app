import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components'
import AltMainScreen from './Main'
import AltApplyScreen from './Apply'
import AltListScreen from './List'
import AltProfileScreen from './Profile'
import {AltQuestionScreen,AltQueType,AltAreaList} from './Question'
import AltApplyFormScreen from './ApplyForm'

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
        <Screen name = "AltApply" component={AltApplyScreen}/>
        <Screen name = "AltList" component={AltListScreen}/>
        <Screen name = "AltProfile" component={AltProfileScreen}/>
        <Screen name = "AltQuestion" component={AltQuestionScreen}/>
        <Screen name = "AltApplyForm" component={AltApplyFormScreen}/>
        <Screen name = "AltQueType" component={AltQueType}/>
        <Screen name = "AltAreaList" component={AltAreaList}/>
    </Navigator>
)
