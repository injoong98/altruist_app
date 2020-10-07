import React from 'react';
import {createBottomTabNavigator}from '@react-navigation/bottom-tabs';
import {ComToptabNav} from './L3Toptab/ComToptabNav';
import {AltStackNav} from './L3Stack/AltStackNav';
import messaging from '@react-native-firebase/messaging'

import {SafeAreaView,View, Image,Animated,StyleSheet} from 'react-native';
import {Layout,Text,TopNavigation,Button,BottomNavigationTab,BottomNavigation, Card, Icon, styled} from '@ui-kitten/components';

import ToggleTune from '../../components/ToggleTune';
import {MyStackNav} from './L3MyStack/MyStackNav'

import {AlarmToptab} from './Alarm'
import Communitysvg from '../../assets/icons/community_svg.svg'
import { Signing,Notice } from '../Context';

const AltIcon = (props) => (
    <Icon {...props} name='altruist' pack='alticons' />
  );
const BellIcon = (props) => (
    <Icon {...props} name='bell' pack='alticons' />
  );
const MyIcon = (props) => (
    <Icon {...props} name='mypage' pack='alticons' />
  );
const {Navigator,Screen} = createBottomTabNavigator();

const ToggleScreen=()=>(
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <ToggleTune />
    </View>

)

const FontScreen =() =>(
    <SafeAreaView style={{flex:1,backgroundColor : ""}}>
        <TopNavigation title="스페어" alignment="center"/> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text category="h1">Heading1 더불어 사는 이타주의자</Text>
            <Text category="h2">Heading2 더불어 사는 이타주의자</Text>
            <Text category="h3">Heading3 더불어 사는 이타주의자</Text>
            <Text category="h4">Heading4 더불어 사는 이타주의자</Text>
            <Text category="h5">Heading5 더불어 사는 이타주의자</Text>
            <Text category="h6">Heading6 더불어 사는 이타주의자</Text>
            <Text category="s1">Subtitle1 더불어 사는 이타주의자</Text>
            <Text category="s2">Subtitle2 더불어 사는 이타주의자</Text>
            <Text category="p1">Paragraph1 더불어 사는 이타주의자</Text>
            <Text category="p2">Paragraph2 더불어 사는 이타주의자</Text>
            <Text category="c1">Caption1 더불어 사는 이타주의자</Text>
            <Text category="c2">Caption2 더불어 사는 이타주의자</Text>
        </Layout>   
    </SafeAreaView>
)
const SpareScreen =({navigation}) =>(
    <SafeAreaView style={{flex:1, backgroundColor : '#E4E4E4',flexDirection:'row'}}>
        <View style={{flex:1,backgroundColor:'yellow'}}></View>
        <View style={{flex:1,backgroundColor:'blue'}}></View>
    </SafeAreaView>
)
class AlarmIcon extends React.Component{
    constructor(props){
        super(props)
        this.state={
            size : new Animated.Value(1)
        }
    }
    alarmAction = () => {
        console.log('alarmAction')
        Animated.sequence([
            Animated.timing(this.state.size,{
                toValue:3,
                duration: 250,
                useNativeDriver: false
            }),
            Animated.timing(this.state.size,{
                toValue:1,
                duration: 250,
                useNativeDriver: false
            })
        ]).start()
        
    };
    componentDidMount(){
        messaging().onMessage(async remoteMessage => {
            this.alarmAction();
            });
    }
    render(){
        return(
            <View style={{width:50,alignItems:'center'}}>
                <BellIcon style={{height:30,width:42}} />
                    <Notice.Consumer>{
                        notice=>
                        notice.unreadCount>0?
                            <Animated.View 
                                style={[styles.numberContainer,{
                                    paddingHorizontal:this.state.size,
                                    paddingVertical:this.state.size,
                                }]}>
                                <Text style={{color:'#ffffff',fontSize:10}}>
                                    {notice.unreadCount}
                                </Text>
                            </Animated.View>
                            :
                            null
                        }
                    </Notice.Consumer>
            </View>
        )
    }
}
const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      {/* <BottomNavigationTab title={()=><Homesvg height={35} width ={35}/>}/> */}
      <BottomNavigationTab title={()=><AltIcon style={{height:30,width:30}}/>}/>
      <BottomNavigationTab title={()=><Communitysvg height={30} width={64}/>}/>
      <BottomNavigationTab title={()=><AlarmIcon />}/>  
      <BottomNavigationTab title={()=><MyIcon style={{height:30,width:49}}/>}/>
      {/* <BottomNavigationTab title={()=><HomeIcon />}/>
      <BottomNavigationTab title={()=><AltruistIcon  />}/>
      <BottomNavigationTab title={()=><CommunityIcon  />}/>
      <BottomNavigationTab title={()=><BellIcon  />}/>  
      <BottomNavigationTab title={()=><MypageIcon  />}/> */}
    </BottomNavigation>
  );


export class ComBottomNav extends React.Component{
    constructor(props){
        super(props)
    }
    static contextType = Signing

    render(){
        return(
            <Navigator 
                initialRouteName={this.context.isPushNoti() ?"Alarm": "Alt"}
                tabBar={props => <BottomTabBar {...props} 
            />}>
                {/* <Screen name = "Home" component={FontScreen}/> */}
                <Screen name = "Alt" component={AltStackNav}/>
                <Screen name = "Commu" component={ComToptabNav}/>
                <Screen name = "Alarm" component={AlarmToptab}/>
                <Screen name = "Prof" component={MyStackNav}/>
            </Navigator>
        )}
}

const styles = StyleSheet.create({
    numberContainer:{position:'absolute',
    right:0,
    backgroundColor:'#ff5c57',
    borderRadius:5,
    minWidth:15,
    alignItems:'center'}
                                   
})