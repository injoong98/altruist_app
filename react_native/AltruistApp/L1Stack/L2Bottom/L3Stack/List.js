import React from 'react';

import {StyleSheet, SafeAreaView, Image, View, ScrollView, TouchableOpacity,TextInput,TouchableHighlight,Dimensions,LogBox, Keyboard} from 'react-native'
import {Text,TopNavigation,Button,Icon, TopNavigationAction, List, Card, Modal, Spinner} from '@ui-kitten/components'
import axios from 'axios';
import Tag from '../../../components/tag.component';
import {TopBarTune} from '../../../components/TopBarTune'
import Rightsvg from '../../../assets/icons/right-arrow.svg';
import Searchsvg from '../../../assets/icons/search-outline.svg';
import Honorsvg from '../../../assets/icons/honor.svg';
import Heartsvg from '../../../assets/icons/heart.svg';
import Reloadsvg from '../../../assets/icons/reload.svg'

const deviceWidth = Dimensions.get('window').width
const BackIcon =  (props) =>(
    <Icon {...props} name = "arrow-back"/>
)

export const NoListRes = ({text,onPress}) =>{
    return(
        <View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
            <Text>
                {text}
            </Text>
            <TouchableOpacity onPress={onPress}>
                <Reloadsvg height={25} width={25} fill="#A9C"/>
            </TouchableOpacity>
        </View>

    )
}
export class RenderAltList extends React.Component{
    componentDidMount(){
    }
    render(){
        const cardHeight= deviceWidth*0.9*100/337;
        const {arg,navigation} = this.props;

        return(
            <TouchableOpacity
                style={{flexDirection:'row',height:cardHeight,marginBottom:cardHeight*0.15,marginHorizontal:'5%',backgroundColor:'#F4F4F4',alignItems:'center',borderTopRightRadius:7,borderBottomRightRadius:7}}
                onPress = {()=>{navigation.navigate('AltProfile', arg.item.alt_profile.alt_id)}}
            >
                <View style={{flex:9,}}>
                    <Image 
                        source = {{uri : 'http://dev.unyict.org/'+ (arg.item.alt_profile.alt_photo !=null ? arg.item.alt_profile.alt_photo: 'uploads/altwink-rect.png')}} 
                        style = {{flex : 1, width : '100%', height : '100%', resizeMode:'cover'}}
                    />
                </View>
                <View style={{flex:22,height:'100%'}}>
                    <View style={{flex:73,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{flex:1,width:'100%',paddingLeft:'18%'}}>
                                <Text category='h2' style={{fontSize:18,marginTop:12}}>
                                    {arg.item.mem_basic_info.mem_nickname}
                                </Text>
                                <Text style={{fontSize:12,fontWeight:'600'}}>
                                    {arg.item.alt_profile.alt_aboutme}
                                </Text>
                            </View>                        
                        </View>
                        <View style={{flex:1,alignItems:'flex-start'}}>
                           <View style={{flex:1,backgroundColor:'#ffffff',width:'84%',borderBottomLeftRadius:5,borderBottomRightRadius:5,paddingTop:5,paddingLeft:9}}>
                                <View style={{flexDirection:'row', alignItems:'flex-start'}}>
                                    <Honorsvg height={9} width={6}/>
                                    <Text category='h2' style={{fontSize:9,lineHeight:9,marginLeft:4}}>경력</Text>
                                </View>
                                <View style={{marginTop:5}}>
                                    {
                                    arg.item.get_alt_cv.map((i)=>
                                        <Text 
                                            category ='p1'
                                            style = {{fontSize:10,marginBottom:4}} 
                                            key={i.acv_id}
                                            numberOfLines={1} 
                                            ellipsizeMode="tail"    
                                        >
                                            {
                                            i.acv_year ?
                                                i.acv_year.trim()+') '
                                            :
                                                null
                                            }
                                            {i.acv_content.trim()}
                                        </Text>
                                    )}
                                </View>
                           </View>
                        </View>
                    </View>
                    <View style={{flex:27,flexDirection:'row',paddingLeft:'9%'}}>
                        <ScrollView horizontal={true} style={{}} ref='areas'>
                            <View style={{justifyContent:'center'}}>
                                <View style={{flexDirection:'row',backgroundColor:'#808080',paddingLeft:5,borderRadius:3}}>
                                {
                                    arg.item.alt_area.map(({act_content})=>(
                                        <Text key={act_content} style={{color:'#ffffff',fontSize:8,fontWeight:'700',marginRight:5}}>{`#${act_content}`}</Text>
                                    ))
                                }
                                </View>
                            </View>
                        </ScrollView >
                    </View>
                </View>
                <View style={{flex:2,right:0}}>
                    <Rightsvg width={22} height={22}/>
                </View>
                <View style={{position:'absolute' , right:15,top:10}}>
                <Heartsvg width={18} height={18}/>
                </View>
            </TouchableOpacity>
        )
    }
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
            keyword:'',
            act_array:[],
            actSelected:[],
            no_result:false,
            no_result_text:'',
        }
    }

    actUnSelect = (index) =>{
        const{actSelected} =this.state
        actSelected.splice(index,1);this.setState({actSelected});
    }

    actSelect = (act) =>{
        const {actSelected} =this.state
        if(actSelected.includes(act)){
            actSelected.splice(actSelected.indexOf(act),1)
            this.setState({actSelected})
        }else{
            this.setState({actSelected:actSelected.concat(act)})
        }
    }

    getAltruistsFilteredList =async(type) => {
        this.setState({isLoading:true})

        const {actSelected,keyword} = this.state
        var formdata = new FormData()

        if(type=='act'&&actSelected.length>0){
            actSelected.map((item,index)=>{
                formdata.append("alt_area[]", item.act_id);
            })
           this.setState({keyword:""})
        }else if(type=="keyword"){
            formdata.append('alt_keyword',keyword);
            this.setState({actSelected:[]})
        }
        else{
            formdata.append('alt_keyword','')
        }

        await axios.post('http://dev.unyict.org/api/altruists/lists',formdata)
        .then(res=>{
                this.setState({alt_list_showing:res.data.view.data.list ? res.data.view.data.list : [],isLoading:false})
                this.setState({no_result_text: type=='keyword'? `"${keyword}" 검색 결과가 없습니다`:"검색 결과가 없습니다"})
                this.setState({no_result : !res.data.view.data.list ?true :false })
            }
        )
        .catch(err=>{
            console.log(JSON.stringify(err.data.view))
            this.setState({isLoading:false})
        })

    }
    getAltruistsList = async() => {
        this.setState({isLoading:true})
        await axios.get('http://dev.unyict.org/api/altruists/lists?rand=Y')
        .then((response) => {
            this.setState({alt_list_showing:response.data.view.data.list,lists:response.data.view.data.list,})
            this.setState({isLoading:false})
            this.setState({no_result : !response.data.view.data.list ?true :false })

        })
        .catch((error)=>{
            alert(error);
            this.setState({isLoading:false})
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
        this.getAltruistsList();
        this.getAreaCategory();
    }

    BackAction = () =>(
        <TopNavigationAction icon={BackIcon} onPress={() => {this.props.navigation.goBack()}}/>
    )
    SelectedArea = () => {
        const {actSelected}= this.state

        return(
            <View style={{display:'flex',flexDirection:'row',paddingHorizontal:20,marginTop:5}}>
                    {
                        actSelected.length >0 ?
                        <ScrollView horizontal={true} style={{}} >
                                {actSelected.map((act,index) => (
                                    <TouchableHighlight
                                        onPress ={()=>{this.actUnSelect(index); this.getAltruistsFilteredList('act')}}
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
        )
    }
    Filter =  () => {
        const {width,height} =Dimensions.get('window')
        const {filterModalVisible,act_array,actSelected}= this.state
        return(
            <Modal
                    visible={filterModalVisible}
                    backdropStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                    onBackdropPress={() => {this.setState({filterModalVisible:false});this.getAltruistsFilteredList('act')}}
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
                                        this.actSelect(act)
                                        // if(actSelected.includes(act)){
                                        //     actSelected.splice(actSelected.indexOf(act),1)
                                        //     this.setState({actSelected})
                                        // }else{
                                        //     this.setState({actSelected:actSelected.concat(act)})
                                        // }
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
                            onPress={()=>{this.setState({filterModalVisible:false});this.getAltruistsFilteredList('act')}} 
                            style={{backgroundColor:'#63579D', paddingVertical:4,paddingHorizontal:20,borderRadius:8.5}}>
                            <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff'}}>적용</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
    
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
                    onPress={()=>{this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:item.alt_profile.mem_id,title:this.props.route.params.title})}}>
                    질문하기
                </Button>
            </View>
        </Card>
    );
    
    render(){
        const {keyword,isLoading,alt_list_showing,no_result,no_result_text}= this.state
        // const title =this.props.route.params ? this.props.route.params.title:null
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>
                <TopBarTune 
                    text="이타주의자들" 
                    func={()=>this.props.navigation.navigate('AltQuestionWrite',{answer_mem_id:false,title:''})} 
                    right='opq'
                    gbckuse={true}
                    gbckfunc={()=>{this.props.navigation.goBack()}}                
                />
                <View style={{marginTop:18,justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',width:'100%',paddingHorizontal:18}}>
                    <View>
                        <TextInput 
                            style={styles.titleInput} 
                            value={keyword} 
                            onChangeText={(text) =>{this.setState({keyword:text})}}
                            placeholder="이름/자기소개/경력으로 검색해보세요"
                            placeholderTextColor='#A897C2'
                        />
                        <TouchableOpacity 
                            style={{position:"absolute",right:5,top:6}}
                            onPress={()=>{Keyboard.dismiss(),this.getAltruistsFilteredList('keyword')}}
                        >
                            
                            <Searchsvg height={25} width={25} fill='#A9C' />
                        </TouchableOpacity>
                    </View>
                    <TouchableHighlight 
                        onPress={()=>{this.setState({filterModalVisible:true})}} 
                        style={{backgroundColor:'#A897C2',borderRadius:7,paddingHorizontal:11,paddingVertical:8, alignItems:'center',justifyContent:'center'}}>
                        <Text category='h2' style={{fontSize:13,color:"#ffffff"}}>필터</Text>
                    </TouchableHighlight>
                </View>
                <this.SelectedArea />
                {
                    isLoading ? 
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Spinner size="giant"/>
                    </View>
                    :
                        !no_result ?
                        <View style={{flex: 25,marginTop:15}}>
                            <List
                            contentContainerStyle={styles.contentContainer}
                            data={alt_list_showing}
                            renderItem={(arg)=>(<RenderAltList {...this.props} arg={arg} />)}
                            style={{backgroundColor:'#ffffff'}}
                            />
                        </View> 
                        :
                        <NoListRes text= {no_result_text} onPress={()=>{this.setState({keyword:null});this.getAltruistsList()}} />
                }
                <this.Filter />
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