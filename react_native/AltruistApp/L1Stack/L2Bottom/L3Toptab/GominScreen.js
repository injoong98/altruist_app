import React from 'react';
import {SafeAreaView,View,StyleSheet,ActivityIndicator,TouchableOpacity,Animated,LogBox} from 'react-native';
import { Icon,Layout,Button,Text,ListItem,List, Divider,Card,Spinner} from '@ui-kitten/components';
import axios from 'axios';
import {PostTime} from '../../../components/PostTime'

import Heartsvg from '../../../assets/icons/heart.svg'
import Viewsvg from '../../../assets/icons/view.svg'
import Commentsvg from '../../../assets/icons/comment.svg'
import Writesvg from '../../../assets/icons/write.svg'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
    const WriteIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="write" pack="alticons"/>
    )

class GominScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            isLoading : true,
            lists:[],
            refreshing:false,
            current_page:1,
            isListLoading : false,
            isNoMoreData : false,
            // searchInput : new Animated.Value(0),
            // searchOpenClose : false
        }
    }
    
    // searchOpen = () => {
    //     Animated.timing(this.state.searchInput,{
    //         toValue:50,
    //         duration:2000,
    //         useNativeDriver:false
    //     }).start();
    //     this.setState({searchOpenClose:!this.state.searchOpenClose})

    // }
    
    // searchClose = () => {
    //     Animated.timing(this.state.searchInput,{
    //         toValue:0,
    //         duration:2000,
    //         useNativeDriver:false
    //     }).start();
    //     this.setState({searchOpenClose:!this.state.searchOpenClose})

    // }

    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
    }
    getPostList = async() =>{
        await axios.get(`http://dev.unyict.org/api/board_post/lists/b-a-1?page=${this.state.current_page}`)
        .then((response)=>{
          if(response.data.view.list.data.list.length > 0){
            this.setState({
              lists:this.state.lists.concat(response.data.view.list.data.list),
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
            alert('error')
        })
      }
    
    getPostFirst = async() => {
        await axios.get('http://dev.unyict.org/api/board_post/lists/b-a-1')
        .then((response)=>{
            this.setState({
                lists:response.data.view.list.data.list,
                isLoading:false,
                isListLoading:false,
            })
        })
        .catch((error)=>{
            alert('error'+error);
        })
    }
    componentDidMount(){
        this.setState({current_page:1, isNoMoreData : false,}, this.getPostFirst);
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
            this.setState({
            current_page : this.state.current_page + 1,
            isListLoading : true},
            this.getPostList, console.log(this.state.current_page))
        }
    }
    renderItem = ({ item, index }) => {
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = item.post_content.replace(regex, '');
        
        return(
        <TouchableOpacity style={styles.container} onPress = {()=>{this.props.navigation.navigate('GominContent',{OnGoback:() =>this.onRefresh(),post_id:item.post_id})}}>
            <View>
                <Text style ={styles.headtext} category="h3" numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
                <Text style={styles.subtext} category="p1" numberOfLines={3}  ellipsizeMode="tail">{post_remove_tags}</Text>
            </View>
            <View style={styles.subtitle}>
                <View style={{flex:4,display:'flex',flexDirection:'row',alignItems:'flex-end',marginBottom:4, paddingBottom:5}}> 
                    <Text category="s2" style={{fontSize:10, color:'#63579D', marginRight:5}}>{item.display_name}</Text>
                    <PostTime category="p1" style={{fontSize:9, color:'#63579D'}} datetime = {item.post_datetime}/>
                </View>
                <View style={styles.infocontainer}>
                    <View style={{alignItems:'center',justifyContent:'center', marginTop:2}}>
                        <Heartsvg width='15' height='15'/>
                        <Text style={{...styles.infotext, marginTop:2}} category="s1">{item.post_like}</Text>
                    </View>
                    <View style={{alignItems:'center',}}>
                        <Commentsvg width='20' height='20'/>
                        <Text style={styles.infotext} category="s1">{item.post_comment_count}</Text>
                    </View>
                    <View style={{alignItems:'center',}}>
                        <Viewsvg width='20' height='20'/>
                        <Text style={styles.infotext} category="s1">{item.post_hit}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )};
    render(){
        // const {searchOpenClose} = this.state
        return(
        this.state.isLoading ? 
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>
                <Spinner size="giant" />
            </Text>
        </View>:
        <SafeAreaView style={{flex:1,backgroundColor:"#ffffff"}}>
            {/* <Animated.View style={{overflow:'hidden',height:this.state.searchInput,borderStyle:'solid',borderColor:'red',borderWidth:1}}>
                <Text>
                    안녕하세요
                </Text>
            </Animated.View> */}
            <List
                data ={this.state.lists}
                renderItem={this.renderItem} 
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                onEndReached={this.load_more_data}
                onEndReachedThreshold = {0.9}
                ListFooterComponent={this.renderFooter}
                style={{backgroundColor:'#ffffff'}}
            />
                <TouchableOpacity 
                    style={{position:'absolute', right:20,bottom:14}} 
                    onPress={()=>{this.props.navigation.navigate('GominWrite',{statefunction:this.statefunction})}} 
                >
                    <Writesvg />
                </TouchableOpacity>
                {/* <Button onPress={searchOpenClose ? this.searchClose : this.searchOpen}>
                    검색
                </Button> */}
        </SafeAreaView>
        )
        }

    }

export {GominScreen}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#F4F4F4",
        borderRadius : 13,
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
        marginTop:10, 
        display:"flex",
        flexDirection:"row", 
        justifyContent:"space-between",
    },
    infocontainer:{
        display:"flex",flexDirection:"row",justifyContent:'space-around',
        borderTopLeftRadius:23,
        width:150,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
        paddingTop:5,
        paddingLeft:25,
        paddingRight:10,
        flex:2
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    infotext:{
        color:'#63579D',
        fontSize:9
    },
    headtext:{
        marginTop:8,
        paddingTop:5,
        fontSize:17
    },
    subtext:{
        marginTop:10,
        maxWidth:200,
        fontSize:12
    }
})