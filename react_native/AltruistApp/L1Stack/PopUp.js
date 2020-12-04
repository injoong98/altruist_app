import React from 'react';
import {SafeAreaView,View,Text,StyleSheet,Pressable} from 'react-native';
import WebView from 'react-native-webview'
import AsyncStorage from '@react-native-community/async-storage';

class PopUp extends React.Component{
    constructor(props){
        super(props)
    }
    doNotPopUp = () =>{
        var data = {
            time: Date.now(),
            id: 'id',
        }
        AsyncStorage.setItem('popUpClosedTime',JSON.stringify(data))
        console.log('doNotPopUp : '+JSON.stringify(data));
    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.container,{flex:9}]}>
                    <Text> pop Up Screen !! </Text>
                    <Pressable 
                        style={[styles.container,{width:'100%'}]}
                        onPress={async()=>{
                        const  test =  await AsyncStorage.getItem('popUpClosedTime')
                            console.log(test)
                        }}
                    >
                        <View style={{}}>
                            <Text>확인</Text>
                        </View>
                    </Pressable>
                </View>
            <View style ={{flex:1, flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Pressable 
                        style={styles.container}
                        onPress={()=>this.props.navigation.goBack()}
                    >
                        <View>
                            <Text>닫기</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Pressable 
                        style={styles.container}
                        onPress={()=>this.doNotPopUp()}
                    >
                        <View>
                            <Text>24시간 동안 보지 않기</Text>
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
        borderWidth:2,
        justifyContent:'center',
        alignItems:'center'
    }
})