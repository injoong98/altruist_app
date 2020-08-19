import React from 'react';
import {SafeAreaView,View,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { Icon,Layout,Button,Text,ListItem,List, Divider,Card,Spinner} from '@ui-kitten/components'
import axios from 'axios'


    const  EyeIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="eye"/>
    )
    const CommentIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
    )
    const HeartIcon = (props)=>(
        <Icon style={styles.icon} fill='#8F9BB3' name="heart-outline"/>
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
        }
    }

    
    
    renderItem = ({ item, index }) => {
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = item.post_content.replace(regex, '');
        
        return(
        <TouchableOpacity style={styles.container} onPress = {()=>{this.props.navigation.navigate('GominContent',{title:`${index+1}th post_id=${item.post_id}`,post_id:item.post_id})}}>
            <Text style ={styles.headtext}category="h6" numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
            <View style={styles.subtitle}>
                <Text style={styles.subtext}category="s2">{post_remove_tags.substr(0,24)+'...'}</Text>
                <View style={styles.infocontainer}>
                    <HeartIcon />
                    <Text style={styles.infotext} category="s1">{item.post_like}</Text>
                    <CommentIcon />
                    <Text style={styles.infotext} category="s1">{item.post_comment_count}</Text>
                    <EyeIcon />
                    <Text style={styles.infotext} category="s1">{item.post_hit}</Text>
                </View>

            </View>
        </TouchableOpacity>
    )};
    renderFooter=()=>{
        return(
          this.state.isListLoading ?
          <View style = {styles.loader}>
            <ActivityIndicator size='large'/>
          </View>:null
        )
      }
    getPostList = async() =>{
        await axios.get(`http://10.0.2.2/api/board_post/lists/b-a-1?page=${this.state.current_page}`)
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
            alert(`error: ${error.message}`)
        })
    }
    componentDidMount(){
        this.getPostList();
    }
    
    onRefresh= () =>{
        this.getPostList();
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
    render(){
        return(
        this.state.isLoading ? 
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>
                <Spinner size="giant" />
            </Text>
        </View>:
        <SafeAreaView style={{flex:1}}>
            <List
            data ={this.state.lists}
            ItemSeparatorComponent={Divider}
            renderItem={this.renderItem} 
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.load_more_data}
            onEndReachedThreshold = {0.9}
            ListFooterComponent={this.renderFooter}/>
            <View style ={styles.buttoncontainer}>
                <Button style={{width:"100%"}} onPress={()=>{this.props.navigation.navigate('GominWrite',{statefunction:this.statefunction})}} >
                    글쓰기
                </Button>
            </View>
        </SafeAreaView>
        )
        }

    }

export {GominScreen}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#6b6cab",
        borderRadius : 20,
        marginVertical:5,
        marginHorizontal:5,
        padding:0,

    },
    buttoncontainer:{
        width:"100%",bottom:0,
        display :"flex", 
        flexDirection:"row",
        justifyContent:"center", 
        alignItems:"center"
    },
    icon:{
        width: 24,height: 24,marginLeft:5
    },
    subtitle:{
        marginTop:10, display:"flex",flexDirection:"row", justifyContent:"space-between",
    },
    infocontainer:{
        display:"flex",flexDirection:"row",
        borderTopLeftRadius:20,
        backgroundColor:"#ffffff",
        position:"relative",bottom:0,right:0,
        padding:5
    },
    loader:{
        marginTop : 10,
        alignItems : 'center',
    },
    infotext:{
        color:'#141552'
    },
    headtext:{
        paddingTop:10,
        paddingLeft:20
    },
    subtext:{
        marginLeft:20
    }
})