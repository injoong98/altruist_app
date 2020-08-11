import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout,Button,Text} from '@ui-kitten/components'



const GominScreen = ({navigation}) =>{
    
    return(
    <SafeAreaView style={{flex:1}}>
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>고민있어요 화면입니다.</Text>
            <Button onPress = {()=>{navigation.goBack()}}>뒤로가기</Button>
        </Layout>   
    </SafeAreaView>

    )
    }

export {GominScreen}