import React from 'react';
import {Dimensions,Animated,View,SafeAreaView,Alert,Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {Layout,Text,TopNavigation} from '@ui-kitten/components'
import messaging from '@react-native-firebase/messaging'
import {ComBottomNav} from './L2Bottom/ComBottomNav'
import {defaultContent, IlbanContent, GominContent, MarketContent, AlbaContent} from './Content'
import {defaultWrite, MarketWrite, AlbaWrite,GominWrite, IlbanWrite} from './Write'
import ApplyCompleteScreen from './L2Bottom/L3Stack/ApplyComplete'
import ApplyFailScreen from './L2Bottom/L3Stack/ApplyFail'
import axios from 'axios' 
import LoginScreen from './Login'
import RegisterScreen from './Register'
import AgreementScreen from './Agreement'
import FindPwScreen from './FindPw'
import RegisterSuccessScreen from './RegisterSuccess'
import FindRwSuccessScreen from './FindRwSuccess'
import ResendAuthmailScreen from './ResendAuthmail'
import ResendAuthmailSuccessScreen from './ResendAuthmailSuccess'
import QuestionScreen from './Question'
import FinishScreen from './Finish'
import {Signing,Notice} from './Context'
import {AltQueContent} from './L2Bottom/L3Stack/Question'
import LogoSvg from '../assets/icons/logo.svg'
import MainImg from '../assets/images/main-logo-img.png'

const {width} = Dimensions.get('window')
const wdithLogo = (width*0.67);
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
            duration: 600,
            useNativeDriver: false
        }).start();
    }
    
    fadeOut = () => {
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration: 0,
            useNativeDriver: false
        }).start();
    }
    
    componentDidMount(){
        this.fadeIn();
    }
    componentWillUnmount(){
        this.fadeOut();
    }

    render(){
        
        return(
            <SafeAreaView style={{flex:1}}>
                <Animated.View 
                    style={{flex:1,justifyContent:"center", alignItems:"center",backgroundColor:"#ffffff",opacity:this.state.opacity}}>
                    {/* <LogoSvg width={wdithLogo} height={heightLogo} style={{flex:1}}/> */}
                    <Image style={{width:wdithLogo,height:heightLogo}} source={{uri : 'http://dev.unyict.org/uploads/main_png.png'}}/>
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
            isSignedOut:false,
            session_mem_id:'',
            isPushNoti:false,
            context:{
                signIn:(mem_userid,mem_password,autologin)=>{
                    var formdata= new FormData();
                    formdata.append('mem_userid',mem_userid);
                    formdata.append('mem_password',mem_password);
                    autologin ? 
                    formdata.append('autologin',autologin)
                    :null
                    
                    axios.post('http://dev.unyict.org/api/login',formdata)
                    .then(response=>{
                        console.log('sign in res:'+JSON.stringify(response.data.status))
                        if(response.data.status == 200 )
                        {
                            this.setState({isSignedIn:true});
                            this.session_chk();
                            this.getNotiList();
                        }
                        else{
                            const regex = /(<([^>]+)>)|&nbsp;/ig;
                            const message_remove_tags = response.data.message.replace(regex, '\n');
                            alert(message_remove_tags)
                        }
                        
                    })
                    .catch(error=>{
                        alert(`에러 : ${JSON.stringify(error)}`)
                    })
                },
                signOut:async()=>{
                    await messaging().getToken()
                    .then(token=>{
                        var formdata = new FormData();
                        formdata.append('token',token);
                        axios.post('http://dev.unyict.org/api/login/logout/',formdata)
                        .then(response=>{
                            this.setState({isSignedOut:true})
                            this.session_chk()
                        })
                        .catch(error =>{
                        })
                    });
                },
                isPushNoti:()=>{
                    return this.state.isPushNoti
                },
                session_chk:()=>{
                    this.session_chk()
                },
                session_mem_id:'',
                is_altruist:false
            },
            noticeContext:{
                unreadCount:'test success!!',
                reloadUnreadCount:()=>{
                    console.log('reloadUnreadCount run')
                    this.getNotiList()
                }
            
            },

        }
        
    }
    static contextType = Signing
    syncPushToken = async (token,mem_id) =>{
        console.log('synchPushToken token :'+token)
        console.log('synchPushToken mem_id :'+mem_id)
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
        var token
        var formdata = new FormData();
        
        await messaging().getToken()
        .then(cur_token=>{
            token = cur_token
            formdata.append('token',token);
        });
        
        await axios.post('http://dev.unyict.org/api/login/session_check',formdata)
        .then(async res=>{
            console.log('session_checking')
            if(res.data.status == 200){
                const {mem_id,is_altruist} =res.data.session
                
                this.setState({isSignedIn:true});
                this.state.context.session_mem_id = mem_id;
                this.state.context.is_altruist = is_altruist;
                
                this.syncPushToken(token,mem_id)
                
                try {
                    await AsyncStorage.setItem('currentMemId',mem_id);
                  } 
                catch (error) {
                    console.log('asyncstorage error'+error)
                  }
            }
            else if(res.data.status == 500)
            {
                this.setState({isSignedIn:false});
                messaging().getToken()
                .then(token=>{
                    this.syncPushToken(token,0)
                });
            }
            else
            {
                null;
            }
                this.setState({isLoading:false})
        })
        .catch(err=>{
            console.log('session_chk error:'+JSON.stringify(err))
            alert(`오류가 있습니다. \n 잠시후 다시 시도해주세요.\n오류 정보 : ${err.message}` )
            this.setState({isSignedIn:false});
            messaging().getToken()
            .then(token=>{
                this.syncPushToken(token,0)
            });
        })
    }
    getNotiList=()=>{
        axios.get('http://dev.unyict.org/api/notification?read=N')
        .then(res=>{
           console.log('getNotiList success! : '+res.data.view.data.total_rows)   
           this.setState(prevState=>({
                noticeContext: {                   // object that we want to update
                    ...prevState.noticeContext,    // keep all other key-value pairs
                    unreadCount: res.data.view.data.total_rows       // update the value of specific key
                } 
            })
            )
        })
        .catch(err=>{
            console.log('getNotiList falied : '+ err)
        })
    }
    componentDidMount(){
        setTimeout(this.session_chk,600);
        this.getNotiList()
        messaging()
            .getInitialNotification()
            .then(async remoteMessage=>{
            console.log('getInitialNotification stack'+remoteMessage)
                if(remoteMessage!=null){
                    this.setState({isPushNoti:true})
                }
            }) 
        messaging().onMessage(async remoteMessage => {
            this.getNotiList()
            });
        messaging().onNotificationOpenedApp(async remoteMessage=>{
            console.log('onNotificationOpenedApp on stackNav.js'+remoteMessage);
            this.getNotiList()
        })
            
    }
    render(){
        const {context,isLoading,isSignedIn,noticeContext} = this.state
        return(
            isLoading? 
            <LoadingScreen />
            :
            <Signing.Provider value={context}>
                <Notice.Provider value={noticeContext}>
                    <Navigator headerMode="none">
                        {
                            !isSignedIn ? 
                            <>
                                <Screen name = "Login" component={LoginScreen}/>
                                <Screen name = "FindPwScreen" component={FindPwScreen}/>
                                <Screen name = "RegisterScreen" component={RegisterScreen}/>
                                <Screen name = "ResendAuthmailScreen" component={ResendAuthmailScreen}/>
                                <Screen name = "FindRwSuccessScreen" component={FindRwSuccessScreen}/>
                                <Screen name = "AgreementScreen" component={AgreementScreen}/>
                                <Screen name = "RegisterSuccessScreen" component={RegisterSuccessScreen}/>
                                <Screen name = "ResendAuthmailSuccessScreen" component={ResendAuthmailSuccessScreen}/>
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
                                <Screen name = "ApplyComplete" component={ApplyCompleteScreen}/>
                                <Screen name = "ApplyFail" component={ApplyFailScreen}/>
                                <Screen name = "StckQueContent" component={AltQueContent}/>
                            </>
                        }

                    </Navigator>
                </Notice.Provider>
            </Signing.Provider>
        )}
}
