import React from 'react';
import {View,StyleSheet, SafeAreaView} from 'react-native';
import {Text,Input,Button,CheckBox, TopNavigation, TopNavigationAction, Icon} from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class FinishScreen extends React.Component{
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
            <TopNavigation title="가입완료" alignment="center" accessoryLeft={this.BackAction} /> 
                <View style={{flex:1, justifyContent:"center",alignItems:'center', padding:50}}>
                    <Text>가입완료</Text>
                    {/* TODO : 메일이랑 연결해주기 */}
                    {/* TODO : 메인이랑 연결해주기 */}
                    <Button>메일함으로 가기</Button>
                    <Button>메인으로 가기</Button>
                </View>
            </>
        )
    }
}

export default FinishScreen;