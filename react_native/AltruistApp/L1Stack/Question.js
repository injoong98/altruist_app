import React from 'react';
import {View,StyleSheet, SafeAreaView} from 'react-native';
import {Text,Input,Button,CheckBox, TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class QuestionScreen extends React.Component{
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
            <TopNavigation title="가입절차" alignment="center" accessoryLeft={this.BackAction} /> 
                <View style={{flex:1, justifyContent:"center",alignItems:'center', padding:50}}>
                    <Text>hI</Text>
                    <Button onPress={()=>this.props.navigation.navigate('FinishScreen')}>가입완료</Button>
                </View>
            </>
        )
    }
}

export default QuestionScreen;