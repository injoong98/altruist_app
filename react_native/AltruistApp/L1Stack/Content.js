import React, { Component } from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView,Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, StatusBar, Dimensions, Linking, VirtualizedList,TextInput} from 'react-native';
import {Card,Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,List,Spinner, Modal, OverflowMenu, MenuItem,Popover} from '@ui-kitten/components'
import Axios from 'axios';
import ImageViewer from 'react-native-image-zoom-viewer';
import HTML from 'react-native-render-html';
import {ActionSheet, Root, Container, Row} from 'native-base';
import Slider from '../components/MarketSlider.component'
import { Alert } from 'react-native';
import {PostTime} from '../components/PostTime'
import Confirm from '../components/confirm.component'
import { WriteContentToptab } from '../components/WriteContentTopBar'
import ReplyLsvg from '../assets/icons/arrow-bended-large.svg'
import ReplySsvg from '../assets/icons/arrow-bended-small.svg'
import MoreLsvg from '../assets/icons/dotdotdot-large.svg'
import MoreSsvg from '../assets/icons/dotdotdot-small.svg'
import Backsvg from '../assets/icons/back-arrow-color.svg'
import Thumbsvg from '../assets/icons/thumb-up.svg'
import UploadCirclesvg from '../assets/icons/upload-circle.svg'
import PaperPlanesvg from '../assets/icons/paper-plane.svg'
import Callsvg from '../assets/icons/call.svg'
import Callmessagesvg from '../assets/icons/call-message.svg'
import Emailsvg from '../assets/icons/Email.svg'
import Viewsvg from '../assets/icons/view.svg'
import Timesvg from '../assets/icons/Time.svg'


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
        }
    }

    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then((res)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
        })
        .catch((error)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
        })
    }
    commentWrite= ()=>{
        this.setState({replying:false, cmt_id:'', cmt_content:''});
        this.refs.commentInput.blur();
        console.log(this.refs);
    }
    postscrap = async()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        await Axios.post('http://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
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
    
    commentUpload= async()=>{
        const {cmt_content,post,cmt_id}=this.state;
        var formdata = new FormData();
        formdata.append("post_id",post.post_id);
        formdata.append("cmt_content",cmt_content);
        cmt_id==''? null : formdata.append("cmt_id",cmt_id);
        
        Axios.post('http://dev.unyict.org/api/comment_write/update',formdata)
        .then(response=>{
            const {status, message}=response.data;
            if(status=='200'){
                Keyboard.dismiss();
                this.getCommentData(post.post_id);
                this.setState({cmt_id:'', cmt_content:'', replying:false});

                this.refs.pstcmtlist.scrollToEnd();
            }else if(status=='500'){
                this.setState({resultModalVisible:true, resultText:message});
            }
        })
        .catch(error=>{
            alert(error);
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
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack();this.props.route.params.OnGoback();}}/>
    )
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    postBlame = async () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
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
    cmtBlame = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);

        Axios.post('http://dev.unyict.org/api/postact/comment_blame',formdata)
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
    cmtDelete = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);

        Axios.post('http://dev.unyict.org/api/postact/delete_comment',formdata)
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
    postLike = () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/post_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({resultModalVisible:true, resultText : response.data.message});
            }else{
                this.getPostData(this.state.post.post_id)
            }
        })
        .catch(error=>{
            this.setState({resultModalVisible:true, resultText : error.message});
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
            alert(error);
        })
    }
    getPostData = async (post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post});
            const regexf = /(<([^>]+)>)|&nbsp;/ig;
            const post_remove_tagsf = response.data.view.post.post_content.replace(regexf, '\n');
            this.setState({content:post_remove_tagsf})
        })
        .catch((error)=>{
            alert(JSON.stringify(error))
        })
    }
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    } 
    async componentDidMount(){
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
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
                            <View style={{display:"flex",flexDirection:'row'}}>
                                <PostTime datetime={ post.post_datetime ==post.post_updated_datetime? post.post_datetime : post.post_updated_datetime}/>
                                {
                                    post.post_datetime ==post.post_updated_datetime?
                                    null
                                    :
                                    <Text category="s2"> 수정됨</Text>
                                }
                            </View>
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
                backgroundColor:item.cmt_id==this.state.cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4'}}>
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
                    <TouchableOpacity onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id})} style={{width:10,alignItems:'flex-end'}}>
                        <MoreSsvg/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{padding:5}}>
                <Text category="s1">{item.cmt_content}</Text>
            </View>
            <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                {item.cmt_reply ==""?
                <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replying:true, cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                    <Text>답글</Text>
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
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, modalType, popoverVisible} = this.state
         return(
        this.state.isLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>is Loading now...</Text>
            <Spinner size="giant"/>
        </View>
        :
        <SafeAreaView style={{flex:1}}>
            <WriteContentToptab
                gbckfunc={() => {
                    this.props.navigation.goBack();
                    StatusBar.setBackgroundColor('#B09BDE');
                    StatusBar.setBarStyle('default');}}
                gbckuse={true}
                right={<this.MoreAction/>}/>
            <TouchableWithoutFeedback onPress={()=>{ this.commentWrite; Keyboard.dismiss()}}>
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
            </TouchableWithoutFeedback>
            
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
            </Modal>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})} >
                <View>
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
                onBackdropPress={() => this.setState({resultModalVisible:false})}>
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="닫기"
                    OnFrstPress={() => this.setState({resultModalVisible:false})}
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
        }
    }
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    
    // componentWillUnmount() {
    //     StatusBar.setBackgroundColor('#B09BDE');
    //     StatusBar.setBarStyle('default');
    // }

    async componentDidMount(){
        StatusBar.setBackgroundColor('#F4F4F4');
        StatusBar.setBarStyle('dark-content');
        const {post_id} = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
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
            alert(JSON.stringify(error))
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
    
    MoreAction = (props) =>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisible:true})}>
            <MoreLsvg height={18} width={18}/>
        </TouchableOpacity>
    )
    
    postscrap = async()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        Axios.post('http://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
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
    
    postBlame = ()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
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

    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        console.log(formdata);
        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then(res=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
        })
        .catch(err=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
        })
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
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

    commentWrite= ()=>{
        this.setState({replying:false,cmt_id:'', cmt_content:''})
        this.refs.commentInput.blur()
        console.log(this.refs)
    }
    
    commentUpload= async()=>{
        const {cmt_content,post,cmt_id}=this.state;
        var formdata = new FormData();
        formdata.append("post_id",post.post_id);
        formdata.append("cmt_content",cmt_content);
        cmt_id==''? null : formdata.append("cmt_id",cmt_id);
        
        // this.commentWrite()
        
        await Axios.post('http://dev.unyict.org/api/comment_write/update',formdata)
        .then(response=>{
            const {status,message}=response.data;
            if(status=='200'){
                Keyboard.dismiss();
                this.getCommentData(post.post_id);
                this.setState({cmt_id:'', cmt_content:'', replying:false});

                this.refs.pstcmtlist.scrollToEnd();
            }else if(status=="500"){
                this.setState({resultModalVisible:true, resultText:message});
            }
        })
        .catch(error=>{
            alert(error);
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
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);
        
        Axios.post('http://dev.unyict.org/api/postact/comment_blame',formdata)
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
    cmtDelete = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id)
        
        Axios.post('http://dev.unyict.org/api/postact/delete_comment',formdata)
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
    cmtLike = (cmt_id) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/comment_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({resultModalVisible:true, resultText : response.data.message});
            }else{
                this.getCommentData(this.state.post.post_id)}
        })
        .catch(error=>{
            this.setState({resultModalVisible:true, resultText : error.message});
        })
    }

    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    }

    // postDealStatus = async () => {
    //     var formdata = new FormData();
    //     formdata.append('deal_status', 0);
    //     console.log(formdata);
    //     await Axios.post('http://dev.unyict.org/api/board_write/write/b-a-2',formdata)
    //     .then(res=>{
    //         this.setState({spinnerModalVisible:false})
    //         this.props.navigation.goBack();
    //         this.props.route.params.OnGoback();
    //         alert(JSON.stringify(res.data))
    //     })
    //     .catch(err=>{
    //         alert(JSON.stringify(err))
    //     })
    // }
    
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

    renderCommentsList=({item,index})=>(
        <Layout style={{padding:15, marginHorizontal:10}}>
            {item.cmt_reply==""?
            null
            :
            <View style={{position:'absolute',left:0,paddingLeft:25}}>
                <ReplyLsvg />
            </View> 
            }
            <Layout 
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
                        <TouchableOpacity onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id})} style={{width:10,alignItems:'flex-end'}}>
                            <MoreSsvg/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category="s1">{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                    {item.cmt_reply ==""?
                    <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replyModalVisible:true,cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                        <Text>답변</Text>
                    </TouchableOpacity>
                    :null
                    }
                    <TouchableOpacity style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}onPress={()=>this.cmtLike(item.cmt_id)}>
                        <Thumbsvg />
                    </TouchableOpacity>
                        <Text>{item.cmt_like}</Text>
                </View>
            </Layout>
            <Divider/>
        </Layout>
    )
    

    renderPostBody = (post, width) =>{

        return(
            <View style={{backgroundColor:'#F4F4F4'}}>
                <Layout style={{...styles.container, marginTop:0, paddingTop:40, paddingBottom:15}}>
                    <Layout>
                        <Slider width={width} height={width} image={this.state.image} navigation={this.props.navitation}/>
                    </Layout>
                    <Layout>
                        <Text style={{marginVertical:10, color:'#439DB1'}} category='c2'>
                            {post.deal_status=0? '•판매완료'
                            :post.deal_type==0? '•판매중 / 배송':post.deal_type==1? '•판매중 / 직거래':'•판매중 / 배송 & 직거래'}
                        </Text>
                    </Layout>
                    <Layout style={{paddingLeft:5}}>
                        <Layout style={{marginVertical:5}}>
                            <Text category='h1' style={{fontSize:25}}>{post.post_title}</Text>
                        </Layout>
                        <Layout style={{marginVertical : 10, marginBottom:15, flexDirection:'row'}}>
                            <Text category='h5' style={{color:'#989898'}}>가격</Text>
                            <Text category='h5' style={{marginLeft:20}}>{post.deal_price} 원</Text>
                        </Layout>
                    </Layout>
                    <Divider/>
                    <Layout style={{height:30,flexDirection:'row', marginTop:15}}>
                        <Layout style={{width:30}}>
                            <Image source={require('../assets/images/icon-social-dark.png')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                        </Layout>
                        <Layout style={{flex:1, justifyContent:'center', paddingLeft:5}}>
                            <Text category='h6'>{post.post_nickname}</Text>
                        </Layout>
                        <Layout style={{flexDirection:'row'}}>
                            <Layout style={{justifyContent:'center', alignItems:'center'}}>
                                <Viewsvg/>
                                <Text style={{color:'#878787', fontSize:10}} category='s2'>{post.post_hit}</Text>
                            </Layout>
                            <Layout style={{justifyContent:'center', alignItems:'center', marginHorizontal:10}}>
                                <Viewsvg/>
                                <PostTime style={{color:'#878787', fontSize:10}} datetime={post.post_datetime}/>
                            </Layout>
                        </Layout>
                    </Layout>
                </Layout>
                <Layout style={styles.container}>
                    <Text style={{marginBottom:5}} category='h2'>상품설명</Text>
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
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, popoverVisible, modalType} = this.state;

        return(
            this.state.isLoading ?
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>is Loading now...</Text>
                <Spinner size="giant"/>
            </View>
            :
            <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                    backgroundColor='#F4F4F4'
                    gbckfunc={() => {
                        this.props.navigation.goBack();
                        StatusBar.setBackgroundColor('#B09BDE');
                        StatusBar.setBarStyle('default');}}
                    gbckuse={true}
                    right={<this.MoreAction/>}/>
                <Layout style={{flex:1}}>
                    <List
                        ref={"pstcmtlist"} 
                        data={this.state.comment}
                        contentContainerStyle={styles.contentContainer}
                        ListHeaderComponent={this.renderPostBody(post, width)}
                        renderItem={this.renderCommentsList}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        style={{backgroundColor:'#F4F4F4'}}
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
                        multiline={true}
                        onChangeText={nextValue => this.setState({cmt_content:nextValue})}
                    />
                    <TouchableOpacity onPress={this.commentValid} style={{position:'absolute',right:10,bottom:5,width:50,height:50}}>
                        <UploadCirclesvg width={50} height={50}/>
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
                    </View>   
                </Modal>
                <Modal
                    visible={modalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}>
                    <View style={{borderRadius:15, backgroundColor:'white'}}>
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
                        OnFrstPress={() => this.setState({resultModalVisible:false})}
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

    Alba_salary_type = ['시급', '일급', '주급', '월급'];

    async componentDidMount(){
        StatusBar.setBackgroundColor('#F4F4F4');
        StatusBar.setBarStyle('dark-content');
        const {post_id} = this.props.route.params;
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                if(response.data.view.post.post_thumb_use > 0)
                    this.setState({thumb_image: response.data.view.file_image[0]});
                this.setState({
                    file_images : response.data.view.file_image.map((i, index) => {
                        // console.log('received image', i);
                        return {
                            id : i.pfi_id,
                            edit : true,
                            index : index,
                            uri : i.origin_image_url, 
                            height : this.scaledHeight(i.pfi_width, i.pfi_height, Dimensions.get('window').width)
                        };
                    })
                })
                // console.log(this.state.file_images);
            }
        })
        .catch((error)=>{
            alert(error)
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
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        await Axios.post('http://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
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

    postBlame = async () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
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
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }

    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then((res)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
        })
        .catch((error)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
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
    ]

    render(){
        const {post, confirmModalVisible, resultModalVisible, spinnerModalVisible, modalType, popoverVisible} = this.state;
        
        return(
            this.state.isLoading?
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text>is Loading now...</Text>
                <Spinner size="giant"/>
            </View>
            :
            <Root>
            <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                backgroundColor='#F4F4F4'
                gbckfunc={() => {
                    this.props.navigation.goBack();
                    StatusBar.setBackgroundColor('#B09BDE');
                    StatusBar.setBarStyle('default');}}
                gbckuse={true}
                right={<this.MoreAction/>}/>
                <Layout style={{flex:1}}>
                    <ScrollView style={{backgroundColor : '#F4F4F4'}}>
                        <Card disabled={true} style={styles.item}>
                            <Layout style={{flex:1, flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                </View>
                                <View style={{flex:2, flexDirection:'row', alignItems : 'center', justifyContent : 'center'}}>
                                    {post.post_thumb_use > 0?<Image style={{width : 80, height : 80, resizeMode:'contain'}} source={{uri:this.state.thumb_image.origin_image_url}}/>
                                    :<Image style={{width : 80, height : 80, resizeMode:'contain'}} source={require('../assets/images/noimage.png')}/>}
                                    <Text category='h5' style={{margin : 15}}>{post.post_nickname}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection : 'row', justifyContent:'flex-end'}}>
                                    <View style={{marginHorizontal:10, alignItems:'center'}}>
                                        <Viewsvg width={20} height={20}/>
                                        <Text category='p1'>{post.post_hit}</Text>
                                    </View>
                                    <View style={{marginHorizontal:10, alignItems:'center'}}>
                                        <Timesvg width={20} height={20}/>
                                        <PostTime category='p1' datetime = {post.post_datetime}/>
                                    </View>
                                </View>
                            </Layout>
                            <View style={styles.title}>
                                <Text category= 'h1' style={{margin : 10, fontSize : 28}}>{post.post_title}</Text>
                            </View>
                            <Layout style={styles.icons}>
                                <Text style={{color:'#FF6262'}} category='h5'>
                                    {this.Alba_salary_type[post.alba_salary_type]}
                                </Text>
                                <Text category='h5'> {(post.alba_salary != '추후협의'?post.alba_salary+'원':post.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')} / </Text>
                                <Text style={{color:'#7370DD'}} category='h5'>
                                    {post.alba_type?'장기':'단기'}
                                </Text>
                                <Text> / </Text>
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
                                <View style={{flex : 5, flexDirection : 'row'}}>
                                    <Text style={[styles.gather, {color:'#FF6262'}]}>
                                        {this.Alba_salary_type[post.alba_salary_type]+' '}
                                    </Text>
                                    <Text style={styles.gather}>{(post.alba_salary != '추후협의'?post.alba_salary+'원':post.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')}</Text>
                                </View>
                            </Layout>
                            <Layout style = {{flexDirection : 'row'}}>
                                <View style={{flex : 1, marginLeft : 5}}>
                                    <Text style={styles.gathertext}>근무기간</Text>
                                </View>
                                <View style={{flex : 5}}>
                                    <Text style={styles.gather}>{post.alba_type?'장기 (3개월 ~)':'단기 (1일 ~ 3개월)'}</Text>
                                </View>
                            </Layout>
                        </Card>
                        <Card disabled={true} style={styles.item}>
                            <HTML
                                html = {post.post_content}
                                imagesMaxWidth={Dimensions.get('window').width}
                                imagesInitialDimensions={{width:400, height : 400}}
                                />
                            {this.state.file_images ? this.state.file_images.map((i,index) => <View key={i.uri}>{this.renderImage(i,index)}</View>) : null} 
                        </Card>
                    </ScrollView>
                    <TouchableOpacity style={styles.bottomButton} onPress={()=>this.setVisible(true)}>
                        <PaperPlanesvg width = {42} height = {32}/>
                        <Text category = 'h2' style={{color : 'white'}}>지원하기</Text>
                    </TouchableOpacity>

                    <Modal
                            visible={this.state.visible}
                            backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                            onBackdropPress={() => this.setVisible(false)}>
                            <Card disabled={true} style={{borderRadius:20}}>
                                <Layout style={{flexDirection:'row'}}>
                                    <View style={styles.modal_icons}>
                                        <TouchableOpacity
                                            onPress={()=>{Linking.openURL(`tel:${post.post_ph}`)}}>
                                            <Callsvg width={40} height = {40}/>
                                        </TouchableOpacity>
                                        <Text>전화</Text>
                                    </View>
                                        <View style={styles.modal_icons}>
                                        <TouchableOpacity
                                            onPress={()=>{Linking.openURL(`sms:${post.post_ph}`)}}>
                                            <Callmessagesvg width={40} height = {40}/>
                                        </TouchableOpacity>
                                        <Text>메시지</Text>
                                    </View>
                                    <View style={styles.modal_icons}>
                                        <TouchableOpacity
                                                onPress={()=>{Linking.openURL(`mailto:${post.post_email}`)}}>
                                                <Emailsvg width={40} height = {40}/>
                                        </TouchableOpacity>
                                        <Text>이메일</Text>
                                    </View>
                                </Layout>
                                <Button onPress={()=>this.setVisible(false)} appearance='ghost' >
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
                            OnFrstPress={() => this.setState({resultModalVisible:false})}
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
                </Layout>
            </SafeAreaView>
            </Root>
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
        }
    }

    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then((res)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
        })
        .catch((error)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
        })
    }
    commentWrite= ()=>{
        this.setState({replying:false, cmt_id:'', cmt_content:''});
        this.refs.commentInput.blur();
        console.log(this.refs);
    }
    postscrap = async()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        await Axios.post('http://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
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
    
    commentUpload= async()=>{
        const {cmt_content,post,cmt_id}=this.state;
        var formdata = new FormData();
        formdata.append("post_id",post.post_id);
        formdata.append("cmt_content",cmt_content);
        cmt_id==''? null : formdata.append("cmt_id",cmt_id);
        
        // this.commentWrite()
        
        Axios.post('http://dev.unyict.org/api/comment_write/update',formdata)
        .then(response=>{
            const {status, message}=response.data;
            if(status=='200'){
                Keyboard.dismiss();
                this.getCommentData(post.post_id);
                this.setState({cmt_id:'', cmt_content:'', replying:false});

                this.refs.pstcmtlist.scrollToEnd();
            }else if(status=='500'){
                this.setState({resultModalVisible:true, resultText:message});
            }
        })
        .catch(error=>{
            alert(error);
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
        <TopNavigationAction icon={()=><Backsvg width={26} height={26}/>} onPress={() =>{this.props.navigation.goBack();this.props.route.params.OnGoback();}}/>
    )
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }
    postBlame = async () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
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
    cmtBlame = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);

        Axios.post('http://dev.unyict.org/api/postact/comment_blame',formdata)
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
    cmtDelete = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);

        Axios.post('http://dev.unyict.org/api/postact/delete_comment',formdata)
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
    postLike = () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/post_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({resultModalVisible:true, resultText : response.data.message});
            }else{
                this.getPostData(this.state.post.post_id)
            }
        })
        .catch(error=>{
            this.setState({resultModalVisible:true, resultText : error.message});
        })
    }
    cmtLike = (cmt_id) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        formdata.append('like_type',1)
        Axios.post('http://dev.unyict.org/api/postact/comment_like',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({resultModalVisible:true, resultText : response.data.message});
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
            this.setState({post:response.data.view.post});
            const regexf = /(<([^>]+)>)|&nbsp;/ig;
            const post_remove_tagsf = response.data.view.post.post_content.replace(regexf, '\n');
            this.setState({content:post_remove_tagsf})
            if (response.data.view.file_image){
                this.setState({image: response.data.view.file_image.map(function(item, index){
                    var image_info = {};
                    image_info['props'] = {};
                    image_info['url'] = item.origin_image_url;
                    image_info['props']['id'] = item.pfi_id;
                    image_info['props']['title'] = item.pfi_originname;
                    image_info['props']['index'] = index;
                    image_info['props']['edit'] = true;
                    console.log(image_info);
                    return image_info;
                })});
            }
        })
        .catch((error)=>{
            alert(JSON.stringify(error))
        })
    }
    
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id);
    } 

    async componentDidMount(){
        StatusBar.setBackgroundColor('#FFFFFF');
        StatusBar.setBarStyle('dark-content');
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})
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
            <View style={{backgroundColor:'#F4F4F4', marginHorizontal:15,borderRadius:8,marginTop:5,marginBottom:10}} >
                <View style={{marginLeft:15,marginTop:10,marginBottom:13}}>
                    <View style={{display:"flex",flexDirection:'row'}}>
                        <StarIcon />
                        <View>
                            <Text>{post.display_name}</Text>
                            <View style={{display:"flex",flexDirection:'row'}}>
                                <PostTime datetime={ post.post_datetime ==post.post_updated_datetime? post.post_datetime : post.post_updated_datetime}/>
                                {
                                    post.post_datetime ==post.post_updated_datetime?
                                    null
                                    :
                                    <Text category="s2"> 수정됨</Text>
                                }
                            </View>
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
                <View style={{alignItems:'center', width:'100%', paddingHorizontal:20}}>
                    {image
                    ?image.map((i, index)=>
                        <TouchableOpacity style={{width:'100%', height:(Dimensions.get("window").width-70), marginTop:10}} onPress={()=>this.setState({imageIndex:index, imageModalVisible:true})}>
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
                    backgroundColor:item.cmt_id==this.state.cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4'}}>
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
                        <TouchableOpacity onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id})} style={{width:10,alignItems:'flex-end'}}>
                            <MoreSsvg/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category="s1">{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                    {item.cmt_reply ==""?
                    <TouchableOpacity style= {{marginHorizontal:6}}onPress={() => this.setState({replying:true, cmt_id:item.cmt_id}, this.refs.commentInput.focus())}>
                        <Text>답글</Text>
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
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, modalType, imageModalVisible, popoverVisible, imageIndex, image} = this.state

        return(
        this.state.isLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>is Loading now...</Text>
            <Spinner size="giant"/>
        </View>
        :
        <SafeAreaView style={{flex:1}}>
            <WriteContentToptab
                gbckfunc={() => {
                    this.props.navigation.goBack();
                    StatusBar.setBackgroundColor('#B09BDE');
                    StatusBar.setBarStyle('default');}}
                gbckuse={true}
                right={<this.MoreAction/>}/>
            <TouchableWithoutFeedback onPress={()=>{ this.commentWrite; Keyboard.dismiss()}}>
                <Layout style={{flex:1}}>
                    <List
                        ref={"pstcmtlist"} 
                        data={comment}
                        ListHeaderComponent={this.renderPostBody(post, image)}
                        renderItem={this.renderCommentsList}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        style={{backgroundColor:'#ffffff'}}
                    />
                </Layout>
            </TouchableWithoutFeedback>
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
                    <TouchableOpacity 
                        onPress={()=>{
                            this.setState({popoverVisible:false});
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
            </Modal>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}>
                <View style={{borderRadius:15, backgroundColor:'white'}}>
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
                    OnFrstPress={() => this.setState({resultModalVisible:false})}
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
        backgroundColor:'yellow',
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
    }
});


export {defaultContent, MarketContent, AlbaContent, GominContent, IlbanContent}