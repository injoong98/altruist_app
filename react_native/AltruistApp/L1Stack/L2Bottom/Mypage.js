import React from 'react';
import {Text,View,StyleSheet} from 'react-native';
import {Input,Button} from '@ui-kitten/components';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_userid:'',
            mem_password:'',
            logininfo:'',
            autologin:false,
            isLogined:false
        }
    }
    removeValue = async () => {
        try {
          await AsyncStorage.removeItem('logininfo')
        } catch(e) {
          // remove error
        }
      
        console.log('Done.')
      }
      
    getData = async (key) => {
        try {
          const value = await AsyncStorage.getItem(key)
          if(value !== null) {
            var objstr= `{"${key}":${value}}`
            this.setState(JSON.parse(objstr))
            console.log(value)
          }
        } catch(e) {
        }
    }
    storeData = async (value) => {
        try {
          await AsyncStorage.setItem('logininfo', value)
        } catch (e) {
          console.log(e)
        }
      }
    
    sessionChk = () =>{
      axios.get('http://dev.unyict.org/api/login/session_check')
      .then(res=>{
          alert(JSON.stringify(res.data))
          console.log(JSON.stringify(res.data))
        }
      )
      .catch(err=>{
        alert(JSON.stringify(err))
        console.log(JSON.stringify(err))
      })
    }
    doLogout=()=>{
        axios.get('http://dev.unyict.org/api/login/logout/')
        .then(response=>{
            alert(`성공 : ${JSON.stringify(response.data)}`),
            this.removeValue()
        })
        .catch(error =>{
            alert(`성공 : ${JSON.stringify(error)}`)
        })
    }
    
    componentDidMount(){
        // this.getData();
    }
    render(){
        return(
            <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                <Button onPress={()=>{this.doLogout();this.removeValue();this.props.navigation.navigate('Login')}}>간단로그아웃</Button>
                <Button onPress={()=>{this.sessionChk();}}>session chk</Button>
                <Button onPress={()=>{this.getData('logininfo');this.getData('autologin')}} >AsyncStorage check</Button>
            </View>
        )
    }
}

export default Mypage;