import React from 'react';

import {SafeAreaView, StyleSheet, View, Image, ScrollView} from 'react-native';
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Card} from '@ui-kitten/components'

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

class AltProfileScreen extends React.Component {

    constructor(props){
        super(props);
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )
 
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction} style={{backgroundColor : '#B09BDE'}}/> 
                <ScrollView>
                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                            <Text category = 'c2' style = {tags('#A7D4DE')}>IT개발</Text>
                            <Text category = 'c2' style = {tags('#A7D4DE')}>스타트업/창업</Text>
                            <Text category = 'c2' style = {tags('#EAB0B3')}>UX/UI기획</Text>
                        </View>
                        <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start',}}>
                            <Image source = {{uri : 'http://10.0.2.2/uploads/noimage.gif'}} style = {{width : 150, height : 150, borderRadius : 30, resizeMode:'contain', flex : 1}}/>
                            <View style={{marginLeft : 10, flex : 2, marginBottom : 5,}}>
                                <Text category = 'h1'>{this.props.route.params}</Text>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Text> 답변율 99.9%</Text>
                                </View>
                                <Text category = 'h6' numberOfLines ={2}>2줄이내로 자신을 표현해주세요 정말로 말이에요.당신은 얼마나 말할 수 있을지 모르겠어요 한 4줄정도까지는 가능한거 같아요 그 이상으로 넘어가면 생략해야겠죠?</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>활동 분야</Text>
                        <View style = {{flexDirection : 'row', justifyContent:'flex-start'}}>
                            <Text category = 'c2' style = {tags('#A7D4DE')}>IT개발</Text>
                            <Text category = 'c2' style = {tags('#A7D4DE')}>스타트업/창업</Text>
                            <Text category = 'c2' style = {tags('#EAB0B3')}>UX/UI기획</Text>
                        </View>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>멘토 소개</Text>
                        <Text category='p2'>반갑습니다. 저는 대도 홍길동이라고 합니다. 여러분들에게 도벽에 대한 멘토링을 할 수 있습니다. 감사합니다.</Text>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>주요 활동 및 경력</Text>
                        <Text category='p2'>1997년) 태어남.</Text>
                        <Text category='p2'>2001년) 아버지를 아버지라 부르지 못함.</Text>
                        <Text category='p2'>2017년) 활동을 열심히 함.</Text>
                        <Text category='p2'>2020년) 노랭이 좀팽이</Text>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>기타 사항</Text>
                        <Text category='p2'>아무거나 물어보셔도 상관없습니다. 감사합니다 ^^</Text>
                    </View>
                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>후기</Text>
                        <ScrollView horizontal>
                            <View style={{backgroundColor : '#F4F4F4', borderRadius : 20, padding : 10, margin : 5}}>
                                <Text category='h5'>김쫀떡</Text>
                                <Text category='p2'>쫀떡이 까까 줘라</Text>
                            </View>
                            <View style={{backgroundColor : '#F4F4F4', borderRadius : 20, padding : 10, margin : 5}}>
                                <Text category='h5'>이무기</Text>
                                <Text category='p2'>용의 꼬리가 되느니 뱀의 머리가 되겠다</Text>
                            </View>
                            <View style={{backgroundColor : '#F4F4F4', borderRadius : 20, padding : 10, margin : 5}}>
                                <Text category='h5'>기타 사항</Text>
                                <Text category='p2'>아무거나 물어보셔도 상관없습니다. 감사합니다 ^^</Text>
                            </View>
                        </ScrollView>
                    </View>
                    <Button 
                        style={styles.bottomButton} onPress={()=>alert('question')}>
                                질문하기
                    </Button>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

var tags = function (value='black', size=14) {
    return{
        backgroundColor : value,
        borderRadius : 20, 
        padding : 4, 
        marginHorizontal : 5, 
        fontSize : size, 
        textAlignVertical : 'center',
        justifyContent : 'center',
    }
}

const styles = StyleSheet.create({
    bottomButton: {
        position:'absolute',
        bottom : 10,
        left : '40%'
    },
})

export default AltProfileScreen;