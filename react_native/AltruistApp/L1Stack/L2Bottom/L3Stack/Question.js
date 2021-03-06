import React from 'react';
import {SafeAreaView,TextInput,View,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Alert, ScrollView, Dimensions,TouchableHighlight,StatusBar,Keyboard,Pressable} from 'react-native'
import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction,List,Spinner,Divider,Modal,Popover} from '@ui-kitten/components'
import axios from 'axios'

import {Signing} from '../../Context'

import {PostTime} from '../../../components/PostTime'

import Confirm from '../../../components/confirm.component'
import ReplyLsvg from '../../../assets/icons/arrow-bended-large.svg'
import ReplySsvg from '../../../assets/icons/arrow-bended-small.svg'
import MoreLsvg from '../../../assets/icons/dotdotdot-large.svg'
import MoreSsvg from '../../../assets/icons/dotdotdot-small.svg'
import Backsvg from '../../../assets/icons/back-arrow-color.svg'
import Thumbsvg from '../../../assets/icons/thumb-up.svg'
import UploadCirclesvg from '../../../assets/icons/upload-circle.svg'
import Tag from '../../../components/tag.component'
import {TopBarTune} from '../../../components/TopBarTune'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import Heartsvg from '../../../assets/icons/heart.svg'
import Viewsvg from '../../../assets/icons/view.svg'
import Commentsvg from '../../../assets/icons/comment-square.svg'
import Writesvg from '../../../assets/icons/write.svg'
import {NoListRes} from './List'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

class AltReplying extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            post:this.props.route.params.post,
            title:this.props.route.params.post_title,
            comment:this.props.route.params.comment ?this.props.route.params.comment.cmt_content : '',
            refreshing:false,
            confirmModalVisible:false,
            resultModalVisible:false,
            spinnerModalVisible:false,
            goBackOk:false,
            resultText:'',
            modalType:0
        }
    }
    modalList = [
        {
            text : '????????? ?????? ???????????????????',
            func : ()=> this.commentValid(),
        },
        {
            text : '?????? ??????',
            func : ()=>{ 
                        console.log('?????? ??????');
                        this.state.goBackOk =true;
                        this.setState({goBackOk:true})           
                        this.props.navigation.goBack();
                        this.props.route.params.onGoBack();
                    },
        },
        {
            text : '?????? ??????',
            func : ()=>{console.log('??????')},
        },
        {
            text : '????????? ?????????????????????????\n ???????????? ????????? ?????? ??? ????????????.',
            func : ()=>{
                this.state.goBackOk =true;
                this.setState({goBackOk:true});  
                this.props.navigation.goBack()
            },
        },
        {
            text : '??? ????????? ?????????????????????????',
            func :()=>{this.setState({goBackOk:true});},
        },
    ]
    goBack = () => {
        this.props.navigation.goBack();
    }
    commentUpload= async()=>{
        const {comment,post}=this.state;
        var formdata = new FormData();
        formdata.append("post_id",post.post_id);
        formdata.append("cmt_content",comment);
        this.props.route.params.mode=='cu' ? formdata.append("mode",'cu') : null;
        this.props.route.params.comment ? formdata.append("cmt_id",this.props.route.params.comment.cmt_id) : null;
        
        await axios.post('https://dev.unyict.org/api/comment_write/update',formdata)
        .then(response=>{
            const {status,message}=response.data;
            if(status=='200'){
                this.setState({spinnerModalVisible:false,resultModalVisible:true,modalType:1,resultText:'????????? ??????????????? ?????????????????????.\n???????????????!'});
            }else if(status=="500"){
                this.setState({spinnerModalVisible:false,resultModalVisible:true,modalType:2,resultText:`?????? ????????? ?????????????????????.\n${message}`});
            }
        })
    }

    commentValid =async() =>{
        const {comment} =this.state;
        var formdata = new FormData();
        formdata.append("content",comment);
        
        await axios.post('https://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {status,message} = response.data;
            if(status=='500'){
                this.setState({spinnerModalVisible:false,resultModalVisible:true,modalType:2,resultText:`????????? ???????????? ???????????????.\n${message}`});
            }else if(status=="200"){
                this.commentUpload();
            }
        })
        .catch(error=>{
            alert('error')
        })
    }
    confirmModal= ()=>{
        this.setState({confirmModalVisible:true,modalType:3});
    }
    componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#F4F4F4');
            StatusBar.setBarStyle('dark-content');
        }
        const {navigation} =this.props
        navigation.addListener('beforeRemove',(e)=>{
            console.log(this.state.goBackOk)
            if(this.state.goBackOk){
                console.log('goBackOk 1 : ')
                navigation.dispatch(e.data.action)
                return;
            }else{
                console.log('goBackOk 2 : ')
                e.preventDefault();
                this.confirmModal();
                return;
            }
        })
    }
    componentWillUnmount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#B09BDE');
            StatusBar.setBarStyle('default');
        }
    }
    render(){
        const {post,title,comment,confirmModalVisible,resultModalVisible,spinnerModalVisible,modalType} = this.state
        return(
            <SafeAreaView style={{flex:1}}>
                <WriteContentToptab
                    text='????????????'
                    right='upload'
                    func={() => {
                        this.setState({confirmModalVisible:true,modalType:0});
                        Keyboard.dismiss();
                    }}
                    gbckfunc={() => {
                        this.props.navigation.goBack();
                    }}
                    gbckuse={true}
                />
                <KeyboardAvoidingView
                        style={{flex:1}} 
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                >
                <View style={{ flex:1,backgroundColor:"#f4f4f4",padding:10}}>
                    <View style={{display:'flex',flexDirection:'row',paddingHorizontal:10,marginBottom:20}}>
                        <View>
                            <Text style={{fontSize:13, fontWeight:'600',color:'#63579D',marginLeft:16}} >
                            ??????
                            </Text>
                            <Text style={{fontSize:15, fontWeight:'700',color:'#63579D',marginLeft:16}}>
                                {post.post_title}
                            </Text>
                        </View> 
                    </View>
                    
                    <View style={{height:'60%'}}>
                        <TextInput 
                            style={styles.contentInput} 
                            value={comment} 
                            onChangeText={text =>this.setState({comment:text}) }
                            textAlignVertical='top'
                            multiline={true}
                            placeholder="??????"
                            placeholderTextColor='#A897C2'
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
            <Modal
                visible={confirmModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({confirmModalVisible:false})}
            >
                <Confirm 
                    confirmText={this.modalList[modalType].text}
                    frstText="???"
                    OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                    scndText="?????????"
                    OnScndPress={() => this.setState({confirmModalVisible:false,cmt_id:''})}
                />
            </Modal>
            <Modal
                visible={resultModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultModalVisible:false, cmt_id:''})}
                >
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="??????"
                    OnFrstPress={() => {
                        this.setState({resultModalVisible:false, cmt_id:''})                    
                        this.modalList[modalType].func();
                    }}
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
class AltQueContent extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            post:{},
            comment:[],
            refreshing:false,
            modalVisible:false,
            cmt_id:'',
            adoption_type:'',
            popoverVisibel:false,
            confirmModalVisible:false,
            spinnerModalVisible:false,
            resultModalVisible:false,
            resultText:'',
            modalType:1,
            brd_key:''
        }
    }
    static contextType =Signing; 
    modalList = [
        {
            text : '??? ????????? ?????????????????????????',
            func : ()=> this.postBlame(),
        },
        {
            text : '??? ????????? ?????????????????????????',
            func : ()=> this.postDelete(),
        },
        {
            text : '??? ????????? ????????????????????????????',
            func : ()=> this.postscrap(),
        },
        {
            text : '??? ????????? ?????????????????????????',
            func : ()=>this.cmtBlame(),
        },
        {
            text : '??? ????????? ?????????????????????????',
            func :()=>this.cmtAdopt(),
        },
        {
            text : '??? ????????? ?????????????????????????',
            func :()=>this.cmtDelete(),
        },
    ]
    
    cmtBlame = () =>{
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id);

        axios.post('https://dev.unyict.org/api/postact/comment_blame',formdata)
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
    postLike = () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        formdata.append('like_type',1)
        axios.post('https://dev.unyict.org/api/postact/post_like',formdata)
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
    postDelete = async () => {
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await axios.post('https://dev.unyict.org/api/postact/delete',formdata)
        .then((res)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText:res.data.message})
            this.props.navigation.goBack();
            this.props.route.params.OnGoback();
        })
        .catch((error)=>{
            this.setState({spinnerModalVisible:false, resultModalVisible:true, replying:false ,resultText:error.message});
        })
    }
    postBlame = async () =>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)

        await axios.post('https://dev.unyict.org/api/postact/post_blame',formdata)
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
    postscrap = async()=>{
        var formdata = new FormData();
        formdata.append('post_id',this.state.post.post_id)
        
        await axios.post('https://dev.unyict.org/api/postact/post_scrap/'+this.state.post.post_id,formdata)
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
    cmtAdopt = (cmt_id,adoption_type) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        formdata.append('adoption_type',adoption_type)
        axios.post('https://dev.unyict.org/api/comment_write/adoption',formdata)
        .then(response=>{
            if(response.data.status ==500){
                alert(`${JSON.stringify(response.data.message)}`)
            }else{
                alert(`${JSON.stringify(response.data.message)}`)
            this.getCommentData(this.state.post.post_id)}
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    cmtLike = (cmt_id) =>{
        var formdata = new FormData();
        formdata.append('cmt_id',cmt_id)
        formdata.append('like_type',1)
        axios.post('https://dev.unyict.org/api/postact/comment_like',formdata)
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
    cmtDelete = () =>{
        this.setState({spinnerModalVisible:true});
        var formdata = new FormData();
        formdata.append('cmt_id',this.state.cmt_id)
        
        axios.post('https://dev.unyict.org/api/postact/delete_comment',formdata)
        .then(response=>{
            if(response.data.status ==500){
                this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
            }else{
                this.setState({spinnerModalVisible:false, resultModalVisible:true, resultText : response.data.message});
                this.onRefresh()
            }
            this.setState({cmt_id:''})
        })
        .catch(error=>{
            alert(`${JSON.stringify(error)}`)
        })
    }
    renderPostMore=(props)=>(
        <TouchableOpacity {...props} style = {{paddingRight:10}} onPress={()=>{this.setState({popoverVisibel:true}),console.log('gd')}}>
            <MoreLsvg height={24} width={24}/>
        </TouchableOpacity>
    )
    MoreAction = (props) =>(
        <Popover
        {...props}
            anchor={this.renderPostMore}
            visible={this.state.popoverVisibel}
            placement='bottom start'
            onBackdropPress={() => this.setState({popoverVisibel:false})}>
            <View>
                
                {
                    this.context.session_mem_id ==this.state.post.mem_id
                    ?
                    <>
                    {
                    this.state.post.post_comment_count == 0 ?
                        null
                        // <TouchableOpacity 
                        //     onPress={()=>{
                        //         this.setState({popoverVisibel:false});
                        //         this.props.navigation.navigate('AltQuestionWrite',
                        //             {
                        //                 statefunction:this.statefunction,
                        //                 mode:'edit',
                        //                 post:this.state.post,
                        //                 content:this.state.content,
                        //             })}}
                        //     style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                        //     <Text category='h3'>??????</Text>
                        // </TouchableOpacity>
                        :null
                                }
                        <TouchableOpacity 
                            onPress={()=>{this.setState({popoverVisibel:false,confirmModalVisible:true, modalType : 1})}}
                            style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                            <Text category='h3'>??????</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({popoverVisibel:false,confirmModalVisible:true, modalType : 2})}} 
                        style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}
                    >
                        <Text category='h3'>?????????</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{this.setState({popoverVisibel:false, confirmModalVisible:true, modalType : 0})}}
                        style={{padding:10,margin:3,borderWidth:1,borderStyle:'solid',borderColor:'#f4f4f4'}}>
                        <Text category='h3'>??????</Text>
                    </TouchableOpacity>
                    </>
                }

            </View>
        </Popover>
    )
    renderCommentsList=({item,index})=>{
        const {post,brd_key,cmt_id} =this.state
        return(
        item==false?
            this.context.session_mem_id !=post.mem_id?
                this.context.is_altruist =='Y'?
                <View>
                    <Button 
                        onPress = {()=>{this.props.navigation.navigate('AltReplying',{post:post,brd_key:brd_key,onGoBack:()=>this.onRefresh()})}}
                        style={{marginHorizontal:15,}}
                    >
                        ????????????
                    </Button>
                </View>
                :
                <View style={{ alignItems:'center'}}>
                    <Text style={{color:'#63579D',fontSize:15,padding:10}}>
                       ????????? ?????? ???????????? ?????? ?????????????????? ?????? ?????????. 
                    </Text>
                    <Text style={{color:'#63579D',fontSize:15}}>
                       ?????????????????? ?????? ??????????????????! 
                    </Text>
                </View>
            :
            <View style={{ flexDirection:'row',justifyContent:'center'}}>
                <Text style={{color:'#63579D',fontSize:15}}>
                    ????????? ??????????????????. 
                </Text>
            </View>
        :
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
                    backgroundColor:item.cmt_id==cmt_id?'#EAB0B3': item.cmt_reply==""?  '#ffffff':'#f4f4f4',
                    borderColor : '#FFEAB2',
                    borderWidth: item.answer_adoption ==0 ? 0 :2
                }}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row"}}>
                        <View>
                            <Text category="s2">{`[${item.cmt_username}] ?????? ??????`}</Text>
                            <PostTime datetime={item.cmt_datetime}/>
                        </View>
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {/* <TouchableOpacity onPress={()=>this.cmtBlameConfirm(item.cmt_id)}>
                            <BlameIcon />
                        </TouchableOpacity> */}
                        {
                            
                        <TouchableOpacity onPress={()=>this.setState({modalVisible:true,cmt_id:item.cmt_id})} style={{width:10,alignItems:'flex-end'}}>
                            <MoreSsvg/>
                        </TouchableOpacity>
                        
                        }
                    </View>
                </View>
                <View style={{padding:5}}>
                    <Text category="s1">{item.cmt_content}</Text>
                </View>
                <View style={{display:"flex", justifyContent:"flex-end",flexDirection:"row",alignItems:"flex-end"}}>
                {
                    this.context.session_mem_id ==post.mem_id && item.brd_id==11? 
                    
                    <TouchableOpacity 
                        style= {{paddingHorizontal:6,paddingVertical:4,borderRadius:4,backgroundColor:'#63579D',marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'center', alignItems:'center'}}
                        onPress={()=>  this.cmtAdopt(item.cmt_id,item.answer_adoption ==0 ? 1 : 0)}>
                       <Text style={{color:'#ffffff'}}>
                        {
                            item.answer_adoption ==1 ?
                            '????????? ???????????????.'
                            :
                            '????????????'
                        }   
                        </Text> 
                    </TouchableOpacity>
                    :
                    item.answer_adoption ==1?

                    <TouchableOpacity 
                        style= {{paddingHorizontal:6,paddingVertical:4,borderRadius:4,backgroundColor:'#63579D',marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'center', alignItems:'center'}}
                    >
                       <Text style={{color:'#ffffff'}}>??????????????? ?????????????????????.</Text> 
                    </TouchableOpacity>
                    :
                    null
                }
                    <TouchableOpacity 
                        style= {{marginHorizontal:6,display:'flex',flexDirection:'row',justifyContent:'flex-end', alignItems:'flex-end'}}
                        onPress={()=>this.cmtLike(item.cmt_id)}
                    >
                        <Heartsvg width='12' height='12'/>
                    </TouchableOpacity>
                    <Text category="s1" style={{color:'#A897C2', fontSize:10}}>{item.cmt_like}</Text>
                </View>
                {
                    item.answer_adoption ==0 ?
                    <View style={{marginTop:4,borderTopWidth:0.5,borderColor:'#c4c4c4'}}/>
                    :null
                }
            </View>
        </View>
    )}
    renderPostBody = (post)=>{
        
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = post.post_content.replace(regex, '\n');
        return (
            <View style={{backgroundColor:'#F4F4F4', marginHorizontal:15,borderRadius:8,marginTop:5,marginBottom:10}} >
                <View style={{marginLeft:15,marginTop:10,marginBottom:13}}>
                    <View style={{display:"flex",flexDirection:'row'}}>
                        <View>
                            <Text>{post.display_name}</Text>
                            <View style={{display:"flex",flexDirection:'row'}}>
                                <PostTime datetime={ post.post_datetime ==post.post_updated_datetime? post.post_datetime : post.post_updated_datetime}/>
                                {
                                    post.post_datetime ==post.post_updated_datetime?
                                    null
                                    :
                                    <Text category="s2"> ?????????</Text>
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
                            <Heartsvg height={15} width={15}/>
                        </TouchableOpacity>
                        <Text>{post.post_like}</Text>
                    </View>
                </View>
            </View>
        )
    }
    getCommentData = async (post_id)=>{
        await axios.get(`https://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment: response.data.view.data.total_rows>0 ? response.data.view.data.list : [false]})
            
        console.log(this.state.comment);
        })
        .catch((error)=>{
            alert('error')
        })
    }
    getPostData = async (post_id)=>{
        await axios.get(`https://dev.unyict.org/api/board_post/post/${post_id}`)
        .then((response)=>{
            this.setState({post:response.data.view.post,brd_key:response.data.view.board_key});
            const regexf = /(<([^>]+)>)|&nbsp;/ig;
            const post_remove_tagsf = response.data.view.post.post_content.replace(regexf, '\n');
            this.setState({content:post_remove_tagsf})
        })
        .catch((error)=>{
            this.setState({isLoading:true,resultModalVisible:true,resultText:'???????????? ?????? ?????? ????????????.'})
        })
    }
    onRefresh=()=>{
        const {post_id} = this.props.route.params
        this.getCommentData(post_id)
    } 

    async componentDidMount(){
        const {post_id} = this.props.route.params
        this.context.session_chk() 
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})

    }

    render(){
        const {isLoading,post,comment,modalVisible,cmt_id,confirmModalVisible,modalType,spinnerModalVisible,resultModalVisible,brd_key} = this.state;
        console.log(this.state.post.post_comment_count);
        
       return(
        isLoading?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant'/>
        </View>
        :

        <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
            <WriteContentToptab
                text={brd_key=='indi'?'1???1??????':'????????????'}
                gbckfunc={() => {
                    this.props.navigation.goBack();
                }}
                gbckuse={true}
                right={<this.MoreAction/>}
            />
            <View style={{}}>
                <List
                    ref={"pstcmtlist"} 
                    data={comment}
                    ListHeaderComponent={this.renderPostBody(post)}
                    renderItem={this.renderCommentsList}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    style={{backgroundColor:'#ffffff'}}
                    />
            </View>
            <Modal
                visible={confirmModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({confirmModalVisible:false})}
            >
                <Confirm 
                    confirmText={this.modalList[modalType].text}
                    frstText="???"
                    OnFrstPress={() =>{this.setState({confirmModalVisible:false,spinnerModalVisible:true});this.modalList[modalType].func();}}
                    scndText="?????????"
                    OnScndPress={() => this.setState({confirmModalVisible:false,cmt_id:''})}
                />
            </Modal>
            <Modal
                visible={resultModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultModalVisible:false, cmt_id:''})}
                >
                <Confirm 
                    type = 'result'
                    confirmText={this.state.resultText}
                    frstText="??????"
                    OnFrstPress={
                        () =>{ 
                            this.setState({resultModalVisible:false, });
                            this.state.resultText.includes('??????') ? this.props.navigation.goBack() : null
                        }}
                />
            </Modal>
            <Modal
                visible={modalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({modalVisible:false,cmt_id:''})}
            >
                <View style={{width:200,borderRadius:23,backgroundColor:'#ffffff'}}>
                    {
                        this.context.session_mem_id ==post.mem_id ?  
                            <TouchableOpacity 
                                onPress={()=>{this.setState({confirmModalVisible:true,modalType:3,modalVisible:false})}}
                                style={{padding:10,margin:3}}>
                                <Text style={{fontSize:13,color:'#63579D'}}>?????? ??????</Text>
                            </TouchableOpacity>
                        :
                        <>
                            <TouchableOpacity 
                                onPress={()=>{this.props.navigation.navigate('AltReplying',{mode:'cu',comment:comment[0],post:post,onGoBack:this.onRefresh}),this.setState({modalVisible:false,cmt_id:''})}}
                                style={{padding:10,margin:3}}>
                                <Text style={{fontSize:13,color:'#63579D'}}>?????? ??????</Text>
                            </TouchableOpacity>
                                <View style={{borderWidth:0.5,borderColor:'#c4c4c4'}}/>
                            <TouchableOpacity 
                                onPress={()=>{this.setState({modalVisible:false,confirmModalVisible:true,modalType:5})}}
                                style={{padding:10,margin:3}}>
                                <Text style={{fontSize:13,color:'#63579D'}}>?????? ??????</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>   
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
class AltOpqQueList extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        const title =this.props.route.params ? this.props.route.params.title:null
        return(
            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <WriteContentToptab
                text='????????????'
                gbckfunc={() => {
                    this.props.navigation.goBack();
                }}
                gbckuse={true}
            />
               <AltQueList {...this.props} type='opq'/>
               <TouchableOpacity 
                    style={{position:'absolute', right:20,bottom:14}} 
                    onPress={()=>{this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:false,title:title})}} 
                >
                    <Writesvg />
                </TouchableOpacity>
            </SafeAreaView>
            )
    }
}
class AltQueList extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            modalVisible:false,
            list:[],
            list_showing:[],
            refreshing:false
        }
    }
    static contextType = Signing;

    
    onRefresh= () =>{
        this.getQuestions();
    }
    getQuestions = ()=>{
        const {type,scndType} = this.props
        axios.get(`https://dev.unyict.org/api/board_post/lists/${type}?type=${scndType}`)
        .then(res=>{
            this.setState({list:res.data.view.list.data.list,list_showing:res.data.view.list.data.list});
        })
        .then(res=>{
            this.setState({isLoading:false})
        })
        .catch(err=>{
            alert(JSON.stringify(err));
            this.setState({isLoading:false})
        })
    }
    
    componentDidMount(){
        this.getQuestions();    
    }
    renderQueList = ({item}) =>{
        const regex = /(<([^>]+)>)|&nbsp;/ig;
        const post_remove_tags = item.post_content.replace(regex, '');
        return(
            <TouchableOpacity style={styles.container} onPress = {()=>{this.props.navigation.navigate('AltQueContent',{post_id:item.post_id})}}>
            <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                <View style={{flexDirection:'row'}}>
                        { 
                        item.area ? 
                            item.area.length > 0?
                                item.area.map( (area)=>(
                                <Text style={{fontSize:12,fontWeight:'bold',color:'#63579D'}} key={area.act_id}>{`#${area.act_content} `}</Text>)
                                )
                                :
                                <Text style={{fontSize:12,fontWeight:'bold',color:'#63579D'}} >{`#??????`}</Text>
                                :
                            item.answer_mem_id == this.context.session_mem_id?
                                <Text style={{fontSize:12,fontWeight:'bold',color:'#63579D'}} >{`From . [ ${item.display_name} ] ??? `}</Text>
                                :
                                <Text style={{fontSize:12,fontWeight:'bold',color:'#63579D'}} >{`To . [ ${item.answer_username} ] ??? `}</Text>
                        }
                </View>
                
                        {
                            item.brd_id == 10 ?
                            <View style={{paddingRight:21}}>
                                <Text 
                                    style={{
                                        fontSize:12,
                                        fontWeight:'bold',
                                        textAlign:'right',
                                        color: item.post_comment_count > 0 ? '#63579D' : item.question_read_date==null ? '#FF6262': '#A7D8F3'
                                    }}
                                >
                                    {item.post_comment_count > 0 ?  '?????? ??????' : item.question_read_date==null ? '?????? ??????' : '?????? ???'}
                                </Text>
                                {
                                    item.question_read_date==null ?
                                    null
                                    :
                                    <View style={{flexDirection:'row'}}>
                                        <Text category='s2' style={{color:'#A7D8F3'}}>(</Text>
                                        <PostTime style={{color:'#A7D8F3'}} datetime = {item.question_read_date}/>
                                        <Text category='s2' style={{color:'#A7D8F3'}}>??????)</Text>
                                    </View>
                                }
                            </View>
                            :
                            null
                        }
            </View>
            <View>
                <Text style ={styles.headtext}category="h4" numberOfLines={1} ellipsizeMode="tail">{item.post_title}</Text>
                <Text style={styles.subtext}category="s2" numberOfLines={1}>{post_remove_tags}</Text>
            </View>
            <View style={styles.subtitle}>
                <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',marginBottom:4}}> 
                    {
                        
                    item.brd_id == 11 ?
                    <Text category="s2" style={{fontWeight:'bold',marginRight:5}}>{item.display_name}</Text>
                    :
                    null
                    }
                    <PostTime datetime = {item.post_datetime}/>
                </View>
                {
                    item.brd_id == 11 ?
                    <View style={styles.infocontainer}>
                        <View style={{alignItems:'center',}}>
                            <Heartsvg width={15} height={20}/>
                            <Text style={styles.infotext} category="s1">{item.post_like}</Text>
                        </View>
                        <View style={{alignItems:'center',}}>
                            <Commentsvg 
                             width={15} height={20}
                            />
                            <Text style={styles.infotext} category="s1">{item.post_comment_count}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Viewsvg width={20} height={20}/>
                            <Text style={styles.infotext} category="s1">{item.post_hit}</Text>
                        </View>
                    </View>
                    :
                    <View />
                }
            </View>
        </TouchableOpacity>
        )
    }
    render(){
        const {isLoading,list} = this.state;
        
        return(
            isLoading ?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Spinner size='giant'/>
            </View>
            :
            list.length > 0 ?
                <View style={{flex:1}}>
                        <List
                            data={list}
                            renderItem={this.renderQueList }
                            style={{backgroundColor:'#ffffff',}}
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}
                        />
                </View>
            :
                <NoListRes text='?????? ????????? ????????????.' onPress={()=>{this.getQuestions();}}/>
            )
    }

}


class AltQueType extends React.Component{
    constructor(props){
        super(props)
    }
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={()=>this.props.navigation.goBack()}/>
    )
    render(){
        const {navigation,route} = this.props;
        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="?????? ?????? ??????" accessoryLeft={this.BackAction}/>
                <View style={{flex:1 , justifyContent:'space-evenly', alignItems:'center'}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#A7D4DE',width:'100%',justifyContent:'center',alignItems:'center'}} 
                        onPress={()=>{
                            if(!global.mem_id) {
                                this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
                            }else {
                                navigation.navigate('AltList');
                            }
                         }
                        }>
                        <Text category ="h2" style={{fontSize:30}}>1???1 ????????????</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#EAB0B3',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{navigation.navigate('AltQuestionWrite',{anser_mem_id:false});}}>
                        <Text category ="h2" style={{fontSize:30}}>??????????????? ????????????</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}
class AltAreaList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            act_array:[],
            isLoading : true
        }
    }

    BackAction=()=>(
        <TopNavigationAction icon={BackIcon} onPress={()=>this.props.navigation.goBack()}/>
    )

    renderItem = ({item,index}) => (
        <TouchableOpacity 
            style={{borderColor:'blue',borderStyle:'solid',borderWidth:1}}
            onPress={()=>this.props.navigation.navigate('AltQuestionWrite',{act:item.act_content})}
        >
            <Text>{item.act_content}</Text>
        </TouchableOpacity>       
    )
    getAreaCategory= async()=>{
        await axios.get('https://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({act_array:res.data.data});
        })
        .then(()=>{
            this.setState({isLoading:false});
        })
        .catch(err=>{
            alert('area ???????????? ??????! ???')
        })
    }

    componentDidMount(){
        this.getAreaCategory();
    }
    render(){
        const {navigation,route} = this.props
        return(
            this.state.isLoading ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Spinner />
            </View>
            :
            <SafeAreaView style={{flex:1, alignItems:'center'}}>
                <TopNavigation title="??????????????? ?????? ??????" accessoryLeft={this.BackAction}/>
                <View style = {{flex:1,justifyContent:'space-evenly',backgroundColor:'#ffffff'}}>
                    <View style = {{flexDirection : 'row', flexWrap: 'wrap',}}>
                        {this.state.act_array.map(act => (
                            <Tag style={{marginVertical : 5}}
                                key = {act.act_content}
                                onPress ={()=>navigation.navigate('AltQuestionWrite',{act:act.act_content,act_code:act.act_id})}>
                                {act.act_content}
                            </Tag>
                        ))}
                    </View>
                    <View style={{padding:10,}}>
                        <Text category='h2' style={{fontSize:18}}>
                            !!1?????? ????????? ?????? ????????????????????? ???????????? ????????? ??? ????????????.
                        </Text>
                        <Text category='h2' style={{fontSize:18}}>
                            !!????????? ???????????? ?????? ???????????????????????? ?????? ????????? ?????? ????????? ?????????.
                        </Text>
                    </View>
                </View>    
            </SafeAreaView>

        )
    }

}

class AltQuestionWrite extends React.Component
{
    constructor(props){
        super(props);
        this.state={
            title:this.props.route.params.title ?this.props.route.params.title :null,
            content:'',
            answer_mem_id:this.props.route.params.answer_mem_id ?this.props.route.params.answer_mem_id :null,
            filterModalVisible:false,
            actSelected:[],
            act_array:[],
            resultVisible:false,
            resultText:'',
            spinnerVisible:false,
        }
    }

    sendQue = () => {
        this.setState({spinnerVisible:true})        
        const brd_key = this.props.route.params.answer_mem_id ? 'indi':'opq';
        const {title,content,answer_mem_id} = this.state;

        var formdata = new FormData();
        formdata.append('brd_key',brd_key);
        formdata.append('post_title',title);
        formdata.append('post_content',content);

        this.props.route.params.answer_mem_id ?
        formdata.append('answer_mem_id',answer_mem_id)
        :
        formdata.append('answer_expire_date','2020-09-09');
        this.state.actSelected.map(act =>{
            formdata.append('act_id[]',act.act_id)
        })
        ;
        
        axios.post('https://dev.unyict.org/api/board_write/write',formdata)
        .then(response=>{
            const {message,status}=response.data
            this.setState({spinnerVisible:false,resultVisible:true,resultText:message})        
            if(status=="200"){
                this.props.navigation.navigate('AltMain')
            }
        })
        .catch(error=>{
            alert('BYE:(')
        })
    }

    filterSpamKeyword= async() => {
        const {title,content} =this.state;
        this.setState({spinnerVisible:true})

        var formdata =new FormData();
        formdata.append("title", title);
        formdata.append("content", content);
        formdata.append("csrf_test_name", '');
        
    
        await axios.post('https://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {message,status}=response.data
            if(status=='500'){
                this.setState({spinnerVisible:false,resultVisible:true,resultText:message})
            }else if(status=="200"){
                this.sendQue()
            }

        })
        .catch(error=>{
            alert(`???????????? ????????? ?????? ????????????. ${error.message}`)
        })
    }
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )
    actSelect = (act) =>{
        const {actSelected}=this.state;
        if(actSelected.includes(act)){
            actSelected.splice(actSelected.indexOf(act),1)
            this.setState({actSelected})
        }else{
            this.setState({actSelected:actSelected.concat(act)})
        }
    }
    getAreaCategory= async()=>{
        await axios.get('https://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({act_array:res.data.data});
        })
        .then(()=>{
            this.setState({isLoading:false});
        })
        .catch(err=>{
            alert('area ???????????? ??????! ???')
        })
    }
    componentDidMount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#F4F4F4');
            StatusBar.setBarStyle('dark-content');
        }
        this.getAreaCategory()
    }

    componentWillUnmount(){
        if(Platform.OS!=='ios'){
            StatusBar.setBackgroundColor('#B09BDE');
            StatusBar.setBarStyle('default');
        }
    }
    render(){
        const {title,content,filterModalVisible,actSelected,resultVisible,resultText,spinnerVisible} = this.state;
        const {act,answer_mem_id,brd_key,item,altruist} = this.props.route.params;
        const {width,height} =Dimensions.get('window')
        return(
        <SafeAreaView style={{flex:1}}>
            <WriteContentToptab
                text={ answer_mem_id ? '1???1 ??????': '????????????'}
                right={this.props.route.params.mode == 'edit' ? 'edit' : 'upload'}
                func={() => {
                    Keyboard.dismiss()
                    this.filterSpamKeyword();
                }}
                gbckfunc={() => {
                    this.props.navigation.goBack();
                }}
                gbckuse={true}
            />
            <KeyboardAvoidingView
                    style={{flex:1,borderWidth:0}} 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <Pressable 
                    style={{ flex:1,backgroundColor:"#f4f4f4",padding:10,borderWidth:0}}
                    onPress={()=>Keyboard.dismiss()}
                >
                    <View style={{display:'flex',flexDirection:'row',paddingHorizontal:10}}>
                    {
                        answer_mem_id ? 
                        <View>
                            <Text style={{fontSize:13, fontWeight:'700',color:'#63579D',marginLeft:16}} >
                            { `[${altruist.mem_basic_info.mem_username}] ?????? ????????? ????????????.`}
                            </Text>
                        </View>
                        :
                        <TouchableOpacity 
                            style = {{height:21,width:23,backgroundColor:'#63579D',borderRadius:7,justifyContent:'center'}} 
                            onPress={()=>this.setState({filterModalVisible:true})}
                        >
                            <Text style={{color:'#ffffff',fontSize:24,textAlign:'center',textAlignVertical:'center'}}>+</Text>    
                        </TouchableOpacity>
                    }
                    {
                        this.state.actSelected.length >0 ?
                        <ScrollView horizontal={true} style={{}} >
                                {this.state.actSelected.map((act,index) => (
                                    <TouchableHighlight
                                        onPress ={()=>{this.state.actSelected.splice(index,1);this.setState({actSelected:this.state.actSelected})}}
                                        key = {act.act_content}
                                    >
                                        <View 
                                            style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',paddingHorizontal:5}} 
                                        >
                                            <Tag style={[styles.tagSelected,{marginRight:3}]}
                                                key = {act.act_content}
                                            >
                                                {act.act_content}
                                            </Tag>
                                            <View style={{backgroundColor:'#000000',opacity:0.3,borderRadius:5}}>
                                                <Text> x </Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                ))}
                        </ScrollView >
                        :
                        answer_mem_id ? 
                        null:
                        <View>
                            <Text style={{fontSize:13, fontWeight:'700',color:'#63579D',marginLeft:16}} >?????? ????????? ????????? ??? ????????????.</Text>
                        </View>

                    }
                    </View>
                    
                    <View>
                        <TextInput 
                            style={styles.titleInput} 
                            value={title} 
                            onChangeText={text =>this.setState({title:text})}
                            placeholder="??????"
                            placeholderTextColor='#A897C2'
                        />
                    </View>
                    <View style={{height:'40%'}}>
                        <TextInput 
                            style={styles.contentInput} 
                            value={content} 
                            onChangeText={text =>this.setState({content:text}) }
                            textAlignVertical='top'
                            multiline={true}
                            placeholder="??????"
                            placeholderTextColor='#A897C2'
                        />
                    </View>
                </Pressable>
           </KeyboardAvoidingView>
           <Modal
                visible={filterModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({filterModalVisible:false})}
                style={{justifyContent:'center'}}
            >
                <View style={{backgroundColor:'#ffffff',borderRadius:20,width:width*0.8}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text category='h2' style={{fontSize:13,marginVertical:11,color:'#63579D'}}>?????? ??????</Text>
                        <View style={{borderWidth:1,borderColor:'#E3E3E3',width:'90%',marginBottom:15}}></View>
                    </View>
                    <ScrollView ScrollViewstyle = {{}}>
                        <View style = {{justifyContent:'space-between',flexDirection : 'row', flexWrap: 'wrap',paddingHorizontal:'5%'}}>
                            {this.state.act_array.map(act => (
                                <Tag 
                                    key = {act.act_content}
                                    onPress ={()=>{
                                        this.actSelect(act);
                                    }}
                                    style={[{padding:4},actSelected.includes(act) ? styles.tagSelected:{}]}
                                >
                                    {act.act_content}
                                </Tag>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{alignItems:'center',justifyContent:'center',marginVertical:20}}>
                        <TouchableHighlight 
                            onPress={()=>{this.setState({filterModalVisible:false})}} 
                            style={{backgroundColor:'#63579D', paddingVertical:4,paddingHorizontal:20,borderRadius:8.5}}>
                            <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff'}}>??????</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={resultVisible}
                backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({resultVisible: false})}>
                <Confirm
                    type="result"
                    confirmText={this.state.resultText}
                    frstText="??????"
                    OnFrstPress={() => {
                        this.setState({resultVisible: false});
                    }}
                />
            </Modal>
            <Modal
                visible={spinnerVisible}
                backdropStyle={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                <Spinner size="giant" />
            </Modal>
        </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    titleInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginVertical:20,
        fontSize:18,
        minHeight:45
    },
    contentInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20,
        fontSize:18,
        height:'100%'
    },
    fieldtitle:{
        padding :10
    },
    indicatorStyle:{
        height:0
    },
    tagSelected:{
        color:'#63579D'
    },
    topbar : {
        backgroundColor : '#ffffff',
    },
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
        display:"flex",
        flexDirection:"row",
        justifyContent:'space-evenly'
        ,alignItems:'flex-end',    
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
        paddingTop:10,
        fontWeight:'bold'
    },
    subtext:{
        marginTop:5,
        maxWidth:200
    }

})

export {AltQuestionWrite,AltQueType,AltAreaList,AltQueList,AltQueContent,AltReplying,AltOpqQueList};