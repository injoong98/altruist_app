import React from 'react';
import {View,SafeAreaView,Text,TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging'
import { TextInput } from 'react-native-gesture-handler';


export class MyAlarm extends React.Component{

    constructor(props){
        super(props);
        this.state={
            myToken : 'i dnt knw'
        }
    }

    subsTopic = (topic) =>{
        messaging()
    .subscribeToTopic(topic)
    .then(() => console.log('Subscribed to topic!'));
    }
    unSubsTopic = (topic) =>{
        messaging()
    .unsubscribeFromTopic(topic)
    .then(() => console.log('Subscribed to topic!'));
    }
    getToken = () =>{
        messaging().getToken()
        .then(token=>{
            this.setState({myToken:token})
        })
    }
    render(){
        return(
            <SafeAreaView style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>{this.subsTopic('alarm')}}>
                    <Text>
                        alarm구독
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.unSubsTopic('alarm')}}>
                    <Text>
                        alarm구독 취소 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.getToken()}}>
                    <Text>
                        토큰 가져오기
                    </Text>
                    <Text>
                        {this.state.myToken}
                    </Text>
                    <TextInput 
                        value={this.state.myToken}
                        onChangeText={text=>this.setState({myToken:text})}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}