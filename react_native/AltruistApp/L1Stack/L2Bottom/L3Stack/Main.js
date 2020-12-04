import React from 'react';
import {SafeAreaView,TextInput,Image,StyleSheet,View,TouchableOpacity,Dimensions,TouchableHighlight,Animated} from 'react-native';
import {Text,Icon,Spinner,List} from '@ui-kitten/components';
import axios from 'axios'

import {MainSlider} from '../../../components/slider.component'
import Searchsvg from '../../../assets/icons/search-outline.svg'
import Plussvg from '../../../assets/icons/plus-btn-round.svg'
import Minussvg from '../../../assets/icons/minus-btn-round.svg'
import Reloadsvg from '../../../assets/icons/reload.svg'
import MainSvg from '../../../assets/icons/main_logo.svg'
import {RenderAltList} from './List'
import {Signing} from '../../Context'
const {width,height} = Dimensions.get('window')

const AltIcon = (props) => (
    <Icon {...props} name='altruist' pack='alticons' />
  );
const Loading = () =>(
    <View style={{justifyContent:'center',alignItems:'center'}}>
        <Spinner size="giant"/>
    </View>
)
class MainButton extends React.Component{
    constructor(props)
    {
        super(props)
    }
    render(){
        return(
            <TouchableOpacity {...this.props}>
                {this.props.icon()}
                <Text category='h5' style={{fontSize:10,color:'#A897C2'}}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}
class AltMainScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            title:'',
            modalVisible:false,
            btnContainerWidth: new Animated.Value(1),
            btnContainerCompressed:false,
            isLoading:true,
            lists:[],
            listsShowing:[],
            banners:[]
        }
    }
    static contextType = Signing;
    
    minimizing = () => {
        console.log('minimizing');
        this.setState({btnContainerCompressed:true})
        Animated.timing(this.state.btnContainerWidth,{
            toValue: 0 ,
            duration: 500,
            useNativeDriver: false
        }).start();
        
    };
    maximizing = () =>{
        console.log('maximizing'); 
        this.setState({btnContainerCompressed:false})
        Animated.timing(this.state.btnContainerWidth,{
            toValue: 1 ,
            duration: 500,
            useNativeDriver: false
        }).start();
        
    }
    sortAltList = () =>{
        const {lists} = this.state;
        var listsShowing = [];
        var randomIndex = Math.floor(Math.random()*lists.length)
        for(var i=0 ; i<6; i++){
            listsShowing[i] =  lists[randomIndex % lists.length];
            randomIndex++;
        }
        this.setState({listsShowing})
    }
    getAltruistsList = async() => {
        this.setState({isLoading:true})
        await axios.get('https://dev.unyict.org/api/altruists/lists?rand=Y')
        .then((response) => {
            this.setState({lists:response.data.view.data.list})
            this.sortAltList();
            this.setState({isLoading:false})
        })
        .catch((error)=>{
            alert(error);
            console.log(error);
        })
    }
    getBanners = async() =>{
        var data = new FormData();
        data.append('postition','main_middle')
        await axios.post("https://dev.unyict.org/api/board_post/banner",data)
        .then(res=>{
            this.setState({banners:res.data.view.banners})
        }
        )
        .catch(err=>{

        }
        )
    }
    componentDidMount(){
        this.getAltruistsList();
        this.getBanners();
        this.props.navigation.navigate('PopUp');
    }

    renderHeadSection = () =>{
        const {navigation} =this.props
        const {title,btnContainerCompressed,btnContainerWidth,isLoading,banners} =this.state
        const btnContainerWidthInterpolate = btnContainerWidth.interpolate({
            inputRange:[0,1],
            outputRange:["0%","90%"]
        })
        const wdithLogo = (width*0.67);
        const heightLogo = (wdithLogo*0.57);
        return(
        <View style={{marginBottom:30,borderWidth:0}}>
            <View style={{flex:1}}>
                <View style={{height:height,alignItems:'center',minHeight:'100%',backgroundColor:'#ffffff',paddingBottom:100}}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <View style={{}}>
                            {/* <MainSvg width={wdithLogo} height={heightLogo}/> */}
                            <Image style={{width:wdithLogo,height:heightLogo}} source={{uri : 'https://dev.unyict.org/uploads/main_png.png'}}/>
                        </View>
                        
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <View style={{width:width/2,height:width/2,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',alignContent:'space-between'}}>
                            <MainButton
                                onPress={()=>navigation.navigate('AltList',{title})} 
                                style={styles.mainbtn}
                                text='이타주의자 찾기'
                                icon={()=><Image style={styles.mainbtnIcon} source={{uri : 'https://dev.unyict.org/uploads/icons/find_altruist.png'}}/>}
                            />
                            <MainButton
                                onPress={()=>{

                                    if(!global.mem_id) {
                                        this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
                                    }else {
                                        navigation.navigate('AltQuestionWrite',{title})
                                    }

                                }
                                } 
                                
                                
                                style={styles.mainbtn}
                                text='오픈질문 하기'
                                icon={()=><Image style={styles.mainbtnIcon} source={{uri : 'https://dev.unyict.org/uploads/icons/open_question.png'}}/>}
                            />
                            <MainButton 
                                style={styles.mainbtn}
                                text='질문함'
                                onPress={()=>{
                                        if(!global.mem_id) {
                                            this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
                                        }else {
                                            navigation.navigate('AltQueToptab',{title})
                                        }
                                    }
                                }
                                icon={()=><Image style={styles.mainbtnIcon} source={{uri : 'https://dev.unyict.org/uploads/icons/question_box_btn.png'}}/>}
                            />
                            <MainButton 
                                style={styles.mainbtn}
                                text='지원하기'
                                icon={()=><Image style={styles.mainbtnIcon} source={{uri : 'https://dev.unyict.org/uploads/icons/apply_btn.png'}}/>}
                                onPress={()=>{
                                    
                                    if(!global.mem_id) {
                                        this.props.navigation.navigate('RequireLoginScreen',{message:'Login required'});
                                    }else {
                                    
                                        this.context.is_altruist =='Y'?null:navigation.navigate(this.context.is_altruist =='R'?'AltApplyStatus':'AltApply')}
                                    }    

                                }
                            />
                        </View>    
                        
                    </View>
                    <View style={{flex:1,justifyContent:'flex-end',paddingBottom:20}}>
                        {/* <View style={{flexDirection:'row',width:'100%',paddingLeft:40,paddingRight:12,marginBottom:'5%'}}>                        
                            <TouchableHighlight style={[styles.btn,{borderRadius:15,width:30}]} onPress={btnContainerCompressed?this.maximizing:this.minimizing}>
                                {btnContainerCompressed? 
                                    <Plussvg height={30} width={30}/>
                                    :
                                    <Minussvg height={30} width={30}/>
                                }    
                            </TouchableHighlight>
                            <Animated.View style={{flexDirection:'row',justifyContent:'space-evenly',overflow:'hidden',width:btnContainerWidthInterpolate}}>
                                {
                                    this.context.is_altruist =='Y'?
                                    null
                                    :
                                    <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate(this.context.is_altruist =='R'?'AltApplyStatus':'AltApply')}>
                                        <Text numberOfLines={1} category="h1" style={styles.btnText}>
                                        지원
                                        </Text>
                                    </TouchableHighlight>
                                }

                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltList')}>
                                    <Text numberOfLines={1} category="h1" style={styles.btnText}>
                                    멘토리스트
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltOpqQueList')}>
                                    <Text numberOfLines={1} category="h1" style={styles.btnText}>
                                    오픈 질문
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltQueToptab')}>
                                    <Text numberOfLines={1} category="h1" style={styles.btnText}>
                                    질문함
                                    </Text>
                                </TouchableHighlight>
                            </Animated.View>
                        </View> */}
                        <MainSlider
                            height={100} 
                            image={banners}
                            dotStyle={{position:'absolute'}}
                            navigation={this.props.navigation}
                        /> 
                    </View>
                </View>
            </View>
            <View style={{width:'90%',alignItems:'center'}}>    
                <View style={{flexDirection:'row'}}>
                    <Text category='h2' style={{color:'#63579D'}}>이타주의자들</Text>
                </View>
                    
                    <TouchableOpacity onPress={()=>{this.sortAltList()}} style={{position:'absolute',right:0}}>
                {
                    isLoading 
                    ? 
                    null 
                    :
                    <Reloadsvg height={25} width={25} fill="#A9C"/>
                }
                </TouchableOpacity>
            </View>
        </View>
        
    )}

    
    render(){
        const {navigation} =this.props
        const {title,btnContainerCompressed,btnContainerWidth,isLoading} =this.state

        
        return(
            <SafeAreaView style={{flex:1}}>
                {/* <TopNavigation title="메인" alignment="center"/>  */}
                {/* <TopBarTune 
                    text="이타주의자" 
                    func={()=>navigation.navigate('Meet')} 
                    gbckfunc={()=>{navigation.goBack()}} 
                    gbckuse={false}
                /> */}
                <List
                    contentContainerStyle={styles.contentContainer}
                    ListHeaderComponent={this.renderHeadSection}
                    data={this.state.listsShowing}
                    renderItem={isLoading ? Loading: (arg)=>{return(<RenderAltList {...this.props} arg={arg} />)} }
                    style={{backgroundColor:'#ffffff'}}
                />    
                
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
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
    mentorItem:{
        borderWidth:1,
        padding:20
    },
    btn:{
        height:30,
        backgroundColor:'#A897C2',
        borderRadius:8,
        padding:8,
        alignItems:'center',
        justifyContent:'center',
        overflow:"hidden" 
    },
    btnText:{
        color:'#ffffff',
        fontSize:14,
        overflow:"hidden",
    },
    mainbtn:{
        width:'47%',
        height:'46%',
        borderRadius:15,
        backgroundColor:'#f4f4f4',
        alignItems:'center',
        justifyContent:'center',
    },
    mainbtnIcon:{
        height:'50%',
        width:'50%',
        marginBottom:'5%'
    }
})

export default AltMainScreen