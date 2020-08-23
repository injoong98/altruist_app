import React from 'react';

import {SafeAreaView} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const AltProfileScreen =({navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
        )
 
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>이타주의자 프로필</Text>
        </Layout>   
    </SafeAreaView>
    )
}

export default AltProfileScreen;