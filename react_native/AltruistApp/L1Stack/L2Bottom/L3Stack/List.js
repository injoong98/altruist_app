import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView} from 'react-native'
import {Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal} from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Tag from '../../../components/tag.component';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

const data = [
    {
        mem_username : '홍길동',
        alt_aboutme : '자기 한줄 소개 PR 입니다. 1줄로 소개해주세요',
        alt_score : 5.00,
        alt_title : ['IT개발', '서비스기획/UI,UX', '전략/기획'],
    },
    {
        mem_username : '김철수',
        alt_aboutme : '포마드 머리가 잘어울리는 마케터',
        alt_score : 3.50,
        alt_title : ['마케팅/MD', '영업/영업관리', '홍보/SCR'],
    },
    {
        mem_username : '김영희',
        alt_aboutme : '영희는 철수가 좋을까?',
        alt_score : 4.20,
        alt_title : ['서비스', '공무원/공공/비영리', '회계/재무/금융'],
    },
    {
        mem_username : '강호동',
        alt_aboutme : '안녕하세요 강호동입니데이',
        alt_score : 4.99,
        alt_title : ['전문/특수', '미디어'],
    },
]

class AltListScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state={
            data : null,
            isFilterVisible : false,
            filterTag : [],
        }
    }

    componentDidMount(){
        this.setState({data:data})
    }

    job_type =[
        'IT개발', '공무원/공공/비영리', '교육/상담/컨설팅', '기타 사무', '디자인/예술', '마케팅/MD','목회/섭리기관 행정', '미디어', '생산/제조',
        '서비스', '서비스기획/UI,UX', '연구/설계', '영업/영업관리', '외국어/통역/번역', '유통/무역/구매', '인사/총무/노무', '전략/기획',
        '전문/특수', '창업/스타트업', '해외/기술영업', '홍보/CSR', '회계/재무/금융' 
    ]

    active_type = [
        '공직/선교/헌신', '교제,축복', '사회생활', '신앙생활', '원리/말씀', '인간관계', '자기계발', '진로/학습'
    ]

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    renderItem = ({item, index}) => (
        <Card style = {styles.card} onPress = {()=>{this.props.navigation.navigate('AltProfile', item)}}>
            <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                {item.alt_title.map(name => (<Tag key = {name}>{name}</Tag>))}
            </View>
            <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start'}}>
                <Image source = {{uri : 'http://10.0.2.2/uploads/noimage.gif'}} style = {{flex : 1, width : 100, height : 100, borderRadius : 30, resizeMode:'contain'}}/>
                <View style={{marginLeft : 10, flex:3, maxHeight : 110}}>
                    <Text category = 'h1'>{item.mem_username}</Text>
                    <Text category = 'h6' numberOfLines={2}>{item.alt_aboutme}</Text>
                </View>
            </View>
            <View style={{flexDirection : 'row'}}>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
            </View>
            <Text category='h6' style={{fontSize : 16}}>학력 또는 직장을 입력합니다.</Text>
            <View style = {{flexDirection : 'row'}}>
                <View style = {{flexDirection : 'row', flex : 5}}>
                    <Tag disabled={true}>IT개발</Tag>
                    <Tag style={{backgroundColor : '#A7D4DE', fontSize : 16}}>스타트업/창업</Tag>
                    <Tag style={{backgroundColor : '#EAB0B3', fontSize : 16}}>UX/UI기획</Tag>
                </View>
                <Button 
                    style = {{height : 20}}
                    onPress={()=>{console.log(this.state.filterTag)}}>질문하기</Button>
            </View>
        </Card>
    );
    
    render(){
        return (
            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction} style={{backgroundColor : '#B09BDE'}}/>
                <ScrollView horizontal style={{marginVertical : 4}}>
                    <Tag onPress={()=>this.setState({isFilterVisible:true})}>  +  </Tag>
                    {this.state.filterTag.length?this.state.filterTag.map(name => (<Tag key = {name} onPress={()=>this.state.filterTag.splice(this.state.filterTag.indexOf(name), 1)}> {name}</Tag>)):null}
                </ScrollView>
                <List
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    />      
                <Modal
                    visible={this.state.isFilterVisible}
                    backdropStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
                    onBackdropPress={() => this.setState({isFilterVisible:false})}>
                        <View style={{backgroundColor : 'white', borderRadius : 20, padding : 10, margin : 5}}>
                            <Text category='h5'>필터 적용하기</Text>
                                <View style = {{flexDirection : 'row', flexWrap: 'wrap'}}>
                                    {this.state.filterTag.map(name => (<Tag style={{marginVertical : 5}}
                                                                            key = {name}
                                                                            onPress ={()=>this.state.filterTag.push(name)}> {name}</Tag>))}
                                </View>
                                <Text category='h6'>직무 분야</Text>
                                <View style = {{flexDirection : 'row', flexWrap: 'wrap'}}>
                                    {this.job_type.map(name => (<Tag style={{marginVertical : 5}} 
                                                                    key = {name} 
                                                                    onPress ={()=>this.state.filterTag.push(name)}>
                                                                    {name}</Tag>))}
                                </View>
                            <Text category='h6'>활동 분야</Text>
                                <View style = {{flexDirection : 'row', flexWrap: 'wrap'}}>
                                    {this.active_type.map(name => (<Tag style={{marginVertical : 5}} key = {name}>{name}</Tag>))}
                                </View>
                            <Button onPress={()=>{this.setState({isFilterVisible:false})}}>적용하기</Button>
                        </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
      contentContainer: {
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        marginHorizontal: 4,
        marginVertical: 2,
      },
      card : {
        backgroundColor:'#E4E4E4',
        borderRadius : 20,
        margin : 10
      },
      tags : {

      }
});
export default AltListScreen;