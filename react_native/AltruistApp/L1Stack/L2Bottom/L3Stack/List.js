import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView, TouchableOpacity,TextInput,TouchableHighlight} from 'react-native'
import {Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal, Spinner} from '@ui-kitten/components'
import axios from 'axios';
import Tag from '../../../components/tag.component';
import {TopBarTune} from '../../../components/TopBarTune'
import Rightsvg from '../../../assets/icons/right-arrow.svg';
import Searchsvg from '../../../assets/icons/search-outline.svg';

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
            name:''
        }
    }

    getAltruistsList = async() => {
        await axios.get('http://dev.unyict.org/api/altruists/lists')
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

    renderAltList= ({item,index}) => (
        <TouchableOpacity
            style={{flexDirection:'row',height:100,marginBottom:15,marginHorizontal:18,backgroundColor:'#F4F4F4',alignItems:'center',borderTopRightRadius:7,borderBottomRightRadius:7}}
            onPress = {()=>{this.props.navigation.navigate('AltProfile', item.alt_profile.alt_id)}}
        >
            <View>
                <Image 
                    source = {{uri : 'http://dev.unyict.org/'+ (item.alt_profile.alt_photo !=null ? item.alt_profile.alt_photo: 'uploads/noimage.gif')}} 
                    style = {{flex : 1, width : 100, height : 100, resizeMode:'contain'}}
                />
            </View>
            
            <View style={{width:'65%',height:'100%',paddingLeft:10}}>
                <View style={{flexDirection:'row',height:'90%'}}>
                    <View style={{justifyContent:'space-evenly',marginLeft:0,width:'45%'}}>
                        <View>
                            <Text style={{fontSize:18,fontWeight:'700'}}>
                                {item.mem_basic_info.mem_nickname}
                            </Text>
                        </View>
                        <View>
                            <Text style={{fontSize:12,fontWeight:'600'}}>
                                {item.alt_profile.alt_aboutme}
                            </Text>
                        </View>
                    </View>
                    <View style={{marginLeft:'5%',width:'45%',paddingVertical:10,alignItems:'flex-start',justifyContent:'center'}}>
                        {item.get_alt_cv.map((i)=>
                            <Text 
                                category ='p1'
                                style = {{color:'#63579D',fontSize:10,marginBottom:4}} 
                                key={i.acv_id}
                                numberOfLines={1} 
                                ellipsizeMode="tail"    
                            >
                                {i.acv_year.trim()+') '}{i.acv_content.trim()}
                            </Text>
                        )}                
                    </View>
                </View>
                <View style={{flexDirection:'row',left:10,bottom:0,position:'absolute'}}>
                    {
                        item.alt_area.map(({act_content})=>(
                            <Text style={{fontSize:8,paddingVertical:4,fontWeight:'700'}}>{act_content}</Text>
                        ))
                    }
                </View>
            </View>

            <View style={{right:0,position:'absolute'}}>
                <Rightsvg width={22} height={22}/>
            </View>
        </TouchableOpacity>
    )
    
    renderItem = ({item, index}) => (
        <Card style = {styles.card} onPress = {()=>{this.props.navigation.navigate('AltProfile', item.alt_profile.alt_id)}}>
            <View style = {{flexDirection : 'row', justifyContent:'flex-end'}}>
                <Tag>{item.alt_profile.alt_title}</Tag>
            </View>
            <View style={{flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'flex-start'}}>
                <Image source = {{uri : 'http://dev.unyict.org/uploads/noimage.gif'}} style = {{flex : 1, width : 100, height : 100, borderRadius : 30, resizeMode:'contain'}}/>
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
                    onPress={()=>{console.log(this.state.filterTag);this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:item.alt_profile.mem_id,title:this.props.route.params.title})}}>질문하기</Button>
            </View>
        </Card>
    );
    
    render(){
        const {name}= this.state
        const title =this.props.route.params ? this.props.route.params.title:null
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <TopBarTune 
                    text="이타주의자들" 
                    func={()=>this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:false,title:title})} 
                    right='opq'
                    gbckuse={true}
                    gbckfunc={()=>{this.props.navigation.goBack()}}                
                />
                <View style={{marginTop:18,justifyContent:'center',alignItems:'center'}}>
                    <View>
                        <TextInput 
                            style={styles.titleInput} 
                            value={name} 
                            onChangeText={text =>this.setState({name:text})}
                            placeholder="이타주의자들에게 이름을 입력해보세요"
                            placeholderTextColor='#A897C2'
                        />
                        <TouchableOpacity style={{position:"absolute",right:5,top:6}}>
                            <Searchsvg height={25} width={25} fill='#A9C' />
                        </TouchableOpacity>
                    </View>
                    <TouchableHighlight onPress={()=>{this.setState({})}}>
                        <Text>필터</Text>
                    </TouchableHighlight>
                </View>
                <View style={{flex: 25,marginTop:30}}>
                    <List
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.lists}
                    renderItem={this.renderAltList}
                    style={{backgroundColor:'#ffffff'}}
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
      titleInput :{
        width:'90%',
        paddingVertical:9,
        paddingLeft:15,
        backgroundColor:'#ffffff',
        borderRadius:7,
        borderColor:"#AC95C5",
        borderWidth:2,
        fontSize:12,
        height:40,
        minWidth:'80%'
    },
      tags : {

      }
});
export default AltListScreen;