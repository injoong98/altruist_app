import React,{useState} from 'react';
import {SafeAreaView, View, TextInput, StyleSheet,TouchableHighlight} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import {WriteContentToptab} from '../../../components/WriteContentTopBar'
import Despairsvg from '../../../assets/icons/despair.svg'
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)



class ApplyFailScreen extends React.Component{
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
                            this.props.navigation.goBack();
                        }}
                        gbckuse={true}
                    />
                    <Layout style={styles.wrapper}>
                        <View style={{alignItems:'center',paddingHorizontal:20,paddingTop:35,paddingBottom:0}}>
                            <View style={{position:'absolute',top:0,right:0}}>
                                <Despairsvg height={58} width={45}/>
                            </View>
                            <Text category='h2' style={styles.title}>지원 실패</Text>
                        </View>
                        <View style={{marginTop:30,alignItems:'center'}}>
                            <Text style={{}}> 지원에 실패했습니다.</Text>
                            <Text style={{}}> 네트워크 상태를 확인하고 필수값을 모두 입력해주세요</Text>
                            <Text style={{marginTop:10}}> 이 오류가 반복되면</Text>
                            <Text style={{}}> 네트워크 관리자에게 문의해주세요</Text>
                        </View>
                        <TouchableHighlight 
                            style={{marginTop:50,borderRadius:7.5,backgroundColor:'#63579D',paddingVertical:8,paddingHorizontal:16}}
                            onPress={() => this.props.navigation.goBack()}>
                                <View style={{ alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>지원서 작성으로</Text>
                                    <Text style={{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>돌아 가기</Text>
                                </View>
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



export default ApplyFailScreen;