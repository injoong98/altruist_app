import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView, TouchableOpacity,TextInput,TouchableHighlight,Dimensions} from 'react-native'
import {Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal, Spinner} from '@ui-kitten/components'
import axios from 'axios';
import Tag from '../../../components/tag.component';
import {TopBarTune} from '../../../components/TopBarTune'
import Rightsvg from '../../../assets/icons/right-arrow.svg';
import Searchsvg from '../../../assets/icons/search-outline.svg';

const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

export const RenderAltList= ({arg,navigation}) => {
    return(
        <TouchableOpacity
            style={{flexDirection:'row',height:100,marginBottom:15,marginHorizontal:18,backgroundColor:'#F4F4F4',alignItems:'center',borderTopRightRadius:7,borderBottomRightRadius:7}}
            onPress = {()=>{navigation.navigate('AltProfile', arg.item.alt_profile.alt_id)}}
        >
            <View>
                <Image 
                    source = {{uri : 'http://dev.unyict.org/'+ (arg.item.alt_profile.alt_photo !=null ? arg.item.alt_profile.alt_photo: 'uploads/noimage.gif')}} 
                    style = {{flex : 1, width : 100, height : 100, resizeMode:'contain'}}
                />
            </View>
            
            <View style={{width:'65%',height:'100%',paddingLeft:10}}>
                <View style={{flexDirection:'row',height:'90%'}}>
                    <View style={{justifyContent:'space-evenly',marginLeft:0,width:'45%'}}>
                        <View>
                            <Text style={{fontSize:18,fontWeight:'700'}}>
                                {arg.item.mem_basic_info.mem_nickname}
                            </Text>
                        </View>
                        <View>
                            <Text style={{fontSize:12,fontWeight:'600'}}>
                                {arg.item.alt_profile.alt_aboutme}
                            </Text>
                        </View>
                    </View>
                    <View style={{marginLeft:'5%',width:'45%',paddingVertical:10,alignItems:'flex-start',justifyContent:'center'}}>
                        {arg.item.get_alt_cv.map((i)=>
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
                        arg.item.alt_area.map(({act_content})=>(
                            <Text key={act_content} style={{fontSize:8,paddingVertical:4,fontWeight:'700'}}>{act_content}</Text>
                        ))
                    }
                </View>
            </View>

            <View style={{right:0,position:'absolute'}}>
                <Rightsvg width={22} height={22}/>
            </View>
        </TouchableOpacity>
    )
}

class AltListScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state={
            lists : null,
            alt_list : [],
            alt_list_showing:[],
            isLoading : true,
            filterModalVisible : false,
            filterTag : [],
            name:'',
            act_array:[],
            actSelected:[]
        }
    }
    applyFilter=()=>{
        const {alt_list,actSelected,alt_list_showing} = this.state
        console.log('You called stupid filter function!! :[')
    }
    getAltruistsList = async() => {
        await axios.get('http://dev.unyict.org/api/altruists/lists')
        .then((response) => {
            this.setState({lists:response.data.view.data.list,alt_list_showing:response.data.view.data.list})
        })
        .catch((error)=>{
            alert(error);
            console.log(error);
        })
    }
    getAreaCategory= async()=>{
        await axios.get('http://dev.unyict.org/api/altruists/area_category')
        .then(res=>{
            this.setState({act_array:res.data.data});
        })
        .then(()=>{
            this.setState({isLoading:false});
        })
        .catch(err=>{
            alert('area 불러오기 실패! ㅜ')
        })
    }
    componentDidMount(){
        this.setState(this.getAltruistsList());
        this.getAreaCategory();
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
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
                    onPress={()=>{console.log(this.state.filterTag);this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:item.alt_profile.mem_id,title:this.props.route.params.title})}}>
                    질문하기
                </Button>
            </View>
        </Card>
    );
    
    render(){
        const {name,filterModalVisible,act_array,actSelected,isLoading}= this.state
        const title =this.props.route.params ? this.props.route.params.title:null
        const {width,height} =Dimensions.get('window')
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <TopBarTune 
                    text="이타주의자들" 
                    func={()=>this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:false,title:title})} 
                    right='opq'
                    gbckuse={true}
                    gbckfunc={()=>{this.props.navigation.goBack()}}                
                />
                <View style={{marginTop:18,justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',width:'100%',paddingHorizontal:18}}>
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
                    <TouchableHighlight 
                        onPress={()=>{this.setState({filterModalVisible:true})}} 
                        style={{backgroundColor:'#A897C2',borderRadius:7,paddingHorizontal:11,paddingVertical:8, alignItems:'center',justifyContent:'center'}}>
                        <Text category='h2' style={{fontSize:13,color:"#ffffff"}}>필터</Text>
                    </TouchableHighlight>
                </View>
                <View style={{display:'flex',flexDirection:'row',paddingHorizontal:20,marginTop:5}}>
                    {
                        actSelected.length >0 ?
                        <ScrollView horizontal={true} style={{}} >
                                {actSelected.map((act,index) => (
                                    <TouchableHighlight
                                        onPress ={()=>{actSelected.splice(index,1);this.setState({actSelected})}}
                                        key = {act.act_content}
                                    >
                                        <View 
                                            style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',padding:5}} 
                                        >
                                            <Tag style={[styles.tagSelected,{marginRight:3}]}
                                                key = {act.act_content}
                                            >
                                                {act.act_content}
                                            </Tag>
                                            <View style={{backgroundColor:'#000000',opacity:0.3,borderRadius:5}}>
                                                <Text> x </Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                ))}
                        </ScrollView >
                        :
                        <View style={{width:'100%',padding:5,justifyContent:'center',alignItems:'flex-start'}}>
                            <Text style={{fontSize:13,color:'#A897C2'}}>필터를 클릭하고 전문분야를 선택하세요!</Text>
                        </View>
                    }
                </View>
                {
                    isLoading ? 
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Spinner size="giant"/>
                    </View>
                    :
                    <View style={{flex: 25,marginTop:15}}>
                        <List
                        contentContainerStyle={styles.contentContainer}
                        data={this.state.lists}
                        renderItem={(arg)=>{return(<RenderAltList {...this.props} arg={arg} />)}}
                        style={{backgroundColor:'#ffffff'}}
                        />
                    </View> 
                }
                <Modal
                    visible={filterModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => this.setState({filterModalVisible:false})}
                    style={{justifyContent:'center'}}
                >
                <View style={{backgroundColor:'#ffffff',borderRadius:20,width:width*0.8}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text category='h2' style={{fontSize:13,marginVertical:11,color:'#63579D'}}>필터 적용하기</Text>
                        <View style={{borderWidth:1,borderColor:'#E3E3E3',width:'90%',marginBottom:15}}></View>
                    </View>
                    <ScrollView ScrollViewstyle = {{}}>
                        <View style = {{justifyContent:'space-between',flexDirection : 'row', flexWrap: 'wrap',paddingHorizontal:'5%'}}>
                            {act_array.map(act => (
                                <Tag 
                                    key = {act.act_content}
                                    onPress ={()=>{
                                        if(actSelected.includes(act)){
                                            actSelected.splice(actSelected.indexOf(act),1)
                                            this.setState({actSelected})
                                        }else{
                                            this.setState({actSelected:actSelected.concat(act)})
                                            this.applyFilter();
                                        }
                                    }}
                                    style={[{padding:4},actSelected.includes(act) ? styles.tagSelected:{}]}
                                >
                                    {act.act_content}
                                </Tag>
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{alignItems:'center',justifyContent:'center',marginVertical:20}}>
                        <TouchableHighlight 
                            onPress={()=>{this.setState({filterModalVisible:false})}} 
                            style={{backgroundColor:'#63579D', paddingVertical:4,paddingHorizontal:20,borderRadius:8.5}}>
                            <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff'}}>적용</Text>
                        </TouchableHighlight>
                    </View>
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
        width:'100%',
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
    tagSelected : {
        color:'#63579D'
      }
});
export default AltListScreen;