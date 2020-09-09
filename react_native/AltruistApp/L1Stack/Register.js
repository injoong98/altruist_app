import React from 'react';
import {View,StyleSheet, SafeAreaView} from 'react-native';
import {Text,Input,Button,CheckBox, TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class RegisterScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_userid:'',
            mem_password:'',
            logininfo:'',
            isLogined:false,
            autologin:false
        }
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )
  
    render(){
        return(
            <>
            <TopNavigation title="회원가입" alignment="center" accessoryLeft={this.BackAction} /> 
                <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1, justifyContent:"center",alignItems:'center', padding:50}}>
                        <Input placeholder="이메일"></Input>
                        <Input placeholder="아이디"></Input>
                        <Input placeholder="비밀번호"></Input>
                        <Input placeholder="비밀번호 확인"></Input> 
                        <Input placeholder="닉네임"></Input>
                        <Button onPress={()=>this.props.navigation.navigate('QuestionScreen')}>다음</Button>
                    </View>
                </SafeAreaView>
            </>
        )
    }
}

export default RegisterScreen;