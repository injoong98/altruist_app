import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaView, View, TextInput, StyleSheet} from 'react-native'
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Radio, CheckBox, Card } from '@ui-kitten/components'
import { FlatList, ScrollView } from 'react-native-gesture-handler';


const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)



class AltApplyFormScreen extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            //기본사항
            aboutme : '',
            aboutmyself : '',
            answertype : '',
            photo : '',
            //경력사항
            type : '',
            year: [],
            contents:[],
            final : '',
            files:[],
            status:[],
            open: ''

        }
    }
    
    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    render(){ 
        const {aboutme
        ,aboutmyself
        ,answertype
        ,status
        ,honor
        ,careertype
        ,careeryear
        ,careerfinal
        ,careerfile
        ,careerstatus
        ,careeropen
        ,categoryid} = this.state;
        return(
            <SafeAreaView style={styles.container}>
                <TopNavigation 
                title="이타주의자" accessoryLeft={this.BackAction} /> 
                    <View>
                        <Text> 이타주의자 지원하기 FORM </Text>
                    </View>
                    <ScrollView>
                    <View style={{flexDirection:'row'}}>
                        <Text>자기PR</Text>
                        <TextInput style={styles.contentInput} value={aboutme} onChangeText={text =>this.setState({aboutme:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>자기소개</Text>
                        <TextInput style={styles.contentInput} value={aboutmyself} onChangeText={text =>this.setState({aboutmyself:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>답변대기</Text>
                        <TextInput style={styles.contentInput} value={answertype} onChangeText={text =>this.setState({answertype:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>상태</Text>
                        <TextInput style={styles.contentInput} value={status} onChangeText={text =>this.setState({status:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>명예여부</Text>
                        <TextInput style={styles.contentInput} value={honor} onChangeText={text =>this.setState({honor:text})}/>
                    </View>

                    {/* 경력구분 */}
                    <View style={{flexDirection:'row'}}>
                        <Text>경력년도</Text>
                        <TextInput style={styles.contentInput} value={careertype} onChangeText={text =>this.setState({careertype:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>경력내용</Text>
                        <TextInput style={styles.contentInput} value={careeryear} onChangeText={text =>this.setState({careeryear:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>최종경력여부</Text>
                        <TextInput style={styles.contentInput} value={careerfinal} onChangeText={text =>this.setState({careerfinal:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>증빙용첨부파일</Text>
                        <TextInput style={styles.contentInput} value={careerfile} onChangeText={text =>this.setState({careerfile:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>경력인증상태</Text>
                        <TextInput style={styles.contentInput} value={careerstatus} onChangeText={text =>this.setState({careerstatus:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>공개여부</Text>
                        <TextInput style={styles.contentInput} value={careeropen} onChangeText={text =>this.setState({careeropen:text})}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>경력 카테고리코드	</Text>
                        <TextInput style={styles.contentInput} value={categoryid} onChangeText={text =>this.setState({categoryid:text})}/>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Button style={{margin:10}}>취소</Button>
                        <Button style={{margin:10}} onPress={()=>navigation.navigate('AltApplyComplete')}>완료</Button>
                    </View>
                    </ScrollView>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper :{
        margin: 10,
        backgroundColor: "#eaeaea"
      },
      title: {
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      },
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
        // 휴대폰 width - titleInput
        width:350
    },
});



export default AltApplyFormScreen;