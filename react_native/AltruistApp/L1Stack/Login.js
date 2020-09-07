import React from 'react';
import {View,StyleSheet} from 'react-native';
import {Text,Input,Button,CheckBox} from '@ui-kitten/components';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends React.Component{
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
    removeValue = async () => {
        try {
          await AsyncStorage.removeItem('logininfo')
          .then(()=>{
            AsyncStorage.removeItem('autologin')
          })
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
          }else{
              console.log('null')
          }
        } catch(e) {
          // error reading value
        }
    }
    storeData = async (key,value) => {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (e) {
          console.log(e)
        }
      }
    dologin=(mem_userid,mem_password)=>{
        var formdata= new FormData();
        formdata.append('mem_userid',mem_userid);
        formdata.append('mem_password',mem_password);
    
        axios.post('http://dev.unyict.org/api/login',formdata)
        .then(response=>{
            this.setState({isLogined:true,mem_password:'',mem_userid:''})
            this.storeData('logininfo',JSON.stringify({mem_userid:mem_userid,mem_password:mem_password}));
            this.storeData('autologin',JSON.stringify(this.state.autologin));
            this.props.navigation.navigate('Bottom')
        })
        .catch(error=>{
            alert(`에러 : ${JSON.stringify(error)}`)
        })
    }
    
    componentDidMount(){
        this.getData('logininfo');
        this.getData('autologin');
        const {logininfo,autologin} = this.state
        logininfo && autologin ?
        this.dologin(logininfo.mem_userid,logininfo.mem_password)
        :
        null
    }
    render(){
        const {mem_userid,mem_password} = this.state;

        return(
            <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                <View style={{padding:10,borderWidth:1,borderColor:'#35367B',borderRadius:23,margin:10}}>
                    <Text category='h1' style={{color:'#35367B'}}>더불어 성장하는</Text>
                    <Text category='h2' style={{fontSize:26,color:'#35367B'}}>이타주의자들</Text>
                </View>
                <Text>ID</Text>
                <Input value ={mem_userid} onChangeText ={(nextValue)=>this.setState({mem_userid:nextValue})}></Input>
                <Text>password</Text>
                <Input value ={mem_password} onChangeText ={(nextValue)=>this.setState({mem_password:nextValue})}></Input>
                <CheckBox
                    checked={this.state.autologin}
                    onChange={(checked)=>{this.setState({autologin:checked}),console.log(this.state.autologin)}}    
                >
                자동로그인{`${this.state.autologin}`}
                </CheckBox>
                <Button onPress={()=>this.dologin(mem_userid,mem_password)}>로그인</Button>
                <Button onPress={()=>{this.getData('logininfo'),this.getData('autologin')}} >AsyncStorage check</Button>
                <Button onPress={()=>{console.log(this.state)}} >statecheck</Button>
            </View>
        )
    }
}

export default LoginScreen;