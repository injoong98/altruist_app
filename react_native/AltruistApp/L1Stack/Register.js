import React from 'react';
import {View,StyleSheet, SafeAreaView} from 'react-native';
import {Text,Input,Button,CheckBox, TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';

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
            <SafeAreaView>
                <TopNavigation 
            title="회원가입" alignment="center" accessoryLeft={this.BackAction} /> 
                <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                    <Text>Hii</Text>
                </View>
            </SafeAreaView>
        )
    }
}

export default RegisterScreen;