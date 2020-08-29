import React from 'react';

import {SafeAreaView, StyleSheet, View, Image, ScrollView} from 'react-native';
import {Layout,Text,TopNavigation,Button,Icon, TopNavigationAction, Card} from '@ui-kitten/components'
import Tag from '../../../components/tag.component';

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
                            {/* {this.props.route.params.alt_title.map(name => (<Tag key = {name}>{name}</Tag>))} */}
                        </View>
                        <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start',}}>
                            <Image source = {{uri : 'http://10.0.2.2/uploads/noimage.gif'}} style = {{width : 150, height : 150, borderRadius : 30, resizeMode:'contain', flex : 1}}/>
                            <View style={{marginLeft : 10, flex : 2, marginBottom : 5,}}>
                                <Text category = 'h1'>{this.props.route.params.mem_nickname}</Text>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Icon style={{width : 30, height : 30}} fill='yellow' name='star'/>
                                    <Text> 답변율 99.9%</Text>
                                </View>
                                <Text category = 'h6' numberOfLines ={2}>{this.props.route.params.alt_aboutme}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>활동 분야</Text>
                        <View style = {{flexDirection : 'row', justifyContent:'flex-start'}}>
                            {/* {this.props.route.params.alt_title.map(name => (<Tag key = {name}>{name}</Tag>))} */}
                        </View>
                    </View>

                    <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                        <Text category='h5'>멘토 소개</Text>
                        <Text category='p2'>post.alt_content</Text>
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
                        <ScrollView>
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
                </ScrollView>
                <Button 
                    style={styles.bottomButton} onPress={()=>alert('question')}>
                    질문하기
                </Button>
            </SafeAreaView>
        )
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