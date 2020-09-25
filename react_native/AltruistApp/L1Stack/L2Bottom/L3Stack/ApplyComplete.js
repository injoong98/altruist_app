import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet,TouchableHighlight} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import FlowerP from '../../../assets/icons/flower-peach.svg'
import FlowerS from '../../../assets/icons/flower-sky.svg'
import FlowerY from '../../../assets/icons/flower-yellow.svg'
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)



class ApplyCompleteScreen extends React.Component{
    constructor(props){
        super(props)
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){ 
        return(
            <SafeAreaView style={styles.container}>
                    <WriteContentToptab
                        gbckfunc={() => {
                            this.props.navigation.navigate('AltMain');
                        }}
                        gbckuse={true}
                    />
                    <Layout style={styles.wrapper}>
                        <View style={{alignItems:'center',paddingHorizontal:30,paddingTop:35,paddingBottom:0}}>
                            <Text category='h2' style={styles.title}>이타주의자</Text>
                            <Text category='h2' style={styles.title}>지원 완료!</Text>
                            <View style={{position:'absolute',bottom:0,right:0}}>
                                <FlowerS height={30.8} width={30}/>
                            </View>
                            <View style={{position:'absolute',top:40,left:5}}>
                                <FlowerY height={15.8} width={15}/>
                            </View>
                            <View style={{position:'absolute',top:5,left:15}}>
                                <FlowerP height={30.8} width={30}/>
                            </View>
                        </View>
                        <View style={{marginTop:30,alignItems:'center'}}>
                            <Text style={{}}> 이타주의자 등록을 환영합니다!</Text>
                            <Text style={{marginTop:10}}> 관리자 확인과 정식 등록 시 리스트에 보이게 됩니다.</Text>
                            <Text style={{marginTop:10}}> {`마이페이지 > 내 정보 > 이타주의자 항목 에서`}</Text>
                            <Text style={{marginTop:10}}> 수정 원하는 부분을 수정할 수 있습니다!</Text>
                        </View>
                        <TouchableHighlight 
                            style={{marginTop:50, alignItems:'center',justifyContent:'center',borderRadius:7.5,height:33,width:60,backgroundColor:'#63579D'}}
                            onPress={() => this.props.navigation.navigate('AltMain')}>
                            <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>완료</Text>
                        </TouchableHighlight>
                    </Layout>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff',
    },
    wrapper :{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        color:'#63579D',
        fontSize:36
      }
});



export default ApplyCompleteScreen;