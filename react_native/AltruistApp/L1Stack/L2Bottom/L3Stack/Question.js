import React from 'react';
import {SafeAreaView,TextInput,View,StyleSheet,TouchableOpacity, Modal,KeyboardAvoidingView,Alert} from 'react-native'

import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction,List,Spinner,Divider} from '@ui-kitten/components'
import axios from 'axios'
import Tag from '../../../components/tag.component'
import {TopBarTune} from '../../../components/TopBarTune'
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

class AltQueList extends React.Component{
    
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
        axios.get('http://dev.unyict.org/api/board_post/lists/indi')
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
            <TouchableOpacity>
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
                    <TouchableOpacity style={{flex:1,backgroundColor:'#EAB0B3',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{navigation.navigate('AltAreaList');}}>
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
            title:'',
            content:'',
            answer_mem_id:this.props.route.params.answer_mem_id,
            brd_key:this.props.route.params.brd_key,
        }
    }

    sendQue = () => {
        const {title,content,answer_mem_id,brd_key} = this.state;
        var formdata = new FormData();
        formdata.append('brd_key',brd_key);
        formdata.append('post_title',title);
        formdata.append('post_content',content);
        formdata.append('answer_mem_id',answer_mem_id);
        
        axios.post('http://10.0.2.2/api/board_write/write',formdata)
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

    render(){
        const {title,content} = this.state;
        const {act,answer_mem_id,brd_key,item} = this.props.route.params

        return(
        <SafeAreaView style={{flex:1}}>
            <TopBarTune 
                text={`${item.mem_basic_info.mem_username}님께 질문`} 
                func={() =>{this.filterSpamKeyword()}} 
                right="upload"
                gbckfunc={()=>{this.props.navigation.goBack()}} 
                gbckuse={true}
            />
            <KeyboardAvoidingView
                    style={{flex:1}} 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <View style={{ flex:1,backgroundColor:"#f4f4f4",padding:10}}>
                    <View>
                        <TextInput 
                            style={styles.titleInput} 
                            value={title} 
                            onChangeText={text =>this.setState({title:text})}
                            placeholder="제목"
                            placeholderTextColor='#A897C2'
                        />
                    </View>
                    <View>
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
        </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    titleInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20,
        fontSize:18,
        minHeight:45
    },
    contentInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20,
        height:200,
        fontSize:18,
        maxHeight:'120%',
        minHeight:'70%'
    },
    fieldtitle:{
        padding :10
    },
    indicatorStyle:{
        height:0
    }

})

export {AltQuestionWrite,AltQueType,AltAreaList,AltQueList};