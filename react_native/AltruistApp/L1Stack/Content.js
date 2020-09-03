import React, { Component } from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView,Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Dimensions,Linking, VirtualizedList,TextInput} from 'react-native';
import {Card,Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,List,Spinner, Modal, OverflowMenu, MenuItem,Popover} from '@ui-kitten/components'
import Axios from 'axios';
import HTML from 'react-native-render-html';
import {ActionSheet, Root, Container} from 'native-base';
import Slider from '../components/slider.component'
import { Alert } from 'react-native';
import {PostTime} from '../components/PostTime'

import ReplyLsvg from '../assets/icons/arrow-bended-large.svg'
import ReplySsvg from '../assets/icons/arrow-bended-small.svg'
import MoreLsvg from '../assets/icons/dotdotdot-large.svg'
import MoreSsvg from '../assets/icons/dotdotdot-small.svg'
import Backsvg from '../assets/icons/back-arrow-color.svg'
import Thumbsvg from '../assets/icons/thumb-up.svg'
import UploadCirclesvg from '../assets/icons/upload-circle.svg'




const BackIcon =  (props) =>(
    <Icon {...props} fill ="#63579D"name = "back-arrow" pack="alticons"/>
)
const ThumbIcon =  (props) =>(
    <Icon {...props} fill ="#63579D"name = "thumb-up" pack="alticons"/>
)
const BendedIcon =  (props) =>(
    <Icon {...props} fill ="#63579D"name = "arrow-bended" pack="alticons"/>
)
const UploadCircleIcon =  (props) =>(
    <Icon  fill ="#63579D"name = "upload-circle" pack="alticons" {...props}/>
)
const MoreIcon =  (props) =>(
    <Icon {...props} fill ="#63579D"name = "more-vertical-outline"/>
)
const MoreLightIcon =  (props) =>(
    <Icon {...props} fill ="#BBB5D9"name = "more-vertical-outline"/>
)
const CommentIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
)
const PlusIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="plus-square"/>
)
const BlameIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="archive"/>
)
const HeartIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="heart"/>
)
const StarIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="star" {...props} />
)

const UploadIcon = (props) => (
      <Icon {...props} name='arrow-circle-up'/>
)
const defaultContent = ({navigation}) =>{
    
    const BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{navigation.goBack()}}/>
    )
    
    return(
    <SafeAreaView style={{flex:1}}>
        <TopNavigation title="글작성" alignment="center" accessoryLeft={BackAction} /> 
        <Layout style={{flex:1,justifyContent:"center", alignItems:"center"}}>
            <Text>글본문입니다</Text>
        </Layout>   
    </SafeAreaView>
    )
}

class GominContent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            post:'',
            comment:'',
            cmt_content:'',
            cmt_id:'',
            replying:false,
            isLoading:true,
            refreshing:false,
            modalVisible:false,
            replyModalVisible:false,
            popoverVisibel:false,
            
        }
    }
    commentWrite= ()=>{
        this.setState({replying:false,cmt_id:''})
        this.refs.commentInput.blur()
        console.log(this.refs)
    }
    postscrap = async()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        Axios.post('http://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
        .then(response=>{
            alert(`${JSON.stringify(response.data)}`)
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    
    commentUpload= async()=>{
        const {cmt_content,post,cmt_id}=this.state;
        var formdata = new FormData();
        formdata.append("post_id",post.post_id);
        formdata.append("cmt_content",cmt_content);
        cmt_id==''? null : formdata.append("cmt_id",cmt_id);
        
        this.commentWrite()
        
        await Axios.post('http://dev.unyict.org/api/comment_write/update',formdata)
        .then(response=>{
            const {status,message}=response.data;
            if(status=='200'){
                alert(`성공 : ${message}`);
                Keyboard.dismiss();
                this.setState({cmt_content:''});
                this.getCommentData(post.post_id);
                this.refs.pstcmtlist.scrollToEnd();
            }else if(status=="500"){
                alert(`실패 : ${message}`)
            }
        })
        .catch(error=>{
            alert(`등록 실패 ! ${error.message}`)
        })
    }
    
    commentValid =async() =>{
        const {cmt_content} =this.state;
        var formdata = new FormData();
        formdata.append("content",cmt_content);
        
        await Axios.post('http://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {status,message} = response.data;
            if(status=='500'){
                alert(message);
            }else if(status=="200"){
                this.commentUpload();
            }
        })
        .catch(error=>{
            alert('error')
        })

    }
    UploadButton=(props)=>(
        <TouchableOpacity onPress={()=>{this.commentValid()}}>
            <UploadIcon {...props}/>
        </TouchableOpacity>
    )

    renderPostMore=()=>(
        <TouchableOpacity  style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisibel:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    MoreAction = () =>(
        // <TopNavigationAction icon={()=><MoreIcon style={{width:35,height:35}}/>} onPress={() =>{this.setState({modalVisible:true})}}/>
        <Popover
        anchor={this.renderPostMore}
        visible={this.state.popoverVisibel}
        placement='bottom start'
        onBackdropPress={() => this.setState({popoverVisibel:false})}>
            <View>
                <TouchableOpacity 
                    onPress={()=>{this.postscrap();this.setState({popoverVisibel:false})}} 
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>스크랩</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{this.postBlameConfirm();this.setState({popoverVisibel:false})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>신고하기</Text>
                </TouchableOpacity>
            </View>
        </Popover>
    )
    postBlame = ()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
        .then(response=>{
            if(response.data.status ==500){
                alert(`${JSON.stringify(response.data.message)}`)
            }else{
                this.getPostData(this.state.post.post_id)
                alert(`${JSON.stringify(response.data.message)}`)
            }
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    postBlameConfirm = () =>{
        Alert.alert(
            "게시글",
            "이 게시글을 신고하시겠습니까?",
            [
                {
                    text: "Cancel",
                    onPress: () => alert('취소했습니다.')
                },
                { 
                    text: "OK", 
                    onPress: ()=> this.postBlame()
                }
            ],
            { cancelable: false }
        );
    }
    cmtBlame = (cmt_id)=>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        
        Axios.post('http://dev.unyict.org/api/postact/comment_blame',formdata)
        .then(response=>{
            if(response.data.status ==500){
                alert(`${JSON.stringify(response.data.message)}`)
            }else{
                alert(`${JSON.stringify(response.data.message)}`)
                this.getCommentData(this.state.post.post_id)
            }
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    cmtBlameConfirm = (cmt_id) =>{
        Alert.alert(
            "댓글",
            "이 댓글을 신고하시겠습니까?",
            [
                {
                    text: "Cancel",
                    onPress: () => alert('취소했습니다.')
                },
                { 
                    text: "OK", 
                    onPress: ()=> this.cmtBlame(cmt_id)
                }
            ],
            { cancelable: false }
        );
    }
    postLike = () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/post_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                alert(`${JSON.stringify(response.data.message)}`)
            }else{
                this.getPostData(this.state.post.post_id)
            }
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    cmtLike = (cmt_id) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/comment_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                alert(`${JSON.stringify(response.data.message)}`)
            }else{
            this.getCommentData(this.state.post.post_id)}
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    
    getCommentData = async (post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert('error')
        })
    }
    getPostData = async (post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
        })
        .catch((error)=>{
            alert('error')
        })
    }
     onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id)

    } 
    async componentDidMount(){
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})

    }
    renderPostBody = (post)=>{
        
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = post.post_content.replace(regex, '\n');

        return (
            <View style={{backgroundColor:'#F4F4F4', marginHorizontal:15,borderRadius:8,marginTop:5,marginBottom:10}} >
                <View style={{marginLeft:15,marginTop:10,marginBottom:13}}>
                    <View style={{display:"flex",flexDirection:'row'}}>
                        <StarIcon />
                        <View>
                            <Text>{post.display_name}</Text>
                            <PostTime datetime={post.post_datetime}/>
                        </View>
                    </View>
                </View>
                <View style={{marginLeft:15,paddingBottom:5}}>
                    <Text style={{fontSize:14,fontWeight:'bold'}}>{post.post_title}</Text>
                </View>
                <View style={{marginLeft:15,marginBottom:16}}>
                    <Text style={{fontSize:12,fontWeight:'800'}}>
                    {post_remove_tags}
                    </Text>
                </View>
                <View style={{paddingHorizontal:15,paddingVertical:15,display:"flex",flexDirection:"row",justifyContent:"flex-end"}}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity onPress={()=>this.postLike()} style={{marginHorizontal:6}}>
                            <Thumbsvg/>
                        </TouchableOpacity>
                        <Text>{post.post_like}</Text>
                        {/* <TouchableOpacity onPress={()=>alert("저장!")}>
                            <PlusIcon />
                            <Text>{post.scrap_count}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.postBlameConfirm()}>
                            <BlameIcon />
                            <Text>{post.post_blame}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        )
    }

    renderCommentsList=({item,index})=>(
        <View style={{marginVertical:3}}>
        {item.cmt_reply==""?
        null
        :
        <View style={{position:'absolute',left:0,paddingLeft:25}}>
            <ReplyLsvg />
        </View> 
        }
        <View 
            style ={{
                borderRadius:8,
                paddingRight:15,
                marginRight:15,
                paddingVertical:10,
                paddingLeft: 15,
                marginLeft:item.cmt_reply==""?15:50,
                backgroundColor:item.cmt_reply==""? item.cmt_id==this.state.cmt_id?'#EAB0B3': '#ffffff':'#f4f4f4'}}>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                    <StarIcon />
                    <View>
                        <Text category="s2">{item.cmt_nickname}</Text>
                        <PostTime datetime={item.cmt_datetime}/>
                    </View>
                </View>
                <View style={{display:'flex',flexDirection:'row'}}>
                    {/* <TouchableOpacity onPress={()=>this.cmtBlameConfirm(item.cmt_id)}>
                        <BlameIcon />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}>
                        <MoreSsvg/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{padding:5}}>
                <Text category="s1">{item.content}</Text>
            </View>
            <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                {item.cmt_reply ==""?
                <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replyModalVisible:true,cmt_id:item.cmt_id})}>
                    <ReplySsvg />
                </TouchableOpacity>
                :null
                }
                <TouchableOpacity style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}onPress={()=>this.cmtLike(item.cmt_id)}>
                    <Thumbsvg />
                </TouchableOpacity>
                    <Text>{item.cmt_like}</Text>
            </View>
        </View>
        </View>
    )
     render(){
        const {navigation,route} =this.props
        const {cmt_content,post,comment,modalVisible,replying,replyModalVisible} = this.state
         return(
        this.state.isLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>is Loading now...</Text>
            <Spinner size="giant"/>
        </View>
        :
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="" alignment="center" accessoryLeft={this.BackAction} accessoryRight={this.MoreAction} style={styles.topbar}/> 
            
            <Layout style={{flex:1}}>
                    <List
                    ref={"pstcmtlist"} 
                    data={comment}
                    ListHeaderComponent={this.renderPostBody(post)}
                    renderItem={this.renderCommentsList}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    style={{backgroundColor:'#ffffff'}}
                    />
            </Layout>
            <View style={{backgroundColor:'#ffffff',padding:8}}>
                {this.state.replying ?
                <TouchableOpacity onPress={this.commentWrite}>
                    <Text category="h2" style={{color:'#63579D'}}>X</Text>
                </TouchableOpacity>
                :
                null
                }
                <TextInput
                    ref="commentInput"
                    style={{backgroundColor:'#f4f4f4',borderRadius:14,fontSize:15}}
                    value={cmt_content}
                    placeholder={ replying?"대댓글" :"댓글"}
                    placeholderTextColor='#A897C2'
                    plac
                    multiline={true}
                    onChangeText={nextValue => this.setState({cmt_content:nextValue})}
                />
                <TouchableOpacity onPress={this.commentValid} style={{position:'absolute',right:10,bottom:5,width:50,height:50}}>
                    <UploadCirclesvg width={50} height={50}/>
                </TouchableOpacity>
                
            </View>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false})}
            >
                <View>
                    <TouchableOpacity 
                        onPress={()=>{this.cmtBlameConfirm();this.setState({modalVisible:false})}}
                        style={{padding:20,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4',backgroundColor:'#ffffff'}}>
                        <Text category='h3'>댓글 신고하기</Text>
                    </TouchableOpacity>
                </View>   
            </Modal>
            <Modal
                visible={replyModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({replyModalVisible:false})}
            >
                <View style ={{width:200,height:175,borderRadius:23,backgroundColor:'#ffffff'}}>
                    <View style={{flex:3 ,justifyContent:'center',alignItems:'center'}}>
                        <Text category='h1' style={{color:'#63579D',fontSize:13}}>
                        대댓글을 작성하시겠습니까?
                        </Text>   
                    </View>
                    <View style={{flex:1,display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity 
                            onPress={() =>{this.setState({replying:true,replyModalVisible:false}); this.refs.commentInput.focus()}}
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#63579D',fontSize:13,fontWeight:'400'}}>예</Text>
                        </TouchableOpacity>
                        <View style={{borderWidth:1,height:'80%',borderColor:"#F0F0F0"}}></View>
                        <TouchableOpacity 
                            onPress={() => this.setState({replyModalVisible:false,cmt_id:''})}
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontWeight:'400',color:'#63579D',fontSize:13}}>아니요</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </Modal>
        </SafeAreaView>
         )
     }
}


class MarketContent extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
            post : {} ,
            image : [],
            activeDot : 0,
            comment : '',
            cmt_content : '',
            isLoading : true,
            refreshing : false,
        }
    }

    async componentDidMount(){
        const post_id = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.map(function(item){
                    var image_info = {};
                    image_info['id'] = item.pfi_id;
                    image_info['title'] = item.pfi_originname;
                    image_info['url'] = item.origin_image_url;
                    return image_info;
                })});
            }
        })
        .catch((error)=>{
            alert(error)
        })
    }
    
    getCommentData = async (post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert('error')
        })
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    UproadIcon = (props) => (
        <TouchableWithoutFeedback>
          <Icon {...props} name='arrow-circle-up'/>
        </TouchableWithoutFeedback>
    )

    renderImage = ({item}) => {
        console.log(item.url)
        return (
        <Image source={{uri : 'http://dev.unyict.org/'+item.url}} style={{flex : 1, width:394, resizeMode:'cover'}}/>
        );
    }

    getItem = (data, index) => {
        return {
            id : this.state.image[index].id,
            title : this.state.image[index].title,
            url : this.state.image[index].url,
        }
    }

    
    renderCommentsList=({item,index})=>(
        <Card>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                <StarIcon />
                <Text category="s2">{item.cmt_nickname}</Text>
                </View>
                <HeartIcon onPress={()=>{alert('좋아요누르겠습니다.')}} />
            </View>
            <View style={{padding:5}}>
                <Text category="s1">{item.content}</Text>
            </View>
            <View style={{display:"flex", justifyContent:"flex-start",flexDirection:"row",alignItems:"center"}}>
                <Text category="s2">{item.cmt_datetime}</Text>
                <HeartIcon style ={{width:10,heigth:10}} />
                <Text>{item.cmt_like}</Text>
            </View>
        </Card>
    )
    
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id)

    }

    render(){

        const {post} = this.state;
        
        return(
            this.state.isLoading ?
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>is Loading now...</Text>
                <Spinner size="giant"/>
            </View>
            :
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="수수마켓" alignment="center" accessoryLeft={this.BackAction} style={styles.topbar}/>
                <KeyboardAvoidingView behavior={'height'} style={{flex:1}}>
                    <ScrollView>
                        <View>
                            <Slider image={this.state.image} navigation={this.props.navitation}/>
                        </View>
                        <View style={{}}>
                            <Layout>
                            <Text category='h2'>{post.post_title}</Text>
                            </Layout>
                            <Layout>
                            <Text category='h4'>{post.deal_price} 원</Text>
                            </Layout>
                        </View>
                        <Divider/>
                        <Layout style={{height:50,flexDirection:'row'}}>
                            <Layout style={{width:50}}>
                            <Image source={require('../market/asset/basic_user.png')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                            </Layout>
                            <Layout style={{justifyContent:'center'}}>
                            <Text>{post.post_username}</Text>
                            </Layout>
                        </Layout>
                        <Divider/>
                        <Layout style={{height:200}}>
                            <Text>Details</Text>
                            <Text> Place : {post.post_place}</Text>
                        </Layout>
                        <Divider/>
                        <Layout>
                            <Text>Comment</Text>
                            <List
                                ref={"pstcmtlist"} 
                                data={this.state.comment}
                                renderItem={this.renderCommentsList}
                                onRefresh={this.onRefresh}
                                refreshing={this.state.refreshing}
                            />
                            <Input
                                style={{flex:1, margin:15}}
                                size='large'
                                placeholder='댓글을 입력하세요.'
                                value={this.state.cmt_content}
                                multiline={true}
                                accessoryRight={this.UproadIcon}
                                onChangeText={nextValue => this.setState({comment : nextValue})}
                            />
                            <Layout style={{alignItems: "flex-end", marginHorizontal:20, marginBottom:20}}>
                            </Layout>
                        </Layout>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        
            )
    }

}



class AlbaContent extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            visible : false,
            OF_visible : false,
            post : {} ,
            thumb_image : '/react_native/AltruistApp/assets/images/noimage_120x90.gif',
            file_images : null,
            phoneNumber : '010 9999 9999',
            isLoading : true,
            image_height : 0,
        }
    }

    Alba_salary_type = [
        {color : 'green', str : '시'},
        {color : 'purple', str : '일'},
        {color : 'blue', str : '주'},
        {color : 'red', str : '월'},
    ]


    async componentDidMount(){
        const post_id = this.props.route.params;
        console.log(post_id);
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://10.0.2.2/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                this.setState({thumb_image: response.data.view.file_image.shift().origin_image_url});
                this.setState({
                    file_images : response.data.view.file_image.map(i => {
                        console.log('received image', i);
                        return {uri : 'http://10.0.2.2'+i.origin_image_url, height : this.scaledHeight(i.pfi_width, i.pfi_height, Dimensions.get('window').width)};
                    })
                })
                console.log(this.state.file_images);
            }
        })
        .catch((error)=>{
            alert(error)
        })
    }

    renderImage(image) {
        return <Image style={{width: '100%', height: image.height, resizeMode: 'contain'}} source={{uri : image.uri}}/>
    }

    scaledHeight(oldW, oldH, newW) {
        return (oldH / oldW) * newW;
    }
    
    setVisible(bool){
        this.setState({visible : bool});
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    UD_Action = () =>(
        <TopNavigationAction icon={HeartIcon} onPress={() =>{this.onClick_UD_Action()}}/>
    )
    onClick_UD_Action = () => {
        const buttons = ['수정', '삭제', '취소'];
        ActionSheet.show(
            {
                options: buttons,
                cancelButtonIndex: 2,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this.updateData();
                        break;
                    case 1:
                        this.deleteData(this.props.route.params.post_id)
                        break;
                    default:
                        break
                }
            }
        );

    };

    updateData = () => {
        alert('update');
    }

    deleteData = async(id) => {
        alert('delete');
        // var formdata =new FormData();
        // formdata.append("post_id", id);
        // formdata.append("modify_password", '1234');

        // await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        // .then(response => {
        //     if(response.status=='500'){
        //         alert(response.message)
        //     }else if(response.status=="200"){
        //         alert(response.message);
        //     }
        // })
        // .catch(error=>{
        //     alert(`게시글 삭제에 실패했습니다. ${error}`)
        // })
    }



    // getImageSize (uri, passProps) {
    //     const img_url = "http://10.0.2.2"+uri;
    //     const imagesMaxWidth = Dimensions.get('window').width;
    //     Image.getSize(img_url,(originalWidth, originalHeight) => {
    //             const optimalWidth = imagesMaxWidth <= originalWidth ? imagesMaxWidth : originalWidth;
    //             const optimalHeight = (optimalWidth * originalHeight) / originalWidth;
    //             this.setState({image_height:optimalHeight});
    //             console.log(this.state.image_height, optimalHeight);
    //         }
    //     );
    //     return <Image key={passProps.key} style={{width : '100%', height : this.state.image_height, resizeMode: 'contain'}} source={{ uri:img_url }}/>;
    // }

    render(){
        const {post} = this.state;
        // const defaultRenderer ={
        //     renderers:{
        //         img : (htmlAttribs, children, convertedCSSStyles, passProps) => this.img_return(htmlAttribs, passProps)
        //     }
        // }
        return(
            this.state.isLoading?
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>is Loading now...</Text>
                <Spinner size="giant"/>
            </View>
            :
            <Root>
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="채용정보" alignment="center" accessoryLeft={this.BackAction} accessoryRight={this.UD_Action} style={styles.topbar}/> 
                <Layout style={styles.container}>
                    <ScrollView style={{backgroundColor : 'lightgrey'}}>
                        <Card disabled={true} style={styles.item}>
                            <Text category='c2'>{post.post_datetime.substr(0,post.post_datetime.length-3)}</Text>
                            <View style={styles.title}>
                                <Text style={{margin : 10, fontSize : 28}}>{post.post_title}</Text>
                            </View>
                            <Layout style={styles.icons}>
                                <Icon
                                    style={{width:32,height:32}}
                                    fill={this.Alba_salary_type[post.alba_salary_type].color}
                                    name='star'
                                />
                                <Text category='h5'> {(post.alba_salary != '추후협의'?post.alba_salary+'원':post.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')} / </Text>
                                <Icon
                                    style={{width:32,height:32}}
                                    fill='black'
                                    name={!post.alba_type?'eye':'heart'}
                                />
                                <Text category='h5'> {post.alba_type == 0?'일일~3개월':'3개월이상'}</Text>
                            </Layout>
                            <Divider/>
                            <Layout style={{flexDirection:'row', alignItems : 'center'}}>
                                <Image style={{width : 80, height : 80, resizeMode:'contain'}} source={{uri:'http://10.0.2.2'+this.state.thumb_image}}/>
                                <Text category='h5' style={{margin : 15}}>{post.post_nickname}</Text>
                            </Layout>
                            {/* <Layout style ={styles.icons}>
                                <Icon
                                    style={{width:32,height:32, flex : 1}}
                                    fill='black'
                                    name='share'
                                />
                                <View style={{flex : 10, marginLeft:10}}>
                                    <Text category='h4'>{post.post_email}</Text>
                                    <Text category='h4'>{post.post_hp}</Text>
                                </View>
                            </Layout> */}
                        </Card>
                        
                        <Card disabled={true} style={styles.item}>
                            <Text category='p2' style={styles.subhead}>근무지역</Text>
                            <Text style={{margin : 5}}>{post.post_location}</Text>
                        </Card>
                        <Card disabled={true} style={styles.item}>
                            <Text category='p2' style={styles.subhead}>근무조건</Text>
                            <Layout style = {{flexDirection : 'row'}}>
                                <View style={{flex : 1, marginLeft : 5}}>
                                    <Text style={styles.gathertext}>급여</Text>
                                </View>
                                <View style={{flex : 5, flexDirection : 'row'}}>
                                    <Text style={{marginVertical : 5,color : this.Alba_salary_type[post.alba_salary_type].color}}>{this.Alba_salary_type[post.alba_salary_type].str} </Text>
                                    <Text style={styles.gather}>{(post.alba_salary != '추후협의'?post.alba_salary+'원':post.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')}</Text>
                                </View>
                            </Layout>
                            <Layout style = {{flexDirection : 'row'}}>
                                <View style={{flex : 1, marginLeft : 5}}>
                                    <Text style={styles.gathertext}>근무기간</Text>
                                </View>
                                <View style={{flex : 5}}>
                                    <Text style={styles.gather}>{!post.alba_type?'단기 (1일 ~ 3개월)':'장기 (3개월 ~)'}</Text>
                                </View>
                            </Layout>
                        </Card>
                        <Card disabled={true} style={styles.item}>
                            <HTML
                                html = {post.post_content}
                                imagesMaxWidth={Dimensions.get('window').width}
                                imagesInitialDimensions={{width:400, height : 400}}
                                />
                            {this.state.file_images ? this.state.file_images.map(i => <View key={i.uri}>{this.renderImage(i)}</View>) : null} 
                        </Card>
                    </ScrollView>
                    <Button style={styles.bottomButton} onPress={()=>this.setVisible(true)}>
                            지원하기
                    </Button>
                    <Modal
                            visible={this.state.visible}
                            backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                            onBackdropPress={() => this.setVisible(false)}>
                                <Card disabled={true}>
                                    <Layout style={{flexDirection:'row'}}>
                                        <View style={styles.modal_icons}>
                                            <Button
                                                appearance='ghost'
                                                accessoryLeft={HeartIcon}
                                                onPress={()=>{Linking.openURL(`tel:${post.post_ph}`)}}/>
                                            <Text>전화</Text>
                                        </View>
                                            <View style={styles.modal_icons}>
                                            <Button
                                                appearance='ghost'
                                                accessoryLeft={CommentIcon}
                                                onPress={()=>{Linking.openURL(`sms:${post.post_ph}`)}}/>
                                            <Text>메시지</Text>
                                        </View>
                                        <View style={styles.modal_icons}>
                                        <Button
                                                appearance='ghost'
                                                accessoryLeft={HeartIcon}
                                                onPress={()=>{Linking.openURL(`mailto:${post.post_email}`)}}/>
                                            <Text>이메일</Text>
                                        </View>
                                    </Layout>
                                    <Button onPress={()=>this.setVisible(false)} appearance='ghost' >
                                        취소
                                    </Button>
                                </Card>
                    </Modal>
                </Layout>
            </SafeAreaView>
            </Root>
            )
    }
}

const styles = StyleSheet.create({
    commentBlock: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical:10,
    },
    container : {
        flex : 1,
    },
    topbar : {
        backgroundColor : '#ffffff',
    },
    title : {
        backgroundColor : '#E9E9E9',
        borderRadius : 40,
        marginVertical : 8,
        justifyContent: 'center',
    },
    icons : { 
        alignItems: 'center',
        flexDirection:'row',
        marginVertical:10,
    },
    modal_icons : {
        justifyContent: 'center', 
        alignItems: 'center',
        margin : 10,
    },
    item : {
        marginHorizontal : 10,
        marginVertical : 5,
        paddingVertical : 10,
        borderRadius : 20,
    },
    subhead : {
        fontSize : 16,
        margin : 5,
    },
    gathertext : {
        color : 'gray',
        marginVertical : 5,
    },
    gather :{
        marginVertical : 5,
    },
    bottom: {
        width: '100%', 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    icon:{
        width: 20,height: 20
    },
    bottomButton: {
        position:'absolute',
        bottom : 10,
        left : '40%'
      },
});


export {defaultContent, MarketContent, AlbaContent, GominContent}