import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView} from 'react-native'
import {Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal, Spinner} from '@ui-kitten/components'
import axios from 'axios';
import Tag from '../../../components/tag.component';
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

class AltListScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state={
            lists : null,
            alt_list : null,
            isLoading : true,
            isFilterVisible : false,
            filterTag : [],
        }
    }

    getAltruistsList = async() => {
        await axios.get('http://10.0.2.2/api/altruists/lists')
        .then((response) => {
            this.setState({lists:response.data.view.data.list})
        })
        .catch((error)=>{
            alert(error);
            console.log(error);
        })
    }

    componentDidMount(){
        this.setState(this.getAltruistsList());
    }

    job_type =[
        'IT개발', '공무원/공공/비영리', '교육/상담/컨설팅', '기타 사무', '디자인/예술', '마케팅/MD','목회/섭리기관 행정', '미디어', '생산/제조',
        '서비스', '서비스기획/UI,UX', '연구/설계', '영업/영업관리', '외국어/통역/번역', '유통/무역/구매', '인사/총무/노무', '전략/기획',
        '전문/특수', '창업/스타트업', '해외/기술영업', '홍보/CSR', '회계/재무/금융' 
    ]

    active_type = [
        {
            act_id : 1,
            act_content : '공직/선교/헌신',
            checked : false,
        },
        {
            act_id : 2,
            act_content : '교제,축복',
            checked : false,
        },
        {
            act_id : 3,
            act_content : '사회생활',
            checked : false,
        },
        {
            act_id : 4,
            act_content : '신앙생활',
            checked : false,
        },
        {
            act_id : 5,
            act_content : '원리/말씀',
            checked : false,
        },
        {
            act_id : 6,
            act_content : '인간관계',
            checked : false,
        },
        {
            act_id : 7,
            act_content : '자기계발',
            checked : false,
        },
        {
            act_id : 8,
            act_content : '진로/학습',
            checked : false,
        },
    ]

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )

    renderItem = ({item, index}) => (
        <Card style = {styles.card} onPress = {()=>{this.props.navigation.navigate('AltProfile', item.alt_profile.alt_id)}}>
            <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                <Tag>{item.alt_profile.alt_title}</Tag>
            </View>
            <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start'}}>
                <Image source = {{uri : 'http://10.0.2.2/uploads/noimage.gif'}} style = {{flex : 1, width : 100, height : 100, borderRadius : 30, resizeMode:'contain'}}/>
                <View style={{marginLeft : 10, flex:3, maxHeight : 110}}>
                    <Text category = 'h1'>{item.mem_basic_info.mem_nickname}</Text>
                    <Text category = 'p2' numberOfLines={2}>{item.alt_profile.alt_aboutme}</Text>
                    <View style={{flexDirection : 'row'}}>
                        <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                        <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                        <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                        <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                        <Icon style={{width : 40, height : 40}} fill='yellow' name='star'/>
                    </View>
                </View>
            </View>
            <View style={{marginVertical : 5, marginLeft : 10}}>
                {item.get_alt_cv.map((i)=><Text category ='p2' key={i.acv_id}>{i.acv_year.trim()+') '}{i.acv_content.trim()}</Text>)}
            </View>
            <View style = {{flexDirection : 'row'}}>
                <View style = {{flexDirection : 'row', flex : 5, marginVertical : 5}}>
                    {item.alt_area.map(i => (<Tag key = {i.act_id}>{i.act_content}</Tag>))}
                </View>
                <Button 
                    style = {{height : 20}}
                    onPress={()=>{console.log(this.state.filterTag);this.props.navigation.navigate('AltQuestionWrite',{item,brd_key:'indi',answer_mem_id:item.alt_profile.mem_id})}}>질문하기</Button>
            </View>
        </Card>
    );
    
    render(){
        return (

            <SafeAreaView style={{flex:1}}>
                <TopNavigation title="이타주의자" alignment="center" accessoryLeft={this.BackAction} style={{backgroundColor : '#B09BDE'}}/>
                <ScrollView horizontal style={{flex : 1, marginVertical : 4}}>
                    <Tag onPress={()=>this.setState({isFilterVisible:true})}>  +  </Tag>
                </ScrollView>
                <View style={{flex: 25}}>
                    <List
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.lists}
                    renderItem={this.renderItem}
                    />
                </View> 
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