import React, { Component } from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView,Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, StatusBar, Dimensions, Linking, VirtualizedList,TextInput,Platform} from 'react-native';
import {Card,Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,List,Spinner, Modal, OverflowMenu, MenuItem,Popover} from '@ui-kitten/components'
import Axios from 'axios';
import {Signing} from './Context';
import ImageViewer from 'react-native-image-zoom-viewer';
import HTML from 'react-native-render-html';
import {ActionSheet, Root, Container, Row} from 'native-base';
import Slider from '../components/MarketSlider.component'
import {PostTime} from '../components/PostTime'
import Confirm from '../components/confirm.component'
import { WriteContentToptab } from '../components/WriteContentTopBar'
import ReplyLsvg from '../assets/icons/arrow-bended-large.svg'
import ReplySsvg from '../assets/icons/arrow-bended-small.svg'
import MoreLsvg from '../assets/icons/dotdotdot-large.svg'
import MoreSsvg from '../assets/icons/dotdotdot-small.svg'
import Backsvg from '../assets/icons/back-arrow-color.svg'
import Thumbsvg from '../assets/icons/thumb-up.svg'
import Thumbfillsvg from '../assets/icons/thumb-up-filled.svg';
import UploadCirclesvg from '../assets/icons/upload-circle.svg'
import PaperPlanesvg from '../assets/icons/paper-plane.svg'
import Callsvg from '../assets/icons/call.svg'
import Callmessagesvg from '../assets/icons/call-message.svg'
import Emailsvg from '../assets/icons/Email.svg'
import CallGraysvg from '../assets/icons/call-gray.svg'
import CallmessageGraysvg from '../assets/icons/call-message-gray.svg'
import EmailGraysvg from '../assets/icons/Email-gray.svg'
import Viewsvg from '../assets/icons/view.svg'
import Timesvg from '../assets/icons/Time.svg'
import Heartsvg from '../assets/icons/heart.svg'
import Heartfillsvg from '../assets/icons/heartfill.svg'


const BackIcon =  (props) =>(
    <Icon style={{width:24, height:24}} fill="#63579D" name = "back-arrow" pack="alticons"/>
)
const CommentIcon = (props)=>(
    <Icon style={styles.icon} fill='#8F9BB3' name="message-circle"/>
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
            content:'',
            cmt_content:'',
            cmt_id:'',
            mem_photo_url:'',
            replying:false,
            isLoading:true,
            refreshing:false,
            modalVisible:false,
            resultModalVisible:false,
            confirmModalVisible:false,
            spinnerModalVisible:false,
            popoverVisible:false,
            resultText : '',
            modalType : 0,
            commentSession :0,
            revise:false,
        }
    }
    
    static contextType = Signing;

    postDelete = async () => {
         if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
            var formdata = new FormData();
            formdata.append('post_id',this.state.post.post_id)
    
            await Axios.post('https://dev.unyict.org/api/postact/delete',formdata)
            .then((res)=>{
                this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
                this.props.navigation.goBack();
                this.props.route.params.OnGoback();
            })
            .catch((error)=>{
                this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
            })
             
         }
    }
    commentWrite= ()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             this.setState({replying:false, cmt_id:'', cmt_content:''});
             this.refs.commentInput.blur();
             console.log(this.refs);

         }

    }
    postscrap = async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {

            var formdata = new FormData();
            formdata.append('post_id',this.state.post.post_id)
            
            await Axios.post('https://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
            .then(response=>{
                if(response.data.success)
                    this.setState({resultModalVisible:true, replying:false, resultText:response.data.success});
                else if (response.data.error)
                    this.setState({resultModalVisible:true, replying:false, resultText:response.data.error});
            })
            .catch(error=>{
                this.setState({resultModalVisible:true, replying:false, resultText:error.message});
            })
        }
    }
    
    commentUpload= async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             const {cmt_content,post,cmt_id,revise}=this.state;
             var formdata = new FormData();
             formdata.append("post_id",post.post_id);
             formdata.append("cmt_content",cmt_content);
             cmt_id==''? null : formdata.append("cmt_id",cmt_id);
             revise? formdata.append("cmt_id",cmt_id):null;
             revise? formdata.append("mode",'cu'):null;

             Axios.post('https://dev.unyict.org/api/comment_write/update',formdata)
             .then(response=>{
                 const {status, message,cmt_id}=response.data;
                 if(status=='200'){
                     Keyboard.dismiss();
                     this.setState({commentWrited:!revise&&this.state.cmt_id=='' ? true :false,cmt_id:'', cmt_content:'', replying:false});
                     this.getCommentData(post.post_id);
                     formdata.append('cmt_id',cmt_id)
                    //  Axios.post('https://dev.unyict.org/api/comment_write/comment_noti',formdata)
                    //  .then(res=>{})
                    //  .catch(err=>{alert('댓글 알림 오류가 발생했습니다.')})
                 }else if(status=='500'){
                     this.setState({resultModalVisible:true, resultText:message});
                 }
             })
             .catch(error=>{
                 alert(error);
             })
        
        }
    }
    
    commentValid =async() =>{
        const {cmt_content} =this.state;
        var formdata = new FormData();
        formdata.append("content",cmt_content);
        
        await Axios.post('https://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {status,message} = response.data;
            if(status=='500'){
                this.setState({resultModalVisible:true,resultText:message});
            }else if(status=="200"){
                console.log("valid check");
                this.commentUpload();
            }
        })
        .catch(error=>{
            alert(error);
        })

    }
    UploadButton=(props)=>(
        <TouchableOpacity onPress={()=>{this.commentValid()}}>
            <UploadIcon {...props}/>
        </TouchableOpacity>
    )

    MoreAction=(props)=>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisible:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack();}}/>
    )
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    postBlame = async () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {

             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
     
             await Axios.post('https://dev.unyict.org/api/postact/post_blame',formdata)
             .then(response=>{
                 if(response.data.status == 500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }else{
                     this.getPostData(this.state.post.post_id)
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
         }
    }
    cmtBlame = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id);
     
             Axios.post('https://dev.unyict.org/api/postact/comment_blame',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
        }

    }
    cmtDelete = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id);
     
             Axios.post('https://dev.unyict.org/api/postact/delete_comment',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error.message});
             })
        
        }

    }
    postLike = () =>{
        
        //console.info('global.mem_id',global.mem_id);
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
           
        }else {

            var formdata = new FormData();
            formdata.append('post_id',this.state.post.post_id)
            formdata.append('like_type',1)
            
            Axios.post(`https://dev.unyict.org/api/postact/${this.state.post.is_liked?'cancel_post_like':'post_like'}`,formdata)
            .then(response=>{
                if(response.data.status ==500){
                    this.setState({resultModalVisible:true, resultText : response.data.message});
                }else{                    
                    this.getPostData(this.state.post.post_id)
                    !this.state.post.is_liked?
                        Axios.post(`https://dev.unyict.org/api/postact/post_like_noti`,formdata)
                        .then(res=>{})
                        .catch(err=>{alert('좋아요 알림 오류가 발생하였습니다.')})
                    :null
                }
            })
            .catch(error=>{
                this.setState({resultModalVisible:true, resultText : error.message});
            })
        }
    }
    cmtLike = (cmt_id, is_liked) =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('cmt_id',cmt_id)
             formdata.append('like_type',1)
             Axios.post(`https://dev.unyict.org/api/postact/${is_liked?'cancel_comment_like':'comment_like'}`,formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     alert(`${JSON.stringify(response.data.message)}`)
                 }else{
                 this.getCommentData(this.state.post.post_id)
                 !is_liked? 
                        Axios.post(`https://dev.unyict.org/api/postact/comment_like_noti`,formdata)
                        .then(response=>{
                        })
                        .catch(error=>{
                            alert(`${JSON.stringify(error)}`)
                        })
                    : null
                }
             })
             .catch(error=>{
                 alert(`${JSON.stringify(error)}`)
             })


         }
         
    }
    
    getCommentData = async (post_id)=>{
        await Axios.get(`https://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert(error);
        })
    }
    getPostData = async (post_id)=>{
        await Axios.get(`https://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({
                post:response.data.view.post, 
                mem_photo_url:response.data.mem_photo=="https://dev.unyict.org/uploads/cache/thumb-noimage_30x0.png"
                ?"https://dev.unyict.org/uploads/altwink-rect.png"
                :response.data.mem_photo
            });
            const regexf = /(<([^>]+)>)|&nbsp;/ig;
            const post_remove_tagsf = response.data.view.post.post_content.replace(regexf, '\n');
            this.setState({content:post_remove_tagsf})
        })
        .catch((error)=>{
            this.setState({resultModalVisible:true,resultText:'게시글이 존재 하지 않습니다.'})
        })
    }
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    } 
    async componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#FFFFFF');
            StatusBar.setBarStyle('dark-content');        
        }
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
    }

    componentWillUnmount(){
        StatusBar.setBackgroundColor('#B09BDE');
        StatusBar.setBarStyle('default');
    }
    modalList = [
        {
            text : '이 게시글을 신고하시겠습니까?',
            func : this.postBlame,
        },
        {
            text : '이 게시글을 삭제하시겠습니까?',
            func : this.postDelete,
        },
        {
            text : '이 댓글을 신고하시겠습니까?',
            func : this.cmtBlame,
        },
        {
            text : '이 댓글을 삭제하시겠습니까?',
            func : this.cmtDelete,
        },
        {
            text : '이 댓글을 수정하시겠습니까?',

        }
    ]

    renderPostBody = (post)=>{
        
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = post.post_content.replace(regex, '\n');
        return (
            <View style={{backgroundColor:'#F4F4F4',paddingTop:15, marginHorizontal:15,borderRadius:8,marginTop:5,marginBottom:10, paddingHorizontal:20}} >
                <View style={{paddingBottom:5,marginTop:10, marginBottom:10}}>
                    <Text style={{fontSize:18}} category='h3'>{post.post_title}</Text>
                </View>
                <View style={{marginBottom:16}}>
                    {/* <Text style={{fontSize:12,fontWeight:'800'}} category='s1'>
                        {post_remove_tags}
                    </Text> */}
                    <HTML 
                        baseFontStyle={{ fontFamily: "Roboto" }}
                        ignoredStyles={["font-family"]}
                        html={post.content} 
                        imagesMaxWidth={Dimensions.get('window').width}
                        onLinkPress={(event, href)=>{
                            Linking.openURL(href)
                        }}/>
                </View>
                <View style={{display:"flex",flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row'}}>
                        {post.post_anoymous_yn=='0'
                        ?<Image source={{uri : this.state.mem_photo_url}} style={{width:22, height:22, marginRight:5}}/>
                        :null
                        }
                        <View>
                            <Text category="h4" style={{fontSize:11, color:'#393939'}}>{post.display_name}</Text>
                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                <PostTime category="p1" style={{fontSize:9, color:'#878787'}} datetime={ post.post_datetime ==post.post_updated_datetime? post.post_datetime : post.post_updated_datetime}/>
                                {
                                    post.post_datetime ==post.post_updated_datetime?
                                    null
                                    :
                                    <Text category="p1" style={{fontSize:9, color:'#878787'}}> 수정</Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{paddingVertical:15,flexDirection:"row",justifyContent:"flex-end"}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.postLike()} style={{marginHorizontal:6}}>
                                {post.is_liked?<Heartfillsvg width='16' height='16'/>:<Heartsvg width='16' height='16'/>}
                            </TouchableOpacity>
                            <Text category="s1" style={{color:'#63579D', fontSize:13, marginBottom:-2}}>{post.post_like}</Text>
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
            </View>
        )
    }

    renderCommentsList=({item,index})=>(
        <View style={{marginVertical:0}}>
            {item.cmt_reply==""?
            index==0?
            null
            :
            <Divider style={{marginVertical:10, marginHorizontal:20}}/>
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
                    backgroundColor:item.cmt_id==this.state.cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4'}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
                        {/* <Image source={{uri : item.member_photo_url}} style={{width:20, height:20, marginRight:5}}/> */}
                        <View style={{marginLeft:5}}>
                            <Text category="s2" style={{fontSize:12}}>{item.cmt_nickname}</Text>
                            <PostTime style={{color:'#878787', fontSize:8}} datetime={item.cmt_datetime}/>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {/* <TouchableOpacity onPress={()=>this.cmtBlameConfirm(item.cmt_id)}>
                            <BlameIcon />
                        </TouchableOpacity> */}
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:true,cmt_id:item.cmt_id,commentSession : item.mem_id})}} 
                            style={{alignItems:'flex-end'}}>
                            <MoreSsvg width={16} height={16}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category='s1' style={{marginTop:5, fontSize:12}}>{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                    {item.cmt_reply ==""?
                    <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replying:true, cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                        <Text category="s1" style={{color:'#A897C2', fontSize:10}}>답글</Text>
                    </TouchableOpacity>
                    :null
                    }
                    <TouchableOpacity style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}onPress={()=>this.cmtLike(item.cmt_id, item.is_liked)}>
                        {item.is_liked?<Thumbfillsvg width={12} height={12}/>:<Thumbsvg width='12' height='12'/>}
                    </TouchableOpacity>
                        <Text category="s1" style={{color:'#A897C2', fontSize:10}}>{item.cmt_like}</Text>
                </View>
            </View>
        </View>
    )
     render(){
        const {navigation,route} =this.props
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, modalType, popoverVisible, commentWrited} = this.state
         return(
            <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={{flex:1}} 
         >
        <SafeAreaView style={{flex:1}}>
            <WriteContentToptab
                gbckfunc={() => {if(Platform.OS!=='ios'){
                    StatusBar.setBackgroundColor('#B09BDE')
                    StatusBar.setBarStyle('default')}
                    this.props.navigation.goBack()}
                }
                gbckuse={true}
                right={<this.MoreAction/>}/>
            {this.state.isLoading ?
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>is Loading now...</Text>
                    <Spinner size="giant"/>
                </View>
                :<Layout style={{flex:1}}>
                    <List
                    ref={"pstcmtlist"} 
                    data={comment}
                    ListHeaderComponent={this.renderPostBody(post)}
                    renderItem={this.renderCommentsList}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    style={{backgroundColor:'#ffffff'}}
                    onContentSizeChange={()=>{
                        commentWrited ? 
                        this.setState({commentWrited:false},()=>{this.refs.pstcmtlist.scrollToEnd()})
                        :
                        null
                    }}
                    />
                </Layout>
            }
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
                    style={Platform.OS=="ios"? styles.commentiOS : styles.commentAndroid}
                    value={cmt_content}
                    placeholder={ replying?"대댓글" :"댓글"}
                    placeholderTextColor='#A897C2'
                    plac
                    multiline={true}
                    onChangeText={nextValue => this.setState({cmt_content:nextValue})}
                />
                <TouchableOpacity onPress={()=>{Keyboard.dismiss();this.commentValid()}} style={{position:'absolute',right:10,bottom:5,width:50,height:50}}>
                    <Image 
                        style={{width:50,height:50}}
                        source={{uri:"https://dev.unyict.org/uploads/icons/upload-circle-png.png"}}
                    />
                </TouchableOpacity>
            </View>
            <Modal
                visible={popoverVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({popoverVisible:false})}>
                <View style={{borderRadius:15, backgroundColor:'white'}}>
                    <TouchableOpacity 
                        onPress={()=>{this.postscrap();this.setState({popoverVisible:false})}}
                        style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>스크랩</Text>
                    </TouchableOpacity>
                    <Divider style={{marginHorizontal : 10, color:'#E4E4E4'}}/>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 0})}}
                        style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>신고</Text>
                    </TouchableOpacity>
                    <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                    {this.context.session_mem_id== Math.abs(post.mem_id)
                    ?<View>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.setState({popoverVisible:false});
                                this.props.navigation.navigate('GominWrite',
                                    {
                                        statefunction:this.statefunction,
                                        mode:'edit',
                                        post:this.state.post,
                                        content:this.state.content,
                                    })}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>수정</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 1})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>삭제</Text>
                        </TouchableOpacity>
                    </View>
                    :null}
                </View>   
            </Modal>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})} >
                <View style={{borderRadius:15, backgroundColor:'white'}}>
                    {this.context.session_mem_id==this.state.commentSession?
                    <>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, revise:true}, this.refs.commentInput.focus())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 수정</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, modalType : 3, confirmModalVisible :true}, Keyboard.dismiss())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 삭제</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                    </>
                    :null}
                    <TouchableOpacity 
                        onPress={()=>{this.setState({modalVisible:false, modalType : 2, confirmModalVisible :true}, Keyboard.dismiss())}}
                        style={{padding : 10, paddingHorizontal:20, margin:5}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 신고</Text>
                    </TouchableOpacity> 
                </View>   
            </Modal>
            <Modal
                visible={resultModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultModalVisible:false})}>
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="닫기"
                    OnFrstPress={() => {
                        this.setState({resultModalVisible:false});
                        this.state.resultText.includes('존재') ? this.props.navigation.goBack() : null
                    }}
                />
            </Modal>
            <Modal
                visible={confirmModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({confirmModalVisible:false})}>
                <Confirm 
                    confirmText={this.modalList[modalType].text}
                    frstText="예"
                    OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                    scndText="아니오"
                    OnScndPress={() => this.setState({confirmModalVisible:false})}
                />
            </Modal>
            <Modal
                visible={spinnerModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}
            >
                <Spinner size='giant'/>
            </Modal>
            
        </SafeAreaView>
        </KeyboardAvoidingView>
         )
     }
}


class MarketContent extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
            post : {},
            image : [],
            comment : '',
            cmt_content : '',
            cmt_id:'',
            mem_photo_url:'',
            isLoading : true,
            refreshing : false,
            replying:false,
            modalVisible:false,
            popoverVisible:false,
            modalType : 0,
            resultModalVisible:false,
            resultText:'',
            confirmModalVisible:false,
            spinnerModalVisible:false,
            // dealStatusVisible:false
            commentSession : 0,
            revise : false,
        }
    }

    static contextType = Signing;
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    
    // componentWillUnmount() {
    //     StatusBar.setBackgroundColor('#B09BDE');
    //     StatusBar.setBarStyle('default');
    // }

    async componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#F4F4F4');
            StatusBar.setBarStyle('dark-content');
        }
        console.log(this.context.session_mem_id);
        const {post_id} = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
    }
    componentWillUnmount(){
        StatusBar.setBackgroundColor('#B09BDE');
        StatusBar.setBarStyle('default');
    }

    getPostData = async(post_id)=>{
        
        await Axios.get(`https://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({
                post:response.data.view.post, 
                mem_photo_url:response.data.mem_photo=="https://dev.unyict.org/uploads/cache/thumb-noimage_30x0.png"
                ?"https://dev.unyict.org/uploads/altwink-rect.png"
                :response.data.mem_photo
            });
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.map(function(item, index){
                    var image_info = {};
                    image_info['id'] = item.pfi_id;
                    image_info['title'] = item.pfi_originname;
                    image_info['url'] = item.origin_image_url;
                    image_info['index'] = index;
                    image_info['edit'] = true;
                    return image_info;
                })});
            }
        })
        .catch((error)=>{
            this.setState({resultModalVisible:true,resultText:'게시글이 존재 하지 않습니다.'})
        })
    }
    
    getCommentData = async (post_id)=>{
        await Axios.get(`https://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert('error')
        })
    }
    
    MoreAction = (props) =>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisible:true})}>
            <MoreLsvg height={18} width={18}/>
        </TouchableOpacity>
    )
    
    postscrap = async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             
             Axios.post('https://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
             .then(response=>{
                 if(response.data.success)
                     this.setState({resultModalVisible:true, replying:false, resultText:response.data.success});
                 else if (response.data.error)
                     this.setState({resultModalVisible:true, replying:false, resultText:response.data.error});
             })
             .catch(error=>{
                 this.setState({resultModalVisible:true, replying:false, resultText:error.message});
             })
        }

    }
    
    postBlame = ()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             
             Axios.post('https://dev.unyict.org/api/postact/post_blame',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }else{
                     this.getPostData(this.state.post.post_id)
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
        
        }

    }

    postDelete = async () => {
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {

             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             await Axios.post('https://dev.unyict.org/api/postact/delete',formdata)
             .then(res=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
                 this.props.navigation.goBack();
                 this.props.route.params.OnGoback();
             })
             .catch(err=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
             })
         }
         
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )

    renderImage = ({item}) => {
        console.log(item.url)
        return (
        <Image source={{uri : 'https://dev.unyict.org/'+item.url}} style={{flex : 1, width:394, resizeMode:'cover'}}/>
        );
    }

    getItem = (data, index) => {
        return {
            id : this.state.image[index].id,
            title : this.state.image[index].title,
            url : this.state.image[index].url,
        }
    }

    commentWrite= ()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             this.setState({replying:false,cmt_id:'', cmt_content:''})
             this.refs.commentInput.blur()
             console.log(this.refs)
         }
    }
    
    commentUpload= async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             const {cmt_content,post,cmt_id, revise}=this.state;
             var formdata = new FormData();
             formdata.append("post_id",post.post_id);
             formdata.append("cmt_content",cmt_content);
             cmt_id==''? null : formdata.append("cmt_id",cmt_id);
             revise? formdata.append("cmt_id",cmt_id):null;
             revise? formdata.append("mode",'cu'):null;
             // this.commentWrite()
             
             await Axios.post('https://dev.unyict.org/api/comment_write/update',formdata)
             .then(response=>{
                 const {status,message}=response.data;
                 if(status=='200'){
                     Keyboard.dismiss();
                     this.setState({commentWrited:!revise&&this.state.cmt_id=='' ? true :false,cmt_id:'', cmt_content:'', replying:false,});
                     this.getCommentData(post.post_id);
                     formdata.append('cmt_id',cmt_id)
                    //  Axios.post('https://dev.unyict.org/api/comment_write/comment_noti',formdata)
                    //  .then(res=>{})
                    //  .catch(err=>{alert('댓글 알림 오류가 발생했습니다.')})
                 }else if(status=="500"){
                     this.setState({resultModalVisible:true, resultText:message});
                 }
             })
             .catch(error=>{
                 alert(error);
             })
         
        }

    }
    
    commentValid =async() =>{
        const {cmt_content} =this.state;
        var formdata = new FormData();
        formdata.append("content",cmt_content);
        
        await Axios.post('https://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {status,message} = response.data;
            if(status=='500'){
                this.setState({resultModalVisible:true, resultText : message})
            }else if(status=="200"){
                this.commentUpload();
            }
        })
        .catch(error=>{
            alert(error);
        })

    }
    UploadButton=(props)=>(
        <TouchableOpacity onPress={()=>{this.commentValid()}}>
            <UploadIcon {...props}/>
        </TouchableOpacity>
    )
    
    cmtBlame = ()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id);
             
             Axios.post('https://dev.unyict.org/api/postact/comment_blame',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
         
        }

    }
    cmtDelete = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id)
             
             Axios.post('https://dev.unyict.org/api/postact/delete_comment',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error.message});
             })
        }

    }
    cmtLike = (cmt_id, is_liked) =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',cmt_id)
             formdata.append('like_type',1)
             Axios.post(`https://dev.unyict.org/api/postact/${is_liked?'cancel_comment_like':'comment_like'}`,formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.getCommentData(this.state.post.post_id)
                     !is_liked? 
                     Axios.post(`https://dev.unyict.org/api/postact/comment_like_noti`,formdata)
                     .then(response=>{
                     })
                     .catch(error=>{
                         alert(`${JSON.stringify(error)}`)
                     })
                 : null
                }
             })
             .catch(error=>{
                 this.setState({resultModalVisible:true, resultText : error.message});
             })
        }

    }

    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    }

    postDealStatus = async () => {
        const {post}=this.state;
        var formdata = new FormData();
        formdata.append('post_id', post.post_id);
        formdata.append('deal_status', 0)
        console.log(formdata);
        await Axios.post('https://dev.unyict.org/api/board_write/finish_deal',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
            }else{
                this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                this.props.navigation.goBack();
                this.props.route.params.OnGoback();
            }
        })
        //     this.setState({spinnerModalVisible:false})
        //     this.props.navigation.goBack();
        //     this.props.route.params.OnGoback();
        //     alert(JSON.stringify(res.data))
        // })
        .catch(err=>{
            alert(JSON.stringify(err))
        })
    }
    
    modalList = [
        {
            text : '이 게시글을 신고하시겠습니까?',
            func : this.postBlame,
        },
        {
            text : '이 게시글을 삭제하시겠습니까?',
            func : this.postDelete,
        },
        {
            text : '이 댓글을 신고하시겠습니까?',
            func : this.cmtBlame,
        },
        {
            text : '이 댓글을 삭제하시겠습니까?',
            func : this.cmtDelete,
        },
        {
            text : '상품을 판매완료 설정하시겠습니까?',
            func : this.postDealStatus,
        },
    ]

    renderCommentsList=({item,index})=>(
        <View 
            style={{
                marginHorizontal:10,
                borderTopLeftRadius: index==0? 10:0,
                borderTopRightRadius: index==0? 10:0,
                borderBottomLeftRadius: index==this.state.comment.length-1? 10:0,
                borderBottomRightRadius: index==this.state.comment.length-1? 10:0,
                backgroundColor:'#FFFFFF'
                }}>
            {item.cmt_reply==""?
            index==0?
            null
            :
            <Divider style={{marginTop:10, marginHorizontal:20}}/>
            :
            <View style={{position:'absolute',left:0,paddingLeft:25}}>
                <ReplyLsvg />
            </View> 
            }
            <View 
                style ={{
                    borderRadius:8,
                    marginRight:5,
                    padding:15,
                    marginLeft:item.cmt_reply==""?5:50,
                    backgroundColor:item.cmt_id==this.state.cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4'}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
                        <Image source={{
                            uri : item.member_photo_url=="https://dev.unyict.org/assets/images/member_default.gif"
                            ?"https://dev.unyict.org/uploads/altwink-rect.png"
                            :item.member_photo_url}} 
                            style={{width:20, height:20, marginRight:5}}/>
                        <View>
                            <Text category="s2" style={{fontSize:12}}>{item.cmt_nickname}</Text>
                            <PostTime style={{color:'#878787', fontSize:8}} datetime={item.cmt_datetime}/>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {/* <TouchableOpacity onPress={()=>this.cmtBlameConfirm(item.cmt_id)}>
                            <BlameIcon />
                        </TouchableOpacity> */}
                        <TouchableOpacity 
                            onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id, commentSession : item.mem_id})} 
                            style={{alignItems:'flex-end'}}>
                            <MoreSsvg width={16} height={16}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category='s1' style={{marginTop:5, fontSize:12}}>{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                    {item.cmt_reply ==""?
                    <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replying:true, cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                        <Text category="s1" style={{color:'#A897C2', fontSize:10}}>답글</Text>
                    </TouchableOpacity>
                    :null
                    }
                    <TouchableOpacity style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}onPress={()=>this.cmtLike(item.cmt_id, item.is_liked)}>
                        {item.is_liked?<Thumbfillsvg width={12} height={12}/>:<Thumbsvg width='12' height='12'/>}
                    </TouchableOpacity>
                        <Text category="s1" style={{color:'#A897C2', fontSize:10}}>{item.cmt_like}</Text>
                </View>
            </View>
        </View>
    )

    renderPostBody = (post, width) =>{

        return(
            <View style={{backgroundColor:'#F4F4F4'}}>
                <Layout style={{...styles.container, marginTop:0, paddingTop:40, paddingBottom:15}}>
                    <Layout>
                        <Slider width={width} height={width} image={this.state.image} navigation={this.props.navitation}/>
                    </Layout>
                    <Layout>
                        <Text style={{marginVertical:10, color:post.deal_status==0?'#D4787D':'#439DB1'}} category='c2'>
                            {post.deal_status==0? '•판매완료'
                            :post.deal_type==0? '•판매중 / 배송':post.deal_type==1? '•판매중 / 직거래':'•판매중 / 배송 & 직거래'}
                        </Text>
                    </Layout>
                    <Layout style={{paddingLeft:5}}>
                        <Layout style={{marginVertical:5}}>
                            <Text category='h1' style={{fontSize:25}}>{post.post_title}</Text>
                        </Layout>
                        <Layout style={{marginVertical : 10, marginBottom:15, flexDirection:'row'}}>
                            <Text category='h5' style={{color:'#989898'}}>가격</Text>
                            <Text category='h5' style={{marginLeft:10}}>{()=>(post.deal_price+'원').replace(/\d(?=(\d{3})+\원)/g, '$&,')}</Text>
                        </Layout>
                    </Layout>
                    <Divider/>
                    <Layout style={{height:30,flexDirection:'row', marginTop:15}}>
                        <Layout style={{width:40}}>
                            <Image source={{uri : this.state.mem_photo_url}} style={{flex : 1, width:40, height:40, borderRadius:5, resizeMode:'contain'}}/>
                        </Layout>
                        <Layout style={{flex:1, justifyContent:'center', paddingLeft:5}}>
                            <Text category='h5'>{post.post_nickname}</Text>
                        </Layout>
                        <Layout style={{flexDirection:'row'}}>
                            <Layout style={{justifyContent:'center', alignItems:'center'}}>
                                <Viewsvg width='15' height='15'/>
                                <Text style={{color:'#878787', fontSize:10}} category='s2'>{post.post_hit}</Text>
                            </Layout>
                            <Layout style={{justifyContent:'center', alignItems:'center', marginHorizontal:10}}>
                                <Timesvg width='15' height='15'/>
                                <PostTime style={{color:'#878787', fontSize:10}} datetime={post.post_datetime}/>
                            </Layout>
                        </Layout>
                    </Layout>
                </Layout>
                <Layout style={styles.container}>
                    <Text style={{marginBottom:5}} category='h2'>상품설명</Text>
                    {/* <HTML 
                        baseFontStyle={{ fontFamily: "Roboto" }}
                        ignoredStyles={["font-family"]}
                        html={post.post_content} 
                        imagesMaxWidth={Dimensions.get('screen').width}
                        onLinkPress={(event, href)=>{
                            Linking.openURL(href)
                    }}/> */}
                    <Text style={styles.marketText} category='s1'>{post.post_content}</Text>
                </Layout>
                <Layout style={styles.container}>
                    <Text style={{marginBottom:5}} category='h2'>상세정보</Text>
                    <Layout style={{flexDirection:'row'}}>
                        <Layout>
                            <Text style={styles.marketText} category='s1'>연락처</Text>
                            <Text style={styles.marketText} category='s1'>거래희망지역</Text>
                            <Text style={styles.marketText} category='s1'>거래방법</Text>
                        </Layout>
                        <Layout style={{marginLeft:20}}>
                            <Text style={styles.marketText} category='s1'>{post.post_hp}</Text>
                            <Text style={styles.marketText} category='s1'>{post.post_location}</Text>
                            <Text style={styles.marketText} category='s1'>{post.deal_type==0? '배송':post.deal_type==1? '직거래':'배송 & 직거래'}</Text>
                        </Layout>
                    </Layout>
                </Layout>
                <Text style={{margin:10}}></Text>
            </View>
        )
    }

    render(){

        const { width } = Dimensions.get("window");
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, popoverVisible, modalType,commentWrited} = this.state;

        console.log('post.deal_status : ', post.deal_status)
        console.log('post : ', post)
        return(
            <KeyboardAvoidingView
               behavior={Platform.OS == "ios" ? "padding" : ""}
               style={{flex:1}} 
            >

            <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                    backgroundColor='#F4F4F4'
                    gbckfunc={() => {
                        this.props.navigation.goBack();
                        if(Platform.OS!=='ios'){
                            StatusBar.setBackgroundColor('#B09BDE');
                            StatusBar.setBarStyle('default');}
                        }
                        }                        
                    gbckuse={true}
                    right={<this.MoreAction/>}/>
                {this.state.isLoading ?
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <Text>is Loading now...</Text>
                        <Spinner size="giant"/>
                    </View>
                    :<Layout style={{flex:1}}>
                        <List
                            ref={"pstcmtlist"} 
                            data={this.state.comment}
                            contentContainerStyle={styles.contentContainer}
                            ListHeaderComponent={this.renderPostBody(post, width)}
                            renderItem={this.renderCommentsList}
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}
                            style={{backgroundColor:'#F4F4F4'}}
                            onContentSizeChange={()=>{
                                commentWrited ? 
                                this.setState({commentWrited:false},()=>{this.refs.pstcmtlist.scrollToEnd()})
                                :
                                null
                            }}
                        />
                    </Layout>
                }
                <View style={{backgroundColor:'#f4f4f4',padding:8}}>
                    {this.state.replying ?
                    <TouchableOpacity onPress={this.commentWrite}>
                        <Text category="h2" style={{color:'#63579D'}}>X</Text>
                    </TouchableOpacity>
                    :
                    null
                    }
                    <TextInput
                        ref="commentInput"
                        style={Platform.OS=="ios"? styles.commentiOS : styles.commentAndroid}
                        value={cmt_content}
                        placeholder={ replying?"대댓글" :"댓글"}
                        placeholderTextColor='#63579D'
                        multiline={true}
                        onChangeText={nextValue => this.setState({cmt_content:nextValue})}
                    />
                    <TouchableOpacity onPress={()=>{Keyboard.dismiss();this.commentValid()}} style={{position:'absolute',right:10,bottom:5,width:50,height:50}}>
                        <Image 
                            style={{width:50,height:50}}
                            source={{uri:"https://dev.unyict.org/uploads/icons/upload-circle-png.png"}}
                        />
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={popoverVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({popoverVisible:false})}>
                    <View style={{borderRadius:15, backgroundColor:'white'}}>
                        <TouchableOpacity 
                            onPress={()=>{this.postscrap();this.setState({popoverVisible:false})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>스크랩</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#E4E4E4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 0})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>신고</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        {this.context.session_mem_id==post.mem_id
                        ?<View>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.setState({popoverVisible:false});
                                this.props.navigation.navigate('MarketWrite',
                                    {
                                        statefunction:this.statefunction,
                                        mode:'edit',
                                        post:this.state.post,
                                        image:this.state.image,
                                        content:this.state.content,
                                    })}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>수정</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 1})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>삭제</Text>
                        </TouchableOpacity>
                        {post.deal_status==1
                        ?<TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 4})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>판매완료</Text>
                        </TouchableOpacity>
                        :null}
                        </View>
                        :null}
                    </View>   
                </Modal>
                <Modal
                    visible={modalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}>
                    <View style={{borderRadius:15, backgroundColor:'white'}}>
                        {this.context.session_mem_id==this.state.commentSession?
                            <>
                            <TouchableOpacity 
                                onPress={()=>{this.setState({modalVisible:false, revise:true}, this.refs.commentInput.focus())}}
                                style={{padding : 10, paddingHorizontal:20, margin:5}}>
                                <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 수정</Text>
                            </TouchableOpacity>
                            <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                            </>
                        :null}
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, modalType : 2, confirmModalVisible :true}, Keyboard.dismiss())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 신고</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, modalType : 3, confirmModalVisible :true}, Keyboard.dismiss())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 삭제</Text>
                        </TouchableOpacity>
                    </View>   
                </Modal>
                <Modal
                    visible={resultModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({resultModalVisible:false})}
                    >
                    <Confirm 
                        type = 'result'
                        confirmText={this.state.resultText}
                        frstText="닫기"
                        OnFrstPress={() =>{
                            this.setState({resultModalVisible:false})
                            this.state.resultText.includes('존재') ? this.props.navigation.goBack() : null
                        }}
                    />
                </Modal>
                <Modal
                    visible={confirmModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({confirmModalVisible:false})}>
                    <Confirm 
                        confirmText={this.modalList[modalType].text}
                        frstText="예"
                        OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                        scndText="아니오"
                        OnScndPress={() => this.setState({confirmModalVisible:false})}/>
                </Modal>
                <Modal
                    visible={spinnerModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}>
                    <Spinner size='giant'/>
                </Modal>
            </SafeAreaView>
            </KeyboardAvoidingView>
        
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
            thumb_image : [],
            file_images : [],
            isLoading : true,
            image_height : 0,
            popoverVisible: false,
            resultModalVisible : false,
            resultText:'',
            confirmModalVisible : false,
            modalType : 0,
            spinnerModalVisible : false,
        }
    }

    static contextType = Signing;

    Alba_salary_type = ['시급', '일급', '주급', '월급'];

    async componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#F4F4F4');
            StatusBar.setBarStyle('dark-content');
        }
        const {post_id} = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    componentWillUnmount(){
        StatusBar.setBackgroundColor('#B09BDE');
        StatusBar.setBarStyle('default');
    }

    getPostData = async(post_id)=>{
        await Axios.get(`https://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                if(response.data.view.post.post_thumb_use > 0)
                    this.setState({thumb_image: response.data.view.file_image[0]});
                this.setState({
                    file_images : response.data.view.file_image.map((i, index) => {
                        return {
                            id : i.pfi_id,
                            edit : true,
                            index : index,
                            uri : i.origin_image_url, 
                            height : this.scaledHeight(i.pfi_width, i.pfi_height, Dimensions.get('window').width)
                        };
                    })
                })
            }
        })
        .catch((error)=>{
            this.setState({resultModalVisible:true,resultText:'게시글이 존재 하지 않습니다.'})
        })
    }

    renderImage(image, index) {
        if(index==0){
            return null;
        }
        else {
            return <Image style={{width: '100%', height: image.height, resizeMode: 'contain'}} source={{uri : image.uri}}/>
        }
    }

    scaledHeight(oldW, oldH, newW) {
        return (oldH / oldW) * newW;
    }
    
    setVisible(bool){
        this.setState({visible : bool});
    }
    MoreAction = (props) =>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisible:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    
    postscrap = async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {

             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             
             await Axios.post('https://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
             .then(response=>{
                 if(response.data.success)
                     this.setState({resultModalVisible:true, resultText:response.data.success});
                 else if (response.data.error)
                     this.setState({resultModalVisible:true, resultText:response.data.error});
             })
             .catch(error=>{
                 this.setState({resultModalVisible:true, resultText:error.message});
             })
         }
         
    }

    postBlame = async () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
     
             await Axios.post('https://dev.unyict.org/api/postact/post_blame',formdata)
             .then(response=>{
                 if(response.data.status == 500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }else{
                     this.getPostData(this.state.post.post_id);
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
         
        }
    }
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }

    postDelete = async () => {
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
     
             await Axios.post('https://dev.unyict.org/api/postact/delete',formdata)
             .then((res)=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
                 this.props.navigation.goBack();
                 this.props.route.params.OnGoback();
             })
             .catch((error)=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
             })
        }
    }

    modalList = [
        {
            text : '이 게시글을 신고하시겠습니까?',
            func : this.postBlame,
        },
        {
            text : '이 게시글을 삭제하시겠습니까?',
            func : this.postDelete,
        },
    ]

    render(){
        const {post, confirmModalVisible, resultModalVisible, spinnerModalVisible, modalType, popoverVisible} = this.state;
        
        return(
            <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                backgroundColor='#F4F4F4'
                gbckfunc={() => {
                    this.props.navigation.goBack();
                    if(Platform.OS!=='ios'){
                        StatusBar.setBackgroundColor('#B09BDE');
                        StatusBar.setBarStyle('default');}}
                    }            
                gbckuse={true}
                right={<this.MoreAction/>}/>
                {this.state.isLoading?
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>is Loading now...</Text>
                    <Spinner size="giant"/>
                </View>
                :<ScrollView style={{backgroundColor : '#F4F4F4'}}>
                    <Card disabled={true} style={styles.item}>
                        <Layout style={{flex:1, flexDirection:'row'}}>
                            {/* <View style={{flex:1}}>
                            </View> */}
                            <View style={{flex:1, flexDirection:'row', alignItems : 'center', justifyContent : 'center'}}>
                                {post.post_thumb_use > 0?<Image style={{width : 60, height : 60, borderRadius:10}} source={{uri:this.state.thumb_image.origin_image_url}}/>
                                :<Image style={{width : 60, height : 60, borderRadius:10}} source={require('../assets/images/noimage.png')}/>}
                                {/* <Text category='h5' style={{margin : 15}}>{post.post_nickname}</Text> */}
                            </View>
                            <View style={{flexDirection : 'row', justifyContent:'flex-end', position:'absolute', right:0, top:0}}>
                                <View style={{marginRight:0, alignItems:'center'}}>
                                    <Viewsvg width={15} height={15}/>
                                    <Text category='p1' style={{fontSize:10}}>{post.post_hit}</Text>
                                </View>
                                <View style={{marginLeft:10, alignItems:'center'}}>
                                    <Timesvg width={15} height={15}/>
                                    <PostTime category='p1' style={{fontSize:10}} datetime = {post.post_datetime}/>
                                </View>
                            </View>
                        </Layout>
                        <View style={styles.title}>
                            <Text category= 'h3' style={{margin : 10}}>{post.post_title}</Text>
                        </View>
                        <Layout style={styles.icons}>
                            <Text style={{color:'#FF6262'}} category='h5'>
                                {this.Alba_salary_type[post.alba_salary_type]}
                            </Text>
                            <Text category='h5'> {(post.alba_salary).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 / </Text>
                            <Text style={{color:'#7370DD'}} category='h5'>
                                {post.alba_type?'장기':'단기'}
                            </Text>
                            <Text category='h5'> / </Text>
                            <Text style={{color:'#393939'}} category='h5'>
                                연락처
                            </Text>
                            <Text category='h5'> {post.post_hp.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-")}</Text>
                        </Layout>
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
                            <View style={{flex : 5, flexDirection : 'row', marginLeft : 5}}>
                                <Text style={{color:'#FF6262', marginVertical : 5}}>
                                    {this.Alba_salary_type[post.alba_salary_type]+' '}
                                </Text>
                                <Text style={{marginVertical : 5}}>{(post.alba_salary).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Text>
                            </View>
                        </Layout>
                        <Layout style = {{flexDirection : 'row'}}>
                            <View style={{flex : 1, marginLeft : 5}}>
                                <Text style={styles.gathertext}>근무기간</Text>
                            </View>
                            <View style={{flex : 5, marginLeft : 5, flexDirection:'row'}}>
                                <Text style={{color:'#7370DD', marginVertical : 5}}>
                                    {post.alba_type?'장기':'단기'}
                                </Text>
                                <Text style={{marginVertical : 5,}}>{post.alba_type?'(3개월 ~)':'(1일 ~ 3개월)'}</Text>
                            </View>
                        </Layout>
                    </Card>
                    <Card disabled={true} style={styles.item}>
                        <HTML 
                            baseFontStyle={{ fontFamily: "Roboto" }}
                            ignoredStyles={["font-family"]}
                            html={post.post_content} 
                            imagesMaxWidth={Dimensions.get('window').width}
                            onLinkPress={(event, href)=>{
                                Linking.openURL(href)
                        }}/>
                        {this.state.file_images ? this.state.file_images.map((i,index) => <View key={i.uri}>{this.renderImage(i,index)}</View>) : null} 
                    </Card>
                </ScrollView>}
                    <TouchableOpacity style={styles.bottomButton} onPress={()=>this.setState({visible:true})}>
                        <PaperPlanesvg width = {42} height = {32}/>
                        <Text category = 'h2' style={{color : 'white'}}>지원하기</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={this.state.visible}
                        backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                        onBackdropPress={() => this.setState({visible:false})}>
                        <Card disabled={true} style={{borderRadius:20}}>
                            {!post.post_email&&!post.post_hp?
                                <View>
                                    <Text style={{marginBottom:8}}>상세정보에 기재된</Text>
                                    <Text >연락처로 지원해주세요.</Text>
                                </View>
                                :
                            <Layout style={{flexDirection:'row'}}>
                                <View style={styles.modal_icons}>
                                    {post.post_hp?
                                    <TouchableOpacity
                                        onPress={()=>{this.setState({visible:false});Linking.openURL(`tel:${post.post_hp}`)}}>
                                        <Callsvg width={40} height = {40}/>
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <CallGraysvg width={40} height = {40}/>
                                    </View>
                                    }
                                    <Text>전화</Text>
                                </View>
                                <View style={styles.modal_icons}>
                                    {post.post_hp?
                                    <TouchableOpacity
                                        onPress={()=>{this.setState({visible:false});Linking.openURL(`sms:${post.post_hp}`)}}>
                                        <Callmessagesvg width={40} height = {40}/>
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <CallmessageGraysvg width={40} height = {40}/>
                                    </View>
                                    }
                                    <Text>메시지</Text>
                                </View>
                                <View style={styles.modal_icons}>
                                    {post.post_email?
                                    <TouchableOpacity
                                            onPress={()=>{this.setState({visible:false});Linking.openURL(`mailto:${post.post_email}`)}}>
                                            <Emailsvg width={40} height = {40}/>
                                    </TouchableOpacity>
                                   :
                                    <View>
                                        <EmailGraysvg width={40} height = {40}/>
                                    </View>
                                    }
                                    <Text>이메일</Text>
                                </View>
                            </Layout>
                            }
                            <Button onPress={()=>this.setState({visible:false})} appearance='ghost' >
                                취소
                            </Button>
                        </Card>
                    </Modal>
                    <Modal
                        visible={popoverVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({popoverVisible:false})}>
                        <View style={{borderRadius:15, backgroundColor:'white'}}>
                            <TouchableOpacity 
                                onPress={()=>{this.postscrap();this.setState({popoverVisible:false})}}
                                style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                                <Text style={{fontSize:20, color:'#63579D'}} category='h3'>스크랩</Text>
                            </TouchableOpacity>
                            <Divider style={{marginHorizontal : 10, color:'#E4E4E4'}}/>
                            <TouchableOpacity 
                                onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 0})}}
                                style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                                <Text style={{fontSize:20, color:'#63579D'}} category='h3'>신고</Text>
                            </TouchableOpacity>
                            <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                            {this.context.session_mem_id==post.mem_id
                            ?<View>
                                <TouchableOpacity 
                                    onPress={()=>{
                                        this.setState({popoverVisible:false});
                                        this.props.navigation.navigate('AlbaWrite',
                                            {
                                                statefunction:this.statefunction,
                                                mode:'edit',
                                                post:this.state.post,
                                                file_images:this.state.file_images,
                                            })}}
                                    style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                                    <Text style={{fontSize:20, color:'#63579D'}} category='h3'>수정</Text>
                                </TouchableOpacity>
                                <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                                <TouchableOpacity 
                                    onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 1})}}
                                    style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                                    <Text style={{fontSize:20, color:'#63579D'}} category='h3'>삭제</Text>
                                </TouchableOpacity>
                            </View>
                            :null}
                        </View>   
                    </Modal>
                    <Modal
                        visible={resultModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({resultModalVisible:false})}
                        >
                        <Confirm 
                            type = 'result'
                            confirmText={this.state.resultText}
                            frstText="닫기"
                            OnFrstPress={() =>{    
                                this.setState({resultModalVisible:false})
                                this.state.resultText.includes('존재') ? this.props.navigation.goBack() : null
                            }}
                        />
                    </Modal>
                    <Modal
                        visible={confirmModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({confirmModalVisible:false})}>
                        <Confirm 
                            confirmText={this.modalList[modalType].text}
                            frstText="예"
                            OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                            scndText="아니오"
                            OnScndPress={() => this.setState({confirmModalVisible:false})}
                        />
                    </Modal>
                    <Modal
                        visible={spinnerModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}>
                        <Spinner size='giant'/>
                    </Modal>
            </SafeAreaView>
        )
    }
}
class IlbanContent extends Component {
    constructor(props){
        super(props);
        this.state={
            post:'',
            comment:'',
            content:'',
            cmt_content:'',
            cmt_id:'',
            image:[],
            mem_photo_url:'',
            replying:false,
            isLoading:true,
            refreshing:false,
            modalVisible:false,
            resultModalVisible:false,
            resultText : '',
            confirmModalVisible:false,
            spinnerModalVisible:false,
            popoverVisibel:false,
            imageModalVisible:false,
            imageIndex: 0,
            modalType : 0,
            commentSession : 0,
            revise : false,
        }
    }

    static contextType = Signing;

    postDelete = async () => {
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
     
             await Axios.post('https://dev.unyict.org/api/postact/delete',formdata)
             .then((res)=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
                 this.props.navigation.goBack();
                 this.props.route.params.OnGoback();
             })
             .catch((error)=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
             })
         
        }

    }
    commentWrite= ()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             this.setState({replying:false, cmt_id:'', cmt_content:''});
             this.refs.commentInput.blur();
             console.log(this.refs);
        }

    }
    postscrap = async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             
             await Axios.post('https://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
             .then(response=>{
                 if(response.data.success)
                     this.setState({resultModalVisible:true, replying:false, resultText:response.data.success});
                 else if (response.data.error)
                     this.setState({resultModalVisible:true, replying:false, resultText:response.data.error});
             })
             .catch(error=>{
                 this.setState({resultModalVisible:true, replying:false, resultText:error.message});
             })
        }

    }
    
    commentUpload= async()=>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             const {cmt_content,post,cmt_id, revise}=this.state;
             var formdata = new FormData();
             formdata.append("post_id",post.post_id);
             formdata.append("cmt_content",cmt_content);
             cmt_id==''? null : formdata.append("cmt_id",cmt_id);
             revise? formdata.append("cmt_id",cmt_id):null;
             revise? formdata.append("mode",'cu'):null;
             
             // this.commentWrite()
             
            await Axios.post('https://dev.unyict.org/api/comment_write/update',formdata)
             .then(response=>{
                 const {status, message,cmt_id}=response.data;
                 if(status=='200'){
                     Keyboard.dismiss();
                     this.setState({commentWrited:!revise&&this.state.cmt_id=='' ? true :false,cmt_id:'', cmt_content:'', replying:false, revise:false,});
                     this.getCommentData(post.post_id);
                    formdata.append('cmt_id',cmt_id)
                    // Axios.post('https://dev.unyict.org/api/comment_write/comment_noti',formdata)
                    // .then(res=>{})
                    // .catch(err=>{alert('댓글 알림 오류가 발생했습니다.')})
                 }else if(status=='500'){
                     this.setState({resultModalVisible:true, resultText:message,cmt_id:''});
                 }
             })
             .catch(error=>{
                 alert(error);
             })
        }

    }

    commentValid =async() =>{
        const {cmt_content} =this.state;
        var formdata = new FormData();
        formdata.append("content",cmt_content);
        
        await Axios.post('https://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {status,message} = response.data;
            if(status=='500'){
                this.setState({resultModalVisible:true, resultText : message})
            }else if(status=="200"){
                this.commentUpload();
            }
        })
        .catch(error=>{
            alert(error);
        })

    }
    UploadButton=(props)=>(
        <TouchableOpacity onPress={()=>{this.commentValid()}}>
            <UploadIcon {...props}/>
        </TouchableOpacity>
    )

    MoreAction=(props)=>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisible:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    BackAction = () =>(
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack();}}/>
    )
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    postBlame = async () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
     
             await Axios.post('https://dev.unyict.org/api/postact/post_blame',formdata)
             .then(response=>{
                 if(response.data.status == 500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }else{
                     this.getPostData(this.state.post.post_id)
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:response.data.message})
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error});
             })
         
        }

    }
    cmtBlame = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id);
     
             Axios.post('https://dev.unyict.org/api/postact/comment_blame',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message,cmt_id:''});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message,cmt_id:''});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error,cmt_id:''});
             })
        }

    }
    cmtDelete = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',this.state.cmt_id);
             Axios.post('https://dev.unyict.org/api/postact/delete_comment',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message,cmt_id:''});
                 }else{
                     this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message,cmt_id:''});
                     this.getCommentData(this.state.post.post_id)
                 }
             })
             .catch(error=>{
                 this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : error.message,cmt_id:''});
             })
        }

    }
    postLike = () =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
             var formdata = new FormData();
             formdata.append('post_id',this.state.post.post_id)
             formdata.append('like_type',1)
             Axios.post(this.state.post.is_liked?'https://dev.unyict.org/api/postact/cancel_post_like':'https://dev.unyict.org/api/postact/post_like',formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({resultModalVisible:true, resultText : response.data.message});
                 }else{
                     this.getPostData(this.state.post.post_id)
                     !this.state.post.is_liked?
                     Axios.post(`https://dev.unyict.org/api/postact/post_like_noti`,formdata)
                     .then(res=>{})
                     .catch(err=>{alert('좋아요 알림 오류가 발생하였습니다.')})
                 :null
                 }
             })
             .catch(error=>{
                 this.setState({resultModalVisible:true, resultText : error.message});
             })
         
        }

    }
    cmtLike = (cmt_id, is_liked) =>{
        if(!global.mem_id) {
            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
         }else {
         
             var formdata = new FormData();
             formdata.append('cmt_id',cmt_id)
             formdata.append('like_type',1)
             Axios.post(`https://dev.unyict.org/api/postact/${is_liked?'cancel_comment_like':'comment_like'}`,formdata)
             .then(response=>{
                 if(response.data.status ==500){
                     this.setState({resultModalVisible:true, resultText : response.data.message});
                 }else{
                 this.getCommentData(this.state.post.post_id)
                    !is_liked? 
                        Axios.post(`https://dev.unyict.org/api/postact/comment_like_noti`,formdata)
                        .then(response=>{
                        })
                        .catch(error=>{
                            alert(`${JSON.stringify(error)}`)
                        })
                    : null
                }
             })
             .catch(error=>{
                 alert(`${JSON.stringify(error)}`)
             })
        
        }

    }

    getCommentData = async (post_id)=>{
        await Axios.get(`https://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
        })
    }
    getPostData = async (post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            console.log('response.data.mem_photo : '+response.data.mem_photo)
            this.setState({
                post:response.data.view.post, 
                mem_photo_url:response.data.mem_photo=="https://dev.unyict.org/uploads/cache/thumb-noimage_30x0.png"
                ?"https://dev.unyict.org/uploads/altwink-rect.png"
                :response.data.mem_photo
            });
            const regexf = /(<([^>]+)>)|&nbsp;/ig;
            const post_remove_tagsf = response.data.view.post.post_content.replace(regexf, '\n');
            this.setState({content:post_remove_tagsf})
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.map(function(item, index){
                    var image_info = {};
                    image_info['props'] = {};
                    image_info['url'] = item.origin_image_url;
                    image_info['props']['path'] = item.origin_image_url;
                    image_info['props']['mime'] = "image/jpeg";
                    image_info['props']['id'] = item.pfi_id;
                    image_info['props']['title'] = item.pfi_originname;
                    image_info['props']['index'] = index;
                    image_info['props']['edit'] = true;
                    return image_info;
                })});
            }
        })
        .catch((error)=>{
            this.setState({resultModalVisible:true,resultText:'게시글이 존재 하지 않습니다.'});
        })
    }
    
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    } 

    async componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#FFFFFF');
            StatusBar.setBarStyle('dark-content');
        }

        this.setState({isLoading:true})
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{
            this.setState({isLoading:false})
        })
    }

    componentWillUnmount(){
        if(Platform.OS!=='ios'){
        StatusBar.setBackgroundColor('#B09BDE');
        }
        StatusBar.setBarStyle('default');
    }
    
    modalList = [
        {
            text : '이 게시글을 신고하시겠습니까?',
            func : this.postBlame,
        },
        {
            text : '이 게시글을 삭제하시겠습니까?',
            func : this.postDelete,
        },
        {
            text : '이 댓글을 신고하시겠습니까?',
            func : this.cmtBlame,
        },
        {
            text : '이 댓글을 삭제하시겠습니까?',
            func : this.cmtDelete,
        },
    ]

    renderPostBody = (post, image)=>{
        
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = post.post_content.replace(regex, '\n');
        return (
            <View style={{backgroundColor:'#F4F4F4', marginHorizontal:15,borderRadius:8,marginTop:5,marginBottom:20, paddingTop:10}} >
                <View style={{marginLeft:25,marginTop:10,marginBottom:13}}>
                    <View style={{display:"flex",flexDirection:'row'}}>
                        <Image source={{uri : this.state.mem_photo_url}} style={{width:23, height:23, marginRight:5}}/>
                        <View>
                            <Text category="s2" style={{fontSize:12}}>{post.display_name}</Text>
                            <View style={{display:"flex",flexDirection:'row'}}>
                                <PostTime style={{color:'#878787', fontSize:8}} datetime={ post.post_datetime ==post.post_updated_datetime? post.post_datetime : post.post_updated_datetime}/>
                                {
                                    post.post_datetime ==post.post_updated_datetime?
                                    null
                                    :
                                    <Text style={{color:'#878787', fontSize:8}} category="s2"> 수정됨</Text>
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginHorizontal:25,paddingBottom:5}}>
                    <Text style={{fontSize:16,fontWeight:'bold'}} category='h3'>{post.post_title}</Text>
                </View>
                <View style={{marginHorizontal:25,marginVertical:10}}>
                    {/* <Text style={{fontSize:13, fontWeight:'100'}} category='p1'>
                        {post_remove_tags}
                    </Text> */}
                    <HTML 
                        baseFontStyle={{ fontFamily: "Roboto" }}
                        ignoredStyles={["font-family"]}
                        html={post.content} 
                        imagesMaxWidth={Dimensions.get('window').width}
                        onLinkPress={(event, href)=>{
                            Linking.openURL(href)
                        }}/>
                </View>
                <View style={{alignItems:'center', width:'100%', paddingHorizontal:15}}>
                    {image
                    ?image.map((i, index)=>
                        <TouchableOpacity 
                            key={i.props.id}
                            style={{width:'100%', height:(Dimensions.get("window").width-60), marginTop:10}} 
                            onPress={()=>this.setState({imageIndex:index, imageModalVisible:true})}
                        >
                            <Image 
                                key={i.props.id}
                                source={{uri : i.url}}
                                style={{width:'100%', height:'100%'}}
                            />
                        </TouchableOpacity>
					)
                    :null}
                </View>
                <View style={{paddingHorizontal:15,paddingVertical:15,display:"flex",flexDirection:"row",justifyContent:"flex-end"}}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity onPress={()=>this.postLike()} style={{marginHorizontal:6}}>
                            {post.is_liked?<Thumbfillsvg width = {18} height={18}/>:<Thumbsvg width='18' height='18'/>}
                        </TouchableOpacity>
                        <Text category="s1" style={{color:'#A897C2', fontSize:15}}>{post.post_like}</Text>
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
        <View style={{marginVertical:0}}>
            {item.cmt_reply==""?
            index==0?
            null
            :
            <Divider style={{marginVertical:10, marginHorizontal:20}}/>
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
                    backgroundColor:item.cmt_id==this.state.cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4'}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
                        <Image source={{
                            uri : item.member_photo_url=="https://dev.unyict.org/assets/images/member_default.gif"
                            ?"https://dev.unyict.org/uploads/altwink-rect.png"
                            :item.member_photo_url}} 
                            style={{width:20, height:20, marginRight:5}}/>
                        <View>
                            <Text category="s2" style={{fontSize:12}}>{item.cmt_nickname}</Text>
                            <PostTime style={{color:'#878787', fontSize:8}} datetime={item.cmt_datetime}/>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {/* <TouchableOpacity onPress={()=>this.cmtBlameConfirm(item.cmt_id)}>
                            <BlameIcon />
                        </TouchableOpacity> */}
                        <TouchableOpacity 
                            onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id, commentSession : item.mem_id})} 
                            style={{alignItems:'flex-end'}}
                        >
                            <MoreSsvg width={16} height={16}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category='s1' style={{marginTop:5, fontSize:12}}>{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                    {item.cmt_reply ==""?
                    <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replying:true, cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                        <Text category="s1" style={{color:'#A897C2', fontSize:10}}>답글</Text>
                    </TouchableOpacity>
                    :null
                    }
                    <TouchableOpacity style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}onPress={()=>this.cmtLike(item.cmt_id, item.is_liked)}>
                        {item.is_liked?<Thumbfillsvg width='12' height='12'/>:<Thumbsvg width='12' height='12'/>}
                    </TouchableOpacity>
                    <Text category="s1" style={{color:'#A897C2', fontSize:10}}>{item.cmt_like}</Text>
                </View>
            </View>
        </View>
    )
     render(){

        const {navigation,route} =this.props
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, modalType, imageModalVisible, popoverVisible, imageIndex, image,commentWrited} = this.state

        return(
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={{flex:1}} 
        >
        <SafeAreaView style={{flex:1}}>
            <WriteContentToptab
                gbckfunc={() => {
                    this.props.navigation.goBack();
                    if(Platform.OS!=='ios'){
                        StatusBar.setBackgroundColor('#B09BDE');
                        StatusBar.setBarStyle('default');}
                    }
                    }
                gbckuse={true}
                right={<this.MoreAction/>}
                />
            {this.state.isLoading ?
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text>is Loading now...</Text>
                    <Spinner size="giant"/>
                </View>
                :<Layout style={{flex:1}}>
                    <List
                        ref={"pstcmtlist"} 
                        data={comment}
                        ListHeaderComponent={this.renderPostBody(post, image)}
                        renderItem={this.renderCommentsList}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        onContentSizeChange={()=>{
                            commentWrited ? 
                            this.setState({commentWrited:false},()=>{this.refs.pstcmtlist.scrollToEnd()})
                            :
                            null
                        }}
                        style={{backgroundColor:'#ffffff'}}
                    />
                </Layout>
            }
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
                    style={Platform.OS=="ios"? styles.commentiOS : styles.commentAndroid}
                    value={cmt_content}
                    placeholder={ replying?"대댓글" :"댓글"}
                    placeholderTextColor='#A897C2'
                    plac
                    multiline={true}
                    onChangeText={nextValue => this.setState({cmt_content:nextValue})}
                />
                <TouchableOpacity onPress={()=>{Keyboard.dismiss();this.commentValid();}} style={{position:'absolute',right:10,bottom:5,width:50,height:50}}>
                    <Image 
                        style={{width:50,height:50}}
                        source={{uri:"https://dev.unyict.org/uploads/icons/upload-circle-png.png"}}
                     />
                </TouchableOpacity>
            </View>
            <Modal
                visible={popoverVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({popoverVisible:false})}>
                <View style={{borderRadius:15, backgroundColor:'white'}}>
                    <TouchableOpacity 
                        onPress={()=>{this.postscrap();this.setState({popoverVisible:false})}}
                        style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>스크랩</Text>
                    </TouchableOpacity>
                    <Divider style={{marginHorizontal : 10, color:'#E4E4E4'}}/>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 0})}}
                        style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>신고</Text>
                    </TouchableOpacity>
                    <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                    {this.context.session_mem_id==post.mem_id
                    ?<View>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.setState({popoverVisible:false});
                                console.log(this.state.image);
                                this.props.navigation.navigate('IlbanWrite',
                                    {
                                        statefunction:this.statefunction,
                                        mode:'edit',
                                        post:this.state.post,
                                        image:this.state.image,
                                        content:this.state.content,
                                    })}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>수정</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisible:false, confirmModalVisible:true, modalType : 1})}}
                            style={{padding : 10, paddingHorizontal:40, margin:5, alignItems:'center'}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>삭제</Text>
                        </TouchableOpacity>
                    </View>
                    :null}
                </View>   
            </Modal>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}>
                <View style={{borderRadius:15, backgroundColor:'white'}}>
                    {this.context.session_mem_id==this.state.commentSession?
                        <>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, revise:true}, this.refs.commentInput.focus())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 수정</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        <TouchableOpacity 
                            onPress={()=>{this.setState({modalVisible:false, modalType : 3, confirmModalVisible :true}, Keyboard.dismiss())}}
                            style={{padding : 10, paddingHorizontal:20, margin:5}}>
                            <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 삭제</Text>
                        </TouchableOpacity>
                        <Divider style={{marginHorizontal : 10, color:'#F4F4F4'}}/>
                        </>
                    :null}
                    <TouchableOpacity 
                        onPress={()=>{this.setState({modalVisible:false, modalType : 2, confirmModalVisible :true}, Keyboard.dismiss())}}
                        style={{padding : 10, paddingHorizontal:20, margin:5}}>
                        <Text style={{fontSize:20, color:'#63579D'}} category='h3'>댓글 신고</Text>
                    </TouchableOpacity>
                </View>   
            </Modal>
            <Modal
                visible={resultModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultModalVisible:false})}
                >
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="닫기"
                    OnFrstPress={() =>{
                        this.setState({resultModalVisible:false});
                        this.state.resultText.includes('존재') ? this.props.navigation.goBack() : null
                    }}
                />
            </Modal>
            <Modal
                visible={confirmModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({confirmModalVisible:false})}>
                <Confirm 
                    confirmText={this.modalList[modalType].text}
                    frstText="예"
                    OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                    scndText="아니오"
                    OnScndPress={() => this.setState({confirmModalVisible:false})}/>
            </Modal>
            <Modal
                visible={spinnerModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.7)'}}>
                <Spinner size='giant'/>
            </Modal>
            <Modal
                visible={imageModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,1)'}}
                onBackdropPress={() => this.setState({imageModalVisible:false})}
                style={{width:'100%', height:Dimensions.get("window").height}}
                transparent={true}
            >
                <ImageViewer
                    imageUrls={image}
                    index={imageIndex}
                    onSwipeDown={()=>this.setState({imageModalVisible:false})}
                    enableSwipeDown={true}
                    renderHeader={()=>
                        <View style={{alignItems:'flex-end', paddingTop:20, paddingRight:10}}>
                            <TouchableWithoutFeedback onPress={()=>this.setState({imageModalVisible:false})}>
                                <Icon style={{width:30, height:30}} fill='#FFFFFF' name='close-outline'/>
                            </TouchableWithoutFeedback>
                        </View>
                    }
                />
            </Modal>
        </SafeAreaView>
            </KeyboardAvoidingView>
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
        borderRadius : 10,
        padding : 15,
        marginHorizontal : 10,
        marginTop : 10,
        paddingBottom : 25
    }, 
    contentContainer : {
        borderRadius : 10,
        backgroundColor:'#F4F4F4',
    },
    topbar : {
        backgroundColor : '#F4F4F4',
        height : 40,
        minHeight : 0,
    },
    title : {
        backgroundColor : '#E9E9E9',
        borderRadius : 40,
        marginVertical : 8,
        justifyContent: 'center',
    },
    icons : { 
        alignItems: 'center',
        justifyContent: 'center',
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
        alignSelf: 'center',
        borderRadius : 20,
        padding : 10,
        backgroundColor : '#978DC7',
        flexDirection : 'row',
    },
    tagstyle:{
        borderRadius : 20, 
        paddingHorizontal : 5,
        textAlignVertical : 'center',
        justifyContent : 'center',
        color : 'white',
    },
    comment: {
        borderRadius:8,
        paddingRight:15,
        marginRight:15,
        paddingVertical:10,
        paddingLeft: 15,
    },
    marketText: {
        marginTop:10,
        marginLeft: 10
    },
    commentAndroid:{
        backgroundColor:'#f4f4f4',
        borderRadius:14,
        fontSize:14,
        paddingRight:60,
    },
    commentiOS:{
        backgroundColor:'#f4f4f4',
        borderRadius:14,
        fontSize:18,
        textAlignVertical:'center',
        paddingHorizontal:'3%',
        minHeight:50
    },
    
});


export {defaultContent, MarketContent, AlbaContent, GominContent, IlbanContent}