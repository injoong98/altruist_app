import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout,Button,Text} from '@ui-kitten/components'



const CommunityScreen = ({navigation}) =>{
    
    return(
    <SafeAreaView style={{flex:1}}>
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>커뮤니티 화면입니다.</Text>
            <Button onPress = {()=>{navigation.goBack()}}>뒤로가기</Button>
            <Button onPress = {()=>{navigation.navigate('Write')}}>글작성</Button>
        </Layout>   
    </SafeAreaView>

    )
    }

export {CommunityScreen}