import React from 'react';
import {SafeAreaView,View,LogBox,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { Text,List,Spinner,TopNavigationAction,TopNavigation} from '@ui-kitten/components';
import axios from 'axios'
import {PostTime} from '../../../components/PostTime'
import Heartsvg from '../../../assets/icons/heart.svg'
import Viewsvg from '../../../assets/icons/view.svg'
import Commentsvg from '../../../assets/icons/comment.svg'
import Backsvg from '../../../assets/icons/back-arrow-color.svg'

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

export class MyList extends React.Component{
    constructor(props) {
      super(props);
      this.state={
          isLoading : true,
          lists:[],
          refreshing:false,
          current_page:1,
          isListLoading : false,
          isNoMoreData : false,
          type:''
      }
    }
    topTitle = () => (
        <Text category='h2'>
            {this.state.type=='post' ? '내가 쓴 글': this.state.type=='comment' ? '내가 쓴 댓글' : this.state.type=='like_post' ? '추천한 글' : '스크랩한 글 ' }
        </Text>
    )
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    brdNm = (brd_id)=>{
        var brd = brd_id == 1 ? '고민게시판' : brd_id == 2 ? '수수마켓': brd_id == 3 ?'알바천일국': '이타게시판'  
        return brd
    }

    navigateToContent= (brd_id,post_id) =>{
        var brd = brd_id == 1 ? 'MyGomin' : brd_id == 2 ? 'MyMarket': brd_id == 3 ?'MyAlba': 'MyIlban' 
        this.props.navigation.navigate(brd,{post_id:post_id, OnGoback:() =>this.onRefresh()})
    }

    renderCmtItem = ({ item, index }) => {
        return(
        <TouchableOpacity style={styles.container} onPress = {()=>{this.navigateToContent(item.brd_id,item.post_id)}}>
            <View>
                <Text style={{fontWeight:'bold', marginRight:5, marginTop:5}} category="s2">{ this.brdNm(item.brd_id)}</Text>
                <Text style={[styles.subtext, {marginTop:5}]} category="h6" numberOfLines={1}>{item.cmt_content}</Text>
            </View>
            <View style={styles.subtitle}>
                <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',marginBottom:4}}> 
                    <PostTime datetime = {item.cmt_datetime}/>
                </View>
                <View style={{display:"flex",flexDirection:"row",justifyContent:'space-evenly',width:70,}}>
                    <View style={{alignItems:'center',}}>
                        <Heartsvg />
                        <Text style={styles.infotext} category="s1">{item.cmt_like}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
    };
    renderPostItem = ({ item, index }) => {
        
            const regex = /(<([^>]+)>)|&nbsp;/ig;
        return(
        <TouchableOpacity style={styles.container} onPress = {()=>{this.navigateToContent(item.brd_id,item.post_id)}}>
            <View>
                <Text category="s2" style={{fontWeight:'bold',marginRight:5,marginTop:5}}>{ this.brdNm(item.brd_id)}</Text>
                <Text style ={styles.headtext} category="h5" numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
            {
                item.post_content?
                <Text style={styles.subtext} category="s2" numberOfLines={1}>{item.post_content.replace(regex, '')}</Text>
                :
                null    
            }
            </View>
            <View style={styles.subtitle}>
                <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',marginBottom:4}}> 
                    <PostTime datetime = {item.post_datetime}/>
                </View>
                <View style={styles.infocontainer}>
                    <View style={{alignItems:'center',}}>
                        <Heartsvg width={15} height={20}/>
                        <Text style={styles.infotext} category="s1">{item.post_like}</Text>
                    </View>
                    <View style={{alignItems:'center',}}>
                        <Commentsvg width={15} height={20}/>
                        <Text style={styles.infotext} category="s1">{item.post_comment_count}</Text>
                    </View>
                    <View style={{alignItems:'center',}}>
                        <Viewsvg width={20} height={20}/>
                        <Text style={styles.infotext} category="s1">{item.post_hit}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        )
    };
    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }
    getPostList = async() =>{
        await axios.get(`https://dev.unyict.org/api/mypage/${this.state.type}?&page=${this.state.current_page}`)
        .then((response)=>{
          if(response.data.view.data.list.length > 0){
            this.setState({
              lists:this.state.lists.concat(response.data.view.data.list),
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
            alert(JSON.stringify(error))
        })
    }
  
    getPostFirst = async() => {
        await axios.get(`https://dev.unyict.org/api/mypage/${this.state.type}`)
        .then((response)=>{
            this.setState({
              lists:response.data.view.data.list,
              isLoading:false,
              isListLoading:false,
            })
        })
        .catch((error)=>{
            alert('errocfhvcbr')
        })
    }
    componentDidMount(){
        this.setState(
            {   
                current_page:1, 
                isNoMoreData : false,
                type:this.props.route.params.type
            }
            , this.getPostFirst);
    }
  
    onRefresh= () =>{
        this.getPostFirst();
    }
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
  
    load_more_data = () => {
        if(!this.state.isNoMoreData){
            this.setState(
                {
                    current_page : this.state.current_page + 1,
                    isListLoading : true
                },this.getPostList,console.log(this.state.current_page))
        }
    }
    render(){
        const {isLoading,type} = this.state
            return(
            isLoading ? 
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>
                    <Spinner size="giant" />
                </Text>
            </View>:
            <SafeAreaView style={{flex:1,backgroundColor:"#ffffff"}}>
            <TopNavigation title="" alignment="center" accessoryLeft={this.BackAction} title={this.topTitle} style={styles.topbar}/> 
                <List
                    data ={this.state.lists}
                    renderItem={type =='comment'? this.renderCmtItem : this.renderPostItem} 
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.load_more_data}
                    onEndReachedThreshold = {0.9}
                    ListFooterComponent={this.renderFooter}
                    style={{backgroundColor:'#ffffff'}}
                />
            </SafeAreaView>
            )
        }
  }
  
const styles = StyleSheet.create({
    container:{
        backgroundColor:"#F4F4F4",
        borderRadius : 20,
        marginVertical:4.5,
        marginHorizontal:19,
        padding:0,
        paddingLeft:21


    },
    buttoncontainer:{
        width:"100%",bottom:0,
        display :"flex", 
        justifyContent:"center", 
        alignItems:"center"
    },
    icon:{
        // width: 15,
        // height: 15
    },
    subtitle:{
        marginTop:10, display:"flex",flexDirection:"row", justifyContent:"space-between",
    },
    infocontainer:{
        display:"flex",flexDirection:"row",justifyContent:'space-evenly',
        borderTopLeftRadius:23,
        width:116,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
        paddingTop:5,
        paddingLeft:20,
        paddingRight:10
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    infotext:{
        color:'#141552',
        fontSize:9
    },
    headtext:{
        marginTop:5,
        paddingTop:10,
        fontWeight:'bold'
    },
    subtext:{
        marginTop:5,
        maxWidth:200
    }
})