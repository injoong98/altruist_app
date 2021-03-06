import React from 'react';
import {View,SafeAreaView,FlatList,StyleSheet,TouchableOpacity,ActivityIndicator, Pressable,Image} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging'
import {TabBar, Tab,Spinner,Modal,Text,Divider} from '@ui-kitten/components'
import {MyTabBar,TopTab} from '../../components/TopTab'
import {PostTime} from '../../components/PostTime'
import {TopBarTune} from '../../components/TopBarTune'
import {Notice} from '../Context'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Reloadsvg from '../../assets/icons/reload.svg'
import Confirm from '../../components/confirm.component'

import Viewsvg from '../../assets/icons/view.svg'
import Timesvg from '../../assets/icons/Time.svg'

const { Navigator, Screen } = createMaterialTopTabNavigator();

const RenderNoticeItem = ({item,index,navigation,onRefresh}) => (
    <TouchableOpacity 
        key={index} 
        style={styles.item} 
        onPress={() => {navigation.navigate('IlbanContent',{OnGoback:() =>onRefresh(), post_id:item.post_id})}}
    >
        <View style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <Image 
              source={item.thumb_url? {uri : item.thumb_url}:{uri : "https://dev.unyict.org/assets/images/noimage.png"}} 
              style={{width:90, height:90, resizeMode:'cover', borderRadius:10}}
            />
        </View>
        <View style={styles.textArea}>
            <View style={{ paddingHorizontal:5, justifyContent:'space-between'}}>
                <View style={styles.textTop}>
                    <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail" category='h4'>
                        {item.title}
                    </Text>
                </View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end',paddingRight:15,marginTop:5}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent:'center', alignItems:'center', marginRight:10}}>
                        <Viewsvg width='15' height='15'/>
                        <Text style={{color:'#878787', fontSize:8}} category='p1'>{item.post_hit}</Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', paddingTop:3}}>
                        <Timesvg width='10' height='10'/>
                        <PostTime style={{color:'#878787', fontSize:8, marginTop:2}} category='p1' datetime={item.post_datetime}/>
                    </View>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );

const RenderNotis =({item,index,navigation,onRefresh}) => {
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
            <AlarmNotices {...this.props} type='faq'/>
        )
    }
}
export class AlarmOfficial extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <AlarmNotices {...this.props} type='notice'/>
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
        await axios.get(`https://dev.unyict.org/api/board_post/lists/${this.props.type}?page=${this.state.current_page}`)
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
      //console.log('run getNotiList');
        axios.get(`https://dev.unyict.org/api/board_post/lists/${this.props.type}`)
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
        //console.info('componentDidMount event2');
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
                        renderItem={({item,index})=>
                        this.props.type =="notice" ?
                        <RenderNoticeItem item={item} index={index} navigation= {this.props.navigation} onRefresh ={this.onRefresh}/> 
                            :
                        <RenderNotis item={item} index={index} navigation= {this.props.navigation} onRefresh ={this.onRefresh}/>   
                        }
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
            isListLoading:false,
            modalVisible:false,
            confirmModalVisible:false,
            resultModalVisible:false,
            spinnerModalVisible:false,
            modalType:0,
            longPressId:'',
            longPressIndex:'',
            
        }
    }
    static contextType = Notice
    
    modalList = [
        {
            text : '?????? ????????? ?????????????????????????',
            func : ()=> this.notDelAll(),
        },
            
    ]
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
        await axios.get(`https://dev.unyict.org/api/notification?page=${this.state.current_page}`)
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
    readall=async()=>{
        await axios.get(`https://dev.unyict.org/api/notification/readall`)
        .then(res=>{
            this.context.reloadUnreadCount();
            this.context.getFirstNotiList();
        })
        .catch(err=>{
        })
    }
    readNoti = (item) =>{
        console.log('item.not_id'+item.not_id)
        axios.get(`https://dev.unyict.org/api/notification/read?not_id=${item.not_id}`)
        .then(res=>{
            console.log(item.not_type=='comment')
            if(item.not_type=='comment'||item.not_type=='comment_comment'){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.post_id,item.brd_id)
            }else if(item.not_type=='??????????????????'&&item.not_message.includes("??????")){
                console.log(`post_id = ${item.post_id} brd_id = ${item.brd_id}`)
                this.navigateToPost(item.not_content_id,'10')
            }else if(item.not_type=='??????????????????'&&item.not_message.includes("??????")){
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
                    onPressIn={()=>{console.log(' Press in')}}
                    onLongPress={()=>{console.log('item.not_id : '+item.not_id+' longPressIndex : '+index);this.setState({longPressId:item.not_id,longPressIndex:index,modalVisible:true})}}
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
    notDelAll=async()=>{
        await axios.get(`https://dev.unyict.org/api/notification/delete_all/`)
        .then(res=>{
            res.status == 200 ?
            this.setState({resultModalVisible:true,resultText:'??????????????? ??????????????????.',spinnerModalVisible:false},()=>{this.getNotiList();this.context.reloadUnreadCount()},)            
            :
            this.setState({resultModalVisible:true,resultText:'?????? ????????? ???????????? ???????????????.',spinnerModalVisible:false})
        })
        .catch(err=>{
            console.log(JSON.stringify(err))
        })
    }
    notDel = async()=>{
        const {noti,longPressId,longPressIndex} =this.state;
        noti.splice(longPressIndex,1);
        this.setState({noti})
        await axios.get(`https://dev.unyict.org/api/notification/delete/${longPressId}`)
        .then(res =>{
            console.log(JSON.stringify(res))
        })
        .catch(err=>{
            console.log(JSON.stringify(err))
        })
        
    }
    getNotiList=()=>{
        this.setState({isLoading:true});
        axios.get('https://dev.unyict.org/api/notification')
        .then(res=>{
            this.setState({noti:res.data.view.data.list,isLoading:false})
        })
        .catch(err=>{
        })
    }
    componentDidMount(){
       // console.info('componentDidMount event1');
        this.getNotiList();
        this.setState({noti:this.context.noti},this.setState({isLoading:false}))
        messaging().onMessage(async remoteMessage => {
            this.getNotiList();
        });
    }

    render(){
        const {isLoading,noti,modalVisible,confirmModalVisible,resultModalVisible,spinnerModalVisible,resultText,modalType} = this.state
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
                        ?????? ????????? ????????????.
                    </Text>
                    <Pressable onPress={() =>this.getNotiList() }>
                        <Reloadsvg height={15} width={15} fill="#A9C"/>
                    </Pressable>
                </View>

                }
                <Modal
                    visible={modalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}>
                    <View style={{borderRadius:15, backgroundColor:'white'}}>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false},this.notDel)}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:16, color:'#63579D'}} category='h3'>?????? ??????</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, modalType : 0, confirmModalVisible :true})}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:16, color:'#63579D'}} category='h3'>?????? ?????? ??????</Text>
                        </TouchableOpacity>
                    </View>   
                </Modal>
                <Modal
                    visible={confirmModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({confirmModalVisible:false})}>
                    <Confirm 
                        confirmText={this.modalList[modalType].text}
                        frstText="???"
                        OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                        scndText="?????????"
                        OnScndPress={() => this.setState({confirmModalVisible:false})}/>
                </Modal>
                <Modal
                    visible={spinnerModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}>
                    <Spinner size='giant'/>
                </Modal>
                <Modal
                    visible={resultModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({resultModalVisible:false})}
                    >
                    <Confirm 
                        type = 'result'
                        confirmText={resultText}
                        frstText="??????"
                        OnFrstPress={() =>{
                            this.setState({resultModalVisible:false});
                        }}
                    />
                </Modal>
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
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="??????"  selected={state.index} thisindex ={0}/> }/>
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="????????????" selected={state.index} thisindex ={1}/> }/>
      <Tab title={evaProps => <TopTab {...evaProps} abovectgry='h2' belowctgry="h4" abovetext="FAQ"  selected={state.index} thisindex ={2}/> }/>
    </TabBar>
  );
const TabNavigator = () => (
<Navigator tabBar={props => <TopTabBar {...props} />}>
    <Screen name='AlarmPrivate' component={AlarmScreen} options={ {title:'??????'}}/>
    <Screen name='AlarmOfficial' component={AlarmOfficial}  options={{title:'????????????'}}/>
    <Screen name='AlarmFaq' component={AlarmFaq}  options={{title:'FAQ'}}/>
</Navigator>
);
  
export class AlarmToptab extends React.Component{
    static contextType = Notice
    readall=async()=>{
        await axios.get(`https://dev.unyict.org/api/notification/readall`)
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
                <TopBarTune text="??????" 
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
    textArea: {
        flex: 1,
        paddingVertical: 7,
        paddingRight: 5,
        paddingLeft: 0,
        maxHeight: 150,
    },
    textTop: {
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        justifyContent: 'center',
        marginTop:5,
        paddingVertical:5
    },
    textBottom: {
    },
    item: {
        flex:1, 
        flexDirection:'row', 
        maxHeight:160, 
        margin:5,
        backgroundColor:'#F4F4F4',
        borderRadius:10,
    },
    text:{
        padding:6,
        lineHeight:20,
        fontSize:12
    }
})