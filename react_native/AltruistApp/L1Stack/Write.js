import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon} from '@ui-kitten/components'

const BackIcon =  () =>(
    <Icon name = "arrow-back"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={navigation.goBack()}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
        <Text>글작성 화면입니다.</Text>
        </Layout>   
    </SafeAreaView>

    )
    }

export {defaultWrite}