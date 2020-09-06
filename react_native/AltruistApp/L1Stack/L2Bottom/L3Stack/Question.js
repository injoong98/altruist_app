import React from 'react';
import {SafeAreaView,TextInput,View,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Alert, ScrollView} from 'react-native'
import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction,List,Spinner,Divider,Modal,Popover} from '@ui-kitten/components'
import axios from 'axios'

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
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)
class AltQueReply extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            post:'',
            comment:'',
            refreshing:false,

        }
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
        </View>
        </View>
    )
    renderPostBody = (post)=>{
        console.log(JSON.stringify(post))
        
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
                    </View>
                </View>
            </View>
        )
    }
    getCommentData = async (post_id)=>{
        await axios.get(`http://dev.unyict.org/api/comment_list/lists/${post_id}`)
        .then((response)=>{
            this.setState({comment:response.data.view.data.list})
        })
        .catch((error)=>{
            alert('error')
        })
    }
    getPostData = async (post_id)=>{
        await axios.get(`http://dev.unyict.org/api/board_post/post/${post_id}`)
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
        this.getCommentData(post_id)
    } 

    async componentDidMount(){
        const {post_id} = this.props.route.params
        await this.getPostData(post_id)
        .then(()=>this.getCommentData(post_id))
        .then(()=>{this.setState({isLoading:false})})

    }

    render(){
        const {isLoading,post,comment} = this.state;
       return(
        isLoading?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Spinner size='giant'/>
        </View>
        :

        <SafeAreaView style={{flex:1}}>
            <TopBarTune 
                text='질문' 
                right="bell"
                func={() =>{this.props.navigation.navigate('Meet')}} 
                gbckfunc={()=>{this.props.navigation.goBack()}} 
                gbckuse={true}
            />
            <View style={{flex:1}}>
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
        </SafeAreaView>
       ) 
    }
}
class AltOpqQueList extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            isLoading:true,
            modalVisible:false,
            list:[],
            list_showing:[],
        }
    }

    getQuestions = ()=>{
        axios.get('http://dev.unyict.org/api/board_post/lists/opq')
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

    renderQueList = ({item,list}) =>{
        return(
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('AltQueReply',{post_id:item.post_id})}}>
                <Text>보낸 사람 {item.post_userid}</Text>
                <Text>질문 제목 {item.post_title}</Text>
                <Text>받는 사람 {item.answer_mem_id}</Text>
            </TouchableOpacity>
        )
    }

    componentDidMount(){
        this.getQuestions();    
    }

    render(){
        const {isLoading,list} = this.state;
        
        return(
            isLoading ?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Spinner size='giant'/>
            </View>:
            <SafeAreaView>
                <TopBarTune 
                    text='오픈 질문' 
                    right="bell"
                    func={() =>{this.filterSpamKeyword()}} 
                    gbckfunc={()=>{this.props.navigation.goBack()}} 
                    gbckuse={true}
                />
                <View>
                    <Text>필터 위치</Text>
                </View>
                <List 
                    ItemSeparatorComponent={Divider}
                    data={list}
                    renderItem={this.renderQueList}
                />
            </SafeAreaView>
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
                <TopNavigation title="질문 유형 선택" accessoryLeft={this.BackAction}/>
                <View style={{flex:1 , justifyContent:'space-evenly', alignItems:'center'}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#A7D4DE',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{navigation.navigate('AltList');}}>
                        <Text category ="h2" style={{fontSize:30}}>1대1 질문하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#EAB0B3',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{navigation.navigate('AltQuestionWrite',{anser_mem_id:false});}}>
                        <Text category ="h2" style={{fontSize:30}}>여러명에게 질문하기</Text>
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
        await axios.get('http://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({act_array:res.data.data});
        })
        .then(()=>{
            this.setState({isLoading:false});
        })
        .catch(err=>{
            alert('area 불러오기 실패! ㅜ')
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
                <TopNavigation title="이타주의자 분야 선택" accessoryLeft={this.BackAction}/>
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
                            !!1대다 질문은 모든 이타주의자들이 조회하고 답변할 수 있습니다.
                        </Text>
                        <Text category='h2' style={{fontSize:18}}>
                            !!분야를 선택하면 해당 이타주의자들에게 질문 등록에 대한 알림이 갑니다.
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
            act_array:[]

        }
    }

    sendQue = () => {
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
        
        axios.post('http://dev.unyict.org/api/board_write/write',formdata)
        .then(response=>{
            Alert.alert(
                "이타주의자",
                `"질문을 전달했습니다!"\n${JSON.stringify(response.data)}`,
                [
                    { 
                        text: "닫기", 
                        onPress: ()=> this.props.navigation.goBack()
                    }
                ],
                { cancelable: false }
            );
        })
        .catch(error=>{
            alert('BYE:(')
        })
    }

    filterSpamKeyword= async() => {
        const {title,content} =this.state;
        
        var formdata =new FormData();
        formdata.append("title", title);
        formdata.append("content", content);
        formdata.append("csrf_test_name", '');
        
    
        await axios.post('http://dev.unyict.org/api/postact/filter_spam_keyword',formdata)
        .then(response=>{
            const {message,status}=response.data
            if(status=='500'){
                alert(message)
            }else if(status=="200"){
                Alert.alert(
                    "이타주의자",
                    "질문을 보내시겠습니까?",
                    [
                        { 
                            text: "보내기", 
                            onPress: ()=> this.sendQue()
                        },
                        {
                            text: "취소",
                            onPress: () => alert('취소했습니다.')
                        }
                        
                    ],
                    { cancelable: false }
                );
            }

        })
        .catch(error=>{
            alert(`금지단어 검사에 실패 했습니다. ${error.message}`)
        })
    }
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    getAreaCategory= async()=>{
        await axios.get('http://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({act_array:res.data.data});
        })
        .then(()=>{
            this.setState({isLoading:false});
        })
        .catch(err=>{
            alert('area 불러오기 실패! ㅜ')
        })
    }
    componentDidMount(){
        this.getAreaCategory()
    }

    render(){
        const {title,content,filterModalVisible} = this.state;
        const {act,answer_mem_id,brd_key,item,} = this.props.route.params

        return(
        <SafeAreaView style={{flex:1}}>
            <TopBarTune 
                text={ item ? `${item.mem_basic_info.mem_username}님께 질문`: '모두에게 질문'} 
                right="upload"
                func={() =>{this.filterSpamKeyword()}} 
                gbckfunc={()=>{this.props.navigation.goBack()}} 
                gbckuse={true}
            />
            <KeyboardAvoidingView
                    style={{flex:1}} 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <View style={{ flex:1,backgroundColor:"#f4f4f4",padding:10}}>
                    <View style={{display:'flex',flexDirection:'row'}}>
                    {
                        this.props.route.params.answer_mem_id ? 
                        null
                        :
                        <TouchableOpacity 
                            style = {{height:35,width:35,backgroundColor:'#B09BDE',borderRadius:10,justifyContent:'center'}} 
                            onPress={()=>this.setState({filterModalVisible:true})}
                        >
                            <Text category='h2' style={{color:'#ffffff',fontSize:30,textAlign:'center',textAlignVertical:'center'}}>+</Text>    
                        </TouchableOpacity>
                    }
                    {
                        this.state.actSelected.length >0 ?
                        <ScrollView horizontal={true} style={{}} >
                                {this.state.actSelected.map((act,index) => (
                                    <Tag style={{marginVertical : 5}}
                                        key = {act.act_content}
                                        onPress ={()=>{this.state.actSelected.splice(index,1);this.setState({actSelected:this.state.actSelected})}}>
                                        {act.act_content}
                                    </Tag>
                                ))}
                        </ScrollView >
                        :
                        this.props.route.params.answer_mem_id ? 
                        null:
                        <View>
                            <Text style={{marginVertical:9,fontSize:15}} category = 'c2'>알림을 보낼 이타주의자 분야를 선택할 수 있습니다.</Text>
                        </View>

                    }
                    </View>
                    
                    <View>
                        <TextInput 
                            style={styles.titleInput} 
                            value={title} 
                            onChangeText={text =>this.setState({title:text})}
                            placeholder="제목"
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
                            placeholder="내용"
                            placeholderTextColor='#A897C2'
                        />
                    </View>
                </View>
           </KeyboardAvoidingView>
           <Modal
                visible={filterModalVisible}
                backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                onBackdropPress={() => this.setState({filterModalVisible:false,cmt_id:''})}
            >
                <View style = {{flex:1,justifyContent:'space-evenly',backgroundColor:'#ffffff'}}>
                    <View style = {{flexDirection : 'row', flexWrap: 'wrap',}}>
                        {this.state.actSelected.map((act,index) => (
                            <Tag style={{marginVertical : 5}}
                                key = {act.act_content}
                                onPress ={()=>{this.state.actSelected.splice(index,1);this.setState({actSelected:this.state.actSelected})}}>
                                {act.act_content}
                            </Tag>
                        ))}
                    </View>
                    <Divider />
                    <View style = {{flexDirection : 'row', flexWrap: 'wrap',}}>
                        {this.state.act_array.map(act => (
                            <Tag 
                                key = {act.act_content}
                                onPress ={()=>this.setState({actSelected:this.state.actSelected.concat(act)})}
                                disabled ={this.state.actSelected.includes(act) ? true: false}
                                style={this.state.actSelected.includes(act) ? styles.tagDisabled:{marginVertical : 2}}
                            >
                                {act.act_content}
                                
                            </Tag>
                        ))}
                    </View>
                    <View style={{padding:10,}}>
                        <Text category='h2' style={{fontSize:18}}>
                            !!1대다 질문은 모든 이타주의자들이 조회하고 답변할 수 있습니다.
                        </Text>
                        <Text category='h2' style={{fontSize:18}}>
                            !!분야를 선택하면 해당 이타주의자들에게 질문 등록에 대한 알림이 갑니다.
                        </Text>
                    </View>
                </View>
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
    tagDisabled:{
        backgroundColor:'#8D8D8D',
        marginVertical : 2,
        borderRadius:20
    },
    topbar : {
        backgroundColor : '#ffffff',
    },

})

export {AltQuestionWrite,AltQueType,AltAreaList,AltOpqQueList,AltQueReply};