import React from 'react';
import {View,SafeAreaView,Text,FlatList,StyleSheet,TouchableOpacity,StatusBar} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging'
import {Spinner,Button} from '@ui-kitten/components'
import {MyTabBar} from '../../components/TopTab'
import {PostTime} from '../../components/PostTime'
import {Notice} from '../Context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const renderNotis =(item,index,navigation,onRefresh) => {
    return(
        <TouchableOpacity 
            key={index} 
            onPress={()=>{navigation.navigate('IlbanContent',{OnGoback:() =>onRefresh(),post_id:item.post_id})}}
            style={[styles.notiContainer,{backgroundColor: '#f4f4f4'}]} 
        >
            <View style={{}}>
                <View style={{flex:3}}>
                    <Text>{item.title}</Text>
                </View>
                <View style={{flex:1}}>
                    <PostTime category="p1" style={{fontSize:9, color:'#63579D'}} datetime = {item.post_datetime}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export class AlarmFaq extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:false,
            noti:[]
        }
    }
    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get('http://dev.unyict.org/api/board_post/lists/faq')
        .then(res=>{
            this.setState({noti:res.data.view.list.data.list,isLoading:false})
        })
        .catch(err=>{
            console.log('getNotiList : '+ err)
        })
    }
    onRefresh=()=>{
        this.getNotiList();   
    }
    componentDidMount(){
        this.getNotiList();
    }
    render(){
        const {noti,isLoading} =this.state
        return(
            <View  style={styles.container} style={{flex:1}}>
                {
                 isLoading?
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                     <Spinner size='giant'/>
                 </View>
                     :
                     <View style={{flex:1,paddingTop:20,backgroundColor:'#ffffff'}}>
                        <FlatList 
                        data={noti}
                        renderItem={({item,index})=>renderNotis(item,index,this.props.navigation,this.onRefresh)}
                        keyExtractor={(item,index)=>index.toString()}
                        style={{backgroundColor:'#ffffff'}}
                        />
                     </View>
                }
            </View>
        )
    }
}
export class AlarmOfficial extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:false,
            noti:[]
        }
    }
    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get('http://dev.unyict.org/api/board_post/lists/notice')
        .then(res=>{
            this.setState({noti:res.data.view.list.data.list,isLoading:false})
        })
        .catch(err=>{
            console.log('getNotiList : '+ err)
        })
    }
    onRefresh=()=>{
        this.getNotiList();   
    }
    componentDidMount(){
        this.getNotiList();
    }
    render(){
        const {noti,isLoading} =this.state
        return(
            <View  style={styles.container} style={{flex:1}}>
                {
                 isLoading?
                 <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Spinner size='giant'/>
                </View>
                     :
                     <View style={{flex:1,paddingTop:10,backgroundColor:'#ffffff'}}>
                        <FlatList 
                        data={noti}
                        renderItem={({item,index})=>renderNotis(item,index,this.props.navigation,this.onRefresh)}
                        keyExtractor={(item,index)=>index.toString()}
                        style={{backgroundColor:'#ffffff'}}
                        />
                     </View>
                }
            </View>
        )
    }
}
export class AlarmScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            noti:[]
        }
    }
    static contextType = Notice
    navigateToPost=(post_id,brd_id)=>{
        const {navigate} =this.props.navigation
        console.log(`brd_id ::: ${brd_id}`)
        switch(brd_id)
         {
            case '1':
                var content='GominContent'
                var list='Commu'
                var screen = 'Gomin'
                break;
            case '2':
                var content='MarketContent'
                var list='Commu'
                var screen='Market'
                break;
            case '3':
                var content='AlbaContent'
                var list='Commu'
                var screen='Alba'
                break;
            case '5':
                var content='IlbanContent'
                var list='Commu'
                var screen='Jau'
                break;
            case '10':
                var content='StckQueContent'
                var list ="Alt"
                var screen ="AltQueToptab"
                break;
            case '11':
                var content='StckQueContent'
                var list ="Alt"
                var screen ="AltOpqQueList"
                break;
         }
         if(!content){
             var content= "IlbanContent";
         }  
        console.log(`list : ${list} + content : ${content}`)
        // navigate(list,{screen})
        navigate(content,{post_id,OnGoback:() =>this.onRefresh()})
    }
    onRefresh = () =>{
        this.getNotiList();
    }
    readNoti = (item) =>{
        axios.get(`http://dev.unyict.org/api/notification/read?not_id=${item.not_id}`)
        .then(res=>{
            console.log(item.not_type=='comment')
            if(item.not_type=='comment'){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.context.reloadUnreadCount();
                this.navigateToPost(item.post_id,item.brd_id)
            }
            this.getNotiList()
        })
        .catch(err=>{
        })
    }

    renderNotis =({item,index}) => {
    return(
        <Notice.Consumer>
            {
                notice=>
                <TouchableOpacity 
                    key={index} 
                    onPress={()=>{this.readNoti(item);}}
                    style={[styles.notiContainer,{backgroundColor: item.not_read_datetime == null ? '#f4f4f4' : '#c4c4c4'}]} 
                >
                    <View style={{flexDirection:"row",justifyContent:'space-evenly'}}>
                        <View style={{flex:7}}>
                            <Text>{item.not_message}</Text>
                        </View>
                        <View style={{flex:1}}>
                            <PostTime category="p1" style={{fontSize:9, color:'#63579D'}} datetime = {item.not_datetime}/>
                        </View>
                    </View>
                </TouchableOpacity>
            }
        </Notice.Consumer>
    )
    }

    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get('http://dev.unyict.org/api/notification')
        .then(res=>{
            this.setState({noti:res.data.view.data.list,isLoading:false})
        })
        .catch(err=>{
        })
    }
    componentDidMount(){
        this.getNotiList();
        messaging().onMessage(async remoteMessage => {
            this.getNotiList();
        });
    }

    render(){
        const {isLoading} = this.state
        return(
            <View  style={styles.container} style={{flex:1}}>
                {
                 isLoading?
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Spinner size='giant'/>
                </View>
                     :
                <View style={{flex:1,paddingTop:20,backgroundColor:'#ffffff'}}>
                    <FlatList 
                        data={this.state.noti}
                        renderItem={this.renderNotis}
                        keyExtractor={(item,index)=>index.toString()}
                        style={{backgroundColor:'#ffffff'}}
                    />
                </View>
                }
            </View>
        )
    }
}
    
  const TabNavigator = () => (
    <Navigator tabBar={props => <MyTabBar {...props} />}>
      <Screen name='AlarmPrivate' component={AlarmScreen} options={ {title:'알람'}}/>
      <Screen name='AlarmOfficial' component={AlarmOfficial}  options={{title:'공지사항'}}/>
      <Screen name='AlarmFaq' component={AlarmFaq}  options={{title:'FAQ'}}/>
    </Navigator>
  );
  
export class AlarmToptab extends React.Component{
    
    render(){
        return (
            <SafeAreaView style={{flex:1,}}>
                <TabNavigator/>
            </SafeAreaView>
        );
        } 
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ffffff',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingTop:20
    },
    notiContainer:{
        paddingVertical:25,
        borderRadius : 13,
        marginVertical:4.5,
        marginHorizontal:19,
        paddingHorizontal:21
    },
    indicatorStyle:{
         height:0
    },
    tabtext:{
        fontSize:15
    },
    notiocontainer:{


    },
})