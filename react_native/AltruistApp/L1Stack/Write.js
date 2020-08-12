import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout,Button,Text,TopNavigation,TopNavigationAction,Icon,Divider} from '@ui-kitten/components'
import { View } from 'native-base';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


const defaultWrite = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Divider />
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글작성 화면입니다.</Text>
        </Layout>   
    </SafeAreaView>

    )
    }

    const MarketWrite = ({route, navigation}) => {

        const BackAction = () =>(
            <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
        )

        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
                <Divider />
                <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                    <Text>글작성 화면입니다.</Text>
                </Layout>   
            </SafeAreaView>
        )
    }

export {defaultWrite, MarketWrite}