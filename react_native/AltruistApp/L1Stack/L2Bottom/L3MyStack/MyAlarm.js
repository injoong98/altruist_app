import React from 'react';
import {View,SafeAreaView,TouchableOpacity,Linking,StyleSheet} from 'react-native';
import messaging from '@react-native-firebase/messaging'
import {Text} from '@ui-kitten/components'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'

export class MyAlarmSetting extends React.Component{

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
            <SafeAreaView style={{flex:1,display:'flex'}}>
                <WriteContentToptab
                        text='알림 설정'
                        gbckfunc={() => {
                            this.props.navigation.goBack();
                        }}
                        gbckuse={true}
                />
                <View style={styles.container}>
                    <View style={{alignItems:'center'}}>
                        <Text category='h1' style={styles.title}>
                            {'이타주의자 푸쉬 알림은 '}
                        </Text>
                        <Text category='h1' style={{fontSize:18}}>
                            {'설정앱에서 관리할 수 있습니다.'}
                        </Text>
                    </View>
                    <View>
                        <Text category='h1' style={styles.title}>
                            안드로이드
                        </Text>
                        <Text style={styles.content}>
                            {'기기 설정 > 앱 > 이타주의자들 > 알림'}   
                        </Text>
                        <Text category='h1' style={styles.title}>
                            iOS
                        </Text>
                        <Text style={styles.content}>
                            {'기기 설정 > 이타주의자들 > 알림'}   
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:30,justifyContent:'center'}}>
                        <TouchableOpacity 
                            onPress={()=>{Linking.openSettings()}}
                            style={styles.btn}
                        >
                            <Text category='h1' style={styles.btnText}>{'앱 알림 설정 바로가기>>'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
        padding:'5%'

    },
    title:{
        fontSize:18,
        marginTop:20
    },
    content:{
        marginTop:20
    },
    btnText:{
        color:'#ffffff',
        fontSize:16
    },
    btn:{
        backgroundColor:'#63579D',
        padding:'3%',
        borderRadius:8

    }
})