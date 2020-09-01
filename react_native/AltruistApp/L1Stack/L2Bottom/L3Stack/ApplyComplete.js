import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList } from 'react-native-gesture-handler';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)



class ApplyCompleteScreen extends React.Component{
    constructor(props){
        super(props)
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){ 
        return(
            <SafeAreaView style={styles.container}>
                <TopNavigation 
                title="이타주의자" alignment="center" accessoryLeft={this.BackAction} /> 
                    <Layout style={styles.wrapper}>
                        <Text> 이타주의자 지원 완료</Text>
                        <Text> 이타주의자 지원에 감사드립니다!</Text>
                        <Text> 관리자 확인 후, 이타주의자 목록에서 확인하실 수 있으며</Text>
                        <Text> {`마이페이지 > 내 정보 > 이타주의자 항목 에서`}</Text>
                        <Text> 수정 원하는 부분을 수정할 수 있습니다!</Text>
                        <Button>이타주의자 메인으로 돌아가기</Button>
                    </Layout>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 50,
    },
    wrapper :{
        marginTop: 20,
        marginBottom: 100,
        backgroundColor: "#eaeaea"
    },
    title: {
        marginTop: 16,
        marginBottom: 10,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      }
});



export default ApplyCompleteScreen;