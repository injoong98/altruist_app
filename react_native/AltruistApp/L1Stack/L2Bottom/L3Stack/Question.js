import React from 'react';
import {SafeAreaView,TextInput,View,StyleSheet,TouchableOpacity} from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction,List,Spinner,TabNavigator,TabBar} from '@ui-kitten/components'
import axios from 'axios'
import Tag from '../../../components/tag.component'
import TopBarTune from '../../../components/TopBarTune'
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

class AltQueList extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            list:[],

        }

    }

    getQue = ()=>{

        axios.post()
        .then
    }

    renderQueList = ({item,list}) =>{
        return(
            <TouchableOpacity>
                <Text>From.질문자</Text>
                <Text>제목</Text>
                <Text>본문 미리보기...</Text>
            </TouchableOpacity>
        )
    }
    
    render(){
        return(
            <SafeAreaView>
                <Text>{this.props.type}</Text>
                {/* <List 
                    data={}
                    renderItem={}
                /> */}
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
                    <TouchableOpacity style={{flex:1,backgroundColor:'#A7D4DE',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{alert('1대1');navigation.navigate('AltList');}}>
                        <Text category ="h2" style={{fontSize:30}}>1대1 질문하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#EAB0B3',width:'100%',justifyContent:'center',alignItems:'center'}} onPress={()=>{alert('1대다');navigation.navigate('AltAreaList');}}>
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
            user_recieve:this.props.reciever,
        }
    }

    sendQue = () => {
        var formdata = new FormData();
        formdata.append('brd_key',)
        formdata.append('post_title',)
        formdata.append('brd_key',)
        
        axios.post('http://dev.unyict.org/api/board_write/write')
        .then(res=>{
            alert(JSON.stringify(res.data))
        })
        .catch(err=>{
            alert(JSON.stringify(err))
        })
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){
        const {title,content} = this.state;
        const {act} = this.props.route.params

        return(
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction}/> 
            <View style={{ flex:1,backgroundColor:"#f4f4f4",padding:10}}>
                <View>
                    <Text>{act}</Text>
                    <Text>이타주의자에게 질문</Text>
                </View>
               <View>
                    <Text style={styles.fieldtitle}>제목</Text>
                    <TextInput style={styles.titleInput} value={title} onChangeText={text =>this.setState({title:text})}/>
               </View>
               <View>
                    <Text style={styles.fieldtitle}>내용</Text>
                    <TextInput 
                        style={styles.contentInput} 
                        value={content} 
                        onChangeText={text =>this.setState({content:text}) }
                        textAlignVertical='top'
                        multiline={true}
                    />
               </View>
            </View>
            <Button onPress ={()=>{alert("질문 약관 \n 활동분야 외 질문은 안 됩니다. ")}}>질문 보내기</Button>
        </SafeAreaView>
        )

    }
}

const styles = StyleSheet.create({
    titleInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20
    },
    contentInput :{
        backgroundColor:'#ffffff',
        borderRadius:15,
        marginHorizontal:10,
        marginBottom:20,
        height:200
    },
    fieldtitle:{
        padding :10
    },
    indicatorStyle:{
        height:0
    }

})

export {AltQuestionWrite,AltQueType,AltAreaList,AltQueList};