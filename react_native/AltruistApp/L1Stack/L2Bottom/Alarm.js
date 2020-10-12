import React from 'react';
import {View,SafeAreaView,Text,FlatList,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging'
import {TabBar, Tab,Spinner,Button} from '@ui-kitten/components'
import {MyTabBar,TopTab} from '../../components/TopTab'
import {PostTime} from '../../components/PostTime'
import {TopBarTune} from '../../components/TopBarTune'
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
    }
    render(){
        return(
            <AlarmNotices type='faq'/>
        )
    }
}
export class AlarmOfficial extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <AlarmNotices type='notice'/>
        )
    }
}
export class AlarmNotices extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            refreshing:false,
            isNoMoreData:false,
            noti:[],
            current_page:1,
            isListLoading:false
        }
    }
    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }
    getPostList = async() =>{
        await axios.get(`http://dev.unyict.org/api/board_post/lists/${this.props.type}?page=${this.state.current_page}`)
        .then((response)=>{
          if(response.data.view.list.data.list.length > 0){
            this.setState({
              noti:this.state.noti.concat(response.data.view.list.data.list),
              isLoading:false,
              isListLoading:false,
            })
          }
          else{
            console.log('no page data');
            this.setState({isListLoading:false, isNoMoreData : true});
          }
        })
        .catch((error)=>{
            alert('error : '+error)
        })
      }
    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get(`http://dev.unyict.org/api/board_post/lists/${this.props.type}`)
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
    load_more_data = () => {
        if(this.state.total_rows < 20){
			this.setState({isNoMoreData:true});
		}
       	else if(!this.state.isNoMoreData){
            this.setState({
            current_page : this.state.current_page + 1,
            isListLoading : true},
            this.getPostList, console.log(this.state.current_page))
        }
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
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.load_more_data}
                        onEndReachedThreshold = {0.9}
                        ListFooterComponent={this.renderFooter}
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
            refreshing:false,
            isNoMoreData:false,
            noti:[],
            current_page:1,
            isListLoading:false
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
    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }
    getPostList = async() =>{
        await axios.get(`http://dev.unyict.org/api/notification?page=${this.state.current_page}`)
        .then((res)=>{
          if(res.data.view.data.list.length > 0){
            this.setState({
              noti:this.state.noti.concat(res.data.view.data.list),
              isLoading:false,
              isListLoading:false,
            })
          }
          else{
            console.log('no page data');
            this.setState({isListLoading:false, isNoMoreData : true});
          }
        })
        .catch((error)=>{
            alert('error : '+error)
        })
      }
    load_more_data = () => {
        if(this.state.total_rows < 20){
			this.setState({isNoMoreData:true});
		}
       	else if(!this.state.isNoMoreData){
            this.setState({
            current_page : this.state.current_page + 1,
            isListLoading : true},
            this.getPostList, console.log(this.state.current_page))
        }
    }
    onRefresh = () =>{
        this.getNotiList();
    }
    readNoti = (item) =>{
        console.log('item.not_id'+item.not_id)
        axios.get(`http://dev.unyict.org/api/notification/read?not_id=${item.not_id}`)
        .then(res=>{
            console.log(item.not_type=='comment')
            if(item.not_type=='comment'||item.not_type=='comment_comment'){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.post_id,item.brd_id)
            }else if(item.not_type=='이타주의자들'&&item.not_message.includes("질문")){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.not_content_id,'10')
            }else if(item.not_type=='이타주의자들'&&item.not_message.includes("좋아")){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.not_content_id,item.brd_id)

            }
            this.context.reloadUnreadCount();
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
                    style={[styles.notiContainer,{backgroundColor: item.not_read_datetime != null ||notice.unreadCount==0? '#c4c4c4' : '#f4f4f4'}]} 
                >
                    <View style={{flexDirection:"row",justifyContent:'space-evenly'}}>
                        <View style={{flex:9}}>
                            <Text>{item.not_message}</Text>
                        </View>
                        <View style={{flex:2,alignItems:'flex-end'}}>
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
        this.setState({noti:this.context.noti},this.setState({isLoading:false}))
        messaging().onMessage(async remoteMessage => {
            this.getNotiList();
        });
    }

    render(){
        const {isLoading,noti} = this.state
        return(
            <View  style={styles.container} style={{flex:1}}>
                {
                 isLoading?
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Spinner size='giant'/>
                </View>
                     :
                     noti.length>0?
                <View style={{flex:1,paddingTop:10,backgroundColor:'#ffffff'}}>
                    <FlatList 
                        data={this.state.noti}
                        renderItem={this.renderNotis}
                        keyExtractor={(item,index)=>index.toString()}
                        style={{backgroundColor:'#ffffff'}}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.load_more_data}
                        onEndReachedThreshold = {0.9}
                        ListFooterComponent={this.renderFooter}
                    />
                </View>
                :
                <View style={{flex:1,paddingTop:10,backgroundColor:'#ffffff',alignItems:'center'}}>
                    <Text>
                        알림 내역이 없습니다.
                    </Text>
                </View>

                }
            </View>
        )
    }
}



const TopTabBar = ({ navigation, state }) => (
    <TabBar
        selectedIndex={state.index}
        onSelect={index => {navigation.navigate(state.routeNames[index]);console.log(state.index)}}
        indicatorStyle={styles.indicatorStyle}
      >
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="알림"  selected={state.index} thisindex ={0}/> }/>
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="공지사항" selected={state.index} thisindex ={1}/> }/>
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="FAQ"  selected={state.index} thisindex ={2}/> }/>
    </TabBar>
  );
const TabNavigator = () => (
<Navigator tabBar={props => <TopTabBar {...props} />}>
    <Screen name='AlarmPrivate' component={AlarmScreen} options={ {title:'알람'}}/>
    <Screen name='AlarmOfficial' component={AlarmOfficial}  options={{title:'공지사항'}}/>
    <Screen name='AlarmFaq' component={AlarmFaq}  options={{title:'FAQ'}}/>
</Navigator>
);
  
export class AlarmToptab extends React.Component{
    static contextType = Notice
    readall=async()=>{
        await axios.get(`http://dev.unyict.org/api/notification/readall`)
        .then(res=>{
            this.context.reloadUnreadCount();
            this.context.getFirstNotiList();
        })
        .catch(err=>{
        })
    }
    render(){
        return (
            <SafeAreaView style={{flex:1,}}>
                <TopBarTune text="알림" 
                    func={()=>this.readall()}
                    right='alarm'
                />
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