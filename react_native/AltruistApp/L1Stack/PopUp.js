import React from 'react';
import {SafeAreaView,View,Text,StyleSheet,Pressable,ScrollView} from 'react-native';
import {Spinner} from '@ui-kitten/components'
import WebView from 'react-native-webview'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'
import { WebViewInView } from './Webview'
// ios에서 에러 일으켜서 주석처리합니다 ㅠ
//import { is } from 'core-js/fn/object';

class PopUp extends React.Component{
    constructor(props){
        super(props)
        this.state={
            popups:[],
            isLoading:true,
            html:'',
        }
    }
    doNotPopUp = () =>{
        var data = {
            time: Date.now(),
            id: 'id',
        }
        AsyncStorage.setItem('popUpClosedTime',JSON.stringify(data));
        this.props.navigation.goBack();

    }
    
    componentDidMount(){
        this.setState({isLoading:false,
            html:`
            <head>
                <style>
                    body{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    img{
                        width:100vw;

                    }
                </style>
            <head>
            <body>
            ${this.props.route.params.popup ? this.props.route.params.popup : null} 
            </body>
            
            `
        })
    }
    render(){
        const {isLoading,html} = this.state;

        return(
            
            <SafeAreaView style={{flex:1}}>
                <View style={{flex:1,backgroundColor:'#f0f0f0'}}>
                {
                    isLoading ?
                    <View style={styles.container}>
                        <Spinner />
                    </View>
                            :
                    <WebView
                    source={{html:html } }
                    scrollEnabled={true}
                />
                }
                </View>
                <View style ={{flex:1, flexDirection:'row',position:'absolute',bottom:0}}>
                    <View style={styles.btnContainer}>
                        <Pressable 
                            style={styles.container}
                            onPress={()=>this.props.navigation.goBack()}
                        >
                            <View>
                                <Text style={{color:'#ffffff'}}>닫기</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={{borderWidth:0.5,borderColor:'#ffffff'}}></View>
                    <View style={styles.btnContainer}>
                        <Pressable 
                            style={styles.container}
                            onPress={()=>this.doNotPopUp()}
                        >
                            <View>
                                <Text style={{color:'#ffffff'}}>24시간 동안 보지 않기</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default PopUp ;

const styles =StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    btnContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:15,
        backgroundColor:'rgba(77, 77, 77, 0.7)',
    }
})