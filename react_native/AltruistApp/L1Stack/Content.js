import React, { Component } from 'react';
import {StyleSheet,SafeAreaView, View, Image, ScrollView,Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity, Dimensions,Linking, VirtualizedList,TextInput} from 'react-native';
import {Card,Layout,Button,Text,TopNavigation,TopNavigationAction,Icon, Divider, Input,List,Spinner, Modal, OverflowMenu, MenuItem,Popover} from '@ui-kitten/components'
import Axios from 'axios';
import HTML from 'react-native-render-html';
import {ActionSheet, Root, Container, Row} from 'native-base';
import Slider from '../components/MarketSlider.component'
import { Alert } from 'react-native';
import {PostTime} from '../components/PostTime'
import Confirm from '../components/confirm.component'
import ReplyLsvg from '../assets/icons/arrow-bended-large.svg'
import ReplySsvg from '../assets/icons/arrow-bended-small.svg'
import MoreLsvg from '../assets/icons/dotdotdot-large.svg'
import MoreSsvg from '../assets/icons/dotdotdot-small.svg'
import Backsvg from '../assets/icons/back-arrow-color.svg'
import Thumbsvg from '../assets/icons/thumb-up.svg'
import UploadCirclesvg from '../assets/icons/upload-circle.svg'
import PaperPlanesvg from '../assets/icons/paper-plane.svg'


const BackIcon =  (props) =>(
    <Icon {...props} fill ="#63579D"name = "back-arrow" pack="alticons"/>
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
            popoverVisibel:false,
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
        this.setState({replying:false, cmt_id:''});
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
                this.setState({resultModalVisible:true, cmt_id:'', cmt_content:'', replying:false, resultText:message});

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
                alert(message);
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
                    onPress={()=>{this.setState({popoverVisibel:false, confirmModalVisible:true, modalType : 0})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>신고</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        this.setState({popoverVisibel:false});
                        this.props.navigation.navigate('GominWrite',
                            {
                                statefunction:this.statefunction,
                                mode:'edit',
                                post:this.state.post,
                                content:this.state.content,
                            })}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{this.setState({popoverVisibel:false,confirmModalVisible:true, modalType : 1})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>삭제</Text>
                </TouchableOpacity>
            </View>
        </Popover>
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
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,resultModalVisible,confirmModalVisible,spinnerModalVisible, modalType} = this.state
         return(
        this.state.isLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>is Loading now...</Text>
            <Spinner size="giant"/>
        </View>
        :
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="" alignment="center" accessoryLeft={this.BackAction} accessoryRight={this.MoreAction} style={styles.topbar}/> 
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
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}
            >
                <View>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({modalVisible:false, modalType : 2, confirmModalVisible :true}, Keyboard.dismiss())}}
                        style={{padding:20,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4',backgroundColor:'#ffffff'}}>
                        <Text category='h3'>댓글 신고</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({modalVisible:false, modalType : 3, confirmModalVisible :true}, Keyboard.dismiss())}}
                        style={{padding:20,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4',backgroundColor:'#ffffff'}}>
                        <Text category='h3'>댓글 삭제</Text>
                    </TouchableOpacity>
                </View>   
            </Modal>
            <Modal
                visible={resultModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultModalVisible:false, cmt_id:''})}
                >
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="닫기"
                    OnFrstPress={() => this.setState({resultModalVisible:false, cmt_id:''})}
                />
            </Modal>
            <Modal
                visible={confirmModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({confirmModalVisible:false})}
            >
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
            replyModalVisible:false,
            deleteModalVisible:false,
            spinnerModalVisible:false,
            popoverVisibel:false,
        }
    }

    async componentDidMount(){
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
                    <Text category='h3'>신고</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        this.setState({popoverVisibel:false});
                        this.props.navigation.navigate('MarketWrite',
                            {
                                statefunction:this.statefunction,
                                mode:'edit',
                                post:this.state.post,
                                image:this.state.image,
                                content:this.state.content,
                            })}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{this.setState({popoverVisibel:false,deleteModalVisible:true})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>삭제</Text>
                </TouchableOpacity>
            </View>
        </Popover>
    )
    
    renderPostMore=()=>(
        <TouchableOpacity  style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisibel:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    
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
    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        console.log(formdata);
        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then(res=>{
            this.setState({spinnerModalVisible:false})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
            alert(JSON.stringify(res.data))
        })
        .catch(err=>{
            alert(JSON.stringify(err))
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
        this.setState({replying:false,cmt_id:''})
        this.refs.commentInput.blur()
        console.log(this.refs)
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
                this.setState({cmt_content:'',replying:false,cmt_id:''});
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
    cmtDelete = (cmt_id) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        
        Axios.post('http://dev.unyict.org/api/postact/delete_comment',formdata)
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
    cmtDeleteConfirm = (cmt_id) =>{
        Alert.alert(
            "댓글",
            "이 댓글을 삭제하시겠습니까?",
            [
                {
                    text: "Cancel",
                    onPress: () => alert('취소했습니다.')
                },
                { 
                    text: "OK", 
                    onPress: ()=> this.cmtDelete(cmt_id)
                }
            ],
            { cancelable: false }
        );
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

    
    renderCommentsList=({item,index})=>(
        <Layout style={{paddingVertical:3}}>
            {item.cmt_reply==""?
            null
            :
            <View style={{position:'absolute',left:0,paddingLeft:25}}>
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
            </Layout>
        </Layout>
    )
    
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id)

    }

    renderPostBody = (post, width) =>{

        return(
            <Layout>
                <View>
                    <Slider width={width} height={width} image={this.state.image} navigation={this.props.navitation}/>
                </View>
                <Layout style={{padding : 10}}>
                    <Layout>
                    <Text category='h2'>{post.post_title}</Text>
                    </Layout>
                    <Layout style={{marginTop : 10, marginLeft : 5}}>
                    <Text category='h4'>{post.deal_price} 원</Text>
                    </Layout>
                </Layout>
                <Divider/>
                <Layout style={{height:50,flexDirection:'row', paddingVertical : 10}}>
                    <Layout style={{width:50}}>
                    <Image source={require('../assets/images/icon-social-dark.png')} style={{flex : 1, width:'100%', resizeMode:'contain'}}/>
                    </Layout>
                    <Layout style={{justifyContent:'center'}}>
                    <Text>{post.post_nickname}</Text>
                    </Layout>
                </Layout>
                <Divider/>
                <Layout style={{padding : 10}}>
                    <Text style={{color : 'gray'}}>거래희망지역</Text>
                    <Text style={{marginTop : 10, marginLeft : 10}}>{post.post_location}</Text>
                    <Text style={{color : 'gray', marginTop : 10}}>상품설명</Text>
                    <Text style={{marginTop : 10, marginLeft : 10}}>{post.post_content}</Text>
                </Layout>
                <Divider/>
                <Text style={{margin:10}}>댓글</Text>
            </Layout>
        )
    }

    render(){

        const { width } = Dimensions.get("window");
        const {cmt_id,cmt_content,post,comment,modalVisible,replying,replyModalVisible,deleteModalVisible,spinnerModalVisible} = this.state;

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
                        data={this.state.comment}
                        ListHeaderComponent={this.renderPostBody(post, width)}
                        renderItem={this.renderCommentsList}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
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
                    visible={modalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}
                >
                    <View>
                        <TouchableOpacity 
                            onPress={()=>{this.cmtBlameConfirm(cmt_id);this.setState({modalVisible:false,cmt_id:''})}}
                            style={{padding:20,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4',backgroundColor:'#ffffff'}}>
                            <Text category='h3'>댓글 신고</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>{this.cmtDeleteConfirm(cmt_id);this.setState({modalVisible:false,cmt_id:''})}}
                            style={{padding:20,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4',backgroundColor:'#ffffff'}}>
                            <Text category='h3'>댓글 삭제</Text>
                        </TouchableOpacity>
                    </View>   
                </Modal>
                <Modal
                    visible={replyModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({replyModalVisible:false})}
                >
                    <Confirm 
                        confirmText="대댓글을 작성하시겠습니까?"
                        frstText="예"
                        OnFrstPress={() =>{this.setState({replying:true,replyModalVisible:false}); this.refs.commentInput.focus()}}
                        scndText="아니오"
                        OnScndPress={() => this.setState({replyModalVisible:false,cmt_id:''})}
                    />
                </Modal>
                <Modal
                    visible={deleteModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({deleteModalVisible:false})}
                >
                    <Confirm 
                        confirmText="게시글을 삭제하시겠습니까?"
                        frstText="예"
                        OnFrstPress={() =>{this.setState({deleteModalVisible:false,spinnerModalVisible:true});this.postDelete()}}
                        scndText="아니오"
                        OnScndPress={() => this.setState({deleteModalVisible:false})}
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



class AlbaContent extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            visible : false,
            OF_visible : false,
            post : {} ,
            thumb_image : '../assets/images/noimage.png',
            file_images : null,
            phoneNumber : '010 9999 9999',
            isLoading : true,
            image_height : 0,
            popoverVisibel: false,
            blameModalVisible : false,
            deleteModalVisible : false,
            spinnerModalVisible : false,
        }
    }

    Alba_salary_type = [
        {color : '#EAB0B3', str : '시급'},
        {color : '#E3898E', str : '일급'},
        {color : '#CA676C', str : '주급'},
        {color : '#B12D34', str : '월급'},
    ]

    async componentDidMount(){
        const {post_id} = this.props.route.params;
        console.log(post_id);
        await this.getPostData(post_id)
        .then(()=>{this.setState({isLoading:false})})
    }

    getPostData = async(post_id)=>{
        await Axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post})
            if (response.data.view.file_image){
                if(response.data.view.post.post_thumb_use > 0)
                    this.setState({thumb_image: response.data.view.file_image.shift().origin_image_url});
                this.setState({
                    file_images : response.data.view.file_image.map(i => {
                        console.log('received image', i);
                        return {uri : 'http://dev.unyict.org'+i.origin_image_url, height : this.scaledHeight(i.pfi_width, i.pfi_height, Dimensions.get('window').width)};
                    })
                })
                // console.log(this.state.file_images);
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
    renderPostMore=()=>(
        <TouchableOpacity  style = {{paddingRight:10}} onPress={()=>this.setState({popoverVisibel:true})}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() =>{this.props.navigation.goBack()}}/>
    )
    UD_Action = () =>(
        // <TopNavigationAction icon={HeartIcon} onPress={() =>{this.onClick_UD_Action()}}/>
        <Popover
        anchor={this.renderPostMore}
        visible={this.state.popoverVisibel}
        placement='bottom start'
        onBackdropPress={() => this.setState({popoverVisibel:false})}>
            <View>
                <TouchableOpacity 
                    onPress={()=>{this.postscrap(); this.setState({popoverVisibel:false, ScrapModalVisible:true})}} 
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>스크랩</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{this.setState({popoverVisibel:false, blameModalVisible:true})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>신고</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{
                        this.setState({popoverVisibel:false});
                        this.props.navigation.navigate('AlbaWrite',
                            {
                                statefunction:this.statefunction,
                                mode:'edit',
                                post:this.state.post,
                                file_images:this.state.file_images,
                            })}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>{this.setState({popoverVisibel:false,deleteModalVisible:true})}}
                    style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                    <Text category='h3'>삭제</Text>
                </TouchableOpacity>
            </View>
        </Popover>
    )

    
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

    postBlame = ()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        Axios.post('http://dev.unyict.org/api/postact/post_blame',formdata)
        .then(response=>{
            this.setState({spinnerModalVisible:false});
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
    
    statefunction=(str)=>{
        this.setState({isLoading:true});
        this.componentDidMount()    
    }

    postAlbaDelete = async(id) => {
        alert('delete');
        var formdata =new FormData();
        formdata.append("post_id", this.state.post.post_id);
        await Axios.post('http://dev.unyict.org/api/postact/delete',formdata)
        .then(response => {
            this.setState({spinnerModalVisible:false})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
            alert(JSON.stringify(res.data))
        })
        .catch(error=>{
            alert(JSON.stringify(err))
        })
    }


    // getImageSize (uri, passProps) {
    //     const img_url = "http://dev.unyict.org"+uri;
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
        const {post, blameModalVisible, deleteModalVisible, spinnerModalVisible} = this.state;
        console.log('post_id=>'+JSON.stringify(post))
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
                <TopNavigation category = 'c2'title="채용정보" alignment="center" accessoryLeft={this.BackAction} accessoryRight={this.UD_Action} style={styles.topbar}/> 
                <Layout style={styles.container}>
                    <ScrollView style={{backgroundColor : 'lightgrey'}}>
                        <Card disabled={true} style={styles.item}>
                            <View style={{flexDirection : 'row-reverse'}}>
                                <Text category='c2'>
                                    {JSON.stringify(post.post_datetime).substr(1,post.post_datetime.length-3)}
                                </Text>
                            </View>
                            <Layout style={{flexDirection:'row', alignItems : 'center', justifyContent : 'center'}}>
                                {post.post_thumb_use > 0?<Image style={{width : 80, height : 80, resizeMode:'contain'}} source={{uri:'http://dev.unyict.org/'+this.state.thumb_image}}/>
                                :<Image style={{width : 80, height : 80, resizeMode:'contain'}} source={require('../assets/images/noimage.png')}/>}
                                <Text category='h5' style={{margin : 15}}>{post.post_nickname}</Text>
                            </Layout>
                            <View style={styles.title}>
                                <Text category= 'h1' style={{margin : 10, fontSize : 28}}>{post.post_title}</Text>
                            </View>
                            <Layout style={styles.icons}>
                                <Text style={[styles.tagstyle,{backgroundColor:this.Alba_salary_type[post.alba_salary_type].color}]} category='c2'>
                                    {this.Alba_salary_type[post.alba_salary_type].str}
                                </Text>
                                <Text category='h5'> {(post.alba_salary != '추후협의'?post.alba_salary+'원':post.alba_salary).replace(/\d(?=(\d{3})+\원)/g, '$&,')} / </Text>
                                <Text style={[styles.tagstyle,{backgroundColor:post.alba_type == 0?'#978DC7':'#63579D'}]} category='c2'>
                                    {post.alba_type == 0?'단기':'장기'}
                                </Text>
                                <Text category='h5'> {post.alba_type == 0?'일일~3개월':'3개월이상'} / </Text>
                                <Text style={[styles.tagstyle,{backgroundColor:'blue'}]} category='c2'>
                                    연락처
                                </Text>
                                <Text category='h5'> {post.post_hp}</Text>
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
                                    <Text style={[styles.tagstyle,{backgroundColor:this.Alba_salary_type[post.alba_salary_type].color}]} category='c2'>
                                        {this.Alba_salary_type[post.alba_salary_type].str}
                                    </Text>
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
                    <TouchableOpacity style={styles.bottomButton} onPress={()=>this.setVisible(true)}>
                        <PaperPlanesvg width = {42} height = {32}/>
                        <Text category = 'h2' style={{color : 'white'}}>지원하기</Text>
                    </TouchableOpacity>

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
                    <Modal
                        visible={blameModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({blameModalVisible:false})}>
                        <Confirm 
                            confirmText="게시글을 신고하시겠습니까?"
                            frstText="예"
                            OnFrstPress={() =>{this.setState({blameModalVisible:false,spinnerModalVisible:true});this.postBlame()}}
                            scndText="아니오"
                            OnScndPress={() => this.setState({blameModalVisible:false})}
                        />
                    </Modal>
                    <Modal
                        visible={deleteModalVisible}
                        backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                        onBackdropPress={() => this.setState({deleteModalVisible:false})}>
                        <Confirm 
                            confirmText="게시글을 삭제하시겠습니까?"
                            frstText="예"
                            OnFrstPress={() =>{this.setState({deleteModalVisible:false,spinnerModalVisible:true});this.postAlbaDelete()}}
                            scndText="아니오"
                            OnScndPress={() => this.setState({deleteModalVisible:false})}
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
    render(){
        return(
            <View>
                <Text>HI</Text>
            </View>
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
        backgroundColor : 'white',
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
    }
});


export {defaultContent, MarketContent, AlbaContent, GominContent, IlbanContent}