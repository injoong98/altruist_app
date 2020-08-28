import React from 'react';

import {SafeAreaView,TextInput,View,StyleSheet,TouchableOpacity} from 'react-native'
import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction,List,Spinner} from '@ui-kitten/components'
import axios from 'axios'


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)


class AltQueType extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {navigation,route} = this.props
        return(
            <SafeAreaView style={{flex:1}}>
                <Text>{route.params.act_content}</Text>
                <View style={{flex:1 , justifyContent:'center', alignItems:'center'}}>
                    <Button onPress={()=>{alert('1대1')}}>
                        1대1 질문하기
                    </Button>
                    <Button onPress={()=>{alert('1대다');navigation.navigate('AltQuestion');}}>
                        다수에게 질문하기
                    </Button>
                </View>
            </SafeAreaView>
        )
    }
}
class AltAreaList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            area_category:[],
            isLoading : true
        }
    }
    renderItem = ({item,index}) => (
        <TouchableOpacity 
            style={{borderColor:'blue',borderStyle:'solid',borderWidth:1}}
            onPress={()=>this.props.navigation.navigate('AltQueType',{act_content:item.act_content})}
        >
            <Text>{item.act_content}</Text>
        </TouchableOpacity>       
    )
    getAreaCategory= async()=>{
        await axios.get('http://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({area_category:res.data.data,isLoading:false});
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
            <SafeAreaView style={{borderColor:'blue',borderStyle:'solid',borderWidth:1,flex:1 , justifyContent:'center', alignItems:'center'}}>
                <List
                    data={this.state.area_category}
                    renderItem={this.renderItem}
                />
            </SafeAreaView>

        )
    }

}

class AltQuestionScreen extends React.Component
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

        return(
        <SafeAreaView style={{flex:1}}>
            <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction}/> 
            <View style={{ flex:1,backgroundColor:"#f4f4f4",padding:10}}>
                <View>
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
    }

})

export {AltQuestionScreen,AltQueType,AltAreaList};