import React from 'react';

import {SafeAreaView,TextInput,View,StyleSheet} from 'react-native'
import {Layout,Text,TopNavigation, Button,Icon, TopNavigationAction} from '@ui-kitten/components'
import axios from 'axios'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

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
                    />
               </View>
            </View>
            <Button onPress ={{}}>질문 보내기</Button>
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

export default AltQuestionScreen;