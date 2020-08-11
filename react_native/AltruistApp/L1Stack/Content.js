import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon} from '@ui-kitten/components'

const BackIcon =  () =>(
    <Icon name = "arrow-back"/>
)


const defaultContent = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={navigation.goBack()}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글본문" alignment="center" accessoryLeft={BackAction}/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
     <Text>글본문입니다</Text>
        </Layout>   
    </SafeAreaView>

    )
    }

export {defaultContent}