import React from 'react';
import {SafeAreaView,TextInput,Image,StyleSheet,View,TouchableOpacity,Dimensions,TouchableHighlight,Animated} from 'react-native';
import {Text,Icon,Spinner,List} from '@ui-kitten/components';
import axios from 'axios'

import Slider from '../../../components/slider.component'
import Searchsvg from '../../../assets/icons/search-outline.svg'
import Plussvg from '../../../assets/icons/plus-btn-round.svg'
import Minussvg from '../../../assets/icons/minus-btn-round.svg'
import Reloadsvg from '../../../assets/icons/reload.svg'
import MainSvg from '../../../assets/icons/main_logo.svg'
import {RenderAltList} from './List'
import {Signing} from '../../Context'
const {width,height} = Dimensions.get('window')

const Loading = () =>(
    <View style={{justifyContent:'center',alignItems:'center'}}>
        <Spinner size="giant"/>
    </View>
)
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
            listsShowing:[]
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
        console.log('lists.length : '+lists.length)
        console.log('randomIndex : '+randomIndex)
        console.log('randomIndex % lists.length : '+randomIndex % lists.length)
        for(var i=0 ; i<6; i++){
            listsShowing[i] =  lists[randomIndex % lists.length];
            randomIndex++;
        }
        this.setState({listsShowing})
    }
    getAltruistsList = async() => {
        this.setState({isLoading:true})
        await axios.get('http://dev.unyict.org/api/altruists/lists?rand=Y')
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
    componentDidMount(){
        this.getAltruistsList()

    }

    renderHeadSection = () =>{
        const {navigation} =this.props
        const {title,btnContainerCompressed,btnContainerWidth,isLoading} =this.state
        const btnContainerWidthInterpolate = btnContainerWidth.interpolate({
            inputRange:[0,1],
            outputRange:["0%","90%"]
        })
        console.log('renderHeadSection : '+ isLoading)
        const wdithLogo = (width*0.8);
        const heightLogo = (wdithLogo*0.57);
        return(
        <>
            <View style={{flex:1, alignItems:'center',minHeight:'100%',backgroundColor:'#ffffff'}}>
                <View style={{ alignItems:'center',justifyContent:'space-evenly'}}>
                    <View style={{marginTop:91}}>
                        <MainSvg width={wdithLogo} height={heightLogo}/>
                        {/* <Image style={{width:wdithLogo,height:heightLogo}} source={{uri : 'http://dev.unyict.org/uploads/'}}/> */}
                    </View>
                    {/* <View style={{marginTop:22}}>
                        <TextInput 
                            style={styles.titleInput} 
                            value={title} 
                            onChangeText={text =>this.setState({title:text})}
                            placeholder="이타주의자들에게 질문 해보세요"
                            placeholderTextColor='#A897C2'
                            onEndEditing={()=>console.log('gd')}
                        />
                        <TouchableOpacity 
                            style={{position:"absolute",right:5,top:6}}
                            onPress={()=>navigation.navigate('AltList',{title:title})}
                        >
                            <Searchsvg height={25} width={25} fill='#A9C' />
                        </TouchableOpacity>
                    </View> */}
                    <View style={{marginTop:28,alignItems:'center'}} >
                        {/* {
                            this.context.is_altruist =='Y'?
                            null
                                :
                            <TouchableOpacity 
                                style={styles.mainbtn}
                                onPress={()=>navigation.navigate('AltQueToptab',{title:title})}
                            >
                                <Text category='h2' style={{color:'#A897C2',fontSize:18}}>지원하기</Text>
                            
                            </TouchableOpacity>
                        }   
                        
                        <TouchableOpacity 
                            style={styles.mainbtn}
                            onPress={()=>navigation.navigate('AltOpqQueList',{title:title})}
                        >
                            <Text category='h2' style={{color:'#A897C2',fontSize:18}}>오픈 질문</Text>
                        
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.mainbtn}
                            onPress={()=>navigation.navigate('AltQueToptab',{title:title})}
                        >
                            <Text category='h2' style={{color:'#A897C2',fontSize:18}}>1:1 질문</Text>
                        
                        </TouchableOpacity> */}
                        <TouchableOpacity 
                            style={styles.mainbtn}
                            onPress={()=>navigation.navigate('AltList',{title:title})}
                        >
                            <Text category='h2' style={{color:'#A897C2',fontSize:18}}>이타주의자 찾기</Text>
                        
                        </TouchableOpacity>
                       
                    </View>
                    
                </View>
                <View style={{marginTop:150,flexDirection:'row',width:'100%',paddingLeft:40,paddingRight:12}}>                        
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
                            <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltApply')}>
                                <Text numberOfLines={1} category="h1" style={styles.btnText}>
                                지원
                                </Text>
                            </TouchableHighlight>
                        }

                        {/* <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltList')}>
                            <Text numberOfLines={1} category="h1" style={styles.btnText}>
                            멘토리스트
                            </Text>
                        </TouchableHighlight> */}
                        <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltOpqQueList')}>
                            <Text numberOfLines={1} category="h1" style={styles.btnText}>
                            오픈 질문
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.btn} onPress={()=>navigation.navigate('AltQueToptab')}>
                            <Text numberOfLines={1} category="h1" style={styles.btnText}>
                            일대일 질문
                            </Text>
                        </TouchableHighlight>
                    </Animated.View>
                </View>
                <View style={{marginBottom:15,marginTop:30}}>
                        <Slider
                            height={100} 
                            image={[
                                {id:0,url:'/uploads/6e3a7e4e1f77abb3b060_20200904100225599.jpg'},
                                {id:1,url:'/uploads/59901fc0cb0b6526dee1_20200903153758446.jpg'}    
                            ]}
                            dotStyle={{position:'absolute'}}
                        /> 
                    </View>
                <View style={{marginVertical:40,width:'90%',alignItems:'center'}}>    
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
        </>
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
        display:'flex',
        flexDirection:'row',
        padding:5,
        borderWidth:2,
        borderColor:'#A897C2',
        borderRadius:3,
        marginTop:10,
    }
})

export default AltMainScreen