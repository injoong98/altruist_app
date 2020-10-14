import React from 'react';
import {Platform, Dimensions,Animated,View,SafeAreaView,Alert,Image, Linking } from 'react-native';
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
import VersionCheck from "react-native-version-check";
import { version } from '../package.json';



const {width} = Dimensions.get('window')
const wdithLogo = (width*0.67);
const heightLogo = (wdithLogo*0.57);

const {Navigator,Screen} = createStackNavigator();

class LoadingScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            opacity:new Animated.Value(0),
            yourCurrentVersion : '',
        }
    }

    
    
    fadeIn = () => {
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration: 600,
            useNativeDriver: false
        }).start();
    }
    
    fadeOut = () =>{
        Animated.timing(this.state.opacity,{
            toValue:0, 
            delay:10000
        }).reset()
    }

    VersionChkAndroid = () => {
        const yourCurrentVersion = VersionCheck.getCurrentVersion();        
        this.setState({yourCurrentVersion : yourCurrentVersion});
    }
    
    
   
    componentDidMount(){
        

        // // Platform.OS === 'ios' ?  
        // // null
        // //     // VersionCheck.setAppID(APP_ID);
        // //     // VersionCheck.setAppName(APP_NAME);
        // // : 
        // //     console.log('            this.fadeIn();')
        // //     this.fadeIn();
        // //     VersionCheck.getLatestVersion()
        // //     .then(latestVersion => {
        // //       console.log('latestVersion : ', latestVersion);
        // //       // 2.0.0
        // //     })
        Platform.OS === 'ios' ? null : this.fadeIn(); this.VersionChkAndroid();
    }

    componentWillUnmount(){
        Platform.OS === 'ios' ?  null : this.fadeOut()
    }



    render(){
        
        return(
            <SafeAreaView style={{flex:1, justifyContent:"space-between",}}>
                <Animated.View 
                    style={{flex:1, justifyContent:"center", alignItems:"center",backgroundColor:"#ffffff",opacity:this.state.opacity}}>
                    {/* <LogoSvg width={wdithLogo} height={heightLogo} style={{flex:1}}/> */}
                    <Image style={{width:wdithLogo,height:heightLogo}} source={{uri : 'http://dev.unyict.org/uploads/main_png.png'}}/>
                </Animated.View> 
                {Platform.OS === 'android'?  
                <Text category="s2" style={{backgroundColor: 'white', textAlign:'center', includeFontPadding:true, padding:20}}>{`BETA ver. ${this.state.yourCurrentVersion}`}</Text>
            : null }
            </SafeAreaView>
    )}
}
export class StackNav extends React.Component{
    constructor(props){
        super(props)
        this.state={
            versionOk : true,
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
                is_altruist:false,
                alt_id:'',
            },
            noticeContext:{
                noti:[],
                unreadCount:'test success!!',
                reloadUnreadCount:()=>{
                    console.log('reloadUnreadCount run')
                    this.getNotiList()
                },
                getFirstNotiList:()=>{
                    console.log('getFirstNotiList run')
                    this.getFirstNotiList()
                },
            
            },

        }
        
    }

    latestVersionChk = () =>{
       

    }

    VersionUpdateChk = () => {
        VersionCheck.getLatestVersion().then(latestVersion => {
            console.log(latestVersion);
            });


        VersionCheck.getLatestVersion({
            forceUpdate: true,
            provider: () => fetch(`https://play.google.com/store/apps/details?id=com.everytime.v2`)
            .then(r =>{ r.json();
            console.log('r',r)}
            )
            .then(({version}) => 
                console.log('version:', version))
            }).then(latestVersion =>{
            console.log(latestVersion);
            });


            // VersionCheck.getLatestVersion({
            //     forceUpdate: true,
            //     provider: () => fetch('')
            //       .then(r => r.json())
            //       .then(({version}) => version),   // You can get latest version from your own api.
            //   }).then(latestVersion =>{
            //     console.log(latestVersion);
            //   });



        
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
                this.getNotiList();
                this.getFirstNotiList();
                
                const {mem_id,is_altruist,alt_id} =res.data.session
                console.log(`mem_id : ${mem_id} is_altruist : ${is_altruist} alt_id : ${alt_id}`)
                this.setState({isSignedIn:true});
                this.state.context.session_mem_id = mem_id;
                this.state.context.is_altruist = is_altruist;
                is_altruist ?
                this.state.context.alt_id =alt_id
                :
                null

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
    getFirstNotiList=()=>{
        axios.get('http://dev.unyict.org/api/notification')
        .then(res=>{
           console.log('getFirstNotiList success! : '+res.data.view.data.total_rows)   
           this.setState(prevState=>({
                noticeContext: {                  
                    ...prevState.noticeContext,
                    noti: res.data.view.data.list,
                } 
            })
            )
        })
        .catch(err=>{
            console.log('getFirstNotiList falied : '+ err)
        })
    }
    getNotiList=()=>{
        axios.get('http://dev.unyict.org/api/notification?read=N')
        .then(res=>{
           console.log('getNotiList success! : '+res.data.view.data.total_rows)   
           this.setState(prevState=>({
                noticeContext: {                  
                    ...prevState.noticeContext,
                    unreadCount: res.data.view.data.total_rows,
                         
                } 
            })
            )
        })
        .catch(err=>{
            console.log('getNotiList falied : '+ err)
        })
    }
    componentDidMount(){
        setTimeout(
            ()=>
            {
                // this.VersionUpdateChk();
            this.session_chk();
        }
            ,600);
        messaging()
            .getInitialNotification()
            .then(async remoteMessage=>{
            console.log('getInitialNotification stack'+remoteMessage)
                if(remoteMessage!=null){
                    this.setState({isPushNoti:true})
                }
            }) ;
        messaging().onMessage(async remoteMessage => {
            this.getNotiList(),
            this.getFirstNotiList()
            });
        messaging().onNotificationOpenedApp(async remoteMessage=>{
            console.log('onNotificationOpenedApp on stackNav.js'+remoteMessage);
            this.getNotiList()
            this.getFirstNotiList()
            this.setState({isPushNoti:true})
        });
            
    }
    render(){
        const {context,isLoading,isSignedIn,noticeContext, versionOk} = this.state
        return(
            Platform.OS === 'android' && isLoading ? 
            <LoadingScreen />
            :
            !versionOk ? 
            null : 
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
