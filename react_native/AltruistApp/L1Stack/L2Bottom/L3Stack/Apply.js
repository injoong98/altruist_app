import React, { Component } from 'react';

import {SafeAreaView, TextInput, View} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction} from '@ui-kitten/components'


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const AltApplyHome =({navigation}) =>{

    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
        )
 
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
        <Layout style={{flex:4, justifyContent:"space-around", flexDirection: 'column'}}>
            <View style={{ flex:1, alignItems:"center"}}>
                <Text category="h3">이타주의자 지원하기</Text> 
            </View>
            <View style={{flex:2, flexDirection: 'column', alignItems:"center"}}>
                <Text category="s1">
                    이타주의자 지원을 환영합니다. 
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 지원을 환영합니다. 
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 지원을 환영합니다. 
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 지원을 환영합니다. 
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                    이타주의자 설명 입니다.
                    이타주의자 지원 설명입니다.
                </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button>청소년 / 대학생</Button>
                <Button>일반인 </Button>
            </View>
        </Layout>   
    </SafeAreaView>
    )
}


export class AltApplyScreen extends Component{
    BackAction = () =>(
            <TopNavigationAction icon={BackIcon} onPress={() => {navigation.goBack()}}/>
            )

    render(){
        return(
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="이타주의자" alignment="center" accessoryLeft={BackAction}/> 
            <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
                <Text>이타주의자 지원</Text>
            </Layout>   
        </SafeAreaView>
        )
        }       
    }
// =({navigation}) =>{

export default  AltApplyHome ;