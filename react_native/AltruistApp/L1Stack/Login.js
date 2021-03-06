import React from 'react';
import {View,TextInput,StyleSheet,Dimensions,Keyboard,TouchableWithoutFeedback,Image} from 'react-native';
import {Text,Input,Button,CheckBox} from '@ui-kitten/components';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies';
import {Signing} from './Context'
import LogoSvg from '../assets/icons/logo.svg'
import AltruistSvg from '../assets/icons/altruist.svg'
import { TouchableOpacity } from 'react-native-gesture-handler';

const {width} = Dimensions.get('window')

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mem_userid:'',
            mem_password:'',
            logininfo:'',
            isLogined:false,
            autologin:true
        }
    }
    static contextType = Signing;

    // removeValue = async () => {
    //     try {
    //       await AsyncStorage.removeItem('logininfo')
    //       .then(()=>{
    //         AsyncStorage.removeItem('autologin')
    //       })
    //     } catch(e) {
    //       // remove error
    //     }
      
    //     //console.log('Done.')
    //   }
      
    //   getData = async (key) => {
    //     try {
    //       const value = await AsyncStorage.getItem(key)
    //       if(value !== null) {
    //         var objstr= `{"${key}":${value}}`
    //         this.setState(JSON.parse(objstr))
    //       }else{
    //           //console.log('null')
    //       }
    //     } catch(e) {
    //       // error reading value
    //     }
    // }
    // storeData = async (key,value) => {
    //     try {
    //       await AsyncStorage.setItem(key, value)
    //     } catch (e) {
    //       //console.log(e)
    //     }
    //   }
    // dologin=(mem_userid,mem_password)=>{
    //     var formdata= new FormData();
    //     formdata.append('mem_userid',mem_userid);
    //     formdata.append('mem_password',mem_password);
    
    //     axios.post('https://dev.unyict.org/api/login',formdata)
    //     .then(response=>{
    //         this.setState({isLogined:true,mem_password:'',mem_userid:''})
    //         this.storeData('logininfo',JSON.stringify({mem_userid:mem_userid,mem_password:mem_password}));
    //         this.storeData('autologin',JSON.stringify(this.state.autologin));
    //         this.props.navigation.navigate('Bottom')
    //     })
    //     .catch(error=>{
    //         alert(`?????? : ${JSON.stringify(error)}`)
    //     })
    // }
    // cookie=()=>{
    //   CookieManager.get('https://dev.unyict.org')
    //   .then((cookies) => {
    //     //console.log('CookieManager.get =>', cookies);
    //   });
    // }
    componentDidMount(){
        // this.getData('logininfo');
        // this.getData('autologin');
        // const {logininfo,autologin} = this.state
        // logininfo && autologin ?
        // this.dologin(logininfo.mem_userid,logininfo.mem_password)
        // :
        // null
    }
    render(){
        const {mem_userid,mem_password,autologin} = this.state;
        const { signIn } = this.context
        const wdithLogo = (width*0.67);
        const heightLogo = (wdithLogo*0.57);
        return(
          <View
            style={{flex:1,backgroundColor:'#ffffff'}}
          >
            <TouchableWithoutFeedback 
              style={{borderWidth:2,backgroundColor:'#ffffff'}}
              onPress={()=>{Keyboard.dismiss()}}
            >
              <View style={{position:'relative',flex:1,alignItems:'center',justifyContent:'center'}}>
                <View style={{backgroundColor:'#ffffff',alignItems:'center',justifyContent:'center'}}>
                  {/* <LogoSvg  width={wdithLogo} height={heightLogo}/> */}
                  <Image style={{width:wdithLogo,height:heightLogo}} source={{uri : 'https://dev.unyict.org/uploads/main_png.png'}}/>
                </View>
                  <TextInput
                      style={styles.testInput}
                      placeholder="????????? ?????? ?????????"
                      onChangeText={nextValue => this.setState({mem_userid:nextValue})}
                      placeholderTextColor='#A897C2'
                      value={mem_userid}
                  />
                  <TextInput
                      ref='pwinput'
                      style={styles.testInput}
                      secureTextEntry={true}
                      placeholder="????????????"
                      onChangeText={nextValue => this.setState({mem_password:nextValue})}
                      placeholderTextColor='#A897C2'
                      value={mem_password}
                  />
                  
                  <TouchableOpacity style={styles.logInBtn} onPress={()=>signIn(mem_userid,mem_password,autologin)}>
                    <Text category='h2' style={{fontSize:12,color:'#ffffff'}}>
                      ?????????
                    </Text>  
                  </TouchableOpacity>
                  <View style={{marginTop:26,  justifyContent:'center',alignItems:'center'}}>
                    
                    <TouchableOpacity  onPress={()=>this.props.navigation.navigate('RegisterScreen')}>
                      <Text style={styles.optionText}>
                        ?????? ??????
                      </Text>  
                    </TouchableOpacity>
                    <View style={{flexDirection:'row', marginVertical : 15 }}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('FindPwScreen')}>
                      <Text style={styles.optionText}>
                      ???????????? ????????? 
                      </Text>  
                    </TouchableOpacity>
                      <Text style={styles.optionText}>
                      {`  /  `}
                      </Text>  
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('ResendAuthmailScreen')}>
                      <Text style={styles.optionText}>
                      ???????????? ?????????
                      </Text>  
                    </TouchableOpacity>
                    </View>
                  </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )
    }
}

export default LoginScreen;

const styles =StyleSheet.create({
  testInput : {
    backgroundColor:'#ffffff',
    borderRadius:10,
    // borderWidth:2,
    backgroundColor:'#f4f4f4',
    borderColor:'#63579D',
    padding:8,
    fontSize:18,
    width:'60%',
    marginTop:18
  },
  optionText:{
    fontSize:12,
    fontWeight:'bold',
    color:'#63579D'
  },
  logInBtn:{
    marginTop:26,
    width: 62,
    height:36,
    borderRadius:6,
    backgroundColor:'#63579D',
    justifyContent:'center',
    alignItems:'center'
  }
})