import React from 'react';
import {Text,View,StyleSheet} from 'react-native';
import {Input,Button} from '@ui-kitten/components';
import axios from 'axios'

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_userid:'',
            mem_password:''
        }
    }
    dologin=()=>{
        const {mem_userid,mem_password} = this.state;
        var formdata= new FormData();
        formdata.append('mem_userid',mem_userid);
        formdata.append('mem_password',mem_password);
    
        axios.post('http://dev.unyict.org/api/login',formdata)
        .then(response=>{
            alert(`성공 : ${JSON.stringify(response.data)}`)
        })
        .catch(error=>{
            alert(`에러 : ${JSON.stringify(error)}`)
        })
    }

    doLogout=()=>{
        axios.get('http://dev.unyict.org/api/login/logout/')
        .then(response=>{
            alert(`성공 : ${JSON.stringify(response.data)}`)
        })
        .catch(error =>{
            alert(`성공 : ${JSON.stringify(error)}`)
        })
    }
    render(){
        return(
            <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                <Text>ID</Text>
                <Input onChangeText ={(nextValue)=>this.setState({mem_userid:nextValue})}></Input>
                <Text>password</Text>
                <Input onChangeText ={(nextValue)=>this.setState({mem_password:nextValue})}></Input>
                <Button onPress={this.dologin}>간단로그인</Button>
                <Button onPress={this.doLogout}>간단로그아웃</Button>
                <Button onPress={()=>{alert(`${this.state.mem_userid},${this.state.mem_password} `)}}>state확인</Button>
            </View>
        )
    }
}

export default LoginScreen;