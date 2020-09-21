import React from 'react';
import {Dimensions,Animated,View,SafeAreaView,} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {Layout,Text,TopNavigation} from '@ui-kitten/components'
import messaging from '@react-native-firebase/messaging'
import {ComBottomNav} from './L2Bottom/ComBottomNav'
import {defaultContent, IlbanContent, GominContent, MarketContent, AlbaContent} from './Content'
import {defaultWrite, MarketWrite, AlbaWrite,GominWrite, IlbanWrite} from './Write'

import axios from 'axios' 
import LoginScreen from './Login'
import RegisterScreen from './Register'
import AgreementScreen from './Agreement'
import FindPwScreen from './FindPw'
import RegisterSuccessScreen from './RegisterSuccess'
import QuestionScreen from './Question'
import FinishScreen from './Finish'
import {Signing} from './Context'
import LogoSvg from '../assets/icons/logo.svg'

const {width} = Dimensions.get('window')
const wdithLogo = (width*0.47);
const heightLogo = (wdithLogo*0.57);

const {Navigator,Screen} = createStackNavigator();

class LoadingScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            opacity:new Animated.Value(0),
        }
    }

    fadeIn = () => {
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration: 400,
            useNativeDriver: false
        }).start();
    }
    
    componentDidMount(){
        this.fadeIn();
    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <Animated.View 
                    style={{flex:1,justifyContent:"center", alignItems:"center",backgroundColor:"#ffffff",opacity:this.state.opacity}}>
                    <LogoSvg width={wdithLogo} heightLogo={heightLogo}/>
                </Animated.View>   
            </SafeAreaView>
    )}
}
export class StackNav extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            isSignedIn:false,
            isSignedOut:false
        }
        
    }
    static contextType = Signing
    syncPushToken = async (token,mem_id) =>{
        console.log(token)
        console.log(mem_id)
        var formdata = new FormData();
        formdata.append('token',token);
        formdata.append('mem_id',mem_id);
        
        await axios.post('http://dev.unyict.org/api/login/sync_push_token',formdata)
        .then(res=>{
            console.log('success!')
        })
        .catch(err=>{
            console.log('failure!')
        })
    }
    session_chk= async()=>{
        await axios.get('http://dev.unyict.org/api/login/session_check')
        .then(async res=>{
            console.log('session_checking')
            if(res.data.status == 200){
                const {mem_id} =res.data.session
                this.setState({isSignedIn:true});
                messaging().getToken()
                .then(token=>{
                    this.syncPushToken(token,mem_id)
                });
                try {
                    await AsyncStorage.setItem('currentMemId',mem_id);
                  } 
                catch (error) {
                    console.log(error)
                  }
            }
            else if(res.data.status == 500)
            {
                this.setState({isSignedIn:false})
            }
            else
            {
                null;
            }
                this.setState({isLoading:false})
        })
        .catch(err=>{
            console.log(JSON.stringify(err))
        })
    }
    componentDidMount(){
        setTimeout(this.session_chk,600)
    }
    render(){
        const context ={
            signIn:(mem_userid,mem_password,autologin)=>{
                var formdata= new FormData();
                formdata.append('mem_userid',mem_userid);
                formdata.append('mem_password',mem_password);
                autologin ? 
                formdata.append('autologin',autologin)
                :null
                
                axios.post('http://dev.unyict.org/api/login',formdata)
                .then(response=>{
                    console.log(JSON.stringify(response.data.status))
                    if(response.data.status == 200 )
                    {
                        this.setState({isSignedIn:true});
                        this.session_chk()
                    }
                    else{
                        alert(`로그인 실패 :(`)
                    }
                    
                })
                .catch(error=>{
                    alert(`에러 : ${JSON.stringify(error)}`)
                })
            },
            signOut:()=>{
                axios.get('http://dev.unyict.org/api/login/logout/')
                .then(response=>{
                    this.setState({isSignedOut:true})
                    this.session_chk()
                })
                .catch(error =>{
                })
            }
        }
        const {isLoading,isSignedIn} = this.state
        return(
            isLoading? 
            <LoadingScreen />
            :
            <Signing.Provider value={context}>
                <Navigator headerMode="none">
                    {
                        !isSignedIn ? 
                        <>
                            <Screen name = "Login" component={LoginScreen}/>
                            <Screen name = "FindPwScreen" component={FindPwScreen}/>
                            <Screen name = "RegisterScreen" component={RegisterScreen}/>
                            <Screen name = "AgreementScreen" component={AgreementScreen}/>
                            <Screen name = "RegisterSuccessScreen" component={RegisterSuccessScreen}/>
                            <Screen name = "QuestionScreen" component={QuestionScreen}/>
                            <Screen name = "FinishScreen" component={FinishScreen}/>
                        </>
                        :
                        <>
                            <Screen name = "Bottom" component={ComBottomNav}/>
                            <Screen name = "Write" component={defaultWrite}/>
                            <Screen name = "Content" component={defaultContent}/>
                            <Screen name = "IlbanContent" component={IlbanContent}/>
                            <Screen name = "GominContent" component={GominContent}/>
                            <Screen name = "MarketContent" component={MarketContent}/>
                            <Screen name = "IlbanWrite" component={IlbanWrite}/>
                            <Screen name = "AlbaContent" component={AlbaContent}/>
                            <Screen name = "MarketWrite" component={MarketWrite}/>
                            <Screen name = "AlbaWrite" component={AlbaWrite}/>
                            <Screen name = "GominWrite" component={GominWrite}/>
                        </>
                    }

                </Navigator>
            </Signing.Provider>
        )}
}
